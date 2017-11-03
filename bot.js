"use strict"
const request = require('request');

class Bot {
    constructor() {

    }

    register(req, res) {
        const { query } = req;
        const mode = query['hub.mode'];
        const verifyToken = query['hub.verify_token'];
        const challenge = query['hub.challenge'];
        if (mode === 'subscribe' && verifyToken === 'myToken') {
            res.send(challenge);
        } else {
            res.status(403).end();
        }
    }

    handleMessage(req, res) {
        console.log('processing message');
        const data = req.body;
        if (data.object === 'page') {
            data.entry.forEach(page => {
                page.messaging.forEach(message => {
                    const senderId = message.sender.id;
                    const { text, nlp } = message.message;
                    if (nlp) {
                        const { entities } = nlp;
                        console.log(entities.greetings, entities.thanks, entities.bye, this.handleGreeting);
                        if (entities.bye && entities.bye.value) {
                            this.handleBye(senderId);
                        } else if (entities.greetings && entities.greetings[0].value) {
                            this.handleGreeting(senderId);
                        } else if (entities.thanks && entities.thanks.value) {
                            this.handleThanks(senderId);
                        }
                    }
                    // handle image!
                });
            })
        }
        res.sendStatus(200);
    }

    handleGreeting(senderId) {
        console.log('handle greeting');
        this.sendText(senderId, 'I am a bot. I recognize bird pictures. And tell you the name of the bird.')
        .catch(err => console.log(err));
    }

    handleBye(senderId) {
        this.sendText(senderId, 'Bye')
    }

    handleThanks(senderId) {
        this.sendText(senderId, 'You are welcome!');
    }

    sendText(id, text) {
        return new Promise((resolve, reject) => {
            request({
                uri: 'https://graph.facebook.com/2.6/me/messages',
                qs: {
                    access_token: 'EAACLmeHZAgT4BALSgsjv6ljZCPDtotZC08gPn6o9jEIvhyWHiN2FRZBGFtrWISnu1W7ZATnJnOXravhJEhRA3B3flHFJaAGXiBRUow1cZBq0mnHLdWZBInTiWwqDVRyqDRBZB36mkSzOx1HwcRhIfibT67Tsi46x8vI1pufgPH6QYAZDZD'
                },
                method: 'POST',
                json: {
                    recipient: {
                        id
                    },
                    message: {
                        text
                    }
                }  
            }, (error, response) => {
                if (!error && response.statusCode === 200) {
                    resolve();
                } else {
                    reject(error || response.statusCode);
                }
            });
        });
    }
}

module.exports = new Bot();
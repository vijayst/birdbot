"use strict"

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
                        console.log(entities.greetings, entities.thanks, entities.bye);
                        if (entities.bye && entities.bye.value) {
                            this.handleBye();
                        } else if (entities.greetings && entities.greetings.value) {
                            this.handleGreeting();
                        } else if (entities.thanks && entities.thanks.value) {
                            this.handleThanks();
                        }
                    }
                    // handle image!
                });
            })
        }
        res.sendStatus(200);
    }

    handleGreeting() {
        // send our standard message
    }

    handleBye() {

    }

    handleThanks() {

    }
}

module.exports = new Bot();
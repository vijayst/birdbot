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
        const data = req.body;
        if (data.object === 'page') {
            data.entry.forEach(page => {
                page.messaging.forEach(message => {
                    const senderId = message.sender.id;
                    const { text } = message.message;
                    console.log(senderId, message.message, text);
                });
            })
        }
        res.send(200);
    }
}

module.exports = new Bot();
const { EventEmitter } = require('events');

class SpamController extends EventEmitter {
    constructor() {
        super();
        this.messageDelay = 2000; // Default delay between messages in milliseconds
        this.lastMessageTime = 0;
    }

    setDelay(delay) {
        this.messageDelay = delay;
    }

    canSendMessage() {
        const currentTime = Date.now();
        return (currentTime - this.lastMessageTime) >= this.messageDelay;
    }

    sendMessage(message) {
        if (this.canSendMessage()) {
            this.lastMessageTime = Date.now();
            this.emit('message:sent', message);
            // Logic to send the message to the game log or chat
            console.log(`Message sent: ${message}`);
        } else {
            console.log('Message not sent due to spam control.');
        }
    }
}

module.exports = new SpamController();
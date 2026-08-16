const logger = require('../utils/logger');
const config = require('../utils/config');

class SpamController {
    constructor() {
        this.messageDelay = 1000; // Default delay between messages
        this.lastMessageTime = 0;
        this.messageQueue = [];
        this.isProcessing = false;
        this.messageCount = 0;
        this.bypassMode = false; // Enable bypass mechanisms
    }

    setDelay(delay) {
        this.messageDelay = delay;
        logger.info(`Spam control delay set to ${delay}ms`);
    }

    canSendMessage() {
        const currentTime = Date.now();
        const timeSinceLastMessage = currentTime - this.lastMessageTime;
        
        if (this.bypassMode) {
            // In bypass mode, reduce delay
            return timeSinceLastMessage >= (this.messageDelay * 0.5);
        }
        
        return timeSinceLastMessage >= this.messageDelay;
    }

    async sendMessage(message) {
        if (this.canSendMessage()) {
            this.lastMessageTime = Date.now();
            this.messageCount++;
            logger.info(`[SPAM] Message sent: ${message.substring(0, 50)}`);
            return { success: true, message, messageNumber: this.messageCount };
        } else {
            logger.warn('[SPAM] Message queued due to spam control');
            this.messageQueue.push(message);
            return { success: false, message, reason: 'Rate limited', queued: true };
        }
    }

    async queueAndSend(messages) {
        const results = [];
        
        for (const message of messages) {
            const result = await this.sendMessage(message);
            results.push(result);
            
            if (!result.success) {
                // Wait for the remaining delay
                const waitTime = this.messageDelay - (Date.now() - this.lastMessageTime);
                if (waitTime > 0) {
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            }
        }
        
        return results;
    }

    async processQueue() {
        if (this.isProcessing || this.messageQueue.length === 0) return;
        
        this.isProcessing = true;
        
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            
            // Wait for delay
            const timeSinceLastMessage = Date.now() - this.lastMessageTime;
            if (timeSinceLastMessage < this.messageDelay) {
                await new Promise(resolve => 
                    setTimeout(resolve, this.messageDelay - timeSinceLastMessage)
                );
            }
            
            this.lastMessageTime = Date.now();
            this.messageCount++;
            logger.info(`[SPAM] Queued message sent: ${message.substring(0, 50)}`);
        }
        
        this.isProcessing = false;
    }

    enableBypassMode() {
        this.bypassMode = true;
        logger.info('Spam control bypass mode enabled');
    }

    disableBypassMode() {
        this.bypassMode = false;
        logger.info('Spam control bypass mode disabled');
    }

    getStatus() {
        return {
            messageDelay: this.messageDelay,
            messageCount: this.messageCount,
            queueLength: this.messageQueue.length,
            bypassMode: this.bypassMode,
            isProcessing: this.isProcessing,
            lastMessageTime: this.lastMessageTime
        };
    }

    reset() {
        this.messageQueue = [];
        this.messageCount = 0;
        this.lastMessageTime = 0;
        this.isProcessing = false;
        logger.info('Spam controller reset');
    }
}

module.exports = new SpamController();
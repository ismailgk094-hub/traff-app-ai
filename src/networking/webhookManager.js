const axios = require('axios');
const logger = require('../utils/logger');
const config = require('../utils/config');

class WebhookManager {
    constructor() {
        this.webhooks = new Map();
        this.eventSubscribers = new Map();
    }

    addWebhook(url, events = []) {
        if (!this.webhooks.has(url)) {
            this.webhooks.set(url, {
                url,
                events: events || ['*'],
                createdAt: new Date(),
                lastTriggered: null,
                triggerCount: 0,
                failureCount: 0
            });
            logger.info(`Webhook added: ${url}`);
        }
    }

    removeWebhook(url) {
        if (this.webhooks.has(url)) {
            this.webhooks.delete(url);
            logger.info(`Webhook removed: ${url}`);
        }
    }

    async triggerWebhook(eventName, data) {
        const payload = {
            event: eventName,
            data,
            timestamp: new Date()
        };

        const promises = [];

        for (const [url, webhookData] of this.webhooks.entries()) {
            // Check if webhook should be triggered for this event
            if (webhookData.events.includes('*') || webhookData.events.includes(eventName)) {
                promises.push(this.sendWebhookWithRetry(url, payload, webhookData));
            }
        }

        await Promise.all(promises);
    }

    async sendWebhookWithRetry(url, payload, webhookData) {
        for (let attempt = 0; attempt < config.webhookRetryAttempts; attempt++) {
            try {
                const response = await axios.post(url, payload, {
                    timeout: config.webhookTimeout,
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'NodeFlow-Webhook/1.0'
                    }
                });

                webhookData.lastTriggered = new Date();
                webhookData.triggerCount++;
                logger.info(`Webhook triggered successfully: ${url}`);
                return true;
            } catch (error) {
                if (attempt < config.webhookRetryAttempts - 1) {
                    const delay = Math.pow(2, attempt) * 1000;
                    logger.warn(`Webhook attempt ${attempt + 1} failed for ${url}, retrying in ${delay}ms`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    webhookData.failureCount++;
                    logger.error(`Webhook failed after ${config.webhookRetryAttempts} attempts: ${url}`);
                    return false;
                }
            }
        }
    }

    subscribe(eventName, callback) {
        if (!this.eventSubscribers.has(eventName)) {
            this.eventSubscribers.set(eventName, []);
        }
        this.eventSubscribers.get(eventName).push(callback);
    }

    unsubscribe(eventName, callback) {
        if (this.eventSubscribers.has(eventName)) {
            const callbacks = this.eventSubscribers.get(eventName);
            this.eventSubscribers.set(eventName, callbacks.filter(cb => cb !== callback));
        }
    }

    async emit(eventName, data) {
        // Trigger webhooks
        await this.triggerWebhook(eventName, data);

        // Trigger local event subscribers
        if (this.eventSubscribers.has(eventName)) {
            const callbacks = this.eventSubscribers.get(eventName);
            for (const callback of callbacks) {
                try {
                    callback(data);
                } catch (error) {
                    logger.error(`Error in webhook subscriber: ${error.message}`);
                }
            }
        }
    }

    getWebhooks() {
        return Array.from(this.webhooks.values());
    }

    getWebhookStats() {
        const webhooks = this.getWebhooks();
        return {
            totalWebhooks: webhooks.length,
            totalTriggered: webhooks.reduce((sum, w) => sum + w.triggerCount, 0),
            totalFailures: webhooks.reduce((sum, w) => sum + w.failureCount, 0),
            webhooks
        };
    }

    clearWebhooks() {
        this.webhooks.clear();
        logger.info('All webhooks cleared');
    }
}

module.exports = new WebhookManager();
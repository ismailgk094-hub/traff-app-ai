const axios = require('axios');

class WebhookManager {
    constructor() {
        this.webhooks = [];
    }

    addWebhook(url) {
        this.webhooks.push(url);
    }

    removeWebhook(url) {
        this.webhooks = this.webhooks.filter(webhook => webhook !== url);
    }

    async triggerWebhook(event, data) {
        const payload = {
            event,
            data,
        };

        const promises = this.webhooks.map(url => axios.post(url, payload).catch(err => {
            console.error(`Failed to send webhook to ${url}:`, err.message);
        }));

        await Promise.all(promises);
    }
}

module.exports = new WebhookManager();
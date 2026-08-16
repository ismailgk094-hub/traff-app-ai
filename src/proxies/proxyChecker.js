const axios = require('axios');
const logger = require('../utils/logger');
const config = require('../utils/config');

class ProxyChecker {
    constructor() {
        this.checkResults = new Map();
        this.isChecking = false;
    }

    async checkProxy(proxy) {
        try {
            const [host, port] = proxy.split(':');
            
            // Create a simple test request through the proxy
            const agent = new (require('http').Agent)({ 
                host, 
                port: parseInt(port) 
            });

            const response = await axios.get('http://httpbin.org/ip', {
                httpAgent: agent,
                timeout: config.proxyTimeout,
                validateStatus: () => true
            });

            const result = {
                proxy,
                status: response.status === 200 ? 'active' : 'inactive',
                responseTime: response.headers['x-response-time'] || 'unknown',
                lastChecked: new Date(),
                statusCode: response.status
            };

            this.checkResults.set(proxy, result);
            logger.info(`Proxy ${proxy} check: ${result.status}`);
            return result;
        } catch (error) {
            const result = {
                proxy,
                status: 'inactive',
                error: error.message,
                lastChecked: new Date()
            };

            this.checkResults.set(proxy, result);
            logger.warn(`Proxy ${proxy} check failed: ${error.message}`);
            return result;
        }
    }

    async checkMultipleProxies(proxies) {
        this.isChecking = true;
        const results = [];

        for (const proxy of proxies) {
            const result = await this.checkProxy(proxy);
            results.push(result);
        }

        this.isChecking = false;
        return results;
    }

    getCheckResult(proxy) {
        return this.checkResults.get(proxy);
    }

    getAllCheckResults() {
        return Array.from(this.checkResults.values());
    }

    clearCheckResults() {
        this.checkResults.clear();
    }

    getActiveProxies() {
        const results = this.getAllCheckResults();
        return results.filter(r => r.status === 'active').map(r => r.proxy);
    }

    getInactiveProxies() {
        const results = this.getAllCheckResults();
        return results.filter(r => r.status === 'inactive').map(r => r.proxy);
    }
}

module.exports = new ProxyChecker();
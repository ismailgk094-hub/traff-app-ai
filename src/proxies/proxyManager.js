const fs = require('fs');

class ProxyManager {
    constructor() {
        this.proxies = [];
    }

    loadProxies(filePath) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            this.proxies = data.split('\n').filter(line => line.trim() !== '');
        } catch (error) {
            console.error('Error loading proxies:', error);
        }
    }

    getProxy() {
        if (this.proxies.length === 0) {
            console.warn('No proxies available');
            return null;
        }
        const randomIndex = Math.floor(Math.random() * this.proxies.length);
        return this.proxies[randomIndex];
    }

    checkProxy(proxy) {
        // Implement proxy checking logic here
        // This could involve making a request through the proxy and checking the response
    }

    assignProxyToVehicle(vehicle) {
        const proxy = this.getProxy();
        if (proxy) {
            vehicle.setProxy(proxy);
        }
    }
}

module.exports = new ProxyManager();
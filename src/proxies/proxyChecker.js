const dns = require('dns');
const http = require('http');
const https = require('https');

class ProxyChecker {
    constructor(proxyList) {
        this.proxyList = proxyList;
    }

    checkProxy(proxy) {
        return new Promise((resolve, reject) => {
            const [host, port] = proxy.split(':');
            const options = {
                hostname: host,
                port: port,
                method: 'GET',
                timeout: 2000
            };

            const protocol = port === '443' ? https : http;

            const req = protocol.request(options, (res) => {
                if (res.statusCode === 200) {
                    resolve({ proxy, status: 'working' });
                } else {
                    resolve({ proxy, status: 'not working' });
                }
            });

            req.on('error', () => {
                resolve({ proxy, status: 'not working' });
            });

            req.end();
        });
    }

    async checkAllProxies() {
        const results = await Promise.all(this.proxyList.map(proxy => this.checkProxy(proxy)));
        return results;
    }
}

module.exports = ProxyChecker;
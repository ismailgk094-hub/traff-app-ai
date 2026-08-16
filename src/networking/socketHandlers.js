const WebSocket = require('ws');

class SocketHandlers {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.clients = new Set();

        this.wss.on('connection', (ws) => {
            this.handleConnection(ws);
        });
    }

    handleConnection(ws) {
        this.clients.add(ws);
        ws.on('message', (message) => this.handleMessage(ws, message));
        ws.on('close', () => this.handleDisconnect(ws));
    }

    handleMessage(ws, message) {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'join':
                this.handleJoin(ws, data);
                break;
            case 'action':
                this.handleAction(data);
                break;
            // Add more message types as needed
            default:
                console.error('Unknown message type:', data.type);
        }
    }

    handleJoin(ws, data) {
        ws.username = data.username;
        this.broadcast({ type: 'userJoined', username: data.username });
    }

    handleAction(data) {
        // Handle game actions here
        this.broadcast(data);
    }

    handleDisconnect(ws) {
        this.clients.delete(ws);
        this.broadcast({ type: 'userLeft', username: ws.username });
    }

    broadcast(data) {
        const message = JSON.stringify(data);
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
}

module.exports = SocketHandlers;
const logger = require('../utils/logger');
const gameState = require('../game/gameState');

class SocketHandlers {
    constructor() {
        this.clients = new Map();
    }

    handleConnection(socket, io) {
        const playerId = socket.id;
        this.clients.set(playerId, {
            socket,
            username: null,
            vehicleIds: [],
            isAlive: true
        });

        logger.info(`Player connected: ${playerId}`);

        // Send initial game state
        socket.emit('game:sync', gameState.getState());

        // Handle player join
        socket.on('player:join', (data) => this.handlePlayerJoin(socket, io, data));
        socket.on('player:action', (data) => this.handlePlayerAction(socket, io, data));
        socket.on('vehicle:update', (data) => this.handleVehicleUpdate(socket, io, data));
        socket.on('script:run', (data) => this.handleScriptRun(socket, io, data));
        socket.on('script:stop', () => this.handleScriptStop(socket, io));
        socket.on('chat:message', (data) => this.handleChatMessage(socket, io, data));
    }

    handleDisconnection(socket, io) {
        const playerId = socket.id;
        const client = this.clients.get(playerId);

        if (client) {
            logger.info(`Player disconnected: ${playerId}`);
            
            // Remove player's vehicles from game state
            for (const vehicleId of client.vehicleIds) {
                gameState.removeVehicle(vehicleId);
            }

            this.clients.delete(playerId);
            io.emit('player:disconnected', { playerId, username: client.username });
        }
    }

    handlePlayerJoin(socket, io, data) {
        const { username } = data;
        const playerId = socket.id;
        const client = this.clients.get(playerId);

        if (client) {
            client.username = username;
            logger.info(`${username} joined the game`);
            io.emit('player:joined', { playerId, username });
            socket.emit('join:success', { playerId, username });
        }
    }

    handlePlayerAction(socket, io, data) {
        const { action, payload } = data;
        const playerId = socket.id;
        const client = this.clients.get(playerId);

        if (!client) return;

        logger.debug(`Action from ${client.username}: ${action}`);

        switch (action) {
            case 'spawn_vehicle':
                this.spawnVehicle(socket, io, client, payload);
                break;
            case 'remove_vehicle':
                this.removeVehicle(socket, io, client, payload);
                break;
            case 'place_traffic_light':
                this.placeTrafficLight(socket, io, client, payload);
                break;
            default:
                logger.warn(`Unknown action: ${action}`);
        }
    }

    handleVehicleUpdate(socket, io, data) {
        const { vehicleId, position, speed } = data;
        const vehicle = gameState.vehicles.get(vehicleId);

        if (vehicle) {
            vehicle.position = position;
            vehicle.speed = speed;
            io.emit('vehicle:update', { vehicleId, position, speed });
        }
    }

    handleScriptRun(socket, io, data) {
        const { scriptName, scriptContent } = data;
        logger.info(`Script execution requested: ${scriptName}`);
        socket.emit('script:start', { scriptName });
    }

    handleScriptStop(socket, io) {
        logger.info('Script execution stopped');
        socket.emit('script:stop');
    }

    handleChatMessage(socket, io, data) {
        const { message } = data;
        const playerId = socket.id;
        const client = this.clients.get(playerId);

        if (client) {
            const chatData = {
                username: client.username,
                message,
                timestamp: new Date()
            };
            logger.info(`[CHAT] ${client.username}: ${message}`);
            io.emit('chat:message', chatData);
        }
    }

    spawnVehicle(socket, io, client, payload) {
        const { type, position } = payload;
        const Vehicle = require('../simulation/vehicle');
        const vehicleId = `vehicle_${client.username}_${Date.now()}`;
        
        const vehicle = new Vehicle(vehicleId, type, position);
        gameState.addVehicle(vehicleId, vehicle);
        client.vehicleIds.push(vehicleId);

        logger.info(`Vehicle spawned: ${vehicleId}`);
        io.emit('vehicle:spawned', { vehicleId, vehicle: vehicle.getStatus() });
    }

    removeVehicle(socket, io, client, payload) {
        const { vehicleId } = payload;
        gameState.removeVehicle(vehicleId);
        client.vehicleIds = client.vehicleIds.filter(id => id !== vehicleId);

        logger.info(`Vehicle removed: ${vehicleId}`);
        io.emit('vehicle:removed', { vehicleId });
    }

    placeTrafficLight(socket, io, client, payload) {
        const { position, id } = payload;
        const trafficLight = {
            id: id || `light_${Date.now()}`,
            position,
            state: 'red',
            createdBy: client.username
        };

        gameState.trafficLights.set(trafficLight.id, trafficLight);
        logger.info(`Traffic light placed: ${trafficLight.id}`);
        io.emit('trafficlight:placed', { trafficLight });
    }

    getClientCount() {
        return this.clients.size;
    }

    getPlayers() {
        const players = [];
        this.clients.forEach((client) => {
            players.push({
                id: client.socket.id,
                username: client.username,
                vehicleCount: client.vehicleIds.length
            });
        });
        return players;
    }
}

module.exports = new SocketHandlers();
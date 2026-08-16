const logger = require('../utils/logger');
const config = require('../utils/config');

class AutoReconnect {
    constructor() {
        this.isActive = false;
        this.reconnectInterval = 30000; // Retry every 30 seconds
        this.maxRetries = 5;
        this.vehicles = new Map();
        this.intervalId = null;
        this.reconnectAttempts = new Map();
    }

    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        logger.info('Auto-reconnect started');

        this.intervalId = setInterval(() => {
            if (this.isActive) {
                this.processReconnects();
            }
        }, this.reconnectInterval);
    }

    stop() {
        if (!this.isActive) return;
        
        this.isActive = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        logger.info('Auto-reconnect stopped');
    }

    registerVehicle(vehicleId, vehicle) {
        this.vehicles.set(vehicleId, {
            vehicle,
            disconnectedAt: null,
            isDisconnected: false,
            reconnectAttempts: 0
        });
    }

    unregisterVehicle(vehicleId) {
        this.vehicles.delete(vehicleId);
        this.reconnectAttempts.delete(vehicleId);
    }

    markDisconnected(vehicleId) {
        const entry = this.vehicles.get(vehicleId);
        if (entry) {
            entry.isDisconnected = true;
            entry.disconnectedAt = new Date();
            logger.info(`Vehicle ${vehicleId} marked as disconnected`);
        }
    }

    async reconnectVehicle(vehicleId) {
        const entry = this.vehicles.get(vehicleId);
        if (!entry || !entry.isDisconnected) return false;

        const attempts = this.reconnectAttempts.get(vehicleId) || 0;
        
        if (attempts >= this.maxRetries) {
            logger.warn(`Max reconnect attempts reached for ${vehicleId}`);
            this.unregisterVehicle(vehicleId);
            return false;
        }

        try {
            // Simulate reconnection attempt
            logger.info(`[Attempt ${attempts + 1}/${this.maxRetries}] Reconnecting ${vehicleId}`);
            
            // In a real scenario, this would attempt to reconnect
            entry.isDisconnected = false;
            entry.reconnectAttempts = attempts + 1;
            this.reconnectAttempts.set(vehicleId, attempts + 1);
            
            logger.info(`Vehicle ${vehicleId} reconnected successfully`);
            return true;
        } catch (error) {
            logger.error(`Reconnection failed for ${vehicleId}: ${error.message}`);
            this.reconnectAttempts.set(vehicleId, attempts + 1);
            return false;
        }
    }

    async processReconnects() {
        const disconnectedVehicles = Array.from(this.vehicles.entries())
            .filter(([_, entry]) => entry.isDisconnected);

        for (const [vehicleId] of disconnectedVehicles) {
            await this.reconnectVehicle(vehicleId);
        }
    }

    setReconnectInterval(interval) {
        this.reconnectInterval = interval;
        
        if (this.isActive) {
            clearInterval(this.intervalId);
            this.intervalId = setInterval(() => {
                if (this.isActive) {
                    this.processReconnects();
                }
            }, this.reconnectInterval);
        }
        
        logger.info(`Auto-reconnect interval set to ${interval}ms`);
    }

    setMaxRetries(maxRetries) {
        this.maxRetries = maxRetries;
        logger.info(`Auto-reconnect max retries set to ${maxRetries}`);
    }

    getStatus() {
        const disconnectedCount = Array.from(this.vehicles.values())
            .filter(entry => entry.isDisconnected).length;

        return {
            isActive: this.isActive,
            reconnectInterval: this.reconnectInterval,
            maxRetries: this.maxRetries,
            totalVehicles: this.vehicles.size,
            disconnectedVehicles: disconnectedCount,
            vehicles: Array.from(this.vehicles.entries()).map(([id, entry]) => ({
                id,
                isDisconnected: entry.isDisconnected,
                reconnectAttempts: entry.reconnectAttempts,
                disconnectedAt: entry.disconnectedAt
            }))
        };
    }

    reconnectAll() {
        logger.info('Reconnecting all disconnected vehicles');
        
        for (const [vehicleId] of this.vehicles.entries()) {
            this.reconnectVehicle(vehicleId);
        }
    }
}

module.exports = new AutoReconnect();
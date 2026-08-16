const logger = require('../utils/logger');
const config = require('../utils/config');

class AntiAFK {
    constructor(vehicle) {
        this.vehicle = vehicle;
        this.isActive = false;
        this.movementInterval = null;
        this.lastActionTime = new Date();
        this.actionCount = 0;
    }

    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.lastActionTime = new Date();
        logger.info(`Anti-AFK started for vehicle: ${this.vehicle.id}`);

        this.movementInterval = setInterval(() => {
            if (this.isActive) {
                this.randomMovement();
            }
        }, this.getRandomInterval());
    }

    stop() {
        if (!this.isActive) return;
        
        this.isActive = false;
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
            this.movementInterval = null;
        }
        logger.info(`Anti-AFK stopped for vehicle: ${this.vehicle.id}`);
    }

    randomMovement() {
        const directions = ['forward', 'backward', 'left', 'right'];
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        
        // Perform random action
        const actions = [
            () => this.vehicle.move(randomDirection),
            () => this.vehicle.changeSpeed(Math.random() * this.vehicle.maxSpeed),
            () => this.performRandomAction()
        ];

        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        randomAction();

        this.lastActionTime = new Date();
        this.actionCount++;
        logger.debug(`Anti-AFK action #${this.actionCount} on vehicle ${this.vehicle.id}`);
    }

    performRandomAction() {
        // Simulate random game actions
        const randomActions = ['chat "AFK Check"', 'useHeld', 'setHotbar 0'];
        // In a real scenario, this would trigger actual game actions
    }

    getRandomInterval() {
        return Math.floor(Math.random() * (config.afkCheckInterval - 2000 + 1)) + 2000;
    }

    getStatus() {
        return {
            vehicleId: this.vehicle.id,
            isActive: this.isActive,
            lastActionTime: this.lastActionTime,
            actionCount: this.actionCount
        };
    }
}

module.exports = AntiAFK;
const logger = require('../utils/logger');

class Killaura {
    constructor(vehicle) {
        this.vehicle = vehicle;
        this.target = null;
        this.range = 50; // Attack range in pixels
        this.attackSpeed = 500; // Attack interval in milliseconds
        this.isActive = false;
        this.whitelist = []; // Vehicles to ignore
        this.attackCount = 0;
        this.lastAttackTime = null;
        this.attackInterval = null;
    }

    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        logger.info(`Killaura started for vehicle: ${this.vehicle.id}`);

        this.attackInterval = setInterval(() => {
            if (this.isActive) {
                this.update();
            }
        }, this.attackSpeed);
    }

    stop() {
        if (!this.isActive) return;
        
        this.isActive = false;
        if (this.attackInterval) {
            clearInterval(this.attackInterval);
            this.attackInterval = null;
        }
        this.target = null;
        logger.info(`Killaura stopped for vehicle: ${this.vehicle.id}`);
    }

    setTarget(vehicle) {
        if (vehicle && !this.whitelist.includes(vehicle.id)) {
            this.target = vehicle;
            logger.debug(`Killaura target acquired: ${vehicle.id}`);
        }
    }

    clearTarget() {
        this.target = null;
    }

    isTargetValid(vehicle) {
        if (!vehicle) return false;
        if (this.whitelist.includes(vehicle.id)) return false;
        
        // Check if target is within range
        const distance = this.calculateDistance(this.vehicle.position, vehicle.position);
        return distance <= this.range;
    }

    calculateDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    update() {
        // Find nearest problematic vehicle
        const nearbyVehicles = this.findNearbyVehicles();
        
        if (nearbyVehicles.length > 0) {
            const nearest = nearbyVehicles[0];
            this.setTarget(nearest);
            this.attack();
        } else {
            this.clearTarget();
        }
    }

    findNearbyVehicles() {
        // This would normally get vehicles from gameState
        // For now, returning empty array
        // In real implementation: get from gameState.vehicles
        return [];
    }

    attack() {
        if (this.target && this.isTargetValid(this.target)) {
            this.target.takeDamage(10);
            this.attackCount++;
            this.lastAttackTime = new Date();
            logger.debug(`Killaura attack on ${this.target.id} (Total: ${this.attackCount})`);
        }
    }

    addToWhitelist(vehicleId) {
        if (!this.whitelist.includes(vehicleId)) {
            this.whitelist.push(vehicleId);
            logger.info(`${vehicleId} added to Killaura whitelist`);
        }
    }

    removeFromWhitelist(vehicleId) {
        this.whitelist = this.whitelist.filter(id => id !== vehicleId);
        logger.info(`${vehicleId} removed from Killaura whitelist`);
    }

    setRange(range) {
        this.range = range;
        logger.info(`Killaura range set to ${range}`);
    }

    setAttackSpeed(speed) {
        this.attackSpeed = speed;
        
        if (this.isActive) {
            clearInterval(this.attackInterval);
            this.attackInterval = setInterval(() => {
                if (this.isActive) {
                    this.update();
                }
            }, this.attackSpeed);
        }
        logger.info(`Killaura attack speed set to ${speed}ms`);
    }

    getStatus() {
        return {
            vehicleId: this.vehicle.id,
            isActive: this.isActive,
            target: this.target ? this.target.id : null,
            range: this.range,
            attackCount: this.attackCount,
            lastAttackTime: this.lastAttackTime,
            whitelistCount: this.whitelist.length
        };
    }
}

module.exports = Killaura;
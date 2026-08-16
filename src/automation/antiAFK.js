const AntiAFK = class {
    constructor(vehicle) {
        this.vehicle = vehicle;
        this.isActive = false;
        this.movementInterval = null;
    }

    start() {
        if (this.isActive) return;
        this.isActive = true;
        this.movementInterval = setInterval(() => {
            this.randomMovement();
        }, this.getRandomInterval());
    }

    stop() {
        if (!this.isActive) return;
        this.isActive = false;
        clearInterval(this.movementInterval);
        this.movementInterval = null;
    }

    randomMovement() {
        const directions = ['forward', 'backward', 'left', 'right'];
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        this.vehicle.move(randomDirection);
    }

    getRandomInterval() {
        return Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000; // Random interval between 2s and 5s
    }
};

module.exports = AntiAFK;
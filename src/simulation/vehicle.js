class Vehicle {
    constructor(id, type = 'car', position = { x: 0, y: 0 }) {
        this.id = id;
        this.type = type; // 'car', 'truck', 'bus', 'emergency'
        this.position = position;
        this.speed = 0; // pixels per second
        this.maxSpeed = this.getMaxSpeedForType(type);
        this.isMoving = false;
        this.direction = 0; // in degrees
        this.acceleration = 0.5;
        this.isAFKEnabled = false;
        this.health = 100;
        this.proxy = null;
        this.createdAt = new Date();
        this.lastUpdate = new Date();
    }

    getMaxSpeedForType(type) {
        const speeds = {
            'car': 150,
            'truck': 100,
            'bus': 120,
            'emergency': 200
        };
        return speeds[type] || 150;
    }

    start() {
        this.isMoving = true;
        this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
    }

    stop() {
        this.isMoving = false;
        this.speed = Math.max(0, this.speed - this.acceleration * 2);
    }

    move(direction) {
        // direction: 'forward', 'backward', 'left', 'right'
        const directionMap = {
            'forward': 0,
            'right': 90,
            'backward': 180,
            'left': 270
        };

        if (directionMap.hasOwnProperty(direction)) {
            this.direction = directionMap[direction];
            this.start();
        }
    }

    updatePosition(deltaTime = 0.016) {
        if (this.isMoving && this.speed > 0) {
            const radians = (this.direction * Math.PI) / 180;
            this.position.x += Math.cos(radians) * this.speed * deltaTime;
            this.position.y += Math.sin(radians) * this.speed * deltaTime;
            this.lastUpdate = new Date();
        }
    }

    changeSpeed(newSpeed) {
        this.speed = Math.min(newSpeed, this.maxSpeed);
    }

    setProxy(proxy) {
        this.proxy = proxy;
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
    }

    enableAFK() {
        this.isAFKEnabled = true;
    }

    disableAFK() {
        this.isAFKEnabled = false;
    }

    getStatus() {
        return {
            id: this.id,
            type: this.type,
            position: this.position,
            speed: this.speed,
            maxSpeed: this.maxSpeed,
            isMoving: this.isMoving,
            direction: this.direction,
            health: this.health,
            isAFKEnabled: this.isAFKEnabled,
            proxy: this.proxy,
            createdAt: this.createdAt,
            lastUpdate: this.lastUpdate
        };
    }

    toJSON() {
        return this.getStatus();
    }
}

module.exports = Vehicle;
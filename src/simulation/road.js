class Road {
    constructor() {
        this.lanes = [];
        this.speedLimit = 60; // Default speed limit in km/h
        this.connections = []; // Connections to other roads or intersections
    }

    addLane(lane) {
        this.lanes.push(lane);
    }

    setSpeedLimit(limit) {
        this.speedLimit = limit;
    }

    connectTo(road) {
        this.connections.push(road);
    }

    getLaneCount() {
        return this.lanes.length;
    }

    getSpeedLimit() {
        return this.speedLimit;
    }

    getConnections() {
        return this.connections;
    }
}

module.exports = Road;
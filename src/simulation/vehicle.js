class Vehicle {
    constructor(id, type, speed, position) {
        this.id = id; // Unique identifier for the vehicle
        this.type = type; // Type of vehicle (e.g., car, truck, bus)
        this.speed = speed; // Current speed of the vehicle
        this.position = position; // Current position of the vehicle on the road
        this.isMoving = false; // Indicates if the vehicle is currently moving
    }

    start() {
        this.isMoving = true; // Set the vehicle to moving state
    }

    stop() {
        this.isMoving = false; // Set the vehicle to stopped state
    }

    updatePosition(newPosition) {
        this.position = newPosition; // Update the vehicle's position
    }

    changeSpeed(newSpeed) {
        this.speed = newSpeed; // Change the vehicle's speed
    }

    getStatus() {
        return {
            id: this.id,
            type: this.type,
            speed: this.speed,
            position: this.position,
            isMoving: this.isMoving
        }; // Return the current status of the vehicle
    }
}

export default Vehicle;
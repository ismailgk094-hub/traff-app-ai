class Intersection {
    constructor() {
        this.trafficLights = [];
        this.vehiclesWaiting = [];
    }

    addTrafficLight(trafficLight) {
        this.trafficLights.push(trafficLight);
    }

    removeTrafficLight(trafficLight) {
        this.trafficLights = this.trafficLights.filter(light => light !== trafficLight);
    }

    updateTrafficFlow() {
        this.trafficLights.forEach(light => {
            light.updateState();
            this.manageVehicleFlow(light);
        });
    }

    manageVehicleFlow(trafficLight) {
        if (trafficLight.isGreen()) {
            this.vehiclesWaiting.forEach(vehicle => {
                if (this.canProceed(vehicle)) {
                    vehicle.move();
                }
            });
        }
    }

    canProceed(vehicle) {
        // Logic to determine if the vehicle can proceed based on its position and the intersection rules
        return true; // Placeholder for actual logic
    }

    addVehicle(vehicle) {
        this.vehiclesWaiting.push(vehicle);
    }

    removeVehicle(vehicle) {
        this.vehiclesWaiting = this.vehiclesWaiting.filter(v => v !== vehicle);
    }
}

export default Intersection;
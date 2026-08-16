class TrafficLight {
    constructor() {
        this.state = 'red'; // Initial state of the traffic light
        this.timer = 0; // Timer for light duration
        this.greenDuration = 30; // Duration for green light in seconds
        this.redDuration = 30; // Duration for red light in seconds
    }

    // Method to change the state of the traffic light
    changeState() {
        if (this.state === 'red') {
            this.state = 'green';
            this.timer = this.greenDuration;
        } else {
            this.state = 'red';
            this.timer = this.redDuration;
        }
    }

    // Method to update the traffic light timer
    update() {
        if (this.timer > 0) {
            this.timer--;
        } else {
            this.changeState();
        }
    }

    // Method to get the current state of the traffic light
    getState() {
        return this.state;
    }

    // Method to set custom durations for the traffic light
    setDurations(green, red) {
        this.greenDuration = green;
        this.redDuration = red;
    }
}

export default TrafficLight;
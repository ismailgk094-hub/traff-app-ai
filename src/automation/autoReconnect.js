const autoReconnect = {
    reconnectVehicles: function(vehicles) {
        vehicles.forEach(vehicle => {
            if (vehicle.isDisconnected) {
                this.reconnectVehicle(vehicle);
            }
        });
    },

    reconnectVehicle: function(vehicle) {
        // Logic to reconnect the vehicle
        vehicle.isDisconnected = false;
        console.log(`Vehicle ${vehicle.id} reconnected.`);
    },

    startAutoReconnect: function(vehicles, interval) {
        setInterval(() => {
            this.reconnectVehicles(vehicles);
        }, interval);
    }
};

module.exports = autoReconnect;
"use strict";
var TelldusAccessory = require('./telldus-accessory.js');
var telldus = require('telldus');


module.exports = class TelldusSwitch extends TelldusAccessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        var timer = null;
        var service = new this.Service.MotionSensor(this.name);
        var characteristic = service.getCharacteristic(this.Characteristic.MotionDetected);

        characteristic.on('get', (callback) => {
            callback(null, this.device.state == 'ON');
        });

        this.device.on('change', () => {
            this.log('Motion detected');

            // Clear previous timer
            if (timer != null)
                clearTimeout(timer);

            // Indicate movement
            characteristic.updateValue(true, null, 'updateState');

            timer = setTimeout(() => {
                // Turn off movement
                characteristic.updateValue(false, null, 'updateState');

            }, 5000);
        });
    }


    getServices() {
        var services = super.getServices();
        services.push(this.service);
        return services;

    }

};

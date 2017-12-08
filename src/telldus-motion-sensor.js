"use strict";
var TelldusAccessory = require('./telldus-accessory.js');
var telldus = require('telldus');


module.exports = class TelldusSwitch extends TelldusAccessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        this.service = new this.Service.MotionSensor(this.name);

        var timer = null;
        var service = this.service;
        var state = false;
        var characteristic = service.getCharacteristic(this.Characteristic.MotionDetected);

        characteristic.on('get', (callback) => {
            callback(null, state);
        });

        this.device.on('change', () => {
            this.log('Motion detected');

            // Clear previous timer
            if (timer != null)
                clearTimeout(timer);

            // Indicate movement
            this.log('Triggering movement.');
            state = true;
            characteristic.updateValue(state);

            timer = setTimeout(() => {
                this.log('Resetting movement.');

                // Turn off movement
                state = false;
                characteristic.updateValue(state);

            }, 5000);
        });
    }


    getServices() {
        var services = super.getServices();
        services.push(this.service);
        return services;

    }

};

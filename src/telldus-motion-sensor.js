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
        var duration = this.config.triggerLength ? this.config.triggerLength : 5;
        var characteristic = service.getCharacteristic(this.Characteristic.MotionDetected);

        characteristic.on('get', (callback) => {
            callback(null, state);
            callback(null, Boolean(MOTION_SENSOR.motionDetected));
        });

        this.device.on('change', () => {

            // Clear previous timer
            if (timer != null)
                clearTimeout(timer);

            setTimeout(() => {
                // Indicate movement
                this.log('Triggering movement.');
                state = true;
                characteristic.updateValue(state);

                timer = setTimeout(() => {
                    this.log('Resetting movement.');

                    // Turn off movement
                    state = false;
                    characteristic.updateValue(state);

                }, duration * 1000);
                
            }, 100);
        });
    }


    getServices() {
        var services = super.getServices();
        services.push(this.service);
        return services;

    }

};

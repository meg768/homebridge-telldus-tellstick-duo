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
        var busy = false;

        characteristic.on('get', (callback) => {
            callback(null, Boolean(state));
        });

        this.device.on('change', () => {

            if (!busy) {
                busy = true;

                // Indicate movement
                this.log('Triggering movement.');
                state = true;
                characteristic.updateValue(state);

                // Clear previous timer
                if (timer != null)
                    clearTimeout(timer);

                timer = setTimeout(() => {
                    this.log('Resetting movement.');

                    // Turn off movement
                    state = false;
                    characteristic.updateValue(state);

                }, duration * 1000);

                busy = false;

            }
            else {
                this.log('Upps! Busy!');
            }
        });
    }


    getServices() {
        var services = super.getServices();
        services.push(this.service);
        return services;

    }

};

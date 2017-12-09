"use strict";
var TelldusAccessory = require('./telldus-accessory.js');
var telldus = require('telldus');
var Timer = require('./timer.js');

module.exports = class TelldusSwitch extends TelldusAccessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        this.service = new this.Service.MotionSensor(this.name);

        var timer = new Timer();
        var service = this.service;
        var state = false;
        var timeout = this.config.timeout ? this.config.timeout : 5;
        var characteristic = service.getCharacteristic(this.Characteristic.MotionDetected);
        var busy = false;

        characteristic.on('get', (callback) => {
            callback(null, Boolean(state));
        });

        this.device.on('change', () => {

            // Indicate movement
            this.log('Movement detected by sensor', this.name);

            state = true;
            characteristic.updateValue(state);

            timer.cancel();

            timer.setTimer(timeout * 1000, () => {
                this.log('Resetting movement for sensor', this.name);

                // Turn off movement
                state = false;
                characteristic.updateValue(state);

            });

        });
    }


    getServices() {
        var services = super.getServices();
        services.push(this.service);
        return services;

    }

};

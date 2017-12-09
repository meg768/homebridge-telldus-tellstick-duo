"use strict";
var TelldusAccessory = require('./telldus-accessory.js');
var telldus = require('telldus');
var Timer = require('./timer.js');

module.exports = class TelldusOccupancySensor extends TelldusAccessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        this.service = new this.Service.OccupancySensor(this.name);

        var timer = new Timer();
        var service = this.service;
        var state = false;
        var timeout = this.config.timeout ? this.config.timeout : 30;
        var characteristic = service.getCharacteristic(this.Characteristic.OccupancyDetected);

        characteristic.on('get', (callback) => {
            callback(null, Boolean(state));
        });

        this.device.on('change', () => {

            setTimeout(() => {
                this.log('Movement detected on occupancy sensor', this.name);

                timer.cancel();
                characteristic.updateValue(state = true);

                timer.setTimer(timeout * 60 * 1000, () => {
                    this.log('Resetting movement for occupancy sensor', this.name);
                    characteristic.updateValue(state = false);
                });

            }, 200);
        });
    }


    getServices() {
        var services = super.getServices();
        services.push(this.service);
        return services;

    }

};

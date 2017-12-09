"use strict";
var TelldusAccessory = require('./telldus-accessory.js');
var telldus = require('telldus');
var Timer = require('./timer.js');

module.exports = class TelldusSwitch extends TelldusAccessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        this.service = new this.Service.OccupancySensor(this.name);

        var timer = new Timer();
        var service = this.service;
        var state = false;
        var timeout = this.config.timeout ? this.config.timeout : 10;
        var characteristic = service.getCharacteristic(this.Characteristic.OccupancyDetected);
        var busy = false;

        characteristic.on('get', (callback) => {
            callback(null, Boolean(state));
        });

        this.device.on('change', () => {

            timer.cancel();

            state = true;
            characteristic.updateValue(state);

            timer.setTimer(timeout * 60 * 1000, () => {
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

"use strict";
var TelldusAccessory = require('./telldus-accessory.js');
var telldus = require('telldus');


module.exports = class TelldusDoorbell extends TelldusAccessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        this.log('**************************************');
        this.service = new this.Service.Doorbell(this.name);

        var timer = null;
        var service = this.service;
        var state = false;
        var duration = this.config.triggerLength ? this.config.triggerLength : 5;
        var characteristic = service.getCharacteristic(this.Characteristic.ProgrammableSwitchEvent);

        characteristic.on('get', (callback) => {
            this.log('**************************************');
            callback(null, Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS);
        });

        this.device.on('change', () => {

            this.log('Doorbell pressed.');
            characteristic.updateValue(Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS);

        });
    }


    getServices() {
        var services = super.getServices();
        services.push(this.service);
        return services;

    }

};

"use strict";

var Events  = require('events');

module.exports = class TelldusAccessory extends Events {

    constructor(platform, config, device) {

        super();

        if (!device.name)
            throw new Error('An accessory must have a name.');

        this.log = platform.log;
        this.platform = platform;
        this.homebridge = platform.homebridge;
        this.Characteristic = platform.homebridge.hap.Characteristic;
        this.Service = platform.homebridge.hap.Service;
        this.name = device.name;
        this.displayName = config.name || device.name;
        this.device = device;
        this.config = config;
        this.services = [];

        this.setupAccessoryInformation();
    }

    setupAccessoryInformation() {
        var service = new this.Service.AccessoryInformation();
        service.setCharacteristic(this.Characteristic.Manufacturer, 'Thyren 3');
        service.setCharacteristic(this.Characteristic.Model, this.device.model);
        service.setCharacteristic(this.Characteristic.SerialNumber, this.device.name);

        this.services.push(service);
    }


    identify(callback) {
        this.log('Identify called for accessory', this.device.name);
        callback();
    }

    getServices() {
        return this.services;
    }

};

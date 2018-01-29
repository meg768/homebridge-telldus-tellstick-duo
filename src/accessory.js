"use strict";

var Events   = require('events');
var sprintf  = require('yow/sprintf');

module.exports = class Accessory extends Events {

    constructor(platform, config, device) {

        super();

        if (!device.name)
            throw new Error('An accessory must have a name.');

        var house = telldus.getDeviceParameterSync(device.id, 'house', '');
        var unit  = telldus.getDeviceParameterSync(device.id, 'unit', '');
        var group = telldus.getDeviceParameterSync(device.id, 'group', '');
        var id    = sprintf('%s%s%s', house, unit, group);

        this.log('UUID:', house, unit, group);

        this.uuid = this.generateUUID(id);
        this.log = platform.log;
        this.platform = platform;
        this.homebridge = platform.homebridge;
        this.Characteristic = platform.homebridge.hap.Characteristic;
        this.Service = platform.homebridge.hap.Service;
        this.name = config.name || device.name;
        this.device = device;
        this.config = config;
        this.services = [];


        // Important, set uuid_base to a unique uuid otherwise
        // two accessories with the same name cannot be created...
        this.uuid_base = this.uuid;


        this.setupAccessoryInformation();
    }

    generateUUID(id) {
        return this.platform.homebridge.hap.uuid.generate(id.toString());
    }

    setupAccessoryInformation() {
        var service = new this.Service.AccessoryInformation();
        service.setCharacteristic(this.Characteristic.Manufacturer, 'Thyren 3');
        service.setCharacteristic(this.Characteristic.Model, this.device.model);
        service.setCharacteristic(this.Characteristic.SerialNumber, this.device.name);

        this.services.push(service);
    }


    notifyState() {
        if (this.state != undefined) {
            if (isString(this.config.notify)) {
                if (this.state)
                    this.platform.notify(this.config.notify);
            }
            else if (isObject(this.config.notify)) {
                if (isString(this.config.notify.on) && this.state)
                    this.platform.notify(this.config.notify.on);

                if (isString(this.config.notify.off) && !this.state)
                    this.platform.notify(this.config.notify.off);
            }
        }
    }

    alertState() {
        if (this.state != undefined) {
            if (isString(this.config.alert)) {
                if (this.state)
                    this.platform.alert(this.config.alert);
            }
            else if (isObject(this.config.alert)) {
                if (isString(this.config.alert.on) && this.state)
                    this.platform.alert(this.config.alert.on);

                if (isString(this.config.alert.off) && !this.state)
                    this.platform.alert(this.config.alert.off);
            }
        }
    }

    identify(callback) {
        this.log('Identify called for accessory', this.device.name);
        callback();
    }

    getServices() {
        return this.services;
    }

};

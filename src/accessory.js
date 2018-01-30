"use strict";

var isString = require('yow/is').isString;
var isObject = require('yow/is').isObject;
var Events   = require('events');
var sprintf  = require('yow/sprintf');
var telldus  = require('telldus');

module.exports = class Accessory extends Events {

    constructor(platform, device) {

        super();

        if (!device.name)
            throw new Error('An accessory must have a name.');

        var house = device.parameters.house  || '';
        var unit  = device.parameters.unit   || '';
        var group = device.parameters.group  || '';
        var id    = sprintf('%s%s%s', house, unit, group);

        this.log = platform.log;
        this.platform = platform;
        this.homebridge = platform.homebridge;
        this.Characteristic = platform.homebridge.hap.Characteristic;
        this.Service = platform.homebridge.hap.Service;
        this.name = device.name;
        this.device = device;
        this.services = [];
        this.uuid = this.generateUUID(id);

        this.log('UUID:', house, unit, group);

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

            if (isString(this.device.notify)) {
                if (this.state)
                    this.platform.notify(this.device.notify);
            }
            else if (isObject(this.device.notify)) {
                if (isString(this.device.notify.on) && this.state)
                    this.platform.notify(this.device.notify.on);

                if (isString(this.device.notify.off) && !this.state)
                    this.platform.notify(this.device.notify.off);
            }

            if (isString(this.device.alert)) {
                if (this.state)
                    this.platform.alert(this.device.alert);
            }
            else if (isObject(this.device.alert)) {
                if (isString(this.device.alert.on) && this.state)
                    this.platform.alert(this.device.alert.on);

                if (isString(this.device.alert.off) && !this.state)
                    this.platform.alert(this.device.alert.off);
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

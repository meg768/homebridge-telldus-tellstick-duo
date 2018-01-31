"use strict";

var Events   = require('events');
var isString = require('yow/is').isString;
var isObject = require('yow/is').isObject;
var sprintf  = require('yow/sprintf');

var uuids = {};

module.exports = class Accessory extends Events {

    constructor(platform, name, uuid) {

        super();

        if (uuids[uuid] != undefined)
            throw new Error('Yow bro! Already reagisterred UUID %s!', uuid);

        uuids[uuid] = uuid;

        if (!name)
            throw new Error('An accessory must have a name.');

        if (!uuid)
            throw new Error('An accessory must have a anique UUID.');

        this.log = platform.log;
        this.platform = platform;
        this.homebridge = platform.homebridge;
        this.Characteristic = platform.homebridge.hap.Characteristic;
        this.Service = platform.homebridge.hap.Service;
        this.name = name;
        this.uuid = uuid;
        this.services = [];

        // Important, set uuid_base to a unique uuid otherwise
        // two accessories with the same name cannot be created...
        this.uuid_base = this.uuid;

    }

    addAccessoryInformation() {
        var service = new this.Service.AccessoryInformation();

        var manufacturer = this.getManufacturer();
        var model = this.getModel();
        var firmwareVersion = this.getFirmwareVersion();
        var serialNumber = this.getSerialNumber();

        if (manufacturer)
            service.setCharacteristic(this.Characteristic.Manufacturer, manufacturer);

        if (model)
            service.setCharacteristic(this.Characteristic.Model, model);

        if (firmwareVersion)
            service.setCharacteristic(this.Characteristic.FirmwareRevision, firmwareVersion);

        if (serialNumber)
            service.setCharacteristic(this.Characteristic.SerialNumber, serialNumber);


        this.addService(service);
    }


    addService(service) {
        this.services.push(service);
    }

    identify(callback) {
        this.log('Identify called for accessory', this.device.name);
        callback();
    }

    getManufacturer() {
        return 'Telldus';
    }

    getModel() {
        return 'model';
    }

    getFirmwareVersion() {
        return '1.0';
    }

    getSerialNumber() {
        return 'XYZ';
    }

    getServices() {
        return this.services;
    }

};

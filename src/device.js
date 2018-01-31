"use strict";

var isString = require('yow/is').isString;
var isObject = require('yow/is').isObject;
var Events   = require('events');
var sprintf  = require('yow/sprintf');
var telldus  = require('telldus');
var Accessory = require('./accessory.js');

module.exports = class Device extends Accessory {

    constructor(platform, device, state) {

        super(platform, device.location ? sprintf('%s - %s', device.name, device.location) : device.name, device.uuid);

        this.device = device;
        this.state = state;

        this.addAccessoryInformation();

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

    stateChanged(state) {
        this.setState(state);
    }

    setState(state) {
        this.state = state;
    }

    getState() {
        return this.state;
    }

    getManufacturer() {
        return 'Telldus';
    }

    getModel() {
        return this.device.model;
    }

    getFirmwareVersion() {
        return '1.0';
    }

    getSerialNumber() {
        return 'ABC-123';
    }


};

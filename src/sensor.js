"use strict";

var Accessory = require('./accessory.js');

module.exports = class Device extends Accessory {

    constructor(platform, device) {

        super(platform, device.name, device.uuid);

        this.device = device;

        this.addAccessoryInformation();
        this.addServices();
    }

    addServices() {
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
        return this.device.id;
    }


};

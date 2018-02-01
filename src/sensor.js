"use strict";

var Accessory = require('./accessory.js');

module.exports = class Sensor extends Accessory {

    constructor(platform, config) {

        super(platform, config.name, config.uuid);

        this.config = config;

        this.addAccessoryInformation();
        this.addServices();
    }

    addServices() {
    }


    getManufacturer() {
        return 'Telldus';
    }

    getModel() {
        return this.config.model;
    }

    getFirmwareVersion() {
        return '1.0';
    }

    getSerialNumber() {
        return this.config.id;
    }


};

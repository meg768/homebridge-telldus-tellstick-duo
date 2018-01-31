"use strict";

var isString = require('yow/is').isString;
var isObject = require('yow/is').isObject;
var Events   = require('events');
var sprintf  = require('yow/sprintf');
var telldus  = require('telldus');
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
        return 'ABC-123';
    }


};

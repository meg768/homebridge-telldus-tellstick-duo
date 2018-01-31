"use strict";

var isString = require('yow/is').isString;
var isObject = require('yow/is').isObject;
var Events   = require('events');
var sprintf  = require('yow/sprintf');
var telldus  = require('telldus');
var Accessory = require('./accessory.js');

module.exports = class Device extends Accessory {

    constructor(platform, device) {

        super(platform, device.location ? sprintf('%s - %s', device.name, device.location) : device.name, device.uuid);

        this.device = device;
        this.state = device.state;

        this.addAccessoryInformation();
        this.addServices();
    }

    addServices() {
    }

    setState(state) {

        if (this.state != state) {
            this.state = state;

            var notify = this.device.notify;
            var alert  = this.device.alert;

            if (isObject(notify)) {
                if (isString(notify.on) && state)
                    this.platform.notify(notify.on);

                if (isString(notify.off) && !state)
                    this.platform.notify(notify.off);
            }

            if (isObject(alert)) {
                if (isString(alert.on) && state)
                    this.platform.alert(alert.on);

                if (isString(alert.off) && !state)
                    this.platform.alert(alert.off);
            }
        }


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
        return this.device.id;
    }


};

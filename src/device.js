"use strict";

var isString = require('yow/is').isString;
var isObject = require('yow/is').isObject;
var Events   = require('events');
var sprintf  = require('yow/sprintf');
var telldus  = require('telldus');
var Accessory = require('./accessory.js');

module.exports = class Device extends Accessory {

    constructor(platform, config) {

        super(platform, config.location ? sprintf('%s - %s', config.name, config.location) : config.name, config.uuid);

        this.config = config;
        this.state = config.state;

        this.addAccessoryInformation();
        this.addServices();
    }

    addServices() {
    }

    setState(state) {

        if (this.state != state) {
            this.state = state;

            var notify = this.config.notify;
            var alert  = this.config.alert;

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
        return this.config.model;
    }

    getFirmwareVersion() {
        return '1.0';
    }

    getSerialNumber() {
        return this.config.id;
    }


};

"use strict";

var isString = require('yow/isString');
var isObject = require('yow/isObject');
var sprintf  = require('yow/sprintf');
var Accessory = require('./accessory.js');

module.exports = class Device extends Accessory {

    constructor(platform, config) {

        super(platform, config.location ? sprintf('%s - %s', config.name, config.location) : config.name, config.uuid);

        this.config = config;
        this.state = config.state;

        this.addAccessoryInformation();

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

            if (isString(notify) && state) {
                this.platform.notify(notify);
            }

            if (isString(alert) && state) {
                this.platform.alert(alert);
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
        if (this.config.identity)
            return sprintf('%s (%d)', this.config.identity, this.config.id);

        return this.config.id;
    }


};

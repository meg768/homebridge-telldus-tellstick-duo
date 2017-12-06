"use strict";

var tellstick = require('./tellstick.js');
var TelldusDevice = require('./telldus-device.js');

function debug() {
    console.log.apply(this, arguments);
}

module.exports = class TelldusPlatform {

    constructor(log, config, homebridge) {

        debug = log;

        this.config = config;
        this.log = log;
        this.homebridge = homebridge;
    }

    accessories(callback) {
        debug('Loading devices...');

        var devices = tellstick.getDevices();
        var list = [];

        devices.forEach((device) => {
            if (device.type.toUpperCase() == 'DEVICE')
                list.push(new TelldusDevice(this.log, this.config, this.homebridge, device));
        });

        callback(list);

    }
}

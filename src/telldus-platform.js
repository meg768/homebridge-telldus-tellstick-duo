"use strict";

var tellstick = require('./tellstick.js');
var TelldusSwitch = require('./telldus-switch.js');
var TelldusThermometer = require('./telldus-thermometer.js');
var TelldusThermometerHygrometer = require('./telldus-thermometer-hygrometer.js');

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
            switch(device.model) {
                case 'selflearning-switch': {
                    list.push(new TelldusSwitch(debug, this.config, this.homebridge, device));
                    break;
                }
                case 'codeswitch': {
                    list.push(new TelldusSwitch(debug, this.config, this.homebridge, device));
                    break;
                }
                case 'temperature': {
                    list.push(new TelldusThermometer(debug, this.config, this.homebridge, device));
                    break;
                }
                case 'temperaturehumidity': {
                    list.push(new TelldusThermometerHygrometer(debug, this.config, this.homebridge, device));
                    break;
                }
                default: {
                    this.log('*******************Ignoring', device);
                    break;
                }
            }
        });

        callback(list);

    }
}

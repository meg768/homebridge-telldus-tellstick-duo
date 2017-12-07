"use strict";

var tellstick = require('./tellstick.js');
var TelldusSwitch = require('./telldus-switch.js');
var TelldusThermometer = require('./telldus-thermometer.js');
var TelldusThermometerHygrometer = require('./telldus-thermometer-hygrometer.js');


module.exports = class TelldusPlatform {

    constructor(log, config, homebridge) {

        this.config = config;
        this.log = log;
        this.homebridge = homebridge;
    }

    accessories(callback) {
        this.log('Loading accessories...');

        var devices = tellstick.getDevices();
        var accessories = [];

        devices.forEach((device) => {
            var exclude = false;

            if (this.config.exclude) {
                if (this.config.exclude.indexOf(device.name) >= 0)
                    exclude = true;
            }

            if (!exclude) {
                switch(device.model) {
                    case 'selflearning-switch': {
                        accessories.push(new TelldusSwitch(this.log, this.config, this.homebridge, device));
                        break;
                    }
                    case 'codeswitch': {
                        accessories.push(new TelldusSwitch(this.log, this.config, this.homebridge, device));
                        break;
                    }
                    case 'temperature': {
                        accessories.push(new TelldusThermometer(this.log, this.config, this.homebridge, device));
                        break;
                    }
                    case 'temperaturehumidity': {
                        accessories.push(new TelldusThermometerHygrometer(this.log, this.config, this.homebridge, device));
                        break;
                    }
                    default: {
                        this.log('Ignoring:', device);
                        break;
                    }
                }
            }

        });

        callback(accessories);

    }
}

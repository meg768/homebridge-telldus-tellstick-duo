"use strict";

var telldus = require('telldus');

function debug() {
    console.log.apply(this, arguments);
}

module.exports = class TelldusDevice {

    constructor(log, config, homebridge, device) {

        debug = log;

        this.log = log;
        this.config = config && config.devices && config.devices[device.name] ? config.devices[device.name] : {};
        this.homebridge = homebridge;
        this.device = device;

        // A device must have a name present
        this.name = this.config.name || device.name;
    }

    turnOn() {
        debug('Turning on', this.device.name);
        telldus.turnOnSync(this.device.id);
    }

    turnOff() {
        debug('Turning off', this.device.name);
        telldus.turnOffSync(this.device.id);
    }

    identify(callback) {
        debug('Identify called.');
/*
        if (this.device.status.name == 'ON') {
            this.turnOff();
            this.turnOn();
        }
        else {
            this.turnOn();
            this.turnOff();
        }
*/
        callback();

    }

    getState(callback) {
        debug('Returning state', this.device);
        return callback(null, this.device.status.name == 'ON');
    }

    setState(value, callback) {

        if (value)
            this.turnOn();
        else
            this.turnOff();

        callback();
    }

    getServices() {
        var Service = this.homebridge.hap.Service;
        var Characteristic = this.homebridge.hap.Characteristic;

        var info = new Service.AccessoryInformation();

        info.setCharacteristic(Characteristic.Manufacturer, this.device.protocol);
        info.setCharacteristic(Characteristic.Model, this.device.model);
        info.setCharacteristic(Characteristic.SerialNumber, "123-456-789");

        if (this.config.type == 'MotionSensor') {
            var service = new Service.MotionSensor(this.device.name);
            var characteristic = service.getCharacteristic(Characteristic.MotionDetected);

            characteristic.on('get', (callback) => {
                debug('Motion!');
                callback(null, this.device.status.name == 'ON');
            });

            return [info, service];

        }
        else {
            var service = new Service.Lightbulb(this.device.name);
            var characteristic = service.getCharacteristic(Characteristic.On);

            characteristic.on('get', this.getState.bind(this));
            characteristic.on('set', this.setState.bind(this));

            return [info, service];

        }


    }

};

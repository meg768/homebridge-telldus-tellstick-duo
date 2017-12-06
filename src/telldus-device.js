"use strict";

var tellstick = require('./tellstick.js');

function debug() {
    console.log.apply(this, arguments);
}

module.exports = class TelldusDevice {

    constructor(homebridge, device) {
        debug(device);
        this.device = device;
        this.homebridge = homebridge;

        // A device must have a name present
        this.name = device.name;
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

        if (this.device.status.name == 'ON') {
            turnOff();
            turnOn();
        }
        else {
            turnOn();
            turnOff();
        }

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

        var service = new Service.Lightbulb(this.device.name);
        var characteristic = service.getCharacteristic(Characteristic.On);

        characteristic.on('get', this.getState.bind(this));
        characteristic.on('set', this.setState.bind(this));

        debug('NEW NAME', this.device.name);

        return [info, service];
    }

};

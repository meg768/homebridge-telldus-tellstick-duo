"use strict";
var TelldusAccessory = require('./telldus-accessory.js');
var telldus = require('telldus');


module.exports = class TelldusSwitch extends TelldusAccessory {

    constructor(log, config, homebridge, device) {
        super(log, config, homebridge, device);
    }

    turnOn() {
        this.log('Turning on', this.device.name);
        telldus.turnOnSync(this.device.id);
    }

    turnOff() {
        this.log('Turning off', this.device.name);
        telldus.turnOffSync(this.device.id);
    }


    getState(callback) {
        this.log('Returning state', this.device);
        return callback(null, this.device.state == 'ON');
    }

    setState(value, callback) {

        if (value)
            this.turnOn();
        else
            this.turnOff();

        callback();
    }

    getServices() {
        var services = super.getServices();

        var service = new this.Service.Lightbulb(this.name);
        var characteristic = service.getCharacteristic(this.Characteristic.On);

        characteristic.on('get', this.getState.bind(this));
        characteristic.on('set', this.setState.bind(this));

        services.push(service);

        return services;

    }

};

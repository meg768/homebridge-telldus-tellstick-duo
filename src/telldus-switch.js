"use strict";
var TelldusAccessory = require('./telldus-accessory.js');
var telldus = require('telldus');


module.exports = class TelldusSwitch extends TelldusAccessory {

    turnOn() {
        this.log('Turning on', this.device.name);
        telldus.turnOnSync(this.device.id);
    }

    turnOff() {
        this.log('Turning off', this.device.name);
        telldus.turnOffSync(this.device.id);
    }


    getServices() {
        var services = super.getServices();
        var service = config.type == 'switch' ? new this.Service.Switch(this.name) : new this.Service.Lighbulb(this.name);
        var characteristic = service.getCharacteristic(this.Characteristic.On);

        characteristic.on('get', (callback) => {
            callback(null, this.device.state == 'ON');
        });

        characteristic.on('set', (value, callback) => {

            if (value)
                this.turnOn();
            else
                this.turnOff();

            callback();
        });

        services.push(service);

        return services;

    }

};

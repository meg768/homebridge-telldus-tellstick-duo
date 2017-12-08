"use strict";
var TelldusAccessory = require('./telldus-accessory.js');
var telldus = require('telldus');


module.exports = class TelldusSwitch extends TelldusAccessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        this.type = this.config.type ? this.config.type.toLowerCase() : 'lightbulb';

        switch(this.type) {
            case 'switch': {
                this.service = new this.Service.Switch(this.name);
                break;
            }
            case 'lightbulb': {
                this.service = new this.Service.Lightbulb(this.name);
                break;
            }
            default: {
                this.service = new this.Service.Lightbulb(this.name);
                break;
            }
        }

        var characteristic = this.service.getCharacteristic(this.Characteristic.On);

        characteristic.on('get', (callback) => {
            callback(null, this.device.state == 'ON');
        });

        characteristic.on('set', (value, callback, context) => {

            if (value)
                this.turnOn();
            else
                this.turnOff();

            callback();
        });

        this.device.on('change', () => {

            // Indicate movement
            this.log('Reflecting change to HomeKit.');

            characteristic.updateValue(this.device.state == 'ON');
        });


    }

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
        services.push(this.service);
        return services;
    }

};

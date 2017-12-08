"use strict";
var TelldusAccessory = require('./telldus-accessory.js');
var telldus = require('telldus');
var sleep = require('sleep').msleep;

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

            if (value) {
                this.log('Turning on', this.device.name);
                telldus.turnOnSync(this.device.id);
            }
            else {
                this.log('Turning off', this.device.name);
                telldus.turnOffSync(this.device.id);

            }
            sleep(300);
            callback();
        });

        this.device.on('change', () => {

            var state = this.device.state == 'ON';

            // Indicate movement
            this.log('Reflecting change to HomeKit. %s is now %s.', this.device.name, state ? 'ON' : 'OFF');

            characteristic.updateValue(state);
        });


    }



    getServices() {
        var services = super.getServices();
        services.push(this.service);
        return services;
    }

};

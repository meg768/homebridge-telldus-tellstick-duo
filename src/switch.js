"use strict";
var TelldusAccessory = require('./accessory.js');
var telldus = require('telldus');
var isString = require('yow/is').isString;
var sprintf = require('yow/sprintf');

module.exports = class TelldusSwitch extends TelldusAccessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        this.setupSwitch();
    }

    setupSwitch() {

        this.state = this.getDeviceState();

        var service = new this.Service.Switch(this.displayName, this.device.name);
        var characteristics = service.getCharacteristic(this.Characteristic.On);

        characteristics.updateValue(this.getState());

        characteristics.on('get', (callback) => {
            callback(null, this.getState());
        });

        characteristics.on('set', (state, callback, context) => {
            this.setState(state);
            callback();
        });

        this.on('stateChanged', () => {
            var state = this.getDeviceState();

            if (this.state != state) {
                this.log('Reflecting change to HomeKit. %s is now %s.', this.device.name, state);
                characteristics.updateValue(this.state = state);
                this.log('Done.');
            }

        });

        this.services.push(service);
    }

    getDeviceState() {
        return this.device.state;
    }

    getState() {
        return this.state;
    }

    setState(state) {

        if (state)
            this.turnOn();
        else
            this.turnOff();

        this.log('Settings value from HomeKit. %s is now %s.', this.device.name, state);
    }

    turnOn() {
        this.log('Turning on', this.device.name);

        this.platform.alert(this.config.alertOn);
        this.platform.notify(this.config.notifyOn);

        telldus.turnOnSync(this.device.id);
        telldus.turnOnSync(this.device.id);

        this.log(sprintf('Device %s turned on.', this.device.name));

        this.state = true;
    }

    turnOff() {
        this.log('Turning off', this.device.name);

        this.platform.alert(this.config.alertOff);
        this.platform.notify(this.config.notifyOff);

        telldus.turnOffSync(this.device.id);
        telldus.turnOffSync(this.device.id);

        this.log(sprintf('Device %s turned off.', this.device.name));

        this.state = false;
    }

};

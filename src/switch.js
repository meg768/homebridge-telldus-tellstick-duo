"use strict";
var TelldusAccessory = require('./accessory.js');
var telldus  = require('telldus');
var sprintf  = require('yow/sprintf');
var isString = require('yow/is').isString;
var isObject = require('yow/is').isObject;
var isNumber = require('yow/is').isNumber;
var Timer    = require('yow/timer');

module.exports = class TelldusSwitch extends TelldusAccessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        this.timer = new Timer();
        this.setupSwitch();
    }


    setupSwitch() {

        this.state = this.getDeviceState();

        var house = telldus.getDeviceParameterSync(this.device.id, 'house', '');
        var unit  = telldus.getDeviceParameterSync(this.device.id, 'unit', '');
        var group = telldus.getDeviceParameterSync(this.device.id, 'group', '');

        this.log(house, unit, group);

        var service = new this.Service.Switch(this.displayName, sprintf('%s%s%s', house, unit, group));
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
            var timer = new Timer();
            var state = this.getDeviceState();

            // If not the same state as HomeKit, update HomeKit value
            if (this.state != state) {
                this.log('Reflecting change to HomeKit. %s is now %s.', this.device.name, state);
                characteristics.updateValue(this.state = state);

                // Notify state change
                this.notifyState();
            }

            // Auto off?
            if (state && isNumber(this.config.timer)) {
                timer.cancel();

                timer.setTimer(this.config.timer * 1000, () => {
                    this.log('Timer activated. Turning off', this.device.name);

                    this.state = false;

                    // Turn off and make sure HomeKit knows about it
                    this.setState(this.state);
                    characteristics.updateValue(this.state);
                });

            }

        });

        this.services.push(service);
    }

    notifyState() {
        if (isString(this.config.notify)) {
            if (this.state)
                this.platform.notify(this.config.notify);
        }
        else if (isObject(this.config.notify)) {
            if (isString(this.config.notify.on) && this.state)
                this.platform.notify(this.config.notify.on);

            if (isString(this.config.notify.off) && !this.state)
                this.platform.notify(this.config.notify.off);
        }
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

        this.notifyState();

        this.log('Setting value from HomeKit. %s is now %s.', this.device.name, state);
    }

    turnOn() {
        this.timer.cancel();
        this.log('Turning on', this.device.name);

        this.platform.alert(this.config.alertOn);
        this.platform.notify(this.config.notifyOn);

        telldus.turnOnSync(this.device.id);

        setImmediate(() => {
            telldus.turnOnSync(this.device.id);
        });

        setImmediate(() => {
            telldus.turnOnSync(this.device.id);
        });

        this.timer.setTimer(800, () => {
            telldus.turnOnSync(this.device.id);
        });

        this.log(sprintf('Device %s turned on.', this.device.name));

        this.state = true;

    }

    turnOff() {
        this.timer.cancel();
        this.log('Turning off', this.device.name);

        this.platform.alert(this.config.alertOff);
        this.platform.notify(this.config.notifyOff);

        telldus.turnOffSync(this.device.id);

        setImmediate(() => {
            telldus.turnOffSync(this.device.id);
        });

        setImmediate(() => {
            telldus.turnOffSync(this.device.id);
        });

        this.timer.setTimer(800, () => {
            telldus.turnOffSync(this.device.id);
        });

        this.log(sprintf('Device %s turned off.', this.device.name));

        this.state = false;
    }

};

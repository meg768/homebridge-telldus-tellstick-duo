"use strict";
var telldus   = require('telldus');
var sprintf   = require('yow/sprintf');
var isString  = require('yow/is').isString;
var isObject  = require('yow/is').isObject;
var isNumber  = require('yow/is').isNumber;
var Timer     = require('yow/timer');
var Device    = require('./device.js');

module.exports = class Switch extends Device {

    constructor(platform, device) {
        super(platform, device);

        // Timer to help turnOn() and turnOff()
        this.timer = new Timer();

        this.addServices();
    }

    addServices() {
        var service = new this.Service.Switch(this.name, this.uuid);
        this.enablePower(service);
        this.addService(service);
    }

    enablePower(service) {
        var timer = new Timer();
        var characteristic = service.getCharacteristic(this.Characteristic.On);

        characteristic.updateValue(this.getState());

        characteristic.on('get', (callback) => {
            callback(null, this.getState());
        });

        characteristic.on('set', (state, callback, context) => {
            this.setState(state);
            callback();
        });

        this.on('stateChanged', (state) => {

            timer.cancel();

            // If not the same state as HomeKit, update HomeKit value
            if (this.state != state) {
                super.setState(state);

                this.log('Reflecting change to HomeKit. %s is now %s.', this.device.name, state);
                characteristic.updateValue(state);
            }

            // Auto off?
            if (state && isNumber(this.device.timer)) {

                timer.setTimer(this.device.timer * 1000, () => {
                    this.log('Timer activated. Turning off', this.device.name);

                    // Turn off and make sure HomeKit knows about it
                    this.setState(false);
                    characteristic.updateValue(this.getState());
                });

            }
        });

    }

    setState(state) {
        if (state)
            this.turnOn();
        else
            this.turnOff();

        this.log('Setting value from HomeKit. %s is now %s.', this.device.name, state);

        super.setState(state);
    }

    turnOn() {
        this.timer.cancel();
        this.log('Turning on', this.device.name);

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
    }

    turnOff() {
        this.timer.cancel();
        this.log('Turning off', this.device.name);

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
    }

};

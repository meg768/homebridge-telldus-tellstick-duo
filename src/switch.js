"use strict";
var telldus   = require('telldus');
var sprintf   = require('yow/sprintf');
var isString  = require('yow/is').isString;
var isObject  = require('yow/is').isObject;
var isNumber  = require('yow/is').isNumber;
var Timer     = require('yow/timer');
var Device    = require('./device.js');

module.exports = class Switch extends Device {

    constructor(platform, config) {
        super(platform, config);

        // Timer to help turnOn() and turnOff()
        this.timer = new Timer();

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

                this.log('Reflecting change to HomeKit. %s is now %s.', this.config.name, state);
                characteristic.updateValue(state);
            }

            // Auto off?
            if (state && isNumber(this.config.timer)) {

                timer.setTimer(this.config.timer * 1000, () => {
                    this.log('Timer activated. Turning off', this.config.name);

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

        super.setState(state);
    }

    turnOn() {
        this.timer.cancel();
        this.log('Turning on', this.config.name);

        telldus.turnOnSync(this.config.id);

        setImmediate(() => {
            telldus.turnOnSync(this.config.id);
        });

        setImmediate(() => {
            telldus.turnOnSync(this.config.id);
        });

        this.timer.setTimer(800, () => {
            telldus.turnOnSync(this.config.id);
        });

        this.log(sprintf('Device %s turned on.', this.config.name));
    }

    turnOff() {
        this.timer.cancel();
        this.log('Turning off', this.config.name);

        telldus.turnOffSync(this.config.id);

        setImmediate(() => {
            telldus.turnOffSync(this.config.id);
        });

        setImmediate(() => {
            telldus.turnOffSync(this.config.id);
        });

        this.timer.setTimer(800, () => {
            telldus.turnOffSync(this.config.id);
        });

        this.log(sprintf('Device %s turned off.', this.config.name));
    }

};

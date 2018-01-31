"use strict";
var Accessory = require('./accessory.js');
var telldus   = require('telldus');
var sprintf   = require('yow/sprintf');
var isString  = require('yow/is').isString;
var isObject  = require('yow/is').isObject;
var isNumber  = require('yow/is').isNumber;
var Timer     = require('yow/timer');

module.exports = class TelldusSwitch extends Accessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        this.timer = new Timer();
        this.setupSwitch();
    }

    setupSwitch() {

        this.state = this.getDeviceState();

        var service = undefined;


        switch(this.device.type) {
            case 'lightbulb':
                service = new this.Service.Lightbulb(this.name, this.uuid);
                break;
            case 'outlet':
                service = new this.Service.Outlet(this.name, this.uuid);
                break;
            default:
                service = new this.Service.Switch(this.name, this.uuid);
                break;
        }

        var power = service.getCharacteristic(this.Characteristic.On);

        power.updateValue(this.getState());

        power.on('get', (callback) => {
            callback(null, this.getState());
        });

        power.on('set', (state, callback, context) => {
            this.setState(state);
            callback();
        });

        this.on('stateChanged', () => {
            var timer = new Timer();
            var state = this.getDeviceState();

            // If not the same state as HomeKit, update HomeKit value
            if (this.state != state) {
                this.log('Reflecting change to HomeKit. %s is now %s.', this.device.name, state);
                power.updateValue(this.state = state);

                // Notify state change
                this.notifyState();
            }

            // Auto off?
            if (state && isNumber(this.device.timer)) {
                timer.cancel();

                timer.setTimer(this.device.timer * 1000, () => {
                    this.log('Timer activated. Turning off', this.device.name);

                    this.state = false;

                    // Turn off and make sure HomeKit knows about it
                    this.setState(this.state);
                    power.updateValue(this.state);
                });

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

        this.notifyState();

        this.log('Setting value from HomeKit. %s is now %s.', this.device.name, state);
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

        this.state = true;

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

        this.state = false;
    }

};

"use strict";
var TelldusAccessory = require('./accessory.js');
var telldus  = require('telldus');
var sprintf  = require('yow/sprintf');
var isString = require('yow/is').isString;
var isNumber = require('yow/is').isNumber;
var Timer    = require('yow/timer');

module.exports = class TelldusSwitch extends TelldusAccessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        switch(config.type.toLowerCase()) {
            case 'lightbulb' : {
                this.setupSwitch(this.Service.Lightbulb);
                break;
            }
            case 'fan' : {
                this.setupSwitch(this.Service.Fan);
                break;
            }
            default : {
                this.setupSwitch(this.Service.Switch);
                break;
            }
        }
    }


    setupSwitch(Service) {

        this.state = this.getDeviceState();

        var service = new Service(this.displayName, this.device.name);
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
        if (this.state && this.config.on)
            this.platform.notify(this.config.on);

        if (!this.state && this.config.off)
            this.platform.notify(this.config.off);
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
        this.log('Turning on', this.device.name);

        this.platform.alert(this.config.alertOn);
        this.platform.notify(this.config.notifyOn);

        telldus.turnOnSync(this.device.id);
        //telldus.turnOnSync(this.device.id);

        this.log(sprintf('Device %s turned on.', this.device.name));

        this.state = true;

    }

    turnOff() {
        this.log('Turning off', this.device.name);

        this.platform.alert(this.config.alertOff);
        this.platform.notify(this.config.notifyOff);

        telldus.turnOffSync(this.device.id);
        //telldus.turnOffSync(this.device.id);

        this.log(sprintf('Device %s turned off.', this.device.name));

        this.state = false;
    }

};

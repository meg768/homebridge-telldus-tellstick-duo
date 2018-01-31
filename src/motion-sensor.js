"use strict";

var Device = require('./device.js');
var Timer = require('yow/timer');
var isString = require('yow/is').isString;

module.exports = class MotionSensor extends Device {

    constructor(platform, device) {
        super(platform, device);
    }

    addServices() {
        var service = new this.Service.MotionSensor(this.name, this.uuid);

        this.enableMotionDetected(service);
        this.addService(service);
    }

    enableMotionDetected(service) {
        var characteristic = service.getCharacteristic(this.Characteristic.MotionDetected);
        var timeout = eval(this.device.timeout || 60);
        var timer = new Timer();

        characteristic.updateValue(this.getState());

        characteristic.on('set', (state, callback) => {
            this.setState(state);
            timer.cancel();
            callback();
        });

        characteristic.on('get', (callback) => {
            callback(null, this.getState());
        });

        this.on('stateChanged', (state) => {

            if (!state) {
                this.log('Movement detected on sensor', this.device.name);

                this.setState(true);
                characteristic.updateValue(this.getState());

                timer.cancel();

                timer.setTimer(timeout * 1000, () => {
                    this.log('Resetting movement for sensor', this.device.name);
                    this.setState(false);
                    characteristic.updateValue(this.getState());
                });
            }
        });

    }


};

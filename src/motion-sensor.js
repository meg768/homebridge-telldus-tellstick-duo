"use strict";

var Device = require('./device.js');
var Timer = require('yow/timer');
var isString = require('yow/is').isString;

module.exports = class MotionSensor extends Device {

    constructor(platform, config) {
        super(platform, config);

        // Do not remember state since this is always ON
        this.state = false;
    }

    addServices() {
        var service = new this.Service.MotionSensor(this.name, this.uuid);

        this.enableMotionDetected(service);
        this.addService(service);
    }

    enableMotionDetected(service) {
        var characteristic = service.getCharacteristic(this.Characteristic.MotionDetected);
        var timeout = parseInt(eval(this.config.timeout || 60));
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

            this.log('State changed to (%s) for motion sensor %s.', state, this.config.name);

            if (!state) {
                this.log('Movement detected on sensor %s. Setting timeout to %s seconds.', this.config.name, timeout);

                this.setState(true);
                characteristic.updateValue(this.getState());

                timer.cancel();

                timer.setTimer(timeout * 1000, () => {
                    this.log('Resetting movement for sensor', this.config.name);
                    this.setState(false);
                    characteristic.updateValue(this.getState());
                });
            }
        });

    }


};

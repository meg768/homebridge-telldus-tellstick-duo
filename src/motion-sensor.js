"use strict";

var Device = require('./device.js');
var Timer = require('yow/timer');
var isString = require('yow/is').isString;

module.exports = class MotionSensor extends Device {

    constructor(platform, config) {
        super(platform, config);

        // Do not remember state since this is always ON
        this.state = false;
        this.timeout = new Timer();
    }

    addServices() {
        var service = new this.Service.MotionSensor(this.name, this.uuid);

        this.enableMotionDetected(service);
        this.addService(service);
    }

    enableMotionDetected(service) {
        var characteristic = service.getCharacteristic(this.Characteristic.MotionDetected);
        var timeout = parseInt(eval(this.config.timeout || 60));

        characteristic.updateValue(this.getState());

        characteristic.on('set', (state, callback) => {
            this.setState(state);
            this.timeout.cancel();
            callback();
        });

        characteristic.on('get', (callback) => {
            callback(null, this.getState());
        });

        this.on('stateChanged', (state) => {

            this.debug('State changed to %s for motion sensor %s (%s).', state, this.config.name, this.config.id);

            if (state) {
                this.log('Movement detected on sensor %s (%s). Setting timeout to %s seconds.', this.config.name, this.config.id, timeout);

                this.setState(true);
                characteristic.updateValue(this.getState());

                this.timeout.cancel();

                this.timeout.setTimer(timeout * 1000, () => {
                    this.log('Resetting movement for sensor', this.config.name);
                    this.setState(false);
                    characteristic.updateValue(this.getState());
                });
            }
        });

    }


};

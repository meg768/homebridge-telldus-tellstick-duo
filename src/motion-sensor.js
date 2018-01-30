"use strict";

var Accessory = require('./accessory.js');
var Timer = require('yow/timer');
var isString = require('yow/is').isString;

module.exports = class MotionSensor extends Accessory {

    constructor(platform, device) {
        super(platform, device);

        this.state = false;
        this.timer = new Timer();

        var service = new this.Service.MotionSensor(this.name, this.uuid);
        var motion = service.getCharacteristic(this.Characteristic.MotionDetected);
        var timeout = eval(device.timeout || 60);

        motion.updateValue(this.state);

        motion.on('set', (state, callback) => {
            this.state = state;
            this.timer.cancel();
            callback();
        });

        motion.on('get', (callback) => {
            callback(null, this.state);
        });

        this.on('stateChanged', () => {

            if (!this.state) {
                this.log('Movement detected on sensor', this.device.name);

                this.timer.cancel();
                motion.updateValue(this.state = true);
                this.notifyState();

                this.timer.setTimer(timeout * 1000, () => {
                    this.log('Resetting movement for sensor', this.device.name);
                    motion.updateValue(this.state = false);
                    this.notifyState();
                });
            }
        });

        this.services.push(service);
    }


};

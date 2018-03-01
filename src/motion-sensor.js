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

        var Service = this.getService();
        var service = new Service(this.name, this.uuid);

        this.enableMotionDetected(service);
        this.addService(service);
    }

    getService() {
        return this.Service.MotionSensor;
    }


    enableMotionDetected(service) {
        var motion = service.getCharacteristic(this.Characteristic.MotionDetected);
        var timeout = parseInt(eval(this.config.timeout || 60));

        motion.updateValue(this.getState());

        motion.on('set', (state, callback) => {
            this.setState(state);
            this.timeout.cancel();
            callback();
        });

        motion.on('get', (callback) => {
            callback(null, this.getState());
        });

        this.on('stateChanged', (state) => {

            this.debug('State changed to %s for motion sensor %s (%s).', state, this.config.name, this.config.id);

            if (state) {
                this.log('Movement detected on sensor %s (%s). Setting timeout to %s seconds.', this.config.name, this.config.id, timeout);

                this.setState(true);
                this.log('Triggering sensor in HomeKit.');
                motion.updateValue(this.getState());

                this.log('Cancelling previous timer.');
                this.timeout.cancel();

                this.log('Setting new timer.');

                this.timeout.setTimer(timeout * 1000, () => {
                    this.log('Resetting movement for sensor', this.config.name);
                    this.setState(false);
                    motion.updateValue(this.getState());
                });

                this.log('Done.');
            }
        });

    }


};

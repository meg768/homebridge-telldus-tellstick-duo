"use strict";

var TelldusSensor = require('./sensor.js');
var Timer = require('yow/timer');

module.exports = class MotionSensor extends TelldusSensor {

    constructor(platform, config, device) {
        super(platform, config, device);

        this.setupMotionSensor();
    }

    setupMotionSensor() {
        super.setupSensor(this.Service.MotionSensor, this.Characteristic.MotionDetected, (this.config.timeout ? this.config.timeout : 5));
    }


};

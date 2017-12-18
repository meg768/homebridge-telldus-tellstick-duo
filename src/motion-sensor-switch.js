"use strict";

var Sensor = require('./sensor.js');
var Timer = require('yow/timer');

module.exports = class MotionSensorSwitch extends Sensor {

    constructor(platform, config, device) {
        super(platform, config, device);

        this.setupMotionSensorSwitch();
    }

    setupMotionSensorSwitch() {
        super.setupSensor(this.Service.Switch, this.Characteristic.On, (this.config.timeout ? this.config.timeout : 5));
    }


};

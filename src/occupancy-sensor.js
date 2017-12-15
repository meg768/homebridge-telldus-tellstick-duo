"use strict";

var TelldusSensor = require('./sensor.js');
var Timer = require('yow/timer');

module.exports = class TelldusOccupancySensor extends TelldusSensor {

    constructor(platform, config, device) {
        super(platform, config, device);

        this.setupOccupancySensor();
    }

    setupOccupancySensor() {
        super.setupSensor(this.Service.OccupancySensor, this.Characteristic.OccupancyDetected, (this.config.timeout ? this.config.timeout : 30) * 60);
    }

};

"use strict";

var ThermometerHygrometer = require('./thermometer-hygrometer.js');

module.exports = class Thermometer extends ThermometerHygrometer {

    initialize() {
        this.addTemperatureSensor();
    }

};

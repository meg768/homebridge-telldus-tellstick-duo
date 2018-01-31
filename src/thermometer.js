"use strict";

var ThermometerHygrometer = require('./thermometer-hygrometer.js');

module.exports = class Thermometer extends ThermometerHygrometer {

    addServices() {
        this.addTemperatureSensor();
    }

};

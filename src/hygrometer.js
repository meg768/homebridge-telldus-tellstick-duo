"use strict";

var ThermometerHygrometer = require('./thermometer-hygrometer.js');

module.exports = class Hygrometer extends ThermometerHygrometer {

    initialize() {
        this.addHumiditySensor();
    }

};

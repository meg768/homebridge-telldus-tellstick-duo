"use strict";

var ThermometerHygrometer = require('./thermometer-hygrometer.js');

module.exports = class Hygrometer extends ThermometerHygrometer {

    addServices() {
        this.addHumiditySensor();
    }

};

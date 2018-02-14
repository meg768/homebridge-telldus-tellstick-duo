"use strict";
var Switch = require('./switch.js');

module.exports = class Lightbulb extends Switch {

    initialize() {
        var service = new this.Service.Lightbulb(this.name, this.uuid);
        this.enablePower(service);
        this.addService(service);
    }

};

"use strict";
var Switch = require('./Switch.js');

module.exports = class Lightbulb extends Switch {

    addServices() {
        var service = new this.Service.Lightbulb(this.name, this.uuid);
        this.enablePower(service);
        this.addService(service);
    }

};

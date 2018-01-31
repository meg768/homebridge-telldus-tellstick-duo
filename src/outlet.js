"use strict";
var Switch = require('./switch.js');

module.exports = class Outlet extends Switch {

    addServices() {
        var service = new this.Service.Outlet(this.name, this.uuid);
        this.enablePower(service);
        this.addService(service);
    }

};

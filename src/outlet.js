"use strict";
var Switch = require('./switch.js');

module.exports = class Outlet extends Switch {

    getService() {
        return this.Service.Outlet;
    }

};

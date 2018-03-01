"use strict";
var Switch = require('./switch.js');

module.exports = class Lightbulb extends Switch {

    getService() {
        return this.Service.Lightbulb;
    }

};

"use strict";
var Switch = require('./switch.js');
var sprintf = require('yow/sprintf');

module.exports = class AlertSwitch extends Switch {

    setState(state) {
        this.platform.alerts = state;
        this.platform.pushover(sprintf('%s %s.', this.name, state ? 'ON' : 'OFF'));

        super.setState(state);
    }


};

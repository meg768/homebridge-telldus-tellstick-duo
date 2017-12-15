"use strict";
var TelldusSwitch = require('./switch.js');
var sprintf = require('yow/sprintf');

module.exports = class AlertSwitch extends TelldusSwitch {

    setState(state) {
        this.platform.alerts = state;
        this.platform.pushover(sprintf('%s %s.', this.displayName, state ? 'på' : 'av'));

        super.setState(state);
    }


};

"use strict";
var Switch = require('./switch.js');
var sprintf = require('yow/sprintf');

module.exports = class NotificationSwitch extends Switch {


    constructor(platform, device) {
        super(platform, device);

        this.platform.notifications = this.getState();
    }

    setState(state) {
        this.platform.notifications = true;
        super.setState(state);
        this.platform.notifications = state;
    }

};

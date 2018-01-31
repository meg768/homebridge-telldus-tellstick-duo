"use strict";
var Switch = require('./switch.js');
var sprintf = require('yow/sprintf');

module.exports = class NotificationSwitch extends Switch {


    constructor(platform, config) {
        super(platform, config);

        this.platform.notifications = this.getState();
    }

    setState(state) {
        this.platform.notifications = true;
        super.setState(state);
        this.platform.notifications = state;
    }

};

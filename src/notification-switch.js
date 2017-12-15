"use strict";
var TelldusSwitch = require('./switch.js');
var sprintf = require('yow/sprintf');

module.exports = class NotificationSwitch extends TelldusSwitch {


    setState(state) {

        super.setState(state);

        var alert = sprintf('%s %s', this.displayName, state ? 'ON' : 'OFF');

        if (state) {
            if (this.config.on)
                alert = this.config.on;
        }
        else {
            if (this.config.off)
                alert = this.config.off;
        }

        this.platform.notifications = state;
        this.platform.alert(alert);
    }

};

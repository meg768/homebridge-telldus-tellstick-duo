"use strict";

module.exports = function(homebridge) {
    homebridge.registerPlatform('homebridge-telldus-tellstick-duo', 'Telldus Tellstick Duo', require('./src/platform.js'));
};

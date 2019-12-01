"use strict";

module.exports = function(homebridge) {
    console.log('Loading platform ...');
    homebridge.registerPlatform('homebridge-telldus-tellstick-duo', 'Telldus Tellstick Duo', require('./src/platform.js'));
};

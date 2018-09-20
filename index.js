"use strict";

var Server = require('./src/server.js');

module.exports = function(homebridge) {
    homebridge.registerPlatform('homebridge-telldus-tellstick-duo', 'Telldus Tellstick Duo', require('./src/platform.js'));
};

var server = new Server();

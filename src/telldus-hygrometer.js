"use strict";

var TelldusAccessory = require('./telldus-accessory.js');

module.exports = class TelldusHygrometer extends TelldusAccessory {

    getServices() {
        var services = super.getServices();
        var service  = new this.Service.HumiditySensor(this.name);
        var chars    = service.getCharacteristic(this.Characteristic.CurrentRelativeHumidity);

        chars.on('get', (callback) => {
            callback(null, this.device.humidity);
        });

        services.push(service);

        return services;
    }

};

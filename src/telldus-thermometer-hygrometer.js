"use strict";

var TelldusThermometer = require('./telldus-thermometer.js');

module.exports = class TelldusThermometerHygrometer extends TelldusThermometer {

    getServices() {
        var services = super.getServices();
        var service  = new this.Service.TemperatureSensor(this.name);
        var chars    = service.getCharacteristic(this.Characteristic.CurrentRelativeHumidity);

        chars.on('get', (callback) => {
            callback(null, this.device.humidity);
        });

        services.push(service);

        return services;
    }

};

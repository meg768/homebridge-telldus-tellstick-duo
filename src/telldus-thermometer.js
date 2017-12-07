"use strict";

var TelldusAccessory = require('./telldus-accessory.js');

module.exports = class TelldusThermometer extends TelldusAccessory {

    getServices() {
        var services = super.getServices();
        var service  = new this.Service.TemperatureSensor(this.name);
        var chars    = servce.getCharacteristic(this.Characteristic.CurrentTemperature);

        chars.setProps({minValue: -50});

        chars.on('get', (callback) => {
            callback(null, this.device.temperature);
        });

        services.push(service);

        return services;
    }

};

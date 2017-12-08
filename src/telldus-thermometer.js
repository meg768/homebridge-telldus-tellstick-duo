"use strict";

var TelldusAccessory = require('./telldus-accessory.js');

module.exports = class TelldusThermometer extends TelldusAccessory {

    getServices() {
        var services = super.getServices();
        var service  = new this.Service.TemperatureSensor(this.name);
        var chars    = service.getCharacteristic(this.Characteristic.CurrentTemperature);

        chars.setProps({minValue: -50});

        chars.on('get', (callback) => {
            callback(null, parseFloat(this.device.temperature));
        });

        services.push(service);

        return services;
    }

};

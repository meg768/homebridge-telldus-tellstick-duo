"use strict";

var Sensor = require('./sensor.js');

module.exports = class ThermometerHygrometer extends Sensor {

    constructor(platform, config) {
        super(platform, config);

        this.temperature = 20; //config.temperature;
        this.humidity = 30; //config.humidity;

        this.initialize();
    }

    initialize() {

        this.addTemperatureSensor();
        this.addHumiditySensor();
    }

    addTemperatureSensor() {
        var service = new this.Service.TemperatureSensor(this.name, this.uuid);

        this.enableCurrentTemperature(service);
        this.addService(service);
    }

    addHumiditySensor() {
        var service = new this.Service.HumiditySensor(this.name, this.uuid);

        this.enableCurrentRelativeHumidity(service);
        this.addService(service);
    }

    enableCurrentTemperature(service) {
        var characteristics = service.getCharacteristic(this.Characteristic.CurrentTemperature);

        characteristics.setProps({minValue: -50});
        characteristics.updateValue(this.temperature);

        characteristics.on('get', (callback) => {
            callback(null, this.temperature);
        });

        this.on('temperatureChanged', (temperature) => {
            this.temperature = temperature;

            this.debug('Reflecting temperature to HomeKit. %s is now %s.', this.config.name, temperature);
            characteristics.updateValue(this.temperature);
        });
    }

    enableCurrentRelativeHumidity(service) {
        var characteristics = service.getCharacteristic(this.Characteristic.CurrentRelativeHumidity);

        characteristics.updateValue(this.humidity);

        characteristics.on('get', (callback) => {
            callback(null, this.humidity);
        });

        this.on('humidityChanged', (humidity) => {
            this.humidity = humidity;

            this.debug('Reflecting humidity to HomeKit. %s is now %s.', this.config.name, humidity);
            characteristics.updateValue(this.humidity);
        });
    }
};

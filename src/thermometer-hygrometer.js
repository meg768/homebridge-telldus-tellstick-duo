"use strict";

var Accessory = require('./accessory.js');

module.exports = class ThermometerHygrometer extends Accessory {

    constructor(platform, device) {
        super(platform, device);

        switch (this.device.model) {
            case 'temperaturehumidity': {
                this.setupHumiditySensor();
                this.setupTemperatureSensor();
                break;
            }
            case 'temperature': {
                this.setupTemperatureSensor();
                break;
            }
            case 'humidity': {
                this.setupHumiditySensor();
                break;
            }
            default: {
                this.log('Unknown sensor model', this.device.model);
            }
        }
    }

    setupTemperatureSensor() {
        var service = new this.Service.TemperatureSensor(this.name, this.device.name);
        var characteristics = service.getCharacteristic(this.Characteristic.CurrentTemperature);

        characteristics.setProps({minValue: -50});
        characteristics.updateValue(this.getTemperature());

        characteristics.on('get', (callback) => {
            callback(null, this.getTemperature());
        });

        this.on('temperatureChanged', () => {
            var temperature = this.getTemperature();

            this.log('Reflecting temperature to HomeKit. %s is now %s.', this.device.name, temperature);
            characteristics.updateValue(temperature);

            this.log('Done.');
        });

        this.services.push(service);
    }

    setupHumiditySensor() {
        var service = new this.Service.HumiditySensor(this.name, this.uuid);
        var characteristics = service.getCharacteristic(this.Characteristic.CurrentRelativeHumidity);

        characteristics.updateValue(this.getHumidity());

        characteristics.on('get', (callback) => {
            callback(null, this.getHumidity());
        });

        this.on('humidityChanged', () => {
            var humidity = this.getHumidity();

            this.log('Reflecting humidity to HomeKit. %s is now %s.', this.device.name, humidity);
            characteristics.updateValue(humidity);

            this.log('Done.');
        });

        this.services.push(service);
    }

    getTemperature() {
        return this.device.temperature ? parseFloat(this.device.temperature) : 0;
    }

    getHumidity() {
        return this.device.humidity;
    }
};

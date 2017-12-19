"use strict";

var TelldusAccessory = require('./accessory.js');
var Timer = require('yow/timer');
var isString = require('yow/is').isString;

module.exports = class TelldusSensor extends TelldusAccessory {

    setupSensor(Service, Characteristic, timeout) {

        this.state = false;
        this.timer = new Timer();

        if (isString(this.config.appearance) && this.config.appearance.toLowerCase() == "switch") {
            Service = this.Service.Switch;
            Characteristic = this.Characteristic.On;
        }
        
        var service = new Service(this.displayName, this.device.name);
        var characteristics = service.getCharacteristic(Characteristic);

        characteristics.updateValue(this.state);

        characteristics.on('set', (state, callback) => {
            this.state = state;
            this.timer.cancel();
            callback();
        });


        characteristics.on('get', (callback) => {
            callback(null, this.state);
        });

        this.on('stateChanged', () => {

            if (!this.state) {
                this.log('Movement detected on sensor', this.device.name);

                this.platform.notify(this.config.notify);
                this.platform.alert(this.config.alert);

                this.timer.cancel();
                characteristics.updateValue(this.state = true);

                this.timer.setTimer(timeout * 1000, () => {
                    this.log('Resetting movement for sensor', this.device.name);
                    characteristics.updateValue(this.state = false);
                });
            }
        });

        this.services.push(service);
    }


};

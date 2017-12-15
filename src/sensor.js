"use strict";

var TelldusAccessory = require('./accessory.js');
var Timer = require('yow/timer');

module.exports = class TelldusSensor extends TelldusAccessory {

    setupSensor(Service, Characteristic, timeout) {

        this.state = false;

        var service = new Service(this.displayName, this.device.name);
        var characteristics = service.getCharacteristic(Characteristic);

        characteristics.updateValue(this.state);

        characteristics.on('get', (callback) => {
            callback(null, this.state);
        });

        this.on('stateChanged', () => {
            var timer = new Timer();

            if (!this.state) {
                this.log('Movement detected on sensor', this.device.name);

                this.platform.notify(this.config.notify);
                this.platform.alert(this.config.alert);

                timer.cancel();
                characteristics.updateValue(this.state = true);

                timer.setTimer(timeout * 1000, () => {
                    this.log('Resetting movement for sensor', this.device.name);
                    characteristics.updateValue(this.state = false);
                });
            }
        });

        this.services.push(service);
    }


};

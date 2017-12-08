"use strict";


module.exports = class TelldusAccessory {

    constructor(platform, config, device) {

        if (!device.name)
            throw new Error('All devices must have a name.');

        this.log = platform.log;
        this.config = config;
        this.homebridge = platform.homebridge;
        this.device = device;
        this.Characteristic = platform.homebridge.hap.Characteristic;
        this.Service = platform.homebridge.hap.Service;

        // A device must have a name present
        this.name = this.config.name || device.name;
    }

    identify(callback) {
        this.log('Identify called for accessory', this.name);
        callback();

    }

    getServices() {
        var accessoryInfo = new this.Service.AccessoryInformation();

        accessoryInfo.setCharacteristic(this.Characteristic.Manufacturer, this.device.protocol);
        accessoryInfo.setCharacteristic(this.Characteristic.Model, this.device.model);
        accessoryInfo.setCharacteristic(this.Characteristic.SerialNumber, this.device.id);

        return [accessoryInfo];

    }

};

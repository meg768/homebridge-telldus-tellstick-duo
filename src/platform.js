"use strict";

var Path     = require('path');
var Events   = require('events');
var telldus  = require('telldus');
var Pushover = require('pushover-notifications');

var Switch                = require('./switch.js');
var NotificationSwitch    = require('./notification-switch.js');
var AlertSwitch           = require('./alert-switch.js');
var MotionSensor          = require('./motion-sensor.js');
var OccupancySensor       = require('./occupancy-sensor.js');
var ThermometerHygrometer = require('./thermometer-hygrometer.js');

var sprintf  = require('yow/sprintf');
var isString = require('yow/is').isString;


module.exports = class TelldusPlatform  {

    constructor(log, config, homebridge) {

        this.config        = config;
        this.log           = log;
        this.homebridge    = homebridge;
        this.notifications = true;
        this.alerts        = true;
        this.devices       = [];
        this.sensors       = [];

        // Load .env
        require('dotenv').config({path: Path.join(process.env.HOME, '.homebridge/.env')});

        if (process.env.PUSHOVER_USER && process.env.PUSHOVER_TOKEN) {
            this.log('Using Pushover credentials from .env');

            config.pushover = {
                user: process.env.PUSHOVER_USER,
                token: process.env.PUSHOVER_TOKEN
            };
        }


        telldus.getDevicesSync().forEach((item) => {

            if (item.type == 'DEVICE') {
                var device = {};

                device.id       = item.id;
                device.name     = item.name;
                device.type     = 'device';
                device.protocol = item.protocol;
                device.model    = item.model;
                device.state    = item.status && item.status.name == 'ON';

                var config = this.config.devices ? this.config.devices[device.name] : {};

                if (config) {

                    switch(device.model) {
                        case 'selflearning-switch':
                        case 'codeswitch': {
                            var type = config.type ? config.type : 'switch';

                            switch(type.toLowerCase()) {
                                case 'motionsensor': {
                                    this.devices.push(new MotionSensor(this, config, device));
                                    break;
                                }
                                case 'alertswitch': {
                                    this.devices.push(new AlertSwitch(this, config, device));
                                    break;
                                }
                                case 'notificationswitch': {
                                    this.devices.push(new NotificationSwitch(this, config, device));
                                    break;
                                }
                                case 'occupancysensor': {
                                    this.devices.push(new OccupancySensor(this, config, device));
                                    break;
                                }
                                case 'lightbulb': {
                                    this.devices.push(new Switch(this, config, device));
                                    break;
                                }
                                case 'switch': {
                                    this.devices.push(new Switch(this, config, device));
                                    break;
                                }
                                default: {
                                    break;
                                }
                            }
                        }
                    }
                }

            }


        });

        // Add sensors
        telldus.getSensorsSync().forEach((item) => {

            var config = this.config.sensors ? this.config.sensors[item.id] : {};

            if (config) {
                var device = {};

                device.id = item.id;
                device.name = sprintf('Sensor %d', item.id);
                device.type = 'sensor';
                device.protocol = item.protocol;
                device.model = item.model;

                if (device.model == 'EA4C')
                    device.model = 'temperature';

                if (device.model == '1A2D')
                    device.model = 'temperaturehumidity';

                if (item.data) {
                    item.data.forEach((entry) => {
                        if (entry.type == 'TEMPERATURE')
                            device.temperature = entry.value;
                        if (entry.type == 'HUMIDITY')
                            device.humidity = entry.value;

                        device.timestamp = entry.timestamp;

                    });

                }

                switch (device.model) {
                    case 'humidity':
                    case 'temperature':
                    case 'temperaturehumidity': {
                        this.sensors.push(new ThermometerHygrometer(this, config, device));
                        break;
                    }
                }


            }
        });

        telldus.addDeviceEventListener((id, status) => {

            var accessory = this.findDevice(id);

            if (accessory != undefined) {
                var device = accessory.device;

                device.state = status.name == 'ON';
                accessory.emit('stateChanged', device.state);

                this.log('Device event:', JSON.stringify(device));

            }
            else {
                this.log('Device', id, 'not found.');
            }
        });

        telldus.addSensorEventListener((id, protocol, model, type, value, timestamp) => {

            var accessory = this.findSensor(id);

            if (accessory != undefined) {
                var device = accessory.device;

                device.timestamp = timestamp;

                if (protocol == 'temperature' || (protocol == 'temperaturehumidity' && type == 1)) {
                    device.temperature = value;
                    accessory.emit('temperatureChanged', value, timestamp);
                }

                if (protocol == 'humidity' || (protocol == 'temperaturehumidity' && type == 2)) {
                    device.humidity = value;
                    accessory.emit('humidityChanged', value, timestamp);

                }

                this.log('Sensor event:', JSON.stringify(device));

            }
            else {
                this.log('Sensor', id, 'not found.');
            }

        });


    }

    findDevice(id) {

        for (var i = 0; i < this.devices.length; i++) {
            var accessory = this.devices[i];

            if (id == accessory.device.id)
                return accessory;

            if (id == accessory.device.name) {
                return accessory;
            }
        };
    }

    findSensor(id) {

        for (var i = 0; i < this.sensors.length; i++) {
            var accessory = this.sensors[i];

            if (id == accessory.device.id)
                return accessory;

            if (id == accessory.device.name) {
                return accessory;
            }
        };
    }

    notify(message) {
        try {
            if (this.notifications)
                this.pushover(message);

        }
        catch (error) {
            this.log(error);
        }
    }

    alert(message) {
        try {
            if (this.alerts)
                this.pushover(message);

        }
        catch (error) {
            this.log(error);
        }
    }

    pushover(message) {
        if (isString(message) && message.length > 0 && this.config.pushover) {
            if (!this.config.pushover.user)
                throw new Error('You must configure Pushover user.');

            if (!this.config.pushover.token)
                throw new Error('You must configure Pushover token.');

            var push = new Pushover(this.config.pushover);

            this.log('Sending message:', message);

            push.send({priority:0, message:message}, (error, result) => {
                if (this.error)
                    this.log(error);
            });

        }
    }

    accessories(callback) {
        callback(this.devices.concat(this.sensors));
    }
}

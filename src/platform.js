"use strict";

var Path     = require('path');
var Events   = require('events');
var telldus  = require('telldus');
var Pushover = require('pushover-notifications');

var Switch                = require('./switch.js');
var NotificationSwitch    = require('./notification-switch.js');
var MotionSensor          = require('./motion-sensor.js');
var ThermometerHygrometer = require('./thermometer-hygrometer.js');

var sprintf  = require('yow/sprintf');
var isString = require('yow/is').isString;


module.exports = class TelldusPlatform  {

    constructor(log, config, homebridge) {

        this.config        = config;
        this.log           = log;
        this.homebridge    = homebridge;
        this.notifications = false;
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

        this.registerTellstickDevices();

        telldus.getDevicesSync().forEach((item) => {

            if (item.type == 'DEVICE') {

                console.log(item.name, item.status.name);
                var uuid = this.getUniqueDeviceKey(item.id);
                var initialState = (item.status != undefined && item.status.name == 'ON');

                // Look up the device in config
                var device = undefined;

                if (config.devices) {
                    device = config.devices.find((iterator) => {
                        return iterator.uuid == uuid;
                    });
                }

                if (device == undefined) {
                    device = {};
                    device.id         = item.id;
                    device.name       = item.name;
                    device.protocol   = item.protocol;
                    device.model      = item.model;
                    device.uuid       = uuid;
                    device.state      = (item.status != undefined && item.status.name == 'ON');
                    device.parameters = {};

                    // Read parameters
                    ['house', 'group', 'unit', 'code'].forEach((name) => {
                        var value = telldus.getDeviceParameterSync(device.id, name, '');

                        if (value != '')
                            device.parameters[name] = value;
                    });
                }


                if (device.type == undefined)
                    device.type = 'switch';

                var accessory = undefined;

                switch(device.model) {
                    case 'selflearning-switch':
                    case 'codeswitch': {
                        switch(device.type) {
                            case 'occupancy-sensor':
                            case 'motion-sensor': {
                                accessory = new MotionSensor(this, device, initialState);
                                break;
                            }
                            case 'notification-switch': {
                                accessory = new NotificationSwitch(this, device, initialState);
                                break;
                            }
                            case 'lightbulb':
                            case 'outlet':
                            case 'switch': {
                                accessory = new Switch(this, device, initialState);
                                break;
                            }
                            default: {
                                this.log('Unknown type \'%s\'.', device.type);
                                accessory = new Switch(this, device, initialState);
                                break;
                            }
                        }
                    }
                }

                if (accessory != undefined) {

                    this.devices.push(accessory);
                }
            }


        });

        // Add defined sensors
/*
        telldus.getSensorsSync().forEach((item) => {

            var config = this.config.sensors.find((iterator) => {
                return iterator.id == item.id;
            });

            if (config) {
                var device = {};

                device.id = item.id;
                device.name = config.name;
                device.type = 'sensor';
                device.protocol = item.protocol;
                device.model = item.model;
                device.id = item.id;
                device.uuid = this.generateUUID(item.id);

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
                        this.sensors.push(new ThermometerHygrometer(this, device));
                        break;
                    }
                }


            }
        });
*/
        telldus.addDeviceEventListener((id, status) => {

            var accessory = this.devices.find((item) => {
                return item.device.id == id;
            });

            if (accessory != undefined) {
                accessory.emit('stateChanged', status.name == 'ON');
                this.log('Device event:', JSON.stringify({id:id, status:status}));

            }
            else {
                this.log('Device', id, 'not found.');
            }
        });
/*
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
*/
        telldus.addRawDeviceEventListener((id, data) => {

            var packet = {id:id};

            data.split(';').forEach((item) => {
                item = item.split(':');

                if (item.length == 2)
                    packet[item[0]] = item[1];
            });

            this.log('Raw event:', JSON.stringify(packet));
        });

    }

    generateUUID(id) {
        return this.homebridge.hap.uuid.generate(id.toString());
    }

    getUniqueDeviceKey(id) {
        var parameters = [];

        parameters.push(telldus.getProtocolSync(id));
        parameters.push(telldus.getModelSync(id));

        ['house', 'group', 'unit', 'code'].forEach((name) => {
            var value = telldus.getDeviceParameterSync(id, name, '');

            if (value != '')
                parameters.push(value);
        });

        return this.generateUUID(parameters.join(':'));

    }

    registerTellstickDevices() {

        var devices = this.config.devices;

		if (devices != undefined) {

            var initialState = {};

            // Remove all previous devices
    		telldus.getDevicesSync().forEach((device) => {
    			telldus.removeDeviceSync(device.id);

                initialState[getUniqueDeviceKey(device.id)] = (device.status != undefined && device.status.name == 'ON');
    		});

    		for (var index in devices) {
    			var device = devices[index];

    			var id = telldus.addDeviceSync();

    			this.log(sprintf('Registering Tellstick device \'%s\'...', device.name));

    			telldus.setNameSync(id, device.name);
    			telldus.setProtocolSync(id, device.protocol);
    			telldus.setModelSync(id, device.model);

    			for (var parameterName in device.parameters) {
    				telldus.setDeviceParameterSync(id, parameterName, device.parameters[parameterName].toString());
    			}

                // Update device with ID and UUID
                device.id = id;
                device.uuid = this.getUniqueDeviceKey(id);
                device.state = initialState[device.uuid];
    		}
        }
	}



    notify(message) {
        if (this.notifications)
            this.pushover(message);
    }

    alert(message) {
        if (this.alerts)
            this.pushover(message);
    }


    pushover(message) {
        try {
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
        catch (error) {
            this.log(error);
        }
    }

    accessories(callback) {
        callback(this.devices.concat(this.sensors));
    }
}

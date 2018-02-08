"use strict";

var Path     = require('path');
var Events   = require('events');
var telldus  = require('telldus');
var Pushover = require('pushover-notifications');
var Schedule = require('node-schedule');

var Switch                = require('./switch.js');
var NotificationSwitch    = require('./notification-switch.js');
var Lightbulb             = require('./lightbulb.js');
var Outlet                = require('./outlet.js');
var MotionSensor          = require('./motion-sensor.js');
var ThermometerHygrometer = require('./thermometer-hygrometer.js');
var Thermometer           = require('./thermometer.js');
var Hygrometer            = require('./hygrometer.js');

var sprintf  = require('yow/sprintf');
var isString = require('yow/is').isString;


module.exports = class TelldusPlatform  {

    constructor(log, config, homebridge) {

        this.config        = config;
        this.log           = log;
        this.debug         = log;
        this.homebridge    = homebridge;
        this.notifications = false;
        this.alerts        = true;
        this.devices       = [];
        this.sensors       = [];
        this.ping          = new Date();

        // Load .env
        require('dotenv').config({path: Path.join(process.env.HOME, '.homebridge/.env')});

        if (process.env.PUSHOVER_USER && process.env.PUSHOVER_TOKEN) {
            this.log('Using Pushover credentials from .env');

            config.pushover = {
                user: process.env.PUSHOVER_USER,
                token: process.env.PUSHOVER_TOKEN
            };
        }

        this.installDevices();
        this.createDeviceAccessories();
        this.createSensorAccessories();
        this.addEventListeners();
        this.enablePing();

    }



	enablePing() {
        var range = require('yow/range');
		var timeout = 10000;
		var rule    = new Schedule.RecurrenceRule();
		rule.minute = range(0, 60, 5);

		Schedule.scheduleJob(rule, () => {
			var device = this.config.devices[0];

			if (device != undefined) {
				this.log('Pinging device %s.', device.name);

				this.ping = new Date();
				telldus.turnOnSync(device.id);

				setTimeout(() => {
					var now = new Date();
					var delta = now - this.ping;

					if (delta >= timeout) {
						this.log('Tellstick not responding.');
					}

				}, timeout);
			}
			else {
				this.log('Ping device not found.');
			}
		});

	}

    installDevices() {

		if (this.config.devices != undefined) {

            var initialState = {};

            // Remove all previous devices
            // But save their state
    		telldus.getDevicesSync().forEach((device) => {
                var uuid = this.getUniqueDeviceKey(device.id);
                var state = (device.status != undefined && device.status.name == 'ON');

                initialState[uuid] = state;

    			telldus.removeDeviceSync(device.id);
    		});

    		this.config.devices.forEach((config) => {
    			var id = telldus.addDeviceSync();

    			telldus.setNameSync(id, config.name);
    			telldus.setProtocolSync(id, config.protocol);
    			telldus.setModelSync(id, config.model);

    			for (var parameterName in config.parameters) {
    				telldus.setDeviceParameterSync(id, parameterName, config.parameters[parameterName].toString());
    			}

                // Update device with ID and UUID
                config.id = id;
                config.uuid = this.getUniqueDeviceKey(id);
                config.state = initialState[config.uuid];
    		})
        }
	}


    createDeviceAccessories() {

        telldus.getDevicesSync().forEach((item) => {

            if (item.type == 'DEVICE') {

                var uuid = this.getUniqueDeviceKey(item.id);

                // Look up the device in config
                var config = undefined;

                if (this.config.devices) {
                    config = this.config.devices.find((iterator) => {
                        return iterator.uuid == uuid;
                    });
                }

                if (config == undefined) {
                    config = {};
                    config.id         = item.id;
                    config.name       = item.name;
                    config.protocol   = item.protocol;
                    config.model      = item.model;
                    config.uuid       = uuid;
                    config.state      = (item.status != undefined && item.status.name == 'ON');
                    config.parameters = {};

                    // Read parameters
                    ['house', 'group', 'unit', 'code'].forEach((name) => {
                        var value = telldus.getDeviceParameterSync(config.id, name, '');

                        if (value != '')
                            config.parameters[name] = value;
                    });
                }


                if (config.type == undefined)
                    config.type = 'switch';

                switch(config.model) {
                    case 'selflearning-switch':
                    case 'codeswitch': {
                        switch(config.type) {
                            case 'occupancy-sensor':
                            case 'motion-sensor': {
                                this.devices.push(new MotionSensor(this, config));
                                break;
                            }
                            case 'notification-switch': {
                                this.devices.push(new NotificationSwitch(this, config));
                                break;
                            }
                            case 'lightbulb': {
                                this.devices.push(new Lightbulb(this, config));
                                break;
                            }
                            case 'outlet':
                            case 'switch': {
                                this.devices.push(new Switch(this, config));
                                break;
                            }
                            default: {
                                this.log('Unknown type \'%s\'.', config.type);
                                this.devices.push(new Switch(this, config));
                                break;
                            }
                        }
                    }
                }
            }


        });
    }

    createSensorAccessories() {

        // Add defined sensors

        telldus.getSensorsSync().forEach((item) => {

            var config;

            if (this.config.sensors) {
                config = this.config.sensors.find((iterator) => {
                    return iterator.id == item.id;
                });

            }


            if (config) {
                if (config.model == 'EA4C')
                    config.model = 'temperature';

                if (config.model == '1A2D')
                    config.model = 'temperaturehumidity';

                config.id = item.id;
                config.name = config.name;
                config.type = 'sensor';
                config.protocol = item.protocol;
                config.model = item.model;
                config.id = item.id;
                config.uuid = this.generateUUID(sprintf('%s:%s:%s', item.protocol, item.model, item.id));

                if (item.data) {
                    item.data.forEach((entry) => {
                        if (entry.type == 'TEMPERATURE')
                            config.temperature = parseFloat(entry.value);
                        if (entry.type == 'HUMIDITY')
                            config.humidity = parseFloat(entry.value);

                        config.timestamp = entry.timestamp;
                    });
                }

                switch (config.model) {
                    case 'humidity': {
                        this.sensors.push(new Humidity(this, config));
                        break;
                    }
                    case 'temperature': {
                        this.sensors.push(new Thermometer(this, config));
                        break;
                    }
                    case 'temperaturehumidity': {
                        this.sensors.push(new ThermometerHygrometer(this, config));
                        break;
                    }
                }


            }
        });

    }

    addEventListeners() {

        telldus.addDeviceEventListener((id, status) => {

            var accessory = this.devices.find((item) => {
                return item.config.id == id;
            });

            if (accessory != undefined) {
                this.log('Device event:', JSON.stringify({id:id, status:status}));
                this.ping = new Date();
                accessory.emit('stateChanged', status.name == 'ON');
            }
            else {
                this.log('Device %s not found.');
            }
        });

        telldus.addSensorEventListener((id, protocol, model, type, value, timestamp) => {

            var accessory = this.sensors.find((item) => {
                return item.config.id == id;
            });

            if (accessory != undefined) {
                this.log('Sensor event:', JSON.stringify({id:id, protocol:protocol, type:type, value:value, timestamp:timestamp}));

                if (protocol == 'temperature' || (protocol == 'temperaturehumidity' && type == 1)) {
                    accessory.emit('temperatureChanged', parseFloat(value), timestamp);
                }

                if (protocol == 'humidity' || (protocol == 'temperaturehumidity' && type == 2)) {
                    accessory.emit('humidityChanged', parseFloat(value), timestamp);
                }
            }

        });

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

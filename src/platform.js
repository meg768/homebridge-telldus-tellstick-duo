"use strict";

var Path = require('path');
var Events = require('events');
var telldus = require('telldus');
var Pushover = require('pushover-notifications');
var Schedule = require('node-schedule');

var Switch = require('./switch.js');
var NotificationSwitch = require('./notification-switch.js');
var Lightbulb = require('./lightbulb.js');
var Outlet = require('./outlet.js');
var MotionSensor = require('./motion-sensor.js');
var ThermometerHygrometer = require('./thermometer-hygrometer.js');
var Thermometer = require('./thermometer.js');
var Hygrometer = require('./hygrometer.js');

var sprintf = require('yow/sprintf');
var isString = require('yow/isString');


module.exports = class TelldusPlatform {

    constructor(log, config, homebridge) {

        this.config = config;
        this.log = log;
        this.homebridge = homebridge;
        this.notifications = false;
        this.alerts = true;
        this.devices = [];
        this.sensors = [];
        this.ping = new Date();

        // Load .env
        require('dotenv').config({
            path: Path.join(process.env.HOME, '.homebridge/.env')
        });

        if (process.env.PUSHOVER_USER && process.env.PUSHOVER_TOKEN) {
            this.log('Using Pushover credentials from .env');

            config.pushover = {
                user: process.env.PUSHOVER_USER,
                token: process.env.PUSHOVER_TOKEN
            };
        }

        this.installDevices();
        this.createDevices();
        this.createSensors();
        this.addEventListeners();
        this.enablePing();
        this.enableReboot();
        this.enableAliveAndWell();
        this.enableServer();
    }

    debug() {
    }

    enableServer() {
        var Server = require('./server.js');
        var server = new Server(this);
    }

    enableAliveAndWell() {
        var alive = this.config.alive;

        if (isString(alive)) {
            this.log('Enabling alive and well at cron-time "', alive, '"...');

            Schedule.scheduleJob(alive, () => {
                this.log('Alive and well...');
            });
        }

    }
    enableReboot() {

        var reboot = this.config.reboot;
        var exec = require('child_process').exec;

        if (isString(reboot)) {
            this.log('Enabling reboot at cron-time "', reboot, '"...');

            Schedule.scheduleJob(reboot, () => {
                this.alert('Had enuff. Rebooting.');

                exec('sudo reboot', (error, stdout, stderr) => {
                    this.alert('Did it.');
                });
            });
        }
    }


    enablePing() {
        var range = require('yow/range');
        var timeout = 10000;
        var rule = new Schedule.RecurrenceRule();
        var state = false;
        var reboot = false;

        rule.minute = range(0, 60, 10);

        var device = this.config.devices.find((iterator) => {
            return iterator.name == 'Ping';
        });

        if (device != undefined) {

            this.log('Enabling ping...');

            Schedule.scheduleJob(rule, () => {
                state = !state;

                this.debug('Pinging device \'%s\'. Setting to %s.', device.name, state);

                this.ping = new Date();

                if (state)
                    telldus.turnOnSync(device.id);
                else
                    telldus.turnOffSync(device.id);

                setTimeout(() => {
                    var now = new Date();
                    var delta = now - this.ping;

                    if (delta >= timeout) {
                        if (!reboot) {
                            reboot = true;
                            alert('Tellstick is not responding. A reboot is needed.');
                        }
                    }

                }, timeout);
            });

        }

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


    createDevices() {



        telldus.getDevicesSync();
        telldus.getDevicesSync();
        telldus.getDevicesSync();

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
                    config.id = item.id;
                    config.name = item.name;
                    config.protocol = item.protocol;
                    config.model = item.model;
                    config.uuid = uuid;
                    config.state = (item.status != undefined && item.status.name == 'ON');
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

                var device = undefined;

                switch (config.model) {
                    case 'selflearning-switch':
                    case 'codeswitch':
                        {
                            switch (config.type) {
                                case 'occupancy-sensor':
                                case 'motion-sensor':
                                    {
                                        device = new MotionSensor(this, config);
                                        break;
                                    }
                                case 'notification-switch':
                                    {
                                        device = new NotificationSwitch(this, config);
                                        break;
                                    }
                                case 'lightbulb':
                                    {
                                        device = new Lightbulb(this, config);
                                        break;
                                    }
                                case 'outlet':
                                case 'switch':
                                    {
                                        device = new Switch(this, config);
                                        break;
                                    }
                                default:
                                    {
                                        this.log('Unknown type \'%s\'.', config.type);
                                        device = new Switch(this, config);
                                        break;
                                    }
                            }
                        }
                }

                this.devices.push(device);

            }


        });
    }

    createSensors() {

        // Call a few times. It seems it is needed if the RPI was just booted
        telldus.getSensorsSync();
        telldus.getSensorsSync();
        telldus.getSensorsSync();

        telldus.getSensorsSync().forEach((item) => {

            var config = undefined;

            if (this.config.sensors) {
                config = this.config.sensors.find((iterator) => {
                    return iterator.id == item.id;
                });

            }

            if (config == undefined) {
                this.log('Sensor not defined.', item);
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

                var sensor = undefined;

                switch (config.model) {
                    case 'humidity':
                        {
                            sensor = new Humidity(this, config);
                            break;
                        }
                    case 'temperature':
                        {
                            sensor = new Thermometer(this, config);
                            break;
                        }
                    case 'temperaturehumidity':
                        {
                            sensor = new ThermometerHygrometer(this, config);
                            break;
                        }
                }

                if (sensor) {
                    this.sensors.push(sensor);
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
                this.debug('Device event:', JSON.stringify({
                    id: id,
                    status: status
                }));
                this.ping = new Date();
                accessory.emit('stateChanged', status.name == 'ON');
            } else {
                this.log('Device %s not found.');
            }
        });

        if (this.sensors.length > 0) {
            telldus.addSensorEventListener((id, protocol, model, type, value, timestamp) => {

                var accessory = this.sensors.find((item) => {
                    return item.config.id == id;
                });

                if (accessory != undefined) {
                    this.debug('Sensor event:', JSON.stringify({id:id, protocol:protocol, type:type, value:value, timestamp:timestamp}));

                    if (protocol == 'temperature' || (protocol == 'temperaturehumidity' && type == 1)) {
                        accessory.emit('temperatureChanged', parseFloat(value), timestamp);
                    }

                    if (protocol == 'humidity' || (protocol == 'temperaturehumidity' && type == 2)) {
                        accessory.emit('humidityChanged', parseFloat(value), timestamp);
                    }
                }

            });

        }
        else {
            this.log('No sensors defined. Skipping event listener for sensors...');
        }

        if (this.config.debug) {
            this.log('Adding raw event listener...');

            telldus.addRawDeviceEventListener((id, data) => {

                var packet = {
                    id: id
                };

                data.split(';').forEach((item) => {
                    item = item.split(':');

                    if (item.length == 2)
                        packet[item[0]] = item[1];
                });

                this.log('Raw event:', JSON.stringify(packet));
            });
        }
        else {
            this.log('Skipping raw event listener (config.debug not defined)...');
        }
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

                push.send({
                    priority: 0,
                    message: message
                }, (error, result) => {
                    if (this.error)
                        this.log(error);
                });

            }
        } catch (error) {
            this.log(error);
        }
    }

    accessories(callback) {
        callback(this.devices.concat(this.sensors));
    }
}

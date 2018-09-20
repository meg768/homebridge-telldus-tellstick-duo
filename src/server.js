#!/usr/bin/env node

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

var sprintf    = require('yow/sprintf');
var isString   = require('yow/is').isString;
var telldus    = require('telldus');


module.exports = class Server {

    constructor(platform) {
        this.platform = platform;
        this.devices = platform.config.devices;
        this.log = platform.log;

        Promise.resolve().then(function() {

            return Promise.resolve();

		})
		.then(() => {
			console.log('Initializing service...');

			app.set('port', 3000);
			app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
			app.use(bodyParser.json({limit: '50mb'}));
			app.use(cors());

			this.defineRoutes(app);

			app.listen(app.get('port'), function() {
				console.log("Tellstick service is running on port " + app.get('port'));
			});

		})
		.catch((error) => {
			console.error(error.stack);

		});
    }

    turnOn(device) {
        this.log('Turning on', device.name);
        telldus.turnOnSync(device.id);
        telldus.turnOnSync(device.id);
        telldus.turnOnSync(device.id);

    }

    turnOff(device) {
        this.log('Turning off', device.name);
        telldus.turnOffSync(device.id);
        telldus.turnOffSync(device.id);
        telldus.turnOffSync(device.id);

    }

	defineRoutes(app) {

		app.get('/hello', (request, response) => {
			response.status(200).json({status:'OK'});
		});

		app.put('/turnoff',  (request, response) => {
			var options = Object.assign({}, request.body, request.query);

			if (isString(options)) {
				options = {name:options};
			}

            var device = this.devices.find((iterator) => {
                return iterator.id == options.id;
            });

            if (device != undefined) {
                this.turnOff(device);
            }
            else {
                this.log('Device not found', options);
            }

			response.status(200).json(options);

		});

        app.put('/turnon',  (request, response) => {
			var options = Object.assign({}, request.body, request.query);

			if (isString(options)) {
				options = {name:options};
			}

            var device = this.devices.find((iterator) => {
                return iterator.id == options.id;
            });

            if (device != undefined) {
                this.turnOn(device);
            }
            else {
                this.log('Device not found', options);
            }

			response.status(200).json(options);

		});


	}

};

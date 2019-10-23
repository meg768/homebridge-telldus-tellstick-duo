#!/usr/bin/env node

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

var isString   = require('yow/isString');
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

        setImmediate(() => {
            telldus.turnOnSync(device.id);
        });

        setImmediate(() => {
            telldus.turnOnSync(device.id);
        });

        setImmediate(() => {
            telldus.turnOnSync(device.id);
        });

    }

    turnOff(device) {
        this.log('Turning off', device.name);
        telldus.turnOffSync(device.id);

        setImmediate(() => {
            telldus.turnOffSync(device.id);
        });

        setImmediate(() => {
            telldus.turnOffSync(device.id);
        });

        setImmediate(() => {
            telldus.turnOffSync(device.id);
        });

    }

	defineRoutes(app) {

		app.get('/hello', (request, response) => {
			response.status(200).json({status:'OK'});
		});

        app.put('/devices/:identity',  (request, response) => {
            try {
                var options = Object.assign({}, request.body, request.query);

                if (options.state == undefined) {
                    throw new Error('State not specified.');
                }

                if (isString(options.state)) {
                    switch (options.state.toUpperCase()) {
                        case 'ON': {
                            options.state = true;
                            break;
                        }
                        case 'OFF': {
                            options.state = false;
                            break;
                        }
                        default: {
                            throw new Error('Invalid state specified');
                        }
                    }
                }

                var device = this.devices.find((iterator) => {
                    return iterator.identity == request.params.identity;
                });

                if (device == undefined) {
                    throw new Error('Specified device not found.');
                }

                if (options.state) {
                    this.turnOn(device);
                }
                else {
                    this.turnOff(device);
                }

    			response.status(200).json({message:'OK'});

            }
            catch (error) {
                response.status(404).json({error: error.message});

            }

		});



	}

};

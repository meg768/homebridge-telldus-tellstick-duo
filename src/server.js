#!/usr/bin/env node

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

var sprintf    = require('yow/sprintf');
var isString   = require('yow/is').isString;
var telldus    = require('telldus');

var Module = module.exports = function(options) {



    options = options || {};


	function defineRoutes(app) {

		app.get('/hello', function (request, response) {
			response.status(200).json({status:'OK'});
		});

		app.get('/off', function (request, response) {
			var options = Object.assign({}, request.body, request.query);

			if (isString(options)) {
				options = {symbol:options};
			}

			response.status(200).json(options);

		});



	}

	function run() {


		Promise.resolve().then(function() {

            return Promise.resolve();

		})
		.then(function() {
			console.log('Initializing service...');

			app.set('port', (options.port || 3000));
			app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
			app.use(bodyParser.json({limit: '50mb'}));
			app.use(cors());

			defineRoutes(app);

			app.listen(app.get('port'), function() {
				console.log("Tellstick service is running on port " + app.get('port'));
			});

		})
		.catch(function(error) {
			console.error(error.stack);

		});

	}

    run();

};

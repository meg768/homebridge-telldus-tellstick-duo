# homebridge-telldus-tellstick-duo
Homebridge for Telldus Tellstick Duo.

A HomeBridge plugin for anyone with a working setup using a Telldus Tellstick Duo.
This module uses the npm module https://www.npmjs.com/package/telldus instead of
the **tdtool** command line utility that is used by the npm module **homebridge-telldus-tdtool**
uses (https://www.npmjs.com/package/homebridge-telldus-tdtool).


## Installation

First, make sure you have the necessary components to install the **telldus** module.
Please refer to https://www.npmjs.com/package/telldus for this.

Secondly, install Homebridge. See https://www.npmjs.com/package/homebridge for more information.
Then install this plugin.

    $ sudo npm install homebridge-telldus-tellstick-duo -g

## Configuration File

Configure your **~/.homebridge/config.json** with the following platform.


    {
        "bridge": {
            "name": "Homebridge",
            "username": "CC:22:3D:E3:CE:30",
            "port": 51826,
            "pin": "031-45-154"
        },

        "description": "This is an example configuration file.",

        "platforms": [{
            "platform": "Telldus Tellstick Duo",
            "name": "Telldus Tellstick Duo"
        }]


    }

After this, start **homebridge**, scan the presented code with your iPhone, and hopefully
you will se this plugin in your iPhone Home app.

## What This Plugin Does

This plugin simply extracts all devices currently in use by the Telldus Tellstick Duo
and exposes them to HomeKit and you have the ability to turn the switches on or off.
And, of course, you may change the device names and group them into rooms on your iPhone or iPad.

The following Telldus models are supported

- selflearning-switch
- codeswitch
- temperature
- temperaturehumidity


## Useful Links

* https://github.com/nfarina/homebridge
* http://blog.theodo.fr/2017/08/make-siri-perfect-home-companion-devices-not-supported-apple-homekit/

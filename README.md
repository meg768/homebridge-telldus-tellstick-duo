# homebridge-telldus-tellstick-duo
Homebridge for Telldus Tellstick Duo

A HomeKit plugin for anyone with a working setup using a Telldus Tellstick Duo.
This module uses the NPM module https://www.npmjs.com/package/telldus instead of
the **tdtool** command. Currently, it only supports switch devices.

## Installation

First, make sure you have the necessary components to install the **telldus** module.
Please refer to https://www.npmjs.com/package/telldus for this.

Secondly, install Homebridge. See https://www.npmjs.com/package/homebridge for more information.
Then install this plugin.

    $ sudo install homebridge-telldus-tellstick-duo -g

Configure your **~/homebridge/config.json** with the following platform.

## ~/homebridge/config.json

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

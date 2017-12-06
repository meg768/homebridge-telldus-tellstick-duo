# homebridge-telldus-tellstick-duo
Homebridge for Telldus Tellstick Duo

A HomeKit plugin for anyone with a working setup using a Telldus Tellstick Duo.
This module uses the NPM module https://www.npmjs.com/package/telldus instead of
the **tdtool** command. Currently, it only supports switch devices.

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

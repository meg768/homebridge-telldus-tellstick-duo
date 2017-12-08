# homebridge-telldus-tellstick-duo
Homebridge for Telldus Tellstick Duo.

A HomeBridge plugin for anyone with a working setup using a Telldus Tellstick Duo.
This module uses the npm module https://www.npmjs.com/package/telldus instead of
the **tdtool** command line utility that is used by the npm module
(https://www.npmjs.com/package/homebridge-telldus-tdtool). This plugin also supports
motion sensors so they may be automated in the Home app on your iPhone.

## Installation

First, make sure you have the necessary components to install the **telldus** module.
Please refer to https://www.npmjs.com/package/telldus for this.

Secondly, install Homebridge. See https://www.npmjs.com/package/homebridge for more information.
Then install this plugin.

    $ sudo npm install homebridge-telldus-tellstick-duo -g

## Configuration File

Configure your **~/.homebridge/config.json** with the following platform.


```javascript
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
```

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

## Additional Configuration

Optionally, you may configure this plugin with the following additions.

### Motion Sensors

Since motion sensors registered in your Tellstick Duo acts like
normal switches this plugin cannot distinguish between them. The following example tells this plugin that
the device **RV-01** is a motion sensor and behaves like it in HomeKit, turning it on
for a while and then automatically turning it off.

```javascript

    {
        ...
        "platforms": [{
            "platform": "Telldus Tellstick Duo",
            "name": "Telldus Tellstick Duo",

            "devices": {
                "RV-01": {
                    "type": "MotionSensor",
                    "triggerLength": 10
                }
            }

        }]
        ...
    }
```


The **triggerLength** entry is optional and specifies, in seconds,
how long the motion sensor should be in a triggered state. Default is 5 seconds.

### Switches

By default, every device is represented by a lightbulb in HomeKit. The following
example shows how to change the device **VS-05** into a switch in HomeKit.

```javascript
    ...
    "platforms": [{
        ...

        "devices": {
            "VS-05": {
                "type": "Switch"
            }
        }

    }]
    ...
```


## Useful Links

* https://github.com/nfarina/homebridge
* http://blog.theodo.fr/2017/08/make-siri-perfect-home-companion-devices-not-supported-apple-homekit/

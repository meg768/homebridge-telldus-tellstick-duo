# homebridge-telldus-tellstick-duo

A HomeBridge plugin for anyone with a working setup using a Telldus Tellstick Duo.
This module uses the npm module https://www.npmjs.com/package/telldus instead of
the **tdtool** command line utility that is used by the npm module
https://www.npmjs.com/package/homebridge-telldus-tdtool. This plugin also supports
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

### Devices

If you specify a section in your config file named **devices** only the
specified devices will be added from the Tellstick Duo.

```javascript

    {
        ...
        "platforms": [{
            "platform": "Telldus Tellstick Duo",
            "name": "Telldus Tellstick Duo",

            "devices": {
                "RV-01": {
                    ...
                },
                "RV-02": {
                    ...
                }
            }

        }]
        ...
    }
```


#### Switches

By default, every device is represented by a switch in HomeKit. See next section
to configure a device as a motion/occupancy sensor rather than a switch.

#### Motion Sensors

Since motion sensors registered in your Tellstick Duo acts like
normal switches this plugin cannot distinguish between them. The following
example tells this plugin that the device **RV-01** is a motion sensor and
behaves like it in HomeKit, turning it on
for a while when activated and then automatically turning it off.

```javascript

    {
        ...
        "platforms": [{
            ...
            "devices": {
                "RV-01": {
                    "type": "MotionSensor",
                    "name": "Kitchen sensor",
                    "notify": "Movement in the kitchen.",
                    "timeout": 10
                }
            }
            ...

        }]
        ...
    }
```

The **timeout** entry is optional and specifies, in seconds,
how long the motion sensor should be in a triggered state
after motion has been detected. Default is 5 seconds.

The **name**
property is also optional. If not specified, the Telldus device name is used.

By adding the **notify** property you may get notified when the motion
sensor has been triggered.


### Sensors

Since sensors does not behave as devices when using the Tellstick a
special section named **sensors** may be created to give the
sensors names and behaviours.

```javascript
    ...
    "platforms": [{
        ...
        "sensors": {
            "135": {
                "name": "Temperature in the office"
            }
        },

        ...
    }]
    ...
```

You specify each sensor by representing its Tellstick Duo id and
then specifying its properties.

## Pushover Support

By adding a **pushover** section in the configuration file you
will be able to send messages using **Pushover**.

```javascript
    ...
    "platforms": [{
        ...
        "pushover": {
            "user": "my-pushover-user",
            "token": "my-pushover-token"
        }
        ...
    }]
    ...
```

To send a message, use the **notify** or **alert** property under the device
to specify the message.

```javascript

    {
        ...
        "platforms": [{
            "platform": "Telldus Tellstick Duo",
            "name": "Telldus Tellstick Duo",

            "devices": {
                ...
                "RV-01": {
                    "MotionSensor",
                    "name": "Doorbell",
                    "notify": "Someone at the door."
                }
                ...
            }

        }]
        ...
    }
```

The difference between **notify** and **alert** is that notifications
may be turned on or off using a **NotifycationSwitch**. By using **alert**
the message is always sent.

```javascript

    {
        ...
        "platforms": [{
            "platform": "Telldus Tellstick Duo",
            "name": "Telldus Tellstick Duo",

            "devices": {
                ...
                "VS-05": {
                    "name": "Notifications",
                    "type": "NotificationSwitch",
                    "on": "Notifications are now on.",
                    "off": "Notifications are now off."
                }
                ...
            }

        }]
        ...
    }
```



## Useful Links

* https://github.com/nfarina/homebridge
* http://blog.theodo.fr/2017/08/make-siri-perfect-home-companion-devices-not-supported-apple-homekit/

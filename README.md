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
- temperaturehumidity
- temperature


## Additional Configuration

Optionally, you may configure this plugin with the following additions.

## Devices

If you specify a section in your config file named **devices**
the plugin will use this information to set up the devices.

The syntax is a JSON representation of the **/etc/tellstick.conf** file.
See https://developer.telldus.com/wiki/TellStick_conf for more information.

**Note that all devices specified in the /etc/tellstick.conf file
will be removed and replaced by the devices specified in this
configuration file.**

```javascript
{
    ...
    "platforms": [{
        ...
        "devices": [
            {
                "name": "Kitchen lights",

                "protocol": "arctech",
                "model": "selflearning-switch",

                "parameters": {
                    "group": "0",
                    "unit": "10",
                    "house": "19670382"
                }
            },
            ...
        ]
        ...

    }]
    ...
}
```

## Switches

By default, every device is represented by a switch in HomeKit.

## Lighbulbs

To display it as a lightbulb, set the **type** property to **"lightbulb"**
as seen below.

```javascript
{
    ...
    "platforms": [{
        ...
        "devices": [
            {
                "name": "Kitchen lights",
                "type": "lightbulb",

                "protocol": "arctech",
                "model": "selflearning-switch",

                "parameters": {
                    "group": "0",
                    "unit": "10",
                    "house": "19670382"
                }
            },
            ...
        ]
        ...

    }]
    ...
}
```
## Motion Sensors

Since motion sensors registered in your Tellstick Duo acts like
normal switches this plugin cannot distinguish between them. The following
example tells this plugin that a is a motion sensor and
behaves like it in HomeKit, turning it on
for a while when activated and then automatically turning it off.

```javascript
{
    ...
    "platforms": [{
        ...
        "devices": [{
            "name": "Kitchen sensor",
            "type": "motion-sensor",
            "timeout": 120,

            "notify": {
                "on": "Someone is in the kitchen",
                "off": "The kitchen is clear",
            },

            "protocol": "arctech",
            "model": "selflearning-switch",

            "parameters": {
                "group": "0",
                "unit": "10",
                "house": "19670382"
            }
        }]
        ...
    }]
    ...
}
```

The **timeout** entry is optional and specifies, in seconds,
how long the motion sensor should be in a triggered state
after motion has been detected. Default is 60 seconds.

By adding the **notify** property you may get notified when the motion
sensor has been triggered if notifications are enabled.

## Pushover Support

By adding a **pushover** section in the configuration file you
will be enable to send messages using **Pushover**.

```javascript
{
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
}
```


To send a message, use the **notify** or **alert** property under the device
to specify the message.

The difference between **notify** and **alert** is that notifications
may be turned on or off using a **notifycation-switch**. By using **alert**
the message is always sent.


```javascript
{
    ...
    "platforms": [{
        ...
        "devices": [{
            "name": "Notifications",
            "type": "notification-switch",

            "notify": {
                "on": "Notifications are now on",
                "off": "Notifications are now off"
            },

            "protocol": "arctech",
            "model": "selflearning-switch",
            "parameters": {
                "house": "655218",
                "unit": "1",
                "group": "0"
            }
        }]
        ...
    }]
    ...
}
```

## Timers

A switch or lightbulb may be configured to turn itself
off after it has been turned on. Use the **timer**
property to set the number of seconds to remain active.

```javascript
{
    ...
    "platforms": [{
        ...
        "devices": [{
            "name": "Siren",
            "type": "lightbulb",
            "timer": 120,

            "protocol": "arctech",
            "model": "selflearning-switch",
            "parameters": {
                "unit": "10",
                "house": "17052298",
                "group": "0"
            }
        }]
        ...
    }]
    ...
}
```
## Adding Devices

If you have bought a new remote control or motion sensor and want to control it
with HomeKit, just examine the logs from this plugin.

All events from the Telldus Tellstick Duo are displayed in the log. If you press
a button on your new remote (or activate the motion sensor) something like
the following will be displayed.

    [2018-1-30 19:27:12] [Telldus Tellstick Duo] Raw event: {"id":1,"class":"command","protocol":"arctech","model":"selflearning","house":"9445358","unit":"16","group":"0","method":"turnon"}
    [2018-1-30 19:27:12] [Telldus Tellstick Duo] Raw event: {"id":1,"class":"command","protocol":"sartano","model":"codeswitch","code":"0000011000","method":"turnon"}
    [2018-1-30 19:27:12] [Telldus Tellstick Duo] Raw event: {"id":1,"class":"command","protocol":"everflourish","model":"selflearning","house":"510","unit":"4","method":"turnon"}

The remote in this example sends several signal but you really need only one.
In this example the protocol **arctech** is chosen.

So in this case the device entered in the config.json would be

```javascript
{
    ...
    "platforms": [{
        ...
        "devices": [{
            "name": "My new remote",

            "protocol": "arctech",
            "model": "selflearning-switch",
            "parameters": {
                "unit": "16",
                "house": "9445358",
                "group": "0"
            }
        }]
        ...
    }]
    ...
}
```

Make sure to set parameters **house**, **unit** and **group** to the displayed
values in the log. Set **model** to **"selflearning-switch"** if the log displays
**"model":"selflearning"**. Don't ask me why.

## Removing Devices

Just remove the device from the **devices** section in **~/.homebridge/config.json**.

## Virtual Signals

You don't have to buy a new remote to generate signals to self learning outlets.
Just add a virtual signal with a unique **house**, **unit** and **group**
number. See the the example below.

```javascript
{
    ...
    "platforms": [{
        ...
        "devices": [
            {
                "name": "My virtual remote #1",

                "protocol": "arctech",
                "model": "selflearning-switch",
                "parameters": {
                    "house": "10000001",
                    "unit": "0",
                    "group": "0"
                }
            },
            {
                "name": "My virtual remote #2",

                "protocol": "arctech",
                "model": "selflearning-switch",
                "parameters": {
                    "house": "10000002",
                    "unit": "0",
                    "group": "0"
                }
            }
        ]
        ...
    }]
    ...
}
```

Note that this is for the **arctech** protocol and the **house**, **unit**
and **group** properties must be in specific ranges documented
[here](https://developer.telldus.com/wiki/TellStick_conf).

This means you may purchase self learning outlets without a remote
control, set the outlet in learning mode, send the virtual signal
by turning on the device in the Apple Home app and the outlet will
remember your virtual signal and respond to it in the future.

## Useful Links

* https://developer.telldus.com/wiki/TellStick_conf
* https://github.com/nfarina/homebridge
* http://blog.theodo.fr/2017/08/make-siri-perfect-home-companion-devices-not-supported-apple-homekit/

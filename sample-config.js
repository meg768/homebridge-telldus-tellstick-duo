{
    "bridge": {
        "name": "Thyren 3",
        "username": "CC:22:3D:E3:CE:57",
        "port": 51826,
        "pin": "031-45-154"
    },

    "description": "This is an example configuration file",

    "platforms": [
        {
            "platform": "Telldus Tellstick Duo",
            "name": "Telldus Tellstick Duo",

            "pushover": {
                "user": "my-pushover-user",
                "token": "my-pushover-key"
            },

            "sensors": {
                "135": {
                    "name": "Temperatur på kontoret"
                }
            },

            "devices": {
                "VS-01": {
                    "type" : "Lightbulb",
                    "name" : "Terassen",
                    "on"   : "Terassen tänd."
                },

                "VS-02": {
                    "type"    : "Lightbulb",
                    "name"    : "Saftblandare",
                    "autoOff" : 120
                },

                "VS-03": {
                    "type" : "Lightbulb",
                    "name" : "Belysning i matrummet"
                },

                "VS-04": {
                    "type" : "Lightbulb",
                    "name" : "Belysning i vardagsrummet"
                },

                "VS-05": {
                    "type" : "NotificationSwitch",
                    "name" : "Larm",
                    "on"   : "Larm aktiverat",
                    "off"  : "Larm avaktiverat"
                },

                "VS-06": {
                    "type" : "Lightbulb",
                    "name" : "Belysning på kontoret"
                },

                "VS-07": {
                    "type" : "Lightbulb",
                    "name" : "Sänglampa"
                },

                "FK-02-01": {
                    "type"    : "Lightbulb",
                    "name"    : "Främre lampor i biorummet",
                    "on"      : "Främre lampor i biorummet tändes.",
                    "off"     : "Främre lampor i biorummet släcktes."
                },

                "FK-02-02": {
                    "type" : "Lightbulb",
                    "name" : "Bakre lampor i biorummet",
                    "on"   : "Brämre lampor i biorummet tändes.",
                    "off"  : "Brämre lampor i biorummet släcktes."
                },

                "RV-01": {
                    "type"    : "OccupancySensor",
                    "name"    : "Sensor på kontoret",
                    "notify"  : "Rörelse på kontoret.",
                    "timeout" : 60
                },

                "RV-02": {
                    "type"    : "OccupancySensor",
                    "name"    : "Sensor i biorummet",
                    "timeout" : 60,
                    "notify"  : "Rörelse i biorummet."
                },

                "RV-03": {
                    "type"    : "OccupancySensor",
                    "name"    : "Sensor i vardagsrummet",
                    "notify"  : "Rörelse i vardagsrummet.",
                    "timeout" : 60
                },

                "RV-04": {
                    "type"    : "OccupancySensor",
                    "name"    : "Sensor i snickarrummet",
                    "notify"  : "Rörelse i snickarrummet.",
                    "timeout" : 60
                },

                "RV-05": {
                    "type"    : "MotionSensor",
                    "name"    : "Sensor i köket",
                    "notify"  : "Rörelse i köket.",
                    "timeout" : 10
                },

                "RK-01": {
                    "type"    : "MotionSensor",
                    "name"    : "Ringklocka",
                    "alert"   : "Det ringer på dörren.",
                    "timeout" : 1
                },

                "PS-02": {
                    "type"    : "Lightbulb",
                    "name"    : "Belysning i snickarrummet"
                },

                "SR-01": {
                    "type"    : "Switch",
                    "name"    : "Skymmningsrelä"
                },

                "XMAS-01": {
                    "type"    : "Lightbulb",
                    "name"    : "Julbelysning"
                }
            }

        }
    ]


}

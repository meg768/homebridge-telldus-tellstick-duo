{
    "bridge": {
        "name": "Telldus",
        "username": "CC:22:3D:E3:CE:37",
        "port": 51826,
        "pin": "031-45-154"
    },

    "description": "This is an example configuration file",

    "platforms": [
        {
            "platform": "Telldus Tellstick Duo",
            "name": "Telldus Tellstick Duo",

            "exclude": [
                "PS-01", "PS-02", "PS-03",
                "FK-00-01", "FK-00-02", "FK-00-03",
                "FK-01-01", "FK-01-02", "FK-01-03",
                "FK-02-03",
                "Sensor-101"
            ],

            "devices": {
                "RV-01": {
                    "type": "OccupancySensor",
                    "timeout": 1
                },
                "RV-02": {
                    "type": "OccupancySensor",
                    "timeout": 1
                },
                "RV-03": {
                    "type": "OccupancySensor",
                    "timeout": 30
                },
                "RK-01": {
                    "type": "MotionSensor"
                },
                "VS-05": {
                    "type": "Switch"
                }
            }

        }
    ]


}

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
                "FK-00-01", "FK-00-02", "FK-00-03"
            ],

            "devices": {
                "RV-01": {
                    "type": "MotionSensor"
                },
                "RV-02": {
                    "type": "MotionSensor"
                },
                "RV-03": {
                    "type": "MotionSensor"
                },
                "RK-01": {
                    "type": "Doorbell"
                },
                "VS-05": {
                    "type": "Switch"
                }
            }

        }
    ]


}

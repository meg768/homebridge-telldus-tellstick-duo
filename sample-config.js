{
    "bridge": {
        "name": "Telldus",
        "username": "CC:22:3D:E3:CE:31",
        "port": 51826,
        "pin": "031-45-154"
    },

    "description": "This is an example configuration file",

    "platforms": [{
        "platform": "Telldus Tellstick Duo",
        "name": "Telldus Tellstick Duo",

        "devices": {
            "RV-01": {
                "type": "MotionSensor",
                "name": "Rörelsevakt på kontoret"
            },
            "RV-02": {
                "type": "MotionSensor",
                "name": "Rörelsevakt i källaren"
            }
        }
    }]


}

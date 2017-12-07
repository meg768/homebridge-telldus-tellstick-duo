{
    "bridge": {
        "name": "Telldus",
        "username": "CC:22:3D:E3:CE:33",
        "port": 51826,
        "pin": "031-45-154"
    },

    "description": "This is an example configuration file",

    "platforms": [{
        "platform": "Telldus Tellstick Duo",
        "name": "Telldus Tellstick Duo",

        "comments": [
            "The following section is optional if you want to rename or change type of device"
        ],

        "devices": {
            "FK-01-01": {
                "name": "Kontoret - Alla lampor"
            },
            "FK-01-02": {
                "name": "Kontoret - Sänglampan"
            },
            "FK-01-03": {
                "name": "Kontoret - Övriga lampor"
            },
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

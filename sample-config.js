{
    "bridge": {
        "name": "Telldus",
        "username": "CC:22:3D:E3:CE:36",
        "port": 51826,
        "pin": "031-45-154"
    },

    "description": "This is an example configuration file",

    "platforms": [{
        "platform": "Telldus Tellstick Duo",
        "name": "Telldus Tellstick Duo",

        "devices": {

            "FK-01-01": {
                "name": "Alla lampor - Kontoret"
            },
            "FK-01-02": {
                "name": "Sänglampa - Kontoret"
            },
            "FK-01-02": {
                "name": "Övriga - Kontoret"
            },

            "FK-02-01": {
                "name": "Alla lampor - Biorummet"
            },
            "FK-02-02": {
                "name": "Främre lampor - Biorummet"
            },
            "FK-01-02": {
                "name": "Bakre lampor - Biorummet"
            },

            "XMAS-01": {
                "name": "Julbelysningen"
            },

            "VS-01": {
                "name": "Terassen"
            },

            "VS-02": {
                "name": "Matrummet"
            },

            "VS-03": {
                "name": "Vardagsrummet"
            },

            "RV-01": {
                "type": "motionsensor",
                "name": "Rörelsevakt - Kontoret"
            },

            "RV-02": {
                "type": "motionsensor",
                "name": "Rörelsevakt - Vardagsrummet"
            },

            "RV-02": {
                "type": "motionsensor",
                "name": "Rörelsevakt - Biorummet"
            }

        },

        "exclude": [
            "PS-01", "PS-02", "PS-03",
            "FK-00-01", "FK-00-02", "FK-00-03"
        ]
    }]


}

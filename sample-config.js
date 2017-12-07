{
    "bridge": {
        "name": "Telldus",
        "username": "CC:22:3D:E3:CE:37",
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
            "FK-01-03": {
                "name": "Övriga - Kontoret"
            },

            "FK-02-01": {
                "name": "Alla lampor - Biorummet"
            },
            "FK-02-02": {
                "name": "Främre lampor - Biorummet"
            },
            "FK-02-03": {
                "name": "Bakre lampor - Biorummet"
            },

            "XMAS-01": {
                "name": "Julbelysningen"
            },

            "VS-01": {
                "type": "switch",
                "name": "Terassen"
            },

            "VS-02": {
                "type": "switch",
                "name": "Matrummet"
            },

            "VS-03": {
                "type": "switch",
                "name": "Vardagsrummet"
            },

            "VS-04": {
                "type": "switch",
                "name": "VS-04 - Vet inte!"
            },

            "VS-05": {
                "type": "switch",
                "name": "VS-05 - Vet inte!"
            },

            "RV-01": {
                "type": "motionsensor",
                "name": "Rörelsevakt - Kontoret"
            },

            "RV-02": {
                "type": "motionsensor",
                "name": "Rörelsevakt - Vardagsrummet"
            },

            "RV-03": {
                "type": "motionsensor",
                "name": "Rörelsevakt - Biorummet"
            },

            "RK-01": {
                "type": "doorbell",
                "name": "Ringklockan"
            },

            "SR-01": {
                "type": "motionsensor",
                "name": "Skymmningsrelä"
            }

        },

        "exclude": [
            "PS-01", "PS-02", "PS-03",
            "FK-00-01", "FK-00-02", "FK-00-03"
        ]
    }]


}

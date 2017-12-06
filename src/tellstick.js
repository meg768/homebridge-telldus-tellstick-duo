"use strict";

var telldus = require('telldus');
var sprintf = require('sprintf-js').sprintf;
var devices = telldus.getDevicesSync();

function debug() {
    console.log.apply(this, arguments);
}


function getDevices() {
    return devices;
}


function findDevice(id) {

    for (var i = 0; i < devices.length; i++) {
        var device = devices[i];

        if (id == device.id)
            return device;

        if (id == device.name) {
            return device;
        }
    };
}

function getDevice(id) {

    var device = findDevice(id);

    if (device == undefined)
        throw new Error(sprintf('Device %s not defined.', id));
    else
        return device;
}

telldus.addDeviceEventListener(function(id, status) {

    var device = findDevice(id);

    if (device != undefined) {
        device.status = status;
        console.log('Event:', device);

    } else {
        console.log('Device', id, 'not found.');
    }
});

module.exports.getDevices = getDevices;
module.exports.getDevice = getDevice;
module.exports.findDevice = findDevice;

'use strict';
var Exonum = require('../src/core');

Exonum.hexadecimalToUint8Array = function(str) {
    if (typeof str !== 'string') {
        console.error('Wrong data type of hexadecimal string');
        return new Uint8Array([]);
    }

    var array = [];
    for (var i = 0, len = str.length; i < len; i += 2) {
        array.push(parseInt(str.substr(i, 2), 16));
    }

    return new Uint8Array(array);
};

Exonum.hexadecimalToBinaryString = function(str) {
    var binaryStr = '';
    for (var i = 0, len = str.length; i < len; i += 2) {
        binaryStr += parseInt(str.substr(i, 2), 16).toString(2);
    }
    return binaryStr;
};

Exonum.uint8ArrayToHexadecimal = function(uint8arr) {
    if (!(uint8arr instanceof Uint8Array)) {
        console.error('Wrong data type of array of 8-bit integers');
        return '';
    }

    var str = '';
    for (var i = 0, len = uint8arr.length; i < len; i++) {
        var hex = (uint8arr[i]).toString(16);
        hex = (hex.length === 1) ? '0' + hex : hex;
        str += hex;
    }

    return str.toLowerCase();
};

Exonum.binaryStringToUint8Array = function(binaryStr) {
    var array = [];
    for (var i = 0, len = binaryStr.length; i < len; i += 8) {
        array.push(parseInt(binaryStr.substr(i, 8), 2));
    }

    return new Uint8Array(array);
};

Exonum.binaryStringToHexadecimal = function(binaryStr) {
    var str = '';
    for (var i = 0, len = binaryStr.length; i < len; i += 8) {
        var hex = (parseInt(binaryStr.substr(i, 8), 2)).toString(16);
        hex = (hex.length === 1) ? '0' + hex : hex;
        str += hex;
    }

    return str.toLowerCase();
};


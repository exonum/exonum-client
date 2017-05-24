'use strict';

import bigInt from 'big-integer';

export function validateInteger(value, min, max, from, to, length) {
    if (typeof value !== 'number') {
        console.error('Wrong data type is passed as number. Should be of type Number.');
        return false;
    } else if (value < min) {
        console.error('Number should be more or equal to ' + min + '.');
        return false;
    } else if (value > max) {
        console.error('Number should be less or equal to ' + max + '.');
        return false;
    } else if ((to - from) !== length) {
        console.error('Number segment is of wrong length. ' + length + ' bytes long is required to store transmitted value.');
        return false;
    }

    return true;
}

// value can be of type string or number
export function validateBigInteger(value, min, max, from, to, length) {
    var val;

    if (!(typeof value === 'number' || typeof value === 'string')) {
        console.error('Wrong data type is passed as number. Should be of type Number or String.');
        return false;
    } else if ((to - from) !== length) {
        console.error('Number segment is of wrong length. ' + length + ' bytes long is required to store transmitted value.');
        return false;
    }

    try {
        val = bigInt(value);
        if (val.lt(min)) {
            console.error('Number should be more or equal to ' + min + '.');
            return false;
        } else if (val.gt(max)) {
            console.error('Number should be less or equal to ' + max + '.');
            return false;
        }
        return val;
    } catch (e) {
        console.error('Wrong data type is passed as number. Should be of type Number or String.');
        return false;
    }
}

export function validateHexHash(hash, bytes) {
    bytes = bytes || 32;

    if (typeof hash !== 'string') {
        console.error('Wrong data type is passed as hexadecimal string. String is required');
        return false;
    } else if (hash.length !== bytes * 2) {
        console.error('Hexadecimal string is of wrong length. ' + bytes * 2 + ' char symbols long is required. ' + hash.length + ' is passed.');
        return false;
    }

    for (var i = 0, len = hash.length; i < len; i++) {
        if (isNaN(parseInt(hash[i], 16))) {
            console.error('Invalid symbol in hexadecimal string.');
            return false;
        }
    }

    return true;
}

export function validateBytesArray(arr, bytes) {
    if (bytes && arr.length !== bytes) {
        console.error('Array of 8-bit integers validity is of wrong length. ' + bytes * 2 + ' char symbols long is required. ' + arr.length + ' is passed.');
        return false;
    }

    for (var i = 0, len = arr.length; i < len; i++) {
        if (typeof arr[i] !== 'number') {
            console.error('Wrong data type is passed as byte. Number is required');
            return false;
        } else if (arr[i] < 0 || arr[i] > 255) {
            console.error('Byte should be in [0..255] range.');
            return false;
        }
    }

    return true;
}

export function validateBinaryString(str, bits) {
    if (typeof bits !== 'undefined' && str.length !== bits) {
        console.error('Binary string is of wrong length.');
        return null;
    }

    for (var i = 0; i < str.length; i++) {
        var bit = parseInt(str[i]);
        if (isNaN(bit)) {
            console.error('Wrong bit is passed in binary string.');
            return false;
        } else if (bit > 1) {
            console.error('Wrong bit is passed in binary string. Bit should be 0 or 1.');
            return false;
        }
    }

    return true;
}
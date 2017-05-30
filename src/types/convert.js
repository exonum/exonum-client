/**
 * Convert hexadecimal string into uint8Array
 * @param {string} str
 * @returns {Uint8Array}
 */
export function hexadecimalToUint8Array(str) {
    if (typeof str !== 'string') {
        console.error('Wrong data type passed to convertor. Hexadecimal string is expected');
        return;
    } else if (Exonum.validateHexHash(str, str.length / 2) === false) {
        return;
    }

    var uint8arr = new Uint8Array(str.length / 2);

    for (var i = 0, j = 0; i < str.length; i += 2, j++) {
        uint8arr[j] = parseInt(str.substr(i, 2), 16);
    }

    return uint8arr;
}

/**
 * Convert hexadecimal string into binary string
 * @param {string} str
 * @returns {string}
 */
export function hexadecimalToBinaryString(str) {
    var binaryStr = '';

    if (typeof str !== 'string') {
        console.error('Wrong data type passed to convertor. Hexadecimal string is expected');
        return;
    } else if (Exonum.validateHexHash(str, Math.ceil(str.length / 2)) === false) {
        return;
    }

    for (var i = 0; i < str.length; i++) {
        var bin = parseInt(str[i], 16).toString(2);
        while (bin.length < 4) {
            bin = '0' + bin;
        }
        binaryStr += bin;
    }

    return binaryStr;
}

/**
 * Convert uint8Array into string
 * @param {Uint8Array} uint8arr
 * @returns {string}
 */
export function uint8ArrayToHexadecimal(uint8arr) {
    var str = '';

    if (!(uint8arr instanceof Uint8Array)) {
        console.error('Wrong data type of array of 8-bit integers. Uint8Array is expected');
        return;
    }

    for (var i = 0; i < uint8arr.length; i++) {
        var hex = uint8arr[i].toString(16);
        hex = (hex.length === 1) ? '0' + hex : hex;
        str += hex;
    }

    return str.toLowerCase();
}

/**
 * Convert binary string into uint8Array
 * @param {string} binaryStr
 * @returns {Uint8Array}
 */
export function binaryStringToUint8Array(binaryStr) {
    var array = [];

    if (typeof binaryStr !== 'string') {
        console.error('Wrong data type passed to convertor. Binary string is expected');
        return;
    } else if (Exonum.validateBinaryString(binaryStr) === false) {
        return;
    }

    for (var i = 0; i < binaryStr.length; i += 8) {
        array.push(parseInt(binaryStr.substr(i, 8), 2));
    }

    return new Uint8Array(array);
}

/**
 * Convert binary string into hexadecimal string
 * @param {string} binaryStr
 * @returns {string}
 */
export function binaryStringToHexadecimal(binaryStr) {
    var str = '';

    if (typeof binaryStr !== 'string') {
        console.error('Wrong data type passed to convertor. Binary string is expected');
        return;
    } else if (Exonum.validateBinaryString(binaryStr) === false) {
        return;
    }

    for (var i = 0; i < binaryStr.length; i += 8) {
        var hex = (parseInt(binaryStr.substr(i, 8), 2)).toString(16);
        hex = (hex.length === 1) ? '0' + hex : hex;
        str += hex;
    }

    return str.toLowerCase();
}

/**
 * Convert sting into uint8Array
 * @param {string} str
 * @param {number} [len] - optional
 * @returns {Uint8Array}
 */
export function stringToUint8Array(str, len) {
    var array;
    var from = 0;

    if (typeof str !== 'string') {
        console.error('Wrong data type passed to convertor. String is expected');
        return;
    }

    if (len > 0) {
        array = new Array(len);
        array.fill(0);
    } else {
        array = [];
    }

    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);

        if (c < 128) {
            array[from++] = c;
        } else if (c < 2048) {
            array[from++] = (c >> 6) | 192;
            array[from++] = (c & 63) | 128;
        } else if (((c & 0xFC00) == 0xD800) && (i + 1) < str.length && ((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
            // surrogate pair
            c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
            array[from++] = (c >> 18) | 240;
            array[from++] = ((c >> 12) & 63) | 128;
            array[from++] = ((c >> 6) & 63) | 128;
            array[from++] = (c & 63) | 128;
        } else {
            array[from++] = (c >> 12) | 224;
            array[from++] = ((c >> 6) & 63) | 128;
            array[from++] = (c & 63) | 128;
        }
    }

    return new Uint8Array(array);
};

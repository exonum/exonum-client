import bigInt from 'big-integer';

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @param {number} from
 * @param {number} to
 * @param {number} length
 * @returns {boolean}
 */
export function validateInteger(value, min, max, from, to, length) {
    if (typeof value !== 'number') {
        throw new TypeError('Wrong data type is passed as number. Should be of type Number.');
    } else if (value < min) {
        throw new RangeError('Number should be greater or equal to ' + min + '.');
    } else if (value > max) {
        throw new RangeError('Number should be less or equal to ' + max + '.');
    } else if ((to - from) !== length) {
        throw new Error('Number segment is of wrong length. ' + length + ' bytes long is required to store transmitted value.');
    }
}

/**
 * @param {number|string} value
 * @param {number} min
 * @param {number} max
 * @param {number} from
 * @param {number} to
 * @param {number} length
 * @returns {*}
 */
export function validateBigInteger(value, min, max, from, to, length) {
    var val;

    if (!(typeof value === 'number' || typeof value === 'string')) {
        throw new TypeError('Wrong data type is passed as number. Should be of type Number or String.');
    } else if ((to - from) !== length) {
        throw new Error('Number segment is of wrong length. ' + length + ' bytes long is required to store transmitted value.');
    }

    try {
        val = bigInt(value);
    } catch (error) {
        throw new TypeError('Wrong data type is passed as number. Should be of type Number or String.');
    }

    if (val.lt(min)) {
        throw new RangeError('Number should be greater or equal to ' + min + '.');
    } else if (val.gt(max)) {
        throw new RangeError('Number should be less or equal to ' + max + '.');
    }
}

/**
 * @param {string} hash
 * @param {number} [bytes=32] - optional
 * @returns {boolean}
 */
export function validateHexHash(hash, bytes) {
    bytes = bytes || 32;

    if (typeof hash !== 'string') {
        throw new TypeError('Wrong data type is passed as hexadecimal string. String is required');
    } else if (hash.length !== bytes * 2) {
        throw new Error('Hexadecimal string is of wrong length. ' + bytes * 2 + ' char symbols long is required. ' + hash.length + ' is passed.');
    }

    for (var i = 0; i < hash.length; i++) {
        if (isNaN(parseInt(hash[i], 16))) {
            throw new TypeError('Invalid symbol in hexadecimal string.');
        }
    }
}

/**
 * @param {Array} arr
 * @param {number} [bytes] - optional
 * @returns {boolean}
 */
export function validateBytesArray(arr, bytes) {
    if (Array.isArray(arr) === false && !(arr instanceof Uint8Array)) {
        throw new TypeError('Wrong data type is passed. Array is required');
    } if (bytes && arr.length !== bytes) {
        throw new Error('Array of 8-bit integers validity is of wrong length. ' + bytes * 2 + ' char symbols long is required. ' + arr.length + ' is passed.');
    }

    for (var i = 0; i < arr.length; i++) {
        if (typeof arr[i] !== 'number') {
            throw new TypeError('Wrong data type is passed as byte. Number is required');
        } else if (arr[i] < 0 || arr[i] > 255) {
            throw new RangeError('Byte should be in [0..255] range.');
        }
    }
}

/**
 * @param {string} str
 * @param {number} [bits] - optional
 * @returns {*}
 */
export function validateBinaryString(str, bits) {
    if (bits !== undefined && str.length !== bits) {
        throw new Error('Binary string is of wrong length.');
    }

    for (var i = 0; i < str.length; i++) {
        var bit = parseInt(str[i]);
        if (isNaN(bit)) {
            throw new TypeError('Wrong bit is passed in binary string.');
        } else if (bit > 1) {
            throw new RangeError('Wrong bit is passed in binary string. Bit should be 0 or 1.');
        }
    }
}

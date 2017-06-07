import bigInt from 'big-integer';
import * as validate from './validate';

const MIN_INT8 = -128;
const MAX_INT8 = 127;
const MIN_INT16 = -32768;
const MAX_INT16 = 32767;
const MIN_INT32 = -2147483648;
const MAX_INT32 = 2147483647;
const MIN_INT64 = '-9223372036854775808';
const MAX_INT64 = '9223372036854775807';
const MAX_UINT8 = 255;
const MAX_UINT16 = 65535;
const MAX_UINT32 = 4294967295;
const MAX_UINT64 = '18446744073709551615';

/**
 * @param {string} str
 * @param {Array} buffer
 * @param {number} from
 * @param {number} to
 */
function insertHexadecimalToByteArray(str, buffer, from, to) {
    for (var i = 0; i < str.length; i += 2) {
        buffer[from] = parseInt(str.substr(i, 2), 16);
        from++;

        if (from > to) {
            break;
        }
    }
}

/**
 * Insert number into array as as little-endian
 * @param {number|bigInt} number
 * @param {Array} buffer
 * @param {number} from
 * @param {number} to
 * @returns {boolean}
 */
function insertIntegerToByteArray(number, buffer, from, to) {
    var value = bigInt(number); // convert a number-like object into a big integer

    for (var pos = from; pos < to; pos++) {
        var divmod = value.divmod(256);
        buffer[pos] = divmod.remainder.value;
        value = divmod.quotient;
    }
}

/**
 * @param {Array} arr
 * @param {Array} buffer
 * @param {number} from
 * @param {number} to
 */
function insertByteArrayToByteArray(arr, buffer, from, to) {
    for (var i = 0; i < arr.length; i++) {
        buffer[from] = arr[i];
        from++;

        if (from > to) {
            break;
        }
    }
}

/**
 * @param {string} str
 * @param {Array} buffer
 * @param {number} from
 */
function insertStringToByteArray(str, buffer, from) {
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);

        if (c < 128) {
            buffer[from++] = c;
        } else if (c < 2048) {
            buffer[from++] = (c >> 6) | 192;
            buffer[from++] = (c & 63) | 128;
        } else if (((c & 0xFC00) == 0xD800) && (i + 1) < str.length && ((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
            // surrogate pair
            c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
            buffer[from++] = (c >> 18) | 240;
            buffer[from++] = ((c >> 12) & 63) | 128;
            buffer[from++] = ((c >> 6) & 63) | 128;
            buffer[from++] = (c & 63) | 128;
        } else {
            buffer[from++] = (c >> 12) | 224;
            buffer[from++] = ((c >> 6) & 63) | 128;
            buffer[from++] = (c & 63) | 128;
        }
    }
}

/**
 * @param {number} value
 * @param {Array} buffer
 * @param {number} from
 * @param {number} to
 * @returns {Array}
 */
export function Int8(value, buffer, from, to) {
    if (!validate.validateInteger(value, MIN_INT8, MAX_INT8, from, to, 1)) {
        throw new TypeError('Int8 of wrong type is passed: ' + value);
    }

    if (value < 0) {
        value = MAX_UINT8 + value + 1;
    }

    insertIntegerToByteArray(value, buffer, from, to);

    return buffer;
}

/**
 * @param {number} value
 * @param {Array} buffer
 * @param {number} from
 * @param {number} to
 * @returns {Array}
 */
export function Int16(value, buffer, from, to) {
    if (!validate.validateInteger(value, MIN_INT16, MAX_INT16, from, to, 2)) {
        throw new TypeError('Int16 of wrong type is passed: ' + value);
    }

    if (value < 0) {
        value = MAX_UINT16 + value + 1;
    }

    insertIntegerToByteArray(value, buffer, from, to);

    return buffer;
}

/**
 * @param {number} value
 * @param {Array} buffer
 * @param {number} from
 * @param {number} to
 * @returns {Array}
 */
export function Int32(value, buffer, from, to) {
    if (!validate.validateInteger(value, MIN_INT32, MAX_INT32, from, to, 4)) {
        throw new TypeError('Int32 of wrong type is passed: ' + value);
    }

    if (value < 0) {
        value = MAX_UINT32 + value + 1;
    }

    insertIntegerToByteArray(value, buffer, from, to);

    return buffer;
}

/**
 * @param {number|string} value
 * @param {Array} buffer
 * @param {number} from
 * @param {number} to
 * @returns {Array}
 */
export function Int64(value, buffer, from, to) {
    if (!validate.validateBigInteger(value, MIN_INT64, MAX_INT64, from, to, 8)) {
        throw new TypeError('Int64 of wrong type is passed: ' + value);
    }

    var val = bigInt(value);

    if (val.isNegative()) {
        val = bigInt(MAX_UINT64).plus(1).plus(val);
    }

    insertIntegerToByteArray(val, buffer, from, to);

    return buffer;
}

/**
 * @param {number} value
 * @param {Array} buffer
 * @param {number} from
 * @param {number} to
 * @returns {Array}
 */
export function Uint8(value, buffer, from, to) {
    if (!validate.validateInteger(value, 0, MAX_UINT8, from, to, 1)) {
        throw new TypeError('Uint8 of wrong type is passed: ' + value);
    }

    insertIntegerToByteArray(value, buffer, from, to);

    return buffer;
}

/**
 * @param {number} value
 * @param {Array} buffer
 * @param {number} from
 * @param {number} to
 * @returns {Array}
 */
export function Uint16(value, buffer, from, to) {
    if (!validate.validateInteger(value, 0, MAX_UINT16, from, to, 2)) {
        throw new TypeError('Uint16 of wrong type is passed: ' + value);
    }

    insertIntegerToByteArray(value, buffer, from, to);

    return buffer;
}

/**
 * @param {number} value
 * @param {Array} buffer
 * @param {number} from
 * @param {number} to
 * @returns {Array}
 */
export function Uint32(value, buffer, from, to) {
    if (!validate.validateInteger(value, 0, MAX_UINT32, from, to, 4)) {
        throw new TypeError('Uint32 of wrong type is passed: ' + value);
    }

    insertIntegerToByteArray(value, buffer, from, to);

    return buffer;
}

/**
 * @param {number|string} value
 * @param {Array} buffer
 * @param {number} from
 * @param {number} to
 * @returns {Array}
 */
export function Uint64(value, buffer, from, to) {
    if (!validate.validateBigInteger(value, 0, MAX_UINT64, from, to, 8)) {
        throw new TypeError('Uint64 of wrong type is passed: ' + value);
    }

    var val = bigInt(value);

    insertIntegerToByteArray(val, buffer, from, to);

    return buffer;
}

/**
 * @param {string} string
 * @param {Array} buffer
 * @param {number} from
 * @param {number} to
 * @returns {Array}
 */
export function String(string, buffer, from, to) {
    if (typeof string !== 'string') {
        throw new TypeError('Wrong data type is passed as String. String is required');
    } else if ((to - from) !== 8) {
        throw new Error('String segment is of wrong length. 8 bytes long is required to store transmitted value.');
    }

    var bufferLength = buffer.length;
    Uint32(bufferLength, buffer, from, from + 4); // index where string content starts in buffer
    insertStringToByteArray(string, buffer, bufferLength); // string content
    Uint32(buffer.length - bufferLength, buffer, from + 4, from + 8); // string length

    return buffer;
}

/**
 * @param {string} hash
 * @param {Array} buffer
 * @param {number} from
 * @param {number} to
 * @returns {Array}
 */
export function Hash(hash, buffer, from, to) {
    if (!validate.validateHexadecimal(hash)) {
        throw new TypeError('Hash of wrong type is passed: ' + hash);
    }

    if ((to - from) !== 32) {
        throw new Error('Hash segment is of wrong length. 32 bytes long is required to store transmitted value.');
    }

    insertHexadecimalToByteArray(hash, buffer, from, to);

    return buffer;
}

/**
 * @param {string} digest
 * @param {Array} buffer
 * @param {number} from
 * @param {number} to
 * @returns {Array}
 */
export function Digest(digest, buffer, from, to) {
    if (!validate.validateHexadecimal(digest, 64)) {
        throw new TypeError('Digest of wrong type is passed: ' + digest);
    }

    if ((to - from) !== 64) {
        throw new Error('Digest segment is of wrong length. 64 bytes long is required to store transmitted value.');
    }

    insertHexadecimalToByteArray(digest, buffer, from, to);

    return buffer;
}

/**
 * @param {string} publicKey
 * @param {Array} buffer
 * @param {number} from
 * @param {number} to
 * @returns {Array}
 */
export function PublicKey(publicKey, buffer, from, to) {
    if (!validate.validateHexadecimal(publicKey)) {
        throw new TypeError('PublicKey of wrong type is passed: ' + publicKey);
    }

    if ((to - from) !== 32) {
        throw new Error('PublicKey segment is of wrong length. 32 bytes long is required to store transmitted value.');
    }

    insertHexadecimalToByteArray(publicKey, buffer, from, to);

    return buffer;
}

/**
 * @param {boolean} value
 * @param {Array} buffer
 * @param {number} from
 * @param {number} to
 * @returns {Array}
 */
export function Bool(value, buffer, from, to) {
    if (typeof value !== 'boolean') {
        throw new TypeError('Wrong data type is passed as Boolean. Boolean is required');
    } else if ((to - from) !== 1) {
        throw new Error('Bool segment is of wrong length. 1 bytes long is required to store transmitted value.');
    }

    insertIntegerToByteArray(value ? 1 : 0, buffer, from, to);

    return buffer;
}

/**
 * @param {number|string} nanoseconds
 * @param {Array} buffer
 * @param {number} from
 * @param {number} to
 * @returns {Array}
 */
export function Timespec(nanoseconds, buffer, from, to) {
    if (!validate.validateBigInteger(nanoseconds, 0, MAX_UINT64, from, to, 8)) {
        throw new TypeError('Timespec of wrong type is passed: ' + nanoseconds);
    }

    var val = bigInt(nanoseconds);

    insertIntegerToByteArray(val, buffer, from, to);

    return buffer;
}

/**
 * @param {Array|string} value
 * @param {Array} buffer
 * @param {number} from
 * @param {number} to
 * @returns {Array}
 */
export function FixedBuffer(value, buffer, from, to) {
    var size = to - from;

    if (size < 0) {
        throw new Error('FixedBuffer segment is of wrong length.');
    }

    if (typeof value === 'string' && validate.validateHexadecimal(value, size)) {
        insertHexadecimalToByteArray(value, buffer, from, to);
    } else if (validate.validateBytesArray(value) && size === value.length) {
        insertByteArrayToByteArray(value, buffer, from, to);
    } else {
        throw new TypeError('FixedBuffer of wrong type is passed: ' + value);
    }

    return buffer;
}

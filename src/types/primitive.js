'use strict';

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

function insertHexadecimalToByteArray(str, buffer, from, to) {
    for (var i = 0, len = str.length; i < len; i += 2) {
        buffer[from] = parseInt(str.substr(i, 2), 16);
        from++;

        if (from > to) {
            break;
        }
    }
}

function insertIntegerToByteArray(number, buffer, from, to) {
    var str = number.toString(16);

    insertNumberAsHexToByteArray(str, buffer, from, to);
}

function insertBigIntegerToByteArray(number, buffer, from, to) {
    var str = number.toString(16);

    insertNumberAsHexToByteArray(str, buffer, from, to);
}

function insertNumberAsHexToByteArray(number, buffer, from, to) {
    // store Number as little-endian
    if (number.length < 3) {
        buffer[from] = parseInt(number, 16);
        return true;
    }

    for (var i = number.length; i > 0; i -= 2) {
        if (i > 1) {
            buffer[from] = parseInt(number.substr(i - 2, 2), 16);
        } else {
            buffer[from] = parseInt(number.substr(0, 1), 16);
        }

        from++;

        if (from >= to) {
            break;
        }
    }
}

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

export function Int8(value, buffer, from, to) {
    if (validate.validateInteger(value, MIN_INT8, MAX_INT8, from, to, 1) === false) {
        return;
    }

    if (value < 0) {
        value = MAX_UINT8 + value + 1;
    }

    insertIntegerToByteArray(value, buffer, from, to);

    return buffer;
}

export function Int16(value, buffer, from, to) {
    if (validate.validateInteger(value, MIN_INT16, MAX_INT16, from, to, 2) === false) {
        return;
    }

    if (value < 0) {
        value = MAX_UINT16 + value + 1;
    }

    insertIntegerToByteArray(value, buffer, from, to);

    return buffer;
}

export function Int32(value, buffer, from, to) {
    if (validate.validateInteger(value, MIN_INT32, MAX_INT32, from, to, 4) === false) {
        return;
    }

    if (value < 0) {
        value = MAX_UINT32 + value + 1;
    }

    insertIntegerToByteArray(value, buffer, from, to);

    return buffer;
}

// value can be of type string or number
export function Int64(value, buffer, from, to) {
    var val = validate.validateBigInteger(value, MIN_INT64, MAX_INT64, from, to, 8);

    if (val === false) {
        return;
    } else if (!bigInt.isInstance(val)) {
        return;
    }

    if (val.isNegative()) {
        val = bigInt(MAX_UINT64).plus(1).plus(val);
    }

    insertBigIntegerToByteArray(val, buffer, from, to);

    return buffer;
}

export function Uint8(value, buffer, from, to) {
    if (validate.validateInteger(value, 0, MAX_UINT8, from, to, 1) === false) {
        return;
    }

    insertIntegerToByteArray(value, buffer, from, to);

    return buffer;
}

export function Uint16(value, buffer, from, to) {
    if (validate.validateInteger(value, 0, MAX_UINT16, from, to, 2) === false) {
        return;
    }

    insertIntegerToByteArray(value, buffer, from, to);

    return buffer;
}

export function Uint32(value, buffer, from, to) {
    if (validate.validateInteger(value, 0, MAX_UINT32, from, to, 4) === false) {
        return;
    }

    insertIntegerToByteArray(value, buffer, from, to);

    return buffer;
}

// value can be of type string or number
export function Uint64(value, buffer, from, to) {
    var val = validate.validateBigInteger(value, 0, MAX_UINT64, from, to, 8);

    if (val === false) {
        return;
    } else if (!bigInt.isInstance(val)) {
        return;
    }

    insertBigIntegerToByteArray(val, buffer, from, to);

    return buffer;
}

export function randomUint64() {
    return bigInt.randBetween(0, MAX_UINT64).toString();
}

export function String(string, buffer, from, to) {
    if (typeof string !== 'string') {
        console.error('Wrong data type is passed as String. String is required');
        return;
    } else if ((to - from) !== 8) {
        console.error('String segment is of wrong length. 8 bytes long is required to store transmitted value.');
        return;
    }

    var bufferLength = buffer.length;
    Uint32(bufferLength, buffer, from, from + 4); // index where string content starts in buffer
    insertStringToByteArray(string, buffer, bufferLength); // string content
    Uint32(buffer.length - bufferLength, buffer, from + 4, from + 8); // string length

    return buffer;
}

export function Hash(hash, buffer, from, to) {
    if (validate.validateHexHash(hash) === false) {
        return;
    } else if ((to - from) !== 32) {
        console.error('Hash segment is of wrong length. 32 bytes long is required to store transmitted value.');
        return;
    }

    insertHexadecimalToByteArray(hash, buffer, from, to);

    return buffer;
}

export function Digest(digest, buffer, from, to) {
    if (validate.validateHexHash(digest, 64) === false) {
        return;
    } else if ((to - from) !== 64) {
        console.error('Digest segment is of wrong length. 64 bytes long is required to store transmitted value.');
        return;
    }

    insertHexadecimalToByteArray(digest, buffer, from, to);

    return buffer;
}

export function PublicKey(publicKey, buffer, from, to) {
    if (validate.validateHexHash(publicKey) === false) {
        return;
    } else if ((to - from) !== 32) {
        console.error('PublicKey segment is of wrong length. 32 bytes long is required to store transmitted value.');
        return;
    }

    insertHexadecimalToByteArray(publicKey, buffer, from, to);

    return buffer;
}

export function Timespec(nanoseconds, buffer, from, to) {
    var val = validate.validateBigInteger(nanoseconds, 0, MAX_UINT64, from, to, 8);

    if (val === false) {
        return;
    } else if (!bigInt.isInstance(val)) {
        return;
    }

    insertBigIntegerToByteArray(val, buffer, from, to);

    return buffer;
}

export function Bool(value, buffer, from, to) {
    if (typeof value !== 'boolean') {
        console.error('Wrong data type is passed as Boolean. Boolean is required');
        return;
    } else if ((to - from) !== 1) {
        console.error('Bool segment is of wrong length. 1 bytes long is required to store transmitted value.');
        return;
    }

    insertIntegerToByteArray(value ? 1 : 0, buffer, from, to);

    return buffer;
}

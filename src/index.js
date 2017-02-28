"use strict";

var sha = require('sha.js');
var nacl = require('tweetnacl');
var objectAssign = require('object-assign');
var fs = require('fs');
var bigInt = require("big-integer");

var ExonumClient = (function() {

    var CONST = {
        MIN_INT8: -128,
        MAX_INT8: 127,
        MIN_INT16: -32768,
        MAX_INT16: 32767,
        MIN_INT32: -2147483648,
        MAX_INT32: 2147483647,
        MIN_INT64: '-9223372036854775808',
        MAX_INT64: '9223372036854775807',
        MAX_UINT8: 255,
        MAX_UINT16: 65535,
        MAX_UINT32: 4294967295,
        MAX_UINT64: '18446744073709551615',
        MERKLE_PATRICIA_KEY_LENGTH: 32,
        SIGNATURE_LENGTH: 64,
        NETWORK_ID: 0
    };
    var DBKey = createNewType({
        size: 34,
        fields: {
            variant: {type: Uint8, size: 1, from: 0, to: 1},
            key: {type: Hash, size: 32, from: 1, to: 33},
            length: {type: Uint8, size: 1, from: 33, to: 34}
        }
    });
    var Branch = createNewType({
        size: 132,
        fields: {
            left_hash: {type: Hash, size: 32, from: 0, to: 32},
            right_hash: {type: Hash, size: 32, from: 32, to: 64},
            left_key: {type: DBKey, size: 34, from: 64, to: 98},
            right_key: {type: DBKey, size: 34, from: 98, to: 132}
        }
    });
    var RootBranch = createNewType({
        size: 66,
        fields: {
            key: {type: DBKey, size: 34, from: 0, to: 34},
            hash: {type: Hash, size: 32, from: 34, to: 66}
        }
    });
    var Block = createNewType({
        size: 116,
        fields: {
            height: {type: Uint64, size: 8, from: 0, to: 8},
            propose_round: {type: Uint32, size: 4, from: 8, to: 12},
            time: {type: Timespec, size: 8, from: 12, to: 20},
            prev_hash: {type: Hash, size: 32, from: 20, to: 52},
            tx_hash: {type: Hash, size: 32, from: 52, to: 84},
            state_hash: {type: Hash, size: 32, from: 84, to: 116}
        }
    });
    var MessageHead = createNewType({
        size: 10,
        fields: {
            network_id: {type: Uint8, size: 1, from: 0, to: 1},
            version: {type: Uint8, size: 1, from: 1, to: 2},
            message_type: {type: Uint16, size: 2, from: 2, to: 4},
            service_id: {type: Uint16, size: 2, from: 4, to: 6},
            payload: {type: Uint32, size: 4, from: 6, to: 10}
        }
    });
    var Precommit = createNewMessage({
        size: 84,
        service_id: 0,
        message_type: 4,
        fields: {
            validator: {type: Uint32, size: 4, from: 0, to: 4},
            height: {type: Uint64, size: 8, from: 8, to: 16},
            round: {type: Uint32, size: 4, from: 16, to: 20},
            propose_hash: {type: Hash, size: 32, from: 20, to: 52},
            block_hash: {type: Hash, size: 32, from: 52, to: 84}
        }
    });

    /**
     * @constructor
     * @param {Object} type
     */
    function NewType(type) {
        this.size = type.size;
        this.fields = type.fields;
    }

    /**
     * Built-in method to serialize data into array of 8-bit integers
     * @param {Object} data
     * @returns {Array}
     */
    NewType.prototype.serialize = function(data) {
        return serialize([], 0, data, this);
    };

    /**
     * Create element of NewType class
     * @param {Object} type
     * @returns {NewType}
     */
    function createNewType(type) {
        return new NewType(type);
    }

    /**
     * @constructor
     * @param {Object} type
     */
    function NewMessage(type) {
        this.size = type.size;
        this.message_type = type.message_type;
        this.service_id = type.service_id;
        this.signature = type.signature;
        this.fields = type.fields;
    }

    /**
     * Built-in method to serialize data into array of 8-bit integers
     * @param {Object} data
     * @param {Boolean} cutSignature
     * @returns {Array}
     */
    NewMessage.prototype.serialize = function(data, cutSignature) {
        var buffer = MessageHead.serialize({
            network_id: CONST.NETWORK_ID,
            version: 0,
            message_type: this.message_type,
            service_id: this.service_id
        });

        // serialize and append message body
        buffer = serialize(buffer, MessageHead.size, data, this);
        if (typeof buffer === 'undefined') {
            return;
        }

        // calculate payload and insert it into buffer
        Uint32(buffer.length + CONST.SIGNATURE_LENGTH, buffer, MessageHead.fields.payload.from, MessageHead.fields.payload.to);

        if (cutSignature !== true) {
            // append signature
            Digest(this.signature, buffer, buffer.length, buffer.length + CONST.SIGNATURE_LENGTH);
        }

        return buffer;
    };

    /**
     * Create element of NewMessage class
     * @param {Object} type
     * @returns {NewMessage}
     */
    function createNewMessage(type) {
        return new NewMessage(type);
    }

    /**
     * Built-in data type
     * @param {Number || String} value
     * @param {Array} buffer
     * @param {Number} from
     * @param {Number} to
     */
    function Int8(value, buffer, from, to) {
        if (!validateInteger(value, CONST.MIN_INT8, CONST.MAX_INT8, from, to, 1)) {
            return;
        }

        if (value < 0) {
            value = CONST.MAX_UINT8 + value + 1
        }

        insertIntegerToByteArray(value, buffer, from, to);

        return buffer;
    }

    /**
     * Built-in data type
     * @param {Number || String} value
     * @param {Array} buffer
     * @param {Number} from
     * @param {Number} to
     */
    function Int16(value, buffer, from, to) {
        if (!validateInteger(value, CONST.MIN_INT16, CONST.MAX_INT16, from, to, 2)) {
            return;
        }

        if (value < 0) {
            value = CONST.MAX_UINT16 + value + 1;
        }

        insertIntegerToByteArray(value, buffer, from, to);

        return buffer;
    }

    /**
     * Built-in data type
     * @param {Number || String} value
     * @param {Array} buffer
     * @param {Number} from
     * @param {Number} to
     */
    function Int32(value, buffer, from, to) {
        if (!validateInteger(value, CONST.MIN_INT32, CONST.MAX_INT32, from, to, 4)) {
            return;
        }

        if (value < 0) {
            value = CONST.MAX_UINT32 + value + 1;
        }

        insertIntegerToByteArray(value, buffer, from, to);

        return buffer;
    }

    /**
     * Built-in data type
     * @param {Number || String} value
     * @param {Array} buffer
     * @param {Number} from
     * @param {Number} to
     */
    function Int64(value, buffer, from, to) {
        var val = validateBigInteger(value, CONST.MIN_INT64, CONST.MAX_INT64, from, to, 8);

        if (val === false) {
            return;
        } else if (!bigInt.isInstance(val)) {
            return;
        }

        if (val.isNegative()) {
            val = bigInt(CONST.MAX_UINT64).plus(1).plus(val);
        }

        insertBigIntegerToByteArray(val, buffer, from, to);

        return buffer;
    }

    /**
     * Built-in data type
     * @param {Number || String} value
     * @param {Array} buffer
     * @param {Number} from
     * @param {Number} to
     */
    function Uint8(value, buffer, from, to) {
        if (!validateInteger(value, 0, CONST.MAX_UINT8, from, to, 1)) {
            return;
        }

        insertIntegerToByteArray(value, buffer, from, to);

        return buffer;
    }

    /**
     * Built-in data type
     * @param {Number || String} value
     * @param {Array} buffer
     * @param {Number} from
     * @param {Number} to
     */
    function Uint16(value, buffer, from, to) {
        if (!validateInteger(value, 0, CONST.MAX_UINT16, from, to, 2)) {
            return;
        }

        insertIntegerToByteArray(value, buffer, from, to);

        return buffer;
    }

    /**
     * Built-in data type
     * @param {Number || String} value
     * @param {Array} buffer
     * @param {Number} from
     * @param {Number} to
     */
    function Uint32(value, buffer, from, to) {
        if (!validateInteger(value, 0, CONST.MAX_UINT32, from, to, 4)) {
            return;
        }

        insertIntegerToByteArray(value, buffer, from, to);

        return buffer;
    }

    /**
     * Built-in data type
     * @param {Number || String} value
     * @param {Array} buffer
     * @param {Number} from
     * @param {Number} to
     */
    function Uint64(value, buffer, from, to) {
        var val = validateBigInteger(value, 0, CONST.MAX_UINT64, from, to, 8);

        if (val === false) {
            return;
        } else if (!bigInt.isInstance(val)) {
            return;
        }

        insertBigIntegerToByteArray(val, buffer, from, to);

        return buffer;
    }

    /**
     * Built-in data type
     * @param {String} string
     * @param {Array} buffer
     * @param {Number} from
     * @param {Number} to
     */
    function String(string, buffer, from, to) {
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

    /**
     * Built-in data type
     * @param {String} hash
     * @param {Array} buffer
     * @param {Number} from
     * @param {Number} to
     */
    function Hash(hash, buffer, from, to) {
        if (!validateHexHash(hash)) {
            return;
        } else if ((to - from) !== 32) {
            console.error('Hash segment is of wrong length. 32 bytes long is required to store transmitted value.');
            return;
        }

        insertHexadecimalToArray(hash, buffer, from, to);

        return buffer;
    }

    /**
     * Built-in data type
     * @param {String} digest
     * @param {Array} buffer
     * @param {Number} from
     * @param {Number} to
     */
    function Digest(digest, buffer, from, to) {
        if (!validateHexHash(digest, 64)) {
            return;
        } else if ((to - from) !== 64) {
            console.error('Digest segment is of wrong length. 64 bytes long is required to store transmitted value.');
            return;
        }

        insertHexadecimalToArray(digest, buffer, from, to);

        return buffer;
    }

    /**
     * Built-in data type
     * @param {String} publicKey
     * @param {Array} buffer
     * @param {Number} from
     * @param {Number} to
     */
    function PublicKey(publicKey, buffer, from, to) {
        if (!validateHexHash(publicKey)) {
            return;
        } else if ((to - from) !== 32) {
            console.error('PublicKey segment is of wrong length. 32 bytes long is required to store transmitted value.');
            return;
        }

        insertHexadecimalToArray(publicKey, buffer, from, to);

        return buffer;
    }

    /**
     * Built-in data type
     * @param {Number || String} nanoseconds
     * @param {Array} buffer
     * @param {Number} from
     * @param {Number} to
     */
    function Timespec(nanoseconds, buffer, from, to) {
        var val = validateBigInteger(nanoseconds, 0, CONST.MAX_UINT64, from, to, 8);

        if (val === false) {
            return;
        } else if (!bigInt.isInstance(val)) {
            return;
        }

        insertBigIntegerToByteArray(val, buffer, from, to);

        return buffer;
    }

    /**
     * Built-in data type
     * @param {boolean} value
     * @param {Array} buffer
     * @param {Number} from
     * @param {Number} to
     */
    function Bool(value, buffer, from, to) {
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

    /**
     * Check integer number validity
     * @param {Number} value
     * @param {Number} min
     * @param {Number} max
     * @param {Number} from
     * @param {Number} to
     * @param {Number} length
     * @returns {Boolean}
     */
    function validateInteger(value, min, max, from, to, length) {
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

    /**
     * Check bit integer number validity
     * @param {Number || String} value
     * @param {Number} min
     * @param {Number} max
     * @param {Number} from
     * @param {Number} to
     * @param {Number} length
     * @returns {bigInt || Boolean}
     */
    function validateBigInteger(value, min, max, from, to, length) {
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

    /**
     * Check hash validity
     * @param {String} hash
     * @param {Number} bytes
     * @returns {Boolean}
     */
    function validateHexHash(hash, bytes) {
        var bytes = bytes || 32;

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

    /**
     * Check array of 8-bit integers validity
     * @param {Array} arr
     * @param {Number} bytes
     * @returns {Boolean}
     */
    function validateBytesArray(arr, bytes) {
        if (bytes && arr.length !== bytes) {
            console.error('Array of 8-bit integers validity is of wrong length. ' + bytes * 2 + ' char symbols long is required. ' + hash.length + ' is passed.');
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

    /**
     * Check binary string validity
     * @param {String} str
     * @param {Number} bits
     * @returns {Boolean}
     */
    function validateBinaryString(str, bits) {
        if (typeof bits !== 'undefined' && str.length !== bits) {
            console.error('Binary string is of wrong length.');
            return null;
        }

        var bit;
        for (var i = 0; i < str.length; i++) {
            bit = parseInt(str[i]);
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

    /**
     * Serialize data into array of 8-bit integers and insert into buffer
     * @param {Array} buffer
     * @param {Number} shift - the index to start write into buffer
     * @param {Object} data
     * @param type - can be {NewType} or one of built-in types
     */
    function serialize(buffer, shift, data, type) {
        for (var i = 0, len = type.size; i < len; i++) {
            buffer[shift + i] = 0;
        }

        for (var fieldName in data) {
            if (!data.hasOwnProperty(fieldName)) {
                continue;
            }

            var fieldType = type.fields[fieldName];

            if (typeof fieldType === 'undefined') {
                console.error(fieldName + ' field was not found in configuration of type.');
                return;
            }

            var fieldData = data[fieldName];
            var from = shift + fieldType.from;

            if (fieldType.type instanceof NewType) {
                var isFixed = (function checkIfIsFixed(fields) {
                    for (var fieldName in fields) {
                        if (!fields.hasOwnProperty(fieldName)) {
                            continue;
                        }

                        if (fields[fieldName].type instanceof NewType) {
                            checkIfIsFixed(fields[fieldName].type.fields);
                        } else if (fields[fieldName].type === String) {
                            return false;
                        }
                    }
                    return true;
                })(fieldType.type.fields);

                if (isFixed === true) {
                    serialize(buffer, from, fieldData, fieldType.type);
                } else {
                    var end = buffer.length;
                    Uint32(end, buffer, from, from + 4);
                    serialize(buffer, end, fieldData, fieldType.type);
                    Uint32(buffer.length - end, buffer, from + 4, from + 8);
                }
            } else {
                buffer = fieldType.type(fieldData, buffer, from, shift + fieldType.to);
                if (typeof buffer === 'undefined') {
                    return;
                }
            }
        }

        return buffer;
    }

    /**
     * Convert hexadecimal into array of 8-bit integers and insert into buffer
     * @param {String} str
     * @param {Array} buffer
     * @param {Number} from
     * @param {Number} to
     */
    function insertHexadecimalToArray(str, buffer, from, to) {
        for (var i = 0, len = str.length; i < len; i += 2) {
            buffer[from] = parseInt(str.substr(i, 2), 16);
            from++;

            if (from > to) {
                break;
            }
        }
    }

    /**
     * Convert integer into array of 8-bit integers and insert into buffer
     * @param {Number} number
     * @param {Array} buffer
     * @param {Number} from
     * @param {Number} to
     */
    function insertIntegerToByteArray(number, buffer, from, to) {
        var str = number.toString(16);

        insertNumberInHexToByteArray(str, buffer, from, to);
    }

    /**
     * Convert big integer into array of 8-bit integers and insert into buffer
     * @param {bigInt} number
     * @param {Array} buffer
     * @param {Number} from
     * @param {Number} to
     */
    function insertBigIntegerToByteArray(number, buffer, from, to) {
        var str = number.toString(16);

        insertNumberInHexToByteArray(str, buffer, from, to);
    }

    /**
     * Insert number in hex into buffer
     * @param {String} number
     * @param {Array} buffer
     * @param {Number} from
     * @param {Number} to
     */
    function insertNumberInHexToByteArray(number, buffer, from, to) {
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

    /**
     * Convert String into array of 8-bit integers and insert into buffer
     * @param {String} str
     * @param {Array} buffer
     * @param {Number} from
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
     * Convert hexadecimal string into array of 8-bit integers
     * @param {String} str
     *  hexadecimal
     * @returns {Uint8Array}
     */
    function hexadecimalToUint8Array(str) {
        if (typeof str !== 'string') {
            console.error('Wrong data type of hexadecimal string');
            return new Uint8Array([]);
        }

        var array = [];
        for (var i = 0, len = str.length; i < len; i += 2) {
            array.push(parseInt(str.substr(i, 2), 16));
        }

        return new Uint8Array(array);
    }

    /**
     * Convert hexadecimal string into array of 8-bit integers
     * @param {String} str
     *  hexadecimal
     * @returns {String}
     */
    function hexadecimalToBinaryString(str) {
        var binaryStr = '';
        for (var i = 0, len = str.length; i < len; i += 2) {
            binaryStr += parseInt(str.substr(i, 2), 16).toString(2);
        }
        return binaryStr;
    }

    /**
     * Convert array of 8-bit integers into hexadecimal string
     * @param {Uint8Array} uint8arr
     * @returns {String}
     */
    function uint8ArrayToHexadecimal(uint8arr) {
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
    }

    /**
     * Convert binary string into array of 8-bit integers
     * @param {String} binaryStr
     * @returns {Uint8Array}
     */
    function binaryStringToUint8Array(binaryStr) {
        var array = [];
        for (var i = 0, len = binaryStr.length; i < len; i += 8) {
            array.push(parseInt(binaryStr.substr(i, 8), 2));
        }

        return new Uint8Array(array);
    }

    /**
     * Convert binary string into hexadecimal string
     * @param {String} binaryStr
     * @returns {string}
     */
    function binaryStringToHexadecimal(binaryStr) {
        var str = '';
        for (var i = 0, len = binaryStr.length; i < len; i += 8) {
            var hex = (parseInt(binaryStr.substr(i, 8), 2)).toString(16);
            hex = (hex.length === 1) ? '0' + hex : hex;
            str += hex;
        }

        return str.toLowerCase();
    }

    /**
     * Check if element is of type {Object}
     * @param obj
     * @returns {boolean}
     */
    function isObject(obj) {
        return (typeof obj === 'object' && !Array.isArray(obj) && obj !== null && !(obj instanceof Date));
    }

    /**
     * Get length of object
     * @param {Object} obj
     * @returns {Number}
     */
    function getObjectLength(obj) {
        var l = 0;
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                l++;
            }
        }
        return l;
    }

    /**
     * Get SHA256 hash
     * Method with overloading. Accept two combinations of arguments:
     * 1) {Object} data, {NewType} type
     * 2) {Array} buffer
     * @return {String}
     */
    function hash(data, type) {
        var buffer;
        if (type instanceof NewType) {
            if (isObject(data)) {
                buffer = type.serialize(data);
                if (typeof buffer === 'undefined') {
                    console.error('Invalid data parameter. Instance of NewType is expected.');
                    return;
                }
            } else {
                console.error('Wrong type of data. Should be object.');
                return;
            }
        } else if (type instanceof NewMessage) {
            if (isObject(data)) {
                buffer = type.serialize(data);
                if (typeof buffer === 'undefined') {
                    console.error('Invalid data parameter. Instance of NewMessage is expected.');
                    return;
                }
            } else {
                console.error('Wrong type of data. Should be object.');
                return;
            }
        } else if (data instanceof Uint8Array) {
            buffer = data;
        } else if (Array.isArray(data)) {
            buffer = new Uint8Array(data);
        } else {
            console.error('Invalid type parameter.');
            return;
        }

        return sha('sha256').update(buffer, 'utf8').digest('hex');
    }

    /**
     * Get ED25519 signature
     * Method with overloading. Accept two combinations of arguments:
     * 1) {Object} data, {NewType || NewMessage} type, {String} secretKey
     * 2) {Array} buffer, {String} secretKey
     * @return {String}
     */
    function sign(data, type, secretKey) {
        var buffer;
        var secretKey = secretKey;
        var signature;

        if (typeof secretKey !== 'undefined') {
            if (type instanceof NewType) {
                buffer = type.serialize(data);
                if (typeof buffer === 'undefined') {
                    console.error('Invalid data parameter. Instance of NewType is expected.');
                    return;
                }
            } else if (type instanceof NewMessage) {
                buffer = type.serialize(data, true);
                if (typeof buffer === 'undefined') {
                    console.error('Invalid data parameter. Instance of NewMessage is expected.');
                    return;
                }
            } else {
                console.error('Invalid type parameter.');
                return;
            }
        } else {
            if (!validateBytesArray(data)) {
                console.error('Invalid data parameter.');
                return;
            }

            buffer = data;
            secretKey = type;
        }

        if (!validateHexHash(secretKey, 64)) {
            console.error('Invalid secretKey parameter.');
            return;
        }

        buffer = new Uint8Array(buffer);
        secretKey = hexadecimalToUint8Array(secretKey);
        signature = nacl.sign.detached(buffer, secretKey);

        return uint8ArrayToHexadecimal(signature);
    }

    /**
     * Verifies ED25519 signature
     * Method with overloading. Accept two combinations of arguments:
     * 1) {Object} data, {NewType || NewMessage} type, {String} signature, {String} publicKey
     * 2) {Array} buffer, {String} signature, {String} publicKey
     * @return {Boolean}
     */
    function verifySignature(data, type, signature, publicKey) {
        var buffer;
        var signature = signature;
        var publicKey = publicKey;

        if (typeof publicKey !== 'undefined') {
            if (type instanceof NewType) {
                buffer = type.serialize(data);
                if (typeof buffer === 'undefined') {
                    console.error('Invalid data parameter. Instance of NewType is expected.');
                    return;
                }
            } else if (type instanceof NewMessage) {
                buffer = type.serialize(data, true);
                if (typeof buffer === 'undefined') {
                    console.error('Invalid data parameter. Instance of NewMessage is expected.');
                    return;
                }
            } else {
                console.error('Invalid type parameter.');
                return;
            }
        } else {
            if (!validateBytesArray(data)) {
                console.error('Invalid data parameter.');
                return;
            }

            buffer = data;
            publicKey = signature;
            signature = type;
        }

        if (!validateHexHash(publicKey)) {
            console.error('Invalid publicKey parameter.');
            return;
        } else if (!validateHexHash(signature, 64)) {
            console.error('Invalid signature parameter.');
            return;
        }

        buffer = new Uint8Array(buffer);
        signature = hexadecimalToUint8Array(signature);
        publicKey = hexadecimalToUint8Array(publicKey);

        return nacl.sign.detached.verify(buffer, signature, publicKey);
    }

    /**
     * Check Merkle tree proof and return array of elements
     * @param {String} rootHash
     * @param {Number} count
     * @param {Object} proofNode
     * @param {Array} range
     * @param {NewType} type (optional)
     * @return {Array}
     */
    function merkleProof(rootHash, count, proofNode, range, type) {
        /**
         * Calculate height of merkle tree
         * @param {bigInt} count
         * @return {Number}
         */
        function calcHeight(count) {
            var i = 0;
            while (bigInt(2).pow(i).lt(count)) {
                i++;
            }
            return i;
        }

        /**
         * Get value from node, insert into elements array and return its hash
         * @param data
         * @param {Number} depth
         * @param {Number} index
         * @returns {String}
         */
        function getHash(data, depth, index) {
            var element;
            var elementsHash;

            if ((depth + 1) !== height) {
                console.error('Value node is on wrong height in tree.');
                return;
            } else if (index < start || end.lt(index)) {
                console.error('Wrong index of value node.');
                return;
            } else if ((start + elements.length) !== index) {
                console.error('Value node is on wrong position in tree.');
                return;
            }

            if (typeof data === 'string') {
                if (validateHexHash(data)) {
                    element = data;
                    elementsHash = hash(hexadecimalToUint8Array(element));
                } else {
                    console.error('Invalid hexadecimal string is passed as value in tree.');
                    return;
                }
            } else if (Array.isArray(data)) {
                if (validateBytesArray(data)) {
                    element = data.slice(0); // clone array of 8-bit integers
                    elementsHash = hash(element);
                } else {
                    console.error('Invalid array of 8-bit integers in tree.');
                    return;
                }
            } else if (isObject(data)) {
                if (NewType.prototype.isPrototypeOf(type)) {
                    element = objectAssign(data); // deep copy
                    elementsHash = hash(element, type);
                } else {
                    console.error('Invalid type of type parameter.');
                    return;
                }
            } else {
                console.error('Invalid value of data parameter.');
                return;
            }

            if (typeof elementsHash === 'undefined') {
                return;
            }

            elements.push(element);
            return elementsHash;
        }

        /**
         * Recursive tree traversal function
         * @param {Object} node
         * @param {Number} depth
         * @param {Number} index
         * @returns {String}
         */
        function recursive(node, depth, index) {
            var hashLeft;
            var hashRight;
            var summingBuffer;

            if (typeof node.left !== 'undefined') {
                if (typeof node.left === 'string') {
                    if (!validateHexHash(node.left)) {
                        return null;
                    }
                    hashLeft = node.left;
                } else if (isObject(node.left)) {
                    if (typeof node.left.val !== 'undefined') {
                        hashLeft = getHash(node.left.val, depth, index * 2);
                    } else {
                        hashLeft = recursive(node.left, depth + 1, index * 2);
                    }
                    if (typeof hashLeft === 'undefined') {
                        return null;
                    }
                } else {
                    console.error('Invalid type of left node.');
                    return null;
                }
            } else {
                console.error('Left node is missed.');
                return null;
            }

            if (depth === 0) {
                rootBranch = 'right';
            }

            if (typeof node.right !== 'undefined') {
                if (typeof node.right === 'string') {
                    if (!validateHexHash(node.right)) {
                        return null;
                    }
                    hashRight = node.right;
                } else if (isObject(node.right)) {
                    if (typeof node.right.val !== 'undefined') {
                        hashRight = getHash(node.right.val, depth, index * 2 + 1);
                    } else {
                        hashRight = recursive(node.right, depth + 1, index * 2 + 1);
                    }
                    if (typeof hashRight === 'undefined') {
                        return null;
                    }
                } else {
                    console.error('Invalid type of right node.');
                    return null;
                }

                summingBuffer = new Uint8Array(64);
                summingBuffer.set(hexadecimalToUint8Array(hashLeft));
                summingBuffer.set(hexadecimalToUint8Array(hashRight), 32);
            } else if (depth === 0 || rootBranch === 'left') {
                console.error('Right leaf is missed in left branch of tree.');
                return null;
            } else {
                summingBuffer = hexadecimalToUint8Array(hashLeft);
            }

            return hash(summingBuffer);
        }

        var elements = [];
        var rootBranch = 'left';

        // validate rootHash
        if (!validateHexHash(rootHash)) {
            return undefined;
        }

        // validate count
        if (!(typeof count === 'number' || typeof count === 'string')) {
            console.error('Invalid value is passed as count parameter. Number or string is expected.');
            return undefined;
        }
        try {
            count = bigInt(count);
        } catch (e) {
            console.error('Invalid value is passed as count parameter.');
            return undefined;
        }
        if (count.lt(0)) {
            console.error('Invalid count parameter. Count can\'t be below zero.');
            return undefined;
        }

        // validate range
        if (!Array.isArray(range) || range.length !== 2) {
            console.error('Invalid type of range parameter. Array of two elements expected.');
            return undefined;
        } else if (!(typeof range[0] === 'number' || typeof range[0] === 'string')) {
            console.error('Invalid value is passed as start of range parameter.');
            return undefined;
        } else if (!(typeof range[1] === 'number' || typeof range[1] === 'string')) {
            console.error('Invalid value is passed as end of range parameter.');
            return undefined;
        }
        try {
            var rangeStart = bigInt(range[0]);
        } catch (e) {
            console.error('Invalid value is passed as start of range parameter. Number or string is expected.');
            return undefined;
        }
        try {
            var rangeEnd = bigInt(range[1]);
        } catch (e) {
            console.error('Invalid value is passed as end of range parameter. Number or string is expected.');
            return undefined;
        }
        if (rangeStart.gt(rangeEnd)) {
            console.error('Invalid range parameter. Start index can\'t be out of range.');
            return undefined;
        } else if (rangeStart.lt(0)) {
            console.error('Invalid range parameter. Start index can\'t be below zero.');
            return undefined;
        } else if (rangeEnd.lt(0)) {
            console.error('Invalid range parameter. End index can\'t be below zero.');
            return undefined;
        } else if (rangeStart.gt(count.minus(1))) {
            return [];
        }

        // validate proofNode
        if (!isObject(proofNode)) {
            console.error('Invalid type of proofNode parameter. Object expected.');
            return undefined;
        }

        var height = calcHeight(count);
        var start = rangeStart;
        var end = rangeEnd.lt(count) ? rangeEnd : count.minus(1);
        var actualHash = recursive(proofNode, 0, 0);

        if (typeof actualHash === 'undefined') { // tree is invalid
            return undefined;
        } else if (rootHash.toLowerCase() !== actualHash) {
            console.error('rootHash parameter is not equal to actual hash.');
            return undefined;
        } else if (bigInt(elements.length).neq(end.eq(start) ? 1 : end.minus(start).plus(1))) {
            console.error('Actual elements in tree amount is not equal to requested.');
            return undefined;
        }

        return elements;
    }

    /**
     * Check Merkle Patricia tree proof and return element
     * @param {String} rootHash
     * @param {Object} proofNode
     * @param key
     * @param {NewType} type (optional)
     * @return {Object}
     */
    function merklePatriciaProof(rootHash, proofNode, key, type) {
        /**
         * Get value from node
         * @param data
         * @returns {String || Array || Object}
         */
        function getHash(data) {
            var elementsHash;

            if (typeof data === 'string') {
                if (validateHexHash(data)) {
                    element = data;
                    elementsHash = hash(hexadecimalToUint8Array(element));
                } else {
                    console.error('Invalid hexadecimal string is passed as value in tree.');
                    return;
                }
            } else if (Array.isArray(data)) {
                if (validateBytesArray(data)) {
                    element = data.slice(0); // clone array of 8-bit integers
                    elementsHash = hash(element);
                } else {
                    return;
                }
            } else if (isObject(data)) {
                element = objectAssign(data); // deep copy
                elementsHash = hash(element, type);
            } else {
                console.error('Invalid value node in tree. Object expected.');
                return;
            }

            if (typeof elementsHash === 'undefined') {
                return;
            }

            return elementsHash;
        }

        /**
         * Check either suffix is a part of search key
         * @param {String} prefix
         * @param {String} suffix
         * @returns {Boolean}
         */
        function isPartOfSearchKey(prefix, suffix) {
            var diff = keyBinary.substr(prefix.length);
            return diff[0] === suffix[0];
        }

        /**
         * Recursive tree traversal function
         * @param {Object} node
         * @param {String} keyPrefix
         * @returns {String}
         */
        function recursive(node, keyPrefix) {
            if (getObjectLength(node) !== 2) {
                console.error('Invalid number of children in the tree node.');
                return null;
            }

            var levelData = {};

            for (var keySuffix in node) {
                if (!node.hasOwnProperty(keySuffix)) {
                    continue;
                }

                // validate key
                if (!validateBinaryString(keySuffix)) {
                    return null;
                }

                var branchValueHash;
                var fullKey = keyPrefix + keySuffix;
                var nodeValue = node[keySuffix];
                var branchType;
                var branchKey;
                var branchKeyHash;

                if (fullKey.length === CONST.MERKLE_PATRICIA_KEY_LENGTH * 8) {
                    if (typeof nodeValue === 'string') {
                        if (!validateHexHash(nodeValue)) {
                            return null;
                        }
                        branchValueHash = nodeValue;
                        branchType = 'hash';
                    } else if (isObject(nodeValue)) {
                        if (typeof nodeValue.val === 'undefined') {
                            console.error('Leaf tree contains invalid data.');
                            return null;
                        } else if (typeof element !== 'undefined') {
                            console.error('Tree can not contains more than one node with value.');
                            return null;
                        }

                        branchValueHash = getHash(nodeValue.val);
                        if (typeof branchValueHash === 'undefined') {
                            return null;
                        }
                        branchType = 'value';
                    }  else {
                        console.error('Invalid type of node in tree leaf.');
                        return null;
                    }

                    branchKeyHash = binaryStringToHexadecimal(fullKey);
                    branchKey = {
                        variant: 1,
                        key: branchKeyHash,
                        length: 0
                    };
                } else if (fullKey.length < CONST.MERKLE_PATRICIA_KEY_LENGTH * 8) { // node is branch
                    if (typeof nodeValue === 'string') {
                        if (!validateHexHash(nodeValue)) {
                            return null;
                        }
                        branchValueHash = nodeValue;
                        branchType = 'hash';
                    } else if (isObject(nodeValue)) {
                        if (typeof nodeValue.val !== 'undefined') {
                            console.error('Node with value is at non-leaf position in tree.');
                            return null;
                        }

                        branchValueHash = recursive(nodeValue, fullKey);
                        if (branchValueHash === null) {
                            return null;
                        }
                        branchType = 'branch';
                    }  else {
                        console.error('Invalid type of node in tree.');
                        return null;
                    }

                    var binaryKeyLength = fullKey.length;
                    var binaryKey = fullKey;

                    for (var j = 0; j < (CONST.MERKLE_PATRICIA_KEY_LENGTH * 8 - fullKey.length); j++) {
                        binaryKey += '0';
                    }

                    branchKeyHash = binaryStringToHexadecimal(binaryKey);
                    branchKey = {
                        variant: 0,
                        key: branchKeyHash,
                        length: binaryKeyLength
                    };
                } else {
                    console.error('Invalid length of key in tree.');
                    return null;
                }

                if (keySuffix[0] === '0') { // '0' at the beginning means left branch/leaf
                    if (typeof levelData.left === 'undefined') {
                        levelData.left = {
                            hash: branchValueHash,
                            key: branchKey,
                            type: branchType,
                            suffix: keySuffix,
                            size: fullKey.length
                        };
                    } else {
                        console.error('Left node is duplicated in tree.');
                        return null;
                    }
                } else { // '1' at the beginning means right branch/leaf
                    if (typeof levelData.right === 'undefined') {
                        levelData.right = {
                            hash: branchValueHash,
                            key: branchKey,
                            type: branchType,
                            suffix: keySuffix,
                            size: fullKey.length
                        };
                    } else {
                        console.error('Right node is duplicated in tree.');
                        return null;
                    }
                }
            }

            if ((levelData.left.type === 'hash') && (levelData.right.type === 'hash') && (fullKey.length < CONST.MERKLE_PATRICIA_KEY_LENGTH * 8)) {
                if (isPartOfSearchKey(keyPrefix, levelData.left.suffix)) {
                    console.error('Tree is invalid. Left key is a part of search key but its branch is not expanded.');
                    return null;
                } else if (isPartOfSearchKey(keyPrefix, levelData.right.suffix)) {
                    console.error('Tree is invalid. Right key is a part of search key but its branch is not expanded.');
                    return null;
                }
            }

            return hash({
                left_hash: levelData.left.hash,
                right_hash: levelData.right.hash,
                left_key: levelData.left.key,
                right_key: levelData.right.key
            }, Branch);
        }

        var element;

        // validate rootHash parameter
        if (!validateHexHash(rootHash)) {
            return undefined;
        }
        var rootHash = rootHash.toLowerCase();

        // validate proofNode parameter
        if (!isObject(proofNode)) {
            console.error('Invalid type of proofNode parameter. Object expected.');
            return undefined;
        }

        // validate key parameter
        var key = key;
        if (Array.isArray(key)) {
            if (validateBytesArray(key, CONST.MERKLE_PATRICIA_KEY_LENGTH)) {
                key = uint8ArrayToHexadecimal(key);
            } else {
                return undefined;
            }
        } else if (typeof key === 'string') {
            if (!validateHexHash(key, CONST.MERKLE_PATRICIA_KEY_LENGTH)) {
                return undefined;
            }
        } else {
            console.error('Invalid type of key parameter. Aarray of 8-bit integers or hexadecimal string is expected.');
            return undefined;
        }
        var keyBinary = hexadecimalToBinaryString(key);

        var proofNodeRootNumberOfNodes = getObjectLength(proofNode);
        if (proofNodeRootNumberOfNodes === 0) {
            if (rootHash === (new Uint8Array(CONST.MERKLE_PATRICIA_KEY_LENGTH * 2)).join('')) {
                return null;
            } else {
                console.error('Invalid rootHash parameter of empty tree.');
                return undefined;
            }
        } else if (proofNodeRootNumberOfNodes === 1) {
            for (var i in proofNode) {
                if (!proofNode.hasOwnProperty(i)) {
                    continue;
                }

                if (!validateBinaryString(i, 256)) {
                    return undefined;
                }

                var data = proofNode[i];
                var nodeKeyBuffer = binaryStringToUint8Array(i);
                var nodeKey = uint8ArrayToHexadecimal(nodeKeyBuffer);
                var nodeHash;

                if (typeof data === 'string') {
                    if (!validateHexHash(data)) {
                        return undefined;
                    }

                    nodeHash = hash({
                        key: {
                            variant: 1,
                            key: nodeKey,
                            length: 0
                        },
                        hash: data
                    }, RootBranch);

                    if (rootHash === nodeHash) {
                        if (key !== nodeKey) {
                            return null; // no element with data in tree
                        } else {
                            console.error('Invalid key with hash is in the root of proofNode parameter.');
                            return undefined;
                        }
                    } else {
                        console.error('rootHash parameter is not equal to actual hash.');
                        return undefined;
                    }
                } else if (isObject(data)) {
                    var elementsHash = getHash(data.val);
                    if (typeof elementsHash === 'undefined') {
                        return undefined;
                    }

                    nodeHash = hash({
                        key: {
                            variant: 1,
                            key: nodeKey,
                            length: 0
                        },
                        hash: elementsHash
                    }, RootBranch);

                    if (rootHash === nodeHash) {
                        if (key === nodeKey) {
                            return element;
                        } else {
                            console.error('Invalid key with value is in the root of proofNode parameter.');
                            return undefined
                        }
                    } else {
                        console.error('rootHash parameter is not equal to actual hash.');
                        return undefined;
                    }
                } else {
                    console.error('Invalid type of value in the root of proofNode parameter.');
                    return undefined;
                }

            }
        } else {
            var actualHash = recursive(proofNode, '');

            if (actualHash === null) { // tree is invalid
                return undefined;
            } else if (rootHash !== actualHash) {
                console.error('rootHash parameter is not equal to actual hash.');
                return undefined;
            } else if (typeof element === 'undefined') {
                return null; // no element with data in tree
            }

            return element;
        }
    }

    /**
     * Verifies block
     * @param {Object} data
     * @param {Array} validators
     * @return {Boolean}
     */
    function verifyBlock(data, validators) {
        if (!isObject(data)) {
            console.error('Wrong type of data parameter. Object is expected.');
            return false;
        } else if (!isObject(data.block)) {
            console.error('Wrong type of block field in data parameter. Object is expected.');
            return false;
        } else if (!Array.isArray(data.precommits)) {
            console.error('Wrong type of precommits field in data parameter. Array is expected.');
            return false;
        } else if (!Array.isArray(validators)) {
            console.error('Wrong type of validatorsparameter. Array is expected.');
            return false;
        }

        for (var i in validators) {
            if (!validators.hasOwnProperty(i)) {
                continue;
            }

            if (!validateHexHash(validators[i])) {
                return false;
            }
        }

        var validatorsTotalNumber = validators.length;
        var uniqueValidators = [];

        var round;
        var blockHash = hash(data.block, Block);

        for (var i in data.precommits) {
            if (!data.precommits.hasOwnProperty(i)) {
                continue;
            }

            var precommit = data.precommits[i];

            if (!isObject(precommit.body)) {
                console.error('Wrong type of precommits body. Object is expected.');
                return false;
            } else if (!validateHexHash(precommit.signature, 64)) {
                console.error('Wrong type of precommits signature. Hexadecimal of 64 length is expected.');
                return false;
            }

            if (precommit.body.validator >= validatorsTotalNumber) {
                console.error('Wrong index passed. Validator does not exist.');
                return false;
            }

            if (uniqueValidators.indexOf(precommit.body.validator) === -1) {
                uniqueValidators.push(precommit.body.validator);
            }

            if (precommit.body.height !== data.block.height) {
                console.error('Wrong height of block in precommit.');
                return false;
            } else if (precommit.body.block_hash !== blockHash) {
                console.error('Wrong hash of block in precommit.');
                return false;
            }

            if (typeof round === 'undefined') {
                round = precommit.body.round;
            } else if (precommit.body.round !== round) {
                console.error('Wrong round in precommit.');
                return false;
            }

            var publicKey = validators[precommit.body.validator];

            if (!verifySignature(precommit.body, Precommit, precommit.signature, publicKey)) {
                console.error('Wrong signature of precommit.');
                return false;
            }
        }

        if (uniqueValidators.length <= validatorsTotalNumber * 2 / 3) {
            console.error('Not enough precommits from unique validators.');
            return false;
        }

        return true;
    }

    /**
     * Generate random pair of publicKey and secretKey
     * @return {Object}
     *  publicKey {String}
     *  secretKey {String}
     */
    function keyPair() {
        var pair = nacl.sign.keyPair();
        var publicKey = uint8ArrayToHexadecimal(pair.publicKey);
        var secretKey = uint8ArrayToHexadecimal(pair.secretKey);

        return {
            publicKey: publicKey,
            secretKey: secretKey
        }
    }

    /** Generate random number of type of Uint64
     * @return {String}
     */
    function randomUint64() {
        return bigInt.randBetween(0, CONST.MAX_UINT64);
    }

    return {

        // API methods
        newType: createNewType,
        newMessage: createNewMessage,
        hash: hash,
        sign: sign,
        verifySignature: verifySignature,
        merkleProof: merkleProof,
        merklePatriciaProof: merklePatriciaProof,
        verifyBlock: verifyBlock,
        keyPair: keyPair,
        randomUint64: randomUint64,

        // built-in types
        Int8: Int8,
        Int16: Int16,
        Int32: Int32,
        Int64: Int64,
        Uint8: Uint8,
        Uint16: Uint16,
        Uint32: Uint32,
        Uint64: Uint64,
        String: String,
        Hash: Hash,
        Digest: Digest,
        PublicKey: PublicKey,
        Timespec: Timespec,
        Bool: Bool

    };

})();

module.exports = ExonumClient;

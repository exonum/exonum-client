import bigInt from 'big-integer';
import sha from 'sha.js';
import nacl from 'tweetnacl';
import {isObject} from '../helpers';
import {isInstanceofOfNewType} from '../types/generic';
import {isInstanceofOfNewMessage} from '../types/message';
import * as validate from '../types/validate';
import * as convert from '../types/convert';

/**
 * Get SHA256 hash
 * @param {Object|Array|Uint8Array} data - object of NewType type or array of 8-bit integers
 * @param {NewType|NewMessage} [type] - optional, used only if data of {Object} type is passed
 * @return {string}
 */
export function hash(data, type) {
    var buffer;

    if (isInstanceofOfNewType(type) || isInstanceofOfNewMessage(type)) {
        if (isObject(data)) {
            buffer = type.serialize(data);
            if (buffer === undefined) {
                throw new TypeError('Invalid data parameter. Instance of NewType or NewMessage is expected.');
            }
        } else {
            throw new TypeError('Wrong type of data parameter. Object is expected.');
        }
    } else if (type === undefined) {
        if (data instanceof Uint8Array) {
            buffer = data;
        } else if (Array.isArray(data)) {
            buffer = new Uint8Array(data);
        } else {
            throw new TypeError('Invalid data parameter.');
        }
    } else {
        throw new TypeError('Invalid type parameter.');
    }

    return sha('sha256').update(buffer, 'utf8').digest('hex');
}

/**
 * Get ED25519 signature
 * @param {string} secretKey
 * @param {Object|Array} data - object of NewType type or array of 8-bit integers
 * @param {NewType|NewMessage} [type] - optional, used only if data of {Object} type is passed
 * @return {string}
 */
export function sign(secretKey, data, type) {
    var secretKeyUint8Array;
    var buffer;
    var signature;

    if (validate.validateHexHash(secretKey, 64) === false) {
        throw new TypeError('Invalid secretKey parameter.');
    }

    secretKeyUint8Array = convert.hexadecimalToUint8Array(secretKey);

    if (isInstanceofOfNewType(type)) {
        if (isObject(data)) {
            buffer = type.serialize(data);
            if (buffer === undefined) {
                throw new TypeError('Invalid data parameter. Instance of NewType is expected.');
            } else {
                buffer = new Uint8Array(buffer);
            }
        } else {
            throw new TypeError('Wrong type of data. Should be object.');
        }
    } else if (isInstanceofOfNewMessage(type)) {
        if (isObject(data)) {
            buffer = type.serialize(data, true);
            if (buffer === undefined) {
                throw new TypeError('Invalid data parameter. Instance of NewMessage is expected.');
            } else {
                buffer = new Uint8Array(buffer);
            }
        } else {
            throw new TypeError('Wrong type of data. Should be object.');
        }
    } else if (type === undefined) {
        if (data instanceof Uint8Array) {
            buffer = data;
        } else if (Array.isArray(data)) {
            buffer = new Uint8Array(data);
        } else {
            throw new TypeError('Invalid data parameter.');
        }
    } else {
        throw new TypeError('Invalid type parameter.');
    }

    signature = nacl.sign.detached(buffer, secretKeyUint8Array);

    return convert.uint8ArrayToHexadecimal(signature);
}

/**
 * Verifies ED25519 signature
 * @param {string} signature
 * @param {string} publicKey
 * @param {Object|Array} data - object of NewType type or array of 8-bit integers
 * @param {NewType|NewMessage} [type] - optional, used only if data of {Object} type is passed
 * @return {boolean}
 */
export function verifySignature(signature, publicKey, data, type) {
    var signatureUint8Array;
    var publicKeyUint8Array;
    var buffer;

    if (validate.validateHexHash(signature, 64) === false) {
        throw new TypeError('Invalid signature parameter.');
    }

    signatureUint8Array = convert.hexadecimalToUint8Array(signature);

    if (validate.validateHexHash(publicKey) === false) {
        throw new TypeError('Invalid publicKey parameter.');
    }

    publicKeyUint8Array = convert.hexadecimalToUint8Array(publicKey);

    if (isInstanceofOfNewType(type)) {
        if (isObject(data)) {
            buffer = type.serialize(data);
            if (buffer === undefined) {
                throw new TypeError('Invalid data parameter. Instance of NewType is expected.');
            } else {
                buffer = new Uint8Array(buffer);
            }
        } else {
            throw new TypeError('Wrong type of data. Should be object.');
        }
    } else if (isInstanceofOfNewMessage(type)) {
        if (isObject(data)) {
            buffer = type.serialize(data, true);
            if (buffer === undefined) {
                throw new TypeError('Invalid data parameter. Instance of NewMessage is expected.');
            } else {
                buffer = new Uint8Array(buffer);
            }
        } else {
            throw new TypeError('Wrong type of data. Should be object.');
        }
    } else if (type === undefined) {
        if (data instanceof Uint8Array) {
            buffer = data;
        } else if (Array.isArray(data)) {
            buffer = new Uint8Array(data);
        } else {
            throw new TypeError('Invalid data parameter.');
        }
    } else {
        throw new TypeError('Invalid type parameter.');
    }

    return nacl.sign.detached.verify(buffer, signatureUint8Array, publicKeyUint8Array);
}

/**
 * Generate random pair of publicKey and secretKey
 * @return {Object}
 *  publicKey {string}
 *  secretKey {string}
 */
export function keyPair() {
    var pair = nacl.sign.keyPair();
    var publicKey = convert.uint8ArrayToHexadecimal(pair.publicKey);
    var secretKey = convert.uint8ArrayToHexadecimal(pair.secretKey);

    return {
        publicKey: publicKey,
        secretKey: secretKey
    };
}

/**
 * Get random number of cryptographic quality
 * @returns {string}
 */
export function randomUint64() {
    var buffer = nacl.randomBytes(8);
    return bigInt.fromArray(Array.from(buffer), 256).toString();
}

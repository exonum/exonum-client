import sha from 'sha.js';
import nacl from 'tweetnacl';
import * as helpers from '../helpers';
import {isInstanceofOfNewType} from '../types/generic';
import {isInstanceofOfMessage} from '../types/message';
import * as validate from '../types/validate';
import * as convert from '../types/convert';

/**
 * Get SHA256 hash
 * Method with overloading. Accept two combinations of arguments:
 * 1) {Object} data, type
 * 2) {Array} buffer
 * @return {String}
 */
export function hash(data, type) {
    var buffer;
    if (isInstanceofOfNewType(type)) {
        if (helpers.isObject(data) === true) {
            buffer = type.serialize(data);
            if (typeof buffer === 'undefined') {
                console.error('Invalid data parameter. Instance of NewType is expected.');
                return;
            }
        } else {
            console.error('Wrong type of data. Should be object.');
            return;
        }
    } else if (isInstanceofOfMessage(type)) {
        if (helpers.isObject(data) === true) {
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
 * 1) {Object} data, type, {String} secretKey
 * 2) {Array} buffer, {String} secretKey
 * @return {String}
 */
export function sign(data, type, secretKey) {
    var buffer;
    var signature;

    if (typeof secretKey !== 'undefined') {
        if (isInstanceofOfNewType(type)) {
            buffer = type.serialize(data);
            if (typeof buffer === 'undefined') {
                console.error('Invalid data parameter. Instance of NewType is expected.');
                return;
            }
        } else if (isInstanceofOfMessage(type)) {
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
        if (validate.validateBytesArray(data) === false) {
            console.error('Invalid data parameter.');
            return;
        }

        buffer = data;
        secretKey = type;
    }

    if (validate.validateHexHash(secretKey, 64) === false) {
        console.error('Invalid secretKey parameter.');
        return;
    }

    buffer = new Uint8Array(buffer);
    secretKey = convert.hexadecimalToUint8Array(secretKey);
    signature = nacl.sign.detached(buffer, secretKey);

    return convert.uint8ArrayToHexadecimal(signature);
}

/**
 * Verifies ED25519 signature
 * Method with overloading. Accept two combinations of arguments:
 * 1) {Object} data, type, {String} signature, {String} publicKey
 * 2) {Array} buffer, {String} signature, {String} publicKey
 * @return {Boolean}
 */
export function verifySignature(data, type, signature, publicKey) {
    var buffer;

    if (typeof publicKey !== 'undefined') {
        if (isInstanceofOfNewType(type)) {
            buffer = type.serialize(data);
            if (typeof buffer === 'undefined') {
                console.error('Invalid data parameter. Instance of NewType is expected.');
                return;
            }
        } else if (isInstanceofOfMessage(type)) {
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
        if (validate.validateBytesArray(data) === false) {
            console.error('Invalid data parameter.');
            return;
        }

        buffer = data;
        publicKey = signature;
        signature = type;
    }

    if (validate.validateHexHash(publicKey) === false) {
        console.error('Invalid publicKey parameter.');
        return;
    } else if (validate.validateHexHash(signature, 64) === false) {
        console.error('Invalid signature parameter.');
        return;
    }

    buffer = new Uint8Array(buffer);
    signature = convert.hexadecimalToUint8Array(signature);
    publicKey = convert.hexadecimalToUint8Array(publicKey);

    return nacl.sign.detached.verify(buffer, signature, publicKey);
}

/**
 * Generate random pair of publicKey and secretKey
 * @return {Object}
 *  publicKey {String}
 *  secretKey {String}
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

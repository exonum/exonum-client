'use strict';

import sha from 'sha.js';
import nacl from 'tweetnacl';

/**
 * Get SHA256 hash
 * Method with overloading. Accept two combinations of arguments:
 * 1) {Object} data, type
 * 2) {Array} buffer
 * @return {String}
 */
exports.hash = function(data, type) {
    var buffer;
    if (this.isInstanceofOfNewType(type)) {
        if (this.isObject(data) === true) {
            buffer = type.serialize(data);
            if (typeof buffer === 'undefined') {
                console.error('Invalid data parameter. Instance of NewType is expected.');
                return;
            }
        } else {
            console.error('Wrong type of data. Should be object.');
            return;
        }
    } else if (this.isInstanceofOfMessage(type)) {
        if (this.isObject(data) === true) {
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
};

/**
 * Get ED25519 signature
 * Method with overloading. Accept two combinations of arguments:
 * 1) {Object} data, type, {String} secretKey
 * 2) {Array} buffer, {String} secretKey
 * @return {String}
 */
exports.sign = function(data, type, secretKey) {
    var buffer;
    var signature;

    if (typeof secretKey !== 'undefined') {
        if (this.isInstanceofOfNewType(type)) {
            buffer = type.serialize(data);
            if (typeof buffer === 'undefined') {
                console.error('Invalid data parameter. Instance of NewType is expected.');
                return;
            }
        } else if (this.isInstanceofOfMessage(type)) {
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
        if (this.validateBytesArray(data) === false) {
            console.error('Invalid data parameter.');
            return;
        }

        buffer = data;
        secretKey = type;
    }

    if (this.validateHexHash(secretKey, 64) === false) {
        console.error('Invalid secretKey parameter.');
        return;
    }

    buffer = new Uint8Array(buffer);
    secretKey = this.hexadecimalToUint8Array(secretKey);
    signature = nacl.sign.detached(buffer, secretKey);

    return this.uint8ArrayToHexadecimal(signature);
};

/**
 * Verifies ED25519 signature
 * Method with overloading. Accept two combinations of arguments:
 * 1) {Object} data, type, {String} signature, {String} publicKey
 * 2) {Array} buffer, {String} signature, {String} publicKey
 * @return {Boolean}
 */
exports.verifySignature = function(data, type, signature, publicKey) {
    var buffer;

    if (typeof publicKey !== 'undefined') {
        if (this.isInstanceofOfNewType(type)) {
            buffer = type.serialize(data);
            if (typeof buffer === 'undefined') {
                console.error('Invalid data parameter. Instance of NewType is expected.');
                return;
            }
        } else if (this.isInstanceofOfMessage(type)) {
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
        if (this.validateBytesArray(data) === false) {
            console.error('Invalid data parameter.');
            return;
        }

        buffer = data;
        publicKey = signature;
        signature = type;
    }

    if (this.validateHexHash(publicKey) === false) {
        console.error('Invalid publicKey parameter.');
        return;
    } else if (this.validateHexHash(signature, 64) === false) {
        console.error('Invalid signature parameter.');
        return;
    }

    buffer = new Uint8Array(buffer);
    signature = this.hexadecimalToUint8Array(signature);
    publicKey = this.hexadecimalToUint8Array(publicKey);

    return nacl.sign.detached.verify(buffer, signature, publicKey);
};

/**
 * Generate random pair of publicKey and secretKey
 * @return {Object}
 *  publicKey {String}
 *  secretKey {String}
 */
exports.keyPair = function() {
    var pair = nacl.sign.keyPair();
    var publicKey = this.uint8ArrayToHexadecimal(pair.publicKey);
    var secretKey = this.uint8ArrayToHexadecimal(pair.secretKey);

    return {
        publicKey: publicKey,
        secretKey: secretKey
    };
};


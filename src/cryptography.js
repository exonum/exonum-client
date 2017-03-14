'use strict';
var Exonum = require('../src/core');

require('../src/convertors');
require('../src/data-management');
require('../src/validators');

var sha = require('sha.js');
var nacl = require('tweetnacl');

/**
 * Get SHA256 hash
 * Method with overloading. Accept two combinations of arguments:
 * 1) {Object} data, type
 * 2) {Array} buffer
 * @return {String}
 */
Exonum.hash = function(data, type) {
    var buffer;
    if (Exonum.isInstanceofOfNewType(type)) {
        if (Exonum.isObject(data) === true) {
            buffer = type.serialize(data);
            if (typeof buffer === 'undefined') {
                console.error('Invalid data parameter. Instance of NewType is expected.');
                return;
            }
        } else {
            console.error('Wrong type of data. Should be object.');
            return;
        }
    } else if (Exonum.isInstanceofOfMessage(type)) {
        if (Exonum.isObject(data) === true) {
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
Exonum.sign = function(data, type, secretKey) {
    var buffer;
    var signature;

    if (typeof secretKey !== 'undefined') {
        if (Exonum.isInstanceofOfNewType(type)) {
            buffer = type.serialize(data);
            if (typeof buffer === 'undefined') {
                console.error('Invalid data parameter. Instance of NewType is expected.');
                return;
            }
        } else if (Exonum.isInstanceofOfMessage(type)) {
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
        if (Exonum.validateBytesArray(data) === false) {
            console.error('Invalid data parameter.');
            return;
        }

        buffer = data;
        secretKey = type;
    }

    if (Exonum.validateHexHash(secretKey, 64) === false) {
        console.error('Invalid secretKey parameter.');
        return;
    }

    buffer = new Uint8Array(buffer);
    secretKey = Exonum.hexadecimalToUint8Array(secretKey);
    signature = nacl.sign.detached(buffer, secretKey);

    return Exonum.uint8ArrayToHexadecimal(signature);
};

/**
 * Verifies ED25519 signature
 * Method with overloading. Accept two combinations of arguments:
 * 1) {Object} data, type, {String} signature, {String} publicKey
 * 2) {Array} buffer, {String} signature, {String} publicKey
 * @return {Boolean}
 */
Exonum.verifySignature = function(data, type, signature, publicKey) {
    var buffer;

    if (typeof publicKey !== 'undefined') {
        if (Exonum.isInstanceofOfNewType(type)) {
            buffer = type.serialize(data);
            if (typeof buffer === 'undefined') {
                console.error('Invalid data parameter. Instance of NewType is expected.');
                return;
            }
        } else if (Exonum.isInstanceofOfMessage(type)) {
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
        if (Exonum.validateBytesArray(data) === false) {
            console.error('Invalid data parameter.');
            return;
        }

        buffer = data;
        publicKey = signature;
        signature = type;
    }

    if (Exonum.validateHexHash(publicKey) === false) {
        console.error('Invalid publicKey parameter.');
        return;
    } else if (Exonum.validateHexHash(signature, 64) === false) {
        console.error('Invalid signature parameter.');
        return;
    }

    buffer = new Uint8Array(buffer);
    signature = Exonum.hexadecimalToUint8Array(signature);
    publicKey = Exonum.hexadecimalToUint8Array(publicKey);

    return nacl.sign.detached.verify(buffer, signature, publicKey);
};

/**
 * Generate random pair of publicKey and secretKey
 * @return {Object}
 *  publicKey {String}
 *  secretKey {String}
 */
Exonum.keyPair = function() {
    var pair = nacl.sign.keyPair();
    var publicKey = Exonum.uint8ArrayToHexadecimal(pair.publicKey);
    var secretKey = Exonum.uint8ArrayToHexadecimal(pair.secretKey);

    return {
        publicKey: publicKey,
        secretKey: secretKey
    };
};

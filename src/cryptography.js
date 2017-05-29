'use strict';
var Exonum = require('../src/core');

require('../src/convertors');
require('../src/data-management');
require('../src/serialization');
require('../src/validators');

var sha = require('sha.js');
var nacl = require('tweetnacl');
var bigInt = require('big-integer');

/**
 * Get SHA256 hash
 * @param {Object|Array|Uint8Array} data - object of NewType type or array of 8-bit integers
 * @param {NewType|NewMessage} [type] - optional, used only if data of {Object} type is passed
 * @return {string}
 */
Exonum.hash = function(data, type) {
    var buffer;

    if (Exonum.isInstanceofOfNewType(type) || Exonum.isInstanceofOfNewMessage(type)) {
        if (Exonum.isObject(data)) {
            buffer = type.serialize(data);
            if (buffer === undefined) {
                console.error('Invalid data parameter. Instance of NewType is expected.');
                return;
            }
        } else {
            console.error('Wrong type of data parameter. Object is expected.');
            return;
        }
    } else if (type === undefined) {
        if (data instanceof Uint8Array) {
            buffer = data;
        } else if (Array.isArray(data)) {
            buffer = new Uint8Array(data);
        } else {
            console.error('Invalid data parameter.');
            return;
        }
    } else {
        console.error('Invalid type parameter.');
        return;
    }

    return sha('sha256').update(buffer, 'utf8').digest('hex');
};

/**
 * Get ED25519 signature
 * @param {string} secretKey
 * @param {Object|Array} data - object of NewType type or array of 8-bit integers
 * @param {NewType|NewMessage} [type] - optional, used only if data of {Object} type is passed
 * @return {string}
 */
Exonum.sign = function(secretKey, data, type) {
    var secretKeyUint8Array;
    var buffer;
    var signature;

    if (Exonum.validateHexHash(secretKey, 64) === false) {
        console.error('Invalid secretKey parameter.');
        return;
    }

    secretKeyUint8Array = Exonum.hexadecimalToUint8Array(secretKey);

    if (Exonum.isInstanceofOfNewType(type) || Exonum.isInstanceofOfNewMessage(type)) {
        if (Exonum.isObject(data)) {
            buffer = type.serialize(data);
            if (buffer === undefined) {
                console.error('Invalid data parameter. Instance of NewType or NewMessage is expected.');
                return;
            } else {
                buffer = new Uint8Array(buffer);
            }
        } else {
            console.error('Wrong type of data. Should be object.');
            return;
        }
    } else if (type === undefined) {
        if (data instanceof Uint8Array) {
            buffer = data;
        } else if (Array.isArray(data)) {
            buffer = new Uint8Array(data);
        } else {
            console.error('Invalid data parameter.');
            return;
        }
    } else {
        console.error('Invalid type parameter.');
        return;
    }

    signature = nacl.sign.detached(buffer, secretKeyUint8Array);

    return Exonum.uint8ArrayToHexadecimal(signature);
};

/**
 * Verifies ED25519 signature
 * @param {string} signature
 * @param {string} publicKey
 * @param {Object|Array} data - object of NewType type or array of 8-bit integers
 * @param {NewType|NewMessage} [type] - optional, used only if data of {Object} type is passed
 * @return {boolean}
 */
Exonum.verifySignature = function(signature, publicKey, data, type) {
    var signatureUint8Array;
    var publicKeyUint8Array;
    var buffer;

    if (Exonum.validateHexHash(signature, 64) === false) {
        console.error('Invalid signature parameter.');
        return false;
    }

    signatureUint8Array = Exonum.hexadecimalToUint8Array(signature);

    if (Exonum.validateHexHash(publicKey) === false) {
        console.error('Invalid publicKey parameter.');
        return false;
    }

    publicKeyUint8Array = Exonum.hexadecimalToUint8Array(publicKey);

    if (Exonum.isInstanceofOfNewType(type)) {
        if (Exonum.isObject(data)) {
            buffer = type.serialize(data);
            if (buffer === undefined) {
                console.error('Invalid data parameter. Instance of NewType is expected.');
                return false;
            } else {
                buffer = new Uint8Array(buffer);
            }
        } else {
            console.error('Wrong type of data. Should be object.');
            return false;
        }
    } else if (Exonum.isInstanceofOfNewMessage(type)) {
        if (Exonum.isObject(data)) {
            buffer = type.serialize(data, true);
            if (buffer === undefined) {
                console.error('Invalid data parameter. Instance of NewMessage is expected.');
                return false;
            } else {
                buffer = new Uint8Array(buffer);
            }
        } else {
            console.error('Wrong type of data. Should be object.');
            return false;
        }
    } else if (type === undefined) {
        if (data instanceof Uint8Array) {
            buffer = data;
        } else if (Array.isArray(data)) {
            buffer = new Uint8Array(data);
        } else {
            console.error('Invalid data parameter.');
            return;
        }
    } else {
        console.error('Invalid type parameter.');
        return false;
    }

    return nacl.sign.detached.verify(buffer, signatureUint8Array, publicKeyUint8Array);
};

/**
 * Generate random pair of publicKey and secretKey
 * @return {Object}
 *  publicKey {string}
 *  secretKey {string}
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

/**
 * Get random number of cryptographic quality
 * @returns {string}
 */
Exonum.randomUint64 = function() {
    var buffer = nacl.randomBytes(8);
    return bigInt.fromArray(Array.from(buffer), 256).toString();
};

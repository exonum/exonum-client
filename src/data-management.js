'use strict';
var Exonum = require('../src/core');

require('../src/cryptography');
require('../src/serialization');
require('../src/types');

const SIGNATURE_LENGTH = 64;

/**
 * @constructor
 * @param {Object} type
 */
function NewType(type) {
    this.size = type.size;
    this.fields = type.fields;
}

/**
 * Serialize data of NewType type into array of 8-bit integers
 * @param {Object} data
 * @returns {Array}
 */
NewType.prototype.serialize = function(data) {
    return Exonum.serialize([], 0, data, this);
};

/**
 * Get SHA256 hash
 * @param {Object} data
 * @returns {string}
 */
NewType.prototype.hash = function(data) {
    return Exonum.hash(data, this);
};

/**
 * Get ED25519 signature
 * @param {string} secretKey
 * @param {Object} data
 * @returns {string}
 */
NewType.prototype.sign = function(secretKey, data) {
    return Exonum.sign(secretKey, data, this);
};

/**
 * Verifies ED25519 signature
 * @param {string} signature
 * @param {string} publicKey
 * @param {Object} data
 * @returns {boolean}
 */
NewType.prototype.verifySignature = function(signature, publicKey, data) {
    return Exonum.verifySignature(signature, publicKey, data, this);
};

/**
 * Create element of NewType class
 * @param {Object} type
 * @returns {NewType}
 */
Exonum.newType = function(type) {
    return new NewType(type);
};

/**
 * Check if passed object is of type NewType
 * @param {Object} type
 * @returns {boolean}
 */
Exonum.isInstanceofOfNewType = function(type) {
    return type instanceof NewType;
};

/**
 * @constructor
 * @param {Object} type
 */
function NewMessage(type) {
    this.size = type.size;
    this.message_id = type.message_id;
    this.service_id = type.service_id;
    this.signature = type.signature;
    this.fields = type.fields;
}

/**
 * Serialize data of NewMessage type into array of 8-bit integers
 * @param {Object} data
 * @param {boolean} [cutSignature] - optional parameter used flag that signature should not be appended to serialized data
 * @returns {Array}
 */
NewMessage.prototype.serialize = function(data, cutSignature) {
    var MessageHead = Exonum.newType({
        size: 10,
        fields: {
            network_id: {type: Exonum.Uint8, size: 1, from: 0, to: 1},
            version: {type: Exonum.Uint8, size: 1, from: 1, to: 2},
            message_id: {type: Exonum.Uint16, size: 2, from: 2, to: 4},
            service_id: {type: Exonum.Uint16, size: 2, from: 4, to: 6},
            payload: {type: Exonum.Uint32, size: 4, from: 6, to: 10}
        }
    });
    var buffer = MessageHead.serialize({
        network_id: Exonum.NETWORK_ID,
        version: 0,
        message_id: this.message_id,
        service_id: this.service_id
    });

    // serialize and append message body
    buffer = Exonum.serialize(buffer, MessageHead.size, data, this);
    if (typeof buffer === 'undefined') {
        return;
    }

    // calculate payload and insert it into buffer
    Exonum.Uint32(buffer.length + SIGNATURE_LENGTH, buffer, MessageHead.fields.payload.from, MessageHead.fields.payload.to);

    if (cutSignature !== true) {
        // append signature
        Exonum.Digest(this.signature, buffer, buffer.length, buffer.length + SIGNATURE_LENGTH);
    }

    return buffer;
};

/**
 * Get SHA256 hash
 * @param {Object} data
 * @returns {string}
 */
NewMessage.prototype.hash = function(data) {
    return Exonum.hash(data, this);
};

/**
 * Get ED25519 signature
 * @param {string} secretKey
 * @param {Object} data
 * @returns {string}
 */
NewMessage.prototype.sign = function(secretKey, data) {
    return Exonum.sign(secretKey, data, this);
};

/**
 * Verifies ED25519 signature
 * @param {string} signature
 * @param {string} publicKey
 * @param {Object} data
 * @returns {boolean}
 */
NewMessage.prototype.verifySignature = function(signature, publicKey, data) {
    return Exonum.verifySignature(signature, publicKey, data, this);
};

/**
 * Create element of NewMessage class
 * @param {Object} type
 * @returns {NewMessage}
 */
Exonum.newMessage = function(type) {
    return new NewMessage(type);
};

/**
 * Check if passed object is of type NewMessage
 * @param type
 * @returns {boolean}
 */
Exonum.isInstanceofOfNewMessage = function(type) {
    return type instanceof NewMessage;
};


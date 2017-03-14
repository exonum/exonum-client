'use strict';
var Exonum = require('../src/core');

require('../src/cryptography');
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
 * Built-in method to serialize data into array of 8-bit integers
 * @param {Object} data
 * @returns {Array}
 */
NewType.prototype.serialize = function(data) {
    return Exonum.serialize([], 0, data, this);
};

NewType.prototype.hash = function(data) {
    return Exonum.hash(data, this);
};

NewType.prototype.sign = function(data, secretKey) {
    return Exonum.sign(data, this, secretKey);
};

NewType.prototype.verifySignature = function(data, signature, publicKey) {
    return Exonum.verifySignature(data, this, signature, publicKey);
};

/**
 * Create element of NewType class
 * @param {Object} type
 * @returns {NewType}
 */
Exonum.newType = function(type) {
    return new NewType(type);
};

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
 * Built-in method to serialize data into array of 8-bit integers
 * @param {Object} data
 * @param {Boolean} cutSignature
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

NewMessage.prototype.hash = function(data) {
    return Exonum.hash(data, this);
};

NewMessage.prototype.sign = function(data, secretKey) {
    return Exonum.sign(data, this, secretKey);
};

NewMessage.prototype.verifySignature = function(data, signature, publicKey) {
    return Exonum.verifySignature(data, this, signature, publicKey);
};

/**
 * Create element of NewMessage class
 * @param {Object} type
 * @returns {NewMessage}
 */
Exonum.newMessage = function(type) {
    return new NewMessage(type);
};

Exonum.isInstanceofOfMessage = function(type) {
    return type instanceof NewMessage;
};


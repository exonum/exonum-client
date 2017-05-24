'use strict';

const SIGNATURE_LENGTH = 64;

/**
 * @constructor
 * @param {Object} type
 */
class NewMessage {
    constructor(type, parent) {
        this.size = type.size;
        this.message_id = type.message_id;
        this.service_id = type.service_id;
        this.signature = type.signature;
        this.fields = type.fields;
        this.parent = parent;
    }

    /**
     * Built-in method to serialize data into array of 8-bit integers
     * @param {Object} data
     * @param {Boolean} cutSignature
     * @returns {Array}
     */
    serialize(data, cutSignature) {
        var MessageHead = this.parent.newType({
            size: 10,
            fields: {
                network_id: {type: this.parent.Uint8, size: 1, from: 0, to: 1},
                version: {type: this.parent.Uint8, size: 1, from: 1, to: 2},
                message_id: {type: this.parent.Uint16, size: 2, from: 2, to: 4},
                service_id: {type: this.parent.Uint16, size: 2, from: 4, to: 6},
                payload: {type: this.parent.Uint32, size: 4, from: 6, to: 10}
            }
        });
        var buffer = MessageHead.serialize({
            network_id: this.parent.NETWORK_ID,
            version: 0,
            message_id: this.message_id,
            service_id: this.service_id
        });

        // serialize and append message body
        buffer = this.parent.serialize.call(this.parent, buffer, MessageHead.size, data, this);
        if (typeof buffer === 'undefined') {
            return;
        }

        // calculate payload and insert it into buffer
        this.parent.Uint32(buffer.length + SIGNATURE_LENGTH, buffer, MessageHead.fields.payload.from, MessageHead.fields.payload.to);

        if (cutSignature !== true) {
            // append signature
            this.parent.Digest(this.signature, buffer, buffer.length, buffer.length + SIGNATURE_LENGTH);
        }

        return buffer;
    }

    hash(data) {
        return this.parent.hash.call(this.parent, data, this);
    }

    sign(data, secretKey) {
        return this.parent.sign.call(this.parent, data, this, secretKey);
    }

    verifySignature(data, signature, publicKey) {
        return this.parent.verifySignature.call(this.parent, data, this, signature, publicKey);
    }
}

/**
 * Create element of NewMessage class
 * @param {Object} type
 * @returns {NewMessage}
 */
export function newMessage(type) {
    return new NewMessage(type, this);
}

export function isInstanceofOfMessage(type) {
    return type instanceof NewMessage;
}

'use strict';

import * as primitive from './primitive';
import {newType} from './generic';
import * as serialization from './serialization';
import * as crypto from '../crypto';

const SIGNATURE_LENGTH = 64;

/**
 * @constructor
 * @param {Object} type
 */
class NewMessage {
    constructor(type, self) {
        this.size = type.size;
        this.message_id = type.message_id;
        this.service_id = type.service_id;
        this.signature = type.signature;
        this.fields = type.fields;
        this.self = self;
    }

    /**
     * Built-in method to serialize data into array of 8-bit integers
     * @param {Object} data
     * @param {Boolean} cutSignature
     * @returns {Array}
     */
    serialize(data, cutSignature) {
        var MessageHead = newType({
            size: 10,
            fields: {
                network_id: {type: primitive.Uint8, size: 1, from: 0, to: 1},
                version: {type: primitive.Uint8, size: 1, from: 1, to: 2},
                message_id: {type: primitive.Uint16, size: 2, from: 2, to: 4},
                service_id: {type: primitive.Uint16, size: 2, from: 4, to: 6},
                payload: {type: primitive.Uint32, size: 4, from: 6, to: 10}
            }
        });
        var buffer = MessageHead.serialize({
            network_id: this.self.NETWORK_ID, // TODO undefined
            version: 0,
            message_id: this.message_id,
            service_id: this.service_id
        });

        // serialize and append message body
        buffer = serialization.serialize(buffer, MessageHead.size, data, this);
        if (typeof buffer === 'undefined') {
            return;
        }

        // calculate payload and insert it into buffer
        primitive.Uint32(buffer.length + SIGNATURE_LENGTH, buffer, MessageHead.fields.payload.from, MessageHead.fields.payload.to);

        if (cutSignature !== true) {
            // append signature
            primitive.Digest(this.signature, buffer, buffer.length, buffer.length + SIGNATURE_LENGTH);
        }

        return buffer;
    }

    hash(data) {
        return crypto.hash(data, this);
    }

    sign(data, secretKey) {
        return crypto.sign(data, this, secretKey);
    }

    verifySignature(data, signature, publicKey) {
        return crypto.verifySignature(data, this, signature, publicKey);
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

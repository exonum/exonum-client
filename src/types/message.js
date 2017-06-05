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
    constructor(type) {
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
            network_id: 0,
            version: 0,
            message_id: this.message_id,
            service_id: this.service_id,
            payload: 0 // placeholder, real value will be inserted later
        });

        // serialize and append message body
        buffer = serialization.serialize(buffer, MessageHead.size, data, this);

        // calculate payload and insert it into buffer
        primitive.Uint32(buffer.length + SIGNATURE_LENGTH, buffer, MessageHead.fields.payload.from, MessageHead.fields.payload.to);

        if (cutSignature !== true) {
            // append signature
            primitive.Digest(this.signature, buffer, buffer.length, buffer.length + SIGNATURE_LENGTH);
        }

        return buffer;
    }

    /**
     * Get SHA256 hash
     * @param {Object} data
     * @returns {string}
     */
    hash(data) {
        return crypto.hash(data, this);
    }

    /**
     * Get ED25519 signature
     * @param {string} secretKey
     * @param {Object} data
     * @returns {string}
     */
    sign(secretKey, data) {
        return crypto.sign(secretKey, data, this);
    }

    /**
     * Verifies ED25519 signature
     * @param {string} signature
     * @param {string} publicKey
     * @param {Object} data
     * @returns {boolean}
     */
    verifySignature(signature, publicKey, data) {
        return crypto.verifySignature(signature, publicKey, data, this);
    }
}

/**
 * Create element of NewMessage class
 * @param {Object} type
 * @returns {NewMessage}
 */
export function newMessage(type) {
    return new NewMessage(type);
}

/**
 * Check if passed object is of type NewMessage
 * @param type
 * @returns {boolean}
 */
export function isInstanceofOfNewMessage(type) {
    return type instanceof NewMessage;
}

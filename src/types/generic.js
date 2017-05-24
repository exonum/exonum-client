'use strict';

import * as serialization from './serialization';
import * as crypto from '../crypto';

/**
 * @constructor
 * @param {Object} type
 */
class NewType {
    constructor(type) {
        this.size = type.size;
        this.fields = type.fields;
    }

    /**
     * Built-in method to serialize data into array of 8-bit integers
     * @param {Object} data
     * @returns {Array}
     */
    serialize(data) {
        return serialization.serialize([], 0, data, this);
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
 * Create element of NewType class
 * @param {Object} type
 * @returns {NewType}
 */
export function newType(type) {
    return new NewType(type);
}

export function isInstanceofOfNewType(type) {
    return type instanceof NewType;
}

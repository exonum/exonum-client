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
     * Serialize data of NewType type into array of 8-bit integers
     * @param {Object} data
     * @returns {Array}
     */
    serialize(data) {
        return serialization.serialize([], 0, data, this);
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
 * Create element of NewType class
 * @param {Object} type
 * @returns {NewType}
 */
export function newType(type) {
    return new NewType(type);
}

/**
 * Check if passed object is of type NewType
 * @param {Object} type
 * @returns {boolean}
 */
export function isInstanceofOfNewType(type) {
    return type instanceof NewType;
}

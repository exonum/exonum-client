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
        try {
            return serialization.serialize([], 0, data, this);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get SHA256 hash
     * @param {Object} data
     * @returns {string}
     */
    hash(data) {
        try {
            return crypto.hash(data, this);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get ED25519 signature
     * @param {string} secretKey
     * @param {Object} data
     * @returns {string}
     */
    sign(secretKey, data) {
        try {
            return crypto.sign(secretKey, data, this);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Verifies ED25519 signature
     * @param {string} signature
     * @param {string} publicKey
     * @param {Object} data
     * @returns {boolean}
     */
    verifySignature(signature, publicKey, data) {
        try {
            return crypto.verifySignature(signature, publicKey, data, this);
        } catch (error) {
            throw error;
        }
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

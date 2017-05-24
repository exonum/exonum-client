'use strict';

/**
 * @constructor
 * @param {Object} type
 */
class NewType {
    constructor(type, parent) {
        this.size = type.size;
        this.fields = type.fields;
        this.parent = parent;
    }

    /**
     * Built-in method to serialize data into array of 8-bit integers
     * @param {Object} data
     * @returns {Array}
     */
    serialize(data) {
        return this.parent.serialize.call(this.parent, [], 0, data, this);
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
 * Create element of NewType class
 * @param {Object} type
 * @returns {NewType}
 */
exports.newType = function(type) {
    return new NewType(type, this);
};

exports.isInstanceofOfNewType = function(type) {
    return type instanceof NewType;
};

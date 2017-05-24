'use strict';

import * as types from './types/index';
import * as crypto from './crypto/index';
import * as blockchain from './blockchain/index';

class Exonum {
    constructor() {
        this.NETWORK_ID = 0;
    }

    /**
     * Check if element is of type {Object}
     * @param obj
     * @returns {boolean}
     */
    isObject(obj) {
        return (typeof obj === 'object' && Array.isArray(obj) === false && obj !== null && !(obj instanceof Date));
    }

    /**
     * Get length of object
     * @param {Object} obj
     * @returns {Number}
     */
    getObjectLength(obj) {
        var l = 0;
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                l++;
            }
        }
        return l;
    }
}

const methods = Object.assign(types, crypto, blockchain);
for (let i in methods) {
    Exonum.prototype[i] = methods[i];
}

module.exports = new Exonum();

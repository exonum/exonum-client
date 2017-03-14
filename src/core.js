'use strict';

var Exonum = {
    NETWORK_ID: 0
};

/**
 * Check if element is of type {Object}
 * @param obj
 * @returns {boolean}
 */
Exonum.isObject = function(obj) {
    return (typeof obj === 'object' && Array.isArray(obj) === false && obj !== null && !(obj instanceof Date));
};

/**
 * Get length of object
 * @param {Object} obj
 * @returns {Number}
 */
Exonum.getObjectLength = function(obj) {
    var l = 0;
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            l++;
        }
    }
    return l;
};

module.exports = Exonum;

'use strict';

var Exonum = {
    NETWORK_ID: 0
};

/**
 * Check if element is of type Object
 * @param obj
 * @returns {boolean}
 */
Exonum.isObject = function(obj) {
    return (typeof obj === 'object' && Array.isArray(obj) === false && obj !== null && !(obj instanceof Date));
};

module.exports = Exonum;

'use strict';

let Exonum = {
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
    let l = 0;
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            l++;
        }
    }
    return l;
};

export default Exonum;

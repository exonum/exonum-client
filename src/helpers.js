'use strict';

/**
 * Check if element is of type {Object}
 * @param obj
 * @returns {boolean}
 */
export function isObject(obj) {
    return (typeof obj === 'object' && Array.isArray(obj) === false && obj !== null && !(obj instanceof Date));
}

/**
 * Get length of object
 * @param {Object} obj
 * @returns {Number}
 */
export function getObjectLength(obj) {
    var l = 0;
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            l++;
        }
    }
    return l;
}

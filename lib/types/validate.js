"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateInteger = validateInteger;
exports.validateHexadecimal = validateHexadecimal;
exports.validateBytesArray = validateBytesArray;
exports.validateBinaryString = validateBinaryString;

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @param {number} from
 * @param {number} length
 * @returns {boolean}
 */
function validateInteger(value, min, max, from, length) {
  if (typeof value !== 'number' || value < min || value > max) {
    return false;
  }

  return true;
}
/**
 * @param {string} hash
 * @param {number} [bytes=32] - optional
 * @returns {boolean}
 */


function validateHexadecimal(hash, bytes) {
  bytes = bytes || 32;

  if (typeof hash !== 'string') {
    return false;
  }

  if (hash.length !== bytes * 2) {
    // 'hexadecimal string is of wrong length
    return false;
  }

  for (var i = 0; i < hash.length; i++) {
    if (isNaN(parseInt(hash[i], 16))) {
      // invalid symbol in hexadecimal string
      return false;
    }
  }

  return true;
}
/**
 * @param {Array} arr
 * @param {number} [bytes] - optional
 * @returns {boolean}
 */


function validateBytesArray(arr, bytes) {
  if (!Array.isArray(arr) && !(arr instanceof Uint8Array)) {
    return false;
  }

  if (bytes && arr.length !== bytes) {
    // array is of wrong length
    return false;
  }

  for (var i = 0; i < arr.length; i++) {
    if (typeof arr[i] !== 'number' || arr[i] < 0 || arr[i] > 255) {
      return false;
    }
  }

  return true;
}
/**
 * @param {string} str
 * @param {number} [bits] - optional
 * @returns {*}
 */


function validateBinaryString(str, bits) {
  if (bits !== undefined && str.length !== bits) {
    return false;
  }

  for (var i = 0; i < str.length; i++) {
    if (str[i] !== '0' && str[i] !== '1') {
      // wrong bit
      return false;
    }
  }

  return true;
}

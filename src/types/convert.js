import * as validate from '../types/validate'

/**
 * Convert hexadecimal string into uint8Array
 * @param {string} str
 * @returns {Uint8Array}
 */
export function hexadecimalToUint8Array (str) {
  if (typeof str !== 'string') {
    throw new TypeError('Wrong data type passed to convertor. Hexadecimal string is expected')
  }

  if (!validate.validateHexadecimal(str, str.length / 2)) {
    throw new TypeError('String of wrong type is passed. Hexadecimal expected.')
  }

  const uint8arr = new Uint8Array(str.length / 2)

  for (let i = 0, j = 0; i < str.length; i += 2, j++) {
    uint8arr[j] = parseInt(str.substr(i, 2), 16)
  }

  return uint8arr
}

/**
 * Convert hexadecimal string into binary string
 * @param {string} str
 * @returns {string}
 */
export function hexadecimalToBinaryString (str) {
  let binaryStr = ''

  if (typeof str !== 'string') {
    throw new TypeError('Wrong data type passed to convertor. Hexadecimal string is expected')
  }

  if (!validate.validateHexadecimal(str, Math.ceil(str.length / 2))) {
    throw new TypeError('String of wrong type is passed. Hexadecimal expected.')
  }
  let prevBin = null
  for (let i = 0; i < str.length; i++) {
    let bin = strReverse(parseInt(str[i], 16).toString(2))
    while (bin.length < 4) {
      bin = bin + '0'
    }
    if (!prevBin) {
      prevBin = bin
    } else {
      binaryStr += bin + prevBin
      prevBin = null
    }
  }

  return binaryStr
}

/**
 * Convert uint8Array into string
 * @param {Uint8Array} uint8arr
 * @returns {string}
 */
export function uint8ArrayToHexadecimal (uint8arr) {
  let str = ''

  if (!(uint8arr instanceof Uint8Array)) {
    throw new TypeError('Wrong data type of array of 8-bit integers. Uint8Array is expected')
  }

  for (let i = 0; i < uint8arr.length; i++) {
    let hex = uint8arr[i].toString(16)
    hex = (hex.length === 1) ? '0' + hex : hex
    str += hex
  }

  return str.toLowerCase()
}

/**
 * Convert uint8Array into binary string
 * @param {Uint8Array} uint8arr
 * @returns {string}
 */
export function uint8ArrayToBinaryString (uint8arr) {
  let binaryStr = ''

  if (!(uint8arr instanceof Uint8Array)) {
    throw new TypeError('Wrong data type of array of 8-bit integers. Uint8Array is expected')
  }

  for (let i = 0; i < uint8arr.length; i++) {
    let bin = strReverse(uint8arr[i].toString(2))
    while (bin.length < 8) {
      bin = bin + '0'
    }
    binaryStr += bin
  }

  return binaryStr
}

/**
 * Convert binary string into uint8Array
 * @param {string} binaryStr
 * @returns {Uint8Array}
 */
export function binaryStringToUint8Array (binaryStr) {
  const array = []

  if (typeof binaryStr !== 'string') {
    throw new TypeError('Wrong data type passed to convertor. Binary string is expected')
  }

  if (!validate.validateBinaryString(binaryStr)) {
    throw new TypeError('String of wrong type is passed. Binary string expected.')
  }

  for (let i = 0; i < binaryStr.length; i += 8) {
    array.push(parseInt(strReverse(binaryStr.substr(i, 8)), 2))
  }

  return new Uint8Array(array)
}

/**
 * Convert string into reverse string
 * @param str
 * @returns {string}
 */
function strReverse (str) {
  return str.split('').reverse().join('')
}

/**
 * Convert binary string into hexadecimal string
 * @param {string} binaryStr
 * @returns {string}
 */
export function binaryStringToHexadecimal (binaryStr) {
  let str = ''

  if (typeof binaryStr !== 'string') {
    throw new TypeError('Wrong data type passed to convertor. Binary string is expected')
  }

  if (!validate.validateBinaryString(binaryStr)) {
    throw new TypeError('String of wrong type is passed. Binary string expected.')
  }

  for (let i = 0; i < binaryStr.length; i += 8) {
    let hex = parseInt(strReverse(binaryStr.substr(i, 8)), 2).toString(16)
    hex = (hex.length === 1) ? '0' + hex : hex
    str += hex
  }

  return str.toLowerCase()
}

/**
 * Convert sting into uint8Array
 * @param {string} str
 * @param {number} [len] - optional
 * @returns {Uint8Array}
 */
export function stringToUint8Array (str, len) {
  let array
  let from = 0

  if (typeof str !== 'string') {
    throw new TypeError('Wrong data type passed to convertor. String is expected')
  }

  if (len > 0) {
    array = new Array(len)
    array.fill(0)
  } else {
    array = []
  }

  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i)

    if (c < 128) {
      array[from++] = c
    } else if (c < 2048) {
      array[from++] = (c >> 6) | 192
      array[from++] = (c & 63) | 128
    } else if (((c & 0xFC00) === 0xD800) && (i + 1) < str.length && ((str.charCodeAt(i + 1) & 0xFC00) === 0xDC00)) {
      // surrogate pair
      c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF)
      array[from++] = (c >> 18) | 240
      array[from++] = ((c >> 12) & 63) | 128
      array[from++] = ((c >> 6) & 63) | 128
      array[from++] = (c & 63) | 128
    } else {
      array[from++] = (c >> 12) | 224
      array[from++] = ((c >> 6) & 63) | 128
      array[from++] = (c & 63) | 128
    }
  }

  return new Uint8Array(array)
}

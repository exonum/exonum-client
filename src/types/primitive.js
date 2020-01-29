import bigInt from 'big-integer'
import * as validate from './validate'

const MAX_UINT8 = 255
const MAX_UINT16 = 65535
const MAX_UINT32 = 4294967295
const MAX_UINT64 = 18446744073709551615

/**
 * Insert number into array as little-endian or big-endian
 * @param {number|bigInt} number
 * @param {Array} buffer
 * @param {number} from
 * @param {number} size
 * @param {boolean} isBigEndian
 * @returns {Array}
 */
function insertIntegerToByteArray (number, buffer, from, size, isBigEndian = false) {
  let value = bigInt(number) // convert a number-like object into a big integer

  for (
    let pos = isBigEndian ? (size - 1) : 0;
    isBigEndian ? (pos >= 0) : (pos < size);
    isBigEndian ? pos-- : pos++
  ) {
    const divmod = value.divmod(256)
    buffer[from + pos] = divmod.remainder.toJSNumber()
    value = divmod.quotient
  }

  return buffer
}

export class Uint8 {
  static size () {
    return 1
  }

  /**
   * @param {number} value
   * @param {Array} buffer
   * @param {number} from
   * @returns {Array}
   */
  static serialize (value, buffer, from) {
    if (!validate.validateInteger(value, 0, MAX_UINT8, from, this.size())) {
      throw new TypeError('Uint8 of wrong type is passed: ' + value)
    }

    return insertIntegerToByteArray(value, buffer, from, this.size())
  }
}

export class Uint16 {
  static size () {
    return 2
  }

  /**
   * @param {number} value
   * @param {Array} buffer
   * @param {number} from
   * @param {boolean} isBigEndian
   * @returns {Array}
   */
  static serialize (value, buffer, from, isBigEndian) {
    if (!validate.validateInteger(value, 0, MAX_UINT16, from, this.size())) {
      throw new TypeError('Uint16 of wrong type is passed: ' + value)
    }

    return insertIntegerToByteArray(value, buffer, from, this.size(), isBigEndian)
  }
}

export class Uint32 {
  static size () {
    return 4
  }

  /**
   * @param {number} value
   * @param {Array} buffer
   * @param {number} from
   * @param {boolean} isBigEndian
   * @returns {Array}
   */
  static serialize (value, buffer, from, isBigEndian) {
    if (!validate.validateInteger(value, 0, MAX_UINT32, from, this.size())) {
      throw new TypeError('Uint32 of wrong type is passed: ' + value)
    }

    return insertIntegerToByteArray(value, buffer, from, this.size(), isBigEndian)
  }
}

export class Uint64 {
  static size () {
    return 8
  }

  /**
   * @param {number} value
   * @param {Array} buffer
   * @param {number} from
   * @param {boolean} isBigEndian
   * @returns {Array}
   */
  static serialize (value, buffer, from, isBigEndian) {
    if (!validate.validateInteger(value, 0, MAX_UINT64, from, this.size())) {
      throw new TypeError('Uint16 of wrong type is passed: ' + value)
    }

    return insertIntegerToByteArray(value, buffer, from, this.size(), isBigEndian)
  }
}

export class Bool {
  static size () {
    return 1
  }

  /**
   * @param {boolean} value
   * @param {Array} buffer
   * @param {number} from
   * @returns {Array}
   */
  static serialize (value, buffer, from) {
    if (typeof value !== 'boolean') {
      throw new TypeError('Wrong data type is passed as Boolean. Boolean is required')
    }

    return insertIntegerToByteArray(value ? 1 : 0, buffer, from, this.size())
  }
}

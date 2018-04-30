import bigInt from 'big-integer'
import * as ieee754 from 'ieee754'
import * as validate from './validate'

const MIN_INT8 = -128
const MAX_INT8 = 127
const MIN_INT16 = -32768
const MAX_INT16 = 32767
const MIN_INT32 = -2147483648
const MAX_INT32 = 2147483647
const MIN_INT64 = '-9223372036854775808'
const MAX_INT64 = '9223372036854775807'
const MAX_UINT8 = 255
const MAX_UINT16 = 65535
const MAX_UINT32 = 4294967295
const MAX_UINT64 = '18446744073709551615'

/**
 * @param {string} str
 * @param {Array} buffer
 * @param {number} from
 */
function insertHexadecimalToByteArray (str, buffer, from) {
  for (let i = 0; i < str.length; i += 2) {
    buffer[from] = parseInt(str.substr(i, 2), 16)
    from++
  }
  return buffer
}

/**
 * Insert number into array as as little-endian
 * @param {number|bigInt} number
 * @param {Array} buffer
 * @param {number} from
 * @param {number} size
 * @returns {boolean}
 */
function insertIntegerToByteArray (number, buffer, from, size) {
  let value = bigInt(number) // convert a number-like object into a big integer

  for (let pos = 0; pos < size; pos++) {
    const divmod = value.divmod(256)
    buffer[from + pos] = divmod.remainder.value
    value = divmod.quotient
  }

  return buffer
}

/**
 * Insert IEEE754 floating point number into array as as little-endian
 * @param {number} number
 * @param {Array} buffer
 * @param {number} from
 * @param {number} mLen - mantissa length
 * @param {number} nBytes - number of bytes
 * @returns {boolean}
 */
function insertFloatToByteArray (number, buffer, from, mLen, nBytes) {
  ieee754.write(buffer, number, from, true, mLen, nBytes)

  return buffer
}

/**
 * @param {string} str
 * @param {Array} buffer
 * @param {number} from
 */
function insertStringToByteArray (str, buffer, from) {
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i)

    if (c < 128) {
      buffer[from++] = c
    } else if (c < 2048) {
      buffer[from++] = (c >> 6) | 192
      buffer[from++] = (c & 63) | 128
    } else if (((c & 0xFC00) === 0xD800) && (i + 1) < str.length && ((str.charCodeAt(i + 1) & 0xFC00) === 0xDC00)) {
      // surrogate pair
      c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF)
      buffer[from++] = (c >> 18) | 240
      buffer[from++] = ((c >> 12) & 63) | 128
      buffer[from++] = ((c >> 6) & 63) | 128
      buffer[from++] = (c & 63) | 128
    } else {
      buffer[from++] = (c >> 12) | 224
      buffer[from++] = ((c >> 6) & 63) | 128
      buffer[from++] = (c & 63) | 128
    }
  }
}

export class Int8 {
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
    if (!validate.validateInteger(value, MIN_INT8, MAX_INT8, from, this.size())) {
      throw new TypeError('Int8 of wrong type is passed: ' + value)
    }

    if (value < 0) {
      value = MAX_UINT8 + value + 1
    }

    return insertIntegerToByteArray(value, buffer, from, this.size())
  }
}

export class Int16 {
  static size () {
    return 2
  }

  /**
   * @param {number} value
   * @param {Array} buffer
   * @param {number} from
   * @returns {Array}
   */
  static serialize (value, buffer, from) {
    if (!validate.validateInteger(value, MIN_INT16, MAX_INT16, from, this.size())) {
      throw new TypeError('Int16 of wrong type is passed: ' + value)
    }

    if (value < 0) {
      value = MAX_UINT16 + value + 1
    }

    return insertIntegerToByteArray(value, buffer, from, this.size())
  }
}

export class Int32 {
  static size () {
    return 4
  }

  /**
   * @param {number} value
   * @param {Array} buffer
   * @param {number} from
   * @returns {Array}
   */
  static serialize (value, buffer, from) {
    if (!validate.validateInteger(value, MIN_INT32, MAX_INT32, from, this.size())) {
      throw new TypeError('Int32 of wrong type is passed: ' + value)
    }

    if (value < 0) {
      value = MAX_UINT32 + value + 1
    }

    return insertIntegerToByteArray(value, buffer, from, this.size())
  }
}

export class Int64 {
  static size () {
    return 8
  }

  /**
   * @param {number|string} value
   * @param {Array} buffer
   * @param {number} from
   * @returns {Array}
   */
  static serialize (value, buffer, from) {
    if (!validate.validateBigInteger(value, MIN_INT64, MAX_INT64, from, this.size())) {
      throw new TypeError('Int64 of wrong type is passed: ' + value)
    }

    let val = bigInt(value)

    if (val.isNegative()) {
      val = bigInt(MAX_UINT64).plus(1).plus(val)
    }

    return insertIntegerToByteArray(val, buffer, from, this.size())
  }
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
   * @returns {Array}
   */
  static serialize (value, buffer, from) {
    if (!validate.validateInteger(value, 0, MAX_UINT16, from, this.size())) {
      throw new TypeError('Uint16 of wrong type is passed: ' + value)
    }

    return insertIntegerToByteArray(value, buffer, from, this.size())
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
   * @returns {Array}
   */
  static serialize (value, buffer, from) {
    if (!validate.validateInteger(value, 0, MAX_UINT32, from, this.size())) {
      throw new TypeError('Uint32 of wrong type is passed: ' + value)
    }

    return insertIntegerToByteArray(value, buffer, from, this.size())
  }
}

export class Uint64 {
  static size () {
    return 8
  }

  /**
   * @param {number|string} value
   * @param {Array} buffer
   * @param {number} from
   * @returns {Array}
   */
  static serialize (value, buffer, from) {
    if (!validate.validateBigInteger(value, 0, MAX_UINT64, from, this.size())) {
      throw new TypeError('Uint64 of wrong type is passed: ' + value)
    }

    const val = bigInt(value)

    return insertIntegerToByteArray(val, buffer, from, this.size())
  }
}

export class Float32 {
  static size () {
    return 4
  }

  /**
   * @param {string} value
   * @param {Array} buffer
   * @param {number} from
   * @returns {Array}
   */
  static serialize (value, buffer, from) {
    if (!validate.validateFloat(value, from, this.size())) {
      throw new TypeError('Float32 of wrong type is passed: ' + value)
    }

    return insertFloatToByteArray(value, buffer, from, 23, this.size())
  }
}

export class Float64 {
  static size () {
    return 8
  }

  /**
   * @param {string} value
   * @param {Array} buffer
   * @param {number} from
   * @returns {Array}
   */
  static serialize (value, buffer, from) {
    if (!validate.validateFloat(value, from, this.size())) {
      throw new TypeError('Float64 of wrong type is passed: ' + value)
    }

    return insertFloatToByteArray(value, buffer, from, 52, this.size())
  }
}

export class String {
  static size () {
    return 8
  }

  /**
   * @param {string} string
   * @param {Array} buffer
   * @param {number} from
   * @param {number} relativeFromIndex
   * @returns {Array}
   */
  static serialize (string, buffer, from, relativeFromIndex) {
    if (typeof string !== 'string') {
      throw new TypeError('Wrong data type is passed as String. String is required')
    }

    const bufferLength = buffer.length
    Uint32.serialize(relativeFromIndex, buffer, from) // index where string content starts in buffer
    insertStringToByteArray(string, buffer, bufferLength) // string content
    Uint32.serialize(buffer.length - bufferLength, buffer, from + 4) // string length

    return buffer
  }
}

export class Hash {
  static size () {
    return 32
  }

  /**
   * @param {string} value
   * @param {Array} buffer
   * @param {number} from
   * @returns {Array}
   */
  static serialize (value, buffer, from) {
    if (!validate.validateHexadecimal(value)) {
      throw new TypeError('Hash of wrong type is passed: ' + value)
    }

    return insertHexadecimalToByteArray(value, buffer, from)
  }

  /**
   * @param value
   * @returns value
   */
  static hash (value) {
    if (!validate.validateHexadecimal(value)) {
      throw new TypeError('Hash of wrong type is passed: ' + value)
    }

    return value
  }
}

export class Digest {
  static size () {
    return 64
  }

  /**
   * @param {string} value
   * @param {Array} buffer
   * @param {number} from
   * @returns {Array}
   */
  static serialize (value, buffer, from) {
    if (!validate.validateHexadecimal(value, this.size())) {
      throw new TypeError('Digest of wrong type is passed: ' + value)
    }

    return insertHexadecimalToByteArray(value, buffer, from)
  }
}

export class PublicKey {
  static size () {
    return 32
  }

  /**
   * @param {string} value
   * @param {Array} buffer
   * @param {number} from
   * @returns {Array}
   */
  static serialize (value, buffer, from) {
    if (!validate.validateHexadecimal(value)) {
      throw new TypeError('PublicKey of wrong type is passed: ' + value)
    }

    return insertHexadecimalToByteArray(value, buffer, from)
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

export class Timespec {
  static size () {
    return 8
  }

  /**
   * @param {number|string} nanoseconds
   * @param {Array} buffer
   * @param {number} from
   * @returns {Array}
   */
  static serialize (nanoseconds, buffer, from) {
    if (!validate.validateBigInteger(nanoseconds, 0, MAX_UINT64, from, this.size())) {
      throw new TypeError('Timespec of wrong type is passed: ' + nanoseconds)
    }

    const val = bigInt(nanoseconds)

    return insertIntegerToByteArray(val, buffer, from, this.size())
  }
}

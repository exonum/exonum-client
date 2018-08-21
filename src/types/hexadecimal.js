import * as validate from './validate'

export const PUBLIC_KEY_LENGTH = 32
const HASH_LENGTH = 32

/**
 * Encoder
 *
 * @param {string} str string to encode
 * @param {Array} buffer buffer to place result to
 * @param {number} from position to write from
 * @returns {Array} modified buffer
 * @private
 */
function insertHexadecimalToByteArray (str, buffer, from) {
  for (let i = 0; i < str.length; i += 2) {
    buffer[from] = parseInt(str.substr(i, 2), 16)
    from++
  }
  return buffer
}

/**
 * Validator wrapper
 *
 * @param {string} name structure name
 * @param {number} size value size in bytes
 * @param {string} value value representation
 * @returns {string} value if validation passes
 * @throws {TypeError} in case of validation break
 * @private
 */
function validateHexadecimal (name, size, value) {
  if (!validate.validateHexadecimal(value, size)) {
    throw new TypeError(`${name} of wrong type is passed: ${value}`)
  }

  return value
}

/**
 * Factory for building Hex Types
 *
 * @param {function(value, buffer, from)} serizalizer function accepting value, buffer, position and returns modified buffer
 * @param {number} size type size in bytes
 * @param {string} name type name to distinguish between types
 * @returns {Object} hex type
 */
function hexTypeFactory (serizalizer, size, name) {
  return Object.defineProperties({}, {
    size: {
      get: () => () => size,
      enumerable: true
    },
    name: {
      get: () => name,
      enumerable: true
    },
    serialize: {
      get: () => serizalizer
    }
  })
}

/**
 * Common serializer
 *
 * @param {function(name, size, value)} validator hexadecimal validator
 * @param {function(value, buffer, from)} encoder function accepting value, buffer, position and returns modified buffer
 * @returns {function(value, buffer, from)} encoder wrapper
 * @throws {TypeError} in case of validation break
 * @private
 */
function serializer (encoder, validator) {
  return (value, buffer, from) => encoder(validator(value), buffer, from)
}

/**
 * Uuid type factory
 *
 * @param {function(name, size, value)} validator hexadecimal validator
 * @param {function(validator, value, buffer, from)} encoder function accepting validator, value, buffer, position and returns modified buffer
 * @param {function(serizalizer, size, name)} factory type builder factory
 * @returns {Object} hex type
 * @private
 */
function Uuid (validator, serializer, factory) {
  const size = 16
  const name = 'Uuid'

  function cleaner (value) {
    return String(value).replace(/-/g, '')
  }

  validator = validator.bind(null, name, size)
  serializer = serializer((value) => validator(cleaner(value)))

  return factory(serializer, size, name)
}

/**
 * Hash type factory
 *
 * @param {function(name, size, value)} validator hexadecimal validator
 * @param {function(validator, value, buffer, from)} encoder function accepting validator, value, buffer, position and returns modified buffer
 * @param {function(serizalizer, size, name)} factory type builder factory
 * @returns {Object} hex type
 * @private
 */
function Hash (validator, serializer, factory) {
  const size = HASH_LENGTH
  const name = 'Hash'

  validator = validator.bind(null, name, size)
  serializer = serializer(validator)

  const hasher = function (value) {
    return validator(value) && value
  }

  return Object.defineProperty(factory(serializer, size, name),
    'hash',
    {
      value: hasher
    })
}

/**
 * Digest type factory
 *
 * @param {function(name, size, value)} validator hexadecimal validator
 * @param {function(validator, value, buffer, from)} encoder function accepting validator, value, buffer, position and returns modified buffer
 * @param {function(serizalizer, size, name)} factory type builder factory
 * @returns {Object} hex type
 * @private
 */
function Digest (validator, serializer, factory) {
  const size = 64
  const name = 'Digest'

  validator = validator.bind(null, name, size)
  serializer = serializer(validator)

  return factory(serializer, size, name)
}

/**
 * PublicKey type factory
 *
 * @param {function(name, size, value)} validator hexadecimal validator
 * @param {function(validator, value, buffer, from)} encoder function accepting validator, value, buffer, position and returns modified buffer
 * @param {function(serizalizer, size, name)} factory type builder factory
 * @returns {Object} hex type
 * @private
 */
function PublicKey (validator, serializer, factory) {
  const size = PUBLIC_KEY_LENGTH
  const name = 'PublicKey'

  validator = validator.bind(null, name, size)
  serializer = serializer(validator)

  return factory(serializer, size, name)
}

const baseSerializer = serializer.bind(null, insertHexadecimalToByteArray)

const uuid = Uuid(validateHexadecimal, baseSerializer, hexTypeFactory)
const hash = Hash(validateHexadecimal, baseSerializer, hexTypeFactory)
const digest = Digest(validateHexadecimal, baseSerializer, hexTypeFactory)
const publicKey = PublicKey(validateHexadecimal, baseSerializer, hexTypeFactory)

export { uuid as Uuid, hash as Hash, digest as Digest, publicKey as PublicKey }

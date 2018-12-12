import * as crypto from '../crypto'

const intTypes = ['sint32', 'uint32', 'int32', 'sfixed32', 'fixed32', 'sint64', 'uint64', 'int64', 'sfixed64', 'fixed64']
/**
 * @constructor
 * @param {Object} schema
 */
class Type {
  constructor (schema) {
    this.schema = schema
  }

  /**
   * @param {Type} schema
   * @param {Object} data
   * @param {Object} object
   * @returns {Object}
   */
  fixZeroIntFields (schema, data, object) {
    const keys = Object.keys(data)
    keys.forEach(element => {
      if (schema.fields && schema.fields[element] && schema.fields[element].name && schema.fields[element].type) {
        if (schema.fields[element].type === 'message') {
          object[element] = this.fixZeroIntFields(schema.fields[element], data[element], object)
        }
        if (!(intTypes.find((value) => { return value === schema.fields[element].type }) && data[element] === 0)) {
          object[element] = data[element]
        }
      }
    })

    return data
  }

  /**
   * Serialize data into array of 8-bit integers
   * @param {Object} data
   * @returns {Array}
   */
  serialize (data) {
    const object = this.fixZeroIntFields(this.schema, data, {})
    return Array.from(this.schema.encode(object).finish())
  }

  /**
   * Get SHA256 hash
   * @param {Object} data
   * @returns {string}
   */
  hash (data) {
    return crypto.hash(data, this)
  }

  /**
   * Get ED25519 signature
   * @param {string} secretKey
   * @param {Object} data
   * @returns {string}
   */
  sign (secretKey, data) {
    return crypto.sign(secretKey, data, this)
  }

  /**
   * Verifies ED25519 signature
   * @param {string} signature
   * @param {string} publicKey
   * @param {Object} data
   * @returns {boolean}
   */
  verifySignature (signature, publicKey, data) {
    return crypto.verifySignature(signature, publicKey, data, this)
  }
}

/**
 * Create element of Type class
 * @param {Object} type
 * @returns {Type}
 */
export function newType (type) {
  return new Type(type)
}

/**
 * Check if passed object is of type Type
 * @param {Object} type
 * @returns {boolean}
 */
export function isType (type) {
  return type instanceof Type
}

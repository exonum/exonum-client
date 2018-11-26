import * as crypto from '../crypto'

/**
 * @constructor
 * @param {Object} schema
 */
class Type {
  constructor (schema) {
    this.schema = schema
  }

  /**
   * Serialize data into array of 8-bit integers
   * @returns {Array}
   */
  serialize () {
    return Array.from(this.schema.serializeBinary())
  }

  /**
   * Get SHA256 hash
   * @returns {string}
   */
  hash () {
    return crypto.hash(this)
  }

  /**
   * Get ED25519 signature
   * @param {string} secretKey
   * @returns {string}
   */
  sign (secretKey) {
    return crypto.sign(secretKey, this)
  }

  /**
   * Verifies ED25519 signature
   * @param {string} signature
   * @param {string} publicKey
   * @returns {boolean}
   */
  verifySignature (signature, publicKey) {
    return crypto.verifySignature(signature, publicKey, this)
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


import * as crypto from '../crypto'

/**
 * @constructor
 * @param {Object} type
 */
class Type {
  constructor (type) {
    this.schema = type
  }

  /**
   * Serialize data into array of 8-bit integers
   * @param {Object} data
   * @returns {Array}
   */
  serialize (data) {
    return Array.from(this.schema.encode(data).finish())
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

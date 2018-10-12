
import * as crypto from '../crypto'
import { String } from './primitive'

/**
 * @constructor
 * @param {Object} type
 */
class Type {
  constructor (type) {
    this.schema = type
  }

  size () {
    return this.fields.reduce((accumulator, field) => {
      if (fieldIsFixed(field)) {
        return accumulator + field.type.size()
      } else {
        return accumulator + 8
      }
    }, 0)
  }

  /**
   * Serialize data into array of 8-bit integers
   * @param {Object} data
   * @returns {Array}
   */
  serialize (data) {
    return Array.prototype.slice.call(this.schema.encode(data).finish(), 0)
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

/**
 * Check if field is of fixed-length type. Fixed-length means field serialized (inserted) directly into buffer without pointer
 * @param {Object} field
 * @returns {boolean}
 */
export function fieldIsFixed (field) {
  if (isType(field.type)) {
    return newTypeIsFixed(field.type)
  }

  return field.type !== String
}

/**
 * Check if all nested fields are of fixed-length type
 * @param {Object} type
 * @returns {boolean}
 */
export function newTypeIsFixed (type) {
  let areFixed = true

  type.fields.forEach(field => {
    if (!fieldIsFixed(field)) {
      areFixed = false
    }
  })

  return areFixed
}

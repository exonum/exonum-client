import { Uint8, Uint16 } from './primitive'
import { Digest, PublicKey } from './hexadecimal'
import * as crypto from '../crypto'
import { send } from '../blockchain/transport'

export const SIGNATURE_LENGTH = 64
const TRANSACTION_CLASS = 0
const TRANSACTION_TYPE = 0
const PRECOMMIT_CLASS = 1
const PRECOMMIT_TYPE = 0
const intTypes = ['sint32', 'uint32', 'int32', 'sfixed32', 'fixed32', 'sint64', 'uint64', 'sfixed64', 'fixed64']

class Message {
  constructor (type) {
    this.schema = type.schema
    this.author = type.author
    this.cls = type.cls
    this.type = type.type
  }

  /**
   * @param { Type | Transaction } schema
   * @param {Object} data
   * @param {Object} object
   * @returns {Object}
   */
  fixZeroIntFields (schema, data, object) {
    const keys = Object.keys(data)
    keys.forEach(element => {
      if (schema.fields[element] && schema.fields[element].name) {
        console.log(schema.fields[element].name)
        if (schema.fields[element].name === 'message') {
          object[element] = this.fixZeroIntFields(schema.fields[element], data[element], object)
        }
        if (!(intTypes.find((value) => { return value === schema.fields[element].name }) && data[element] === 0)) {
          object[element] = data[element]
        }
      }
    })

    return data
  }
}

/**
 * @constructor
 * @param {Object} type
 */
class Transaction extends Message {
  constructor (type) {
    super(type)

    this.cls = TRANSACTION_CLASS
    this.type = TRANSACTION_TYPE
    this.service_id = type.service_id
    this.message_id = type.message_id
    this.signature = type.signature
  }

  /**
   * Serialization header
   * @returns {Array}
   */
  serializeHeader () {
    let buffer = []
    PublicKey.serialize(this.author, buffer, buffer.length)
    Uint8.serialize(this.cls, buffer, buffer.length)
    Uint8.serialize(this.type, buffer, buffer.length)
    Uint16.serialize(this.service_id, buffer, buffer.length)
    Uint16.serialize(this.message_id, buffer, buffer.length)
    return buffer
  }

  /**
   * Serialize into array of 8-bit integers
   * @param {Object} data
   * @returns {Array}
   */
  serialize (data) {
    const object = this.fixZeroIntFields(this.schema, data, {})
    const buffer = this.serializeHeader()
    const body = this.schema.encode(object).finish()

    body.forEach(element => {
      buffer.push(element)
    })

    if (this.signature) {
      Digest.serialize(this.signature, buffer, buffer.length)
    }

    return buffer
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

  /**
   * Send transaction to the blockchain
   * @param {string} explorerBasePath
   * @param {Object} data
   * @param {string} secretKey
   * @param {number} attempts
   * @param {number} timeout
   * @returns {Promise}
   */
  send (explorerBasePath, data, secretKey, attempts, timeout) {
    return send(explorerBasePath, this, data, secretKey, attempts, timeout)
  }
}

/**
 * Create element of Transaction class
 * @param {Object} type
 * @returns {Transaction}
 */
export function newTransaction (type) {
  return new Transaction(type)
}

/**
 * Check if passed object is of type Transaction
 * @param type
 * @returns {boolean}
 */
export function isTransaction (type) {
  return type instanceof Transaction
}

/**
 * @constructor
 * @param {Object} type
 */
class Precommit extends Message {
  constructor (type) {
    super(type)

    this.cls = PRECOMMIT_CLASS
    this.type = PRECOMMIT_TYPE
  }

  /**
   * Serialization header
   * @returns {Array}
   */
  serializeHeader () {
    let buffer = []
    PublicKey.serialize(this.author, buffer, buffer.length)
    Uint8.serialize(this.cls, buffer, buffer.length)
    Uint8.serialize(this.type, buffer, buffer.length)
    return buffer
  }

  /**
   * Serialize data into array of 8-bit integers
   * @param {Object} data
   * @returns {Array}
   */
  serialize (data) {
    const buffer = this.serializeHeader()
    const body = this.schema.encode(data).finish()

    body.forEach(element => {
      buffer.push(element)
    })

    return buffer
  }
}

/**
 * Create element of Precommit class
 * @param {Object} type
 * @returns {Precommit}
 */
export function newPrecommit (type) {
  return new Precommit(type)
}

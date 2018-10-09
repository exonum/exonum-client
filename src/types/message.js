import { Uint8, Uint16 } from './primitive'
import { Digest, PublicKey } from './hexadecimal'
import { fieldIsFixed, newType } from './generic'
import * as serialization from './serialization'
import * as crypto from '../crypto'
import { send } from '../blockchain/transport'

export const SIGNATURE_LENGTH = 64
const TRANSACTION_CLASS = 0
const TRANSACTION_TYPE = 0
const PRECOMMIT_CLASS = 1
const PRECOMMIT_TYPE = 0

class Message {
  constructor (type) {
    this.author = type.author
    this.cls = type.cls
    this.type = type.type

    type.fields.forEach(field => {
      if (field.name === undefined) {
        throw new TypeError('Name prop is missed.')
      }
      if (field.type === undefined) {
        throw new TypeError('Type prop is missed.')
      }
    })

    this.fields = type.fields
  }

  size () {
    return this.fields.reduce((accumulator, field) => {
      if (fieldIsFixed(field)) {
        return accumulator + field.type.size()
      }
      return accumulator + serialization.POINTER_SIZE
    }, 0)
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
   * Serialize into array of 8-bit integers
   * @param {Object} data
   * @returns {Array}
   */
  serialize (data) {
    const Head = newType({
      fields: [
        { name: 'author', type: PublicKey },
        { name: 'cls', type: Uint8 },
        { name: 'type', type: Uint8 },
        { name: 'service_id', type: Uint16 },
        { name: 'message_id', type: Uint16 }
      ]
    })

    const head = Head.serialize({
      author: this.author,
      cls: this.cls,
      type: this.type,
      service_id: this.service_id,
      message_id: this.message_id
    })

    const body = serialization.serialize([], 0, data, this)

    if (this.signature) {
      Digest.serialize(this.signature, body, body.length)
    }

    return head.concat(body)
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
   * Serialize data into array of 8-bit integers
   * @param {Object} data
   * @returns {Array}
   */
  serialize (data) {
    const Head = newType({
      fields: [
        { name: 'author', type: PublicKey },
        { name: 'cls', type: Uint8 },
        { name: 'type', type: Uint8 }
      ]
    })

    const head = Head.serialize({
      author: this.author,
      cls: this.cls,
      type: this.type
    })

    const body = serialization.serialize([], 0, data, this, true)

    return head.concat(body)
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

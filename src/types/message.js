import { Uint8, Uint16 } from './primitive'
import { Digest, PublicKey } from './hexadecimal'
import { fieldIsFixed, newType } from './generic'
import * as serialization from './serialization'
import * as crypto from '../crypto'
import { send } from '../blockchain/transport'

export const SIGNATURE_LENGTH = 64
const MESSAGE_CLASS = 0
const MESSAGE_TYPE = 0
const PRECOMMIT_CLASS = 1
const PRECOMMIT_TYPE = 0

/**
 * @constructor
 * @param {Object} type
 */
class NewMessage {
  constructor (type) {
    type.fields.forEach(field => {
      if (field.name === undefined) {
        throw new TypeError('Name prop is missed.')
      }
      if (field.type === undefined) {
        throw new TypeError('Type prop is missed.')
      }
    })

    this.author = type.author
    this.cls = MESSAGE_CLASS
    this.type = MESSAGE_TYPE
    this.service_id = type.service_id
    this.message_id = type.message_id
    this.fields = type.fields
    this.signature = type.signature
  }

  size () {
    return this.fields.reduce((accumulator, field) => {
      if (fieldIsFixed(field)) {
        return accumulator + field.type.size()
      }
      return accumulator + serialization.POINTER_LENGTH
    }, 0)
  }

  /**
   * Serialize data of NewMessage type into array of 8-bit integers
   * @param {Object} data
   * @param {boolean} [cutSignature] - optional parameter used flag that signature should not be appended to serialized data
   * @returns {Array}
   */
  serialize (data, cutSignature) {
    const MessageHead = newType({
      fields: [
        { name: 'author', type: PublicKey },
        { name: 'cls', type: Uint8 },
        { name: 'type', type: Uint8 },
        { name: 'service_id', type: Uint16 },
        { name: 'message_id', type: Uint16 }
      ]
    })

    let messageHead = MessageHead.serialize({
      author: this.author,
      cls: this.cls,
      type: this.type,
      service_id: this.service_id,
      message_id: this.message_id
    })

    let messageBody = serialization.serialize([], 0, data, this)

    if (cutSignature !== true) {
      Digest.serialize(this.signature, messageBody, messageBody.length)
    }

    return messageHead.concat(messageBody)
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
   * Get ED25519 signature
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
 * Create element of NewMessage class
 * @param {Object} type
 * @returns {NewMessage}
 */
export function newMessage (type) {
  return new NewMessage(type)
}

/**
 * Check if passed object is of type NewMessage
 * @param type
 * @returns {boolean}
 */
export function isInstanceofOfNewMessage (type) {
  return type instanceof NewMessage
}

/**
 * @constructor
 * @param {Object} type
 */
class NewPrecommit extends NewMessage {
  constructor (type) {
    super(type)
    this.cls = PRECOMMIT_CLASS
    this.type = PRECOMMIT_TYPE
  }

  /**
   * Serialize data of NewPrecommit type into array of 8-bit integers
   * @param {Object} data
   * @returns {Array}
   */
  serialize (data) {
    const PrecommitHead = newType({
      fields: [
        { name: 'author', type: PublicKey },
        { name: 'cls', type: Uint8 },
        { name: 'type', type: Uint8 }
      ]
    })

    let precommitHead = PrecommitHead.serialize({
      author: this.author,
      cls: this.cls,
      type: this.type
    })

    let precommitBody = serialization.serialize([], 0, data, this, true)

    return precommitHead.concat(precommitBody)
  }
}

/**
 * Create element of NewPrecommit class
 * @param {Object} type
 * @returns {NewPrecommit}
 */
export function newPrecommit (type) {
  return new NewPrecommit(type)
}

import { Uint8, Uint16, Uint32 } from './primitive'
import { Digest, PublicKey } from './hexadecimal'
import { fieldIsFixed, newType } from './generic'
import * as serialization from './serialization'
import * as crypto from '../crypto'
import { send } from '../blockchain/transport'

export const SIGNATURE_LENGTH = 64

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

    this.public_key = type.public_key
    this.cls = 0
    this.tag = 0
    this.service_id = type.service_id
    this.signature = type.signature
    this.fields = type.fields
  }

  size () {
    return this.fields.reduce((accumulator, field) => {
      if (fieldIsFixed(field)) {
        return accumulator + field.type.size()
      }
      return accumulator + 40
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
        { name: 'public_key', type: PublicKey },
        { name: 'cls', type: Uint8 },
        { name: 'tag', type: Uint8 },
        { name: 'service_id', type: Uint16 },
        { name: 'payload_size', type: Uint32 }
      ]
    })

    let buffer = MessageHead.serialize({
      public_key: this.public_key,
      cls: this.cls,
      tag: this.tag,
      service_id: this.service_id,
      payload_size: 0
    })

    // serialize and append message body
    buffer = serialization.serialize(buffer, 40, data, this, true)

    // calculate payload and insert it into buffer
    Uint32.serialize(buffer.length + SIGNATURE_LENGTH, buffer, 34)

    if (cutSignature !== true) {
      // append signature
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
   * Get ED25519 signature
   * @param {string} transactionEndpoint
   * @param {string} explorerBasePath
   * @param {Object} data
   * @param {string} signature
   * @param {number} timeout
   * @param {number} attempts
   * @returns {Promise}
   */
  send (transactionEndpoint, explorerBasePath, data, signature, timeout, attempts) {
    return send(transactionEndpoint, explorerBasePath, data, signature, this, timeout, attempts)
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
    this.cls = 1
    this.tag = 1
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

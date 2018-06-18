import * as primitive from './primitive'
import { Digest } from './hexadecimal'
import { fieldIsFixed, newType } from './generic'
import * as serialization from './serialization'
import * as crypto from '../crypto'
import { send } from '../blockchain/transport'

const SIGNATURE_LENGTH = 64

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

    this.protocol_version = type.protocol_version
    this.message_id = type.message_id
    this.service_id = type.service_id
    this.signature = type.signature
    this.fields = type.fields
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
   * Serialize data of NewMessage type into array of 8-bit integers
   * @param {Object} data
   * @param {boolean} [cutSignature] - optional parameter used flag that signature should not be appended to serialized data
   * @returns {Array}
   */
  serialize (data, cutSignature) {
    const MessageHead = newType({
      fields: [
        { name: 'network_id', type: primitive.Uint8 },
        { name: 'protocol_version', type: primitive.Uint8 },
        { name: 'message_id', type: primitive.Uint16 },
        { name: 'service_id', type: primitive.Uint16 },
        { name: 'payload', type: primitive.Uint32 }
      ]
    })

    let buffer = MessageHead.serialize({
      network_id: 0,
      protocol_version: this.protocol_version,
      message_id: this.message_id,
      service_id: this.service_id,
      payload: 0 // placeholder, real value will be inserted later
    })

    // serialize and append message body
    buffer = serialization.serialize(buffer, 10, data, this, true)

    // calculate payload and insert it into buffer
    primitive.Uint32.serialize(buffer.length + SIGNATURE_LENGTH, buffer, 6)

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
   * @returns {Promise}
   */
  send (transactionEndpoint, explorerBasePath, data, signature) {
    return send(transactionEndpoint, explorerBasePath, data, signature, this)
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

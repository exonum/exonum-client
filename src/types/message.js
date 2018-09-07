import * as primitive from './primitive'
import { Digest, Hash } from './hexadecimal'
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
    this.public_key = type.public_key
    this.consensus_tag = type.consensus_tag
    this.precommit_tag = type.precommit_tag
    this.message_type = type.message_type
    this.fields = type.fields
  }

  transactionHeaderSerialization () {
    const MessageHead = newType({
      fields: [
        { name: 'protocol_version', type: primitive.Uint16 },
        { name: 'pk_size', type: primitive.Uint64 },
        { name: 'pk_data', type: Hash },
        { name: 'tx_tag', type: primitive.Uint32 },
        { name: 'service_id', type: primitive.Uint16 },
        { name: 'full_tx_len', type: primitive.Uint64 }
      ]
    })
    const header = {
      protocol_version: this.protocol_version,
      pk_size: this.public_key.length / 2,
      pk_data: this.public_key,
      tx_tag: 0,
      service_id: this.service_id,
      full_tx_len: 0
    }

    return MessageHead.serialize(header)
  }

  precommitHeaderSerialization () {
    const MessageHead = newType({
      fields: [
        { name: 'protocol_version', type: primitive.Uint16 },
        { name: 'pk_size', type: primitive.Uint64 },
        { name: 'pk_data', type: Hash },
        { name: 'consensus_tag', type: primitive.Uint32 },
        { name: 'precommit_tag', type: primitive.Uint32 },
        { name: 'precommit_len', type: primitive.Uint64 }
      ]
    })
    const header = {
      protocol_version: this.protocol_version,
      pk_size: this.public_key.length / 2,
      pk_data: this.public_key,
      consensus_tag: this.consensus_tag,
      precommit_tag: this.precommit_tag,
      precommit_len: 0
    }

    return MessageHead.serialize(header)
  }

  size () {
    return this.fields.reduce((accumulator, field) => {
      if (fieldIsFixed(field)) {
        return accumulator + field.type.size()
      }
      return accumulator + 8
    }, 0)
  }

  /**
   * Serialize data of NewMessage type into array of 8-bit integers
   * @param {Object} data
   * @param {boolean} [cutSignature] - optional parameter used flag that signature should not be appended to serialized data
   * @returns {Array}
   */
  serialize (data, cutSignature) {

    let buffer = this.message_type === 'precommit' ? this.precommitHeaderSerialization() : this.transactionHeaderSerialization()

    // serialize and append message body
    let body = []
    body = serialization.serialize(body, 0, data, this, true)

    // calculate payload and insert it into buffer
    this.message_type === 'precommit' ? primitive.Uint64.serialize(body.length, buffer, 50) : primitive.Uint64.serialize(body.length, buffer, 48)

    body.forEach(element => {
      buffer.push(element)
    })

    if (cutSignature !== true) {
      // calculate SIGNATURE_LENGTH and insert it into buffer
      primitive.Uint64.serialize(SIGNATURE_LENGTH, buffer, buffer.length)
      // append signature
      Digest.serialize(this.signature, buffer, buffer.length)
    }
    console.log(buffer.toString())
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

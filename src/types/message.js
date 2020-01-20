import { PublicKey } from './hexadecimal'
import * as crypto from '../crypto'
import { send } from '../blockchain/transport'
import { cleanZeroValuedFields } from '../helpers'
import * as protocol from '../../proto/protocol.js'
import { hexadecimalToUint8Array } from './convert'

export const SIGNATURE_LENGTH = 64

class Message {
  constructor (type) {
    this.schema = type.schema
    this.author = type.author
  }
}

/**
 * @constructor
 * @param {Object} type
 */
class Transaction extends Message {
  constructor (type) {
    super(type)
    this.instance_id = type.instance_id
    this.method_id = type.method_id
    this.signature = type.signature
  }

  /**
   * Payload serialization
   * @returns {Uint8Array}
   */
  serializePayload (data) {
    const txMessage = this.schema.create(data)
    const txBuffer = new Uint8Array(this.schema.encode(txMessage).finish())

    const callInfo = {
      instance_id: this.instance_id,
      method_id: this.method_id
    }

    const anyTx = {
      call_info: callInfo,
      arguments: txBuffer
    }

    const exonumMsg = {
      any_tx: anyTx
    }

    const exonumMsgPb = protocol.exonum.consensus.ExonumMessage.create(exonumMsg)
    return new Uint8Array(protocol.exonum.consensus.ExonumMessage.encode(exonumMsgPb).finish())
  }

  /**
   * Create signed message from serialized exonum message and serialize it into array of 8-bit integers
   * @param {Object} exonumMsg
   * @returns {Uint8Array}
   */
  signedMessage (exonumMsg) {
    const signedMsg = {
      payload: exonumMsg,
      author: { data: hexadecimalToUint8Array(this.author) },
      signature: { data: hexadecimalToUint8Array(this.signature) }
    }

    const verifiedPb = protocol.exonum.consensus.SignedMessage.create(signedMsg)
    return new Uint8Array(protocol.exonum.consensus.SignedMessage.encode(verifiedPb).finish())
  }

  /**
   * Serialize into array of 8-bit integers
   * @param {Object} data
   * @returns {Uint8Array}
   */
  serialize (data) {
    const exonumMsgSerialized = this.serializePayload(data)
    if (this.signature) {
      return this.signedMessage(exonumMsgSerialized)
    } else {
      return exonumMsgSerialized
    }
  }

  /**
   * Sign and serialize into array of 8-bit integers
   * @param {Object} secretKey
   * @param {Object} data
   * @returns {Uint8Array}
   */
  signAndSerialize (secretKey, data) {
    this.signature = this.sign(secretKey, data)
    return this.serialize(data)
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
    return crypto.verifySignature(signature, publicKey, this.serializePayload(data), this)
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
  /**
   * Serialization header
   * @returns {Array}
   */
  serializeHeader () {
    let buffer = []
    PublicKey.serialize(this.author, buffer, buffer.length)
    return buffer
  }

  /**
   * Serialize data into array of 8-bit integers
   * @param {Object} data
   * @returns {Array}
   */
  serialize (data) {
    const object = cleanZeroValuedFields(data, {})
    const buffer = this.serializeHeader()
    const body = this.schema.encode(object).finish()

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

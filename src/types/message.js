import nacl from 'tweetnacl'
import * as crypto from '../crypto'
import { cleanZeroValuedFields } from '../helpers'

import * as protobuf from '../../proto/protocol.js'
import { hexadecimalToUint8Array, uint8ArrayToHexadecimal } from './convert'
const { CoreMessage, SignedMessage } = protobuf.exonum

export class Verified {
  constructor (schema, payload, author, signature) {
    this.schema = schema
    this.payload = payload
    this.author = author
    this.signature = signature
    this.bytes = SignedMessage.encode({
      payload: schema.encode(payload).finish(),
      author: { data: hexadecimalToUint8Array(author) },
      signature: { data: hexadecimalToUint8Array(signature) }
    }).finish()
  }

  static sign (schema, payload, { publicKey, secretKey }) {
    const signingKey = hexadecimalToUint8Array(secretKey)
    const rawSignature = nacl.sign.detached(schema.encode(payload).finish(), signingKey)
    const signature = uint8ArrayToHexadecimal(rawSignature)
    return new this(schema, payload, publicKey, signature)
  }

  static deserialize (schema, bytes) {
    const { payload, author: rawAuthor, signature: rawSignature } = SignedMessage.decode(bytes)
    if (!nacl.sign.detached.verify(payload, rawSignature.data, rawAuthor.data)) {
      return null
    } else {
      const decoded = schema.decode(payload)
      const author = uint8ArrayToHexadecimal(rawAuthor.data)
      const signature = uint8ArrayToHexadecimal(rawSignature.data)
      return new this(schema, decoded, author, signature)
    }
  }

  serialize () {
    return this.bytes
  }

  /**
   * Gets the SHA-256 digest of the message.
   * @returns {string}
   */
  hash () {
    return crypto.hash(this.bytes)
  }
}

/**
 * @constructor
 * @param {Object} type
 */
export class Transaction {
  constructor ({ schema, serviceId, methodId }) {
    this.serviceId = serviceId
    this.methodId = methodId
    this.schema = schema
  }

  /**
   * Creates a signature transaction.
   *
   * @param {Object} payload
   *   transaction payload
   * @param {Uint8Array | {publicKey: string, secretKey: string}} authorOrKeypair
   *   author or keypair
   * @param {Uint8Array?} signature
   *   transaction signature
   * @returns {Verified}
   *   signature transaction message
   */
  create (payload, authorOrKeypair, signature) {
    const fullPayload = this._serializePayload(payload)
    if (signature === undefined) {
      return Verified.sign(CoreMessage, fullPayload, authorOrKeypair)
    } else {
      return new Verified(CoreMessage, fullPayload, authorOrKeypair, signature)
    }
  }

  _serializePayload (payload) {
    const args = this.schema.encode(cleanZeroValuedFields(payload, {})).finish()
    const transaction = {
      call_info: {
        instance_id: this.serviceId,
        method_id: this.methodId
      },
      arguments: args
    }
    return { any_tx: transaction }
  }

  serialize (payload) {
    return CoreMessage.encode(this._serializePayload(payload)).finish()
  }

  deserialize (bytes) {
    const verified = Verified.deserialize(CoreMessage, bytes)
    if (!verified) {
      return null
    }
    const payload = verified.payload.any_tx
    if (!payload) {
      return null
    }

    if (
      payload.call_info.instance_id !== this.serviceId ||
      payload.call_info.method_id !== this.methodId
    ) {
      return null
    }
    verified.payload = this.schema.decode(payload.arguments)
    return verified
  }
}

/**
 * Check if passed object is of type Transaction
 * @param type
 * @returns {boolean}
 */
export function isTransaction (type) {
  return type instanceof Transaction
}

import sha from 'sha.js'
import nacl from 'tweetnacl'
import { Type } from 'protobufjs'
import Long from 'long'
import { hexadecimalToUint8Array } from './converters'

/**
 * Get SHA256 hash
 * @param {Type} type
 * @param {Object} data
 * @return {Uint8Array}
 */
export function hash (type, data) {
  let Message = type.create(data)
  let buffer = type.encode(Message).finish()
  let hex = sha('sha256').update(buffer).digest('hex')

  return hexadecimalToUint8Array(hex)
}

/**
 * Get ED25519 signature
 * @param {Type} type
 * @param {Object} data
 * @param {Uint8Array} secretKey
 * @return {Uint8Array}
 */
export function sign (type, data, secretKey) {
  let Message = type.create(data)
  let buffer = type.encode(Message).finish()

  return nacl.sign.detached(buffer, secretKey)
}

/**
 * Verifies ED25519 signature
 * @param {Type} type
 * @param {Object} data
 * @param {Uint8Array} signature
 * @param {Uint8Array} publicKey
 * @return {boolean}
 */
export function verifySignature (type, data, signature, publicKey) {
  let Message = type.create(data)
  let buffer = type.encode(Message).finish()

  return nacl.sign.detached.verify(buffer, signature, publicKey)
}

/**
 * Generate random pair of publicKey and secretKey
 * @return {Object}
 *  publicKey {Uint8Array}
 *  secretKey {Uint8Array}
 */
export function keyPair () {
  return nacl.sign.keyPair()
}

/**
 * Get random number of cryptographic quality
 * @returns {Long}
 */
export function randomUint64 () {
  const buffer = nacl.randomBytes(8)
  return Long.fromBytes(buffer)
}

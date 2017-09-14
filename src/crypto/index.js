import bigInt from 'big-integer'
import sha from 'sha.js'
import nacl from 'tweetnacl'
import {isInstanceofOfNewType} from '../types/generic'
import {isInstanceofOfNewMessage} from '../types/message'
import * as validate from '../types/validate'
import * as convert from '../types/convert'

/**
 * Get SHA256 hash
 * @param {Object|Array|Uint8Array} data - object of NewType type or array of 8-bit integers
 * @param {NewType|NewMessage} [type] - optional, used only if data of {Object} type is passed
 * @return {string}
 */
export function hash (data, type) {
  var buffer

  if (isInstanceofOfNewType(type) || isInstanceofOfNewMessage(type)) {
    buffer = type.serialize(data)
  } else if (type === undefined) {
    if (data instanceof Uint8Array) {
      buffer = data
    } else if (Array.isArray(data)) {
      buffer = new Uint8Array(data)
    } else {
      throw new TypeError('Invalid data parameter.')
    }
  } else {
    throw new TypeError('Wrong type of data.')
  }

  return sha('sha256').update(buffer, 'utf8').digest('hex')
}

/**
 * Get ED25519 signature
 * @param {string} secretKey
 * @param {Object|Array} data - object of NewType type or array of 8-bit integers
 * @param {NewType|NewMessage} [type] - optional, used only if data of {Object} type is passed
 * @return {string}
 */
export function sign (secretKey, data, type) {
  var secretKeyUint8Array
  var buffer
  var signature

  if (!validate.validateHexadecimal(secretKey, 64)) {
    throw new TypeError('secretKey of wrong type is passed. Hexadecimal expected.')
  }

  secretKeyUint8Array = convert.hexadecimalToUint8Array(secretKey)

  if (isInstanceofOfNewType(type)) {
    buffer = new Uint8Array(type.serialize(data))
  } else if (isInstanceofOfNewMessage(type)) {
    buffer = new Uint8Array(type.serialize(data, true))
  } else if (type === undefined) {
    if (data instanceof Uint8Array) {
      buffer = data
    } else if (Array.isArray(data)) {
      buffer = new Uint8Array(data)
    } else {
      throw new TypeError('Invalid data parameter.')
    }
  } else {
    throw new TypeError('Wrong type of data.')
  }

  signature = nacl.sign.detached(buffer, secretKeyUint8Array)

  return convert.uint8ArrayToHexadecimal(signature)
}

/**
 * Verifies ED25519 signature
 * @param {string} signature
 * @param {string} publicKey
 * @param {Object|Array} data - object of NewType type or array of 8-bit integers
 * @param {NewType|NewMessage} [type] - optional, used only if data of {Object} type is passed
 * @return {boolean}
 */
export function verifySignature (signature, publicKey, data, type) {
  var signatureUint8Array
  var publicKeyUint8Array
  var buffer

  if (!validate.validateHexadecimal(signature, 64)) {
    throw new TypeError('Signature of wrong type is passed. Hexadecimal expected.')
  }

  signatureUint8Array = convert.hexadecimalToUint8Array(signature)

  if (!validate.validateHexadecimal(publicKey)) {
    throw new TypeError('publicKey of wrong type is passed. Hexadecimal expected.')
  }

  publicKeyUint8Array = convert.hexadecimalToUint8Array(publicKey)

  if (isInstanceofOfNewType(type)) {
    buffer = new Uint8Array(type.serialize(data))
  } else if (isInstanceofOfNewMessage(type)) {
    buffer = new Uint8Array(type.serialize(data, true))
  } else if (type === undefined) {
    if (data instanceof Uint8Array) {
      buffer = data
    } else if (Array.isArray(data)) {
      buffer = new Uint8Array(data)
    }
  } else {
    throw new TypeError('Wrong type of data.')
  }

  return nacl.sign.detached.verify(buffer, signatureUint8Array, publicKeyUint8Array)
}

/**
 * Generate random pair of publicKey and secretKey
 * @return {Object}
 *  publicKey {string}
 *  secretKey {string}
 */
export function keyPair () {
  var pair = nacl.sign.keyPair()
  var publicKey = convert.uint8ArrayToHexadecimal(pair.publicKey)
  var secretKey = convert.uint8ArrayToHexadecimal(pair.secretKey)

  return {
    publicKey: publicKey,
    secretKey: secretKey
  }
}

/**
 * Get random number of cryptographic quality
 * @returns {string}
 */
export function randomUint64 () {
  var buffer = nacl.randomBytes(8)
  return bigInt.fromArray(Array.from(buffer), 256).toString()
}

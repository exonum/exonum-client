"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hash = hash;
exports.sign = sign;
exports.verifySignature = verifySignature;
exports.keyPair = keyPair;
exports.fromSeed = fromSeed;
exports.randomUint64 = randomUint64;
exports.publicKeyToAddress = publicKeyToAddress;
exports.HASH_LENGTH = void 0;

var _bigInteger = _interopRequireDefault(require("big-integer"));

var _sha = _interopRequireDefault(require("sha.js"));

var _tweetnacl = _interopRequireDefault(require("tweetnacl"));

var _generic = require("../types/generic");

var _message = require("../types/message");

var validate = _interopRequireWildcard(require("../types/validate"));

var convert = _interopRequireWildcard(require("../types/convert"));

var protobuf = _interopRequireWildcard(require("../../proto/protocol"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Caller = protobuf.exonum.runtime.Caller;
/**
 * Byte size of a hash.
 * @type {number}
 */

var HASH_LENGTH = 32;
/**
 * Get SHA256 hash
 * @param {Object|Array|Uint8Array} data - object of NewType type or array of 8-bit integers
 * @param {Type|Transaction} [type] - optional, used only if data of {Object} type is passed
 * @return {string}
 */

exports.HASH_LENGTH = HASH_LENGTH;

function hash(data, type) {
  var buffer;

  if ((0, _generic.isType)(type) || (0, _message.isTransaction)(type)) {
    buffer = type.serialize(data);
  } else {
    if (type !== undefined) {
      throw new TypeError('Wrong type of data.');
    }

    if (data instanceof Uint8Array) {
      buffer = data;
    } else {
      if (!Array.isArray(data)) {
        throw new TypeError('Invalid data parameter.');
      }

      buffer = new Uint8Array(data);
    }
  }

  return (0, _sha["default"])('sha256').update(buffer, 'utf8').digest('hex');
}
/**
 * Get ED25519 signature
 * @param {string} secretKey
 * @param {Object|Array} data - object of NewType type or array of 8-bit integers
 * @param {Type|Transaction} [type] - optional, used only if data of {Object} type is passed
 * @return {string}
 */


function sign(secretKey, data, type) {
  var buffer;

  if (!validate.validateHexadecimal(secretKey, 64)) {
    throw new TypeError('secretKey of wrong type is passed. Hexadecimal expected.');
  }

  var secretKeyUint8Array = convert.hexadecimalToUint8Array(secretKey);

  if ((0, _generic.isType)(type) || (0, _message.isTransaction)(type)) {
    buffer = type.serialize(data);
  } else {
    if (type !== undefined) {
      throw new TypeError('Wrong type of data.');
    }

    if (data instanceof Uint8Array) {
      buffer = data;
    } else {
      if (!Array.isArray(data)) {
        throw new TypeError('Invalid data parameter.');
      }

      buffer = new Uint8Array(data);
    }
  }

  var signature = _tweetnacl["default"].sign.detached(buffer, secretKeyUint8Array);

  return convert.uint8ArrayToHexadecimal(signature);
}
/**
 * Verifies ED25519 signature
 * @param {string} signature
 * @param {string} publicKey
 * @param {Object|Array} data - object of NewType type or array of 8-bit integers
 * @param {Type|Transaction} [type] - optional, used only if data of {Object} type is passed
 * @return {boolean}
 */


function verifySignature(signature, publicKey, data, type) {
  var buffer;

  if (!validate.validateHexadecimal(signature, 64)) {
    throw new TypeError('Signature of wrong type is passed. Hexadecimal expected.');
  }

  var signatureUint8Array = convert.hexadecimalToUint8Array(signature);

  if (!validate.validateHexadecimal(publicKey)) {
    throw new TypeError('publicKey of wrong type is passed. Hexadecimal expected.');
  }

  var publicKeyUint8Array = convert.hexadecimalToUint8Array(publicKey);

  if ((0, _generic.isType)(type) || (0, _message.isTransaction)(type)) {
    buffer = type.schema.encode(data).finish();
  } else if (type === undefined) {
    if (data instanceof Uint8Array) {
      buffer = data;
    } else if (Array.isArray(data)) {
      buffer = new Uint8Array(data);
    }
  } else {
    throw new TypeError('Wrong type of data.');
  }

  return _tweetnacl["default"].sign.detached.verify(buffer, signatureUint8Array, publicKeyUint8Array);
}
/**
 * Generate random pair of publicKey and secretKey
 * @return {Object}
 *  publicKey {string}
 *  secretKey {string}
 */


function keyPair() {
  var pair = _tweetnacl["default"].sign.keyPair();

  var publicKey = convert.uint8ArrayToHexadecimal(pair.publicKey);
  var secretKey = convert.uint8ArrayToHexadecimal(pair.secretKey);
  return {
    publicKey: publicKey,
    secretKey: secretKey
  };
}
/**
 * Returns a new signing key pair generated deterministically from a 32-byte seed
 * @return {Object}
 *  publicKey {string}
 *  secretKey {string}
 */


function fromSeed(seed) {
  var pair = _tweetnacl["default"].sign.keyPair.fromSeed(seed);

  var publicKey = convert.uint8ArrayToHexadecimal(pair.publicKey);
  var secretKey = convert.uint8ArrayToHexadecimal(pair.secretKey);
  return {
    publicKey: publicKey,
    secretKey: secretKey
  };
}
/**
 * Gets a random number of cryptographic quality.
 * @returns {string}
 */


function randomUint64() {
  var buffer = _tweetnacl["default"].randomBytes(8);

  return _bigInteger["default"].fromArray(Array.from(buffer), 256).toString();
}
/**
 * Converts a public key into a caller address, which is a uniform presentation
 * of any transaction authorization supported by Exonum. Addresses may be used
 * in `MapProof`s.
 *
 * @param {string} publicKey
 * @returns {string}
 */


function publicKeyToAddress(publicKey) {
  var keyBytes = {
    data: convert.hexadecimalToUint8Array(publicKey)
  };
  var caller = Caller.encode({
    transaction_author: keyBytes
  }).finish();
  return hash(caller);
}

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hash = hash;
exports.sign = sign;
exports.verifySignature = verifySignature;
exports.keyPair = keyPair;
exports.randomUint64 = randomUint64;

var _bigInteger = require('big-integer');

var _bigInteger2 = _interopRequireDefault(_bigInteger);

var _sha = require('sha.js');

var _sha2 = _interopRequireDefault(_sha);

var _tweetnacl = require('tweetnacl');

var _tweetnacl2 = _interopRequireDefault(_tweetnacl);

var _generic = require('../types/generic');

var _message = require('../types/message');

var _validate = require('../types/validate');

var validate = _interopRequireWildcard(_validate);

var _convert = require('../types/convert');

var convert = _interopRequireWildcard(_convert);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get SHA256 hash
 * @param {Object|Array|Uint8Array} data - object of NewType type or array of 8-bit integers
 * @param {NewType|NewMessage} [type] - optional, used only if data of {Object} type is passed
 * @return {string}
 */
function hash(data, type) {
  var buffer = void 0;

  if ((0, _generic.isInstanceofOfNewType)(type) || (0, _message.isInstanceofOfNewMessage)(type)) {
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

  return (0, _sha2.default)('sha256').update(buffer, 'utf8').digest('hex');
}

/**
 * Get ED25519 signature
 * @param {string} secretKey
 * @param {Object|Array} data - object of NewType type or array of 8-bit integers
 * @param {NewType|NewMessage} [type] - optional, used only if data of {Object} type is passed
 * @return {string}
 */
function sign(secretKey, data, type) {
  var secretKeyUint8Array = void 0;
  var buffer = void 0;
  var signature = void 0;

  if (!validate.validateHexadecimal(secretKey, 64)) {
    throw new TypeError('secretKey of wrong type is passed. Hexadecimal expected.');
  }

  secretKeyUint8Array = convert.hexadecimalToUint8Array(secretKey);

  if ((0, _generic.isInstanceofOfNewType)(type)) {
    buffer = new Uint8Array(type.serialize(data));
  } else {
    if ((0, _message.isInstanceofOfNewMessage)(type)) {
      buffer = new Uint8Array(type.serialize(data, true));
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
  }
  signature = _tweetnacl2.default.sign.detached(buffer, secretKeyUint8Array);

  return convert.uint8ArrayToHexadecimal(signature);
}

/**
 * Verifies ED25519 signature
 * @param {string} signature
 * @param {string} publicKey
 * @param {Object|Array} data - object of NewType type or array of 8-bit integers
 * @param {NewType|NewMessage} [type] - optional, used only if data of {Object} type is passed
 * @return {boolean}
 */
function verifySignature(signature, publicKey, data, type) {
  var signatureUint8Array = void 0;
  var publicKeyUint8Array = void 0;
  var buffer = void 0;

  if (!validate.validateHexadecimal(signature, 64)) {
    throw new TypeError('Signature of wrong type is passed. Hexadecimal expected.');
  }

  signatureUint8Array = convert.hexadecimalToUint8Array(signature);

  if (!validate.validateHexadecimal(publicKey)) {
    throw new TypeError('publicKey of wrong type is passed. Hexadecimal expected.');
  }

  publicKeyUint8Array = convert.hexadecimalToUint8Array(publicKey);

  if ((0, _generic.isInstanceofOfNewType)(type)) {
    buffer = new Uint8Array(type.serialize(data));
  } else if ((0, _message.isInstanceofOfNewMessage)(type)) {
    buffer = new Uint8Array(type.serialize(data, true));
  } else if (type === undefined) {
    if (data instanceof Uint8Array) {
      buffer = data;
    } else if (Array.isArray(data)) {
      buffer = new Uint8Array(data);
    }
  } else {
    throw new TypeError('Wrong type of data.');
  }

  return _tweetnacl2.default.sign.detached.verify(buffer, signatureUint8Array, publicKeyUint8Array);
}

/**
 * Generate random pair of publicKey and secretKey
 * @return {Object}
 *  publicKey {string}
 *  secretKey {string}
 */
function keyPair() {
  var pair = _tweetnacl2.default.sign.keyPair();
  var publicKey = convert.uint8ArrayToHexadecimal(pair.publicKey);
  var secretKey = convert.uint8ArrayToHexadecimal(pair.secretKey);

  return {
    publicKey: publicKey,
    secretKey: secretKey
  };
}

/**
 * Get random number of cryptographic quality
 * @returns {string}
 */
function randomUint64() {
  var buffer = _tweetnacl2.default.randomBytes(8);
  return _bigInteger2.default.fromArray(Array.from(buffer), 256).toString();
}

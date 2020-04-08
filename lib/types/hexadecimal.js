"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PublicKey = exports.Digest = exports.Hash = exports.Uuid = exports.PUBLIC_KEY_LENGTH = void 0;

var validate = _interopRequireWildcard(require("./validate"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var PUBLIC_KEY_LENGTH = 32;
exports.PUBLIC_KEY_LENGTH = PUBLIC_KEY_LENGTH;
var HASH_LENGTH = 32;
/**
 * Encoder
 *
 * @param {string} str string to encode
 * @param {Array} buffer buffer to place result to
 * @param {number} from position to write from
 * @returns {Array} modified buffer
 * @private
 */

function insertHexadecimalToByteArray(str, buffer, from) {
  for (var i = 0; i < str.length; i += 2) {
    buffer[from] = parseInt(str.substr(i, 2), 16);
    from++;
  }

  return buffer;
}
/**
 * Validator wrapper
 *
 * @param {string} name structure name
 * @param {number} size value size in bytes
 * @param {string} value value representation
 * @returns {string} value if validation passes
 * @throws {TypeError} in case of validation break
 * @private
 */


function validateHexadecimal(name, size, value) {
  if (!validate.validateHexadecimal(value, size)) {
    throw new TypeError("".concat(name, " of wrong type is passed: ").concat(value));
  }

  return value;
}
/**
 * Factory for building Hex Types
 *
 * @param {function(value, buffer, from)} serizalizer function accepting value, buffer, position and returns modified buffer
 * @param {number} size type size in bytes
 * @param {string} name type name to distinguish between types
 * @returns {Object} hex type
 */


function hexTypeFactory(serizalizer, size, name) {
  return Object.defineProperties({}, {
    size: {
      get: function get() {
        return function () {
          return size;
        };
      },
      enumerable: true
    },
    name: {
      get: function get() {
        return name;
      },
      enumerable: true
    },
    serialize: {
      get: function get() {
        return serizalizer;
      }
    }
  });
}
/**
 * Common serializer
 *
 * @param {function(name, size, value)} validator hexadecimal validator
 * @param {function(value, buffer, from)} encoder function accepting value, buffer, position and returns modified buffer
 * @returns {function(value, buffer, from)} encoder wrapper
 * @throws {TypeError} in case of validation break
 * @private
 */


function serializer(encoder, validator) {
  return function (value, buffer, from) {
    return encoder(validator(value), buffer, from);
  };
}
/**
 * Uuid type factory
 *
 * @param {function(name, size, value)} validator hexadecimal validator
 * @param {function(validator, value, buffer, from)} encoder function accepting validator, value, buffer, position and returns modified buffer
 * @param {function(serizalizer, size, name)} factory type builder factory
 * @returns {Object} hex type
 * @private
 */


function Uuid(validator, serializer, factory) {
  var size = 16;
  var name = 'Uuid';

  function cleaner(value) {
    return String(value).replace(/-/g, '');
  }

  validator = validator.bind(null, name, size);
  serializer = serializer(function (value) {
    return validator(cleaner(value));
  });
  return factory(serializer, size, name);
}
/**
 * Hash type factory
 *
 * @param {function(name, size, value)} validator hexadecimal validator
 * @param {function(validator, value, buffer, from)} encoder function accepting validator, value, buffer, position and returns modified buffer
 * @param {function(serizalizer, size, name)} factory type builder factory
 * @returns {Object} hex type
 * @private
 */


function Hash(validator, serializer, factory) {
  var size = HASH_LENGTH;
  var name = 'Hash';
  validator = validator.bind(null, name, size);
  serializer = serializer(validator);

  var hasher = function hasher(value) {
    return validator(value) && value;
  };

  return Object.defineProperty(factory(serializer, size, name), 'hash', {
    value: hasher
  });
}
/**
 * Digest type factory
 *
 * @param {function(name, size, value)} validator hexadecimal validator
 * @param {function(validator, value, buffer, from)} encoder function accepting validator, value, buffer, position and returns modified buffer
 * @param {function(serizalizer, size, name)} factory type builder factory
 * @returns {Object} hex type
 * @private
 */


function Digest(validator, serializer, factory) {
  var size = 64;
  var name = 'Digest';
  validator = validator.bind(null, name, size);
  serializer = serializer(validator);
  return factory(serializer, size, name);
}
/**
 * PublicKey type factory
 *
 * @param {function(name, size, value)} validator hexadecimal validator
 * @param {function(validator, value, buffer, from)} encoder function accepting validator, value, buffer, position and returns modified buffer
 * @param {function(serizalizer, size, name)} factory type builder factory
 * @returns {Object} hex type
 * @private
 */


function PublicKey(validator, serializer, factory) {
  var size = PUBLIC_KEY_LENGTH;
  var name = 'PublicKey';
  validator = validator.bind(null, name, size);
  serializer = serializer(validator);
  return factory(serializer, size, name);
}

var baseSerializer = serializer.bind(null, insertHexadecimalToByteArray);
var uuid = Uuid(validateHexadecimal, baseSerializer, hexTypeFactory);
exports.Uuid = uuid;
var hash = Hash(validateHexadecimal, baseSerializer, hexTypeFactory);
exports.Hash = hash;
var digest = Digest(validateHexadecimal, baseSerializer, hexTypeFactory);
exports.Digest = digest;
var publicKey = PublicKey(validateHexadecimal, baseSerializer, hexTypeFactory);
exports.PublicKey = publicKey;

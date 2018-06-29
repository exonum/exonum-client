'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PublicKey = exports.Digest = exports.Hash = exports.Uuid = undefined;

var _validate = require('./validate');

var validate = _interopRequireWildcard(_validate);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
    throw new TypeError(name + ' of wrong type is passed: ' + value);
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
  var size = 32;
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
  var size = 32;
  var name = 'PublicKey';

  validator = validator.bind(null, name, size);
  serializer = serializer(validator);

  return factory(serializer, size, name);
}

var baseSerializer = serializer.bind(null, insertHexadecimalToByteArray);

var uuid = Uuid(validateHexadecimal, baseSerializer, hexTypeFactory);
var hash = Hash(validateHexadecimal, baseSerializer, hexTypeFactory);
var digest = Digest(validateHexadecimal, baseSerializer, hexTypeFactory);
var publicKey = PublicKey(validateHexadecimal, baseSerializer, hexTypeFactory);

exports.Uuid = uuid;
exports.Hash = hash;
exports.Digest = digest;
exports.PublicKey = publicKey;

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.newType = newType;
exports.isInstanceofOfNewType = isInstanceofOfNewType;
exports.fieldIsFixed = fieldIsFixed;
exports.newTypeIsFixed = newTypeIsFixed;

var _serialization = require('./serialization');

var serialization = _interopRequireWildcard(_serialization);

var _crypto = require('../crypto');

var crypto = _interopRequireWildcard(_crypto);

var _primitive = require('./primitive');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @constructor
 * @param {Object} type
 */
var NewType = function () {
  function NewType(type) {
    _classCallCheck(this, NewType);

    type.fields.forEach(function (field) {
      if (field.name === undefined) {
        throw new TypeError('Name prop is missed.');
      }
      if (field.type === undefined) {
        throw new TypeError('Type prop is missed.');
      }
    });

    this.fields = type.fields;
  }

  _createClass(NewType, [{
    key: 'size',
    value: function size() {
      return this.fields.reduce(function (accumulator, field) {
        if (fieldIsFixed(field)) {
          return accumulator + field.type.size();
        } else {
          return accumulator + 8;
        }
      }, 0);
    }

    /**
     * Serialize data of NewType type into array of 8-bit integers
     * @param {Object} data
     * @returns {Array}
     */

  }, {
    key: 'serialize',
    value: function serialize(data) {
      return serialization.serialize([], 0, data, this);
    }

    /**
     * Get SHA256 hash
     * @param {Object} data
     * @returns {string}
     */

  }, {
    key: 'hash',
    value: function hash(data) {
      return crypto.hash(data, this);
    }

    /**
     * Get ED25519 signature
     * @param {string} secretKey
     * @param {Object} data
     * @returns {string}
     */

  }, {
    key: 'sign',
    value: function sign(secretKey, data) {
      return crypto.sign(secretKey, data, this);
    }

    /**
     * Verifies ED25519 signature
     * @param {string} signature
     * @param {string} publicKey
     * @param {Object} data
     * @returns {boolean}
     */

  }, {
    key: 'verifySignature',
    value: function verifySignature(signature, publicKey, data) {
      return crypto.verifySignature(signature, publicKey, data, this);
    }
  }]);

  return NewType;
}();

/**
 * Create element of NewType class
 * @param {Object} type
 * @returns {NewType}
 */


function newType(type) {
  return new NewType(type);
}

/**
 * Check if passed object is of type NewType
 * @param {Object} type
 * @returns {boolean}
 */
function isInstanceofOfNewType(type) {
  return type instanceof NewType;
}

/**
 * Check if field is of fixed-length type. Fixed-length means field serialized (inserted) directly into buffer without pointer
 * @param {Object} field
 * @returns {boolean}
 */
function fieldIsFixed(field) {
  if (isInstanceofOfNewType(field.type)) {
    return newTypeIsFixed(field.type);
  }

  return field.type !== _primitive.String;
}

/**
 * Check if all nested fields are of fixed-length type
 * @param {Object} type
 * @returns {boolean}
 */
function newTypeIsFixed(type) {
  var areFixed = true;

  type.fields.forEach(function (field) {
    if (!fieldIsFixed(field)) {
      areFixed = false;
    }
  });

  return areFixed;
}

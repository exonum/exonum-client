'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.newMessage = newMessage;
exports.isInstanceofOfNewMessage = isInstanceofOfNewMessage;

var _primitive = require('./primitive');

var primitive = _interopRequireWildcard(_primitive);

var _hexadecimal = require('./hexadecimal');

var _generic = require('./generic');

var _serialization = require('./serialization');

var serialization = _interopRequireWildcard(_serialization);

var _crypto = require('../crypto');

var crypto = _interopRequireWildcard(_crypto);

var _transport = require('../blockchain/transport');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SIGNATURE_LENGTH = 64;

/**
 * @constructor
 * @param {Object} type
 */

var NewMessage = function () {
  function NewMessage(type) {
    _classCallCheck(this, NewMessage);

    type.fields.forEach(function (field) {
      if (field.name === undefined) {
        throw new TypeError('Name prop is missed.');
      }
      if (field.type === undefined) {
        throw new TypeError('Type prop is missed.');
      }
    });

    this.protocol_version = type.protocol_version;
    this.message_id = type.message_id;
    this.service_id = type.service_id;
    this.signature = type.signature;
    this.fields = type.fields;
  }

  _createClass(NewMessage, [{
    key: 'size',
    value: function size() {
      return this.fields.reduce(function (accumulator, field) {
        if ((0, _generic.fieldIsFixed)(field)) {
          return accumulator + field.type.size();
        }
        return accumulator + 8;
      }, 0);
    }

    /**
     * Serialize data of NewMessage type into array of 8-bit integers
     * @param {Object} data
     * @param {boolean} [cutSignature] - optional parameter used flag that signature should not be appended to serialized data
     * @returns {Array}
     */

  }, {
    key: 'serialize',
    value: function serialize(data, cutSignature) {
      var MessageHead = (0, _generic.newType)({
        fields: [{ name: 'network_id', type: primitive.Uint8 }, { name: 'protocol_version', type: primitive.Uint8 }, { name: 'message_id', type: primitive.Uint16 }, { name: 'service_id', type: primitive.Uint16 }, { name: 'payload', type: primitive.Uint32 }]
      });

      var buffer = MessageHead.serialize({
        network_id: 0,
        protocol_version: this.protocol_version,
        message_id: this.message_id,
        service_id: this.service_id,
        payload: 0 // placeholder, real value will be inserted later
      });

      // serialize and append message body
      buffer = serialization.serialize(buffer, 10, data, this, true);

      // calculate payload and insert it into buffer
      primitive.Uint32.serialize(buffer.length + SIGNATURE_LENGTH, buffer, 6);

      if (cutSignature !== true) {
        // append signature
        _hexadecimal.Digest.serialize(this.signature, buffer, buffer.length);
      }

      return buffer;
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

    /**
     * Get ED25519 signature
     * @param {string} transactionEndpoint
     * @param {string} explorerBasePath
     * @param {Object} data
     * @param {string} signature
     * @returns {Promise}
     */

  }, {
    key: 'send',
    value: function send(transactionEndpoint, explorerBasePath, data, signature) {
      return (0, _transport.send)(transactionEndpoint, explorerBasePath, data, signature, this);
    }
  }]);

  return NewMessage;
}();

/**
 * Create element of NewMessage class
 * @param {Object} type
 * @returns {NewMessage}
 */


function newMessage(type) {
  return new NewMessage(type);
}

/**
 * Check if passed object is of type NewMessage
 * @param type
 * @returns {boolean}
 */
function isInstanceofOfNewMessage(type) {
  return type instanceof NewMessage;
}

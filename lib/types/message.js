"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTransaction = isTransaction;
exports.Transaction = exports.Verified = void 0;

var _tweetnacl = _interopRequireDefault(require("tweetnacl"));

var crypto = _interopRequireWildcard(require("../crypto"));

var _helpers = require("../helpers");

var protobuf = _interopRequireWildcard(require("../../proto/protocol"));

var _convert = require("./convert");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _protobuf$exonum = protobuf.exonum,
    CoreMessage = _protobuf$exonum.CoreMessage,
    SignedMessage = _protobuf$exonum.SignedMessage;

var Verified = /*#__PURE__*/function () {
  function Verified(schema, payload, author, signature) {
    _classCallCheck(this, Verified);

    this.schema = schema;
    this.payload = payload;
    this.author = author;
    this.signature = signature;
    this.bytes = SignedMessage.encode({
      payload: schema.encode(payload).finish(),
      author: {
        data: (0, _convert.hexadecimalToUint8Array)(author)
      },
      signature: {
        data: (0, _convert.hexadecimalToUint8Array)(signature)
      }
    }).finish();
  }

  _createClass(Verified, [{
    key: "serialize",
    value: function serialize() {
      return this.bytes;
    }
    /**
     * Gets the SHA-256 digest of the message.
     * @returns {string}
     */

  }, {
    key: "hash",
    value: function hash() {
      return crypto.hash(this.bytes);
    }
  }], [{
    key: "sign",
    value: function sign(schema, payload, _ref) {
      var publicKey = _ref.publicKey,
          secretKey = _ref.secretKey;
      var signingKey = (0, _convert.hexadecimalToUint8Array)(secretKey);

      var rawSignature = _tweetnacl["default"].sign.detached(schema.encode(payload).finish(), signingKey);

      var signature = (0, _convert.uint8ArrayToHexadecimal)(rawSignature);
      return new this(schema, payload, publicKey, signature);
    }
  }, {
    key: "deserialize",
    value: function deserialize(schema, bytes) {
      var _SignedMessage$decode = SignedMessage.decode(bytes),
          payload = _SignedMessage$decode.payload,
          rawAuthor = _SignedMessage$decode.author,
          rawSignature = _SignedMessage$decode.signature;

      if (!_tweetnacl["default"].sign.detached.verify(payload, rawSignature.data, rawAuthor.data)) {
        return null;
      } else {
        var decoded = schema.decode(payload);
        var author = (0, _convert.uint8ArrayToHexadecimal)(rawAuthor.data);
        var signature = (0, _convert.uint8ArrayToHexadecimal)(rawSignature.data);
        return new this(schema, decoded, author, signature);
      }
    }
  }]);

  return Verified;
}();
/**
 * @constructor
 * @param {Object} type
 */


exports.Verified = Verified;

var Transaction = /*#__PURE__*/function () {
  function Transaction(_ref2) {
    var schema = _ref2.schema,
        serviceId = _ref2.serviceId,
        methodId = _ref2.methodId;

    _classCallCheck(this, Transaction);

    this.serviceId = serviceId;
    this.methodId = methodId;
    this.schema = schema;
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


  _createClass(Transaction, [{
    key: "create",
    value: function create(payload, authorOrKeypair, signature) {
      var fullPayload = this._serializePayload(payload);

      if (signature === undefined) {
        return Verified.sign(CoreMessage, fullPayload, authorOrKeypair);
      } else {
        return new Verified(CoreMessage, fullPayload, authorOrKeypair, signature);
      }
    }
  }, {
    key: "_serializePayload",
    value: function _serializePayload(payload) {
      var args = this.schema.encode((0, _helpers.cleanZeroValuedFields)(payload, {})).finish();
      var transaction = {
        call_info: {
          instance_id: this.serviceId,
          method_id: this.methodId
        },
        arguments: args
      };
      return {
        any_tx: transaction
      };
    }
  }, {
    key: "serialize",
    value: function serialize(payload) {
      return CoreMessage.encode(this._serializePayload(payload)).finish();
    }
  }, {
    key: "deserialize",
    value: function deserialize(bytes) {
      var verified = Verified.deserialize(CoreMessage, bytes);

      if (!verified) {
        return null;
      }

      var payload = verified.payload.any_tx;

      if (!payload) {
        return null;
      }

      if (payload.call_info.instance_id !== this.serviceId || payload.call_info.method_id !== this.methodId) {
        return null;
      }

      verified.payload = this.schema.decode(payload.arguments);
      return verified;
    }
  }]);

  return Transaction;
}();
/**
 * Check if passed object is of type Transaction
 * @param type
 * @returns {boolean}
 */


exports.Transaction = Transaction;

function isTransaction(type) {
  return type instanceof Transaction;
}

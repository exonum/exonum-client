"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyBlock = verifyBlock;

var Long = _interopRequireWildcard(require("long"));

var _message = require("../types/message");

var _convert = require("../types/convert");

var _crypto = require("../crypto");

var protobuf = _interopRequireWildcard(require("../../proto/protocol"));

var _helpers = require("../helpers");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Block = protobuf.exonum.Block;
var CoreMessage = protobuf.exonum.CoreMessage;
/**
 * Validate block and each precommit in block
 * @param {Object} data
 * @param {Array} validators
 */

function verifyBlock(_ref, validators) {
  var block = _ref.block,
      precommits = _ref.precommits;
  var blockMessage = (0, _helpers.cleanZeroValuedFields)(block, {}); // Transform hashes to the format accepted by Protobuf.

  var fields = ['prev_hash', 'tx_hash', 'state_hash', 'error_hash'];
  fields.forEach(function (fieldName) {
    blockMessage[fieldName] = {
      data: (0, _convert.hexadecimalToUint8Array)(blockMessage[fieldName])
    };
  }); // Transform additional headers to the Protobuf format.

  var additionalHeaders = Object.entries(block.additional_headers.headers).map(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        key = _ref3[0],
        value = _ref3[1];

    return {
      key: key,
      value: Uint8Array.from(value)
    };
  });
  blockMessage.additional_headers = {
    headers: {
      entries: additionalHeaders
    }
  };
  var buffer = Block.encode(blockMessage).finish();
  var blockHash = (0, _crypto.hash)(buffer);

  if (precommits.length < quorumSize(validators.length)) {
    throw new Error('Insufficient number of precommits');
  }

  var endorsingValidators = new Set();

  for (var i = 0; i < precommits.length; i++) {
    var message = _message.Verified.deserialize(CoreMessage, (0, _convert.hexadecimalToUint8Array)(precommits[i]));

    if (!message) {
      throw new Error('Precommit signature is wrong');
    }

    var plain = message.payload.precommit;

    if (!plain) {
      throw new Error('Invalid message type (not a Precommit)');
    }

    if (Long.fromValue(plain.height).compare(Long.fromValue(block.height)) !== 0) {
      throw new Error('Precommit height does not match block height');
    }

    if ((0, _convert.uint8ArrayToHexadecimal)(plain.block_hash.data) !== blockHash) {
      throw new Error('Precommit block hash does not match calculated block hash');
    }

    var validatorId = plain.validator || 0;

    if (endorsingValidators.has(validatorId)) {
      throw new Error('Double endorsement from a validator');
    }

    endorsingValidators.add(validatorId);
    var expectedKey = validators[validatorId];

    if (message.author !== expectedKey) {
      throw new Error('Precommit public key does not match key of corresponding validator');
    }
  }
}

function quorumSize(validatorCount) {
  return Math.floor(validatorCount * 2 / 3) + 1;
}

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyBlock = verifyBlock;

var _helpers = require('../helpers');

var _primitive = require('../types/primitive');

var primitive = _interopRequireWildcard(_primitive);

var _hexadecimal = require('../types/hexadecimal');

var _generic = require('../types/generic');

var _message = require('../types/message');

var _validate = require('../types/validate');

var _crypto = require('../crypto');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var PROTOCOL_VERSION = 0;
var CORE_SERVICE_ID = 0;
var PRECOMMIT_MESSAGE_ID = 4;
var Block = (0, _generic.newType)({
  fields: [{ name: 'schema_version', type: primitive.Uint16 }, { name: 'proposer_id', type: primitive.Uint16 }, { name: 'height', type: primitive.Uint64 }, { name: 'tx_count', type: primitive.Uint32 }, { name: 'prev_hash', type: _hexadecimal.Hash }, { name: 'tx_hash', type: _hexadecimal.Hash }, { name: 'state_hash', type: _hexadecimal.Hash }]
});
var SystemTime = (0, _generic.newType)({
  fields: [{ name: 'secs', type: primitive.Uint64 }, { name: 'nanos', type: primitive.Uint32 }]
});

/**
 * Validate block and each precommit in block
 * @param {Object} data
 * @param {Array} validators
 * @return {boolean}
 */
function verifyBlock(data, validators) {
  if (!(0, _helpers.isObject)(data)) {
    return false;
  }
  if (!(0, _helpers.isObject)(data.block)) {
    return false;
  }
  if (!Array.isArray(data.precommits)) {
    return false;
  }
  if (!Array.isArray(validators)) {
    return false;
  }

  for (var i = 0; i < validators.length; i++) {
    if (!(0, _validate.validateHexadecimal)(validators[i])) {
      return false;
    }
  }
  var blockHash = void 0;
  try {
    blockHash = (0, _crypto.hash)(data.block, Block);
  } catch (error) {
    return false;
  }

  var Precommit = (0, _message.newMessage)({
    protocol_version: PROTOCOL_VERSION,
    message_id: PRECOMMIT_MESSAGE_ID,
    service_id: CORE_SERVICE_ID,
    fields: [{ name: 'validator', type: primitive.Uint16 }, { name: 'height', type: primitive.Uint64 }, { name: 'round', type: primitive.Uint32 }, { name: 'propose_hash', type: _hexadecimal.Hash }, { name: 'block_hash', type: _hexadecimal.Hash }, { name: 'time', type: SystemTime }]
  });

  var validatorsTotalNumber = validators.length;
  var uniqueValidators = [];
  var round = void 0;

  for (var _i = 0; _i < data.precommits.length; _i++) {
    var precommit = data.precommits[_i];
    if (!(0, _helpers.isObject)(precommit.body)) {
      return false;
    }
    if (!(0, _validate.validateHexadecimal)(precommit.signature, 64)) {
      return false;
    }
    if (precommit.body.validator >= validatorsTotalNumber) {
      // validator does not exist
      return false;
    }

    if (uniqueValidators.indexOf(precommit.body.validator) === -1) {
      uniqueValidators.push(precommit.body.validator);
    }

    if (precommit.protocol_version !== PROTOCOL_VERSION || precommit.service_id !== CORE_SERVICE_ID || precommit.message_id !== PRECOMMIT_MESSAGE_ID) {
      return false;
    }

    if (precommit.body.height !== data.block.height) {
      // wrong height of block in precommit
      return false;
    }
    if (precommit.body.block_hash !== blockHash) {
      // wrong hash of block in precommit
      return false;
    }

    if (round === undefined) {
      round = precommit.body.round;
    }
    if (precommit.body.round !== round) {
      // wrong round in precommit
      return false;
    }

    var publicKey = validators[precommit.body.validator];

    if (!(0, _crypto.verifySignature)(precommit.signature, publicKey, precommit.body, Precommit)) {
      return false;
    }
  }

  return uniqueValidators.length > validatorsTotalNumber * 2 / 3;
}

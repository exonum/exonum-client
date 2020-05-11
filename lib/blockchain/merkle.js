"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListProofError = exports.ListProof = void 0;

var _bigInteger = _interopRequireDefault(require("big-integer"));

var _binarySearch = _interopRequireDefault(require("binary-search"));

var _hexadecimal = require("../types/hexadecimal");

var _convert = require("../types/convert");

var _crypto = require("../crypto");

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef IEntry
 * @property {number} height Height of the entry
 * @property {number} index Index of the entry on the level
 * @property {string} hash SHA-256 digest of the entry
 */
// Maximum height of a valid Merkle tree
var MAX_TREE_HEIGHT = 58;

var ListProof = function ListProof(_ref, valueType) {
  var proof = _ref.proof,
      entries = _ref.entries,
      length = _ref.length;

  _classCallCheck(this, ListProof);

  if (!valueType || typeof valueType.serialize !== 'function') {
    throw new TypeError('No `serialize` method in the value type');
  }

  this.valueType = valueType;
  this.proof = parseProof(proof);
  this.entries = parseEntries(entries, valueType);
  this.length = length;
  var rootHash;

  if (this.length === 0) {
    if (this.proof.length === 0 && this.entries.length === 0) {
      rootHash = '0000000000000000000000000000000000000000000000000000000000000000';
    } else {
      throw new ListProofError('malformedEmptyProof');
    }
  } else {
    var completeProof = [].concat(_toConsumableArray(this.entries), _toConsumableArray(this.proof));
    rootHash = collect(completeProof, this.length);
  }

  this.merkleRoot = hashList(rootHash, this.length);
};

exports.ListProof = ListProof;

function parseProof(proof) {
  if (!Array.isArray(proof)) {
    throw new ListProofError('malformedProof');
  }

  var validEntries = proof.every(function (_ref2) {
    var index = _ref2.index,
        height = _ref2.height,
        hash = _ref2.hash;
    return /^[0-9a-f]{64}$/i.test(hash) && Number.isInteger(index) && Number.isInteger(height) && height > 0 && height <= MAX_TREE_HEIGHT;
  });

  if (!validEntries) {
    throw new ListProofError('malformedProof');
  } // Check ordering of proof entries.


  for (var i = 0; i + 1 < proof.length; i++) {
    var _ref3 = [proof[i], proof[i + 1]],
        prev = _ref3[0],
        next = _ref3[1];

    if (prev.height > next.height || prev.height === next.height && prev.index >= next.index) {
      throw new ListProofError('invalidProofOrdering');
    }
  }

  return proof;
}
/**
 * Performs some preliminary checks on list values and computes their hashes.
 *
 * @param entries
 * @param valueType
 * @returns {IEntry[]} parsed entries
 */


function parseEntries(entries, valueType) {
  if (!Array.isArray(entries)) {
    throw new ListProofError('malformedEntries');
  } // Check ordering of values.


  for (var i = 0; i + 1 < entries.length; i++) {
    var _ref4 = [entries[i], entries[i + 1]],
        prev = _ref4[0],
        next = _ref4[1];

    if (prev[0] >= next[0]) {
      throw new ListProofError('invalidValuesOrdering');
    }
  }

  return entries.map(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        index = _ref6[0],
        value = _ref6[1];

    if (!Number.isInteger(index)) {
      throw new ListProofError('malformedEntries');
    }

    return {
      index: index,
      height: 0,
      value: value,
      hash: (0, _crypto.hash)([_constants.BLOB_PREFIX].concat(_toConsumableArray(valueType.serialize(value, [], 0))))
    };
  });
}
/**
 * Collects entries into a single hash of the Merkle tree.
 * @param {IEntry[]} entries
 * @param {number} listLength
 * @returns {string} hash of the Merkle tree
 */


function collect(entries, listLength) {
  var treeHeight = calcHeight(listLength); // Check that height is appropriate. Since we've checked ordering of `entries`,
  // we only check that the height of the last entry does not exceed the expected
  // value.

  if (entries[entries.length - 1].height >= treeHeight) {
    throw new ListProofError('unexpectedHeight');
  } // Check that indexes of `entries` are appropriate.


  entries.forEach(function (_ref7) {
    var height = _ref7.height,
        index = _ref7.index;
    var divisor = height === 0 ? 1 : Math.pow(2, height - 1);
    var maxIndexOnLevel = Math.floor((listLength - 1) / divisor);

    if (index > maxIndexOnLevel) {
      throw new ListProofError('unexpectedIndex');
    }
  }); // Copy values to the first layer (we've calculated their hashes already).

  var layer = spliceLayer(entries, 0).map(function (_ref8) {
    var index = _ref8.index,
        hash = _ref8.hash;
    return {
      height: 1,
      index: index,
      hash: hash
    };
  });
  var lastIndex = listLength - 1;

  for (var height = 1; height < treeHeight; height++) {
    // Merge with the next layer.
    var nextLayer = spliceLayer(entries, height);
    layer = mergeLayers(layer, nextLayer); // Zip the entries on the layer.

    hashLayer(layer, lastIndex);
    lastIndex = Math.floor(lastIndex / 2);
  }

  return layer[0].hash;
}
/**
 * Splices entries with the specified height from the beginning of the array.
 * The entries are modified in place.
 *
 * @param {IEntry[]} entries
 * @param {number} height
 * @returns {IEntry[]} spliced entries
 */


function spliceLayer(entries, height) {
  var index = (0, _binarySearch["default"])(entries, height + 1, function (_ref9, needleHeight) {
    var height = _ref9.height,
        index = _ref9.index;
    // Assume that all entries with `height === needleHeight` are larger than our needle.
    var x = needleHeight !== height ? height - needleHeight : 1;
    return x;
  });
  /* istanbul ignore next: should never be triggered */

  if (index >= 0) {
    throw new Error('Internal error while verifying list proof');
  }

  var greaterIndex = -index - 1;
  return entries.splice(0, greaterIndex);
}
/**
 * Merges two sorted arrays together.
 *
 * @param {IEntry[]} xs
 * @param {IEntry[]} ys
 * @returns {IEntry[]}
 */


function mergeLayers(xs, ys) {
  var xIndex = 0;
  var yIndex = 0;
  var output = [];

  while (xIndex < xs.length || yIndex < ys.length) {
    var _ref10 = [xs[xIndex], ys[yIndex]],
        x = _ref10[0],
        y = _ref10[1];

    if (!x) {
      output.push(y);
      yIndex++;
    } else if (!y) {
      output.push(x);
      xIndex++;
    } else if (x.index < y.index) {
      output.push(x);
      xIndex++;
    } else if (x.index > y.index) {
      output.push(y);
      yIndex++;
    } else {
      // x.index === y.index
      throw new ListProofError('duplicateHash');
    }
  }

  return output;
}
/**
 * Elevates the layer to the next level by zipping pairs of entries together.
 *
 * @param {IEntry[]} layer
 * @param {number} lastIndex
 */


function hashLayer(layer, lastIndex) {
  for (var i = 0; i < layer.length; i += 2) {
    var _ref11 = [layer[i], layer[i + 1]],
        left = _ref11[0],
        right = _ref11[1];

    var _hash = void 0;

    if (right) {
      // To be able to zip two hashes on the layer, they need to be adjacent to each other,
      // and the first of them needs to have an even index.
      if (left.index % 2 !== 0 || right.index !== left.index + 1) {
        throw new ListProofError('missingHash');
      }

      _hash = hashNode(left.hash, right.hash);
    } else {
      // If there is an odd number of hashes on the layer, the solitary hash must have
      // the greatest possible index.
      if (lastIndex % 2 === 1 || left.index !== lastIndex) {
        throw new ListProofError('missingHash');
      }

      _hash = hashNode(left.hash);
    }

    layer[i / 2] = {
      height: left.height + 1,
      index: left.index / 2,
      hash: _hash
    };
  }

  layer.length = Math.ceil(layer.length / 2);
}

function hashNode(leftHash, maybeRightHash) {
  var buffer = [_constants.LIST_BRANCH_PREFIX];

  _hexadecimal.Hash.serialize(leftHash, buffer, buffer.length);

  if (maybeRightHash) {
    _hexadecimal.Hash.serialize(maybeRightHash, buffer, buffer.length);
  }

  return (0, _crypto.hash)(buffer);
}
/**
 * Computes hash of the `ProofListIndex` given its length and root hash.
 * @param {string} rootHash
 * @param {number} length
 * @returns {string}
 */


function hashList(rootHash, length) {
  var buffer = new Uint8Array(9 + _crypto.HASH_LENGTH);
  buffer[0] = _constants.LIST_PREFIX; // Set bytes 1..9 as little-endian list length

  var quotient = (0, _bigInteger["default"])(length);

  for (var _byte = 1; _byte < 9; _byte++) {
    var remainder = void 0;

    var _quotient$divmod = quotient.divmod(256);

    quotient = _quotient$divmod.quotient;
    remainder = _quotient$divmod.remainder;
    buffer[_byte] = remainder;
  }

  buffer.set((0, _convert.hexadecimalToUint8Array)(rootHash), 9);
  return (0, _crypto.hash)(buffer);
}
/**
 * Calculates height of a Merkle tree given its length.
 * @param {bigInt} count
 * @return {number}
 */


function calcHeight(count) {
  var i = 0;

  while ((0, _bigInteger["default"])(2).pow(i).lt(count)) {
    i++;
  }

  return i + 1;
}

var ListProofError = /*#__PURE__*/function (_Error) {
  _inherits(ListProofError, _Error);

  var _super = _createSuper(ListProofError);

  function ListProofError(type) {
    var _this;

    _classCallCheck(this, ListProofError);

    switch (type) {
      case 'malformedProof':
      case 'invalidProofOrdering':
        _this = _super.call(this, 'malformed `proof` part of the proof');
        break;

      case 'malformedEntries':
      case 'invalidValuesOrdering':
        _this = _super.call(this, 'malformed `entries` in the proof');
        break;

      case 'unexpectedHeight':
      case 'unexpectedIndex':
        _this = _super.call(this, 'proof contains a branch where it is impossible according to list length');
        break;

      case 'duplicateHash':
        _this = _super.call(this, 'proof contains redundant entries');
        break;

      case 'missingHash':
        _this = _super.call(this, 'proof does not contain information to restore index hash');
        break;

      default:
        _this = _super.call(this, type);
    }

    return _this;
  }

  return ListProofError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

exports.ListProofError = ListProofError;

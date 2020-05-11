"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapProofError = exports.MapProof = void 0;

var _binarySearch = _interopRequireDefault(require("binary-search"));

var _crypto = require("../crypto");

var _hexadecimal = require("../types/hexadecimal");

var _constants = require("./constants");

var _ProofPath = _interopRequireDefault(require("./ProofPath"));

var _types = require("../types");

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

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Proof of existence and/or absence of certain elements from a Merkelized
 * map index.
 */
var MapProof = /*#__PURE__*/function () {
  _createClass(MapProof, null, [{
    key: "rawKey",

    /**
     * Converts a key type to a raw representation, in which keys are not hashed before
     * Merkle Patricia tree construction.
     *
     * @param keyType
     */
    value: function rawKey(keyType) {
      if (!keyType || typeof keyType.serialize !== 'function') {
        throw new TypeError('Invalid key type; pass a type with a `serialize` function');
      }

      return {
        hash: function hash(data) {
          var bytes = keyType.serialize(data, [], 0);

          if (bytes.length !== _crypto.HASH_LENGTH) {
            throw new Error("Invalid raw key; raw keys should have ".concat(_crypto.HASH_LENGTH, "-byte serialization"));
          }

          return bytes;
        }
      };
    }
    /**
     * Creates a new instance of a proof.
     *
     * @param {Object} json
     *   JSON object containing (untrusted) proof
     * @param {{serialize: (any) => Array<number>}} keyType
     *   Type of keys used in the underlying Merkelized map. Usually, `PublicKey`
     *   or `Hash`. The keys must be serializable.
     * @param {{serialize: (any) => Array<number>}} valueType
     *   Type of values used in the underlying Merkelized map. Usually, it should
     *   be a type created with the `newType` function. The type must be serializable.
     * @throws {MapProofError}
     *   if the proof is malformed
     */

  }]);

  function MapProof(json, keyType, valueType) {
    _classCallCheck(this, MapProof);

    this.proof = parseProof(json.proof);
    this.entries = parseEntries(json.entries, keyType, valueType);

    if (!keyType) {
      throw new TypeError('No key type provided');
    }

    if (typeof keyType.serialize !== 'function' && typeof keyType.hash !== 'function') {
      throw new TypeError('No `serialize` or `hash` method in the key type');
    }

    this.keyType = keyType;

    if (!valueType || typeof valueType.serialize !== 'function') {
      throw new TypeError('No `serialize` method in the value type');
    }

    this.valueType = valueType;
    precheckProof.call(this);
    var completeProof = this.proof.concat(this.entries).sort(function (_ref, _ref2) {
      var pathA = _ref.path;
      var pathB = _ref2.path;
      return pathA.compare(pathB);
    }); // This check is required as duplicate paths can be introduced by entries
    // (further, it's generally possible that two different entry keys lead
    //  to the same `ProofPath`).

    for (var i = 1; i < completeProof.length; i++) {
      var _ref3 = [completeProof[i - 1], completeProof[i]],
          pathA = _ref3[0].path,
          pathB = _ref3[1].path;

      if (pathA.compare(pathB) === 0) {
        throw new MapProofError('duplicatePath', pathA);
      }
    }

    var rootHash = (0, _types.hexadecimalToUint8Array)(collect(completeProof.filter(function (_ref4) {
      var hash = _ref4.hash;
      return !!hash;
    })));
    this.merkleRoot = (0, _crypto.hash)([_constants.MAP_PREFIX].concat(_toConsumableArray(rootHash)));
    this.missingKeys = new Set(this.entries.filter(function (e) {
      return e.missing !== undefined;
    }).map(function (_ref5) {
      var missing = _ref5.missing;
      return missing;
    }));
    this.entries = new Map(this.entries.filter(function (e) {
      return e.key !== undefined;
    }).map(function (_ref6) {
      var key = _ref6.key,
          value = _ref6.value;
      return [key, value];
    }));
  }

  return MapProof;
}();

exports.MapProof = MapProof;

function parseProof(proof) {
  if (!Array.isArray(proof)) {
    throw new MapProofError('malformedProof');
  }

  var validEntries = proof.every(function (_ref7) {
    var path = _ref7.path,
        hash = _ref7.hash;
    return /^[01]{1,256}$/.test(path) && /^[0-9a-f]{64}$/i.test(hash);
  });

  if (!validEntries) {
    throw new MapProofError('malformedProof');
  }

  return proof.map(function (_ref8) {
    var path = _ref8.path,
        hash = _ref8.hash;
    return {
      path: new _ProofPath["default"](path),
      hash: hash
    };
  });
}

function parseEntries(entries, keyType, valueType) {
  function createPath(data) {
    var keyBytes = typeof keyType.hash === 'function' ? keyType.hash(data) : (0, _crypto.hash)(keyType.serialize(data, [], 0));
    var bytes;

    if (typeof keyBytes === 'string') {
      bytes = (0, _types.hexadecimalToUint8Array)(keyBytes);
    } else {
      bytes = new Uint8Array(keyBytes);
    }

    return new _ProofPath["default"](bytes);
  }

  if (!Array.isArray(entries)) {
    throw new MapProofError('malformedEntries');
  }

  return entries.map(function (_ref9) {
    var missing = _ref9.missing,
        key = _ref9.key,
        value = _ref9.value;

    if (missing === undefined && (key === undefined || value === undefined)) {
      throw new MapProofError('unknownEntryType');
    }

    if (missing !== undefined && (key !== undefined || value !== undefined)) {
      throw new MapProofError('ambiguousEntryType');
    }

    if (missing !== undefined) {
      return {
        missing: missing,
        path: createPath(missing)
      };
    }

    return {
      key: key,
      value: value,
      path: createPath(key),
      hash: (0, _crypto.hash)([_constants.BLOB_PREFIX].concat(_toConsumableArray(valueType.serialize(value, [], 0))))
    };
  });
}
/**
 * @this {MapProof}
 */


function precheckProof() {
  var _this = this;

  // Check that entries in proof are in increasing order
  for (var i = 1; i < this.proof.length; i++) {
    var _ref10 = [this.proof[i - 1], this.proof[i]],
        prevPath = _ref10[0].path,
        path = _ref10[1].path;

    switch (prevPath.compare(path)) {
      case -1:
        if (path.startsWith(prevPath)) {
          throw new MapProofError('embeddedPaths', prevPath, path);
        }

        break;

      case 0:
        throw new MapProofError('duplicatePath', path);

      case 1:
        throw new MapProofError('invalidOrdering', prevPath, path);
    }
  } // Check that no entry has a prefix among the paths in the proof entries.
  // In order to do this, it suffices to locate the closest smaller path
  // in the proof entries and check only it.


  this.entries.forEach(function (_ref11) {
    var keyPath = _ref11.path;
    var index = (0, _binarySearch["default"])(_this.proof, keyPath, function (_ref12, needle) {
      var path = _ref12.path;
      return path.compare(needle);
    });

    if (index >= 0) {
      throw new MapProofError('duplicatePath', keyPath);
    }

    var insertionIndex = -index - 1;

    if (insertionIndex > 0) {
      var _prevPath = _this.proof[insertionIndex - 1].path;

      if (keyPath.startsWith(_prevPath)) {
        throw new MapProofError('embeddedPaths', _prevPath, keyPath);
      }
    }
  });
}

function serializeBranchNode(leftHash, rightHash, leftPath, rightPath) {
  var buffer = [_constants.MAP_BRANCH_PREFIX];

  _hexadecimal.Hash.serialize(leftHash, buffer, buffer.length);

  _hexadecimal.Hash.serialize(rightHash, buffer, buffer.length);

  leftPath.serialize(buffer);
  rightPath.serialize(buffer);
  return buffer;
}

function serializeIsolatedNode(path, hash) {
  var buffer = [_constants.MAP_BRANCH_PREFIX];
  path.serialize(buffer);

  _hexadecimal.Hash.serialize(hash, buffer, buffer.length);

  return buffer;
}

function collect(entries) {
  function hashIsolatedNode(_ref13) {
    var path = _ref13.path,
        valueHash = _ref13.hash;
    var buffer = serializeIsolatedNode(path, valueHash);
    return (0, _crypto.hash)(buffer);
  }

  function hashBranch(left, right) {
    var buffer = serializeBranchNode(left.hash, right.hash, left.path, right.path);
    return (0, _crypto.hash)(buffer);
  }

  function fold(contour, lastPrefix) {
    var lastEntry = contour.pop();
    var penultimateEntry = contour.pop();
    contour.push({
      path: lastPrefix,
      hash: hashBranch(penultimateEntry, lastEntry)
    });
    return contour.length > 1 ? lastPrefix.commonPrefix(contour[contour.length - 2].path) : null;
  }

  switch (entries.length) {
    case 0:
      return '0000000000000000000000000000000000000000000000000000000000000000';

    case 1:
      if (!entries[0].path.isTerminal()) {
        throw new MapProofError('nonTerminalNode', entries[0].path);
      }

      return hashIsolatedNode(entries[0]);

    default:
      {
        var contour = []; // invariant: equal to the common prefix of the 2 last nodes in the contour

        var lastPrefix = entries[0].path.commonPrefix(entries[1].path);
        contour.push(entries[0], entries[1]);

        for (var i = 2; i < entries.length; i++) {
          var entry = entries[i];
          var newPrefix = entry.path.commonPrefix(contour[contour.length - 1].path);

          while (contour.length > 1 && newPrefix.bitLength < lastPrefix.bitLength) {
            var foldedPrefix = fold(contour, lastPrefix);

            if (foldedPrefix) {
              lastPrefix = foldedPrefix;
            }
          }

          contour.push(entry);
          lastPrefix = newPrefix;
        }

        while (contour.length > 1) {
          lastPrefix = fold(contour, lastPrefix);
        }

        return contour[0].hash;
      }
  }
}
/**
 * Error indicating a malformed `MapProof`.
 */


var MapProofError = /*#__PURE__*/function (_Error) {
  _inherits(MapProofError, _Error);

  var _super = _createSuper(MapProofError);

  function MapProofError(type) {
    var _this2;

    _classCallCheck(this, MapProofError);

    switch (type) {
      case 'malformedProof':
        _this2 = _super.call(this, 'malformed `proof` part of the proof');
        break;

      case 'malformedEntries':
      case 'unknownEntryType':
      case 'ambiguousEntryType':
        _this2 = _super.call(this, 'malformed `entries` part of the proof');
        break;

      case 'embeddedPaths':
        _this2 = _super.call(this, "embedded paths in proof: ".concat(arguments.length <= 1 ? undefined : arguments[1], " is a prefix of ").concat(arguments.length <= 2 ? undefined : arguments[2]));
        break;

      case 'duplicatePath':
        _this2 = _super.call(this, "duplicate ".concat(arguments.length <= 1 ? undefined : arguments[1], " in proof"));
        break;

      case 'invalidOrdering':
        _this2 = _super.call(this, 'invalid path ordering');
        break;

      case 'nonTerminalNode':
        _this2 = _super.call(this, 'non-terminal isolated node in proof');
        break;

      default:
        _this2 = _super.call(this, type);
    }

    return _this2;
  }

  return MapProofError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

exports.MapProofError = MapProofError;

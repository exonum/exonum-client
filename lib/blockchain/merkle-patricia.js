'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapProofError = exports.MapProof = undefined;

var _binarySearch = require('binary-search');

var _binarySearch2 = _interopRequireDefault(_binarySearch);

var _crypto = require('../crypto');

var _generic = require('../types/generic');

var _hexadecimal = require('../types/hexadecimal');

var _ProofPath = require('./ProofPath');

var _ProofPath2 = _interopRequireDefault(_ProofPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Proof of existence and/or absence of certain elements from a Merkelized
 * map index.
 */
var MapProof =
/**
 * Creates a new instance of a proof.
 *
 * @param {Object} json
 *   JSON object containing (untrusted) proof
 * @param {{serialize: (any) => Array<number>}} keyType
 *   Type of keys used in the underlying Merkelized map. Usually, `PublicKey`
 *   or `Hash`. The keys must serialize to exactly 32 bytes.
 * @param {{hash?: (any) => string, serialize: (any) => Array<number>}} valueType
 *   Type of values used in the underlying Merkelized map. Usually, it should
 *   be a type created with the `newType` function. The type should possess
 *   one of `hash` or `serialize` methods.
 * @throws {MapProofError}
 *   if the proof is malformed
 */
exports.MapProof = function MapProof(json, keyType, valueType) {
  _classCallCheck(this, MapProof);

  this.proof = parseProof(json.proof);
  this.entries = parseEntries(json.entries, keyType, valueType);

  if (!keyType || typeof keyType.serialize !== 'function') {
    throw new TypeError('No `serialize` method in the key type');
  }
  this.keyType = keyType;

  if (!valueType || typeof valueType.serialize !== 'function' && typeof valueType.hash !== 'function') {
    throw new TypeError('No `hash` or `serialize` method in the value type');
  }
  this.valueType = valueType;

  precheckProof.call(this);

  var completeProof = this.proof.concat(this.entries).sort(function (_ref, _ref2) {
    var pathA = _ref.path;
    var pathB = _ref2.path;
    return pathA.compare(pathB);
  });

  // This check is required as duplicate paths can be introduced by entries
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

  this.merkleRoot = collect(completeProof.filter(function (_ref4) {
    var hash = _ref4.hash;
    return !!hash;
  }));
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
};

function parseProof(proof) {
  if (!Array.isArray(proof)) {
    throw new MapProofError('malformedProof');
  }

  var validEntries = proof.every(function (_ref7) {
    var path = _ref7.path,
        hash = _ref7.hash;

    return (/^[01]{1,256}$/.test(path) && /^[0-9a-f]{64}$/i.test(hash)
    );
  });
  if (!validEntries) {
    throw new MapProofError('malformedProof');
  }

  return proof.map(function (_ref8) {
    var path = _ref8.path,
        hash = _ref8.hash;
    return {
      path: new _ProofPath2.default(path),
      hash: hash
    };
  });
}

function parseEntries(entries, keyType, valueType) {
  function createPath(data) {
    var bytes = keyType.serialize(data, [], 0);
    if (bytes.length !== _ProofPath2.default.BYTE_LENGTH) {
      throw new TypeError('invalid key type; keys should serialize to ' + (_ProofPath2.default.BYTE_LENGTH + '-byte buffers'));
    }

    return new _ProofPath2.default(Uint8Array.from(bytes));
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
      hash: typeof valueType.hash === 'function' ? valueType.hash(value) // `newType`s
      : (0, _crypto.hash)(valueType.serialize(value, [], 0)) // "primitive" types
    };
  });
}

/**
 * @param this MapProof
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
  }

  // Check that no entry has a prefix among the paths in the proof entries.
  // In order to do this, it suffices to locate the closest smaller path
  // in the proof entries and check only it.
  this.entries.forEach(function (_ref11) {
    var keyPath = _ref11.path;

    var index = (0, _binarySearch2.default)(_this.proof, keyPath, function (_ref12, needle) {
      var path = _ref12.path;

      return path.compare(needle);
    });

    if (index >= 0) {
      throw new MapProofError('duplicatePath', keyPath);
    }

    var insertionIndex = -index - 1;
    if (insertionIndex > 0) {
      var prevPath = _this.proof[insertionIndex - 1].path;
      if (keyPath.startsWith(prevPath)) {
        throw new MapProofError('embeddedPaths', prevPath, keyPath);
      }
    }
  });
}

var IsolatedNode = (0, _generic.newType)({
  fields: [{ name: 'path', type: _ProofPath2.default.TYPE }, { name: 'hash', type: _hexadecimal.Hash }]
});

var BranchNode = (0, _generic.newType)({
  fields: [{ name: 'left_hash', type: _hexadecimal.Hash }, { name: 'right_hash', type: _hexadecimal.Hash }, { name: 'left_path', type: _ProofPath2.default.TYPE }, { name: 'right_path', type: _ProofPath2.default.TYPE }]
});

function collect(entries) {
  function hashIsolatedNode(_ref13) {
    var path = _ref13.path,
        valueHash = _ref13.hash;

    return (0, _crypto.hash)({ hash: valueHash, path: path }, IsolatedNode);
  }

  function hashBranch(left, right) {
    var branch = {
      left_hash: left.hash,
      right_hash: right.hash,
      left_path: left.path,
      right_path: right.path
    };

    return (0, _crypto.hash)(branch, BranchNode);
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
      if (!entries[0].path.isTerminal) {
        throw new MapProofError('nonTerminalNode', entries[0].path);
      }
      return hashIsolatedNode(entries[0]);

    default:
      var contour = [];

      // invariant: equal to the common prefix of the 2 last nodes in the contour
      var lastPrefix = entries[0].path.commonPrefix(entries[1].path);
      contour.push(entries[0], entries[1]);

      for (var i = 2; i < entries.length; i++) {
        var entry = entries[i];
        var newPrefix = entry.path.commonPrefix(contour[contour.length - 1].path);

        while (contour.length > 1 && newPrefix.bitLength() < lastPrefix.bitLength()) {
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

/**
 * Error indicating a malformed `MapProof`.
 */

var MapProofError = exports.MapProofError = function (_Error) {
  _inherits(MapProofError, _Error);

  function MapProofError(type) {
    _classCallCheck(this, MapProofError);

    switch (type) {
      case 'malformedProof':
        var _this2 = _possibleConstructorReturn(this, (MapProofError.__proto__ || Object.getPrototypeOf(MapProofError)).call(this, 'malformed `proof` part of the proof'));

        break;
      case 'malformedEntries':
      case 'unknownEntryType':
      case 'ambiguousEntryType':
        var _this2 = _possibleConstructorReturn(this, (MapProofError.__proto__ || Object.getPrototypeOf(MapProofError)).call(this, 'malformed `entries` part of the proof'));

        break;
      case 'embeddedPaths':
        var _this2 = _possibleConstructorReturn(this, (MapProofError.__proto__ || Object.getPrototypeOf(MapProofError)).call(this, 'embedded paths in proof: ' + (arguments.length <= 1 ? undefined : arguments[1]) + ' is a prefix of ' + (arguments.length <= 2 ? undefined : arguments[2])));

        break;
      case 'duplicatePath':
        var _this2 = _possibleConstructorReturn(this, (MapProofError.__proto__ || Object.getPrototypeOf(MapProofError)).call(this, 'duplicate ' + (arguments.length <= 1 ? undefined : arguments[1]) + ' in proof'));

        break;
      case 'invalidOrdering':
        var _this2 = _possibleConstructorReturn(this, (MapProofError.__proto__ || Object.getPrototypeOf(MapProofError)).call(this, 'invalid path ordering'));

        break;
      case 'nonTerminalNode':
        var _this2 = _possibleConstructorReturn(this, (MapProofError.__proto__ || Object.getPrototypeOf(MapProofError)).call(this, 'non-terminal isolated node in proof'));

        break;
      default:
        var _this2 = _possibleConstructorReturn(this, (MapProofError.__proto__ || Object.getPrototypeOf(MapProofError)).call(this, type));

    }
    return _this2;
  }

  return MapProofError;
}(Error);

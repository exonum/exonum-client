'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _primitive = require('../types/primitive');

var primitive = _interopRequireWildcard(_primitive);

var _hexadecimal = require('../types/hexadecimal');

var _generic = require('../types/generic');

var _convert = require('../types/convert');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BIT_LENGTH = 256;

var ProofPath = function () {
  /**
   * Constructs a proof path from a binary string or a byte buffer.
   *
   * @param {string | Uint8Array} bits
   */
  function ProofPath(bits) {
    var bitLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : BIT_LENGTH;

    _classCallCheck(this, ProofPath);

    if (typeof bits === 'string') {
      this.key = (0, _convert.binaryStringToUint8Array)(padWithZeros(bits, BIT_LENGTH));
      bitLength = bits.length;
    } else if (bits instanceof Uint8Array && bits.length === BIT_LENGTH / 8) {
      this.key = bits.slice(0);
    } else {
      throw new TypeError('Invalid `bits` parameter');
    }

    this.isTerminal = bitLength === BIT_LENGTH;
    this.lengthByte = bitLength % BIT_LENGTH;
    this.hexKey = (0, _convert.uint8ArrayToHexadecimal)(this.key);
  }

  _createClass(ProofPath, [{
    key: 'bitLength',
    value: function bitLength() {
      return this.isTerminal ? BIT_LENGTH : this.lengthByte;
    }

    /**
     * Retrieves a bit at a specific position of this key.
     *
     * @param {number} pos
     * @returns {0 | 1 | void}
     */

  }, {
    key: 'bit',
    value: function bit(pos) {
      pos = +pos;
      if (pos >= this.bitLength() || pos < 0) {
        return undefined;
      }

      return getBit(this.key, pos);
    }
  }, {
    key: 'commonPrefixLength',
    value: function commonPrefixLength(other) {
      var intersectingBits = Math.min(this.bitLength(), other.bitLength());

      // First, advance by a full byte while it is possible
      var pos = void 0;
      for (pos = 0; pos < intersectingBits >> 3 && this.key[pos >> 3] === other.key[pos >> 3]; pos += 8) {}

      // Then, check inidividual bits
      for (; pos < intersectingBits && this.bit(pos) === other.bit(pos); pos++) {}

      return pos;
    }

    /**
     * Computes a common prefix of this and another byte sequence.
     *
     * @param {ProofPath} other
     * @returns {ProofPath}
     */

  }, {
    key: 'commonPrefix',
    value: function commonPrefix(other) {
      var pos = this.commonPrefixLength(other);
      return this.truncate(pos);
    }

    /**
     * Checks if the path starts with the other specified path.
     *
     * @param {ProofPath} other
     * @returns {boolean}
     */

  }, {
    key: 'startsWith',
    value: function startsWith(other) {
      return this.commonPrefixLength(other) === other.bitLength();
    }

    /**
     * Compares this proof path to another.
     *
     * @param {ProofPath} other
     * @returns {-1 | 0 | 1}
     */

  }, {
    key: 'compare',
    value: function compare(other) {
      var _ref = [this.bitLength(), other.bitLength()],
          thisLen = _ref[0],
          otherLen = _ref[1];

      var intersectingBits = Math.min(thisLen, otherLen);
      var pos = this.commonPrefixLength(other);

      if (pos === intersectingBits) {
        return Math.sign(thisLen - otherLen);
      }
      return this.bit(pos) - other.bit(pos);
    }

    /**
     * Truncates this bit sequence to a shorter one by removing some bits from the end.
     *
     * @param {number} bits
     *   new length of the sequence
     * @returns {ProofPath}
     *   truncated bit sequence
     */

  }, {
    key: 'truncate',
    value: function truncate(bits) {
      bits = +bits;
      if (bits > this.bitLength()) {
        throw new TypeError('Cannot truncate bit slice to length more than current ' + ('(current: ' + this.bitLength() + ', requested: ' + bits + ')'));
      }

      var bytes = new Uint8Array(BIT_LENGTH / 8);
      for (var i = 0; i < bits >> 3; i++) {
        bytes[i] = this.key[i];
      }
      for (var bit = 8 * (bits >> 3); bit < bits; bit++) {
        setBit(bytes, bit, this.bit(bit));
      }

      return new ProofPath(bytes, bits);
    }

    /**
     * Converts this path to its JSON presentation.
     *
     * @returns {string}
     *   binary string representing the path
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var bits = (0, _convert.hexadecimalToBinaryString)(this.hexKey);
      return trimZeros(bits, this.bitLength());
    }
  }, {
    key: 'toString',
    value: function toString() {
      var bits = (0, _convert.hexadecimalToBinaryString)(this.hexKey);
      bits = this.bitLength() > 8 ? trimZeros(bits, 8) + '...' : trimZeros(bits, this.bitLength());
      return 'path(' + bits + ')';
    }
  }]);

  return ProofPath;
}();

/**
 * Expected length of byte buffers used to create `ProofPath`s.
 */


exports.default = ProofPath;
ProofPath.BYTE_LENGTH = BIT_LENGTH / 8;

ProofPath.TYPE = (0, _generic.newType)({
  fields: [{ name: 'isTerminal', type: primitive.Bool }, { name: 'hexKey', type: _hexadecimal.Hash }, { name: 'lengthByte', type: primitive.Uint8 }]
});

function getBit(buffer, pos) {
  var byte = Math.floor(pos / 8);
  var bitPos = pos % 8;

  return (buffer[byte] & 1 << bitPos) >> bitPos;
}

/**
 * Sets a specified bit in the byte buffer.
 *
 * @param {Uint8Array} buffer
 * @param {number} pos 0-based position in the buffer to set
 * @param {0 | 1} bit
 */
function setBit(buffer, pos, bit) {
  var byte = Math.floor(pos / 8);
  var bitPos = pos % 8;

  if (bit === 0) {
    var mask = 255 - (1 << bitPos);
    buffer[byte] &= mask;
  } else {
    var _mask = 1 << bitPos;
    buffer[byte] |= _mask;
  }
}

var ZEROS = function () {
  var str = '0';
  for (var i = 0; i < 8; i++) {
    str = str + str;
  }return str;
}();

function padWithZeros(str, desiredLength) {
  return str + ZEROS.substring(0, desiredLength - str.length);
}

function trimZeros(str, desiredLength) {
  /* istanbul ignore next: should never be triggered */
  if (str.length < desiredLength) {
    throw new Error('Invariant broken: negative zero trimming requested');
  }
  return str.substring(0, desiredLength);
}

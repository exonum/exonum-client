'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Decimal = exports.Timespec = exports.Bool = exports.String = exports.Float64 = exports.Float32 = exports.Uint64 = exports.Uint32 = exports.Uint16 = exports.Uint8 = exports.Int64 = exports.Int32 = exports.Int16 = exports.Int8 = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bigInteger = require('big-integer');

var _bigInteger2 = _interopRequireDefault(_bigInteger);

var _ieee = require('ieee754');

var ieee754 = _interopRequireWildcard(_ieee);

var _validate = require('./validate');

var validate = _interopRequireWildcard(_validate);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MIN_INT8 = -128;
var MAX_INT8 = 127;
var MIN_INT16 = -32768;
var MAX_INT16 = 32767;
var MIN_INT32 = -2147483648;
var MAX_INT32 = 2147483647;
var MIN_INT64 = '-9223372036854775808';
var MAX_INT64 = '9223372036854775807';
var MAX_UINT8 = 255;
var MAX_UINT16 = 65535;
var MAX_UINT32 = 4294967295;
var MAX_UINT64 = '18446744073709551615';
var MAX_DECIMAL = '79228162514264337593543950336';

/**
 * Insert number into array as as little-endian
 * @param {number|bigInt} number
 * @param {Array} buffer
 * @param {number} from
 * @param {number} size
 * @returns {boolean}
 */
function insertIntegerToByteArray(number, buffer, from, size) {
  var value = (0, _bigInteger2.default)(number); // convert a number-like object into a big integer

  for (var pos = 0; pos < size; pos++) {
    var divmod = value.divmod(256);
    buffer[from + pos] = divmod.remainder.value;
    value = divmod.quotient;
  }

  return buffer;
}

/**
 * Insert IEEE754 floating point number into array as as little-endian
 * @param {number} number
 * @param {Array} buffer
 * @param {number} from
 * @param {number} mLen - mantissa length
 * @param {number} nBytes - number of bytes
 * @returns {boolean}
 */
function insertFloatToByteArray(number, buffer, from, mLen, nBytes) {
  ieee754.write(buffer, number, from, true, mLen, nBytes);

  return buffer;
}

/**
 * @param {string} str
 * @param {Array} buffer
 * @param {number} from
 */
function insertStringToByteArray(str, buffer, from) {
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);

    if (c < 128) {
      buffer[from++] = c;
    } else if (c < 2048) {
      buffer[from++] = c >> 6 | 192;
      buffer[from++] = c & 63 | 128;
    } else if ((c & 0xFC00) === 0xD800 && i + 1 < str.length && (str.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
      // surrogate pair
      c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
      buffer[from++] = c >> 18 | 240;
      buffer[from++] = c >> 12 & 63 | 128;
      buffer[from++] = c >> 6 & 63 | 128;
      buffer[from++] = c & 63 | 128;
    } else {
      buffer[from++] = c >> 12 | 224;
      buffer[from++] = c >> 6 & 63 | 128;
      buffer[from++] = c & 63 | 128;
    }
  }
}

var Int8 = exports.Int8 = function () {
  function Int8() {
    _classCallCheck(this, Int8);
  }

  _createClass(Int8, null, [{
    key: 'size',
    value: function size() {
      return 1;
    }

    /**
     * @param {number} value
     * @param {Array} buffer
     * @param {number} from
     * @returns {Array}
     */

  }, {
    key: 'serialize',
    value: function serialize(value, buffer, from) {
      if (!validate.validateInteger(value, MIN_INT8, MAX_INT8, from, this.size())) {
        throw new TypeError('Int8 of wrong type is passed: ' + value);
      }

      if (value < 0) {
        value = MAX_UINT8 + value + 1;
      }

      return insertIntegerToByteArray(value, buffer, from, this.size());
    }
  }]);

  return Int8;
}();

var Int16 = exports.Int16 = function () {
  function Int16() {
    _classCallCheck(this, Int16);
  }

  _createClass(Int16, null, [{
    key: 'size',
    value: function size() {
      return 2;
    }

    /**
     * @param {number} value
     * @param {Array} buffer
     * @param {number} from
     * @returns {Array}
     */

  }, {
    key: 'serialize',
    value: function serialize(value, buffer, from) {
      if (!validate.validateInteger(value, MIN_INT16, MAX_INT16, from, this.size())) {
        throw new TypeError('Int16 of wrong type is passed: ' + value);
      }

      if (value < 0) {
        value = MAX_UINT16 + value + 1;
      }

      return insertIntegerToByteArray(value, buffer, from, this.size());
    }
  }]);

  return Int16;
}();

var Int32 = exports.Int32 = function () {
  function Int32() {
    _classCallCheck(this, Int32);
  }

  _createClass(Int32, null, [{
    key: 'size',
    value: function size() {
      return 4;
    }

    /**
     * @param {number} value
     * @param {Array} buffer
     * @param {number} from
     * @returns {Array}
     */

  }, {
    key: 'serialize',
    value: function serialize(value, buffer, from) {
      if (!validate.validateInteger(value, MIN_INT32, MAX_INT32, from, this.size())) {
        throw new TypeError('Int32 of wrong type is passed: ' + value);
      }

      if (value < 0) {
        value = MAX_UINT32 + value + 1;
      }

      return insertIntegerToByteArray(value, buffer, from, this.size());
    }
  }]);

  return Int32;
}();

var Int64 = exports.Int64 = function () {
  function Int64() {
    _classCallCheck(this, Int64);
  }

  _createClass(Int64, null, [{
    key: 'size',
    value: function size() {
      return 8;
    }

    /**
     * @param {number|string} value
     * @param {Array} buffer
     * @param {number} from
     * @returns {Array}
     */

  }, {
    key: 'serialize',
    value: function serialize(value, buffer, from) {
      if (!validate.validateBigInteger(value, MIN_INT64, MAX_INT64, from, this.size())) {
        throw new TypeError('Int64 of wrong type is passed: ' + value);
      }

      var val = (0, _bigInteger2.default)(value);

      if (val.isNegative()) {
        val = (0, _bigInteger2.default)(MAX_UINT64).plus(1).plus(val);
      }

      return insertIntegerToByteArray(val, buffer, from, this.size());
    }
  }]);

  return Int64;
}();

var Uint8 = exports.Uint8 = function () {
  function Uint8() {
    _classCallCheck(this, Uint8);
  }

  _createClass(Uint8, null, [{
    key: 'size',
    value: function size() {
      return 1;
    }

    /**
     * @param {number} value
     * @param {Array} buffer
     * @param {number} from
     * @returns {Array}
     */

  }, {
    key: 'serialize',
    value: function serialize(value, buffer, from) {
      if (!validate.validateInteger(value, 0, MAX_UINT8, from, this.size())) {
        throw new TypeError('Uint8 of wrong type is passed: ' + value);
      }

      return insertIntegerToByteArray(value, buffer, from, this.size());
    }
  }]);

  return Uint8;
}();

var Uint16 = exports.Uint16 = function () {
  function Uint16() {
    _classCallCheck(this, Uint16);
  }

  _createClass(Uint16, null, [{
    key: 'size',
    value: function size() {
      return 2;
    }

    /**
     * @param {number} value
     * @param {Array} buffer
     * @param {number} from
     * @returns {Array}
     */

  }, {
    key: 'serialize',
    value: function serialize(value, buffer, from) {
      if (!validate.validateInteger(value, 0, MAX_UINT16, from, this.size())) {
        throw new TypeError('Uint16 of wrong type is passed: ' + value);
      }

      return insertIntegerToByteArray(value, buffer, from, this.size());
    }
  }]);

  return Uint16;
}();

var Uint32 = exports.Uint32 = function () {
  function Uint32() {
    _classCallCheck(this, Uint32);
  }

  _createClass(Uint32, null, [{
    key: 'size',
    value: function size() {
      return 4;
    }

    /**
     * @param {number} value
     * @param {Array} buffer
     * @param {number} from
     * @returns {Array}
     */

  }, {
    key: 'serialize',
    value: function serialize(value, buffer, from) {
      if (!validate.validateInteger(value, 0, MAX_UINT32, from, this.size())) {
        throw new TypeError('Uint32 of wrong type is passed: ' + value);
      }

      return insertIntegerToByteArray(value, buffer, from, this.size());
    }
  }]);

  return Uint32;
}();

var Uint64 = exports.Uint64 = function () {
  function Uint64() {
    _classCallCheck(this, Uint64);
  }

  _createClass(Uint64, null, [{
    key: 'size',
    value: function size() {
      return 8;
    }

    /**
     * @param {number|string} value
     * @param {Array} buffer
     * @param {number} from
     * @returns {Array}
     */

  }, {
    key: 'serialize',
    value: function serialize(value, buffer, from) {
      if (!validate.validateBigInteger(value, 0, MAX_UINT64, from, this.size())) {
        throw new TypeError('Uint64 of wrong type is passed: ' + value);
      }

      var val = (0, _bigInteger2.default)(value);

      return insertIntegerToByteArray(val, buffer, from, this.size());
    }
  }]);

  return Uint64;
}();

var Float32 = exports.Float32 = function () {
  function Float32() {
    _classCallCheck(this, Float32);
  }

  _createClass(Float32, null, [{
    key: 'size',
    value: function size() {
      return 4;
    }

    /**
     * @param {string} value
     * @param {Array} buffer
     * @param {number} from
     * @returns {Array}
     */

  }, {
    key: 'serialize',
    value: function serialize(value, buffer, from) {
      if (!validate.validateFloat(value, from, this.size())) {
        throw new TypeError('Float32 of wrong type is passed: ' + value);
      }

      return insertFloatToByteArray(value, buffer, from, 23, this.size());
    }
  }]);

  return Float32;
}();

var Float64 = exports.Float64 = function () {
  function Float64() {
    _classCallCheck(this, Float64);
  }

  _createClass(Float64, null, [{
    key: 'size',
    value: function size() {
      return 8;
    }

    /**
     * @param {string} value
     * @param {Array} buffer
     * @param {number} from
     * @returns {Array}
     */

  }, {
    key: 'serialize',
    value: function serialize(value, buffer, from) {
      if (!validate.validateFloat(value, from, this.size())) {
        throw new TypeError('Float64 of wrong type is passed: ' + value);
      }

      return insertFloatToByteArray(value, buffer, from, 52, this.size());
    }
  }]);

  return Float64;
}();

var String = exports.String = function () {
  function String() {
    _classCallCheck(this, String);
  }

  _createClass(String, null, [{
    key: 'size',
    value: function size() {
      return 8;
    }

    /**
     * @param {string} string
     * @param {Array} buffer
     * @param {number} from
     * @param {number} relativeFromIndex
     * @returns {Array}
     */

  }, {
    key: 'serialize',
    value: function serialize(string, buffer, from, relativeFromIndex) {
      if (typeof string !== 'string') {
        throw new TypeError('Wrong data type is passed as String. String is required');
      }

      var bufferLength = buffer.length;
      Uint32.serialize(relativeFromIndex, buffer, from); // index where string content starts in buffer
      insertStringToByteArray(string, buffer, bufferLength); // string content
      Uint32.serialize(buffer.length - bufferLength, buffer, from + 4); // string length

      return buffer;
    }
  }]);

  return String;
}();

var Bool = exports.Bool = function () {
  function Bool() {
    _classCallCheck(this, Bool);
  }

  _createClass(Bool, null, [{
    key: 'size',
    value: function size() {
      return 1;
    }

    /**
     * @param {boolean} value
     * @param {Array} buffer
     * @param {number} from
     * @returns {Array}
     */

  }, {
    key: 'serialize',
    value: function serialize(value, buffer, from) {
      if (typeof value !== 'boolean') {
        throw new TypeError('Wrong data type is passed as Boolean. Boolean is required');
      }

      return insertIntegerToByteArray(value ? 1 : 0, buffer, from, this.size());
    }
  }]);

  return Bool;
}();

var Timespec = exports.Timespec = function () {
  function Timespec() {
    _classCallCheck(this, Timespec);
  }

  _createClass(Timespec, null, [{
    key: 'size',
    value: function size() {
      return 8;
    }

    /**
     * @param {number|string} nanoseconds
     * @param {Array} buffer
     * @param {number} from
     * @returns {Array}
     */

  }, {
    key: 'serialize',
    value: function serialize(nanoseconds, buffer, from) {
      if (!validate.validateBigInteger(nanoseconds, 0, MAX_UINT64, from, this.size())) {
        throw new TypeError('Timespec of wrong type is passed: ' + nanoseconds);
      }

      var val = (0, _bigInteger2.default)(nanoseconds);

      return insertIntegerToByteArray(val, buffer, from, this.size());
    }
  }]);

  return Timespec;
}();

var Decimal = exports.Decimal = function () {
  function Decimal() {
    _classCallCheck(this, Decimal);
  }

  _createClass(Decimal, null, [{
    key: 'size',
    value: function size() {
      return 12;
    }

    /**
     * @param {number|string} value
     * @param {Array} buffer
     * @param {number} from
     * @returns {Array}
     */

  }, {
    key: 'serialize',
    value: function serialize(value, buffer, from) {
      if (typeof value !== 'string') {
        throw new TypeError('Wrong data type is passed as String. String is required');
      }

      var pointIndex = value.indexOf('.');
      buffer[from + 2] = pointIndex > -1 ? value.length - 1 - pointIndex : 0;
      if (pointIndex > -1) {
        value = value.replace('.', '');
      }

      var val = (0, _bigInteger2.default)(value);
      buffer[from + 3] = val.gt(0) ? 0 : 128;
      from += 4;

      val = val.abs();
      if (val.gt(MAX_DECIMAL)) {
        throw new TypeError('Decimal value is out of range');
      }

      return insertIntegerToByteArray(val, buffer, from, this.size());
    }
  }]);

  return Decimal;
}();

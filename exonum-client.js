(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ThinClient = require('./index.js');

window.ThinClient = ThinClient;

},{"./index.js":2}],2:[function(require,module,exports){
// MIT License
//
// Copyright (c) 2016 BitFury Group Limited
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

"use strict";

var sha = require('sha.js');
var nacl = require('tweetnacl');

var ThinClient = function() {
    this.data = [];
};

/**
 * Build array of 8-bit integers based on input data and configuration
 * @param {Object} data
 * @param {Object} configuration
 */
ThinClient.prototype.init = function(data, configuration) {
    this.data = new Array(configuration.size).fill(0);

    for (var i in data) {
        if (!data.hasOwnProperty(i)) {
            continue;
        }

        var config = configuration.fields.find(function(element) {
            return element.name === i;
        });

        switch (config.type) {
            case '&PublicKey':
                this.processHex(this.data, data[i], config);
                break;
            case '&Hash':
                this.processHex(this.data, data[i], config);
                break;
            case '&i64':
                this.processI64(this.data, data[i], config);
                break;
            case '&str':
                this.processString(this.data, data[i], config);
                break;
        }
    }
};

/**
 * Process hexadecimal
 * @param {Array} arr
 * @param {String} hex
 *  hexadecimal
 * @param {Object} config
 */
ThinClient.prototype.processHex = function(arr, hex, config) {
    if (typeof hex !== 'string') {
        console.error('Wrong data type of \'' + config.name + '\'. ' + typeof hex + ' is passed. String is required');
        return false;
    } else if (hex.length > (config.to - config.from) * 2) {
        console.error('\'' + config.name + '\' is too long. Max allowed length is ' + (config.to - config.from) * 2);
        return false;
    }

    for (var i = 0, len = hex.length; i < len; i += 2) {
        if (isNaN(parseInt(hex.substr(i, 2), 16))) {
            console.error('Not possible to get char code of invalid hexadecimal pair in \'' + config.name + '\'');
            return false;
        }
    }

    this.insertHexadecimalToArray(hex, arr, config.from, config.to - 1);
};

/**
 * Process string
 * @param {Array} arr
 * @param {String} str
 *  hexadecimal
 * @param {Object} config
 */
ThinClient.prototype.processString = function(arr, str, config) {
    if (typeof str !== 'string') {
        console.error('Wrong data type of \'' + config.name + '\'. ' + typeof str + ' is passed. String is required');
        return false;
    }

    this.insertNumberToByteArray(arr.length, arr, config.from, config.from + 4);
    this.insertNumberToByteArray(str.length, arr, config.from + 4, config.from + 8);
    this.insertStringToByteArray(str, arr, arr.length, arr.length + str.length - 1);
};

/**
 * Process int64 number
 * @param {Array} arr
 * @param {number} i64
 * @param {Object} config
 */
ThinClient.prototype.processI64 = function(arr, i64, config) {
    if (typeof i64 !== 'number') {
        console.error('Wrong data type of \'' + config.name + '\'. ' + typeof i64 + ' is passed. String is required');
        return false;
    } else if (i64 < 0) {
        console.error('\'' + config.name + '\' should be more of equal to zero.');
        return false;
    } else if (i64 > Number.MAX_SAFE_INTEGER) {
        console.error('\'' + config.name + '\' should be less of equal to ' + Number.MAX_SAFE_INTEGER + '.');
        return false;
    } else if (i64 > 4294967295 && (config.to - config.from) !== 8) {
        console.error('\'' + config.name + '\' segment is wrong length. 8 bytes long is required to store transmitted value.');
        return false;
    }

    this.insertNumberToByteArray(i64, arr, config.from, config.to);
};

/**
 * Convert hexadecimal into array of 8-bit integers and insert to array
 * @param {String} str
 * @param {Array} arr
 * @param {number} from
 * @param {number} to
 */
ThinClient.prototype.insertHexadecimalToArray = function(str, arr, from, to) {
    for (var i = 0, len = str.length; i < len; i += 2) {
        arr[from] = parseInt(str.substr(i, 2), 16);
        from++;

        if (from > to) {
            break;
        }
    }
};

/**
 * Convert integer into array of 8-bit integers and insert to array
 * @param {number} number
 * @param {Array} arr
 * @param {number} from
 * @param {number} to
 */
ThinClient.prototype.insertNumberToByteArray = function(number, arr, from, to) {
    var str = number.toString(16);

    if (str.length < 3) {
        arr[to - 1] = parseInt(str, 16);
        return true;
    }

    for (var i = str.length; i > 0; i -= 2) {
        to--;

        if (i > 1) {
            arr[to] = parseInt(str.substr(i - 2, 2), 16);
        } else {
            arr[to] = parseInt(str.substr(0, 1), 16);
        }

        if (to <= from) {
            break;
        }
    }
};

/**
 * Convert str into array of 8-bit integers and insert to array
 * @param {String} str
 * @param {Array} arr
 * @param {number} from
 * @param {number} to
 */
ThinClient.prototype.insertStringToByteArray = function(str, arr, from, to) {
    var strArr = str.split('');
    for (var i = 0, len = strArr.length; i < len; i++) {
        arr[from] = str[i].charCodeAt(0);
        from++;

        if (from > to) {
            break;
        }
    }
};

/**
 * Convert hexadecimal string into array of 8-bit integers
 * @param {String} str
 *  hexadecimal
 * @returns {Uint8Array}
 */
ThinClient.prototype.hexadecimalToUint8Array = function(str) {
    if (typeof str !== 'string') {
        console.error('Wrong data type of hexadecimal string');
        return new Uint8Array([]);
    }

    var array = [];
    for (var i = 0, len = str.length; i < len; i += 2) {
        array.push(parseInt(str.substr(i, 2), 16));
    }

    return new Uint8Array(array);
};

/**
 * Convert array of 8-bit integers into hexadecimal string
 * @param {Uint8Array} uint8arr
 * @returns {String}
 */
ThinClient.prototype.uint8ArrayToHexadecimal = function(uint8arr) {
    if (!(uint8arr instanceof Uint8Array)) {
        console.error('Wrong data type of array of 8-bit integers');
        return '';
    }

    var str = '';
    for (var i = 0, len = uint8arr.length; i < len; i++) {
        var hex = (uint8arr[i]).toString(16);
        hex = (hex.length === 1) ? '0' + hex : hex;
        str += hex;
    }

    return str.toLowerCase();
};

/**
 * Get SHA256 hash
 * @return {String}
 *  hexadecimal hash
 */
ThinClient.prototype.hash = function() {
    return sha('sha256').update(new Uint8Array(this.data), 'utf8').digest('hex');
};

/**
 * Get ED25519 signature
 * @param {String} secretKey
 *  hexadecimal hash
 * @return {String}
 *  hexadecimal hash
 */
ThinClient.prototype.signature = function(secretKey) {
    if (typeof secretKey !== 'string') {
        console.error('Wrong data type of secretKey. ' + typeof secretKey + ' is passed. String is required');
        return null;
    } else if (secretKey.length !== 128) {
        console.error('\'secretKey\' should be 64 length long');
        return null;
    }

    return this.uint8ArrayToHexadecimal(nacl.sign.detached(new Uint8Array(this.data), this.hexadecimalToUint8Array(secretKey)));
};

module.exports = ThinClient;

},{"sha.js":10,"tweetnacl":17}],3:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],4:[function(require,module,exports){

},{}],5:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"base64-js":3,"ieee754":6,"isarray":8}],6:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],7:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],8:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],9:[function(require,module,exports){
(function (Buffer){
// prototype class for hash functions
function Hash (blockSize, finalSize) {
  this._block = new Buffer(blockSize)
  this._finalSize = finalSize
  this._blockSize = blockSize
  this._len = 0
  this._s = 0
}

Hash.prototype.update = function (data, enc) {
  if (typeof data === 'string') {
    enc = enc || 'utf8'
    data = new Buffer(data, enc)
  }

  var l = this._len += data.length
  var s = this._s || 0
  var f = 0
  var buffer = this._block

  while (s < l) {
    var t = Math.min(data.length, f + this._blockSize - (s % this._blockSize))
    var ch = (t - f)

    for (var i = 0; i < ch; i++) {
      buffer[(s % this._blockSize) + i] = data[i + f]
    }

    s += ch
    f += ch

    if ((s % this._blockSize) === 0) {
      this._update(buffer)
    }
  }
  this._s = s

  return this
}

Hash.prototype.digest = function (enc) {
  // Suppose the length of the message M, in bits, is l
  var l = this._len * 8

  // Append the bit 1 to the end of the message
  this._block[this._len % this._blockSize] = 0x80

  // and then k zero bits, where k is the smallest non-negative solution to the equation (l + 1 + k) === finalSize mod blockSize
  this._block.fill(0, this._len % this._blockSize + 1)

  if (l % (this._blockSize * 8) >= this._finalSize * 8) {
    this._update(this._block)
    this._block.fill(0)
  }

  // to this append the block which is equal to the number l written in binary
  // TODO: handle case where l is > Math.pow(2, 29)
  this._block.writeInt32BE(l, this._blockSize - 4)

  var hash = this._update(this._block) || this._hash()

  return enc ? hash.toString(enc) : hash
}

Hash.prototype._update = function () {
  throw new Error('_update must be implemented by subclass')
}

module.exports = Hash

}).call(this,require("buffer").Buffer)

},{"buffer":5}],10:[function(require,module,exports){
var exports = module.exports = function SHA (algorithm) {
  algorithm = algorithm.toLowerCase()

  var Algorithm = exports[algorithm]
  if (!Algorithm) throw new Error(algorithm + ' is not supported (we accept pull requests)')

  return new Algorithm()
}

exports.sha = require('./sha')
exports.sha1 = require('./sha1')
exports.sha224 = require('./sha224')
exports.sha256 = require('./sha256')
exports.sha384 = require('./sha384')
exports.sha512 = require('./sha512')

},{"./sha":11,"./sha1":12,"./sha224":13,"./sha256":14,"./sha384":15,"./sha512":16}],11:[function(require,module,exports){
(function (Buffer){
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-0, as defined
 * in FIPS PUB 180-1
 * This source code is derived from sha1.js of the same repository.
 * The difference between SHA-0 and SHA-1 is just a bitwise rotate left
 * operation was added.
 */

var inherits = require('inherits')
var Hash = require('./hash')

var K = [
  0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0
]

var W = new Array(80)

function Sha () {
  this.init()
  this._w = W

  Hash.call(this, 64, 56)
}

inherits(Sha, Hash)

Sha.prototype.init = function () {
  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0

  return this
}

function rotl5 (num) {
  return (num << 5) | (num >>> 27)
}

function rotl30 (num) {
  return (num << 30) | (num >>> 2)
}

function ft (s, b, c, d) {
  if (s === 0) return (b & c) | ((~b) & d)
  if (s === 2) return (b & c) | (b & d) | (c & d)
  return b ^ c ^ d
}

Sha.prototype._update = function (M) {
  var W = this._w

  var a = this._a | 0
  var b = this._b | 0
  var c = this._c | 0
  var d = this._d | 0
  var e = this._e | 0

  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4)
  for (; i < 80; ++i) W[i] = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16]

  for (var j = 0; j < 80; ++j) {
    var s = ~~(j / 20)
    var t = (rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s]) | 0

    e = d
    d = c
    c = rotl30(b)
    b = a
    a = t
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
}

Sha.prototype._hash = function () {
  var H = new Buffer(20)

  H.writeInt32BE(this._a | 0, 0)
  H.writeInt32BE(this._b | 0, 4)
  H.writeInt32BE(this._c | 0, 8)
  H.writeInt32BE(this._d | 0, 12)
  H.writeInt32BE(this._e | 0, 16)

  return H
}

module.exports = Sha

}).call(this,require("buffer").Buffer)

},{"./hash":9,"buffer":5,"inherits":7}],12:[function(require,module,exports){
(function (Buffer){
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

var inherits = require('inherits')
var Hash = require('./hash')

var K = [
  0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0
]

var W = new Array(80)

function Sha1 () {
  this.init()
  this._w = W

  Hash.call(this, 64, 56)
}

inherits(Sha1, Hash)

Sha1.prototype.init = function () {
  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0

  return this
}

function rotl1 (num) {
  return (num << 1) | (num >>> 31)
}

function rotl5 (num) {
  return (num << 5) | (num >>> 27)
}

function rotl30 (num) {
  return (num << 30) | (num >>> 2)
}

function ft (s, b, c, d) {
  if (s === 0) return (b & c) | ((~b) & d)
  if (s === 2) return (b & c) | (b & d) | (c & d)
  return b ^ c ^ d
}

Sha1.prototype._update = function (M) {
  var W = this._w

  var a = this._a | 0
  var b = this._b | 0
  var c = this._c | 0
  var d = this._d | 0
  var e = this._e | 0

  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4)
  for (; i < 80; ++i) W[i] = rotl1(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16])

  for (var j = 0; j < 80; ++j) {
    var s = ~~(j / 20)
    var t = (rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s]) | 0

    e = d
    d = c
    c = rotl30(b)
    b = a
    a = t
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
}

Sha1.prototype._hash = function () {
  var H = new Buffer(20)

  H.writeInt32BE(this._a | 0, 0)
  H.writeInt32BE(this._b | 0, 4)
  H.writeInt32BE(this._c | 0, 8)
  H.writeInt32BE(this._d | 0, 12)
  H.writeInt32BE(this._e | 0, 16)

  return H
}

module.exports = Sha1

}).call(this,require("buffer").Buffer)

},{"./hash":9,"buffer":5,"inherits":7}],13:[function(require,module,exports){
(function (Buffer){
/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */

var inherits = require('inherits')
var Sha256 = require('./sha256')
var Hash = require('./hash')

var W = new Array(64)

function Sha224 () {
  this.init()

  this._w = W // new Array(64)

  Hash.call(this, 64, 56)
}

inherits(Sha224, Sha256)

Sha224.prototype.init = function () {
  this._a = 0xc1059ed8
  this._b = 0x367cd507
  this._c = 0x3070dd17
  this._d = 0xf70e5939
  this._e = 0xffc00b31
  this._f = 0x68581511
  this._g = 0x64f98fa7
  this._h = 0xbefa4fa4

  return this
}

Sha224.prototype._hash = function () {
  var H = new Buffer(28)

  H.writeInt32BE(this._a, 0)
  H.writeInt32BE(this._b, 4)
  H.writeInt32BE(this._c, 8)
  H.writeInt32BE(this._d, 12)
  H.writeInt32BE(this._e, 16)
  H.writeInt32BE(this._f, 20)
  H.writeInt32BE(this._g, 24)

  return H
}

module.exports = Sha224

}).call(this,require("buffer").Buffer)

},{"./hash":9,"./sha256":14,"buffer":5,"inherits":7}],14:[function(require,module,exports){
(function (Buffer){
/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */

var inherits = require('inherits')
var Hash = require('./hash')

var K = [
  0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
  0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
  0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
  0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
  0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
  0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
  0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
  0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
  0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
  0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
  0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
  0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
  0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
  0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
  0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
  0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
]

var W = new Array(64)

function Sha256 () {
  this.init()

  this._w = W // new Array(64)

  Hash.call(this, 64, 56)
}

inherits(Sha256, Hash)

Sha256.prototype.init = function () {
  this._a = 0x6a09e667
  this._b = 0xbb67ae85
  this._c = 0x3c6ef372
  this._d = 0xa54ff53a
  this._e = 0x510e527f
  this._f = 0x9b05688c
  this._g = 0x1f83d9ab
  this._h = 0x5be0cd19

  return this
}

function ch (x, y, z) {
  return z ^ (x & (y ^ z))
}

function maj (x, y, z) {
  return (x & y) | (z & (x | y))
}

function sigma0 (x) {
  return (x >>> 2 | x << 30) ^ (x >>> 13 | x << 19) ^ (x >>> 22 | x << 10)
}

function sigma1 (x) {
  return (x >>> 6 | x << 26) ^ (x >>> 11 | x << 21) ^ (x >>> 25 | x << 7)
}

function gamma0 (x) {
  return (x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ (x >>> 3)
}

function gamma1 (x) {
  return (x >>> 17 | x << 15) ^ (x >>> 19 | x << 13) ^ (x >>> 10)
}

Sha256.prototype._update = function (M) {
  var W = this._w

  var a = this._a | 0
  var b = this._b | 0
  var c = this._c | 0
  var d = this._d | 0
  var e = this._e | 0
  var f = this._f | 0
  var g = this._g | 0
  var h = this._h | 0

  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4)
  for (; i < 64; ++i) W[i] = (gamma1(W[i - 2]) + W[i - 7] + gamma0(W[i - 15]) + W[i - 16]) | 0

  for (var j = 0; j < 64; ++j) {
    var T1 = (h + sigma1(e) + ch(e, f, g) + K[j] + W[j]) | 0
    var T2 = (sigma0(a) + maj(a, b, c)) | 0

    h = g
    g = f
    f = e
    e = (d + T1) | 0
    d = c
    c = b
    b = a
    a = (T1 + T2) | 0
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
  this._f = (f + this._f) | 0
  this._g = (g + this._g) | 0
  this._h = (h + this._h) | 0
}

Sha256.prototype._hash = function () {
  var H = new Buffer(32)

  H.writeInt32BE(this._a, 0)
  H.writeInt32BE(this._b, 4)
  H.writeInt32BE(this._c, 8)
  H.writeInt32BE(this._d, 12)
  H.writeInt32BE(this._e, 16)
  H.writeInt32BE(this._f, 20)
  H.writeInt32BE(this._g, 24)
  H.writeInt32BE(this._h, 28)

  return H
}

module.exports = Sha256

}).call(this,require("buffer").Buffer)

},{"./hash":9,"buffer":5,"inherits":7}],15:[function(require,module,exports){
(function (Buffer){
var inherits = require('inherits')
var SHA512 = require('./sha512')
var Hash = require('./hash')

var W = new Array(160)

function Sha384 () {
  this.init()
  this._w = W

  Hash.call(this, 128, 112)
}

inherits(Sha384, SHA512)

Sha384.prototype.init = function () {
  this._ah = 0xcbbb9d5d
  this._bh = 0x629a292a
  this._ch = 0x9159015a
  this._dh = 0x152fecd8
  this._eh = 0x67332667
  this._fh = 0x8eb44a87
  this._gh = 0xdb0c2e0d
  this._hh = 0x47b5481d

  this._al = 0xc1059ed8
  this._bl = 0x367cd507
  this._cl = 0x3070dd17
  this._dl = 0xf70e5939
  this._el = 0xffc00b31
  this._fl = 0x68581511
  this._gl = 0x64f98fa7
  this._hl = 0xbefa4fa4

  return this
}

Sha384.prototype._hash = function () {
  var H = new Buffer(48)

  function writeInt64BE (h, l, offset) {
    H.writeInt32BE(h, offset)
    H.writeInt32BE(l, offset + 4)
  }

  writeInt64BE(this._ah, this._al, 0)
  writeInt64BE(this._bh, this._bl, 8)
  writeInt64BE(this._ch, this._cl, 16)
  writeInt64BE(this._dh, this._dl, 24)
  writeInt64BE(this._eh, this._el, 32)
  writeInt64BE(this._fh, this._fl, 40)

  return H
}

module.exports = Sha384

}).call(this,require("buffer").Buffer)

},{"./hash":9,"./sha512":16,"buffer":5,"inherits":7}],16:[function(require,module,exports){
(function (Buffer){
var inherits = require('inherits')
var Hash = require('./hash')

var K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
]

var W = new Array(160)

function Sha512 () {
  this.init()
  this._w = W

  Hash.call(this, 128, 112)
}

inherits(Sha512, Hash)

Sha512.prototype.init = function () {
  this._ah = 0x6a09e667
  this._bh = 0xbb67ae85
  this._ch = 0x3c6ef372
  this._dh = 0xa54ff53a
  this._eh = 0x510e527f
  this._fh = 0x9b05688c
  this._gh = 0x1f83d9ab
  this._hh = 0x5be0cd19

  this._al = 0xf3bcc908
  this._bl = 0x84caa73b
  this._cl = 0xfe94f82b
  this._dl = 0x5f1d36f1
  this._el = 0xade682d1
  this._fl = 0x2b3e6c1f
  this._gl = 0xfb41bd6b
  this._hl = 0x137e2179

  return this
}

function Ch (x, y, z) {
  return z ^ (x & (y ^ z))
}

function maj (x, y, z) {
  return (x & y) | (z & (x | y))
}

function sigma0 (x, xl) {
  return (x >>> 28 | xl << 4) ^ (xl >>> 2 | x << 30) ^ (xl >>> 7 | x << 25)
}

function sigma1 (x, xl) {
  return (x >>> 14 | xl << 18) ^ (x >>> 18 | xl << 14) ^ (xl >>> 9 | x << 23)
}

function Gamma0 (x, xl) {
  return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ (x >>> 7)
}

function Gamma0l (x, xl) {
  return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ (x >>> 7 | xl << 25)
}

function Gamma1 (x, xl) {
  return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ (x >>> 6)
}

function Gamma1l (x, xl) {
  return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ (x >>> 6 | xl << 26)
}

function getCarry (a, b) {
  return (a >>> 0) < (b >>> 0) ? 1 : 0
}

Sha512.prototype._update = function (M) {
  var W = this._w

  var ah = this._ah | 0
  var bh = this._bh | 0
  var ch = this._ch | 0
  var dh = this._dh | 0
  var eh = this._eh | 0
  var fh = this._fh | 0
  var gh = this._gh | 0
  var hh = this._hh | 0

  var al = this._al | 0
  var bl = this._bl | 0
  var cl = this._cl | 0
  var dl = this._dl | 0
  var el = this._el | 0
  var fl = this._fl | 0
  var gl = this._gl | 0
  var hl = this._hl | 0

  for (var i = 0; i < 32; i += 2) {
    W[i] = M.readInt32BE(i * 4)
    W[i + 1] = M.readInt32BE(i * 4 + 4)
  }
  for (; i < 160; i += 2) {
    var xh = W[i - 15 * 2]
    var xl = W[i - 15 * 2 + 1]
    var gamma0 = Gamma0(xh, xl)
    var gamma0l = Gamma0l(xl, xh)

    xh = W[i - 2 * 2]
    xl = W[i - 2 * 2 + 1]
    var gamma1 = Gamma1(xh, xl)
    var gamma1l = Gamma1l(xl, xh)

    // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
    var Wi7h = W[i - 7 * 2]
    var Wi7l = W[i - 7 * 2 + 1]

    var Wi16h = W[i - 16 * 2]
    var Wi16l = W[i - 16 * 2 + 1]

    var Wil = (gamma0l + Wi7l) | 0
    var Wih = (gamma0 + Wi7h + getCarry(Wil, gamma0l)) | 0
    Wil = (Wil + gamma1l) | 0
    Wih = (Wih + gamma1 + getCarry(Wil, gamma1l)) | 0
    Wil = (Wil + Wi16l) | 0
    Wih = (Wih + Wi16h + getCarry(Wil, Wi16l)) | 0

    W[i] = Wih
    W[i + 1] = Wil
  }

  for (var j = 0; j < 160; j += 2) {
    Wih = W[j]
    Wil = W[j + 1]

    var majh = maj(ah, bh, ch)
    var majl = maj(al, bl, cl)

    var sigma0h = sigma0(ah, al)
    var sigma0l = sigma0(al, ah)
    var sigma1h = sigma1(eh, el)
    var sigma1l = sigma1(el, eh)

    // t1 = h + sigma1 + ch + K[j] + W[j]
    var Kih = K[j]
    var Kil = K[j + 1]

    var chh = Ch(eh, fh, gh)
    var chl = Ch(el, fl, gl)

    var t1l = (hl + sigma1l) | 0
    var t1h = (hh + sigma1h + getCarry(t1l, hl)) | 0
    t1l = (t1l + chl) | 0
    t1h = (t1h + chh + getCarry(t1l, chl)) | 0
    t1l = (t1l + Kil) | 0
    t1h = (t1h + Kih + getCarry(t1l, Kil)) | 0
    t1l = (t1l + Wil) | 0
    t1h = (t1h + Wih + getCarry(t1l, Wil)) | 0

    // t2 = sigma0 + maj
    var t2l = (sigma0l + majl) | 0
    var t2h = (sigma0h + majh + getCarry(t2l, sigma0l)) | 0

    hh = gh
    hl = gl
    gh = fh
    gl = fl
    fh = eh
    fl = el
    el = (dl + t1l) | 0
    eh = (dh + t1h + getCarry(el, dl)) | 0
    dh = ch
    dl = cl
    ch = bh
    cl = bl
    bh = ah
    bl = al
    al = (t1l + t2l) | 0
    ah = (t1h + t2h + getCarry(al, t1l)) | 0
  }

  this._al = (this._al + al) | 0
  this._bl = (this._bl + bl) | 0
  this._cl = (this._cl + cl) | 0
  this._dl = (this._dl + dl) | 0
  this._el = (this._el + el) | 0
  this._fl = (this._fl + fl) | 0
  this._gl = (this._gl + gl) | 0
  this._hl = (this._hl + hl) | 0

  this._ah = (this._ah + ah + getCarry(this._al, al)) | 0
  this._bh = (this._bh + bh + getCarry(this._bl, bl)) | 0
  this._ch = (this._ch + ch + getCarry(this._cl, cl)) | 0
  this._dh = (this._dh + dh + getCarry(this._dl, dl)) | 0
  this._eh = (this._eh + eh + getCarry(this._el, el)) | 0
  this._fh = (this._fh + fh + getCarry(this._fl, fl)) | 0
  this._gh = (this._gh + gh + getCarry(this._gl, gl)) | 0
  this._hh = (this._hh + hh + getCarry(this._hl, hl)) | 0
}

Sha512.prototype._hash = function () {
  var H = new Buffer(64)

  function writeInt64BE (h, l, offset) {
    H.writeInt32BE(h, offset)
    H.writeInt32BE(l, offset + 4)
  }

  writeInt64BE(this._ah, this._al, 0)
  writeInt64BE(this._bh, this._bl, 8)
  writeInt64BE(this._ch, this._cl, 16)
  writeInt64BE(this._dh, this._dl, 24)
  writeInt64BE(this._eh, this._el, 32)
  writeInt64BE(this._fh, this._fl, 40)
  writeInt64BE(this._gh, this._gl, 48)
  writeInt64BE(this._hh, this._hl, 56)

  return H
}

module.exports = Sha512

}).call(this,require("buffer").Buffer)

},{"./hash":9,"buffer":5,"inherits":7}],17:[function(require,module,exports){
(function(nacl) {
'use strict';

// Ported in 2014 by Dmitry Chestnykh and Devi Mandiri.
// Public domain.
//
// Implementation derived from TweetNaCl version 20140427.
// See for details: http://tweetnacl.cr.yp.to/

var gf = function(init) {
  var i, r = new Float64Array(16);
  if (init) for (i = 0; i < init.length; i++) r[i] = init[i];
  return r;
};

//  Pluggable, initialized in high-level API below.
var randombytes = function(/* x, n */) { throw new Error('no PRNG'); };

var _0 = new Uint8Array(16);
var _9 = new Uint8Array(32); _9[0] = 9;

var gf0 = gf(),
    gf1 = gf([1]),
    _121665 = gf([0xdb41, 1]),
    D = gf([0x78a3, 0x1359, 0x4dca, 0x75eb, 0xd8ab, 0x4141, 0x0a4d, 0x0070, 0xe898, 0x7779, 0x4079, 0x8cc7, 0xfe73, 0x2b6f, 0x6cee, 0x5203]),
    D2 = gf([0xf159, 0x26b2, 0x9b94, 0xebd6, 0xb156, 0x8283, 0x149a, 0x00e0, 0xd130, 0xeef3, 0x80f2, 0x198e, 0xfce7, 0x56df, 0xd9dc, 0x2406]),
    X = gf([0xd51a, 0x8f25, 0x2d60, 0xc956, 0xa7b2, 0x9525, 0xc760, 0x692c, 0xdc5c, 0xfdd6, 0xe231, 0xc0a4, 0x53fe, 0xcd6e, 0x36d3, 0x2169]),
    Y = gf([0x6658, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666]),
    I = gf([0xa0b0, 0x4a0e, 0x1b27, 0xc4ee, 0xe478, 0xad2f, 0x1806, 0x2f43, 0xd7a7, 0x3dfb, 0x0099, 0x2b4d, 0xdf0b, 0x4fc1, 0x2480, 0x2b83]);

function ts64(x, i, h, l) {
  x[i]   = (h >> 24) & 0xff;
  x[i+1] = (h >> 16) & 0xff;
  x[i+2] = (h >>  8) & 0xff;
  x[i+3] = h & 0xff;
  x[i+4] = (l >> 24)  & 0xff;
  x[i+5] = (l >> 16)  & 0xff;
  x[i+6] = (l >>  8)  & 0xff;
  x[i+7] = l & 0xff;
}

function vn(x, xi, y, yi, n) {
  var i,d = 0;
  for (i = 0; i < n; i++) d |= x[xi+i]^y[yi+i];
  return (1 & ((d - 1) >>> 8)) - 1;
}

function crypto_verify_16(x, xi, y, yi) {
  return vn(x,xi,y,yi,16);
}

function crypto_verify_32(x, xi, y, yi) {
  return vn(x,xi,y,yi,32);
}

function core_salsa20(o, p, k, c) {
  var j0  = c[ 0] & 0xff | (c[ 1] & 0xff)<<8 | (c[ 2] & 0xff)<<16 | (c[ 3] & 0xff)<<24,
      j1  = k[ 0] & 0xff | (k[ 1] & 0xff)<<8 | (k[ 2] & 0xff)<<16 | (k[ 3] & 0xff)<<24,
      j2  = k[ 4] & 0xff | (k[ 5] & 0xff)<<8 | (k[ 6] & 0xff)<<16 | (k[ 7] & 0xff)<<24,
      j3  = k[ 8] & 0xff | (k[ 9] & 0xff)<<8 | (k[10] & 0xff)<<16 | (k[11] & 0xff)<<24,
      j4  = k[12] & 0xff | (k[13] & 0xff)<<8 | (k[14] & 0xff)<<16 | (k[15] & 0xff)<<24,
      j5  = c[ 4] & 0xff | (c[ 5] & 0xff)<<8 | (c[ 6] & 0xff)<<16 | (c[ 7] & 0xff)<<24,
      j6  = p[ 0] & 0xff | (p[ 1] & 0xff)<<8 | (p[ 2] & 0xff)<<16 | (p[ 3] & 0xff)<<24,
      j7  = p[ 4] & 0xff | (p[ 5] & 0xff)<<8 | (p[ 6] & 0xff)<<16 | (p[ 7] & 0xff)<<24,
      j8  = p[ 8] & 0xff | (p[ 9] & 0xff)<<8 | (p[10] & 0xff)<<16 | (p[11] & 0xff)<<24,
      j9  = p[12] & 0xff | (p[13] & 0xff)<<8 | (p[14] & 0xff)<<16 | (p[15] & 0xff)<<24,
      j10 = c[ 8] & 0xff | (c[ 9] & 0xff)<<8 | (c[10] & 0xff)<<16 | (c[11] & 0xff)<<24,
      j11 = k[16] & 0xff | (k[17] & 0xff)<<8 | (k[18] & 0xff)<<16 | (k[19] & 0xff)<<24,
      j12 = k[20] & 0xff | (k[21] & 0xff)<<8 | (k[22] & 0xff)<<16 | (k[23] & 0xff)<<24,
      j13 = k[24] & 0xff | (k[25] & 0xff)<<8 | (k[26] & 0xff)<<16 | (k[27] & 0xff)<<24,
      j14 = k[28] & 0xff | (k[29] & 0xff)<<8 | (k[30] & 0xff)<<16 | (k[31] & 0xff)<<24,
      j15 = c[12] & 0xff | (c[13] & 0xff)<<8 | (c[14] & 0xff)<<16 | (c[15] & 0xff)<<24;

  var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
      x15 = j15, u;

  for (var i = 0; i < 20; i += 2) {
    u = x0 + x12 | 0;
    x4 ^= u<<7 | u>>>(32-7);
    u = x4 + x0 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x4 | 0;
    x12 ^= u<<13 | u>>>(32-13);
    u = x12 + x8 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x1 | 0;
    x9 ^= u<<7 | u>>>(32-7);
    u = x9 + x5 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x9 | 0;
    x1 ^= u<<13 | u>>>(32-13);
    u = x1 + x13 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x6 | 0;
    x14 ^= u<<7 | u>>>(32-7);
    u = x14 + x10 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x14 | 0;
    x6 ^= u<<13 | u>>>(32-13);
    u = x6 + x2 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x11 | 0;
    x3 ^= u<<7 | u>>>(32-7);
    u = x3 + x15 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x3 | 0;
    x11 ^= u<<13 | u>>>(32-13);
    u = x11 + x7 | 0;
    x15 ^= u<<18 | u>>>(32-18);

    u = x0 + x3 | 0;
    x1 ^= u<<7 | u>>>(32-7);
    u = x1 + x0 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x1 | 0;
    x3 ^= u<<13 | u>>>(32-13);
    u = x3 + x2 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x4 | 0;
    x6 ^= u<<7 | u>>>(32-7);
    u = x6 + x5 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x6 | 0;
    x4 ^= u<<13 | u>>>(32-13);
    u = x4 + x7 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x9 | 0;
    x11 ^= u<<7 | u>>>(32-7);
    u = x11 + x10 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x11 | 0;
    x9 ^= u<<13 | u>>>(32-13);
    u = x9 + x8 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x14 | 0;
    x12 ^= u<<7 | u>>>(32-7);
    u = x12 + x15 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x12 | 0;
    x14 ^= u<<13 | u>>>(32-13);
    u = x14 + x13 | 0;
    x15 ^= u<<18 | u>>>(32-18);
  }
   x0 =  x0 +  j0 | 0;
   x1 =  x1 +  j1 | 0;
   x2 =  x2 +  j2 | 0;
   x3 =  x3 +  j3 | 0;
   x4 =  x4 +  j4 | 0;
   x5 =  x5 +  j5 | 0;
   x6 =  x6 +  j6 | 0;
   x7 =  x7 +  j7 | 0;
   x8 =  x8 +  j8 | 0;
   x9 =  x9 +  j9 | 0;
  x10 = x10 + j10 | 0;
  x11 = x11 + j11 | 0;
  x12 = x12 + j12 | 0;
  x13 = x13 + j13 | 0;
  x14 = x14 + j14 | 0;
  x15 = x15 + j15 | 0;

  o[ 0] = x0 >>>  0 & 0xff;
  o[ 1] = x0 >>>  8 & 0xff;
  o[ 2] = x0 >>> 16 & 0xff;
  o[ 3] = x0 >>> 24 & 0xff;

  o[ 4] = x1 >>>  0 & 0xff;
  o[ 5] = x1 >>>  8 & 0xff;
  o[ 6] = x1 >>> 16 & 0xff;
  o[ 7] = x1 >>> 24 & 0xff;

  o[ 8] = x2 >>>  0 & 0xff;
  o[ 9] = x2 >>>  8 & 0xff;
  o[10] = x2 >>> 16 & 0xff;
  o[11] = x2 >>> 24 & 0xff;

  o[12] = x3 >>>  0 & 0xff;
  o[13] = x3 >>>  8 & 0xff;
  o[14] = x3 >>> 16 & 0xff;
  o[15] = x3 >>> 24 & 0xff;

  o[16] = x4 >>>  0 & 0xff;
  o[17] = x4 >>>  8 & 0xff;
  o[18] = x4 >>> 16 & 0xff;
  o[19] = x4 >>> 24 & 0xff;

  o[20] = x5 >>>  0 & 0xff;
  o[21] = x5 >>>  8 & 0xff;
  o[22] = x5 >>> 16 & 0xff;
  o[23] = x5 >>> 24 & 0xff;

  o[24] = x6 >>>  0 & 0xff;
  o[25] = x6 >>>  8 & 0xff;
  o[26] = x6 >>> 16 & 0xff;
  o[27] = x6 >>> 24 & 0xff;

  o[28] = x7 >>>  0 & 0xff;
  o[29] = x7 >>>  8 & 0xff;
  o[30] = x7 >>> 16 & 0xff;
  o[31] = x7 >>> 24 & 0xff;

  o[32] = x8 >>>  0 & 0xff;
  o[33] = x8 >>>  8 & 0xff;
  o[34] = x8 >>> 16 & 0xff;
  o[35] = x8 >>> 24 & 0xff;

  o[36] = x9 >>>  0 & 0xff;
  o[37] = x9 >>>  8 & 0xff;
  o[38] = x9 >>> 16 & 0xff;
  o[39] = x9 >>> 24 & 0xff;

  o[40] = x10 >>>  0 & 0xff;
  o[41] = x10 >>>  8 & 0xff;
  o[42] = x10 >>> 16 & 0xff;
  o[43] = x10 >>> 24 & 0xff;

  o[44] = x11 >>>  0 & 0xff;
  o[45] = x11 >>>  8 & 0xff;
  o[46] = x11 >>> 16 & 0xff;
  o[47] = x11 >>> 24 & 0xff;

  o[48] = x12 >>>  0 & 0xff;
  o[49] = x12 >>>  8 & 0xff;
  o[50] = x12 >>> 16 & 0xff;
  o[51] = x12 >>> 24 & 0xff;

  o[52] = x13 >>>  0 & 0xff;
  o[53] = x13 >>>  8 & 0xff;
  o[54] = x13 >>> 16 & 0xff;
  o[55] = x13 >>> 24 & 0xff;

  o[56] = x14 >>>  0 & 0xff;
  o[57] = x14 >>>  8 & 0xff;
  o[58] = x14 >>> 16 & 0xff;
  o[59] = x14 >>> 24 & 0xff;

  o[60] = x15 >>>  0 & 0xff;
  o[61] = x15 >>>  8 & 0xff;
  o[62] = x15 >>> 16 & 0xff;
  o[63] = x15 >>> 24 & 0xff;
}

function core_hsalsa20(o,p,k,c) {
  var j0  = c[ 0] & 0xff | (c[ 1] & 0xff)<<8 | (c[ 2] & 0xff)<<16 | (c[ 3] & 0xff)<<24,
      j1  = k[ 0] & 0xff | (k[ 1] & 0xff)<<8 | (k[ 2] & 0xff)<<16 | (k[ 3] & 0xff)<<24,
      j2  = k[ 4] & 0xff | (k[ 5] & 0xff)<<8 | (k[ 6] & 0xff)<<16 | (k[ 7] & 0xff)<<24,
      j3  = k[ 8] & 0xff | (k[ 9] & 0xff)<<8 | (k[10] & 0xff)<<16 | (k[11] & 0xff)<<24,
      j4  = k[12] & 0xff | (k[13] & 0xff)<<8 | (k[14] & 0xff)<<16 | (k[15] & 0xff)<<24,
      j5  = c[ 4] & 0xff | (c[ 5] & 0xff)<<8 | (c[ 6] & 0xff)<<16 | (c[ 7] & 0xff)<<24,
      j6  = p[ 0] & 0xff | (p[ 1] & 0xff)<<8 | (p[ 2] & 0xff)<<16 | (p[ 3] & 0xff)<<24,
      j7  = p[ 4] & 0xff | (p[ 5] & 0xff)<<8 | (p[ 6] & 0xff)<<16 | (p[ 7] & 0xff)<<24,
      j8  = p[ 8] & 0xff | (p[ 9] & 0xff)<<8 | (p[10] & 0xff)<<16 | (p[11] & 0xff)<<24,
      j9  = p[12] & 0xff | (p[13] & 0xff)<<8 | (p[14] & 0xff)<<16 | (p[15] & 0xff)<<24,
      j10 = c[ 8] & 0xff | (c[ 9] & 0xff)<<8 | (c[10] & 0xff)<<16 | (c[11] & 0xff)<<24,
      j11 = k[16] & 0xff | (k[17] & 0xff)<<8 | (k[18] & 0xff)<<16 | (k[19] & 0xff)<<24,
      j12 = k[20] & 0xff | (k[21] & 0xff)<<8 | (k[22] & 0xff)<<16 | (k[23] & 0xff)<<24,
      j13 = k[24] & 0xff | (k[25] & 0xff)<<8 | (k[26] & 0xff)<<16 | (k[27] & 0xff)<<24,
      j14 = k[28] & 0xff | (k[29] & 0xff)<<8 | (k[30] & 0xff)<<16 | (k[31] & 0xff)<<24,
      j15 = c[12] & 0xff | (c[13] & 0xff)<<8 | (c[14] & 0xff)<<16 | (c[15] & 0xff)<<24;

  var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
      x15 = j15, u;

  for (var i = 0; i < 20; i += 2) {
    u = x0 + x12 | 0;
    x4 ^= u<<7 | u>>>(32-7);
    u = x4 + x0 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x4 | 0;
    x12 ^= u<<13 | u>>>(32-13);
    u = x12 + x8 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x1 | 0;
    x9 ^= u<<7 | u>>>(32-7);
    u = x9 + x5 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x9 | 0;
    x1 ^= u<<13 | u>>>(32-13);
    u = x1 + x13 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x6 | 0;
    x14 ^= u<<7 | u>>>(32-7);
    u = x14 + x10 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x14 | 0;
    x6 ^= u<<13 | u>>>(32-13);
    u = x6 + x2 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x11 | 0;
    x3 ^= u<<7 | u>>>(32-7);
    u = x3 + x15 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x3 | 0;
    x11 ^= u<<13 | u>>>(32-13);
    u = x11 + x7 | 0;
    x15 ^= u<<18 | u>>>(32-18);

    u = x0 + x3 | 0;
    x1 ^= u<<7 | u>>>(32-7);
    u = x1 + x0 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x1 | 0;
    x3 ^= u<<13 | u>>>(32-13);
    u = x3 + x2 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x4 | 0;
    x6 ^= u<<7 | u>>>(32-7);
    u = x6 + x5 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x6 | 0;
    x4 ^= u<<13 | u>>>(32-13);
    u = x4 + x7 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x9 | 0;
    x11 ^= u<<7 | u>>>(32-7);
    u = x11 + x10 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x11 | 0;
    x9 ^= u<<13 | u>>>(32-13);
    u = x9 + x8 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x14 | 0;
    x12 ^= u<<7 | u>>>(32-7);
    u = x12 + x15 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x12 | 0;
    x14 ^= u<<13 | u>>>(32-13);
    u = x14 + x13 | 0;
    x15 ^= u<<18 | u>>>(32-18);
  }

  o[ 0] = x0 >>>  0 & 0xff;
  o[ 1] = x0 >>>  8 & 0xff;
  o[ 2] = x0 >>> 16 & 0xff;
  o[ 3] = x0 >>> 24 & 0xff;

  o[ 4] = x5 >>>  0 & 0xff;
  o[ 5] = x5 >>>  8 & 0xff;
  o[ 6] = x5 >>> 16 & 0xff;
  o[ 7] = x5 >>> 24 & 0xff;

  o[ 8] = x10 >>>  0 & 0xff;
  o[ 9] = x10 >>>  8 & 0xff;
  o[10] = x10 >>> 16 & 0xff;
  o[11] = x10 >>> 24 & 0xff;

  o[12] = x15 >>>  0 & 0xff;
  o[13] = x15 >>>  8 & 0xff;
  o[14] = x15 >>> 16 & 0xff;
  o[15] = x15 >>> 24 & 0xff;

  o[16] = x6 >>>  0 & 0xff;
  o[17] = x6 >>>  8 & 0xff;
  o[18] = x6 >>> 16 & 0xff;
  o[19] = x6 >>> 24 & 0xff;

  o[20] = x7 >>>  0 & 0xff;
  o[21] = x7 >>>  8 & 0xff;
  o[22] = x7 >>> 16 & 0xff;
  o[23] = x7 >>> 24 & 0xff;

  o[24] = x8 >>>  0 & 0xff;
  o[25] = x8 >>>  8 & 0xff;
  o[26] = x8 >>> 16 & 0xff;
  o[27] = x8 >>> 24 & 0xff;

  o[28] = x9 >>>  0 & 0xff;
  o[29] = x9 >>>  8 & 0xff;
  o[30] = x9 >>> 16 & 0xff;
  o[31] = x9 >>> 24 & 0xff;
}

function crypto_core_salsa20(out,inp,k,c) {
  core_salsa20(out,inp,k,c);
}

function crypto_core_hsalsa20(out,inp,k,c) {
  core_hsalsa20(out,inp,k,c);
}

var sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
            // "expand 32-byte k"

function crypto_stream_salsa20_xor(c,cpos,m,mpos,b,n,k) {
  var z = new Uint8Array(16), x = new Uint8Array(64);
  var u, i;
  for (i = 0; i < 16; i++) z[i] = 0;
  for (i = 0; i < 8; i++) z[i] = n[i];
  while (b >= 64) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < 64; i++) c[cpos+i] = m[mpos+i] ^ x[i];
    u = 1;
    for (i = 8; i < 16; i++) {
      u = u + (z[i] & 0xff) | 0;
      z[i] = u & 0xff;
      u >>>= 8;
    }
    b -= 64;
    cpos += 64;
    mpos += 64;
  }
  if (b > 0) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < b; i++) c[cpos+i] = m[mpos+i] ^ x[i];
  }
  return 0;
}

function crypto_stream_salsa20(c,cpos,b,n,k) {
  var z = new Uint8Array(16), x = new Uint8Array(64);
  var u, i;
  for (i = 0; i < 16; i++) z[i] = 0;
  for (i = 0; i < 8; i++) z[i] = n[i];
  while (b >= 64) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < 64; i++) c[cpos+i] = x[i];
    u = 1;
    for (i = 8; i < 16; i++) {
      u = u + (z[i] & 0xff) | 0;
      z[i] = u & 0xff;
      u >>>= 8;
    }
    b -= 64;
    cpos += 64;
  }
  if (b > 0) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < b; i++) c[cpos+i] = x[i];
  }
  return 0;
}

function crypto_stream(c,cpos,d,n,k) {
  var s = new Uint8Array(32);
  crypto_core_hsalsa20(s,n,k,sigma);
  var sn = new Uint8Array(8);
  for (var i = 0; i < 8; i++) sn[i] = n[i+16];
  return crypto_stream_salsa20(c,cpos,d,sn,s);
}

function crypto_stream_xor(c,cpos,m,mpos,d,n,k) {
  var s = new Uint8Array(32);
  crypto_core_hsalsa20(s,n,k,sigma);
  var sn = new Uint8Array(8);
  for (var i = 0; i < 8; i++) sn[i] = n[i+16];
  return crypto_stream_salsa20_xor(c,cpos,m,mpos,d,sn,s);
}

/*
* Port of Andrew Moon's Poly1305-donna-16. Public domain.
* https://github.com/floodyberry/poly1305-donna
*/

var poly1305 = function(key) {
  this.buffer = new Uint8Array(16);
  this.r = new Uint16Array(10);
  this.h = new Uint16Array(10);
  this.pad = new Uint16Array(8);
  this.leftover = 0;
  this.fin = 0;

  var t0, t1, t2, t3, t4, t5, t6, t7;

  t0 = key[ 0] & 0xff | (key[ 1] & 0xff) << 8; this.r[0] = ( t0                     ) & 0x1fff;
  t1 = key[ 2] & 0xff | (key[ 3] & 0xff) << 8; this.r[1] = ((t0 >>> 13) | (t1 <<  3)) & 0x1fff;
  t2 = key[ 4] & 0xff | (key[ 5] & 0xff) << 8; this.r[2] = ((t1 >>> 10) | (t2 <<  6)) & 0x1f03;
  t3 = key[ 6] & 0xff | (key[ 7] & 0xff) << 8; this.r[3] = ((t2 >>>  7) | (t3 <<  9)) & 0x1fff;
  t4 = key[ 8] & 0xff | (key[ 9] & 0xff) << 8; this.r[4] = ((t3 >>>  4) | (t4 << 12)) & 0x00ff;
  this.r[5] = ((t4 >>>  1)) & 0x1ffe;
  t5 = key[10] & 0xff | (key[11] & 0xff) << 8; this.r[6] = ((t4 >>> 14) | (t5 <<  2)) & 0x1fff;
  t6 = key[12] & 0xff | (key[13] & 0xff) << 8; this.r[7] = ((t5 >>> 11) | (t6 <<  5)) & 0x1f81;
  t7 = key[14] & 0xff | (key[15] & 0xff) << 8; this.r[8] = ((t6 >>>  8) | (t7 <<  8)) & 0x1fff;
  this.r[9] = ((t7 >>>  5)) & 0x007f;

  this.pad[0] = key[16] & 0xff | (key[17] & 0xff) << 8;
  this.pad[1] = key[18] & 0xff | (key[19] & 0xff) << 8;
  this.pad[2] = key[20] & 0xff | (key[21] & 0xff) << 8;
  this.pad[3] = key[22] & 0xff | (key[23] & 0xff) << 8;
  this.pad[4] = key[24] & 0xff | (key[25] & 0xff) << 8;
  this.pad[5] = key[26] & 0xff | (key[27] & 0xff) << 8;
  this.pad[6] = key[28] & 0xff | (key[29] & 0xff) << 8;
  this.pad[7] = key[30] & 0xff | (key[31] & 0xff) << 8;
};

poly1305.prototype.blocks = function(m, mpos, bytes) {
  var hibit = this.fin ? 0 : (1 << 11);
  var t0, t1, t2, t3, t4, t5, t6, t7, c;
  var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;

  var h0 = this.h[0],
      h1 = this.h[1],
      h2 = this.h[2],
      h3 = this.h[3],
      h4 = this.h[4],
      h5 = this.h[5],
      h6 = this.h[6],
      h7 = this.h[7],
      h8 = this.h[8],
      h9 = this.h[9];

  var r0 = this.r[0],
      r1 = this.r[1],
      r2 = this.r[2],
      r3 = this.r[3],
      r4 = this.r[4],
      r5 = this.r[5],
      r6 = this.r[6],
      r7 = this.r[7],
      r8 = this.r[8],
      r9 = this.r[9];

  while (bytes >= 16) {
    t0 = m[mpos+ 0] & 0xff | (m[mpos+ 1] & 0xff) << 8; h0 += ( t0                     ) & 0x1fff;
    t1 = m[mpos+ 2] & 0xff | (m[mpos+ 3] & 0xff) << 8; h1 += ((t0 >>> 13) | (t1 <<  3)) & 0x1fff;
    t2 = m[mpos+ 4] & 0xff | (m[mpos+ 5] & 0xff) << 8; h2 += ((t1 >>> 10) | (t2 <<  6)) & 0x1fff;
    t3 = m[mpos+ 6] & 0xff | (m[mpos+ 7] & 0xff) << 8; h3 += ((t2 >>>  7) | (t3 <<  9)) & 0x1fff;
    t4 = m[mpos+ 8] & 0xff | (m[mpos+ 9] & 0xff) << 8; h4 += ((t3 >>>  4) | (t4 << 12)) & 0x1fff;
    h5 += ((t4 >>>  1)) & 0x1fff;
    t5 = m[mpos+10] & 0xff | (m[mpos+11] & 0xff) << 8; h6 += ((t4 >>> 14) | (t5 <<  2)) & 0x1fff;
    t6 = m[mpos+12] & 0xff | (m[mpos+13] & 0xff) << 8; h7 += ((t5 >>> 11) | (t6 <<  5)) & 0x1fff;
    t7 = m[mpos+14] & 0xff | (m[mpos+15] & 0xff) << 8; h8 += ((t6 >>>  8) | (t7 <<  8)) & 0x1fff;
    h9 += ((t7 >>> 5)) | hibit;

    c = 0;

    d0 = c;
    d0 += h0 * r0;
    d0 += h1 * (5 * r9);
    d0 += h2 * (5 * r8);
    d0 += h3 * (5 * r7);
    d0 += h4 * (5 * r6);
    c = (d0 >>> 13); d0 &= 0x1fff;
    d0 += h5 * (5 * r5);
    d0 += h6 * (5 * r4);
    d0 += h7 * (5 * r3);
    d0 += h8 * (5 * r2);
    d0 += h9 * (5 * r1);
    c += (d0 >>> 13); d0 &= 0x1fff;

    d1 = c;
    d1 += h0 * r1;
    d1 += h1 * r0;
    d1 += h2 * (5 * r9);
    d1 += h3 * (5 * r8);
    d1 += h4 * (5 * r7);
    c = (d1 >>> 13); d1 &= 0x1fff;
    d1 += h5 * (5 * r6);
    d1 += h6 * (5 * r5);
    d1 += h7 * (5 * r4);
    d1 += h8 * (5 * r3);
    d1 += h9 * (5 * r2);
    c += (d1 >>> 13); d1 &= 0x1fff;

    d2 = c;
    d2 += h0 * r2;
    d2 += h1 * r1;
    d2 += h2 * r0;
    d2 += h3 * (5 * r9);
    d2 += h4 * (5 * r8);
    c = (d2 >>> 13); d2 &= 0x1fff;
    d2 += h5 * (5 * r7);
    d2 += h6 * (5 * r6);
    d2 += h7 * (5 * r5);
    d2 += h8 * (5 * r4);
    d2 += h9 * (5 * r3);
    c += (d2 >>> 13); d2 &= 0x1fff;

    d3 = c;
    d3 += h0 * r3;
    d3 += h1 * r2;
    d3 += h2 * r1;
    d3 += h3 * r0;
    d3 += h4 * (5 * r9);
    c = (d3 >>> 13); d3 &= 0x1fff;
    d3 += h5 * (5 * r8);
    d3 += h6 * (5 * r7);
    d3 += h7 * (5 * r6);
    d3 += h8 * (5 * r5);
    d3 += h9 * (5 * r4);
    c += (d3 >>> 13); d3 &= 0x1fff;

    d4 = c;
    d4 += h0 * r4;
    d4 += h1 * r3;
    d4 += h2 * r2;
    d4 += h3 * r1;
    d4 += h4 * r0;
    c = (d4 >>> 13); d4 &= 0x1fff;
    d4 += h5 * (5 * r9);
    d4 += h6 * (5 * r8);
    d4 += h7 * (5 * r7);
    d4 += h8 * (5 * r6);
    d4 += h9 * (5 * r5);
    c += (d4 >>> 13); d4 &= 0x1fff;

    d5 = c;
    d5 += h0 * r5;
    d5 += h1 * r4;
    d5 += h2 * r3;
    d5 += h3 * r2;
    d5 += h4 * r1;
    c = (d5 >>> 13); d5 &= 0x1fff;
    d5 += h5 * r0;
    d5 += h6 * (5 * r9);
    d5 += h7 * (5 * r8);
    d5 += h8 * (5 * r7);
    d5 += h9 * (5 * r6);
    c += (d5 >>> 13); d5 &= 0x1fff;

    d6 = c;
    d6 += h0 * r6;
    d6 += h1 * r5;
    d6 += h2 * r4;
    d6 += h3 * r3;
    d6 += h4 * r2;
    c = (d6 >>> 13); d6 &= 0x1fff;
    d6 += h5 * r1;
    d6 += h6 * r0;
    d6 += h7 * (5 * r9);
    d6 += h8 * (5 * r8);
    d6 += h9 * (5 * r7);
    c += (d6 >>> 13); d6 &= 0x1fff;

    d7 = c;
    d7 += h0 * r7;
    d7 += h1 * r6;
    d7 += h2 * r5;
    d7 += h3 * r4;
    d7 += h4 * r3;
    c = (d7 >>> 13); d7 &= 0x1fff;
    d7 += h5 * r2;
    d7 += h6 * r1;
    d7 += h7 * r0;
    d7 += h8 * (5 * r9);
    d7 += h9 * (5 * r8);
    c += (d7 >>> 13); d7 &= 0x1fff;

    d8 = c;
    d8 += h0 * r8;
    d8 += h1 * r7;
    d8 += h2 * r6;
    d8 += h3 * r5;
    d8 += h4 * r4;
    c = (d8 >>> 13); d8 &= 0x1fff;
    d8 += h5 * r3;
    d8 += h6 * r2;
    d8 += h7 * r1;
    d8 += h8 * r0;
    d8 += h9 * (5 * r9);
    c += (d8 >>> 13); d8 &= 0x1fff;

    d9 = c;
    d9 += h0 * r9;
    d9 += h1 * r8;
    d9 += h2 * r7;
    d9 += h3 * r6;
    d9 += h4 * r5;
    c = (d9 >>> 13); d9 &= 0x1fff;
    d9 += h5 * r4;
    d9 += h6 * r3;
    d9 += h7 * r2;
    d9 += h8 * r1;
    d9 += h9 * r0;
    c += (d9 >>> 13); d9 &= 0x1fff;

    c = (((c << 2) + c)) | 0;
    c = (c + d0) | 0;
    d0 = c & 0x1fff;
    c = (c >>> 13);
    d1 += c;

    h0 = d0;
    h1 = d1;
    h2 = d2;
    h3 = d3;
    h4 = d4;
    h5 = d5;
    h6 = d6;
    h7 = d7;
    h8 = d8;
    h9 = d9;

    mpos += 16;
    bytes -= 16;
  }
  this.h[0] = h0;
  this.h[1] = h1;
  this.h[2] = h2;
  this.h[3] = h3;
  this.h[4] = h4;
  this.h[5] = h5;
  this.h[6] = h6;
  this.h[7] = h7;
  this.h[8] = h8;
  this.h[9] = h9;
};

poly1305.prototype.finish = function(mac, macpos) {
  var g = new Uint16Array(10);
  var c, mask, f, i;

  if (this.leftover) {
    i = this.leftover;
    this.buffer[i++] = 1;
    for (; i < 16; i++) this.buffer[i] = 0;
    this.fin = 1;
    this.blocks(this.buffer, 0, 16);
  }

  c = this.h[1] >>> 13;
  this.h[1] &= 0x1fff;
  for (i = 2; i < 10; i++) {
    this.h[i] += c;
    c = this.h[i] >>> 13;
    this.h[i] &= 0x1fff;
  }
  this.h[0] += (c * 5);
  c = this.h[0] >>> 13;
  this.h[0] &= 0x1fff;
  this.h[1] += c;
  c = this.h[1] >>> 13;
  this.h[1] &= 0x1fff;
  this.h[2] += c;

  g[0] = this.h[0] + 5;
  c = g[0] >>> 13;
  g[0] &= 0x1fff;
  for (i = 1; i < 10; i++) {
    g[i] = this.h[i] + c;
    c = g[i] >>> 13;
    g[i] &= 0x1fff;
  }
  g[9] -= (1 << 13);

  mask = (c ^ 1) - 1;
  for (i = 0; i < 10; i++) g[i] &= mask;
  mask = ~mask;
  for (i = 0; i < 10; i++) this.h[i] = (this.h[i] & mask) | g[i];

  this.h[0] = ((this.h[0]       ) | (this.h[1] << 13)                    ) & 0xffff;
  this.h[1] = ((this.h[1] >>>  3) | (this.h[2] << 10)                    ) & 0xffff;
  this.h[2] = ((this.h[2] >>>  6) | (this.h[3] <<  7)                    ) & 0xffff;
  this.h[3] = ((this.h[3] >>>  9) | (this.h[4] <<  4)                    ) & 0xffff;
  this.h[4] = ((this.h[4] >>> 12) | (this.h[5] <<  1) | (this.h[6] << 14)) & 0xffff;
  this.h[5] = ((this.h[6] >>>  2) | (this.h[7] << 11)                    ) & 0xffff;
  this.h[6] = ((this.h[7] >>>  5) | (this.h[8] <<  8)                    ) & 0xffff;
  this.h[7] = ((this.h[8] >>>  8) | (this.h[9] <<  5)                    ) & 0xffff;

  f = this.h[0] + this.pad[0];
  this.h[0] = f & 0xffff;
  for (i = 1; i < 8; i++) {
    f = (((this.h[i] + this.pad[i]) | 0) + (f >>> 16)) | 0;
    this.h[i] = f & 0xffff;
  }

  mac[macpos+ 0] = (this.h[0] >>> 0) & 0xff;
  mac[macpos+ 1] = (this.h[0] >>> 8) & 0xff;
  mac[macpos+ 2] = (this.h[1] >>> 0) & 0xff;
  mac[macpos+ 3] = (this.h[1] >>> 8) & 0xff;
  mac[macpos+ 4] = (this.h[2] >>> 0) & 0xff;
  mac[macpos+ 5] = (this.h[2] >>> 8) & 0xff;
  mac[macpos+ 6] = (this.h[3] >>> 0) & 0xff;
  mac[macpos+ 7] = (this.h[3] >>> 8) & 0xff;
  mac[macpos+ 8] = (this.h[4] >>> 0) & 0xff;
  mac[macpos+ 9] = (this.h[4] >>> 8) & 0xff;
  mac[macpos+10] = (this.h[5] >>> 0) & 0xff;
  mac[macpos+11] = (this.h[5] >>> 8) & 0xff;
  mac[macpos+12] = (this.h[6] >>> 0) & 0xff;
  mac[macpos+13] = (this.h[6] >>> 8) & 0xff;
  mac[macpos+14] = (this.h[7] >>> 0) & 0xff;
  mac[macpos+15] = (this.h[7] >>> 8) & 0xff;
};

poly1305.prototype.update = function(m, mpos, bytes) {
  var i, want;

  if (this.leftover) {
    want = (16 - this.leftover);
    if (want > bytes)
      want = bytes;
    for (i = 0; i < want; i++)
      this.buffer[this.leftover + i] = m[mpos+i];
    bytes -= want;
    mpos += want;
    this.leftover += want;
    if (this.leftover < 16)
      return;
    this.blocks(this.buffer, 0, 16);
    this.leftover = 0;
  }

  if (bytes >= 16) {
    want = bytes - (bytes % 16);
    this.blocks(m, mpos, want);
    mpos += want;
    bytes -= want;
  }

  if (bytes) {
    for (i = 0; i < bytes; i++)
      this.buffer[this.leftover + i] = m[mpos+i];
    this.leftover += bytes;
  }
};

function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
  var s = new poly1305(k);
  s.update(m, mpos, n);
  s.finish(out, outpos);
  return 0;
}

function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
  var x = new Uint8Array(16);
  crypto_onetimeauth(x,0,m,mpos,n,k);
  return crypto_verify_16(h,hpos,x,0);
}

function crypto_secretbox(c,m,d,n,k) {
  var i;
  if (d < 32) return -1;
  crypto_stream_xor(c,0,m,0,d,n,k);
  crypto_onetimeauth(c, 16, c, 32, d - 32, c);
  for (i = 0; i < 16; i++) c[i] = 0;
  return 0;
}

function crypto_secretbox_open(m,c,d,n,k) {
  var i;
  var x = new Uint8Array(32);
  if (d < 32) return -1;
  crypto_stream(x,0,32,n,k);
  if (crypto_onetimeauth_verify(c, 16,c, 32,d - 32,x) !== 0) return -1;
  crypto_stream_xor(m,0,c,0,d,n,k);
  for (i = 0; i < 32; i++) m[i] = 0;
  return 0;
}

function set25519(r, a) {
  var i;
  for (i = 0; i < 16; i++) r[i] = a[i]|0;
}

function car25519(o) {
  var i, v, c = 1;
  for (i = 0; i < 16; i++) {
    v = o[i] + c + 65535;
    c = Math.floor(v / 65536);
    o[i] = v - c * 65536;
  }
  o[0] += c-1 + 37 * (c-1);
}

function sel25519(p, q, b) {
  var t, c = ~(b-1);
  for (var i = 0; i < 16; i++) {
    t = c & (p[i] ^ q[i]);
    p[i] ^= t;
    q[i] ^= t;
  }
}

function pack25519(o, n) {
  var i, j, b;
  var m = gf(), t = gf();
  for (i = 0; i < 16; i++) t[i] = n[i];
  car25519(t);
  car25519(t);
  car25519(t);
  for (j = 0; j < 2; j++) {
    m[0] = t[0] - 0xffed;
    for (i = 1; i < 15; i++) {
      m[i] = t[i] - 0xffff - ((m[i-1]>>16) & 1);
      m[i-1] &= 0xffff;
    }
    m[15] = t[15] - 0x7fff - ((m[14]>>16) & 1);
    b = (m[15]>>16) & 1;
    m[14] &= 0xffff;
    sel25519(t, m, 1-b);
  }
  for (i = 0; i < 16; i++) {
    o[2*i] = t[i] & 0xff;
    o[2*i+1] = t[i]>>8;
  }
}

function neq25519(a, b) {
  var c = new Uint8Array(32), d = new Uint8Array(32);
  pack25519(c, a);
  pack25519(d, b);
  return crypto_verify_32(c, 0, d, 0);
}

function par25519(a) {
  var d = new Uint8Array(32);
  pack25519(d, a);
  return d[0] & 1;
}

function unpack25519(o, n) {
  var i;
  for (i = 0; i < 16; i++) o[i] = n[2*i] + (n[2*i+1] << 8);
  o[15] &= 0x7fff;
}

function A(o, a, b) {
  for (var i = 0; i < 16; i++) o[i] = a[i] + b[i];
}

function Z(o, a, b) {
  for (var i = 0; i < 16; i++) o[i] = a[i] - b[i];
}

function M(o, a, b) {
  var v, c,
     t0 = 0,  t1 = 0,  t2 = 0,  t3 = 0,  t4 = 0,  t5 = 0,  t6 = 0,  t7 = 0,
     t8 = 0,  t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0,
    t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0,
    t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0,
    b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3],
    b4 = b[4],
    b5 = b[5],
    b6 = b[6],
    b7 = b[7],
    b8 = b[8],
    b9 = b[9],
    b10 = b[10],
    b11 = b[11],
    b12 = b[12],
    b13 = b[13],
    b14 = b[14],
    b15 = b[15];

  v = a[0];
  t0 += v * b0;
  t1 += v * b1;
  t2 += v * b2;
  t3 += v * b3;
  t4 += v * b4;
  t5 += v * b5;
  t6 += v * b6;
  t7 += v * b7;
  t8 += v * b8;
  t9 += v * b9;
  t10 += v * b10;
  t11 += v * b11;
  t12 += v * b12;
  t13 += v * b13;
  t14 += v * b14;
  t15 += v * b15;
  v = a[1];
  t1 += v * b0;
  t2 += v * b1;
  t3 += v * b2;
  t4 += v * b3;
  t5 += v * b4;
  t6 += v * b5;
  t7 += v * b6;
  t8 += v * b7;
  t9 += v * b8;
  t10 += v * b9;
  t11 += v * b10;
  t12 += v * b11;
  t13 += v * b12;
  t14 += v * b13;
  t15 += v * b14;
  t16 += v * b15;
  v = a[2];
  t2 += v * b0;
  t3 += v * b1;
  t4 += v * b2;
  t5 += v * b3;
  t6 += v * b4;
  t7 += v * b5;
  t8 += v * b6;
  t9 += v * b7;
  t10 += v * b8;
  t11 += v * b9;
  t12 += v * b10;
  t13 += v * b11;
  t14 += v * b12;
  t15 += v * b13;
  t16 += v * b14;
  t17 += v * b15;
  v = a[3];
  t3 += v * b0;
  t4 += v * b1;
  t5 += v * b2;
  t6 += v * b3;
  t7 += v * b4;
  t8 += v * b5;
  t9 += v * b6;
  t10 += v * b7;
  t11 += v * b8;
  t12 += v * b9;
  t13 += v * b10;
  t14 += v * b11;
  t15 += v * b12;
  t16 += v * b13;
  t17 += v * b14;
  t18 += v * b15;
  v = a[4];
  t4 += v * b0;
  t5 += v * b1;
  t6 += v * b2;
  t7 += v * b3;
  t8 += v * b4;
  t9 += v * b5;
  t10 += v * b6;
  t11 += v * b7;
  t12 += v * b8;
  t13 += v * b9;
  t14 += v * b10;
  t15 += v * b11;
  t16 += v * b12;
  t17 += v * b13;
  t18 += v * b14;
  t19 += v * b15;
  v = a[5];
  t5 += v * b0;
  t6 += v * b1;
  t7 += v * b2;
  t8 += v * b3;
  t9 += v * b4;
  t10 += v * b5;
  t11 += v * b6;
  t12 += v * b7;
  t13 += v * b8;
  t14 += v * b9;
  t15 += v * b10;
  t16 += v * b11;
  t17 += v * b12;
  t18 += v * b13;
  t19 += v * b14;
  t20 += v * b15;
  v = a[6];
  t6 += v * b0;
  t7 += v * b1;
  t8 += v * b2;
  t9 += v * b3;
  t10 += v * b4;
  t11 += v * b5;
  t12 += v * b6;
  t13 += v * b7;
  t14 += v * b8;
  t15 += v * b9;
  t16 += v * b10;
  t17 += v * b11;
  t18 += v * b12;
  t19 += v * b13;
  t20 += v * b14;
  t21 += v * b15;
  v = a[7];
  t7 += v * b0;
  t8 += v * b1;
  t9 += v * b2;
  t10 += v * b3;
  t11 += v * b4;
  t12 += v * b5;
  t13 += v * b6;
  t14 += v * b7;
  t15 += v * b8;
  t16 += v * b9;
  t17 += v * b10;
  t18 += v * b11;
  t19 += v * b12;
  t20 += v * b13;
  t21 += v * b14;
  t22 += v * b15;
  v = a[8];
  t8 += v * b0;
  t9 += v * b1;
  t10 += v * b2;
  t11 += v * b3;
  t12 += v * b4;
  t13 += v * b5;
  t14 += v * b6;
  t15 += v * b7;
  t16 += v * b8;
  t17 += v * b9;
  t18 += v * b10;
  t19 += v * b11;
  t20 += v * b12;
  t21 += v * b13;
  t22 += v * b14;
  t23 += v * b15;
  v = a[9];
  t9 += v * b0;
  t10 += v * b1;
  t11 += v * b2;
  t12 += v * b3;
  t13 += v * b4;
  t14 += v * b5;
  t15 += v * b6;
  t16 += v * b7;
  t17 += v * b8;
  t18 += v * b9;
  t19 += v * b10;
  t20 += v * b11;
  t21 += v * b12;
  t22 += v * b13;
  t23 += v * b14;
  t24 += v * b15;
  v = a[10];
  t10 += v * b0;
  t11 += v * b1;
  t12 += v * b2;
  t13 += v * b3;
  t14 += v * b4;
  t15 += v * b5;
  t16 += v * b6;
  t17 += v * b7;
  t18 += v * b8;
  t19 += v * b9;
  t20 += v * b10;
  t21 += v * b11;
  t22 += v * b12;
  t23 += v * b13;
  t24 += v * b14;
  t25 += v * b15;
  v = a[11];
  t11 += v * b0;
  t12 += v * b1;
  t13 += v * b2;
  t14 += v * b3;
  t15 += v * b4;
  t16 += v * b5;
  t17 += v * b6;
  t18 += v * b7;
  t19 += v * b8;
  t20 += v * b9;
  t21 += v * b10;
  t22 += v * b11;
  t23 += v * b12;
  t24 += v * b13;
  t25 += v * b14;
  t26 += v * b15;
  v = a[12];
  t12 += v * b0;
  t13 += v * b1;
  t14 += v * b2;
  t15 += v * b3;
  t16 += v * b4;
  t17 += v * b5;
  t18 += v * b6;
  t19 += v * b7;
  t20 += v * b8;
  t21 += v * b9;
  t22 += v * b10;
  t23 += v * b11;
  t24 += v * b12;
  t25 += v * b13;
  t26 += v * b14;
  t27 += v * b15;
  v = a[13];
  t13 += v * b0;
  t14 += v * b1;
  t15 += v * b2;
  t16 += v * b3;
  t17 += v * b4;
  t18 += v * b5;
  t19 += v * b6;
  t20 += v * b7;
  t21 += v * b8;
  t22 += v * b9;
  t23 += v * b10;
  t24 += v * b11;
  t25 += v * b12;
  t26 += v * b13;
  t27 += v * b14;
  t28 += v * b15;
  v = a[14];
  t14 += v * b0;
  t15 += v * b1;
  t16 += v * b2;
  t17 += v * b3;
  t18 += v * b4;
  t19 += v * b5;
  t20 += v * b6;
  t21 += v * b7;
  t22 += v * b8;
  t23 += v * b9;
  t24 += v * b10;
  t25 += v * b11;
  t26 += v * b12;
  t27 += v * b13;
  t28 += v * b14;
  t29 += v * b15;
  v = a[15];
  t15 += v * b0;
  t16 += v * b1;
  t17 += v * b2;
  t18 += v * b3;
  t19 += v * b4;
  t20 += v * b5;
  t21 += v * b6;
  t22 += v * b7;
  t23 += v * b8;
  t24 += v * b9;
  t25 += v * b10;
  t26 += v * b11;
  t27 += v * b12;
  t28 += v * b13;
  t29 += v * b14;
  t30 += v * b15;

  t0  += 38 * t16;
  t1  += 38 * t17;
  t2  += 38 * t18;
  t3  += 38 * t19;
  t4  += 38 * t20;
  t5  += 38 * t21;
  t6  += 38 * t22;
  t7  += 38 * t23;
  t8  += 38 * t24;
  t9  += 38 * t25;
  t10 += 38 * t26;
  t11 += 38 * t27;
  t12 += 38 * t28;
  t13 += 38 * t29;
  t14 += 38 * t30;
  // t15 left as is

  // first car
  c = 1;
  v =  t0 + c + 65535; c = Math.floor(v / 65536);  t0 = v - c * 65536;
  v =  t1 + c + 65535; c = Math.floor(v / 65536);  t1 = v - c * 65536;
  v =  t2 + c + 65535; c = Math.floor(v / 65536);  t2 = v - c * 65536;
  v =  t3 + c + 65535; c = Math.floor(v / 65536);  t3 = v - c * 65536;
  v =  t4 + c + 65535; c = Math.floor(v / 65536);  t4 = v - c * 65536;
  v =  t5 + c + 65535; c = Math.floor(v / 65536);  t5 = v - c * 65536;
  v =  t6 + c + 65535; c = Math.floor(v / 65536);  t6 = v - c * 65536;
  v =  t7 + c + 65535; c = Math.floor(v / 65536);  t7 = v - c * 65536;
  v =  t8 + c + 65535; c = Math.floor(v / 65536);  t8 = v - c * 65536;
  v =  t9 + c + 65535; c = Math.floor(v / 65536);  t9 = v - c * 65536;
  v = t10 + c + 65535; c = Math.floor(v / 65536); t10 = v - c * 65536;
  v = t11 + c + 65535; c = Math.floor(v / 65536); t11 = v - c * 65536;
  v = t12 + c + 65535; c = Math.floor(v / 65536); t12 = v - c * 65536;
  v = t13 + c + 65535; c = Math.floor(v / 65536); t13 = v - c * 65536;
  v = t14 + c + 65535; c = Math.floor(v / 65536); t14 = v - c * 65536;
  v = t15 + c + 65535; c = Math.floor(v / 65536); t15 = v - c * 65536;
  t0 += c-1 + 37 * (c-1);

  // second car
  c = 1;
  v =  t0 + c + 65535; c = Math.floor(v / 65536);  t0 = v - c * 65536;
  v =  t1 + c + 65535; c = Math.floor(v / 65536);  t1 = v - c * 65536;
  v =  t2 + c + 65535; c = Math.floor(v / 65536);  t2 = v - c * 65536;
  v =  t3 + c + 65535; c = Math.floor(v / 65536);  t3 = v - c * 65536;
  v =  t4 + c + 65535; c = Math.floor(v / 65536);  t4 = v - c * 65536;
  v =  t5 + c + 65535; c = Math.floor(v / 65536);  t5 = v - c * 65536;
  v =  t6 + c + 65535; c = Math.floor(v / 65536);  t6 = v - c * 65536;
  v =  t7 + c + 65535; c = Math.floor(v / 65536);  t7 = v - c * 65536;
  v =  t8 + c + 65535; c = Math.floor(v / 65536);  t8 = v - c * 65536;
  v =  t9 + c + 65535; c = Math.floor(v / 65536);  t9 = v - c * 65536;
  v = t10 + c + 65535; c = Math.floor(v / 65536); t10 = v - c * 65536;
  v = t11 + c + 65535; c = Math.floor(v / 65536); t11 = v - c * 65536;
  v = t12 + c + 65535; c = Math.floor(v / 65536); t12 = v - c * 65536;
  v = t13 + c + 65535; c = Math.floor(v / 65536); t13 = v - c * 65536;
  v = t14 + c + 65535; c = Math.floor(v / 65536); t14 = v - c * 65536;
  v = t15 + c + 65535; c = Math.floor(v / 65536); t15 = v - c * 65536;
  t0 += c-1 + 37 * (c-1);

  o[ 0] = t0;
  o[ 1] = t1;
  o[ 2] = t2;
  o[ 3] = t3;
  o[ 4] = t4;
  o[ 5] = t5;
  o[ 6] = t6;
  o[ 7] = t7;
  o[ 8] = t8;
  o[ 9] = t9;
  o[10] = t10;
  o[11] = t11;
  o[12] = t12;
  o[13] = t13;
  o[14] = t14;
  o[15] = t15;
}

function S(o, a) {
  M(o, a, a);
}

function inv25519(o, i) {
  var c = gf();
  var a;
  for (a = 0; a < 16; a++) c[a] = i[a];
  for (a = 253; a >= 0; a--) {
    S(c, c);
    if(a !== 2 && a !== 4) M(c, c, i);
  }
  for (a = 0; a < 16; a++) o[a] = c[a];
}

function pow2523(o, i) {
  var c = gf();
  var a;
  for (a = 0; a < 16; a++) c[a] = i[a];
  for (a = 250; a >= 0; a--) {
      S(c, c);
      if(a !== 1) M(c, c, i);
  }
  for (a = 0; a < 16; a++) o[a] = c[a];
}

function crypto_scalarmult(q, n, p) {
  var z = new Uint8Array(32);
  var x = new Float64Array(80), r, i;
  var a = gf(), b = gf(), c = gf(),
      d = gf(), e = gf(), f = gf();
  for (i = 0; i < 31; i++) z[i] = n[i];
  z[31]=(n[31]&127)|64;
  z[0]&=248;
  unpack25519(x,p);
  for (i = 0; i < 16; i++) {
    b[i]=x[i];
    d[i]=a[i]=c[i]=0;
  }
  a[0]=d[0]=1;
  for (i=254; i>=0; --i) {
    r=(z[i>>>3]>>>(i&7))&1;
    sel25519(a,b,r);
    sel25519(c,d,r);
    A(e,a,c);
    Z(a,a,c);
    A(c,b,d);
    Z(b,b,d);
    S(d,e);
    S(f,a);
    M(a,c,a);
    M(c,b,e);
    A(e,a,c);
    Z(a,a,c);
    S(b,a);
    Z(c,d,f);
    M(a,c,_121665);
    A(a,a,d);
    M(c,c,a);
    M(a,d,f);
    M(d,b,x);
    S(b,e);
    sel25519(a,b,r);
    sel25519(c,d,r);
  }
  for (i = 0; i < 16; i++) {
    x[i+16]=a[i];
    x[i+32]=c[i];
    x[i+48]=b[i];
    x[i+64]=d[i];
  }
  var x32 = x.subarray(32);
  var x16 = x.subarray(16);
  inv25519(x32,x32);
  M(x16,x16,x32);
  pack25519(q,x16);
  return 0;
}

function crypto_scalarmult_base(q, n) {
  return crypto_scalarmult(q, n, _9);
}

function crypto_box_keypair(y, x) {
  randombytes(x, 32);
  return crypto_scalarmult_base(y, x);
}

function crypto_box_beforenm(k, y, x) {
  var s = new Uint8Array(32);
  crypto_scalarmult(s, x, y);
  return crypto_core_hsalsa20(k, _0, s, sigma);
}

var crypto_box_afternm = crypto_secretbox;
var crypto_box_open_afternm = crypto_secretbox_open;

function crypto_box(c, m, d, n, y, x) {
  var k = new Uint8Array(32);
  crypto_box_beforenm(k, y, x);
  return crypto_box_afternm(c, m, d, n, k);
}

function crypto_box_open(m, c, d, n, y, x) {
  var k = new Uint8Array(32);
  crypto_box_beforenm(k, y, x);
  return crypto_box_open_afternm(m, c, d, n, k);
}

var K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
];

function crypto_hashblocks_hl(hh, hl, m, n) {
  var wh = new Int32Array(16), wl = new Int32Array(16),
      bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7,
      bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7,
      th, tl, i, j, h, l, a, b, c, d;

  var ah0 = hh[0],
      ah1 = hh[1],
      ah2 = hh[2],
      ah3 = hh[3],
      ah4 = hh[4],
      ah5 = hh[5],
      ah6 = hh[6],
      ah7 = hh[7],

      al0 = hl[0],
      al1 = hl[1],
      al2 = hl[2],
      al3 = hl[3],
      al4 = hl[4],
      al5 = hl[5],
      al6 = hl[6],
      al7 = hl[7];

  var pos = 0;
  while (n >= 128) {
    for (i = 0; i < 16; i++) {
      j = 8 * i + pos;
      wh[i] = (m[j+0] << 24) | (m[j+1] << 16) | (m[j+2] << 8) | m[j+3];
      wl[i] = (m[j+4] << 24) | (m[j+5] << 16) | (m[j+6] << 8) | m[j+7];
    }
    for (i = 0; i < 80; i++) {
      bh0 = ah0;
      bh1 = ah1;
      bh2 = ah2;
      bh3 = ah3;
      bh4 = ah4;
      bh5 = ah5;
      bh6 = ah6;
      bh7 = ah7;

      bl0 = al0;
      bl1 = al1;
      bl2 = al2;
      bl3 = al3;
      bl4 = al4;
      bl5 = al5;
      bl6 = al6;
      bl7 = al7;

      // add
      h = ah7;
      l = al7;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      // Sigma1
      h = ((ah4 >>> 14) | (al4 << (32-14))) ^ ((ah4 >>> 18) | (al4 << (32-18))) ^ ((al4 >>> (41-32)) | (ah4 << (32-(41-32))));
      l = ((al4 >>> 14) | (ah4 << (32-14))) ^ ((al4 >>> 18) | (ah4 << (32-18))) ^ ((ah4 >>> (41-32)) | (al4 << (32-(41-32))));

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // Ch
      h = (ah4 & ah5) ^ (~ah4 & ah6);
      l = (al4 & al5) ^ (~al4 & al6);

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // K
      h = K[i*2];
      l = K[i*2+1];

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // w
      h = wh[i%16];
      l = wl[i%16];

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      th = c & 0xffff | d << 16;
      tl = a & 0xffff | b << 16;

      // add
      h = th;
      l = tl;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      // Sigma0
      h = ((ah0 >>> 28) | (al0 << (32-28))) ^ ((al0 >>> (34-32)) | (ah0 << (32-(34-32)))) ^ ((al0 >>> (39-32)) | (ah0 << (32-(39-32))));
      l = ((al0 >>> 28) | (ah0 << (32-28))) ^ ((ah0 >>> (34-32)) | (al0 << (32-(34-32)))) ^ ((ah0 >>> (39-32)) | (al0 << (32-(39-32))));

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // Maj
      h = (ah0 & ah1) ^ (ah0 & ah2) ^ (ah1 & ah2);
      l = (al0 & al1) ^ (al0 & al2) ^ (al1 & al2);

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      bh7 = (c & 0xffff) | (d << 16);
      bl7 = (a & 0xffff) | (b << 16);

      // add
      h = bh3;
      l = bl3;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      h = th;
      l = tl;

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      bh3 = (c & 0xffff) | (d << 16);
      bl3 = (a & 0xffff) | (b << 16);

      ah1 = bh0;
      ah2 = bh1;
      ah3 = bh2;
      ah4 = bh3;
      ah5 = bh4;
      ah6 = bh5;
      ah7 = bh6;
      ah0 = bh7;

      al1 = bl0;
      al2 = bl1;
      al3 = bl2;
      al4 = bl3;
      al5 = bl4;
      al6 = bl5;
      al7 = bl6;
      al0 = bl7;

      if (i%16 === 15) {
        for (j = 0; j < 16; j++) {
          // add
          h = wh[j];
          l = wl[j];

          a = l & 0xffff; b = l >>> 16;
          c = h & 0xffff; d = h >>> 16;

          h = wh[(j+9)%16];
          l = wl[(j+9)%16];

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          // sigma0
          th = wh[(j+1)%16];
          tl = wl[(j+1)%16];
          h = ((th >>> 1) | (tl << (32-1))) ^ ((th >>> 8) | (tl << (32-8))) ^ (th >>> 7);
          l = ((tl >>> 1) | (th << (32-1))) ^ ((tl >>> 8) | (th << (32-8))) ^ ((tl >>> 7) | (th << (32-7)));

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          // sigma1
          th = wh[(j+14)%16];
          tl = wl[(j+14)%16];
          h = ((th >>> 19) | (tl << (32-19))) ^ ((tl >>> (61-32)) | (th << (32-(61-32)))) ^ (th >>> 6);
          l = ((tl >>> 19) | (th << (32-19))) ^ ((th >>> (61-32)) | (tl << (32-(61-32)))) ^ ((tl >>> 6) | (th << (32-6)));

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;

          wh[j] = (c & 0xffff) | (d << 16);
          wl[j] = (a & 0xffff) | (b << 16);
        }
      }
    }

    // add
    h = ah0;
    l = al0;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[0];
    l = hl[0];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[0] = ah0 = (c & 0xffff) | (d << 16);
    hl[0] = al0 = (a & 0xffff) | (b << 16);

    h = ah1;
    l = al1;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[1];
    l = hl[1];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[1] = ah1 = (c & 0xffff) | (d << 16);
    hl[1] = al1 = (a & 0xffff) | (b << 16);

    h = ah2;
    l = al2;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[2];
    l = hl[2];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[2] = ah2 = (c & 0xffff) | (d << 16);
    hl[2] = al2 = (a & 0xffff) | (b << 16);

    h = ah3;
    l = al3;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[3];
    l = hl[3];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[3] = ah3 = (c & 0xffff) | (d << 16);
    hl[3] = al3 = (a & 0xffff) | (b << 16);

    h = ah4;
    l = al4;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[4];
    l = hl[4];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[4] = ah4 = (c & 0xffff) | (d << 16);
    hl[4] = al4 = (a & 0xffff) | (b << 16);

    h = ah5;
    l = al5;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[5];
    l = hl[5];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[5] = ah5 = (c & 0xffff) | (d << 16);
    hl[5] = al5 = (a & 0xffff) | (b << 16);

    h = ah6;
    l = al6;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[6];
    l = hl[6];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[6] = ah6 = (c & 0xffff) | (d << 16);
    hl[6] = al6 = (a & 0xffff) | (b << 16);

    h = ah7;
    l = al7;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[7];
    l = hl[7];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[7] = ah7 = (c & 0xffff) | (d << 16);
    hl[7] = al7 = (a & 0xffff) | (b << 16);

    pos += 128;
    n -= 128;
  }

  return n;
}

function crypto_hash(out, m, n) {
  var hh = new Int32Array(8),
      hl = new Int32Array(8),
      x = new Uint8Array(256),
      i, b = n;

  hh[0] = 0x6a09e667;
  hh[1] = 0xbb67ae85;
  hh[2] = 0x3c6ef372;
  hh[3] = 0xa54ff53a;
  hh[4] = 0x510e527f;
  hh[5] = 0x9b05688c;
  hh[6] = 0x1f83d9ab;
  hh[7] = 0x5be0cd19;

  hl[0] = 0xf3bcc908;
  hl[1] = 0x84caa73b;
  hl[2] = 0xfe94f82b;
  hl[3] = 0x5f1d36f1;
  hl[4] = 0xade682d1;
  hl[5] = 0x2b3e6c1f;
  hl[6] = 0xfb41bd6b;
  hl[7] = 0x137e2179;

  crypto_hashblocks_hl(hh, hl, m, n);
  n %= 128;

  for (i = 0; i < n; i++) x[i] = m[b-n+i];
  x[n] = 128;

  n = 256-128*(n<112?1:0);
  x[n-9] = 0;
  ts64(x, n-8,  (b / 0x20000000) | 0, b << 3);
  crypto_hashblocks_hl(hh, hl, x, n);

  for (i = 0; i < 8; i++) ts64(out, 8*i, hh[i], hl[i]);

  return 0;
}

function add(p, q) {
  var a = gf(), b = gf(), c = gf(),
      d = gf(), e = gf(), f = gf(),
      g = gf(), h = gf(), t = gf();

  Z(a, p[1], p[0]);
  Z(t, q[1], q[0]);
  M(a, a, t);
  A(b, p[0], p[1]);
  A(t, q[0], q[1]);
  M(b, b, t);
  M(c, p[3], q[3]);
  M(c, c, D2);
  M(d, p[2], q[2]);
  A(d, d, d);
  Z(e, b, a);
  Z(f, d, c);
  A(g, d, c);
  A(h, b, a);

  M(p[0], e, f);
  M(p[1], h, g);
  M(p[2], g, f);
  M(p[3], e, h);
}

function cswap(p, q, b) {
  var i;
  for (i = 0; i < 4; i++) {
    sel25519(p[i], q[i], b);
  }
}

function pack(r, p) {
  var tx = gf(), ty = gf(), zi = gf();
  inv25519(zi, p[2]);
  M(tx, p[0], zi);
  M(ty, p[1], zi);
  pack25519(r, ty);
  r[31] ^= par25519(tx) << 7;
}

function scalarmult(p, q, s) {
  var b, i;
  set25519(p[0], gf0);
  set25519(p[1], gf1);
  set25519(p[2], gf1);
  set25519(p[3], gf0);
  for (i = 255; i >= 0; --i) {
    b = (s[(i/8)|0] >> (i&7)) & 1;
    cswap(p, q, b);
    add(q, p);
    add(p, p);
    cswap(p, q, b);
  }
}

function scalarbase(p, s) {
  var q = [gf(), gf(), gf(), gf()];
  set25519(q[0], X);
  set25519(q[1], Y);
  set25519(q[2], gf1);
  M(q[3], X, Y);
  scalarmult(p, q, s);
}

function crypto_sign_keypair(pk, sk, seeded) {
  var d = new Uint8Array(64);
  var p = [gf(), gf(), gf(), gf()];
  var i;

  if (!seeded) randombytes(sk, 32);
  crypto_hash(d, sk, 32);
  d[0] &= 248;
  d[31] &= 127;
  d[31] |= 64;

  scalarbase(p, d);
  pack(pk, p);

  for (i = 0; i < 32; i++) sk[i+32] = pk[i];
  return 0;
}

var L = new Float64Array([0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x10]);

function modL(r, x) {
  var carry, i, j, k;
  for (i = 63; i >= 32; --i) {
    carry = 0;
    for (j = i - 32, k = i - 12; j < k; ++j) {
      x[j] += carry - 16 * x[i] * L[j - (i - 32)];
      carry = (x[j] + 128) >> 8;
      x[j] -= carry * 256;
    }
    x[j] += carry;
    x[i] = 0;
  }
  carry = 0;
  for (j = 0; j < 32; j++) {
    x[j] += carry - (x[31] >> 4) * L[j];
    carry = x[j] >> 8;
    x[j] &= 255;
  }
  for (j = 0; j < 32; j++) x[j] -= carry * L[j];
  for (i = 0; i < 32; i++) {
    x[i+1] += x[i] >> 8;
    r[i] = x[i] & 255;
  }
}

function reduce(r) {
  var x = new Float64Array(64), i;
  for (i = 0; i < 64; i++) x[i] = r[i];
  for (i = 0; i < 64; i++) r[i] = 0;
  modL(r, x);
}

// Note: difference from C - smlen returned, not passed as argument.
function crypto_sign(sm, m, n, sk) {
  var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
  var i, j, x = new Float64Array(64);
  var p = [gf(), gf(), gf(), gf()];

  crypto_hash(d, sk, 32);
  d[0] &= 248;
  d[31] &= 127;
  d[31] |= 64;

  var smlen = n + 64;
  for (i = 0; i < n; i++) sm[64 + i] = m[i];
  for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i];

  crypto_hash(r, sm.subarray(32), n+32);
  reduce(r);
  scalarbase(p, r);
  pack(sm, p);

  for (i = 32; i < 64; i++) sm[i] = sk[i];
  crypto_hash(h, sm, n + 64);
  reduce(h);

  for (i = 0; i < 64; i++) x[i] = 0;
  for (i = 0; i < 32; i++) x[i] = r[i];
  for (i = 0; i < 32; i++) {
    for (j = 0; j < 32; j++) {
      x[i+j] += h[i] * d[j];
    }
  }

  modL(sm.subarray(32), x);
  return smlen;
}

function unpackneg(r, p) {
  var t = gf(), chk = gf(), num = gf(),
      den = gf(), den2 = gf(), den4 = gf(),
      den6 = gf();

  set25519(r[2], gf1);
  unpack25519(r[1], p);
  S(num, r[1]);
  M(den, num, D);
  Z(num, num, r[2]);
  A(den, r[2], den);

  S(den2, den);
  S(den4, den2);
  M(den6, den4, den2);
  M(t, den6, num);
  M(t, t, den);

  pow2523(t, t);
  M(t, t, num);
  M(t, t, den);
  M(t, t, den);
  M(r[0], t, den);

  S(chk, r[0]);
  M(chk, chk, den);
  if (neq25519(chk, num)) M(r[0], r[0], I);

  S(chk, r[0]);
  M(chk, chk, den);
  if (neq25519(chk, num)) return -1;

  if (par25519(r[0]) === (p[31]>>7)) Z(r[0], gf0, r[0]);

  M(r[3], r[0], r[1]);
  return 0;
}

function crypto_sign_open(m, sm, n, pk) {
  var i, mlen;
  var t = new Uint8Array(32), h = new Uint8Array(64);
  var p = [gf(), gf(), gf(), gf()],
      q = [gf(), gf(), gf(), gf()];

  mlen = -1;
  if (n < 64) return -1;

  if (unpackneg(q, pk)) return -1;

  for (i = 0; i < n; i++) m[i] = sm[i];
  for (i = 0; i < 32; i++) m[i+32] = pk[i];
  crypto_hash(h, m, n);
  reduce(h);
  scalarmult(p, q, h);

  scalarbase(q, sm.subarray(32));
  add(p, q);
  pack(t, p);

  n -= 64;
  if (crypto_verify_32(sm, 0, t, 0)) {
    for (i = 0; i < n; i++) m[i] = 0;
    return -1;
  }

  for (i = 0; i < n; i++) m[i] = sm[i + 64];
  mlen = n;
  return mlen;
}

var crypto_secretbox_KEYBYTES = 32,
    crypto_secretbox_NONCEBYTES = 24,
    crypto_secretbox_ZEROBYTES = 32,
    crypto_secretbox_BOXZEROBYTES = 16,
    crypto_scalarmult_BYTES = 32,
    crypto_scalarmult_SCALARBYTES = 32,
    crypto_box_PUBLICKEYBYTES = 32,
    crypto_box_SECRETKEYBYTES = 32,
    crypto_box_BEFORENMBYTES = 32,
    crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES,
    crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES,
    crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES,
    crypto_sign_BYTES = 64,
    crypto_sign_PUBLICKEYBYTES = 32,
    crypto_sign_SECRETKEYBYTES = 64,
    crypto_sign_SEEDBYTES = 32,
    crypto_hash_BYTES = 64;

nacl.lowlevel = {
  crypto_core_hsalsa20: crypto_core_hsalsa20,
  crypto_stream_xor: crypto_stream_xor,
  crypto_stream: crypto_stream,
  crypto_stream_salsa20_xor: crypto_stream_salsa20_xor,
  crypto_stream_salsa20: crypto_stream_salsa20,
  crypto_onetimeauth: crypto_onetimeauth,
  crypto_onetimeauth_verify: crypto_onetimeauth_verify,
  crypto_verify_16: crypto_verify_16,
  crypto_verify_32: crypto_verify_32,
  crypto_secretbox: crypto_secretbox,
  crypto_secretbox_open: crypto_secretbox_open,
  crypto_scalarmult: crypto_scalarmult,
  crypto_scalarmult_base: crypto_scalarmult_base,
  crypto_box_beforenm: crypto_box_beforenm,
  crypto_box_afternm: crypto_box_afternm,
  crypto_box: crypto_box,
  crypto_box_open: crypto_box_open,
  crypto_box_keypair: crypto_box_keypair,
  crypto_hash: crypto_hash,
  crypto_sign: crypto_sign,
  crypto_sign_keypair: crypto_sign_keypair,
  crypto_sign_open: crypto_sign_open,

  crypto_secretbox_KEYBYTES: crypto_secretbox_KEYBYTES,
  crypto_secretbox_NONCEBYTES: crypto_secretbox_NONCEBYTES,
  crypto_secretbox_ZEROBYTES: crypto_secretbox_ZEROBYTES,
  crypto_secretbox_BOXZEROBYTES: crypto_secretbox_BOXZEROBYTES,
  crypto_scalarmult_BYTES: crypto_scalarmult_BYTES,
  crypto_scalarmult_SCALARBYTES: crypto_scalarmult_SCALARBYTES,
  crypto_box_PUBLICKEYBYTES: crypto_box_PUBLICKEYBYTES,
  crypto_box_SECRETKEYBYTES: crypto_box_SECRETKEYBYTES,
  crypto_box_BEFORENMBYTES: crypto_box_BEFORENMBYTES,
  crypto_box_NONCEBYTES: crypto_box_NONCEBYTES,
  crypto_box_ZEROBYTES: crypto_box_ZEROBYTES,
  crypto_box_BOXZEROBYTES: crypto_box_BOXZEROBYTES,
  crypto_sign_BYTES: crypto_sign_BYTES,
  crypto_sign_PUBLICKEYBYTES: crypto_sign_PUBLICKEYBYTES,
  crypto_sign_SECRETKEYBYTES: crypto_sign_SECRETKEYBYTES,
  crypto_sign_SEEDBYTES: crypto_sign_SEEDBYTES,
  crypto_hash_BYTES: crypto_hash_BYTES
};

/* High-level API */

function checkLengths(k, n) {
  if (k.length !== crypto_secretbox_KEYBYTES) throw new Error('bad key size');
  if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error('bad nonce size');
}

function checkBoxLengths(pk, sk) {
  if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error('bad public key size');
  if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error('bad secret key size');
}

function checkArrayTypes() {
  var t, i;
  for (i = 0; i < arguments.length; i++) {
     if ((t = Object.prototype.toString.call(arguments[i])) !== '[object Uint8Array]')
       throw new TypeError('unexpected type ' + t + ', use Uint8Array');
  }
}

function cleanup(arr) {
  for (var i = 0; i < arr.length; i++) arr[i] = 0;
}

// TODO: Completely remove this in v0.15.
if (!nacl.util) {
  nacl.util = {};
  nacl.util.decodeUTF8 = nacl.util.encodeUTF8 = nacl.util.encodeBase64 = nacl.util.decodeBase64 = function() {
    throw new Error('nacl.util moved into separate package: https://github.com/dchest/tweetnacl-util-js');
  };
}

nacl.randomBytes = function(n) {
  var b = new Uint8Array(n);
  randombytes(b, n);
  return b;
};

nacl.secretbox = function(msg, nonce, key) {
  checkArrayTypes(msg, nonce, key);
  checkLengths(key, nonce);
  var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
  var c = new Uint8Array(m.length);
  for (var i = 0; i < msg.length; i++) m[i+crypto_secretbox_ZEROBYTES] = msg[i];
  crypto_secretbox(c, m, m.length, nonce, key);
  return c.subarray(crypto_secretbox_BOXZEROBYTES);
};

nacl.secretbox.open = function(box, nonce, key) {
  checkArrayTypes(box, nonce, key);
  checkLengths(key, nonce);
  var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
  var m = new Uint8Array(c.length);
  for (var i = 0; i < box.length; i++) c[i+crypto_secretbox_BOXZEROBYTES] = box[i];
  if (c.length < 32) return false;
  if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return false;
  return m.subarray(crypto_secretbox_ZEROBYTES);
};

nacl.secretbox.keyLength = crypto_secretbox_KEYBYTES;
nacl.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
nacl.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;

nacl.scalarMult = function(n, p) {
  checkArrayTypes(n, p);
  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
  if (p.length !== crypto_scalarmult_BYTES) throw new Error('bad p size');
  var q = new Uint8Array(crypto_scalarmult_BYTES);
  crypto_scalarmult(q, n, p);
  return q;
};

nacl.scalarMult.base = function(n) {
  checkArrayTypes(n);
  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
  var q = new Uint8Array(crypto_scalarmult_BYTES);
  crypto_scalarmult_base(q, n);
  return q;
};

nacl.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
nacl.scalarMult.groupElementLength = crypto_scalarmult_BYTES;

nacl.box = function(msg, nonce, publicKey, secretKey) {
  var k = nacl.box.before(publicKey, secretKey);
  return nacl.secretbox(msg, nonce, k);
};

nacl.box.before = function(publicKey, secretKey) {
  checkArrayTypes(publicKey, secretKey);
  checkBoxLengths(publicKey, secretKey);
  var k = new Uint8Array(crypto_box_BEFORENMBYTES);
  crypto_box_beforenm(k, publicKey, secretKey);
  return k;
};

nacl.box.after = nacl.secretbox;

nacl.box.open = function(msg, nonce, publicKey, secretKey) {
  var k = nacl.box.before(publicKey, secretKey);
  return nacl.secretbox.open(msg, nonce, k);
};

nacl.box.open.after = nacl.secretbox.open;

nacl.box.keyPair = function() {
  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
  crypto_box_keypair(pk, sk);
  return {publicKey: pk, secretKey: sk};
};

nacl.box.keyPair.fromSecretKey = function(secretKey) {
  checkArrayTypes(secretKey);
  if (secretKey.length !== crypto_box_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
  crypto_scalarmult_base(pk, secretKey);
  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
};

nacl.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
nacl.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
nacl.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
nacl.box.nonceLength = crypto_box_NONCEBYTES;
nacl.box.overheadLength = nacl.secretbox.overheadLength;

nacl.sign = function(msg, secretKey) {
  checkArrayTypes(msg, secretKey);
  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var signedMsg = new Uint8Array(crypto_sign_BYTES+msg.length);
  crypto_sign(signedMsg, msg, msg.length, secretKey);
  return signedMsg;
};

nacl.sign.open = function(signedMsg, publicKey) {
  if (arguments.length !== 2)
    throw new Error('nacl.sign.open accepts 2 arguments; did you mean to use nacl.sign.detached.verify?');
  checkArrayTypes(signedMsg, publicKey);
  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
    throw new Error('bad public key size');
  var tmp = new Uint8Array(signedMsg.length);
  var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
  if (mlen < 0) return null;
  var m = new Uint8Array(mlen);
  for (var i = 0; i < m.length; i++) m[i] = tmp[i];
  return m;
};

nacl.sign.detached = function(msg, secretKey) {
  var signedMsg = nacl.sign(msg, secretKey);
  var sig = new Uint8Array(crypto_sign_BYTES);
  for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
  return sig;
};

nacl.sign.detached.verify = function(msg, sig, publicKey) {
  checkArrayTypes(msg, sig, publicKey);
  if (sig.length !== crypto_sign_BYTES)
    throw new Error('bad signature size');
  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
    throw new Error('bad public key size');
  var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
  var m = new Uint8Array(crypto_sign_BYTES + msg.length);
  var i;
  for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i];
  for (i = 0; i < msg.length; i++) sm[i+crypto_sign_BYTES] = msg[i];
  return (crypto_sign_open(m, sm, sm.length, publicKey) >= 0);
};

nacl.sign.keyPair = function() {
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
  crypto_sign_keypair(pk, sk);
  return {publicKey: pk, secretKey: sk};
};

nacl.sign.keyPair.fromSecretKey = function(secretKey) {
  checkArrayTypes(secretKey);
  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32+i];
  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
};

nacl.sign.keyPair.fromSeed = function(seed) {
  checkArrayTypes(seed);
  if (seed.length !== crypto_sign_SEEDBYTES)
    throw new Error('bad seed size');
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
  for (var i = 0; i < 32; i++) sk[i] = seed[i];
  crypto_sign_keypair(pk, sk, true);
  return {publicKey: pk, secretKey: sk};
};

nacl.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
nacl.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
nacl.sign.seedLength = crypto_sign_SEEDBYTES;
nacl.sign.signatureLength = crypto_sign_BYTES;

nacl.hash = function(msg) {
  checkArrayTypes(msg);
  var h = new Uint8Array(crypto_hash_BYTES);
  crypto_hash(h, msg, msg.length);
  return h;
};

nacl.hash.hashLength = crypto_hash_BYTES;

nacl.verify = function(x, y) {
  checkArrayTypes(x, y);
  // Zero length arguments are considered not equal.
  if (x.length === 0 || y.length === 0) return false;
  if (x.length !== y.length) return false;
  return (vn(x, 0, y, 0, x.length) === 0) ? true : false;
};

nacl.setPRNG = function(fn) {
  randombytes = fn;
};

(function() {
  // Initialize PRNG if environment provides CSPRNG.
  // If not, methods calling randombytes will throw.
  var crypto = typeof self !== 'undefined' ? (self.crypto || self.msCrypto) : null;
  if (crypto && crypto.getRandomValues) {
    // Browsers.
    var QUOTA = 65536;
    nacl.setPRNG(function(x, n) {
      var i, v = new Uint8Array(n);
      for (i = 0; i < n; i += QUOTA) {
        crypto.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
      }
      for (i = 0; i < n; i++) x[i] = v[i];
      cleanup(v);
    });
  } else if (typeof require !== 'undefined') {
    // Node.js.
    crypto = require('crypto');
    if (crypto && crypto.randomBytes) {
      nacl.setPRNG(function(x, n) {
        var i, v = crypto.randomBytes(n);
        for (i = 0; i < n; i++) x[i] = v[i];
        cleanup(v);
      });
    }
  }
})();

})(typeof module !== 'undefined' && module.exports ? module.exports : (self.nacl = self.nacl || {}));

},{"crypto":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyLmpzIiwiaW5kZXguanMiLCJub2RlX21vZHVsZXMvYmFzZTY0LWpzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcmVzb2x2ZS9lbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2lzYXJyYXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc2hhLmpzL2hhc2guanMiLCJub2RlX21vZHVsZXMvc2hhLmpzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3NoYS5qcy9zaGEuanMiLCJub2RlX21vZHVsZXMvc2hhLmpzL3NoYTEuanMiLCJub2RlX21vZHVsZXMvc2hhLmpzL3NoYTIyNC5qcyIsIm5vZGVfbW9kdWxlcy9zaGEuanMvc2hhMjU2LmpzIiwibm9kZV9tb2R1bGVzL3NoYS5qcy9zaGEzODQuanMiLCJub2RlX21vZHVsZXMvc2hhLmpzL3NoYTUxMi5qcyIsIm5vZGVfbW9kdWxlcy90d2VldG5hY2wvbmFjbC1mYXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xIQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzd2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNuUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFRoaW5DbGllbnQgPSByZXF1aXJlKCcuL2luZGV4LmpzJyk7XG5cbndpbmRvdy5UaGluQ2xpZW50ID0gVGhpbkNsaWVudDtcbiIsIi8vIE1JVCBMaWNlbnNlXG4vL1xuLy8gQ29weXJpZ2h0IChjKSAyMDE2IEJpdEZ1cnkgR3JvdXAgTGltaXRlZFxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbi8vIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuLy8gU09GVFdBUkUuXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgc2hhID0gcmVxdWlyZSgnc2hhLmpzJyk7XG52YXIgbmFjbCA9IHJlcXVpcmUoJ3R3ZWV0bmFjbCcpO1xuXG52YXIgVGhpbkNsaWVudCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZGF0YSA9IFtdO1xufTtcblxuLyoqXG4gKiBCdWlsZCBhcnJheSBvZiA4LWJpdCBpbnRlZ2VycyBiYXNlZCBvbiBpbnB1dCBkYXRhIGFuZCBjb25maWd1cmF0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ3VyYXRpb25cbiAqL1xuVGhpbkNsaWVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKGRhdGEsIGNvbmZpZ3VyYXRpb24pIHtcbiAgICB0aGlzLmRhdGEgPSBuZXcgQXJyYXkoY29uZmlndXJhdGlvbi5zaXplKS5maWxsKDApO1xuXG4gICAgZm9yICh2YXIgaSBpbiBkYXRhKSB7XG4gICAgICAgIGlmICghZGF0YS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY29uZmlnID0gY29uZmlndXJhdGlvbi5maWVsZHMuZmluZChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudC5uYW1lID09PSBpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzd2l0Y2ggKGNvbmZpZy50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICcmUHVibGljS2V5JzpcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NIZXgodGhpcy5kYXRhLCBkYXRhW2ldLCBjb25maWcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnJkhhc2gnOlxuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0hleCh0aGlzLmRhdGEsIGRhdGFbaV0sIGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcmaTY0JzpcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NJNjQodGhpcy5kYXRhLCBkYXRhW2ldLCBjb25maWcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnJnN0cic6XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzU3RyaW5nKHRoaXMuZGF0YSwgZGF0YVtpXSwgY29uZmlnKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogUHJvY2VzcyBoZXhhZGVjaW1hbFxuICogQHBhcmFtIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0ge1N0cmluZ30gaGV4XG4gKiAgaGV4YWRlY2ltYWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcbiAqL1xuVGhpbkNsaWVudC5wcm90b3R5cGUucHJvY2Vzc0hleCA9IGZ1bmN0aW9uKGFyciwgaGV4LCBjb25maWcpIHtcbiAgICBpZiAodHlwZW9mIGhleCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignV3JvbmcgZGF0YSB0eXBlIG9mIFxcJycgKyBjb25maWcubmFtZSArICdcXCcuICcgKyB0eXBlb2YgaGV4ICsgJyBpcyBwYXNzZWQuIFN0cmluZyBpcyByZXF1aXJlZCcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChoZXgubGVuZ3RoID4gKGNvbmZpZy50byAtIGNvbmZpZy5mcm9tKSAqIDIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignXFwnJyArIGNvbmZpZy5uYW1lICsgJ1xcJyBpcyB0b28gbG9uZy4gTWF4IGFsbG93ZWQgbGVuZ3RoIGlzICcgKyAoY29uZmlnLnRvIC0gY29uZmlnLmZyb20pICogMik7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gaGV4Lmxlbmd0aDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgICAgIGlmIChpc05hTihwYXJzZUludChoZXguc3Vic3RyKGksIDIpLCAxNikpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdOb3QgcG9zc2libGUgdG8gZ2V0IGNoYXIgY29kZSBvZiBpbnZhbGlkIGhleGFkZWNpbWFsIHBhaXIgaW4gXFwnJyArIGNvbmZpZy5uYW1lICsgJ1xcJycpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5pbnNlcnRIZXhhZGVjaW1hbFRvQXJyYXkoaGV4LCBhcnIsIGNvbmZpZy5mcm9tLCBjb25maWcudG8gLSAxKTtcbn07XG5cbi8qKlxuICogUHJvY2VzcyBzdHJpbmdcbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogIGhleGFkZWNpbWFsXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXG4gKi9cblRoaW5DbGllbnQucHJvdG90eXBlLnByb2Nlc3NTdHJpbmcgPSBmdW5jdGlvbihhcnIsIHN0ciwgY29uZmlnKSB7XG4gICAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1dyb25nIGRhdGEgdHlwZSBvZiBcXCcnICsgY29uZmlnLm5hbWUgKyAnXFwnLiAnICsgdHlwZW9mIHN0ciArICcgaXMgcGFzc2VkLiBTdHJpbmcgaXMgcmVxdWlyZWQnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuaW5zZXJ0TnVtYmVyVG9CeXRlQXJyYXkoYXJyLmxlbmd0aCwgYXJyLCBjb25maWcuZnJvbSwgY29uZmlnLmZyb20gKyA0KTtcbiAgICB0aGlzLmluc2VydE51bWJlclRvQnl0ZUFycmF5KHN0ci5sZW5ndGgsIGFyciwgY29uZmlnLmZyb20gKyA0LCBjb25maWcuZnJvbSArIDgpO1xuICAgIHRoaXMuaW5zZXJ0U3RyaW5nVG9CeXRlQXJyYXkoc3RyLCBhcnIsIGFyci5sZW5ndGgsIGFyci5sZW5ndGggKyBzdHIubGVuZ3RoIC0gMSk7XG59O1xuXG4vKipcbiAqIFByb2Nlc3MgaW50NjQgbnVtYmVyXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqIEBwYXJhbSB7bnVtYmVyfSBpNjRcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcbiAqL1xuVGhpbkNsaWVudC5wcm90b3R5cGUucHJvY2Vzc0k2NCA9IGZ1bmN0aW9uKGFyciwgaTY0LCBjb25maWcpIHtcbiAgICBpZiAodHlwZW9mIGk2NCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignV3JvbmcgZGF0YSB0eXBlIG9mIFxcJycgKyBjb25maWcubmFtZSArICdcXCcuICcgKyB0eXBlb2YgaTY0ICsgJyBpcyBwYXNzZWQuIFN0cmluZyBpcyByZXF1aXJlZCcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChpNjQgPCAwKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1xcJycgKyBjb25maWcubmFtZSArICdcXCcgc2hvdWxkIGJlIG1vcmUgb2YgZXF1YWwgdG8gemVyby4nKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoaTY0ID4gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignXFwnJyArIGNvbmZpZy5uYW1lICsgJ1xcJyBzaG91bGQgYmUgbGVzcyBvZiBlcXVhbCB0byAnICsgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIgKyAnLicpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChpNjQgPiA0Mjk0OTY3Mjk1ICYmIChjb25maWcudG8gLSBjb25maWcuZnJvbSkgIT09IDgpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignXFwnJyArIGNvbmZpZy5uYW1lICsgJ1xcJyBzZWdtZW50IGlzIHdyb25nIGxlbmd0aC4gOCBieXRlcyBsb25nIGlzIHJlcXVpcmVkIHRvIHN0b3JlIHRyYW5zbWl0dGVkIHZhbHVlLicpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5pbnNlcnROdW1iZXJUb0J5dGVBcnJheShpNjQsIGFyciwgY29uZmlnLmZyb20sIGNvbmZpZy50byk7XG59O1xuXG4vKipcbiAqIENvbnZlcnQgaGV4YWRlY2ltYWwgaW50byBhcnJheSBvZiA4LWJpdCBpbnRlZ2VycyBhbmQgaW5zZXJ0IHRvIGFycmF5XG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tXG4gKiBAcGFyYW0ge251bWJlcn0gdG9cbiAqL1xuVGhpbkNsaWVudC5wcm90b3R5cGUuaW5zZXJ0SGV4YWRlY2ltYWxUb0FycmF5ID0gZnVuY3Rpb24oc3RyLCBhcnIsIGZyb20sIHRvKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHN0ci5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMikge1xuICAgICAgICBhcnJbZnJvbV0gPSBwYXJzZUludChzdHIuc3Vic3RyKGksIDIpLCAxNik7XG4gICAgICAgIGZyb20rKztcblxuICAgICAgICBpZiAoZnJvbSA+IHRvKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogQ29udmVydCBpbnRlZ2VyIGludG8gYXJyYXkgb2YgOC1iaXQgaW50ZWdlcnMgYW5kIGluc2VydCB0byBhcnJheVxuICogQHBhcmFtIHtudW1iZXJ9IG51bWJlclxuICogQHBhcmFtIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbVxuICogQHBhcmFtIHtudW1iZXJ9IHRvXG4gKi9cblRoaW5DbGllbnQucHJvdG90eXBlLmluc2VydE51bWJlclRvQnl0ZUFycmF5ID0gZnVuY3Rpb24obnVtYmVyLCBhcnIsIGZyb20sIHRvKSB7XG4gICAgdmFyIHN0ciA9IG51bWJlci50b1N0cmluZygxNik7XG5cbiAgICBpZiAoc3RyLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgYXJyW3RvIC0gMV0gPSBwYXJzZUludChzdHIsIDE2KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IHN0ci5sZW5ndGg7IGkgPiAwOyBpIC09IDIpIHtcbiAgICAgICAgdG8tLTtcblxuICAgICAgICBpZiAoaSA+IDEpIHtcbiAgICAgICAgICAgIGFyclt0b10gPSBwYXJzZUludChzdHIuc3Vic3RyKGkgLSAyLCAyKSwgMTYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXJyW3RvXSA9IHBhcnNlSW50KHN0ci5zdWJzdHIoMCwgMSksIDE2KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0byA8PSBmcm9tKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogQ29udmVydCBzdHIgaW50byBhcnJheSBvZiA4LWJpdCBpbnRlZ2VycyBhbmQgaW5zZXJ0IHRvIGFycmF5XG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tXG4gKiBAcGFyYW0ge251bWJlcn0gdG9cbiAqL1xuVGhpbkNsaWVudC5wcm90b3R5cGUuaW5zZXJ0U3RyaW5nVG9CeXRlQXJyYXkgPSBmdW5jdGlvbihzdHIsIGFyciwgZnJvbSwgdG8pIHtcbiAgICB2YXIgc3RyQXJyID0gc3RyLnNwbGl0KCcnKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc3RyQXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGFycltmcm9tXSA9IHN0cltpXS5jaGFyQ29kZUF0KDApO1xuICAgICAgICBmcm9tKys7XG5cbiAgICAgICAgaWYgKGZyb20gPiB0bykge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIENvbnZlcnQgaGV4YWRlY2ltYWwgc3RyaW5nIGludG8gYXJyYXkgb2YgOC1iaXQgaW50ZWdlcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqICBoZXhhZGVjaW1hbFxuICogQHJldHVybnMge1VpbnQ4QXJyYXl9XG4gKi9cblRoaW5DbGllbnQucHJvdG90eXBlLmhleGFkZWNpbWFsVG9VaW50OEFycmF5ID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1dyb25nIGRhdGEgdHlwZSBvZiBoZXhhZGVjaW1hbCBzdHJpbmcnKTtcbiAgICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KFtdKTtcbiAgICB9XG5cbiAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc3RyLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgICAgIGFycmF5LnB1c2gocGFyc2VJbnQoc3RyLnN1YnN0cihpLCAyKSwgMTYpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoYXJyYXkpO1xufTtcblxuLyoqXG4gKiBDb252ZXJ0IGFycmF5IG9mIDgtYml0IGludGVnZXJzIGludG8gaGV4YWRlY2ltYWwgc3RyaW5nXG4gKiBAcGFyYW0ge1VpbnQ4QXJyYXl9IHVpbnQ4YXJyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5UaGluQ2xpZW50LnByb3RvdHlwZS51aW50OEFycmF5VG9IZXhhZGVjaW1hbCA9IGZ1bmN0aW9uKHVpbnQ4YXJyKSB7XG4gICAgaWYgKCEodWludDhhcnIgaW5zdGFuY2VvZiBVaW50OEFycmF5KSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdXcm9uZyBkYXRhIHR5cGUgb2YgYXJyYXkgb2YgOC1iaXQgaW50ZWdlcnMnKTtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHZhciBzdHIgPSAnJztcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdWludDhhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdmFyIGhleCA9ICh1aW50OGFycltpXSkudG9TdHJpbmcoMTYpO1xuICAgICAgICBoZXggPSAoaGV4Lmxlbmd0aCA9PT0gMSkgPyAnMCcgKyBoZXggOiBoZXg7XG4gICAgICAgIHN0ciArPSBoZXg7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpO1xufTtcblxuLyoqXG4gKiBHZXQgU0hBMjU2IGhhc2hcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqICBoZXhhZGVjaW1hbCBoYXNoXG4gKi9cblRoaW5DbGllbnQucHJvdG90eXBlLmhhc2ggPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2hhKCdzaGEyNTYnKS51cGRhdGUobmV3IFVpbnQ4QXJyYXkodGhpcy5kYXRhKSwgJ3V0ZjgnKS5kaWdlc3QoJ2hleCcpO1xufTtcblxuLyoqXG4gKiBHZXQgRUQyNTUxOSBzaWduYXR1cmVcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWNyZXRLZXlcbiAqICBoZXhhZGVjaW1hbCBoYXNoXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiAgaGV4YWRlY2ltYWwgaGFzaFxuICovXG5UaGluQ2xpZW50LnByb3RvdHlwZS5zaWduYXR1cmUgPSBmdW5jdGlvbihzZWNyZXRLZXkpIHtcbiAgICBpZiAodHlwZW9mIHNlY3JldEtleSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignV3JvbmcgZGF0YSB0eXBlIG9mIHNlY3JldEtleS4gJyArIHR5cGVvZiBzZWNyZXRLZXkgKyAnIGlzIHBhc3NlZC4gU3RyaW5nIGlzIHJlcXVpcmVkJyk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSBpZiAoc2VjcmV0S2V5Lmxlbmd0aCAhPT0gMTI4KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1xcJ3NlY3JldEtleVxcJyBzaG91bGQgYmUgNjQgbGVuZ3RoIGxvbmcnKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudWludDhBcnJheVRvSGV4YWRlY2ltYWwobmFjbC5zaWduLmRldGFjaGVkKG5ldyBVaW50OEFycmF5KHRoaXMuZGF0YSksIHRoaXMuaGV4YWRlY2ltYWxUb1VpbnQ4QXJyYXkoc2VjcmV0S2V5KSkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaGluQ2xpZW50O1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydHMuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcbmV4cG9ydHMudG9CeXRlQXJyYXkgPSB0b0J5dGVBcnJheVxuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gZnJvbUJ5dGVBcnJheVxuXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxuXG52YXIgY29kZSA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJ1xuZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvZGUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgbG9va3VwW2ldID0gY29kZVtpXVxuICByZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXSA9IGlcbn1cblxucmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG5yZXZMb29rdXBbJ18nLmNoYXJDb2RlQXQoMCldID0gNjNcblxuZnVuY3Rpb24gcGxhY2VIb2xkZXJzQ291bnQgKGI2NCkge1xuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuICBpZiAobGVuICUgNCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuICB9XG5cbiAgLy8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcbiAgLy8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuICAvLyByZXByZXNlbnQgb25lIGJ5dGVcbiAgLy8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG4gIC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2VcbiAgcmV0dXJuIGI2NFtsZW4gLSAyXSA9PT0gJz0nID8gMiA6IGI2NFtsZW4gLSAxXSA9PT0gJz0nID8gMSA6IDBcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoYjY0KSB7XG4gIC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuICByZXR1cm4gYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzQ291bnQoYjY0KVxufVxuXG5mdW5jdGlvbiB0b0J5dGVBcnJheSAoYjY0KSB7XG4gIHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG4gIHZhciBsZW4gPSBiNjQubGVuZ3RoXG4gIHBsYWNlSG9sZGVycyA9IHBsYWNlSG9sZGVyc0NvdW50KGI2NClcblxuICBhcnIgPSBuZXcgQXJyKGxlbiAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG4gIC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcbiAgbCA9IHBsYWNlSG9sZGVycyA+IDAgPyBsZW4gLSA0IDogbGVuXG5cbiAgdmFyIEwgPSAwXG5cbiAgZm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDE4KSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCAxMikgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPDwgNikgfCByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDMpXVxuICAgIGFycltMKytdID0gKHRtcCA+PiAxNikgJiAweEZGXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDIpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldID4+IDQpXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTApIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDQpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildID4+IDIpXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuICByZXR1cm4gbG9va3VwW251bSA+PiAxOCAmIDB4M0ZdICsgbG9va3VwW251bSA+PiAxMiAmIDB4M0ZdICsgbG9va3VwW251bSA+PiA2ICYgMHgzRl0gKyBsb29rdXBbbnVtICYgMHgzRl1cbn1cblxuZnVuY3Rpb24gZW5jb2RlQ2h1bmsgKHVpbnQ4LCBzdGFydCwgZW5kKSB7XG4gIHZhciB0bXBcbiAgdmFyIG91dHB1dCA9IFtdXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSArPSAzKSB7XG4gICAgdG1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuICAgIG91dHB1dC5wdXNoKHRyaXBsZXRUb0Jhc2U2NCh0bXApKVxuICB9XG4gIHJldHVybiBvdXRwdXQuam9pbignJylcbn1cblxuZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgb3V0cHV0ID0gJydcbiAgdmFyIHBhcnRzID0gW11cbiAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXG5cbiAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChlbmNvZGVDaHVuayh1aW50OCwgaSwgKGkgKyBtYXhDaHVua0xlbmd0aCkgPiBsZW4yID8gbGVuMiA6IChpICsgbWF4Q2h1bmtMZW5ndGgpKSlcbiAgfVxuXG4gIC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcbiAgaWYgKGV4dHJhQnl0ZXMgPT09IDEpIHtcbiAgICB0bXAgPSB1aW50OFtsZW4gLSAxXVxuICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDJdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gJz09J1xuICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyAodWludDhbbGVuIC0gMV0pXG4gICAgb3V0cHV0ICs9IGxvb2t1cFt0bXAgPj4gMTBdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXVxuICAgIG91dHB1dCArPSAnPSdcbiAgfVxuXG4gIHBhcnRzLnB1c2gob3V0cHV0KVxuXG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKVxufVxuIiwiIiwiLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnaXNhcnJheScpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBTbG93QnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcblxuLyoqXG4gKiBJZiBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgVXNlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiAobW9zdCBjb21wYXRpYmxlLCBldmVuIElFNilcbiAqXG4gKiBCcm93c2VycyB0aGF0IHN1cHBvcnQgdHlwZWQgYXJyYXlzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssIENocm9tZSA3KywgU2FmYXJpIDUuMSssXG4gKiBPcGVyYSAxMS42KywgaU9TIDQuMisuXG4gKlxuICogRHVlIHRvIHZhcmlvdXMgYnJvd3NlciBidWdzLCBzb21ldGltZXMgdGhlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiB3aWxsIGJlIHVzZWQgZXZlblxuICogd2hlbiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0eXBlZCBhcnJheXMuXG4gKlxuICogTm90ZTpcbiAqXG4gKiAgIC0gRmlyZWZveCA0LTI5IGxhY2tzIHN1cHBvcnQgZm9yIGFkZGluZyBuZXcgcHJvcGVydGllcyB0byBgVWludDhBcnJheWAgaW5zdGFuY2VzLFxuICogICAgIFNlZTogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4LlxuICpcbiAqICAgLSBDaHJvbWUgOS0xMCBpcyBtaXNzaW5nIHRoZSBgVHlwZWRBcnJheS5wcm90b3R5cGUuc3ViYXJyYXlgIGZ1bmN0aW9uLlxuICpcbiAqICAgLSBJRTEwIGhhcyBhIGJyb2tlbiBgVHlwZWRBcnJheS5wcm90b3R5cGUuc3ViYXJyYXlgIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYXJyYXlzIG9mXG4gKiAgICAgaW5jb3JyZWN0IGxlbmd0aCBpbiBzb21lIHNpdHVhdGlvbnMuXG5cbiAqIFdlIGRldGVjdCB0aGVzZSBidWdneSBicm93c2VycyBhbmQgc2V0IGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGAgdG8gYGZhbHNlYCBzbyB0aGV5XG4gKiBnZXQgdGhlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiwgd2hpY2ggaXMgc2xvd2VyIGJ1dCBiZWhhdmVzIGNvcnJlY3RseS5cbiAqL1xuQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgPSBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVCAhPT0gdW5kZWZpbmVkXG4gID8gZ2xvYmFsLlRZUEVEX0FSUkFZX1NVUFBPUlRcbiAgOiB0eXBlZEFycmF5U3VwcG9ydCgpXG5cbi8qXG4gKiBFeHBvcnQga01heExlbmd0aCBhZnRlciB0eXBlZCBhcnJheSBzdXBwb3J0IGlzIGRldGVybWluZWQuXG4gKi9cbmV4cG9ydHMua01heExlbmd0aCA9IGtNYXhMZW5ndGgoKVxuXG5mdW5jdGlvbiB0eXBlZEFycmF5U3VwcG9ydCAoKSB7XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KDEpXG4gICAgYXJyLl9fcHJvdG9fXyA9IHtfX3Byb3RvX186IFVpbnQ4QXJyYXkucHJvdG90eXBlLCBmb286IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH19XG4gICAgcmV0dXJuIGFyci5mb28oKSA9PT0gNDIgJiYgLy8gdHlwZWQgYXJyYXkgaW5zdGFuY2VzIGNhbiBiZSBhdWdtZW50ZWRcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAmJiAvLyBjaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgICAgICAgYXJyLnN1YmFycmF5KDEsIDEpLmJ5dGVMZW5ndGggPT09IDAgLy8gaWUxMCBoYXMgYnJva2VuIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmZ1bmN0aW9uIGtNYXhMZW5ndGggKCkge1xuICByZXR1cm4gQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRcbiAgICA/IDB4N2ZmZmZmZmZcbiAgICA6IDB4M2ZmZmZmZmZcbn1cblxuZnVuY3Rpb24gY3JlYXRlQnVmZmVyICh0aGF0LCBsZW5ndGgpIHtcbiAgaWYgKGtNYXhMZW5ndGgoKSA8IGxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHR5cGVkIGFycmF5IGxlbmd0aCcpXG4gIH1cbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UsIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgdGhhdCA9IG5ldyBVaW50OEFycmF5KGxlbmd0aClcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgaWYgKHRoYXQgPT09IG51bGwpIHtcbiAgICAgIHRoYXQgPSBuZXcgQnVmZmVyKGxlbmd0aClcbiAgICB9XG4gICAgdGhhdC5sZW5ndGggPSBsZW5ndGhcbiAgfVxuXG4gIHJldHVybiB0aGF0XG59XG5cbi8qKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBoYXZlIHRoZWlyXG4gKiBwcm90b3R5cGUgY2hhbmdlZCB0byBgQnVmZmVyLnByb3RvdHlwZWAuIEZ1cnRoZXJtb3JlLCBgQnVmZmVyYCBpcyBhIHN1YmNsYXNzIG9mXG4gKiBgVWludDhBcnJheWAsIHNvIHRoZSByZXR1cm5lZCBpbnN0YW5jZXMgd2lsbCBoYXZlIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBtZXRob2RzXG4gKiBhbmQgdGhlIGBVaW50OEFycmF5YCBtZXRob2RzLiBTcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdFxuICogcmV0dXJucyBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBUaGUgYFVpbnQ4QXJyYXlgIHByb3RvdHlwZSByZW1haW5zIHVubW9kaWZpZWQuXG4gKi9cblxuZnVuY3Rpb24gQnVmZmVyIChhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmICEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIC8vIENvbW1vbiBjYXNlLlxuICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAodHlwZW9mIGVuY29kaW5nT3JPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdJZiBlbmNvZGluZyBpcyBzcGVjaWZpZWQgdGhlbiB0aGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZydcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIGFsbG9jVW5zYWZlKHRoaXMsIGFyZylcbiAgfVxuICByZXR1cm4gZnJvbSh0aGlzLCBhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnBvb2xTaXplID0gODE5MiAvLyBub3QgdXNlZCBieSB0aGlzIGltcGxlbWVudGF0aW9uXG5cbi8vIFRPRE86IExlZ2FjeSwgbm90IG5lZWRlZCBhbnltb3JlLiBSZW1vdmUgaW4gbmV4dCBtYWpvciB2ZXJzaW9uLlxuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIGZyb20gKHRoYXQsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXInKVxuICB9XG5cbiAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgIHJldHVybiBmcm9tQXJyYXlCdWZmZXIodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZyb21TdHJpbmcodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQpXG4gIH1cblxuICByZXR1cm4gZnJvbU9iamVjdCh0aGF0LCB2YWx1ZSlcbn1cblxuLyoqXG4gKiBGdW5jdGlvbmFsbHkgZXF1aXZhbGVudCB0byBCdWZmZXIoYXJnLCBlbmNvZGluZykgYnV0IHRocm93cyBhIFR5cGVFcnJvclxuICogaWYgdmFsdWUgaXMgYSBudW1iZXIuXG4gKiBCdWZmZXIuZnJvbShzdHJbLCBlbmNvZGluZ10pXG4gKiBCdWZmZXIuZnJvbShhcnJheSlcbiAqIEJ1ZmZlci5mcm9tKGJ1ZmZlcilcbiAqIEJ1ZmZlci5mcm9tKGFycmF5QnVmZmVyWywgYnl0ZU9mZnNldFssIGxlbmd0aF1dKVxuICoqL1xuQnVmZmVyLmZyb20gPSBmdW5jdGlvbiAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gZnJvbShudWxsLCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5pZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgQnVmZmVyLnByb3RvdHlwZS5fX3Byb3RvX18gPSBVaW50OEFycmF5LnByb3RvdHlwZVxuICBCdWZmZXIuX19wcm90b19fID0gVWludDhBcnJheVxuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnNwZWNpZXMgJiZcbiAgICAgIEJ1ZmZlcltTeW1ib2wuc3BlY2llc10gPT09IEJ1ZmZlcikge1xuICAgIC8vIEZpeCBzdWJhcnJheSgpIGluIEVTMjAxNi4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9wdWxsLzk3XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlciwgU3ltYm9sLnNwZWNpZXMsIHtcbiAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnRTaXplIChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IGJlIGEgbnVtYmVyJylcbiAgfSBlbHNlIGlmIChzaXplIDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBuZWdhdGl2ZScpXG4gIH1cbn1cblxuZnVuY3Rpb24gYWxsb2MgKHRoYXQsIHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgaWYgKHNpemUgPD0gMCkge1xuICAgIHJldHVybiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSlcbiAgfVxuICBpZiAoZmlsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gT25seSBwYXkgYXR0ZW50aW9uIHRvIGVuY29kaW5nIGlmIGl0J3MgYSBzdHJpbmcuIFRoaXNcbiAgICAvLyBwcmV2ZW50cyBhY2NpZGVudGFsbHkgc2VuZGluZyBpbiBhIG51bWJlciB0aGF0IHdvdWxkXG4gICAgLy8gYmUgaW50ZXJwcmV0dGVkIGFzIGEgc3RhcnQgb2Zmc2V0LlxuICAgIHJldHVybiB0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnXG4gICAgICA/IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKS5maWxsKGZpbGwsIGVuY29kaW5nKVxuICAgICAgOiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSkuZmlsbChmaWxsKVxuICB9XG4gIHJldHVybiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSlcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiBhbGxvYyhzaXplWywgZmlsbFssIGVuY29kaW5nXV0pXG4gKiovXG5CdWZmZXIuYWxsb2MgPSBmdW5jdGlvbiAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGFsbG9jKG51bGwsIHNpemUsIGZpbGwsIGVuY29kaW5nKVxufVxuXG5mdW5jdGlvbiBhbGxvY1Vuc2FmZSAodGhhdCwgc2l6ZSkge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSA8IDAgPyAwIDogY2hlY2tlZChzaXplKSB8IDApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7ICsraSkge1xuICAgICAgdGhhdFtpXSA9IDBcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIEJ1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShudWxsLCBzaXplKVxufVxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIFNsb3dCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlU2xvdyA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShudWxsLCBzaXplKVxufVxuXG5mdW5jdGlvbiBmcm9tU3RyaW5nICh0aGF0LCBzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnIHx8IGVuY29kaW5nID09PSAnJykge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gIH1cblxuICBpZiAoIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiZW5jb2RpbmdcIiBtdXN0IGJlIGEgdmFsaWQgc3RyaW5nIGVuY29kaW5nJylcbiAgfVxuXG4gIHZhciBsZW5ndGggPSBieXRlTGVuZ3RoKHN0cmluZywgZW5jb2RpbmcpIHwgMFxuICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbmd0aClcblxuICB2YXIgYWN0dWFsID0gdGhhdC53cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuXG4gIGlmIChhY3R1YWwgIT09IGxlbmd0aCkge1xuICAgIC8vIFdyaXRpbmcgYSBoZXggc3RyaW5nLCBmb3IgZXhhbXBsZSwgdGhhdCBjb250YWlucyBpbnZhbGlkIGNoYXJhY3RlcnMgd2lsbFxuICAgIC8vIGNhdXNlIGV2ZXJ5dGhpbmcgYWZ0ZXIgdGhlIGZpcnN0IGludmFsaWQgY2hhcmFjdGVyIHRvIGJlIGlnbm9yZWQuIChlLmcuXG4gICAgLy8gJ2FieHhjZCcgd2lsbCBiZSB0cmVhdGVkIGFzICdhYicpXG4gICAgdGhhdCA9IHRoYXQuc2xpY2UoMCwgYWN0dWFsKVxuICB9XG5cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5TGlrZSAodGhhdCwgYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCA8IDAgPyAwIDogY2hlY2tlZChhcnJheS5sZW5ndGgpIHwgMFxuICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbmd0aClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgIHRoYXRbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUJ1ZmZlciAodGhhdCwgYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICBhcnJheS5ieXRlTGVuZ3RoIC8vIHRoaXMgdGhyb3dzIGlmIGBhcnJheWAgaXMgbm90IGEgdmFsaWQgQXJyYXlCdWZmZXJcblxuICBpZiAoYnl0ZU9mZnNldCA8IDAgfHwgYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXFwnb2Zmc2V0XFwnIGlzIG91dCBvZiBib3VuZHMnKVxuICB9XG5cbiAgaWYgKGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0ICsgKGxlbmd0aCB8fCAwKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdsZW5ndGhcXCcgaXMgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYnl0ZU9mZnNldCA9PT0gdW5kZWZpbmVkICYmIGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSlcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQpXG4gIH0gZWxzZSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UsIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgdGhhdCA9IGFycmF5XG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIHRoYXQgPSBmcm9tQXJyYXlMaWtlKHRoYXQsIGFycmF5KVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21PYmplY3QgKHRoYXQsIG9iaikge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKG9iaikpIHtcbiAgICB2YXIgbGVuID0gY2hlY2tlZChvYmoubGVuZ3RoKSB8IDBcbiAgICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbilcblxuICAgIGlmICh0aGF0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoYXRcbiAgICB9XG5cbiAgICBvYmouY29weSh0aGF0LCAwLCAwLCBsZW4pXG4gICAgcmV0dXJuIHRoYXRcbiAgfVxuXG4gIGlmIChvYmopIHtcbiAgICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgb2JqLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB8fCAnbGVuZ3RoJyBpbiBvYmopIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ251bWJlcicgfHwgaXNuYW4ob2JqLmxlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCAwKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqKVxuICAgIH1cblxuICAgIGlmIChvYmoudHlwZSA9PT0gJ0J1ZmZlcicgJiYgaXNBcnJheShvYmouZGF0YSkpIHtcbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iai5kYXRhKVxuICAgIH1cbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCBvciBhcnJheS1saWtlIG9iamVjdC4nKVxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwga01heExlbmd0aCgpYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IGtNYXhMZW5ndGgoKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBrTWF4TGVuZ3RoKCkudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZnVuY3Rpb24gU2xvd0J1ZmZlciAobGVuZ3RoKSB7XG4gIGlmICgrbGVuZ3RoICE9IGxlbmd0aCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGVxZXFlcVxuICAgIGxlbmd0aCA9IDBcbiAgfVxuICByZXR1cm4gQnVmZmVyLmFsbG9jKCtsZW5ndGgpXG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIGlzQnVmZmVyIChiKSB7XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihhKSB8fCAhQnVmZmVyLmlzQnVmZmVyKGIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIG11c3QgYmUgQnVmZmVycycpXG4gIH1cblxuICBpZiAoYSA9PT0gYikgcmV0dXJuIDBcblxuICB2YXIgeCA9IGEubGVuZ3RoXG4gIHZhciB5ID0gYi5sZW5ndGhcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gTWF0aC5taW4oeCwgeSk7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSB7XG4gICAgICB4ID0gYVtpXVxuICAgICAgeSA9IGJbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIGlzRW5jb2RpbmcgKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gY29uY2F0IChsaXN0LCBsZW5ndGgpIHtcbiAgaWYgKCFpc0FycmF5KGxpc3QpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBCdWZmZXIuYWxsb2MoMClcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGxlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgICAgbGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZmZlciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShsZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIGJ1ZiA9IGxpc3RbaV1cbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH1cbiAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN0cmluZykpIHtcbiAgICByZXR1cm4gc3RyaW5nLmxlbmd0aFxuICB9XG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBBcnJheUJ1ZmZlci5pc1ZpZXcgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIChBcnJheUJ1ZmZlci5pc1ZpZXcoc3RyaW5nKSB8fCBzdHJpbmcgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikpIHtcbiAgICByZXR1cm4gc3RyaW5nLmJ5dGVMZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcbiAgICBzdHJpbmcgPSAnJyArIHN0cmluZ1xuICB9XG5cbiAgdmFyIGxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKGxlbiA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBVc2UgYSBmb3IgbG9vcCB0byBhdm9pZCByZWN1cnNpb25cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGVuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiBsZW4gKiAyXG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gbGVuID4+PiAxXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGggLy8gYXNzdW1lIHV0ZjhcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuXG5mdW5jdGlvbiBzbG93VG9TdHJpbmcgKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG5cbiAgLy8gTm8gbmVlZCB0byB2ZXJpZnkgdGhhdCBcInRoaXMubGVuZ3RoIDw9IE1BWF9VSU5UMzJcIiBzaW5jZSBpdCdzIGEgcmVhZC1vbmx5XG4gIC8vIHByb3BlcnR5IG9mIGEgdHlwZWQgYXJyYXkuXG5cbiAgLy8gVGhpcyBiZWhhdmVzIG5laXRoZXIgbGlrZSBTdHJpbmcgbm9yIFVpbnQ4QXJyYXkgaW4gdGhhdCB3ZSBzZXQgc3RhcnQvZW5kXG4gIC8vIHRvIHRoZWlyIHVwcGVyL2xvd2VyIGJvdW5kcyBpZiB0aGUgdmFsdWUgcGFzc2VkIGlzIG91dCBvZiByYW5nZS5cbiAgLy8gdW5kZWZpbmVkIGlzIGhhbmRsZWQgc3BlY2lhbGx5IGFzIHBlciBFQ01BLTI2MiA2dGggRWRpdGlvbixcbiAgLy8gU2VjdGlvbiAxMy4zLjMuNyBSdW50aW1lIFNlbWFudGljczogS2V5ZWRCaW5kaW5nSW5pdGlhbGl6YXRpb24uXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkIHx8IHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIC8vIFJldHVybiBlYXJseSBpZiBzdGFydCA+IHRoaXMubGVuZ3RoLiBEb25lIGhlcmUgdG8gcHJldmVudCBwb3RlbnRpYWwgdWludDMyXG4gIC8vIGNvZXJjaW9uIGZhaWwgYmVsb3cuXG4gIGlmIChzdGFydCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKGVuZCA8PSAwKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICAvLyBGb3JjZSBjb2Vyc2lvbiB0byB1aW50MzIuIFRoaXMgd2lsbCBhbHNvIGNvZXJjZSBmYWxzZXkvTmFOIHZhbHVlcyB0byAwLlxuICBlbmQgPj4+PSAwXG4gIHN0YXJ0ID4+Pj0gMFxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdXRmMTZsZVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9IChlbmNvZGluZyArICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG4vLyBUaGUgcHJvcGVydHkgaXMgdXNlZCBieSBgQnVmZmVyLmlzQnVmZmVyYCBhbmQgYGlzLWJ1ZmZlcmAgKGluIFNhZmFyaSA1LTcpIHRvIGRldGVjdFxuLy8gQnVmZmVyIGluc3RhbmNlcy5cbkJ1ZmZlci5wcm90b3R5cGUuX2lzQnVmZmVyID0gdHJ1ZVxuXG5mdW5jdGlvbiBzd2FwIChiLCBuLCBtKSB7XG4gIHZhciBpID0gYltuXVxuICBiW25dID0gYlttXVxuICBiW21dID0gaVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAxNiA9IGZ1bmN0aW9uIHN3YXAxNiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgMiAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMTYtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDEpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMzIgPSBmdW5jdGlvbiBzd2FwMzIgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDQgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDMyLWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDQpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAzKVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyAyKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDY0ID0gZnVuY3Rpb24gc3dhcDY0ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA4ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA2NC1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA4KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgNylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgNilcbiAgICBzd2FwKHRoaXMsIGkgKyAyLCBpICsgNSlcbiAgICBzd2FwKHRoaXMsIGkgKyAzLCBpICsgNClcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGggfCAwXG4gIGlmIChsZW5ndGggPT09IDApIHJldHVybiAnJ1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCAwLCBsZW5ndGgpXG4gIHJldHVybiBzbG93VG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyAoYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIGlmICh0aGlzID09PSBiKSByZXR1cm4gdHJ1ZVxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYikgPT09IDBcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gIHZhciBzdHIgPSAnJ1xuICB2YXIgbWF4ID0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFU1xuICBpZiAodGhpcy5sZW5ndGggPiAwKSB7XG4gICAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5tYXRjaCgvLnsyfS9nKS5qb2luKCcgJylcbiAgICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAodGFyZ2V0LCBzdGFydCwgZW5kLCB0aGlzU3RhcnQsIHRoaXNFbmQpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICB9XG5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSB0YXJnZXQgPyB0YXJnZXQubGVuZ3RoIDogMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNTdGFydCA9IDBcbiAgfVxuICBpZiAodGhpc0VuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc0VuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoc3RhcnQgPCAwIHx8IGVuZCA+IHRhcmdldC5sZW5ndGggfHwgdGhpc1N0YXJ0IDwgMCB8fCB0aGlzRW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCAmJiBzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCkge1xuICAgIHJldHVybiAtMVxuICB9XG4gIGlmIChzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMVxuICB9XG5cbiAgc3RhcnQgPj4+PSAwXG4gIGVuZCA+Pj49IDBcbiAgdGhpc1N0YXJ0ID4+Pj0gMFxuICB0aGlzRW5kID4+Pj0gMFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQpIHJldHVybiAwXG5cbiAgdmFyIHggPSB0aGlzRW5kIC0gdGhpc1N0YXJ0XG4gIHZhciB5ID0gZW5kIC0gc3RhcnRcbiAgdmFyIGxlbiA9IE1hdGgubWluKHgsIHkpXG5cbiAgdmFyIHRoaXNDb3B5ID0gdGhpcy5zbGljZSh0aGlzU3RhcnQsIHRoaXNFbmQpXG4gIHZhciB0YXJnZXRDb3B5ID0gdGFyZ2V0LnNsaWNlKHN0YXJ0LCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIGlmICh0aGlzQ29weVtpXSAhPT0gdGFyZ2V0Q29weVtpXSkge1xuICAgICAgeCA9IHRoaXNDb3B5W2ldXG4gICAgICB5ID0gdGFyZ2V0Q29weVtpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbi8vIEZpbmRzIGVpdGhlciB0aGUgZmlyc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0ID49IGBieXRlT2Zmc2V0YCxcbi8vIE9SIHRoZSBsYXN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA8PSBgYnl0ZU9mZnNldGAuXG4vL1xuLy8gQXJndW1lbnRzOlxuLy8gLSBidWZmZXIgLSBhIEJ1ZmZlciB0byBzZWFyY2hcbi8vIC0gdmFsIC0gYSBzdHJpbmcsIEJ1ZmZlciwgb3IgbnVtYmVyXG4vLyAtIGJ5dGVPZmZzZXQgLSBhbiBpbmRleCBpbnRvIGBidWZmZXJgOyB3aWxsIGJlIGNsYW1wZWQgdG8gYW4gaW50MzJcbi8vIC0gZW5jb2RpbmcgLSBhbiBvcHRpb25hbCBlbmNvZGluZywgcmVsZXZhbnQgaXMgdmFsIGlzIGEgc3RyaW5nXG4vLyAtIGRpciAtIHRydWUgZm9yIGluZGV4T2YsIGZhbHNlIGZvciBsYXN0SW5kZXhPZlxuZnVuY3Rpb24gYmlkaXJlY3Rpb25hbEluZGV4T2YgKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIC8vIEVtcHR5IGJ1ZmZlciBtZWFucyBubyBtYXRjaFxuICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xXG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXRcbiAgaWYgKHR5cGVvZiBieXRlT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gYnl0ZU9mZnNldFxuICAgIGJ5dGVPZmZzZXQgPSAwXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA+IDB4N2ZmZmZmZmYpIHtcbiAgICBieXRlT2Zmc2V0ID0gMHg3ZmZmZmZmZlxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAtMHg4MDAwMDAwMCkge1xuICAgIGJ5dGVPZmZzZXQgPSAtMHg4MDAwMDAwMFxuICB9XG4gIGJ5dGVPZmZzZXQgPSArYnl0ZU9mZnNldCAgLy8gQ29lcmNlIHRvIE51bWJlci5cbiAgaWYgKGlzTmFOKGJ5dGVPZmZzZXQpKSB7XG4gICAgLy8gYnl0ZU9mZnNldDogaXQgaXQncyB1bmRlZmluZWQsIG51bGwsIE5hTiwgXCJmb29cIiwgZXRjLCBzZWFyY2ggd2hvbGUgYnVmZmVyXG4gICAgYnl0ZU9mZnNldCA9IGRpciA/IDAgOiAoYnVmZmVyLmxlbmd0aCAtIDEpXG4gIH1cblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldDogbmVnYXRpdmUgb2Zmc2V0cyBzdGFydCBmcm9tIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclxuICBpZiAoYnl0ZU9mZnNldCA8IDApIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoICsgYnl0ZU9mZnNldFxuICBpZiAoYnl0ZU9mZnNldCA+PSBidWZmZXIubGVuZ3RoKSB7XG4gICAgaWYgKGRpcikgcmV0dXJuIC0xXG4gICAgZWxzZSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCAtIDFcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgMCkge1xuICAgIGlmIChkaXIpIGJ5dGVPZmZzZXQgPSAwXG4gICAgZWxzZSByZXR1cm4gLTFcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSB2YWxcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsID0gQnVmZmVyLmZyb20odmFsLCBlbmNvZGluZylcbiAgfVxuXG4gIC8vIEZpbmFsbHksIHNlYXJjaCBlaXRoZXIgaW5kZXhPZiAoaWYgZGlyIGlzIHRydWUpIG9yIGxhc3RJbmRleE9mXG4gIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsKSkge1xuICAgIC8vIFNwZWNpYWwgY2FzZTogbG9va2luZyBmb3IgZW1wdHkgc3RyaW5nL2J1ZmZlciBhbHdheXMgZmFpbHNcbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpXG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAweEZGIC8vIFNlYXJjaCBmb3IgYSBieXRlIHZhbHVlIFswLTI1NV1cbiAgICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiZcbiAgICAgICAgdHlwZW9mIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmIChkaXIpIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgWyB2YWwgXSwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ZhbCBtdXN0IGJlIHN0cmluZywgbnVtYmVyIG9yIEJ1ZmZlcicpXG59XG5cbmZ1bmN0aW9uIGFycmF5SW5kZXhPZiAoYXJyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgdmFyIGluZGV4U2l6ZSA9IDFcbiAgdmFyIGFyckxlbmd0aCA9IGFyci5sZW5ndGhcbiAgdmFyIHZhbExlbmd0aCA9IHZhbC5sZW5ndGhcblxuICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKGVuY29kaW5nID09PSAndWNzMicgfHwgZW5jb2RpbmcgPT09ICd1Y3MtMicgfHxcbiAgICAgICAgZW5jb2RpbmcgPT09ICd1dGYxNmxlJyB8fCBlbmNvZGluZyA9PT0gJ3V0Zi0xNmxlJykge1xuICAgICAgaWYgKGFyci5sZW5ndGggPCAyIHx8IHZhbC5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybiAtMVxuICAgICAgfVxuICAgICAgaW5kZXhTaXplID0gMlxuICAgICAgYXJyTGVuZ3RoIC89IDJcbiAgICAgIHZhbExlbmd0aCAvPSAyXG4gICAgICBieXRlT2Zmc2V0IC89IDJcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWFkIChidWYsIGkpIHtcbiAgICBpZiAoaW5kZXhTaXplID09PSAxKSB7XG4gICAgICByZXR1cm4gYnVmW2ldXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBidWYucmVhZFVJbnQxNkJFKGkgKiBpbmRleFNpemUpXG4gICAgfVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGRpcikge1xuICAgIHZhciBmb3VuZEluZGV4ID0gLTFcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpIDwgYXJyTGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZWFkKGFyciwgaSkgPT09IHJlYWQodmFsLCBmb3VuZEluZGV4ID09PSAtMSA/IDAgOiBpIC0gZm91bmRJbmRleCkpIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggPT09IC0xKSBmb3VuZEluZGV4ID0gaVxuICAgICAgICBpZiAoaSAtIGZvdW5kSW5kZXggKyAxID09PSB2YWxMZW5ndGgpIHJldHVybiBmb3VuZEluZGV4ICogaW5kZXhTaXplXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZm91bmRJbmRleCAhPT0gLTEpIGkgLT0gaSAtIGZvdW5kSW5kZXhcbiAgICAgICAgZm91bmRJbmRleCA9IC0xXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChieXRlT2Zmc2V0ICsgdmFsTGVuZ3RoID4gYXJyTGVuZ3RoKSBieXRlT2Zmc2V0ID0gYXJyTGVuZ3RoIC0gdmFsTGVuZ3RoXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHZhciBmb3VuZCA9IHRydWVcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmFsTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKHJlYWQoYXJyLCBpICsgaikgIT09IHJlYWQodmFsLCBqKSkge1xuICAgICAgICAgIGZvdW5kID0gZmFsc2VcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZm91bmQpIHJldHVybiBpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gdGhpcy5pbmRleE9mKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpICE9PSAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiBpbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCB0cnVlKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24gbGFzdEluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGZhbHNlKVxufVxuXG5mdW5jdGlvbiBoZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChzdHJMZW4gJSAyICE9PSAwKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgcGFyc2VkID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGlmIChpc05hTihwYXJzZWQpKSByZXR1cm4gaVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHBhcnNlZFxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIHV0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGFzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gbGF0aW4xV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGJhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiB1Y3MyV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gd3JpdGUgKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcpXG4gIGlmIChvZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgb2Zmc2V0WywgbGVuZ3RoXVssIGVuY29kaW5nXSlcbiAgfSBlbHNlIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBsZW5ndGggPSBsZW5ndGggfCAwXG4gICAgICBpZiAoZW5jb2RpbmcgPT09IHVuZGVmaW5lZCkgZW5jb2RpbmcgPSAndXRmOCdcbiAgICB9IGVsc2Uge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgLy8gbGVnYWN5IHdyaXRlKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKSAtIHJlbW92ZSBpbiB2MC4xM1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdCdWZmZXIud3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0WywgbGVuZ3RoXSkgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCdcbiAgICApXG4gIH1cblxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IGxlbmd0aCA+IHJlbWFpbmluZykgbGVuZ3RoID0gcmVtYWluaW5nXG5cbiAgaWYgKChzdHJpbmcubGVuZ3RoID4gMCAmJiAobGVuZ3RoIDwgMCB8fCBvZmZzZXQgPCAwKSkgfHwgb2Zmc2V0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byB3cml0ZSBvdXRzaWRlIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgICByZXR1cm4gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHVjczJXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG4gIHZhciByZXMgPSBbXVxuXG4gIHZhciBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICB2YXIgZmlyc3RCeXRlID0gYnVmW2ldXG4gICAgdmFyIGNvZGVQb2ludCA9IG51bGxcbiAgICB2YXIgYnl0ZXNQZXJTZXF1ZW5jZSA9IChmaXJzdEJ5dGUgPiAweEVGKSA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpID8gM1xuICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRikgPyAyXG4gICAgICA6IDFcblxuICAgIGlmIChpICsgYnl0ZXNQZXJTZXF1ZW5jZSA8PSBlbmQpIHtcbiAgICAgIHZhciBzZWNvbmRCeXRlLCB0aGlyZEJ5dGUsIGZvdXJ0aEJ5dGUsIHRlbXBDb2RlUG9pbnRcblxuICAgICAgc3dpdGNoIChieXRlc1BlclNlcXVlbmNlKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAoZmlyc3RCeXRlIDwgMHg4MCkge1xuICAgICAgICAgICAgY29kZVBvaW50ID0gZmlyc3RCeXRlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4MUYpIDw8IDB4NiB8IChzZWNvbmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3Rikge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweEMgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4NiB8ICh0aGlyZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGRiAmJiAodGVtcENvZGVQb2ludCA8IDB4RDgwMCB8fCB0ZW1wQ29kZVBvaW50ID4gMHhERkZGKSkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBmb3VydGhCeXRlID0gYnVmW2kgKyAzXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAoZm91cnRoQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHgxMiB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHhDIHwgKHRoaXJkQnl0ZSAmIDB4M0YpIDw8IDB4NiB8IChmb3VydGhCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHhGRkZGICYmIHRlbXBDb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlUG9pbnQgPT09IG51bGwpIHtcbiAgICAgIC8vIHdlIGRpZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBjb2RlUG9pbnQgc28gaW5zZXJ0IGFcbiAgICAgIC8vIHJlcGxhY2VtZW50IGNoYXIgKFUrRkZGRCkgYW5kIGFkdmFuY2Ugb25seSAxIGJ5dGVcbiAgICAgIGNvZGVQb2ludCA9IDB4RkZGRFxuICAgICAgYnl0ZXNQZXJTZXF1ZW5jZSA9IDFcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA+IDB4RkZGRikge1xuICAgICAgLy8gZW5jb2RlIHRvIHV0ZjE2IChzdXJyb2dhdGUgcGFpciBkYW5jZSlcbiAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICByZXMucHVzaChjb2RlUG9pbnQgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApXG4gICAgICBjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRlxuICAgIH1cblxuICAgIHJlcy5wdXNoKGNvZGVQb2ludClcbiAgICBpICs9IGJ5dGVzUGVyU2VxdWVuY2VcbiAgfVxuXG4gIHJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKVxufVxuXG4vLyBCYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjc0NzI3Mi82ODA3NDIsIHRoZSBicm93c2VyIHdpdGhcbi8vIHRoZSBsb3dlc3QgbGltaXQgaXMgQ2hyb21lLCB3aXRoIDB4MTAwMDAgYXJncy5cbi8vIFdlIGdvIDEgbWFnbml0dWRlIGxlc3MsIGZvciBzYWZldHlcbnZhciBNQVhfQVJHVU1FTlRTX0xFTkdUSCA9IDB4MTAwMFxuXG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkgKGNvZGVQb2ludHMpIHtcbiAgdmFyIGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgdmFyIHJlcyA9ICcnXG4gIHZhciBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGxhdGluMVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpICsgMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gfn5zdGFydFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IH5+ZW5kXG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ICs9IGxlblxuICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gMFxuICB9IGVsc2UgaWYgKHN0YXJ0ID4gbGVuKSB7XG4gICAgc3RhcnQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlblxuICAgIGlmIChlbmQgPCAwKSBlbmQgPSAwXG4gIH0gZWxzZSBpZiAoZW5kID4gbGVuKSB7XG4gICAgZW5kID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgdmFyIG5ld0J1ZlxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBuZXdCdWYgPSB0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpXG4gICAgbmV3QnVmLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyArK2kpIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXdCdWZcbn1cblxuLypcbiAqIE5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgYnVmZmVyIGlzbid0IHRyeWluZyB0byB3cml0ZSBvdXQgb2YgYm91bmRzLlxuICovXG5mdW5jdGlvbiBjaGVja09mZnNldCAob2Zmc2V0LCBleHQsIGxlbmd0aCkge1xuICBpZiAoKG9mZnNldCAlIDEpICE9PSAwIHx8IG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdvZmZzZXQgaXMgbm90IHVpbnQnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gbGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVHJ5aW5nIHRvIGFjY2VzcyBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRMRSA9IGZ1bmN0aW9uIHJlYWRVSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRCRSA9IGZ1bmN0aW9uIHJlYWRVSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG4gIH1cblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdXG4gIHZhciBtdWwgPSAxXG4gIHdoaWxlIChieXRlTGVuZ3RoID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiByZWFkVUludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiByZWFkVUludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgOCkgfCB0aGlzW29mZnNldCArIDFdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICgodGhpc1tvZmZzZXRdKSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikpICtcbiAgICAgICh0aGlzW29mZnNldCArIDNdICogMHgxMDAwMDAwKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdICogMHgxMDAwMDAwKSArXG4gICAgKCh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgIHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludExFID0gZnVuY3Rpb24gcmVhZEludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoXG4gIHZhciBtdWwgPSAxXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0taV1cbiAgd2hpbGUgKGkgPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1pXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiByZWFkSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICBpZiAoISh0aGlzW29mZnNldF0gJiAweDgwKSkgcmV0dXJuICh0aGlzW29mZnNldF0pXG4gIHJldHVybiAoKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gcmVhZEludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIDFdIHwgKHRoaXNbb2Zmc2V0XSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiByZWFkSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdKSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10gPDwgMjQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiByZWFkSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDI0KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiByZWFkRmxvYXRCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgNTIsIDgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrSW50IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJidWZmZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyIGluc3RhbmNlJylcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IGlzIG91dCBvZiBib3VuZHMnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHhmZiwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmYgKyB2YWx1ZSArIDFcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gb2Zmc2V0LCAyKTsgaSA8IGo7ICsraSkge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9ICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgNCk7IGkgPCBqOyArK2kpIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gMFxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgLSAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50QkUgPSBmdW5jdGlvbiB3cml0ZUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgKyAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgNCwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gd3JpdGVGbG9hdExFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgOCwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbiAgcmV0dXJuIG9mZnNldCArIDhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5ICh0YXJnZXQsIHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXRTdGFydCA+PSB0YXJnZXQubGVuZ3RoKSB0YXJnZXRTdGFydCA9IHRhcmdldC5sZW5ndGhcbiAgaWYgKCF0YXJnZXRTdGFydCkgdGFyZ2V0U3RhcnQgPSAwXG4gIGlmIChlbmQgPiAwICYmIGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuIDBcbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgdGhpcy5sZW5ndGggPT09IDApIHJldHVybiAwXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBpZiAodGFyZ2V0U3RhcnQgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICB9XG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgaWYgKGVuZCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0IDwgZW5kIC0gc3RhcnQpIHtcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgKyBzdGFydFxuICB9XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG4gIHZhciBpXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCAmJiBzdGFydCA8IHRhcmdldFN0YXJ0ICYmIHRhcmdldFN0YXJ0IDwgZW5kKSB7XG4gICAgLy8gZGVzY2VuZGluZyBjb3B5IGZyb20gZW5kXG4gICAgZm9yIChpID0gbGVuIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2UgaWYgKGxlbiA8IDEwMDAgfHwgIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gYXNjZW5kaW5nIGNvcHkgZnJvbSBzdGFydFxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICB0YXJnZXQsXG4gICAgICB0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksXG4gICAgICB0YXJnZXRTdGFydFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gVXNhZ2U6XG4vLyAgICBidWZmZXIuZmlsbChudW1iZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKGJ1ZmZlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoc3RyaW5nWywgb2Zmc2V0WywgZW5kXV1bLCBlbmNvZGluZ10pXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWwsIHN0YXJ0LCBlbmQsIGVuY29kaW5nKSB7XG4gIC8vIEhhbmRsZSBzdHJpbmcgY2FzZXM6XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IHN0YXJ0XG4gICAgICBzdGFydCA9IDBcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBlbmRcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgY29kZSA9IHZhbC5jaGFyQ29kZUF0KDApXG4gICAgICBpZiAoY29kZSA8IDI1Nikge1xuICAgICAgICB2YWwgPSBjb2RlXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuY29kaW5nIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMjU1XG4gIH1cblxuICAvLyBJbnZhbGlkIHJhbmdlcyBhcmUgbm90IHNldCB0byBhIGRlZmF1bHQsIHNvIGNhbiByYW5nZSBjaGVjayBlYXJseS5cbiAgaWYgKHN0YXJ0IDwgMCB8fCB0aGlzLmxlbmd0aCA8IHN0YXJ0IHx8IHRoaXMubGVuZ3RoIDwgZW5kKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ091dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHN0YXJ0ID0gc3RhcnQgPj4+IDBcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyB0aGlzLmxlbmd0aCA6IGVuZCA+Pj4gMFxuXG4gIGlmICghdmFsKSB2YWwgPSAwXG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgICAgdGhpc1tpXSA9IHZhbFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgYnl0ZXMgPSBCdWZmZXIuaXNCdWZmZXIodmFsKVxuICAgICAgPyB2YWxcbiAgICAgIDogdXRmOFRvQnl0ZXMobmV3IEJ1ZmZlcih2YWwsIGVuY29kaW5nKS50b1N0cmluZygpKVxuICAgIHZhciBsZW4gPSBieXRlcy5sZW5ndGhcbiAgICBmb3IgKGkgPSAwOyBpIDwgZW5kIC0gc3RhcnQ7ICsraSkge1xuICAgICAgdGhpc1tpICsgc3RhcnRdID0gYnl0ZXNbaSAlIGxlbl1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbnZhciBJTlZBTElEX0JBU0U2NF9SRSA9IC9bXitcXC8wLTlBLVphLXotX10vZ1xuXG5mdW5jdGlvbiBiYXNlNjRjbGVhbiAoc3RyKSB7XG4gIC8vIE5vZGUgc3RyaXBzIG91dCBpbnZhbGlkIGNoYXJhY3RlcnMgbGlrZSBcXG4gYW5kIFxcdCBmcm9tIHRoZSBzdHJpbmcsIGJhc2U2NC1qcyBkb2VzIG5vdFxuICBzdHIgPSBzdHJpbmd0cmltKHN0cikucmVwbGFjZShJTlZBTElEX0JBU0U2NF9SRSwgJycpXG4gIC8vIE5vZGUgY29udmVydHMgc3RyaW5ncyB3aXRoIGxlbmd0aCA8IDIgdG8gJydcbiAgaWYgKHN0ci5sZW5ndGggPCAyKSByZXR1cm4gJydcbiAgLy8gTm9kZSBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgYmFzZTY0IHN0cmluZ3MgKG1pc3NpbmcgdHJhaWxpbmcgPT09KSwgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHdoaWxlIChzdHIubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgIHN0ciA9IHN0ciArICc9J1xuICB9XG4gIHJldHVybiBzdHJcbn1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyaW5nLCB1bml0cykge1xuICB1bml0cyA9IHVuaXRzIHx8IEluZmluaXR5XG4gIHZhciBjb2RlUG9pbnRcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcbiAgdmFyIGxlYWRTdXJyb2dhdGUgPSBudWxsXG4gIHZhciBieXRlcyA9IFtdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGNvZGVQb2ludCA9IHN0cmluZy5jaGFyQ29kZUF0KGkpXG5cbiAgICAvLyBpcyBzdXJyb2dhdGUgY29tcG9uZW50XG4gICAgaWYgKGNvZGVQb2ludCA+IDB4RDdGRiAmJiBjb2RlUG9pbnQgPCAweEUwMDApIHtcbiAgICAgIC8vIGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoIWxlYWRTdXJyb2dhdGUpIHtcbiAgICAgICAgLy8gbm8gbGVhZCB5ZXRcbiAgICAgICAgaWYgKGNvZGVQb2ludCA+IDB4REJGRikge1xuICAgICAgICAgIC8vIHVuZXhwZWN0ZWQgdHJhaWxcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9IGVsc2UgaWYgKGkgKyAxID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAvLyB1bnBhaXJlZCBsZWFkXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkIGxlYWRcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIDIgbGVhZHMgaW4gYSByb3dcbiAgICAgIGlmIChjb2RlUG9pbnQgPCAweERDMDApIHtcbiAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gdmFsaWQgc3Vycm9nYXRlIHBhaXJcbiAgICAgIGNvZGVQb2ludCA9IChsZWFkU3Vycm9nYXRlIC0gMHhEODAwIDw8IDEwIHwgY29kZVBvaW50IC0gMHhEQzAwKSArIDB4MTAwMDBcbiAgICB9IGVsc2UgaWYgKGxlYWRTdXJyb2dhdGUpIHtcbiAgICAgIC8vIHZhbGlkIGJtcCBjaGFyLCBidXQgbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgIH1cblxuICAgIGxlYWRTdXJyb2dhdGUgPSBudWxsXG5cbiAgICAvLyBlbmNvZGUgdXRmOFxuICAgIGlmIChjb2RlUG9pbnQgPCAweDgwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDEpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goY29kZVBvaW50KVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHg4MDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiB8IDB4QzAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDMpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgfCAweEUwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSA0KSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHgxMiB8IDB4RjAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludCcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIsIHVuaXRzKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG5cbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBpc25hbiAodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IHZhbCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxufVxuIiwiZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBuQml0cyA9IC03XG4gIHZhciBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDBcbiAgdmFyIGQgPSBpc0xFID8gLTEgOiAxXG4gIHZhciBzID0gYnVmZmVyW29mZnNldCArIGldXG5cbiAgaSArPSBkXG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgcyA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gZUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gZSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IG0gKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApXG4gIHZhciBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSlcbiAgdmFyIGQgPSBpc0xFID8gMSA6IC0xXG4gIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwXG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSlcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMFxuICAgIGUgPSBlTWF4XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpXG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tXG4gICAgICBjICo9IDJcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpXG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrXG4gICAgICBjIC89IDJcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwXG4gICAgICBlID0gZU1heFxuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAodmFsdWUgKiBjIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKGFycikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChhcnIpID09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiLy8gcHJvdG90eXBlIGNsYXNzIGZvciBoYXNoIGZ1bmN0aW9uc1xuZnVuY3Rpb24gSGFzaCAoYmxvY2tTaXplLCBmaW5hbFNpemUpIHtcbiAgdGhpcy5fYmxvY2sgPSBuZXcgQnVmZmVyKGJsb2NrU2l6ZSlcbiAgdGhpcy5fZmluYWxTaXplID0gZmluYWxTaXplXG4gIHRoaXMuX2Jsb2NrU2l6ZSA9IGJsb2NrU2l6ZVxuICB0aGlzLl9sZW4gPSAwXG4gIHRoaXMuX3MgPSAwXG59XG5cbkhhc2gucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhLCBlbmMpIHtcbiAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgIGVuYyA9IGVuYyB8fCAndXRmOCdcbiAgICBkYXRhID0gbmV3IEJ1ZmZlcihkYXRhLCBlbmMpXG4gIH1cblxuICB2YXIgbCA9IHRoaXMuX2xlbiArPSBkYXRhLmxlbmd0aFxuICB2YXIgcyA9IHRoaXMuX3MgfHwgMFxuICB2YXIgZiA9IDBcbiAgdmFyIGJ1ZmZlciA9IHRoaXMuX2Jsb2NrXG5cbiAgd2hpbGUgKHMgPCBsKSB7XG4gICAgdmFyIHQgPSBNYXRoLm1pbihkYXRhLmxlbmd0aCwgZiArIHRoaXMuX2Jsb2NrU2l6ZSAtIChzICUgdGhpcy5fYmxvY2tTaXplKSlcbiAgICB2YXIgY2ggPSAodCAtIGYpXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoOyBpKyspIHtcbiAgICAgIGJ1ZmZlclsocyAlIHRoaXMuX2Jsb2NrU2l6ZSkgKyBpXSA9IGRhdGFbaSArIGZdXG4gICAgfVxuXG4gICAgcyArPSBjaFxuICAgIGYgKz0gY2hcblxuICAgIGlmICgocyAlIHRoaXMuX2Jsb2NrU2l6ZSkgPT09IDApIHtcbiAgICAgIHRoaXMuX3VwZGF0ZShidWZmZXIpXG4gICAgfVxuICB9XG4gIHRoaXMuX3MgPSBzXG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuSGFzaC5wcm90b3R5cGUuZGlnZXN0ID0gZnVuY3Rpb24gKGVuYykge1xuICAvLyBTdXBwb3NlIHRoZSBsZW5ndGggb2YgdGhlIG1lc3NhZ2UgTSwgaW4gYml0cywgaXMgbFxuICB2YXIgbCA9IHRoaXMuX2xlbiAqIDhcblxuICAvLyBBcHBlbmQgdGhlIGJpdCAxIHRvIHRoZSBlbmQgb2YgdGhlIG1lc3NhZ2VcbiAgdGhpcy5fYmxvY2tbdGhpcy5fbGVuICUgdGhpcy5fYmxvY2tTaXplXSA9IDB4ODBcblxuICAvLyBhbmQgdGhlbiBrIHplcm8gYml0cywgd2hlcmUgayBpcyB0aGUgc21hbGxlc3Qgbm9uLW5lZ2F0aXZlIHNvbHV0aW9uIHRvIHRoZSBlcXVhdGlvbiAobCArIDEgKyBrKSA9PT0gZmluYWxTaXplIG1vZCBibG9ja1NpemVcbiAgdGhpcy5fYmxvY2suZmlsbCgwLCB0aGlzLl9sZW4gJSB0aGlzLl9ibG9ja1NpemUgKyAxKVxuXG4gIGlmIChsICUgKHRoaXMuX2Jsb2NrU2l6ZSAqIDgpID49IHRoaXMuX2ZpbmFsU2l6ZSAqIDgpIHtcbiAgICB0aGlzLl91cGRhdGUodGhpcy5fYmxvY2spXG4gICAgdGhpcy5fYmxvY2suZmlsbCgwKVxuICB9XG5cbiAgLy8gdG8gdGhpcyBhcHBlbmQgdGhlIGJsb2NrIHdoaWNoIGlzIGVxdWFsIHRvIHRoZSBudW1iZXIgbCB3cml0dGVuIGluIGJpbmFyeVxuICAvLyBUT0RPOiBoYW5kbGUgY2FzZSB3aGVyZSBsIGlzID4gTWF0aC5wb3coMiwgMjkpXG4gIHRoaXMuX2Jsb2NrLndyaXRlSW50MzJCRShsLCB0aGlzLl9ibG9ja1NpemUgLSA0KVxuXG4gIHZhciBoYXNoID0gdGhpcy5fdXBkYXRlKHRoaXMuX2Jsb2NrKSB8fCB0aGlzLl9oYXNoKClcblxuICByZXR1cm4gZW5jID8gaGFzaC50b1N0cmluZyhlbmMpIDogaGFzaFxufVxuXG5IYXNoLnByb3RvdHlwZS5fdXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ191cGRhdGUgbXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcycpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gSGFzaFxuIiwidmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFNIQSAoYWxnb3JpdGhtKSB7XG4gIGFsZ29yaXRobSA9IGFsZ29yaXRobS50b0xvd2VyQ2FzZSgpXG5cbiAgdmFyIEFsZ29yaXRobSA9IGV4cG9ydHNbYWxnb3JpdGhtXVxuICBpZiAoIUFsZ29yaXRobSkgdGhyb3cgbmV3IEVycm9yKGFsZ29yaXRobSArICcgaXMgbm90IHN1cHBvcnRlZCAod2UgYWNjZXB0IHB1bGwgcmVxdWVzdHMpJylcblxuICByZXR1cm4gbmV3IEFsZ29yaXRobSgpXG59XG5cbmV4cG9ydHMuc2hhID0gcmVxdWlyZSgnLi9zaGEnKVxuZXhwb3J0cy5zaGExID0gcmVxdWlyZSgnLi9zaGExJylcbmV4cG9ydHMuc2hhMjI0ID0gcmVxdWlyZSgnLi9zaGEyMjQnKVxuZXhwb3J0cy5zaGEyNTYgPSByZXF1aXJlKCcuL3NoYTI1NicpXG5leHBvcnRzLnNoYTM4NCA9IHJlcXVpcmUoJy4vc2hhMzg0JylcbmV4cG9ydHMuc2hhNTEyID0gcmVxdWlyZSgnLi9zaGE1MTInKVxuIiwiLypcbiAqIEEgSmF2YVNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgU2VjdXJlIEhhc2ggQWxnb3JpdGhtLCBTSEEtMCwgYXMgZGVmaW5lZFxuICogaW4gRklQUyBQVUIgMTgwLTFcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgZGVyaXZlZCBmcm9tIHNoYTEuanMgb2YgdGhlIHNhbWUgcmVwb3NpdG9yeS5cbiAqIFRoZSBkaWZmZXJlbmNlIGJldHdlZW4gU0hBLTAgYW5kIFNIQS0xIGlzIGp1c3QgYSBiaXR3aXNlIHJvdGF0ZSBsZWZ0XG4gKiBvcGVyYXRpb24gd2FzIGFkZGVkLlxuICovXG5cbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbnZhciBIYXNoID0gcmVxdWlyZSgnLi9oYXNoJylcblxudmFyIEsgPSBbXG4gIDB4NWE4Mjc5OTksIDB4NmVkOWViYTEsIDB4OGYxYmJjZGMgfCAwLCAweGNhNjJjMWQ2IHwgMFxuXVxuXG52YXIgVyA9IG5ldyBBcnJheSg4MClcblxuZnVuY3Rpb24gU2hhICgpIHtcbiAgdGhpcy5pbml0KClcbiAgdGhpcy5fdyA9IFdcblxuICBIYXNoLmNhbGwodGhpcywgNjQsIDU2KVxufVxuXG5pbmhlcml0cyhTaGEsIEhhc2gpXG5cblNoYS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5fYSA9IDB4Njc0NTIzMDFcbiAgdGhpcy5fYiA9IDB4ZWZjZGFiODlcbiAgdGhpcy5fYyA9IDB4OThiYWRjZmVcbiAgdGhpcy5fZCA9IDB4MTAzMjU0NzZcbiAgdGhpcy5fZSA9IDB4YzNkMmUxZjBcblxuICByZXR1cm4gdGhpc1xufVxuXG5mdW5jdGlvbiByb3RsNSAobnVtKSB7XG4gIHJldHVybiAobnVtIDw8IDUpIHwgKG51bSA+Pj4gMjcpXG59XG5cbmZ1bmN0aW9uIHJvdGwzMCAobnVtKSB7XG4gIHJldHVybiAobnVtIDw8IDMwKSB8IChudW0gPj4+IDIpXG59XG5cbmZ1bmN0aW9uIGZ0IChzLCBiLCBjLCBkKSB7XG4gIGlmIChzID09PSAwKSByZXR1cm4gKGIgJiBjKSB8ICgofmIpICYgZClcbiAgaWYgKHMgPT09IDIpIHJldHVybiAoYiAmIGMpIHwgKGIgJiBkKSB8IChjICYgZClcbiAgcmV0dXJuIGIgXiBjIF4gZFxufVxuXG5TaGEucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbiAoTSkge1xuICB2YXIgVyA9IHRoaXMuX3dcblxuICB2YXIgYSA9IHRoaXMuX2EgfCAwXG4gIHZhciBiID0gdGhpcy5fYiB8IDBcbiAgdmFyIGMgPSB0aGlzLl9jIHwgMFxuICB2YXIgZCA9IHRoaXMuX2QgfCAwXG4gIHZhciBlID0gdGhpcy5fZSB8IDBcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IDE2OyArK2kpIFdbaV0gPSBNLnJlYWRJbnQzMkJFKGkgKiA0KVxuICBmb3IgKDsgaSA8IDgwOyArK2kpIFdbaV0gPSBXW2kgLSAzXSBeIFdbaSAtIDhdIF4gV1tpIC0gMTRdIF4gV1tpIC0gMTZdXG5cbiAgZm9yICh2YXIgaiA9IDA7IGogPCA4MDsgKytqKSB7XG4gICAgdmFyIHMgPSB+fihqIC8gMjApXG4gICAgdmFyIHQgPSAocm90bDUoYSkgKyBmdChzLCBiLCBjLCBkKSArIGUgKyBXW2pdICsgS1tzXSkgfCAwXG5cbiAgICBlID0gZFxuICAgIGQgPSBjXG4gICAgYyA9IHJvdGwzMChiKVxuICAgIGIgPSBhXG4gICAgYSA9IHRcbiAgfVxuXG4gIHRoaXMuX2EgPSAoYSArIHRoaXMuX2EpIHwgMFxuICB0aGlzLl9iID0gKGIgKyB0aGlzLl9iKSB8IDBcbiAgdGhpcy5fYyA9IChjICsgdGhpcy5fYykgfCAwXG4gIHRoaXMuX2QgPSAoZCArIHRoaXMuX2QpIHwgMFxuICB0aGlzLl9lID0gKGUgKyB0aGlzLl9lKSB8IDBcbn1cblxuU2hhLnByb3RvdHlwZS5faGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIEggPSBuZXcgQnVmZmVyKDIwKVxuXG4gIEgud3JpdGVJbnQzMkJFKHRoaXMuX2EgfCAwLCAwKVxuICBILndyaXRlSW50MzJCRSh0aGlzLl9iIHwgMCwgNClcbiAgSC53cml0ZUludDMyQkUodGhpcy5fYyB8IDAsIDgpXG4gIEgud3JpdGVJbnQzMkJFKHRoaXMuX2QgfCAwLCAxMilcbiAgSC53cml0ZUludDMyQkUodGhpcy5fZSB8IDAsIDE2KVxuXG4gIHJldHVybiBIXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hhXG4iLCIvKlxuICogQSBKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBTZWN1cmUgSGFzaCBBbGdvcml0aG0sIFNIQS0xLCBhcyBkZWZpbmVkXG4gKiBpbiBGSVBTIFBVQiAxODAtMVxuICogVmVyc2lvbiAyLjFhIENvcHlyaWdodCBQYXVsIEpvaG5zdG9uIDIwMDAgLSAyMDAyLlxuICogT3RoZXIgY29udHJpYnV0b3JzOiBHcmVnIEhvbHQsIEFuZHJldyBLZXBlcnQsIFlkbmFyLCBMb3N0aW5ldFxuICogRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIEJTRCBMaWNlbnNlXG4gKiBTZWUgaHR0cDovL3BhamhvbWUub3JnLnVrL2NyeXB0L21kNSBmb3IgZGV0YWlscy5cbiAqL1xuXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXG52YXIgSGFzaCA9IHJlcXVpcmUoJy4vaGFzaCcpXG5cbnZhciBLID0gW1xuICAweDVhODI3OTk5LCAweDZlZDllYmExLCAweDhmMWJiY2RjIHwgMCwgMHhjYTYyYzFkNiB8IDBcbl1cblxudmFyIFcgPSBuZXcgQXJyYXkoODApXG5cbmZ1bmN0aW9uIFNoYTEgKCkge1xuICB0aGlzLmluaXQoKVxuICB0aGlzLl93ID0gV1xuXG4gIEhhc2guY2FsbCh0aGlzLCA2NCwgNTYpXG59XG5cbmluaGVyaXRzKFNoYTEsIEhhc2gpXG5cblNoYTEucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuX2EgPSAweDY3NDUyMzAxXG4gIHRoaXMuX2IgPSAweGVmY2RhYjg5XG4gIHRoaXMuX2MgPSAweDk4YmFkY2ZlXG4gIHRoaXMuX2QgPSAweDEwMzI1NDc2XG4gIHRoaXMuX2UgPSAweGMzZDJlMWYwXG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuZnVuY3Rpb24gcm90bDEgKG51bSkge1xuICByZXR1cm4gKG51bSA8PCAxKSB8IChudW0gPj4+IDMxKVxufVxuXG5mdW5jdGlvbiByb3RsNSAobnVtKSB7XG4gIHJldHVybiAobnVtIDw8IDUpIHwgKG51bSA+Pj4gMjcpXG59XG5cbmZ1bmN0aW9uIHJvdGwzMCAobnVtKSB7XG4gIHJldHVybiAobnVtIDw8IDMwKSB8IChudW0gPj4+IDIpXG59XG5cbmZ1bmN0aW9uIGZ0IChzLCBiLCBjLCBkKSB7XG4gIGlmIChzID09PSAwKSByZXR1cm4gKGIgJiBjKSB8ICgofmIpICYgZClcbiAgaWYgKHMgPT09IDIpIHJldHVybiAoYiAmIGMpIHwgKGIgJiBkKSB8IChjICYgZClcbiAgcmV0dXJuIGIgXiBjIF4gZFxufVxuXG5TaGExLnByb3RvdHlwZS5fdXBkYXRlID0gZnVuY3Rpb24gKE0pIHtcbiAgdmFyIFcgPSB0aGlzLl93XG5cbiAgdmFyIGEgPSB0aGlzLl9hIHwgMFxuICB2YXIgYiA9IHRoaXMuX2IgfCAwXG4gIHZhciBjID0gdGhpcy5fYyB8IDBcbiAgdmFyIGQgPSB0aGlzLl9kIHwgMFxuICB2YXIgZSA9IHRoaXMuX2UgfCAwXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAxNjsgKytpKSBXW2ldID0gTS5yZWFkSW50MzJCRShpICogNClcbiAgZm9yICg7IGkgPCA4MDsgKytpKSBXW2ldID0gcm90bDEoV1tpIC0gM10gXiBXW2kgLSA4XSBeIFdbaSAtIDE0XSBeIFdbaSAtIDE2XSlcblxuICBmb3IgKHZhciBqID0gMDsgaiA8IDgwOyArK2opIHtcbiAgICB2YXIgcyA9IH5+KGogLyAyMClcbiAgICB2YXIgdCA9IChyb3RsNShhKSArIGZ0KHMsIGIsIGMsIGQpICsgZSArIFdbal0gKyBLW3NdKSB8IDBcblxuICAgIGUgPSBkXG4gICAgZCA9IGNcbiAgICBjID0gcm90bDMwKGIpXG4gICAgYiA9IGFcbiAgICBhID0gdFxuICB9XG5cbiAgdGhpcy5fYSA9IChhICsgdGhpcy5fYSkgfCAwXG4gIHRoaXMuX2IgPSAoYiArIHRoaXMuX2IpIHwgMFxuICB0aGlzLl9jID0gKGMgKyB0aGlzLl9jKSB8IDBcbiAgdGhpcy5fZCA9IChkICsgdGhpcy5fZCkgfCAwXG4gIHRoaXMuX2UgPSAoZSArIHRoaXMuX2UpIHwgMFxufVxuXG5TaGExLnByb3RvdHlwZS5faGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIEggPSBuZXcgQnVmZmVyKDIwKVxuXG4gIEgud3JpdGVJbnQzMkJFKHRoaXMuX2EgfCAwLCAwKVxuICBILndyaXRlSW50MzJCRSh0aGlzLl9iIHwgMCwgNClcbiAgSC53cml0ZUludDMyQkUodGhpcy5fYyB8IDAsIDgpXG4gIEgud3JpdGVJbnQzMkJFKHRoaXMuX2QgfCAwLCAxMilcbiAgSC53cml0ZUludDMyQkUodGhpcy5fZSB8IDAsIDE2KVxuXG4gIHJldHVybiBIXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hhMVxuIiwiLyoqXG4gKiBBIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIFNlY3VyZSBIYXNoIEFsZ29yaXRobSwgU0hBLTI1NiwgYXMgZGVmaW5lZFxuICogaW4gRklQUyAxODAtMlxuICogVmVyc2lvbiAyLjItYmV0YSBDb3B5cmlnaHQgQW5nZWwgTWFyaW4sIFBhdWwgSm9obnN0b24gMjAwMCAtIDIwMDkuXG4gKiBPdGhlciBjb250cmlidXRvcnM6IEdyZWcgSG9sdCwgQW5kcmV3IEtlcGVydCwgWWRuYXIsIExvc3RpbmV0XG4gKlxuICovXG5cbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbnZhciBTaGEyNTYgPSByZXF1aXJlKCcuL3NoYTI1NicpXG52YXIgSGFzaCA9IHJlcXVpcmUoJy4vaGFzaCcpXG5cbnZhciBXID0gbmV3IEFycmF5KDY0KVxuXG5mdW5jdGlvbiBTaGEyMjQgKCkge1xuICB0aGlzLmluaXQoKVxuXG4gIHRoaXMuX3cgPSBXIC8vIG5ldyBBcnJheSg2NClcblxuICBIYXNoLmNhbGwodGhpcywgNjQsIDU2KVxufVxuXG5pbmhlcml0cyhTaGEyMjQsIFNoYTI1NilcblxuU2hhMjI0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLl9hID0gMHhjMTA1OWVkOFxuICB0aGlzLl9iID0gMHgzNjdjZDUwN1xuICB0aGlzLl9jID0gMHgzMDcwZGQxN1xuICB0aGlzLl9kID0gMHhmNzBlNTkzOVxuICB0aGlzLl9lID0gMHhmZmMwMGIzMVxuICB0aGlzLl9mID0gMHg2ODU4MTUxMVxuICB0aGlzLl9nID0gMHg2NGY5OGZhN1xuICB0aGlzLl9oID0gMHhiZWZhNGZhNFxuXG4gIHJldHVybiB0aGlzXG59XG5cblNoYTIyNC5wcm90b3R5cGUuX2hhc2ggPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBIID0gbmV3IEJ1ZmZlcigyOClcblxuICBILndyaXRlSW50MzJCRSh0aGlzLl9hLCAwKVxuICBILndyaXRlSW50MzJCRSh0aGlzLl9iLCA0KVxuICBILndyaXRlSW50MzJCRSh0aGlzLl9jLCA4KVxuICBILndyaXRlSW50MzJCRSh0aGlzLl9kLCAxMilcbiAgSC53cml0ZUludDMyQkUodGhpcy5fZSwgMTYpXG4gIEgud3JpdGVJbnQzMkJFKHRoaXMuX2YsIDIwKVxuICBILndyaXRlSW50MzJCRSh0aGlzLl9nLCAyNClcblxuICByZXR1cm4gSFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoYTIyNFxuIiwiLyoqXG4gKiBBIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIFNlY3VyZSBIYXNoIEFsZ29yaXRobSwgU0hBLTI1NiwgYXMgZGVmaW5lZFxuICogaW4gRklQUyAxODAtMlxuICogVmVyc2lvbiAyLjItYmV0YSBDb3B5cmlnaHQgQW5nZWwgTWFyaW4sIFBhdWwgSm9obnN0b24gMjAwMCAtIDIwMDkuXG4gKiBPdGhlciBjb250cmlidXRvcnM6IEdyZWcgSG9sdCwgQW5kcmV3IEtlcGVydCwgWWRuYXIsIExvc3RpbmV0XG4gKlxuICovXG5cbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbnZhciBIYXNoID0gcmVxdWlyZSgnLi9oYXNoJylcblxudmFyIEsgPSBbXG4gIDB4NDI4QTJGOTgsIDB4NzEzNzQ0OTEsIDB4QjVDMEZCQ0YsIDB4RTlCNURCQTUsXG4gIDB4Mzk1NkMyNUIsIDB4NTlGMTExRjEsIDB4OTIzRjgyQTQsIDB4QUIxQzVFRDUsXG4gIDB4RDgwN0FBOTgsIDB4MTI4MzVCMDEsIDB4MjQzMTg1QkUsIDB4NTUwQzdEQzMsXG4gIDB4NzJCRTVENzQsIDB4ODBERUIxRkUsIDB4OUJEQzA2QTcsIDB4QzE5QkYxNzQsXG4gIDB4RTQ5QjY5QzEsIDB4RUZCRTQ3ODYsIDB4MEZDMTlEQzYsIDB4MjQwQ0ExQ0MsXG4gIDB4MkRFOTJDNkYsIDB4NEE3NDg0QUEsIDB4NUNCMEE5REMsIDB4NzZGOTg4REEsXG4gIDB4OTgzRTUxNTIsIDB4QTgzMUM2NkQsIDB4QjAwMzI3QzgsIDB4QkY1OTdGQzcsXG4gIDB4QzZFMDBCRjMsIDB4RDVBNzkxNDcsIDB4MDZDQTYzNTEsIDB4MTQyOTI5NjcsXG4gIDB4MjdCNzBBODUsIDB4MkUxQjIxMzgsIDB4NEQyQzZERkMsIDB4NTMzODBEMTMsXG4gIDB4NjUwQTczNTQsIDB4NzY2QTBBQkIsIDB4ODFDMkM5MkUsIDB4OTI3MjJDODUsXG4gIDB4QTJCRkU4QTEsIDB4QTgxQTY2NEIsIDB4QzI0QjhCNzAsIDB4Qzc2QzUxQTMsXG4gIDB4RDE5MkU4MTksIDB4RDY5OTA2MjQsIDB4RjQwRTM1ODUsIDB4MTA2QUEwNzAsXG4gIDB4MTlBNEMxMTYsIDB4MUUzNzZDMDgsIDB4Mjc0ODc3NEMsIDB4MzRCMEJDQjUsXG4gIDB4MzkxQzBDQjMsIDB4NEVEOEFBNEEsIDB4NUI5Q0NBNEYsIDB4NjgyRTZGRjMsXG4gIDB4NzQ4RjgyRUUsIDB4NzhBNTYzNkYsIDB4ODRDODc4MTQsIDB4OENDNzAyMDgsXG4gIDB4OTBCRUZGRkEsIDB4QTQ1MDZDRUIsIDB4QkVGOUEzRjcsIDB4QzY3MTc4RjJcbl1cblxudmFyIFcgPSBuZXcgQXJyYXkoNjQpXG5cbmZ1bmN0aW9uIFNoYTI1NiAoKSB7XG4gIHRoaXMuaW5pdCgpXG5cbiAgdGhpcy5fdyA9IFcgLy8gbmV3IEFycmF5KDY0KVxuXG4gIEhhc2guY2FsbCh0aGlzLCA2NCwgNTYpXG59XG5cbmluaGVyaXRzKFNoYTI1NiwgSGFzaClcblxuU2hhMjU2LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLl9hID0gMHg2YTA5ZTY2N1xuICB0aGlzLl9iID0gMHhiYjY3YWU4NVxuICB0aGlzLl9jID0gMHgzYzZlZjM3MlxuICB0aGlzLl9kID0gMHhhNTRmZjUzYVxuICB0aGlzLl9lID0gMHg1MTBlNTI3ZlxuICB0aGlzLl9mID0gMHg5YjA1Njg4Y1xuICB0aGlzLl9nID0gMHgxZjgzZDlhYlxuICB0aGlzLl9oID0gMHg1YmUwY2QxOVxuXG4gIHJldHVybiB0aGlzXG59XG5cbmZ1bmN0aW9uIGNoICh4LCB5LCB6KSB7XG4gIHJldHVybiB6IF4gKHggJiAoeSBeIHopKVxufVxuXG5mdW5jdGlvbiBtYWogKHgsIHksIHopIHtcbiAgcmV0dXJuICh4ICYgeSkgfCAoeiAmICh4IHwgeSkpXG59XG5cbmZ1bmN0aW9uIHNpZ21hMCAoeCkge1xuICByZXR1cm4gKHggPj4+IDIgfCB4IDw8IDMwKSBeICh4ID4+PiAxMyB8IHggPDwgMTkpIF4gKHggPj4+IDIyIHwgeCA8PCAxMClcbn1cblxuZnVuY3Rpb24gc2lnbWExICh4KSB7XG4gIHJldHVybiAoeCA+Pj4gNiB8IHggPDwgMjYpIF4gKHggPj4+IDExIHwgeCA8PCAyMSkgXiAoeCA+Pj4gMjUgfCB4IDw8IDcpXG59XG5cbmZ1bmN0aW9uIGdhbW1hMCAoeCkge1xuICByZXR1cm4gKHggPj4+IDcgfCB4IDw8IDI1KSBeICh4ID4+PiAxOCB8IHggPDwgMTQpIF4gKHggPj4+IDMpXG59XG5cbmZ1bmN0aW9uIGdhbW1hMSAoeCkge1xuICByZXR1cm4gKHggPj4+IDE3IHwgeCA8PCAxNSkgXiAoeCA+Pj4gMTkgfCB4IDw8IDEzKSBeICh4ID4+PiAxMClcbn1cblxuU2hhMjU2LnByb3RvdHlwZS5fdXBkYXRlID0gZnVuY3Rpb24gKE0pIHtcbiAgdmFyIFcgPSB0aGlzLl93XG5cbiAgdmFyIGEgPSB0aGlzLl9hIHwgMFxuICB2YXIgYiA9IHRoaXMuX2IgfCAwXG4gIHZhciBjID0gdGhpcy5fYyB8IDBcbiAgdmFyIGQgPSB0aGlzLl9kIHwgMFxuICB2YXIgZSA9IHRoaXMuX2UgfCAwXG4gIHZhciBmID0gdGhpcy5fZiB8IDBcbiAgdmFyIGcgPSB0aGlzLl9nIHwgMFxuICB2YXIgaCA9IHRoaXMuX2ggfCAwXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAxNjsgKytpKSBXW2ldID0gTS5yZWFkSW50MzJCRShpICogNClcbiAgZm9yICg7IGkgPCA2NDsgKytpKSBXW2ldID0gKGdhbW1hMShXW2kgLSAyXSkgKyBXW2kgLSA3XSArIGdhbW1hMChXW2kgLSAxNV0pICsgV1tpIC0gMTZdKSB8IDBcblxuICBmb3IgKHZhciBqID0gMDsgaiA8IDY0OyArK2opIHtcbiAgICB2YXIgVDEgPSAoaCArIHNpZ21hMShlKSArIGNoKGUsIGYsIGcpICsgS1tqXSArIFdbal0pIHwgMFxuICAgIHZhciBUMiA9IChzaWdtYTAoYSkgKyBtYWooYSwgYiwgYykpIHwgMFxuXG4gICAgaCA9IGdcbiAgICBnID0gZlxuICAgIGYgPSBlXG4gICAgZSA9IChkICsgVDEpIHwgMFxuICAgIGQgPSBjXG4gICAgYyA9IGJcbiAgICBiID0gYVxuICAgIGEgPSAoVDEgKyBUMikgfCAwXG4gIH1cblxuICB0aGlzLl9hID0gKGEgKyB0aGlzLl9hKSB8IDBcbiAgdGhpcy5fYiA9IChiICsgdGhpcy5fYikgfCAwXG4gIHRoaXMuX2MgPSAoYyArIHRoaXMuX2MpIHwgMFxuICB0aGlzLl9kID0gKGQgKyB0aGlzLl9kKSB8IDBcbiAgdGhpcy5fZSA9IChlICsgdGhpcy5fZSkgfCAwXG4gIHRoaXMuX2YgPSAoZiArIHRoaXMuX2YpIHwgMFxuICB0aGlzLl9nID0gKGcgKyB0aGlzLl9nKSB8IDBcbiAgdGhpcy5faCA9IChoICsgdGhpcy5faCkgfCAwXG59XG5cblNoYTI1Ni5wcm90b3R5cGUuX2hhc2ggPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBIID0gbmV3IEJ1ZmZlcigzMilcblxuICBILndyaXRlSW50MzJCRSh0aGlzLl9hLCAwKVxuICBILndyaXRlSW50MzJCRSh0aGlzLl9iLCA0KVxuICBILndyaXRlSW50MzJCRSh0aGlzLl9jLCA4KVxuICBILndyaXRlSW50MzJCRSh0aGlzLl9kLCAxMilcbiAgSC53cml0ZUludDMyQkUodGhpcy5fZSwgMTYpXG4gIEgud3JpdGVJbnQzMkJFKHRoaXMuX2YsIDIwKVxuICBILndyaXRlSW50MzJCRSh0aGlzLl9nLCAyNClcbiAgSC53cml0ZUludDMyQkUodGhpcy5faCwgMjgpXG5cbiAgcmV0dXJuIEhcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTaGEyNTZcbiIsInZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbnZhciBTSEE1MTIgPSByZXF1aXJlKCcuL3NoYTUxMicpXG52YXIgSGFzaCA9IHJlcXVpcmUoJy4vaGFzaCcpXG5cbnZhciBXID0gbmV3IEFycmF5KDE2MClcblxuZnVuY3Rpb24gU2hhMzg0ICgpIHtcbiAgdGhpcy5pbml0KClcbiAgdGhpcy5fdyA9IFdcblxuICBIYXNoLmNhbGwodGhpcywgMTI4LCAxMTIpXG59XG5cbmluaGVyaXRzKFNoYTM4NCwgU0hBNTEyKVxuXG5TaGEzODQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuX2FoID0gMHhjYmJiOWQ1ZFxuICB0aGlzLl9iaCA9IDB4NjI5YTI5MmFcbiAgdGhpcy5fY2ggPSAweDkxNTkwMTVhXG4gIHRoaXMuX2RoID0gMHgxNTJmZWNkOFxuICB0aGlzLl9laCA9IDB4NjczMzI2NjdcbiAgdGhpcy5fZmggPSAweDhlYjQ0YTg3XG4gIHRoaXMuX2doID0gMHhkYjBjMmUwZFxuICB0aGlzLl9oaCA9IDB4NDdiNTQ4MWRcblxuICB0aGlzLl9hbCA9IDB4YzEwNTllZDhcbiAgdGhpcy5fYmwgPSAweDM2N2NkNTA3XG4gIHRoaXMuX2NsID0gMHgzMDcwZGQxN1xuICB0aGlzLl9kbCA9IDB4ZjcwZTU5MzlcbiAgdGhpcy5fZWwgPSAweGZmYzAwYjMxXG4gIHRoaXMuX2ZsID0gMHg2ODU4MTUxMVxuICB0aGlzLl9nbCA9IDB4NjRmOThmYTdcbiAgdGhpcy5faGwgPSAweGJlZmE0ZmE0XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuU2hhMzg0LnByb3RvdHlwZS5faGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIEggPSBuZXcgQnVmZmVyKDQ4KVxuXG4gIGZ1bmN0aW9uIHdyaXRlSW50NjRCRSAoaCwgbCwgb2Zmc2V0KSB7XG4gICAgSC53cml0ZUludDMyQkUoaCwgb2Zmc2V0KVxuICAgIEgud3JpdGVJbnQzMkJFKGwsIG9mZnNldCArIDQpXG4gIH1cblxuICB3cml0ZUludDY0QkUodGhpcy5fYWgsIHRoaXMuX2FsLCAwKVxuICB3cml0ZUludDY0QkUodGhpcy5fYmgsIHRoaXMuX2JsLCA4KVxuICB3cml0ZUludDY0QkUodGhpcy5fY2gsIHRoaXMuX2NsLCAxNilcbiAgd3JpdGVJbnQ2NEJFKHRoaXMuX2RoLCB0aGlzLl9kbCwgMjQpXG4gIHdyaXRlSW50NjRCRSh0aGlzLl9laCwgdGhpcy5fZWwsIDMyKVxuICB3cml0ZUludDY0QkUodGhpcy5fZmgsIHRoaXMuX2ZsLCA0MClcblxuICByZXR1cm4gSFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoYTM4NFxuIiwidmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxudmFyIEhhc2ggPSByZXF1aXJlKCcuL2hhc2gnKVxuXG52YXIgSyA9IFtcbiAgMHg0MjhhMmY5OCwgMHhkNzI4YWUyMiwgMHg3MTM3NDQ5MSwgMHgyM2VmNjVjZCxcbiAgMHhiNWMwZmJjZiwgMHhlYzRkM2IyZiwgMHhlOWI1ZGJhNSwgMHg4MTg5ZGJiYyxcbiAgMHgzOTU2YzI1YiwgMHhmMzQ4YjUzOCwgMHg1OWYxMTFmMSwgMHhiNjA1ZDAxOSxcbiAgMHg5MjNmODJhNCwgMHhhZjE5NGY5YiwgMHhhYjFjNWVkNSwgMHhkYTZkODExOCxcbiAgMHhkODA3YWE5OCwgMHhhMzAzMDI0MiwgMHgxMjgzNWIwMSwgMHg0NTcwNmZiZSxcbiAgMHgyNDMxODViZSwgMHg0ZWU0YjI4YywgMHg1NTBjN2RjMywgMHhkNWZmYjRlMixcbiAgMHg3MmJlNWQ3NCwgMHhmMjdiODk2ZiwgMHg4MGRlYjFmZSwgMHgzYjE2OTZiMSxcbiAgMHg5YmRjMDZhNywgMHgyNWM3MTIzNSwgMHhjMTliZjE3NCwgMHhjZjY5MjY5NCxcbiAgMHhlNDliNjljMSwgMHg5ZWYxNGFkMiwgMHhlZmJlNDc4NiwgMHgzODRmMjVlMyxcbiAgMHgwZmMxOWRjNiwgMHg4YjhjZDViNSwgMHgyNDBjYTFjYywgMHg3N2FjOWM2NSxcbiAgMHgyZGU5MmM2ZiwgMHg1OTJiMDI3NSwgMHg0YTc0ODRhYSwgMHg2ZWE2ZTQ4MyxcbiAgMHg1Y2IwYTlkYywgMHhiZDQxZmJkNCwgMHg3NmY5ODhkYSwgMHg4MzExNTNiNSxcbiAgMHg5ODNlNTE1MiwgMHhlZTY2ZGZhYiwgMHhhODMxYzY2ZCwgMHgyZGI0MzIxMCxcbiAgMHhiMDAzMjdjOCwgMHg5OGZiMjEzZiwgMHhiZjU5N2ZjNywgMHhiZWVmMGVlNCxcbiAgMHhjNmUwMGJmMywgMHgzZGE4OGZjMiwgMHhkNWE3OTE0NywgMHg5MzBhYTcyNSxcbiAgMHgwNmNhNjM1MSwgMHhlMDAzODI2ZiwgMHgxNDI5Mjk2NywgMHgwYTBlNmU3MCxcbiAgMHgyN2I3MGE4NSwgMHg0NmQyMmZmYywgMHgyZTFiMjEzOCwgMHg1YzI2YzkyNixcbiAgMHg0ZDJjNmRmYywgMHg1YWM0MmFlZCwgMHg1MzM4MGQxMywgMHg5ZDk1YjNkZixcbiAgMHg2NTBhNzM1NCwgMHg4YmFmNjNkZSwgMHg3NjZhMGFiYiwgMHgzYzc3YjJhOCxcbiAgMHg4MWMyYzkyZSwgMHg0N2VkYWVlNiwgMHg5MjcyMmM4NSwgMHgxNDgyMzUzYixcbiAgMHhhMmJmZThhMSwgMHg0Y2YxMDM2NCwgMHhhODFhNjY0YiwgMHhiYzQyMzAwMSxcbiAgMHhjMjRiOGI3MCwgMHhkMGY4OTc5MSwgMHhjNzZjNTFhMywgMHgwNjU0YmUzMCxcbiAgMHhkMTkyZTgxOSwgMHhkNmVmNTIxOCwgMHhkNjk5MDYyNCwgMHg1NTY1YTkxMCxcbiAgMHhmNDBlMzU4NSwgMHg1NzcxMjAyYSwgMHgxMDZhYTA3MCwgMHgzMmJiZDFiOCxcbiAgMHgxOWE0YzExNiwgMHhiOGQyZDBjOCwgMHgxZTM3NmMwOCwgMHg1MTQxYWI1MyxcbiAgMHgyNzQ4Nzc0YywgMHhkZjhlZWI5OSwgMHgzNGIwYmNiNSwgMHhlMTliNDhhOCxcbiAgMHgzOTFjMGNiMywgMHhjNWM5NWE2MywgMHg0ZWQ4YWE0YSwgMHhlMzQxOGFjYixcbiAgMHg1YjljY2E0ZiwgMHg3NzYzZTM3MywgMHg2ODJlNmZmMywgMHhkNmIyYjhhMyxcbiAgMHg3NDhmODJlZSwgMHg1ZGVmYjJmYywgMHg3OGE1NjM2ZiwgMHg0MzE3MmY2MCxcbiAgMHg4NGM4NzgxNCwgMHhhMWYwYWI3MiwgMHg4Y2M3MDIwOCwgMHgxYTY0MzllYyxcbiAgMHg5MGJlZmZmYSwgMHgyMzYzMWUyOCwgMHhhNDUwNmNlYiwgMHhkZTgyYmRlOSxcbiAgMHhiZWY5YTNmNywgMHhiMmM2NzkxNSwgMHhjNjcxNzhmMiwgMHhlMzcyNTMyYixcbiAgMHhjYTI3M2VjZSwgMHhlYTI2NjE5YywgMHhkMTg2YjhjNywgMHgyMWMwYzIwNyxcbiAgMHhlYWRhN2RkNiwgMHhjZGUwZWIxZSwgMHhmNTdkNGY3ZiwgMHhlZTZlZDE3OCxcbiAgMHgwNmYwNjdhYSwgMHg3MjE3NmZiYSwgMHgwYTYzN2RjNSwgMHhhMmM4OThhNixcbiAgMHgxMTNmOTgwNCwgMHhiZWY5MGRhZSwgMHgxYjcxMGIzNSwgMHgxMzFjNDcxYixcbiAgMHgyOGRiNzdmNSwgMHgyMzA0N2Q4NCwgMHgzMmNhYWI3YiwgMHg0MGM3MjQ5MyxcbiAgMHgzYzllYmUwYSwgMHgxNWM5YmViYywgMHg0MzFkNjdjNCwgMHg5YzEwMGQ0YyxcbiAgMHg0Y2M1ZDRiZSwgMHhjYjNlNDJiNiwgMHg1OTdmMjk5YywgMHhmYzY1N2UyYSxcbiAgMHg1ZmNiNmZhYiwgMHgzYWQ2ZmFlYywgMHg2YzQ0MTk4YywgMHg0YTQ3NTgxN1xuXVxuXG52YXIgVyA9IG5ldyBBcnJheSgxNjApXG5cbmZ1bmN0aW9uIFNoYTUxMiAoKSB7XG4gIHRoaXMuaW5pdCgpXG4gIHRoaXMuX3cgPSBXXG5cbiAgSGFzaC5jYWxsKHRoaXMsIDEyOCwgMTEyKVxufVxuXG5pbmhlcml0cyhTaGE1MTIsIEhhc2gpXG5cblNoYTUxMi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5fYWggPSAweDZhMDllNjY3XG4gIHRoaXMuX2JoID0gMHhiYjY3YWU4NVxuICB0aGlzLl9jaCA9IDB4M2M2ZWYzNzJcbiAgdGhpcy5fZGggPSAweGE1NGZmNTNhXG4gIHRoaXMuX2VoID0gMHg1MTBlNTI3ZlxuICB0aGlzLl9maCA9IDB4OWIwNTY4OGNcbiAgdGhpcy5fZ2ggPSAweDFmODNkOWFiXG4gIHRoaXMuX2hoID0gMHg1YmUwY2QxOVxuXG4gIHRoaXMuX2FsID0gMHhmM2JjYzkwOFxuICB0aGlzLl9ibCA9IDB4ODRjYWE3M2JcbiAgdGhpcy5fY2wgPSAweGZlOTRmODJiXG4gIHRoaXMuX2RsID0gMHg1ZjFkMzZmMVxuICB0aGlzLl9lbCA9IDB4YWRlNjgyZDFcbiAgdGhpcy5fZmwgPSAweDJiM2U2YzFmXG4gIHRoaXMuX2dsID0gMHhmYjQxYmQ2YlxuICB0aGlzLl9obCA9IDB4MTM3ZTIxNzlcblxuICByZXR1cm4gdGhpc1xufVxuXG5mdW5jdGlvbiBDaCAoeCwgeSwgeikge1xuICByZXR1cm4geiBeICh4ICYgKHkgXiB6KSlcbn1cblxuZnVuY3Rpb24gbWFqICh4LCB5LCB6KSB7XG4gIHJldHVybiAoeCAmIHkpIHwgKHogJiAoeCB8IHkpKVxufVxuXG5mdW5jdGlvbiBzaWdtYTAgKHgsIHhsKSB7XG4gIHJldHVybiAoeCA+Pj4gMjggfCB4bCA8PCA0KSBeICh4bCA+Pj4gMiB8IHggPDwgMzApIF4gKHhsID4+PiA3IHwgeCA8PCAyNSlcbn1cblxuZnVuY3Rpb24gc2lnbWExICh4LCB4bCkge1xuICByZXR1cm4gKHggPj4+IDE0IHwgeGwgPDwgMTgpIF4gKHggPj4+IDE4IHwgeGwgPDwgMTQpIF4gKHhsID4+PiA5IHwgeCA8PCAyMylcbn1cblxuZnVuY3Rpb24gR2FtbWEwICh4LCB4bCkge1xuICByZXR1cm4gKHggPj4+IDEgfCB4bCA8PCAzMSkgXiAoeCA+Pj4gOCB8IHhsIDw8IDI0KSBeICh4ID4+PiA3KVxufVxuXG5mdW5jdGlvbiBHYW1tYTBsICh4LCB4bCkge1xuICByZXR1cm4gKHggPj4+IDEgfCB4bCA8PCAzMSkgXiAoeCA+Pj4gOCB8IHhsIDw8IDI0KSBeICh4ID4+PiA3IHwgeGwgPDwgMjUpXG59XG5cbmZ1bmN0aW9uIEdhbW1hMSAoeCwgeGwpIHtcbiAgcmV0dXJuICh4ID4+PiAxOSB8IHhsIDw8IDEzKSBeICh4bCA+Pj4gMjkgfCB4IDw8IDMpIF4gKHggPj4+IDYpXG59XG5cbmZ1bmN0aW9uIEdhbW1hMWwgKHgsIHhsKSB7XG4gIHJldHVybiAoeCA+Pj4gMTkgfCB4bCA8PCAxMykgXiAoeGwgPj4+IDI5IHwgeCA8PCAzKSBeICh4ID4+PiA2IHwgeGwgPDwgMjYpXG59XG5cbmZ1bmN0aW9uIGdldENhcnJ5IChhLCBiKSB7XG4gIHJldHVybiAoYSA+Pj4gMCkgPCAoYiA+Pj4gMCkgPyAxIDogMFxufVxuXG5TaGE1MTIucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbiAoTSkge1xuICB2YXIgVyA9IHRoaXMuX3dcblxuICB2YXIgYWggPSB0aGlzLl9haCB8IDBcbiAgdmFyIGJoID0gdGhpcy5fYmggfCAwXG4gIHZhciBjaCA9IHRoaXMuX2NoIHwgMFxuICB2YXIgZGggPSB0aGlzLl9kaCB8IDBcbiAgdmFyIGVoID0gdGhpcy5fZWggfCAwXG4gIHZhciBmaCA9IHRoaXMuX2ZoIHwgMFxuICB2YXIgZ2ggPSB0aGlzLl9naCB8IDBcbiAgdmFyIGhoID0gdGhpcy5faGggfCAwXG5cbiAgdmFyIGFsID0gdGhpcy5fYWwgfCAwXG4gIHZhciBibCA9IHRoaXMuX2JsIHwgMFxuICB2YXIgY2wgPSB0aGlzLl9jbCB8IDBcbiAgdmFyIGRsID0gdGhpcy5fZGwgfCAwXG4gIHZhciBlbCA9IHRoaXMuX2VsIHwgMFxuICB2YXIgZmwgPSB0aGlzLl9mbCB8IDBcbiAgdmFyIGdsID0gdGhpcy5fZ2wgfCAwXG4gIHZhciBobCA9IHRoaXMuX2hsIHwgMFxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMzI7IGkgKz0gMikge1xuICAgIFdbaV0gPSBNLnJlYWRJbnQzMkJFKGkgKiA0KVxuICAgIFdbaSArIDFdID0gTS5yZWFkSW50MzJCRShpICogNCArIDQpXG4gIH1cbiAgZm9yICg7IGkgPCAxNjA7IGkgKz0gMikge1xuICAgIHZhciB4aCA9IFdbaSAtIDE1ICogMl1cbiAgICB2YXIgeGwgPSBXW2kgLSAxNSAqIDIgKyAxXVxuICAgIHZhciBnYW1tYTAgPSBHYW1tYTAoeGgsIHhsKVxuICAgIHZhciBnYW1tYTBsID0gR2FtbWEwbCh4bCwgeGgpXG5cbiAgICB4aCA9IFdbaSAtIDIgKiAyXVxuICAgIHhsID0gV1tpIC0gMiAqIDIgKyAxXVxuICAgIHZhciBnYW1tYTEgPSBHYW1tYTEoeGgsIHhsKVxuICAgIHZhciBnYW1tYTFsID0gR2FtbWExbCh4bCwgeGgpXG5cbiAgICAvLyBXW2ldID0gZ2FtbWEwICsgV1tpIC0gN10gKyBnYW1tYTEgKyBXW2kgLSAxNl1cbiAgICB2YXIgV2k3aCA9IFdbaSAtIDcgKiAyXVxuICAgIHZhciBXaTdsID0gV1tpIC0gNyAqIDIgKyAxXVxuXG4gICAgdmFyIFdpMTZoID0gV1tpIC0gMTYgKiAyXVxuICAgIHZhciBXaTE2bCA9IFdbaSAtIDE2ICogMiArIDFdXG5cbiAgICB2YXIgV2lsID0gKGdhbW1hMGwgKyBXaTdsKSB8IDBcbiAgICB2YXIgV2loID0gKGdhbW1hMCArIFdpN2ggKyBnZXRDYXJyeShXaWwsIGdhbW1hMGwpKSB8IDBcbiAgICBXaWwgPSAoV2lsICsgZ2FtbWExbCkgfCAwXG4gICAgV2loID0gKFdpaCArIGdhbW1hMSArIGdldENhcnJ5KFdpbCwgZ2FtbWExbCkpIHwgMFxuICAgIFdpbCA9IChXaWwgKyBXaTE2bCkgfCAwXG4gICAgV2loID0gKFdpaCArIFdpMTZoICsgZ2V0Q2FycnkoV2lsLCBXaTE2bCkpIHwgMFxuXG4gICAgV1tpXSA9IFdpaFxuICAgIFdbaSArIDFdID0gV2lsXG4gIH1cblxuICBmb3IgKHZhciBqID0gMDsgaiA8IDE2MDsgaiArPSAyKSB7XG4gICAgV2loID0gV1tqXVxuICAgIFdpbCA9IFdbaiArIDFdXG5cbiAgICB2YXIgbWFqaCA9IG1haihhaCwgYmgsIGNoKVxuICAgIHZhciBtYWpsID0gbWFqKGFsLCBibCwgY2wpXG5cbiAgICB2YXIgc2lnbWEwaCA9IHNpZ21hMChhaCwgYWwpXG4gICAgdmFyIHNpZ21hMGwgPSBzaWdtYTAoYWwsIGFoKVxuICAgIHZhciBzaWdtYTFoID0gc2lnbWExKGVoLCBlbClcbiAgICB2YXIgc2lnbWExbCA9IHNpZ21hMShlbCwgZWgpXG5cbiAgICAvLyB0MSA9IGggKyBzaWdtYTEgKyBjaCArIEtbal0gKyBXW2pdXG4gICAgdmFyIEtpaCA9IEtbal1cbiAgICB2YXIgS2lsID0gS1tqICsgMV1cblxuICAgIHZhciBjaGggPSBDaChlaCwgZmgsIGdoKVxuICAgIHZhciBjaGwgPSBDaChlbCwgZmwsIGdsKVxuXG4gICAgdmFyIHQxbCA9IChobCArIHNpZ21hMWwpIHwgMFxuICAgIHZhciB0MWggPSAoaGggKyBzaWdtYTFoICsgZ2V0Q2FycnkodDFsLCBobCkpIHwgMFxuICAgIHQxbCA9ICh0MWwgKyBjaGwpIHwgMFxuICAgIHQxaCA9ICh0MWggKyBjaGggKyBnZXRDYXJyeSh0MWwsIGNobCkpIHwgMFxuICAgIHQxbCA9ICh0MWwgKyBLaWwpIHwgMFxuICAgIHQxaCA9ICh0MWggKyBLaWggKyBnZXRDYXJyeSh0MWwsIEtpbCkpIHwgMFxuICAgIHQxbCA9ICh0MWwgKyBXaWwpIHwgMFxuICAgIHQxaCA9ICh0MWggKyBXaWggKyBnZXRDYXJyeSh0MWwsIFdpbCkpIHwgMFxuXG4gICAgLy8gdDIgPSBzaWdtYTAgKyBtYWpcbiAgICB2YXIgdDJsID0gKHNpZ21hMGwgKyBtYWpsKSB8IDBcbiAgICB2YXIgdDJoID0gKHNpZ21hMGggKyBtYWpoICsgZ2V0Q2FycnkodDJsLCBzaWdtYTBsKSkgfCAwXG5cbiAgICBoaCA9IGdoXG4gICAgaGwgPSBnbFxuICAgIGdoID0gZmhcbiAgICBnbCA9IGZsXG4gICAgZmggPSBlaFxuICAgIGZsID0gZWxcbiAgICBlbCA9IChkbCArIHQxbCkgfCAwXG4gICAgZWggPSAoZGggKyB0MWggKyBnZXRDYXJyeShlbCwgZGwpKSB8IDBcbiAgICBkaCA9IGNoXG4gICAgZGwgPSBjbFxuICAgIGNoID0gYmhcbiAgICBjbCA9IGJsXG4gICAgYmggPSBhaFxuICAgIGJsID0gYWxcbiAgICBhbCA9ICh0MWwgKyB0MmwpIHwgMFxuICAgIGFoID0gKHQxaCArIHQyaCArIGdldENhcnJ5KGFsLCB0MWwpKSB8IDBcbiAgfVxuXG4gIHRoaXMuX2FsID0gKHRoaXMuX2FsICsgYWwpIHwgMFxuICB0aGlzLl9ibCA9ICh0aGlzLl9ibCArIGJsKSB8IDBcbiAgdGhpcy5fY2wgPSAodGhpcy5fY2wgKyBjbCkgfCAwXG4gIHRoaXMuX2RsID0gKHRoaXMuX2RsICsgZGwpIHwgMFxuICB0aGlzLl9lbCA9ICh0aGlzLl9lbCArIGVsKSB8IDBcbiAgdGhpcy5fZmwgPSAodGhpcy5fZmwgKyBmbCkgfCAwXG4gIHRoaXMuX2dsID0gKHRoaXMuX2dsICsgZ2wpIHwgMFxuICB0aGlzLl9obCA9ICh0aGlzLl9obCArIGhsKSB8IDBcblxuICB0aGlzLl9haCA9ICh0aGlzLl9haCArIGFoICsgZ2V0Q2FycnkodGhpcy5fYWwsIGFsKSkgfCAwXG4gIHRoaXMuX2JoID0gKHRoaXMuX2JoICsgYmggKyBnZXRDYXJyeSh0aGlzLl9ibCwgYmwpKSB8IDBcbiAgdGhpcy5fY2ggPSAodGhpcy5fY2ggKyBjaCArIGdldENhcnJ5KHRoaXMuX2NsLCBjbCkpIHwgMFxuICB0aGlzLl9kaCA9ICh0aGlzLl9kaCArIGRoICsgZ2V0Q2FycnkodGhpcy5fZGwsIGRsKSkgfCAwXG4gIHRoaXMuX2VoID0gKHRoaXMuX2VoICsgZWggKyBnZXRDYXJyeSh0aGlzLl9lbCwgZWwpKSB8IDBcbiAgdGhpcy5fZmggPSAodGhpcy5fZmggKyBmaCArIGdldENhcnJ5KHRoaXMuX2ZsLCBmbCkpIHwgMFxuICB0aGlzLl9naCA9ICh0aGlzLl9naCArIGdoICsgZ2V0Q2FycnkodGhpcy5fZ2wsIGdsKSkgfCAwXG4gIHRoaXMuX2hoID0gKHRoaXMuX2hoICsgaGggKyBnZXRDYXJyeSh0aGlzLl9obCwgaGwpKSB8IDBcbn1cblxuU2hhNTEyLnByb3RvdHlwZS5faGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIEggPSBuZXcgQnVmZmVyKDY0KVxuXG4gIGZ1bmN0aW9uIHdyaXRlSW50NjRCRSAoaCwgbCwgb2Zmc2V0KSB7XG4gICAgSC53cml0ZUludDMyQkUoaCwgb2Zmc2V0KVxuICAgIEgud3JpdGVJbnQzMkJFKGwsIG9mZnNldCArIDQpXG4gIH1cblxuICB3cml0ZUludDY0QkUodGhpcy5fYWgsIHRoaXMuX2FsLCAwKVxuICB3cml0ZUludDY0QkUodGhpcy5fYmgsIHRoaXMuX2JsLCA4KVxuICB3cml0ZUludDY0QkUodGhpcy5fY2gsIHRoaXMuX2NsLCAxNilcbiAgd3JpdGVJbnQ2NEJFKHRoaXMuX2RoLCB0aGlzLl9kbCwgMjQpXG4gIHdyaXRlSW50NjRCRSh0aGlzLl9laCwgdGhpcy5fZWwsIDMyKVxuICB3cml0ZUludDY0QkUodGhpcy5fZmgsIHRoaXMuX2ZsLCA0MClcbiAgd3JpdGVJbnQ2NEJFKHRoaXMuX2doLCB0aGlzLl9nbCwgNDgpXG4gIHdyaXRlSW50NjRCRSh0aGlzLl9oaCwgdGhpcy5faGwsIDU2KVxuXG4gIHJldHVybiBIXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hhNTEyXG4iLCIoZnVuY3Rpb24obmFjbCkge1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBQb3J0ZWQgaW4gMjAxNCBieSBEbWl0cnkgQ2hlc3RueWtoIGFuZCBEZXZpIE1hbmRpcmkuXG4vLyBQdWJsaWMgZG9tYWluLlxuLy9cbi8vIEltcGxlbWVudGF0aW9uIGRlcml2ZWQgZnJvbSBUd2VldE5hQ2wgdmVyc2lvbiAyMDE0MDQyNy5cbi8vIFNlZSBmb3IgZGV0YWlsczogaHR0cDovL3R3ZWV0bmFjbC5jci55cC50by9cblxudmFyIGdmID0gZnVuY3Rpb24oaW5pdCkge1xuICB2YXIgaSwgciA9IG5ldyBGbG9hdDY0QXJyYXkoMTYpO1xuICBpZiAoaW5pdCkgZm9yIChpID0gMDsgaSA8IGluaXQubGVuZ3RoOyBpKyspIHJbaV0gPSBpbml0W2ldO1xuICByZXR1cm4gcjtcbn07XG5cbi8vICBQbHVnZ2FibGUsIGluaXRpYWxpemVkIGluIGhpZ2gtbGV2ZWwgQVBJIGJlbG93LlxudmFyIHJhbmRvbWJ5dGVzID0gZnVuY3Rpb24oLyogeCwgbiAqLykgeyB0aHJvdyBuZXcgRXJyb3IoJ25vIFBSTkcnKTsgfTtcblxudmFyIF8wID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xudmFyIF85ID0gbmV3IFVpbnQ4QXJyYXkoMzIpOyBfOVswXSA9IDk7XG5cbnZhciBnZjAgPSBnZigpLFxuICAgIGdmMSA9IGdmKFsxXSksXG4gICAgXzEyMTY2NSA9IGdmKFsweGRiNDEsIDFdKSxcbiAgICBEID0gZ2YoWzB4NzhhMywgMHgxMzU5LCAweDRkY2EsIDB4NzVlYiwgMHhkOGFiLCAweDQxNDEsIDB4MGE0ZCwgMHgwMDcwLCAweGU4OTgsIDB4Nzc3OSwgMHg0MDc5LCAweDhjYzcsIDB4ZmU3MywgMHgyYjZmLCAweDZjZWUsIDB4NTIwM10pLFxuICAgIEQyID0gZ2YoWzB4ZjE1OSwgMHgyNmIyLCAweDliOTQsIDB4ZWJkNiwgMHhiMTU2LCAweDgyODMsIDB4MTQ5YSwgMHgwMGUwLCAweGQxMzAsIDB4ZWVmMywgMHg4MGYyLCAweDE5OGUsIDB4ZmNlNywgMHg1NmRmLCAweGQ5ZGMsIDB4MjQwNl0pLFxuICAgIFggPSBnZihbMHhkNTFhLCAweDhmMjUsIDB4MmQ2MCwgMHhjOTU2LCAweGE3YjIsIDB4OTUyNSwgMHhjNzYwLCAweDY5MmMsIDB4ZGM1YywgMHhmZGQ2LCAweGUyMzEsIDB4YzBhNCwgMHg1M2ZlLCAweGNkNmUsIDB4MzZkMywgMHgyMTY5XSksXG4gICAgWSA9IGdmKFsweDY2NTgsIDB4NjY2NiwgMHg2NjY2LCAweDY2NjYsIDB4NjY2NiwgMHg2NjY2LCAweDY2NjYsIDB4NjY2NiwgMHg2NjY2LCAweDY2NjYsIDB4NjY2NiwgMHg2NjY2LCAweDY2NjYsIDB4NjY2NiwgMHg2NjY2LCAweDY2NjZdKSxcbiAgICBJID0gZ2YoWzB4YTBiMCwgMHg0YTBlLCAweDFiMjcsIDB4YzRlZSwgMHhlNDc4LCAweGFkMmYsIDB4MTgwNiwgMHgyZjQzLCAweGQ3YTcsIDB4M2RmYiwgMHgwMDk5LCAweDJiNGQsIDB4ZGYwYiwgMHg0ZmMxLCAweDI0ODAsIDB4MmI4M10pO1xuXG5mdW5jdGlvbiB0czY0KHgsIGksIGgsIGwpIHtcbiAgeFtpXSAgID0gKGggPj4gMjQpICYgMHhmZjtcbiAgeFtpKzFdID0gKGggPj4gMTYpICYgMHhmZjtcbiAgeFtpKzJdID0gKGggPj4gIDgpICYgMHhmZjtcbiAgeFtpKzNdID0gaCAmIDB4ZmY7XG4gIHhbaSs0XSA9IChsID4+IDI0KSAgJiAweGZmO1xuICB4W2krNV0gPSAobCA+PiAxNikgICYgMHhmZjtcbiAgeFtpKzZdID0gKGwgPj4gIDgpICAmIDB4ZmY7XG4gIHhbaSs3XSA9IGwgJiAweGZmO1xufVxuXG5mdW5jdGlvbiB2bih4LCB4aSwgeSwgeWksIG4pIHtcbiAgdmFyIGksZCA9IDA7XG4gIGZvciAoaSA9IDA7IGkgPCBuOyBpKyspIGQgfD0geFt4aStpXV55W3lpK2ldO1xuICByZXR1cm4gKDEgJiAoKGQgLSAxKSA+Pj4gOCkpIC0gMTtcbn1cblxuZnVuY3Rpb24gY3J5cHRvX3ZlcmlmeV8xNih4LCB4aSwgeSwgeWkpIHtcbiAgcmV0dXJuIHZuKHgseGkseSx5aSwxNik7XG59XG5cbmZ1bmN0aW9uIGNyeXB0b192ZXJpZnlfMzIoeCwgeGksIHksIHlpKSB7XG4gIHJldHVybiB2bih4LHhpLHkseWksMzIpO1xufVxuXG5mdW5jdGlvbiBjb3JlX3NhbHNhMjAobywgcCwgaywgYykge1xuICB2YXIgajAgID0gY1sgMF0gJiAweGZmIHwgKGNbIDFdICYgMHhmZik8PDggfCAoY1sgMl0gJiAweGZmKTw8MTYgfCAoY1sgM10gJiAweGZmKTw8MjQsXG4gICAgICBqMSAgPSBrWyAwXSAmIDB4ZmYgfCAoa1sgMV0gJiAweGZmKTw8OCB8IChrWyAyXSAmIDB4ZmYpPDwxNiB8IChrWyAzXSAmIDB4ZmYpPDwyNCxcbiAgICAgIGoyICA9IGtbIDRdICYgMHhmZiB8IChrWyA1XSAmIDB4ZmYpPDw4IHwgKGtbIDZdICYgMHhmZik8PDE2IHwgKGtbIDddICYgMHhmZik8PDI0LFxuICAgICAgajMgID0ga1sgOF0gJiAweGZmIHwgKGtbIDldICYgMHhmZik8PDggfCAoa1sxMF0gJiAweGZmKTw8MTYgfCAoa1sxMV0gJiAweGZmKTw8MjQsXG4gICAgICBqNCAgPSBrWzEyXSAmIDB4ZmYgfCAoa1sxM10gJiAweGZmKTw8OCB8IChrWzE0XSAmIDB4ZmYpPDwxNiB8IChrWzE1XSAmIDB4ZmYpPDwyNCxcbiAgICAgIGo1ICA9IGNbIDRdICYgMHhmZiB8IChjWyA1XSAmIDB4ZmYpPDw4IHwgKGNbIDZdICYgMHhmZik8PDE2IHwgKGNbIDddICYgMHhmZik8PDI0LFxuICAgICAgajYgID0gcFsgMF0gJiAweGZmIHwgKHBbIDFdICYgMHhmZik8PDggfCAocFsgMl0gJiAweGZmKTw8MTYgfCAocFsgM10gJiAweGZmKTw8MjQsXG4gICAgICBqNyAgPSBwWyA0XSAmIDB4ZmYgfCAocFsgNV0gJiAweGZmKTw8OCB8IChwWyA2XSAmIDB4ZmYpPDwxNiB8IChwWyA3XSAmIDB4ZmYpPDwyNCxcbiAgICAgIGo4ICA9IHBbIDhdICYgMHhmZiB8IChwWyA5XSAmIDB4ZmYpPDw4IHwgKHBbMTBdICYgMHhmZik8PDE2IHwgKHBbMTFdICYgMHhmZik8PDI0LFxuICAgICAgajkgID0gcFsxMl0gJiAweGZmIHwgKHBbMTNdICYgMHhmZik8PDggfCAocFsxNF0gJiAweGZmKTw8MTYgfCAocFsxNV0gJiAweGZmKTw8MjQsXG4gICAgICBqMTAgPSBjWyA4XSAmIDB4ZmYgfCAoY1sgOV0gJiAweGZmKTw8OCB8IChjWzEwXSAmIDB4ZmYpPDwxNiB8IChjWzExXSAmIDB4ZmYpPDwyNCxcbiAgICAgIGoxMSA9IGtbMTZdICYgMHhmZiB8IChrWzE3XSAmIDB4ZmYpPDw4IHwgKGtbMThdICYgMHhmZik8PDE2IHwgKGtbMTldICYgMHhmZik8PDI0LFxuICAgICAgajEyID0ga1syMF0gJiAweGZmIHwgKGtbMjFdICYgMHhmZik8PDggfCAoa1syMl0gJiAweGZmKTw8MTYgfCAoa1syM10gJiAweGZmKTw8MjQsXG4gICAgICBqMTMgPSBrWzI0XSAmIDB4ZmYgfCAoa1syNV0gJiAweGZmKTw8OCB8IChrWzI2XSAmIDB4ZmYpPDwxNiB8IChrWzI3XSAmIDB4ZmYpPDwyNCxcbiAgICAgIGoxNCA9IGtbMjhdICYgMHhmZiB8IChrWzI5XSAmIDB4ZmYpPDw4IHwgKGtbMzBdICYgMHhmZik8PDE2IHwgKGtbMzFdICYgMHhmZik8PDI0LFxuICAgICAgajE1ID0gY1sxMl0gJiAweGZmIHwgKGNbMTNdICYgMHhmZik8PDggfCAoY1sxNF0gJiAweGZmKTw8MTYgfCAoY1sxNV0gJiAweGZmKTw8MjQ7XG5cbiAgdmFyIHgwID0gajAsIHgxID0gajEsIHgyID0gajIsIHgzID0gajMsIHg0ID0gajQsIHg1ID0gajUsIHg2ID0gajYsIHg3ID0gajcsXG4gICAgICB4OCA9IGo4LCB4OSA9IGo5LCB4MTAgPSBqMTAsIHgxMSA9IGoxMSwgeDEyID0gajEyLCB4MTMgPSBqMTMsIHgxNCA9IGoxNCxcbiAgICAgIHgxNSA9IGoxNSwgdTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IDIwOyBpICs9IDIpIHtcbiAgICB1ID0geDAgKyB4MTIgfCAwO1xuICAgIHg0IF49IHU8PDcgfCB1Pj4+KDMyLTcpO1xuICAgIHUgPSB4NCArIHgwIHwgMDtcbiAgICB4OCBePSB1PDw5IHwgdT4+PigzMi05KTtcbiAgICB1ID0geDggKyB4NCB8IDA7XG4gICAgeDEyIF49IHU8PDEzIHwgdT4+PigzMi0xMyk7XG4gICAgdSA9IHgxMiArIHg4IHwgMDtcbiAgICB4MCBePSB1PDwxOCB8IHU+Pj4oMzItMTgpO1xuXG4gICAgdSA9IHg1ICsgeDEgfCAwO1xuICAgIHg5IF49IHU8PDcgfCB1Pj4+KDMyLTcpO1xuICAgIHUgPSB4OSArIHg1IHwgMDtcbiAgICB4MTMgXj0gdTw8OSB8IHU+Pj4oMzItOSk7XG4gICAgdSA9IHgxMyArIHg5IHwgMDtcbiAgICB4MSBePSB1PDwxMyB8IHU+Pj4oMzItMTMpO1xuICAgIHUgPSB4MSArIHgxMyB8IDA7XG4gICAgeDUgXj0gdTw8MTggfCB1Pj4+KDMyLTE4KTtcblxuICAgIHUgPSB4MTAgKyB4NiB8IDA7XG4gICAgeDE0IF49IHU8PDcgfCB1Pj4+KDMyLTcpO1xuICAgIHUgPSB4MTQgKyB4MTAgfCAwO1xuICAgIHgyIF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xuICAgIHUgPSB4MiArIHgxNCB8IDA7XG4gICAgeDYgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcbiAgICB1ID0geDYgKyB4MiB8IDA7XG4gICAgeDEwIF49IHU8PDE4IHwgdT4+PigzMi0xOCk7XG5cbiAgICB1ID0geDE1ICsgeDExIHwgMDtcbiAgICB4MyBePSB1PDw3IHwgdT4+PigzMi03KTtcbiAgICB1ID0geDMgKyB4MTUgfCAwO1xuICAgIHg3IF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xuICAgIHUgPSB4NyArIHgzIHwgMDtcbiAgICB4MTEgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcbiAgICB1ID0geDExICsgeDcgfCAwO1xuICAgIHgxNSBePSB1PDwxOCB8IHU+Pj4oMzItMTgpO1xuXG4gICAgdSA9IHgwICsgeDMgfCAwO1xuICAgIHgxIF49IHU8PDcgfCB1Pj4+KDMyLTcpO1xuICAgIHUgPSB4MSArIHgwIHwgMDtcbiAgICB4MiBePSB1PDw5IHwgdT4+PigzMi05KTtcbiAgICB1ID0geDIgKyB4MSB8IDA7XG4gICAgeDMgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcbiAgICB1ID0geDMgKyB4MiB8IDA7XG4gICAgeDAgXj0gdTw8MTggfCB1Pj4+KDMyLTE4KTtcblxuICAgIHUgPSB4NSArIHg0IHwgMDtcbiAgICB4NiBePSB1PDw3IHwgdT4+PigzMi03KTtcbiAgICB1ID0geDYgKyB4NSB8IDA7XG4gICAgeDcgXj0gdTw8OSB8IHU+Pj4oMzItOSk7XG4gICAgdSA9IHg3ICsgeDYgfCAwO1xuICAgIHg0IF49IHU8PDEzIHwgdT4+PigzMi0xMyk7XG4gICAgdSA9IHg0ICsgeDcgfCAwO1xuICAgIHg1IF49IHU8PDE4IHwgdT4+PigzMi0xOCk7XG5cbiAgICB1ID0geDEwICsgeDkgfCAwO1xuICAgIHgxMSBePSB1PDw3IHwgdT4+PigzMi03KTtcbiAgICB1ID0geDExICsgeDEwIHwgMDtcbiAgICB4OCBePSB1PDw5IHwgdT4+PigzMi05KTtcbiAgICB1ID0geDggKyB4MTEgfCAwO1xuICAgIHg5IF49IHU8PDEzIHwgdT4+PigzMi0xMyk7XG4gICAgdSA9IHg5ICsgeDggfCAwO1xuICAgIHgxMCBePSB1PDwxOCB8IHU+Pj4oMzItMTgpO1xuXG4gICAgdSA9IHgxNSArIHgxNCB8IDA7XG4gICAgeDEyIF49IHU8PDcgfCB1Pj4+KDMyLTcpO1xuICAgIHUgPSB4MTIgKyB4MTUgfCAwO1xuICAgIHgxMyBePSB1PDw5IHwgdT4+PigzMi05KTtcbiAgICB1ID0geDEzICsgeDEyIHwgMDtcbiAgICB4MTQgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcbiAgICB1ID0geDE0ICsgeDEzIHwgMDtcbiAgICB4MTUgXj0gdTw8MTggfCB1Pj4+KDMyLTE4KTtcbiAgfVxuICAgeDAgPSAgeDAgKyAgajAgfCAwO1xuICAgeDEgPSAgeDEgKyAgajEgfCAwO1xuICAgeDIgPSAgeDIgKyAgajIgfCAwO1xuICAgeDMgPSAgeDMgKyAgajMgfCAwO1xuICAgeDQgPSAgeDQgKyAgajQgfCAwO1xuICAgeDUgPSAgeDUgKyAgajUgfCAwO1xuICAgeDYgPSAgeDYgKyAgajYgfCAwO1xuICAgeDcgPSAgeDcgKyAgajcgfCAwO1xuICAgeDggPSAgeDggKyAgajggfCAwO1xuICAgeDkgPSAgeDkgKyAgajkgfCAwO1xuICB4MTAgPSB4MTAgKyBqMTAgfCAwO1xuICB4MTEgPSB4MTEgKyBqMTEgfCAwO1xuICB4MTIgPSB4MTIgKyBqMTIgfCAwO1xuICB4MTMgPSB4MTMgKyBqMTMgfCAwO1xuICB4MTQgPSB4MTQgKyBqMTQgfCAwO1xuICB4MTUgPSB4MTUgKyBqMTUgfCAwO1xuXG4gIG9bIDBdID0geDAgPj4+ICAwICYgMHhmZjtcbiAgb1sgMV0gPSB4MCA+Pj4gIDggJiAweGZmO1xuICBvWyAyXSA9IHgwID4+PiAxNiAmIDB4ZmY7XG4gIG9bIDNdID0geDAgPj4+IDI0ICYgMHhmZjtcblxuICBvWyA0XSA9IHgxID4+PiAgMCAmIDB4ZmY7XG4gIG9bIDVdID0geDEgPj4+ICA4ICYgMHhmZjtcbiAgb1sgNl0gPSB4MSA+Pj4gMTYgJiAweGZmO1xuICBvWyA3XSA9IHgxID4+PiAyNCAmIDB4ZmY7XG5cbiAgb1sgOF0gPSB4MiA+Pj4gIDAgJiAweGZmO1xuICBvWyA5XSA9IHgyID4+PiAgOCAmIDB4ZmY7XG4gIG9bMTBdID0geDIgPj4+IDE2ICYgMHhmZjtcbiAgb1sxMV0gPSB4MiA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bMTJdID0geDMgPj4+ICAwICYgMHhmZjtcbiAgb1sxM10gPSB4MyA+Pj4gIDggJiAweGZmO1xuICBvWzE0XSA9IHgzID4+PiAxNiAmIDB4ZmY7XG4gIG9bMTVdID0geDMgPj4+IDI0ICYgMHhmZjtcblxuICBvWzE2XSA9IHg0ID4+PiAgMCAmIDB4ZmY7XG4gIG9bMTddID0geDQgPj4+ICA4ICYgMHhmZjtcbiAgb1sxOF0gPSB4NCA+Pj4gMTYgJiAweGZmO1xuICBvWzE5XSA9IHg0ID4+PiAyNCAmIDB4ZmY7XG5cbiAgb1syMF0gPSB4NSA+Pj4gIDAgJiAweGZmO1xuICBvWzIxXSA9IHg1ID4+PiAgOCAmIDB4ZmY7XG4gIG9bMjJdID0geDUgPj4+IDE2ICYgMHhmZjtcbiAgb1syM10gPSB4NSA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bMjRdID0geDYgPj4+ICAwICYgMHhmZjtcbiAgb1syNV0gPSB4NiA+Pj4gIDggJiAweGZmO1xuICBvWzI2XSA9IHg2ID4+PiAxNiAmIDB4ZmY7XG4gIG9bMjddID0geDYgPj4+IDI0ICYgMHhmZjtcblxuICBvWzI4XSA9IHg3ID4+PiAgMCAmIDB4ZmY7XG4gIG9bMjldID0geDcgPj4+ICA4ICYgMHhmZjtcbiAgb1szMF0gPSB4NyA+Pj4gMTYgJiAweGZmO1xuICBvWzMxXSA9IHg3ID4+PiAyNCAmIDB4ZmY7XG5cbiAgb1szMl0gPSB4OCA+Pj4gIDAgJiAweGZmO1xuICBvWzMzXSA9IHg4ID4+PiAgOCAmIDB4ZmY7XG4gIG9bMzRdID0geDggPj4+IDE2ICYgMHhmZjtcbiAgb1szNV0gPSB4OCA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bMzZdID0geDkgPj4+ICAwICYgMHhmZjtcbiAgb1szN10gPSB4OSA+Pj4gIDggJiAweGZmO1xuICBvWzM4XSA9IHg5ID4+PiAxNiAmIDB4ZmY7XG4gIG9bMzldID0geDkgPj4+IDI0ICYgMHhmZjtcblxuICBvWzQwXSA9IHgxMCA+Pj4gIDAgJiAweGZmO1xuICBvWzQxXSA9IHgxMCA+Pj4gIDggJiAweGZmO1xuICBvWzQyXSA9IHgxMCA+Pj4gMTYgJiAweGZmO1xuICBvWzQzXSA9IHgxMCA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bNDRdID0geDExID4+PiAgMCAmIDB4ZmY7XG4gIG9bNDVdID0geDExID4+PiAgOCAmIDB4ZmY7XG4gIG9bNDZdID0geDExID4+PiAxNiAmIDB4ZmY7XG4gIG9bNDddID0geDExID4+PiAyNCAmIDB4ZmY7XG5cbiAgb1s0OF0gPSB4MTIgPj4+ICAwICYgMHhmZjtcbiAgb1s0OV0gPSB4MTIgPj4+ICA4ICYgMHhmZjtcbiAgb1s1MF0gPSB4MTIgPj4+IDE2ICYgMHhmZjtcbiAgb1s1MV0gPSB4MTIgPj4+IDI0ICYgMHhmZjtcblxuICBvWzUyXSA9IHgxMyA+Pj4gIDAgJiAweGZmO1xuICBvWzUzXSA9IHgxMyA+Pj4gIDggJiAweGZmO1xuICBvWzU0XSA9IHgxMyA+Pj4gMTYgJiAweGZmO1xuICBvWzU1XSA9IHgxMyA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bNTZdID0geDE0ID4+PiAgMCAmIDB4ZmY7XG4gIG9bNTddID0geDE0ID4+PiAgOCAmIDB4ZmY7XG4gIG9bNThdID0geDE0ID4+PiAxNiAmIDB4ZmY7XG4gIG9bNTldID0geDE0ID4+PiAyNCAmIDB4ZmY7XG5cbiAgb1s2MF0gPSB4MTUgPj4+ICAwICYgMHhmZjtcbiAgb1s2MV0gPSB4MTUgPj4+ICA4ICYgMHhmZjtcbiAgb1s2Ml0gPSB4MTUgPj4+IDE2ICYgMHhmZjtcbiAgb1s2M10gPSB4MTUgPj4+IDI0ICYgMHhmZjtcbn1cblxuZnVuY3Rpb24gY29yZV9oc2Fsc2EyMChvLHAsayxjKSB7XG4gIHZhciBqMCAgPSBjWyAwXSAmIDB4ZmYgfCAoY1sgMV0gJiAweGZmKTw8OCB8IChjWyAyXSAmIDB4ZmYpPDwxNiB8IChjWyAzXSAmIDB4ZmYpPDwyNCxcbiAgICAgIGoxICA9IGtbIDBdICYgMHhmZiB8IChrWyAxXSAmIDB4ZmYpPDw4IHwgKGtbIDJdICYgMHhmZik8PDE2IHwgKGtbIDNdICYgMHhmZik8PDI0LFxuICAgICAgajIgID0ga1sgNF0gJiAweGZmIHwgKGtbIDVdICYgMHhmZik8PDggfCAoa1sgNl0gJiAweGZmKTw8MTYgfCAoa1sgN10gJiAweGZmKTw8MjQsXG4gICAgICBqMyAgPSBrWyA4XSAmIDB4ZmYgfCAoa1sgOV0gJiAweGZmKTw8OCB8IChrWzEwXSAmIDB4ZmYpPDwxNiB8IChrWzExXSAmIDB4ZmYpPDwyNCxcbiAgICAgIGo0ICA9IGtbMTJdICYgMHhmZiB8IChrWzEzXSAmIDB4ZmYpPDw4IHwgKGtbMTRdICYgMHhmZik8PDE2IHwgKGtbMTVdICYgMHhmZik8PDI0LFxuICAgICAgajUgID0gY1sgNF0gJiAweGZmIHwgKGNbIDVdICYgMHhmZik8PDggfCAoY1sgNl0gJiAweGZmKTw8MTYgfCAoY1sgN10gJiAweGZmKTw8MjQsXG4gICAgICBqNiAgPSBwWyAwXSAmIDB4ZmYgfCAocFsgMV0gJiAweGZmKTw8OCB8IChwWyAyXSAmIDB4ZmYpPDwxNiB8IChwWyAzXSAmIDB4ZmYpPDwyNCxcbiAgICAgIGo3ICA9IHBbIDRdICYgMHhmZiB8IChwWyA1XSAmIDB4ZmYpPDw4IHwgKHBbIDZdICYgMHhmZik8PDE2IHwgKHBbIDddICYgMHhmZik8PDI0LFxuICAgICAgajggID0gcFsgOF0gJiAweGZmIHwgKHBbIDldICYgMHhmZik8PDggfCAocFsxMF0gJiAweGZmKTw8MTYgfCAocFsxMV0gJiAweGZmKTw8MjQsXG4gICAgICBqOSAgPSBwWzEyXSAmIDB4ZmYgfCAocFsxM10gJiAweGZmKTw8OCB8IChwWzE0XSAmIDB4ZmYpPDwxNiB8IChwWzE1XSAmIDB4ZmYpPDwyNCxcbiAgICAgIGoxMCA9IGNbIDhdICYgMHhmZiB8IChjWyA5XSAmIDB4ZmYpPDw4IHwgKGNbMTBdICYgMHhmZik8PDE2IHwgKGNbMTFdICYgMHhmZik8PDI0LFxuICAgICAgajExID0ga1sxNl0gJiAweGZmIHwgKGtbMTddICYgMHhmZik8PDggfCAoa1sxOF0gJiAweGZmKTw8MTYgfCAoa1sxOV0gJiAweGZmKTw8MjQsXG4gICAgICBqMTIgPSBrWzIwXSAmIDB4ZmYgfCAoa1syMV0gJiAweGZmKTw8OCB8IChrWzIyXSAmIDB4ZmYpPDwxNiB8IChrWzIzXSAmIDB4ZmYpPDwyNCxcbiAgICAgIGoxMyA9IGtbMjRdICYgMHhmZiB8IChrWzI1XSAmIDB4ZmYpPDw4IHwgKGtbMjZdICYgMHhmZik8PDE2IHwgKGtbMjddICYgMHhmZik8PDI0LFxuICAgICAgajE0ID0ga1syOF0gJiAweGZmIHwgKGtbMjldICYgMHhmZik8PDggfCAoa1szMF0gJiAweGZmKTw8MTYgfCAoa1szMV0gJiAweGZmKTw8MjQsXG4gICAgICBqMTUgPSBjWzEyXSAmIDB4ZmYgfCAoY1sxM10gJiAweGZmKTw8OCB8IChjWzE0XSAmIDB4ZmYpPDwxNiB8IChjWzE1XSAmIDB4ZmYpPDwyNDtcblxuICB2YXIgeDAgPSBqMCwgeDEgPSBqMSwgeDIgPSBqMiwgeDMgPSBqMywgeDQgPSBqNCwgeDUgPSBqNSwgeDYgPSBqNiwgeDcgPSBqNyxcbiAgICAgIHg4ID0gajgsIHg5ID0gajksIHgxMCA9IGoxMCwgeDExID0gajExLCB4MTIgPSBqMTIsIHgxMyA9IGoxMywgeDE0ID0gajE0LFxuICAgICAgeDE1ID0gajE1LCB1O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMjA7IGkgKz0gMikge1xuICAgIHUgPSB4MCArIHgxMiB8IDA7XG4gICAgeDQgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XG4gICAgdSA9IHg0ICsgeDAgfCAwO1xuICAgIHg4IF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xuICAgIHUgPSB4OCArIHg0IHwgMDtcbiAgICB4MTIgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcbiAgICB1ID0geDEyICsgeDggfCAwO1xuICAgIHgwIF49IHU8PDE4IHwgdT4+PigzMi0xOCk7XG5cbiAgICB1ID0geDUgKyB4MSB8IDA7XG4gICAgeDkgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XG4gICAgdSA9IHg5ICsgeDUgfCAwO1xuICAgIHgxMyBePSB1PDw5IHwgdT4+PigzMi05KTtcbiAgICB1ID0geDEzICsgeDkgfCAwO1xuICAgIHgxIF49IHU8PDEzIHwgdT4+PigzMi0xMyk7XG4gICAgdSA9IHgxICsgeDEzIHwgMDtcbiAgICB4NSBePSB1PDwxOCB8IHU+Pj4oMzItMTgpO1xuXG4gICAgdSA9IHgxMCArIHg2IHwgMDtcbiAgICB4MTQgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XG4gICAgdSA9IHgxNCArIHgxMCB8IDA7XG4gICAgeDIgXj0gdTw8OSB8IHU+Pj4oMzItOSk7XG4gICAgdSA9IHgyICsgeDE0IHwgMDtcbiAgICB4NiBePSB1PDwxMyB8IHU+Pj4oMzItMTMpO1xuICAgIHUgPSB4NiArIHgyIHwgMDtcbiAgICB4MTAgXj0gdTw8MTggfCB1Pj4+KDMyLTE4KTtcblxuICAgIHUgPSB4MTUgKyB4MTEgfCAwO1xuICAgIHgzIF49IHU8PDcgfCB1Pj4+KDMyLTcpO1xuICAgIHUgPSB4MyArIHgxNSB8IDA7XG4gICAgeDcgXj0gdTw8OSB8IHU+Pj4oMzItOSk7XG4gICAgdSA9IHg3ICsgeDMgfCAwO1xuICAgIHgxMSBePSB1PDwxMyB8IHU+Pj4oMzItMTMpO1xuICAgIHUgPSB4MTEgKyB4NyB8IDA7XG4gICAgeDE1IF49IHU8PDE4IHwgdT4+PigzMi0xOCk7XG5cbiAgICB1ID0geDAgKyB4MyB8IDA7XG4gICAgeDEgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XG4gICAgdSA9IHgxICsgeDAgfCAwO1xuICAgIHgyIF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xuICAgIHUgPSB4MiArIHgxIHwgMDtcbiAgICB4MyBePSB1PDwxMyB8IHU+Pj4oMzItMTMpO1xuICAgIHUgPSB4MyArIHgyIHwgMDtcbiAgICB4MCBePSB1PDwxOCB8IHU+Pj4oMzItMTgpO1xuXG4gICAgdSA9IHg1ICsgeDQgfCAwO1xuICAgIHg2IF49IHU8PDcgfCB1Pj4+KDMyLTcpO1xuICAgIHUgPSB4NiArIHg1IHwgMDtcbiAgICB4NyBePSB1PDw5IHwgdT4+PigzMi05KTtcbiAgICB1ID0geDcgKyB4NiB8IDA7XG4gICAgeDQgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcbiAgICB1ID0geDQgKyB4NyB8IDA7XG4gICAgeDUgXj0gdTw8MTggfCB1Pj4+KDMyLTE4KTtcblxuICAgIHUgPSB4MTAgKyB4OSB8IDA7XG4gICAgeDExIF49IHU8PDcgfCB1Pj4+KDMyLTcpO1xuICAgIHUgPSB4MTEgKyB4MTAgfCAwO1xuICAgIHg4IF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xuICAgIHUgPSB4OCArIHgxMSB8IDA7XG4gICAgeDkgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcbiAgICB1ID0geDkgKyB4OCB8IDA7XG4gICAgeDEwIF49IHU8PDE4IHwgdT4+PigzMi0xOCk7XG5cbiAgICB1ID0geDE1ICsgeDE0IHwgMDtcbiAgICB4MTIgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XG4gICAgdSA9IHgxMiArIHgxNSB8IDA7XG4gICAgeDEzIF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xuICAgIHUgPSB4MTMgKyB4MTIgfCAwO1xuICAgIHgxNCBePSB1PDwxMyB8IHU+Pj4oMzItMTMpO1xuICAgIHUgPSB4MTQgKyB4MTMgfCAwO1xuICAgIHgxNSBePSB1PDwxOCB8IHU+Pj4oMzItMTgpO1xuICB9XG5cbiAgb1sgMF0gPSB4MCA+Pj4gIDAgJiAweGZmO1xuICBvWyAxXSA9IHgwID4+PiAgOCAmIDB4ZmY7XG4gIG9bIDJdID0geDAgPj4+IDE2ICYgMHhmZjtcbiAgb1sgM10gPSB4MCA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bIDRdID0geDUgPj4+ICAwICYgMHhmZjtcbiAgb1sgNV0gPSB4NSA+Pj4gIDggJiAweGZmO1xuICBvWyA2XSA9IHg1ID4+PiAxNiAmIDB4ZmY7XG4gIG9bIDddID0geDUgPj4+IDI0ICYgMHhmZjtcblxuICBvWyA4XSA9IHgxMCA+Pj4gIDAgJiAweGZmO1xuICBvWyA5XSA9IHgxMCA+Pj4gIDggJiAweGZmO1xuICBvWzEwXSA9IHgxMCA+Pj4gMTYgJiAweGZmO1xuICBvWzExXSA9IHgxMCA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bMTJdID0geDE1ID4+PiAgMCAmIDB4ZmY7XG4gIG9bMTNdID0geDE1ID4+PiAgOCAmIDB4ZmY7XG4gIG9bMTRdID0geDE1ID4+PiAxNiAmIDB4ZmY7XG4gIG9bMTVdID0geDE1ID4+PiAyNCAmIDB4ZmY7XG5cbiAgb1sxNl0gPSB4NiA+Pj4gIDAgJiAweGZmO1xuICBvWzE3XSA9IHg2ID4+PiAgOCAmIDB4ZmY7XG4gIG9bMThdID0geDYgPj4+IDE2ICYgMHhmZjtcbiAgb1sxOV0gPSB4NiA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bMjBdID0geDcgPj4+ICAwICYgMHhmZjtcbiAgb1syMV0gPSB4NyA+Pj4gIDggJiAweGZmO1xuICBvWzIyXSA9IHg3ID4+PiAxNiAmIDB4ZmY7XG4gIG9bMjNdID0geDcgPj4+IDI0ICYgMHhmZjtcblxuICBvWzI0XSA9IHg4ID4+PiAgMCAmIDB4ZmY7XG4gIG9bMjVdID0geDggPj4+ICA4ICYgMHhmZjtcbiAgb1syNl0gPSB4OCA+Pj4gMTYgJiAweGZmO1xuICBvWzI3XSA9IHg4ID4+PiAyNCAmIDB4ZmY7XG5cbiAgb1syOF0gPSB4OSA+Pj4gIDAgJiAweGZmO1xuICBvWzI5XSA9IHg5ID4+PiAgOCAmIDB4ZmY7XG4gIG9bMzBdID0geDkgPj4+IDE2ICYgMHhmZjtcbiAgb1szMV0gPSB4OSA+Pj4gMjQgJiAweGZmO1xufVxuXG5mdW5jdGlvbiBjcnlwdG9fY29yZV9zYWxzYTIwKG91dCxpbnAsayxjKSB7XG4gIGNvcmVfc2Fsc2EyMChvdXQsaW5wLGssYyk7XG59XG5cbmZ1bmN0aW9uIGNyeXB0b19jb3JlX2hzYWxzYTIwKG91dCxpbnAsayxjKSB7XG4gIGNvcmVfaHNhbHNhMjAob3V0LGlucCxrLGMpO1xufVxuXG52YXIgc2lnbWEgPSBuZXcgVWludDhBcnJheShbMTAxLCAxMjAsIDExMiwgOTcsIDExMCwgMTAwLCAzMiwgNTEsIDUwLCA0NSwgOTgsIDEyMSwgMTE2LCAxMDEsIDMyLCAxMDddKTtcbiAgICAgICAgICAgIC8vIFwiZXhwYW5kIDMyLWJ5dGUga1wiXG5cbmZ1bmN0aW9uIGNyeXB0b19zdHJlYW1fc2Fsc2EyMF94b3IoYyxjcG9zLG0sbXBvcyxiLG4saykge1xuICB2YXIgeiA9IG5ldyBVaW50OEFycmF5KDE2KSwgeCA9IG5ldyBVaW50OEFycmF5KDY0KTtcbiAgdmFyIHUsIGk7XG4gIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSB6W2ldID0gMDtcbiAgZm9yIChpID0gMDsgaSA8IDg7IGkrKykgeltpXSA9IG5baV07XG4gIHdoaWxlIChiID49IDY0KSB7XG4gICAgY3J5cHRvX2NvcmVfc2Fsc2EyMCh4LHosayxzaWdtYSk7XG4gICAgZm9yIChpID0gMDsgaSA8IDY0OyBpKyspIGNbY3BvcytpXSA9IG1bbXBvcytpXSBeIHhbaV07XG4gICAgdSA9IDE7XG4gICAgZm9yIChpID0gODsgaSA8IDE2OyBpKyspIHtcbiAgICAgIHUgPSB1ICsgKHpbaV0gJiAweGZmKSB8IDA7XG4gICAgICB6W2ldID0gdSAmIDB4ZmY7XG4gICAgICB1ID4+Pj0gODtcbiAgICB9XG4gICAgYiAtPSA2NDtcbiAgICBjcG9zICs9IDY0O1xuICAgIG1wb3MgKz0gNjQ7XG4gIH1cbiAgaWYgKGIgPiAwKSB7XG4gICAgY3J5cHRvX2NvcmVfc2Fsc2EyMCh4LHosayxzaWdtYSk7XG4gICAgZm9yIChpID0gMDsgaSA8IGI7IGkrKykgY1tjcG9zK2ldID0gbVttcG9zK2ldIF4geFtpXTtcbiAgfVxuICByZXR1cm4gMDtcbn1cblxuZnVuY3Rpb24gY3J5cHRvX3N0cmVhbV9zYWxzYTIwKGMsY3BvcyxiLG4saykge1xuICB2YXIgeiA9IG5ldyBVaW50OEFycmF5KDE2KSwgeCA9IG5ldyBVaW50OEFycmF5KDY0KTtcbiAgdmFyIHUsIGk7XG4gIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSB6W2ldID0gMDtcbiAgZm9yIChpID0gMDsgaSA8IDg7IGkrKykgeltpXSA9IG5baV07XG4gIHdoaWxlIChiID49IDY0KSB7XG4gICAgY3J5cHRvX2NvcmVfc2Fsc2EyMCh4LHosayxzaWdtYSk7XG4gICAgZm9yIChpID0gMDsgaSA8IDY0OyBpKyspIGNbY3BvcytpXSA9IHhbaV07XG4gICAgdSA9IDE7XG4gICAgZm9yIChpID0gODsgaSA8IDE2OyBpKyspIHtcbiAgICAgIHUgPSB1ICsgKHpbaV0gJiAweGZmKSB8IDA7XG4gICAgICB6W2ldID0gdSAmIDB4ZmY7XG4gICAgICB1ID4+Pj0gODtcbiAgICB9XG4gICAgYiAtPSA2NDtcbiAgICBjcG9zICs9IDY0O1xuICB9XG4gIGlmIChiID4gMCkge1xuICAgIGNyeXB0b19jb3JlX3NhbHNhMjAoeCx6LGssc2lnbWEpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBiOyBpKyspIGNbY3BvcytpXSA9IHhbaV07XG4gIH1cbiAgcmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIGNyeXB0b19zdHJlYW0oYyxjcG9zLGQsbixrKSB7XG4gIHZhciBzID0gbmV3IFVpbnQ4QXJyYXkoMzIpO1xuICBjcnlwdG9fY29yZV9oc2Fsc2EyMChzLG4sayxzaWdtYSk7XG4gIHZhciBzbiA9IG5ldyBVaW50OEFycmF5KDgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IDg7IGkrKykgc25baV0gPSBuW2krMTZdO1xuICByZXR1cm4gY3J5cHRvX3N0cmVhbV9zYWxzYTIwKGMsY3BvcyxkLHNuLHMpO1xufVxuXG5mdW5jdGlvbiBjcnlwdG9fc3RyZWFtX3hvcihjLGNwb3MsbSxtcG9zLGQsbixrKSB7XG4gIHZhciBzID0gbmV3IFVpbnQ4QXJyYXkoMzIpO1xuICBjcnlwdG9fY29yZV9oc2Fsc2EyMChzLG4sayxzaWdtYSk7XG4gIHZhciBzbiA9IG5ldyBVaW50OEFycmF5KDgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IDg7IGkrKykgc25baV0gPSBuW2krMTZdO1xuICByZXR1cm4gY3J5cHRvX3N0cmVhbV9zYWxzYTIwX3hvcihjLGNwb3MsbSxtcG9zLGQsc24scyk7XG59XG5cbi8qXG4qIFBvcnQgb2YgQW5kcmV3IE1vb24ncyBQb2x5MTMwNS1kb25uYS0xNi4gUHVibGljIGRvbWFpbi5cbiogaHR0cHM6Ly9naXRodWIuY29tL2Zsb29keWJlcnJ5L3BvbHkxMzA1LWRvbm5hXG4qL1xuXG52YXIgcG9seTEzMDUgPSBmdW5jdGlvbihrZXkpIHtcbiAgdGhpcy5idWZmZXIgPSBuZXcgVWludDhBcnJheSgxNik7XG4gIHRoaXMuciA9IG5ldyBVaW50MTZBcnJheSgxMCk7XG4gIHRoaXMuaCA9IG5ldyBVaW50MTZBcnJheSgxMCk7XG4gIHRoaXMucGFkID0gbmV3IFVpbnQxNkFycmF5KDgpO1xuICB0aGlzLmxlZnRvdmVyID0gMDtcbiAgdGhpcy5maW4gPSAwO1xuXG4gIHZhciB0MCwgdDEsIHQyLCB0MywgdDQsIHQ1LCB0NiwgdDc7XG5cbiAgdDAgPSBrZXlbIDBdICYgMHhmZiB8IChrZXlbIDFdICYgMHhmZikgPDwgODsgdGhpcy5yWzBdID0gKCB0MCAgICAgICAgICAgICAgICAgICAgICkgJiAweDFmZmY7XG4gIHQxID0ga2V5WyAyXSAmIDB4ZmYgfCAoa2V5WyAzXSAmIDB4ZmYpIDw8IDg7IHRoaXMuclsxXSA9ICgodDAgPj4+IDEzKSB8ICh0MSA8PCAgMykpICYgMHgxZmZmO1xuICB0MiA9IGtleVsgNF0gJiAweGZmIHwgKGtleVsgNV0gJiAweGZmKSA8PCA4OyB0aGlzLnJbMl0gPSAoKHQxID4+PiAxMCkgfCAodDIgPDwgIDYpKSAmIDB4MWYwMztcbiAgdDMgPSBrZXlbIDZdICYgMHhmZiB8IChrZXlbIDddICYgMHhmZikgPDwgODsgdGhpcy5yWzNdID0gKCh0MiA+Pj4gIDcpIHwgKHQzIDw8ICA5KSkgJiAweDFmZmY7XG4gIHQ0ID0ga2V5WyA4XSAmIDB4ZmYgfCAoa2V5WyA5XSAmIDB4ZmYpIDw8IDg7IHRoaXMucls0XSA9ICgodDMgPj4+ICA0KSB8ICh0NCA8PCAxMikpICYgMHgwMGZmO1xuICB0aGlzLnJbNV0gPSAoKHQ0ID4+PiAgMSkpICYgMHgxZmZlO1xuICB0NSA9IGtleVsxMF0gJiAweGZmIHwgKGtleVsxMV0gJiAweGZmKSA8PCA4OyB0aGlzLnJbNl0gPSAoKHQ0ID4+PiAxNCkgfCAodDUgPDwgIDIpKSAmIDB4MWZmZjtcbiAgdDYgPSBrZXlbMTJdICYgMHhmZiB8IChrZXlbMTNdICYgMHhmZikgPDwgODsgdGhpcy5yWzddID0gKCh0NSA+Pj4gMTEpIHwgKHQ2IDw8ICA1KSkgJiAweDFmODE7XG4gIHQ3ID0ga2V5WzE0XSAmIDB4ZmYgfCAoa2V5WzE1XSAmIDB4ZmYpIDw8IDg7IHRoaXMucls4XSA9ICgodDYgPj4+ICA4KSB8ICh0NyA8PCAgOCkpICYgMHgxZmZmO1xuICB0aGlzLnJbOV0gPSAoKHQ3ID4+PiAgNSkpICYgMHgwMDdmO1xuXG4gIHRoaXMucGFkWzBdID0ga2V5WzE2XSAmIDB4ZmYgfCAoa2V5WzE3XSAmIDB4ZmYpIDw8IDg7XG4gIHRoaXMucGFkWzFdID0ga2V5WzE4XSAmIDB4ZmYgfCAoa2V5WzE5XSAmIDB4ZmYpIDw8IDg7XG4gIHRoaXMucGFkWzJdID0ga2V5WzIwXSAmIDB4ZmYgfCAoa2V5WzIxXSAmIDB4ZmYpIDw8IDg7XG4gIHRoaXMucGFkWzNdID0ga2V5WzIyXSAmIDB4ZmYgfCAoa2V5WzIzXSAmIDB4ZmYpIDw8IDg7XG4gIHRoaXMucGFkWzRdID0ga2V5WzI0XSAmIDB4ZmYgfCAoa2V5WzI1XSAmIDB4ZmYpIDw8IDg7XG4gIHRoaXMucGFkWzVdID0ga2V5WzI2XSAmIDB4ZmYgfCAoa2V5WzI3XSAmIDB4ZmYpIDw8IDg7XG4gIHRoaXMucGFkWzZdID0ga2V5WzI4XSAmIDB4ZmYgfCAoa2V5WzI5XSAmIDB4ZmYpIDw8IDg7XG4gIHRoaXMucGFkWzddID0ga2V5WzMwXSAmIDB4ZmYgfCAoa2V5WzMxXSAmIDB4ZmYpIDw8IDg7XG59O1xuXG5wb2x5MTMwNS5wcm90b3R5cGUuYmxvY2tzID0gZnVuY3Rpb24obSwgbXBvcywgYnl0ZXMpIHtcbiAgdmFyIGhpYml0ID0gdGhpcy5maW4gPyAwIDogKDEgPDwgMTEpO1xuICB2YXIgdDAsIHQxLCB0MiwgdDMsIHQ0LCB0NSwgdDYsIHQ3LCBjO1xuICB2YXIgZDAsIGQxLCBkMiwgZDMsIGQ0LCBkNSwgZDYsIGQ3LCBkOCwgZDk7XG5cbiAgdmFyIGgwID0gdGhpcy5oWzBdLFxuICAgICAgaDEgPSB0aGlzLmhbMV0sXG4gICAgICBoMiA9IHRoaXMuaFsyXSxcbiAgICAgIGgzID0gdGhpcy5oWzNdLFxuICAgICAgaDQgPSB0aGlzLmhbNF0sXG4gICAgICBoNSA9IHRoaXMuaFs1XSxcbiAgICAgIGg2ID0gdGhpcy5oWzZdLFxuICAgICAgaDcgPSB0aGlzLmhbN10sXG4gICAgICBoOCA9IHRoaXMuaFs4XSxcbiAgICAgIGg5ID0gdGhpcy5oWzldO1xuXG4gIHZhciByMCA9IHRoaXMuclswXSxcbiAgICAgIHIxID0gdGhpcy5yWzFdLFxuICAgICAgcjIgPSB0aGlzLnJbMl0sXG4gICAgICByMyA9IHRoaXMuclszXSxcbiAgICAgIHI0ID0gdGhpcy5yWzRdLFxuICAgICAgcjUgPSB0aGlzLnJbNV0sXG4gICAgICByNiA9IHRoaXMucls2XSxcbiAgICAgIHI3ID0gdGhpcy5yWzddLFxuICAgICAgcjggPSB0aGlzLnJbOF0sXG4gICAgICByOSA9IHRoaXMucls5XTtcblxuICB3aGlsZSAoYnl0ZXMgPj0gMTYpIHtcbiAgICB0MCA9IG1bbXBvcysgMF0gJiAweGZmIHwgKG1bbXBvcysgMV0gJiAweGZmKSA8PCA4OyBoMCArPSAoIHQwICAgICAgICAgICAgICAgICAgICAgKSAmIDB4MWZmZjtcbiAgICB0MSA9IG1bbXBvcysgMl0gJiAweGZmIHwgKG1bbXBvcysgM10gJiAweGZmKSA8PCA4OyBoMSArPSAoKHQwID4+PiAxMykgfCAodDEgPDwgIDMpKSAmIDB4MWZmZjtcbiAgICB0MiA9IG1bbXBvcysgNF0gJiAweGZmIHwgKG1bbXBvcysgNV0gJiAweGZmKSA8PCA4OyBoMiArPSAoKHQxID4+PiAxMCkgfCAodDIgPDwgIDYpKSAmIDB4MWZmZjtcbiAgICB0MyA9IG1bbXBvcysgNl0gJiAweGZmIHwgKG1bbXBvcysgN10gJiAweGZmKSA8PCA4OyBoMyArPSAoKHQyID4+PiAgNykgfCAodDMgPDwgIDkpKSAmIDB4MWZmZjtcbiAgICB0NCA9IG1bbXBvcysgOF0gJiAweGZmIHwgKG1bbXBvcysgOV0gJiAweGZmKSA8PCA4OyBoNCArPSAoKHQzID4+PiAgNCkgfCAodDQgPDwgMTIpKSAmIDB4MWZmZjtcbiAgICBoNSArPSAoKHQ0ID4+PiAgMSkpICYgMHgxZmZmO1xuICAgIHQ1ID0gbVttcG9zKzEwXSAmIDB4ZmYgfCAobVttcG9zKzExXSAmIDB4ZmYpIDw8IDg7IGg2ICs9ICgodDQgPj4+IDE0KSB8ICh0NSA8PCAgMikpICYgMHgxZmZmO1xuICAgIHQ2ID0gbVttcG9zKzEyXSAmIDB4ZmYgfCAobVttcG9zKzEzXSAmIDB4ZmYpIDw8IDg7IGg3ICs9ICgodDUgPj4+IDExKSB8ICh0NiA8PCAgNSkpICYgMHgxZmZmO1xuICAgIHQ3ID0gbVttcG9zKzE0XSAmIDB4ZmYgfCAobVttcG9zKzE1XSAmIDB4ZmYpIDw8IDg7IGg4ICs9ICgodDYgPj4+ICA4KSB8ICh0NyA8PCAgOCkpICYgMHgxZmZmO1xuICAgIGg5ICs9ICgodDcgPj4+IDUpKSB8IGhpYml0O1xuXG4gICAgYyA9IDA7XG5cbiAgICBkMCA9IGM7XG4gICAgZDAgKz0gaDAgKiByMDtcbiAgICBkMCArPSBoMSAqICg1ICogcjkpO1xuICAgIGQwICs9IGgyICogKDUgKiByOCk7XG4gICAgZDAgKz0gaDMgKiAoNSAqIHI3KTtcbiAgICBkMCArPSBoNCAqICg1ICogcjYpO1xuICAgIGMgPSAoZDAgPj4+IDEzKTsgZDAgJj0gMHgxZmZmO1xuICAgIGQwICs9IGg1ICogKDUgKiByNSk7XG4gICAgZDAgKz0gaDYgKiAoNSAqIHI0KTtcbiAgICBkMCArPSBoNyAqICg1ICogcjMpO1xuICAgIGQwICs9IGg4ICogKDUgKiByMik7XG4gICAgZDAgKz0gaDkgKiAoNSAqIHIxKTtcbiAgICBjICs9IChkMCA+Pj4gMTMpOyBkMCAmPSAweDFmZmY7XG5cbiAgICBkMSA9IGM7XG4gICAgZDEgKz0gaDAgKiByMTtcbiAgICBkMSArPSBoMSAqIHIwO1xuICAgIGQxICs9IGgyICogKDUgKiByOSk7XG4gICAgZDEgKz0gaDMgKiAoNSAqIHI4KTtcbiAgICBkMSArPSBoNCAqICg1ICogcjcpO1xuICAgIGMgPSAoZDEgPj4+IDEzKTsgZDEgJj0gMHgxZmZmO1xuICAgIGQxICs9IGg1ICogKDUgKiByNik7XG4gICAgZDEgKz0gaDYgKiAoNSAqIHI1KTtcbiAgICBkMSArPSBoNyAqICg1ICogcjQpO1xuICAgIGQxICs9IGg4ICogKDUgKiByMyk7XG4gICAgZDEgKz0gaDkgKiAoNSAqIHIyKTtcbiAgICBjICs9IChkMSA+Pj4gMTMpOyBkMSAmPSAweDFmZmY7XG5cbiAgICBkMiA9IGM7XG4gICAgZDIgKz0gaDAgKiByMjtcbiAgICBkMiArPSBoMSAqIHIxO1xuICAgIGQyICs9IGgyICogcjA7XG4gICAgZDIgKz0gaDMgKiAoNSAqIHI5KTtcbiAgICBkMiArPSBoNCAqICg1ICogcjgpO1xuICAgIGMgPSAoZDIgPj4+IDEzKTsgZDIgJj0gMHgxZmZmO1xuICAgIGQyICs9IGg1ICogKDUgKiByNyk7XG4gICAgZDIgKz0gaDYgKiAoNSAqIHI2KTtcbiAgICBkMiArPSBoNyAqICg1ICogcjUpO1xuICAgIGQyICs9IGg4ICogKDUgKiByNCk7XG4gICAgZDIgKz0gaDkgKiAoNSAqIHIzKTtcbiAgICBjICs9IChkMiA+Pj4gMTMpOyBkMiAmPSAweDFmZmY7XG5cbiAgICBkMyA9IGM7XG4gICAgZDMgKz0gaDAgKiByMztcbiAgICBkMyArPSBoMSAqIHIyO1xuICAgIGQzICs9IGgyICogcjE7XG4gICAgZDMgKz0gaDMgKiByMDtcbiAgICBkMyArPSBoNCAqICg1ICogcjkpO1xuICAgIGMgPSAoZDMgPj4+IDEzKTsgZDMgJj0gMHgxZmZmO1xuICAgIGQzICs9IGg1ICogKDUgKiByOCk7XG4gICAgZDMgKz0gaDYgKiAoNSAqIHI3KTtcbiAgICBkMyArPSBoNyAqICg1ICogcjYpO1xuICAgIGQzICs9IGg4ICogKDUgKiByNSk7XG4gICAgZDMgKz0gaDkgKiAoNSAqIHI0KTtcbiAgICBjICs9IChkMyA+Pj4gMTMpOyBkMyAmPSAweDFmZmY7XG5cbiAgICBkNCA9IGM7XG4gICAgZDQgKz0gaDAgKiByNDtcbiAgICBkNCArPSBoMSAqIHIzO1xuICAgIGQ0ICs9IGgyICogcjI7XG4gICAgZDQgKz0gaDMgKiByMTtcbiAgICBkNCArPSBoNCAqIHIwO1xuICAgIGMgPSAoZDQgPj4+IDEzKTsgZDQgJj0gMHgxZmZmO1xuICAgIGQ0ICs9IGg1ICogKDUgKiByOSk7XG4gICAgZDQgKz0gaDYgKiAoNSAqIHI4KTtcbiAgICBkNCArPSBoNyAqICg1ICogcjcpO1xuICAgIGQ0ICs9IGg4ICogKDUgKiByNik7XG4gICAgZDQgKz0gaDkgKiAoNSAqIHI1KTtcbiAgICBjICs9IChkNCA+Pj4gMTMpOyBkNCAmPSAweDFmZmY7XG5cbiAgICBkNSA9IGM7XG4gICAgZDUgKz0gaDAgKiByNTtcbiAgICBkNSArPSBoMSAqIHI0O1xuICAgIGQ1ICs9IGgyICogcjM7XG4gICAgZDUgKz0gaDMgKiByMjtcbiAgICBkNSArPSBoNCAqIHIxO1xuICAgIGMgPSAoZDUgPj4+IDEzKTsgZDUgJj0gMHgxZmZmO1xuICAgIGQ1ICs9IGg1ICogcjA7XG4gICAgZDUgKz0gaDYgKiAoNSAqIHI5KTtcbiAgICBkNSArPSBoNyAqICg1ICogcjgpO1xuICAgIGQ1ICs9IGg4ICogKDUgKiByNyk7XG4gICAgZDUgKz0gaDkgKiAoNSAqIHI2KTtcbiAgICBjICs9IChkNSA+Pj4gMTMpOyBkNSAmPSAweDFmZmY7XG5cbiAgICBkNiA9IGM7XG4gICAgZDYgKz0gaDAgKiByNjtcbiAgICBkNiArPSBoMSAqIHI1O1xuICAgIGQ2ICs9IGgyICogcjQ7XG4gICAgZDYgKz0gaDMgKiByMztcbiAgICBkNiArPSBoNCAqIHIyO1xuICAgIGMgPSAoZDYgPj4+IDEzKTsgZDYgJj0gMHgxZmZmO1xuICAgIGQ2ICs9IGg1ICogcjE7XG4gICAgZDYgKz0gaDYgKiByMDtcbiAgICBkNiArPSBoNyAqICg1ICogcjkpO1xuICAgIGQ2ICs9IGg4ICogKDUgKiByOCk7XG4gICAgZDYgKz0gaDkgKiAoNSAqIHI3KTtcbiAgICBjICs9IChkNiA+Pj4gMTMpOyBkNiAmPSAweDFmZmY7XG5cbiAgICBkNyA9IGM7XG4gICAgZDcgKz0gaDAgKiByNztcbiAgICBkNyArPSBoMSAqIHI2O1xuICAgIGQ3ICs9IGgyICogcjU7XG4gICAgZDcgKz0gaDMgKiByNDtcbiAgICBkNyArPSBoNCAqIHIzO1xuICAgIGMgPSAoZDcgPj4+IDEzKTsgZDcgJj0gMHgxZmZmO1xuICAgIGQ3ICs9IGg1ICogcjI7XG4gICAgZDcgKz0gaDYgKiByMTtcbiAgICBkNyArPSBoNyAqIHIwO1xuICAgIGQ3ICs9IGg4ICogKDUgKiByOSk7XG4gICAgZDcgKz0gaDkgKiAoNSAqIHI4KTtcbiAgICBjICs9IChkNyA+Pj4gMTMpOyBkNyAmPSAweDFmZmY7XG5cbiAgICBkOCA9IGM7XG4gICAgZDggKz0gaDAgKiByODtcbiAgICBkOCArPSBoMSAqIHI3O1xuICAgIGQ4ICs9IGgyICogcjY7XG4gICAgZDggKz0gaDMgKiByNTtcbiAgICBkOCArPSBoNCAqIHI0O1xuICAgIGMgPSAoZDggPj4+IDEzKTsgZDggJj0gMHgxZmZmO1xuICAgIGQ4ICs9IGg1ICogcjM7XG4gICAgZDggKz0gaDYgKiByMjtcbiAgICBkOCArPSBoNyAqIHIxO1xuICAgIGQ4ICs9IGg4ICogcjA7XG4gICAgZDggKz0gaDkgKiAoNSAqIHI5KTtcbiAgICBjICs9IChkOCA+Pj4gMTMpOyBkOCAmPSAweDFmZmY7XG5cbiAgICBkOSA9IGM7XG4gICAgZDkgKz0gaDAgKiByOTtcbiAgICBkOSArPSBoMSAqIHI4O1xuICAgIGQ5ICs9IGgyICogcjc7XG4gICAgZDkgKz0gaDMgKiByNjtcbiAgICBkOSArPSBoNCAqIHI1O1xuICAgIGMgPSAoZDkgPj4+IDEzKTsgZDkgJj0gMHgxZmZmO1xuICAgIGQ5ICs9IGg1ICogcjQ7XG4gICAgZDkgKz0gaDYgKiByMztcbiAgICBkOSArPSBoNyAqIHIyO1xuICAgIGQ5ICs9IGg4ICogcjE7XG4gICAgZDkgKz0gaDkgKiByMDtcbiAgICBjICs9IChkOSA+Pj4gMTMpOyBkOSAmPSAweDFmZmY7XG5cbiAgICBjID0gKCgoYyA8PCAyKSArIGMpKSB8IDA7XG4gICAgYyA9IChjICsgZDApIHwgMDtcbiAgICBkMCA9IGMgJiAweDFmZmY7XG4gICAgYyA9IChjID4+PiAxMyk7XG4gICAgZDEgKz0gYztcblxuICAgIGgwID0gZDA7XG4gICAgaDEgPSBkMTtcbiAgICBoMiA9IGQyO1xuICAgIGgzID0gZDM7XG4gICAgaDQgPSBkNDtcbiAgICBoNSA9IGQ1O1xuICAgIGg2ID0gZDY7XG4gICAgaDcgPSBkNztcbiAgICBoOCA9IGQ4O1xuICAgIGg5ID0gZDk7XG5cbiAgICBtcG9zICs9IDE2O1xuICAgIGJ5dGVzIC09IDE2O1xuICB9XG4gIHRoaXMuaFswXSA9IGgwO1xuICB0aGlzLmhbMV0gPSBoMTtcbiAgdGhpcy5oWzJdID0gaDI7XG4gIHRoaXMuaFszXSA9IGgzO1xuICB0aGlzLmhbNF0gPSBoNDtcbiAgdGhpcy5oWzVdID0gaDU7XG4gIHRoaXMuaFs2XSA9IGg2O1xuICB0aGlzLmhbN10gPSBoNztcbiAgdGhpcy5oWzhdID0gaDg7XG4gIHRoaXMuaFs5XSA9IGg5O1xufTtcblxucG9seTEzMDUucHJvdG90eXBlLmZpbmlzaCA9IGZ1bmN0aW9uKG1hYywgbWFjcG9zKSB7XG4gIHZhciBnID0gbmV3IFVpbnQxNkFycmF5KDEwKTtcbiAgdmFyIGMsIG1hc2ssIGYsIGk7XG5cbiAgaWYgKHRoaXMubGVmdG92ZXIpIHtcbiAgICBpID0gdGhpcy5sZWZ0b3ZlcjtcbiAgICB0aGlzLmJ1ZmZlcltpKytdID0gMTtcbiAgICBmb3IgKDsgaSA8IDE2OyBpKyspIHRoaXMuYnVmZmVyW2ldID0gMDtcbiAgICB0aGlzLmZpbiA9IDE7XG4gICAgdGhpcy5ibG9ja3ModGhpcy5idWZmZXIsIDAsIDE2KTtcbiAgfVxuXG4gIGMgPSB0aGlzLmhbMV0gPj4+IDEzO1xuICB0aGlzLmhbMV0gJj0gMHgxZmZmO1xuICBmb3IgKGkgPSAyOyBpIDwgMTA7IGkrKykge1xuICAgIHRoaXMuaFtpXSArPSBjO1xuICAgIGMgPSB0aGlzLmhbaV0gPj4+IDEzO1xuICAgIHRoaXMuaFtpXSAmPSAweDFmZmY7XG4gIH1cbiAgdGhpcy5oWzBdICs9IChjICogNSk7XG4gIGMgPSB0aGlzLmhbMF0gPj4+IDEzO1xuICB0aGlzLmhbMF0gJj0gMHgxZmZmO1xuICB0aGlzLmhbMV0gKz0gYztcbiAgYyA9IHRoaXMuaFsxXSA+Pj4gMTM7XG4gIHRoaXMuaFsxXSAmPSAweDFmZmY7XG4gIHRoaXMuaFsyXSArPSBjO1xuXG4gIGdbMF0gPSB0aGlzLmhbMF0gKyA1O1xuICBjID0gZ1swXSA+Pj4gMTM7XG4gIGdbMF0gJj0gMHgxZmZmO1xuICBmb3IgKGkgPSAxOyBpIDwgMTA7IGkrKykge1xuICAgIGdbaV0gPSB0aGlzLmhbaV0gKyBjO1xuICAgIGMgPSBnW2ldID4+PiAxMztcbiAgICBnW2ldICY9IDB4MWZmZjtcbiAgfVxuICBnWzldIC09ICgxIDw8IDEzKTtcblxuICBtYXNrID0gKGMgXiAxKSAtIDE7XG4gIGZvciAoaSA9IDA7IGkgPCAxMDsgaSsrKSBnW2ldICY9IG1hc2s7XG4gIG1hc2sgPSB+bWFzaztcbiAgZm9yIChpID0gMDsgaSA8IDEwOyBpKyspIHRoaXMuaFtpXSA9ICh0aGlzLmhbaV0gJiBtYXNrKSB8IGdbaV07XG5cbiAgdGhpcy5oWzBdID0gKCh0aGlzLmhbMF0gICAgICAgKSB8ICh0aGlzLmhbMV0gPDwgMTMpICAgICAgICAgICAgICAgICAgICApICYgMHhmZmZmO1xuICB0aGlzLmhbMV0gPSAoKHRoaXMuaFsxXSA+Pj4gIDMpIHwgKHRoaXMuaFsyXSA8PCAxMCkgICAgICAgICAgICAgICAgICAgICkgJiAweGZmZmY7XG4gIHRoaXMuaFsyXSA9ICgodGhpcy5oWzJdID4+PiAgNikgfCAodGhpcy5oWzNdIDw8ICA3KSAgICAgICAgICAgICAgICAgICAgKSAmIDB4ZmZmZjtcbiAgdGhpcy5oWzNdID0gKCh0aGlzLmhbM10gPj4+ICA5KSB8ICh0aGlzLmhbNF0gPDwgIDQpICAgICAgICAgICAgICAgICAgICApICYgMHhmZmZmO1xuICB0aGlzLmhbNF0gPSAoKHRoaXMuaFs0XSA+Pj4gMTIpIHwgKHRoaXMuaFs1XSA8PCAgMSkgfCAodGhpcy5oWzZdIDw8IDE0KSkgJiAweGZmZmY7XG4gIHRoaXMuaFs1XSA9ICgodGhpcy5oWzZdID4+PiAgMikgfCAodGhpcy5oWzddIDw8IDExKSAgICAgICAgICAgICAgICAgICAgKSAmIDB4ZmZmZjtcbiAgdGhpcy5oWzZdID0gKCh0aGlzLmhbN10gPj4+ICA1KSB8ICh0aGlzLmhbOF0gPDwgIDgpICAgICAgICAgICAgICAgICAgICApICYgMHhmZmZmO1xuICB0aGlzLmhbN10gPSAoKHRoaXMuaFs4XSA+Pj4gIDgpIHwgKHRoaXMuaFs5XSA8PCAgNSkgICAgICAgICAgICAgICAgICAgICkgJiAweGZmZmY7XG5cbiAgZiA9IHRoaXMuaFswXSArIHRoaXMucGFkWzBdO1xuICB0aGlzLmhbMF0gPSBmICYgMHhmZmZmO1xuICBmb3IgKGkgPSAxOyBpIDwgODsgaSsrKSB7XG4gICAgZiA9ICgoKHRoaXMuaFtpXSArIHRoaXMucGFkW2ldKSB8IDApICsgKGYgPj4+IDE2KSkgfCAwO1xuICAgIHRoaXMuaFtpXSA9IGYgJiAweGZmZmY7XG4gIH1cblxuICBtYWNbbWFjcG9zKyAwXSA9ICh0aGlzLmhbMF0gPj4+IDApICYgMHhmZjtcbiAgbWFjW21hY3BvcysgMV0gPSAodGhpcy5oWzBdID4+PiA4KSAmIDB4ZmY7XG4gIG1hY1ttYWNwb3MrIDJdID0gKHRoaXMuaFsxXSA+Pj4gMCkgJiAweGZmO1xuICBtYWNbbWFjcG9zKyAzXSA9ICh0aGlzLmhbMV0gPj4+IDgpICYgMHhmZjtcbiAgbWFjW21hY3BvcysgNF0gPSAodGhpcy5oWzJdID4+PiAwKSAmIDB4ZmY7XG4gIG1hY1ttYWNwb3MrIDVdID0gKHRoaXMuaFsyXSA+Pj4gOCkgJiAweGZmO1xuICBtYWNbbWFjcG9zKyA2XSA9ICh0aGlzLmhbM10gPj4+IDApICYgMHhmZjtcbiAgbWFjW21hY3BvcysgN10gPSAodGhpcy5oWzNdID4+PiA4KSAmIDB4ZmY7XG4gIG1hY1ttYWNwb3MrIDhdID0gKHRoaXMuaFs0XSA+Pj4gMCkgJiAweGZmO1xuICBtYWNbbWFjcG9zKyA5XSA9ICh0aGlzLmhbNF0gPj4+IDgpICYgMHhmZjtcbiAgbWFjW21hY3BvcysxMF0gPSAodGhpcy5oWzVdID4+PiAwKSAmIDB4ZmY7XG4gIG1hY1ttYWNwb3MrMTFdID0gKHRoaXMuaFs1XSA+Pj4gOCkgJiAweGZmO1xuICBtYWNbbWFjcG9zKzEyXSA9ICh0aGlzLmhbNl0gPj4+IDApICYgMHhmZjtcbiAgbWFjW21hY3BvcysxM10gPSAodGhpcy5oWzZdID4+PiA4KSAmIDB4ZmY7XG4gIG1hY1ttYWNwb3MrMTRdID0gKHRoaXMuaFs3XSA+Pj4gMCkgJiAweGZmO1xuICBtYWNbbWFjcG9zKzE1XSA9ICh0aGlzLmhbN10gPj4+IDgpICYgMHhmZjtcbn07XG5cbnBvbHkxMzA1LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihtLCBtcG9zLCBieXRlcykge1xuICB2YXIgaSwgd2FudDtcblxuICBpZiAodGhpcy5sZWZ0b3Zlcikge1xuICAgIHdhbnQgPSAoMTYgLSB0aGlzLmxlZnRvdmVyKTtcbiAgICBpZiAod2FudCA+IGJ5dGVzKVxuICAgICAgd2FudCA9IGJ5dGVzO1xuICAgIGZvciAoaSA9IDA7IGkgPCB3YW50OyBpKyspXG4gICAgICB0aGlzLmJ1ZmZlclt0aGlzLmxlZnRvdmVyICsgaV0gPSBtW21wb3MraV07XG4gICAgYnl0ZXMgLT0gd2FudDtcbiAgICBtcG9zICs9IHdhbnQ7XG4gICAgdGhpcy5sZWZ0b3ZlciArPSB3YW50O1xuICAgIGlmICh0aGlzLmxlZnRvdmVyIDwgMTYpXG4gICAgICByZXR1cm47XG4gICAgdGhpcy5ibG9ja3ModGhpcy5idWZmZXIsIDAsIDE2KTtcbiAgICB0aGlzLmxlZnRvdmVyID0gMDtcbiAgfVxuXG4gIGlmIChieXRlcyA+PSAxNikge1xuICAgIHdhbnQgPSBieXRlcyAtIChieXRlcyAlIDE2KTtcbiAgICB0aGlzLmJsb2NrcyhtLCBtcG9zLCB3YW50KTtcbiAgICBtcG9zICs9IHdhbnQ7XG4gICAgYnl0ZXMgLT0gd2FudDtcbiAgfVxuXG4gIGlmIChieXRlcykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBieXRlczsgaSsrKVxuICAgICAgdGhpcy5idWZmZXJbdGhpcy5sZWZ0b3ZlciArIGldID0gbVttcG9zK2ldO1xuICAgIHRoaXMubGVmdG92ZXIgKz0gYnl0ZXM7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGNyeXB0b19vbmV0aW1lYXV0aChvdXQsIG91dHBvcywgbSwgbXBvcywgbiwgaykge1xuICB2YXIgcyA9IG5ldyBwb2x5MTMwNShrKTtcbiAgcy51cGRhdGUobSwgbXBvcywgbik7XG4gIHMuZmluaXNoKG91dCwgb3V0cG9zKTtcbiAgcmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIGNyeXB0b19vbmV0aW1lYXV0aF92ZXJpZnkoaCwgaHBvcywgbSwgbXBvcywgbiwgaykge1xuICB2YXIgeCA9IG5ldyBVaW50OEFycmF5KDE2KTtcbiAgY3J5cHRvX29uZXRpbWVhdXRoKHgsMCxtLG1wb3MsbixrKTtcbiAgcmV0dXJuIGNyeXB0b192ZXJpZnlfMTYoaCxocG9zLHgsMCk7XG59XG5cbmZ1bmN0aW9uIGNyeXB0b19zZWNyZXRib3goYyxtLGQsbixrKSB7XG4gIHZhciBpO1xuICBpZiAoZCA8IDMyKSByZXR1cm4gLTE7XG4gIGNyeXB0b19zdHJlYW1feG9yKGMsMCxtLDAsZCxuLGspO1xuICBjcnlwdG9fb25ldGltZWF1dGgoYywgMTYsIGMsIDMyLCBkIC0gMzIsIGMpO1xuICBmb3IgKGkgPSAwOyBpIDwgMTY7IGkrKykgY1tpXSA9IDA7XG4gIHJldHVybiAwO1xufVxuXG5mdW5jdGlvbiBjcnlwdG9fc2VjcmV0Ym94X29wZW4obSxjLGQsbixrKSB7XG4gIHZhciBpO1xuICB2YXIgeCA9IG5ldyBVaW50OEFycmF5KDMyKTtcbiAgaWYgKGQgPCAzMikgcmV0dXJuIC0xO1xuICBjcnlwdG9fc3RyZWFtKHgsMCwzMixuLGspO1xuICBpZiAoY3J5cHRvX29uZXRpbWVhdXRoX3ZlcmlmeShjLCAxNixjLCAzMixkIC0gMzIseCkgIT09IDApIHJldHVybiAtMTtcbiAgY3J5cHRvX3N0cmVhbV94b3IobSwwLGMsMCxkLG4sayk7XG4gIGZvciAoaSA9IDA7IGkgPCAzMjsgaSsrKSBtW2ldID0gMDtcbiAgcmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIHNldDI1NTE5KHIsIGEpIHtcbiAgdmFyIGk7XG4gIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSByW2ldID0gYVtpXXwwO1xufVxuXG5mdW5jdGlvbiBjYXIyNTUxOShvKSB7XG4gIHZhciBpLCB2LCBjID0gMTtcbiAgZm9yIChpID0gMDsgaSA8IDE2OyBpKyspIHtcbiAgICB2ID0gb1tpXSArIGMgKyA2NTUzNTtcbiAgICBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpO1xuICAgIG9baV0gPSB2IC0gYyAqIDY1NTM2O1xuICB9XG4gIG9bMF0gKz0gYy0xICsgMzcgKiAoYy0xKTtcbn1cblxuZnVuY3Rpb24gc2VsMjU1MTkocCwgcSwgYikge1xuICB2YXIgdCwgYyA9IH4oYi0xKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgdCA9IGMgJiAocFtpXSBeIHFbaV0pO1xuICAgIHBbaV0gXj0gdDtcbiAgICBxW2ldIF49IHQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFjazI1NTE5KG8sIG4pIHtcbiAgdmFyIGksIGosIGI7XG4gIHZhciBtID0gZ2YoKSwgdCA9IGdmKCk7XG4gIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSB0W2ldID0gbltpXTtcbiAgY2FyMjU1MTkodCk7XG4gIGNhcjI1NTE5KHQpO1xuICBjYXIyNTUxOSh0KTtcbiAgZm9yIChqID0gMDsgaiA8IDI7IGorKykge1xuICAgIG1bMF0gPSB0WzBdIC0gMHhmZmVkO1xuICAgIGZvciAoaSA9IDE7IGkgPCAxNTsgaSsrKSB7XG4gICAgICBtW2ldID0gdFtpXSAtIDB4ZmZmZiAtICgobVtpLTFdPj4xNikgJiAxKTtcbiAgICAgIG1baS0xXSAmPSAweGZmZmY7XG4gICAgfVxuICAgIG1bMTVdID0gdFsxNV0gLSAweDdmZmYgLSAoKG1bMTRdPj4xNikgJiAxKTtcbiAgICBiID0gKG1bMTVdPj4xNikgJiAxO1xuICAgIG1bMTRdICY9IDB4ZmZmZjtcbiAgICBzZWwyNTUxOSh0LCBtLCAxLWIpO1xuICB9XG4gIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgb1syKmldID0gdFtpXSAmIDB4ZmY7XG4gICAgb1syKmkrMV0gPSB0W2ldPj44O1xuICB9XG59XG5cbmZ1bmN0aW9uIG5lcTI1NTE5KGEsIGIpIHtcbiAgdmFyIGMgPSBuZXcgVWludDhBcnJheSgzMiksIGQgPSBuZXcgVWludDhBcnJheSgzMik7XG4gIHBhY2syNTUxOShjLCBhKTtcbiAgcGFjazI1NTE5KGQsIGIpO1xuICByZXR1cm4gY3J5cHRvX3ZlcmlmeV8zMihjLCAwLCBkLCAwKTtcbn1cblxuZnVuY3Rpb24gcGFyMjU1MTkoYSkge1xuICB2YXIgZCA9IG5ldyBVaW50OEFycmF5KDMyKTtcbiAgcGFjazI1NTE5KGQsIGEpO1xuICByZXR1cm4gZFswXSAmIDE7XG59XG5cbmZ1bmN0aW9uIHVucGFjazI1NTE5KG8sIG4pIHtcbiAgdmFyIGk7XG4gIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSBvW2ldID0gblsyKmldICsgKG5bMippKzFdIDw8IDgpO1xuICBvWzE1XSAmPSAweDdmZmY7XG59XG5cbmZ1bmN0aW9uIEEobywgYSwgYikge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IDE2OyBpKyspIG9baV0gPSBhW2ldICsgYltpXTtcbn1cblxuZnVuY3Rpb24gWihvLCBhLCBiKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMTY7IGkrKykgb1tpXSA9IGFbaV0gLSBiW2ldO1xufVxuXG5mdW5jdGlvbiBNKG8sIGEsIGIpIHtcbiAgdmFyIHYsIGMsXG4gICAgIHQwID0gMCwgIHQxID0gMCwgIHQyID0gMCwgIHQzID0gMCwgIHQ0ID0gMCwgIHQ1ID0gMCwgIHQ2ID0gMCwgIHQ3ID0gMCxcbiAgICAgdDggPSAwLCAgdDkgPSAwLCB0MTAgPSAwLCB0MTEgPSAwLCB0MTIgPSAwLCB0MTMgPSAwLCB0MTQgPSAwLCB0MTUgPSAwLFxuICAgIHQxNiA9IDAsIHQxNyA9IDAsIHQxOCA9IDAsIHQxOSA9IDAsIHQyMCA9IDAsIHQyMSA9IDAsIHQyMiA9IDAsIHQyMyA9IDAsXG4gICAgdDI0ID0gMCwgdDI1ID0gMCwgdDI2ID0gMCwgdDI3ID0gMCwgdDI4ID0gMCwgdDI5ID0gMCwgdDMwID0gMCxcbiAgICBiMCA9IGJbMF0sXG4gICAgYjEgPSBiWzFdLFxuICAgIGIyID0gYlsyXSxcbiAgICBiMyA9IGJbM10sXG4gICAgYjQgPSBiWzRdLFxuICAgIGI1ID0gYls1XSxcbiAgICBiNiA9IGJbNl0sXG4gICAgYjcgPSBiWzddLFxuICAgIGI4ID0gYls4XSxcbiAgICBiOSA9IGJbOV0sXG4gICAgYjEwID0gYlsxMF0sXG4gICAgYjExID0gYlsxMV0sXG4gICAgYjEyID0gYlsxMl0sXG4gICAgYjEzID0gYlsxM10sXG4gICAgYjE0ID0gYlsxNF0sXG4gICAgYjE1ID0gYlsxNV07XG5cbiAgdiA9IGFbMF07XG4gIHQwICs9IHYgKiBiMDtcbiAgdDEgKz0gdiAqIGIxO1xuICB0MiArPSB2ICogYjI7XG4gIHQzICs9IHYgKiBiMztcbiAgdDQgKz0gdiAqIGI0O1xuICB0NSArPSB2ICogYjU7XG4gIHQ2ICs9IHYgKiBiNjtcbiAgdDcgKz0gdiAqIGI3O1xuICB0OCArPSB2ICogYjg7XG4gIHQ5ICs9IHYgKiBiOTtcbiAgdDEwICs9IHYgKiBiMTA7XG4gIHQxMSArPSB2ICogYjExO1xuICB0MTIgKz0gdiAqIGIxMjtcbiAgdDEzICs9IHYgKiBiMTM7XG4gIHQxNCArPSB2ICogYjE0O1xuICB0MTUgKz0gdiAqIGIxNTtcbiAgdiA9IGFbMV07XG4gIHQxICs9IHYgKiBiMDtcbiAgdDIgKz0gdiAqIGIxO1xuICB0MyArPSB2ICogYjI7XG4gIHQ0ICs9IHYgKiBiMztcbiAgdDUgKz0gdiAqIGI0O1xuICB0NiArPSB2ICogYjU7XG4gIHQ3ICs9IHYgKiBiNjtcbiAgdDggKz0gdiAqIGI3O1xuICB0OSArPSB2ICogYjg7XG4gIHQxMCArPSB2ICogYjk7XG4gIHQxMSArPSB2ICogYjEwO1xuICB0MTIgKz0gdiAqIGIxMTtcbiAgdDEzICs9IHYgKiBiMTI7XG4gIHQxNCArPSB2ICogYjEzO1xuICB0MTUgKz0gdiAqIGIxNDtcbiAgdDE2ICs9IHYgKiBiMTU7XG4gIHYgPSBhWzJdO1xuICB0MiArPSB2ICogYjA7XG4gIHQzICs9IHYgKiBiMTtcbiAgdDQgKz0gdiAqIGIyO1xuICB0NSArPSB2ICogYjM7XG4gIHQ2ICs9IHYgKiBiNDtcbiAgdDcgKz0gdiAqIGI1O1xuICB0OCArPSB2ICogYjY7XG4gIHQ5ICs9IHYgKiBiNztcbiAgdDEwICs9IHYgKiBiODtcbiAgdDExICs9IHYgKiBiOTtcbiAgdDEyICs9IHYgKiBiMTA7XG4gIHQxMyArPSB2ICogYjExO1xuICB0MTQgKz0gdiAqIGIxMjtcbiAgdDE1ICs9IHYgKiBiMTM7XG4gIHQxNiArPSB2ICogYjE0O1xuICB0MTcgKz0gdiAqIGIxNTtcbiAgdiA9IGFbM107XG4gIHQzICs9IHYgKiBiMDtcbiAgdDQgKz0gdiAqIGIxO1xuICB0NSArPSB2ICogYjI7XG4gIHQ2ICs9IHYgKiBiMztcbiAgdDcgKz0gdiAqIGI0O1xuICB0OCArPSB2ICogYjU7XG4gIHQ5ICs9IHYgKiBiNjtcbiAgdDEwICs9IHYgKiBiNztcbiAgdDExICs9IHYgKiBiODtcbiAgdDEyICs9IHYgKiBiOTtcbiAgdDEzICs9IHYgKiBiMTA7XG4gIHQxNCArPSB2ICogYjExO1xuICB0MTUgKz0gdiAqIGIxMjtcbiAgdDE2ICs9IHYgKiBiMTM7XG4gIHQxNyArPSB2ICogYjE0O1xuICB0MTggKz0gdiAqIGIxNTtcbiAgdiA9IGFbNF07XG4gIHQ0ICs9IHYgKiBiMDtcbiAgdDUgKz0gdiAqIGIxO1xuICB0NiArPSB2ICogYjI7XG4gIHQ3ICs9IHYgKiBiMztcbiAgdDggKz0gdiAqIGI0O1xuICB0OSArPSB2ICogYjU7XG4gIHQxMCArPSB2ICogYjY7XG4gIHQxMSArPSB2ICogYjc7XG4gIHQxMiArPSB2ICogYjg7XG4gIHQxMyArPSB2ICogYjk7XG4gIHQxNCArPSB2ICogYjEwO1xuICB0MTUgKz0gdiAqIGIxMTtcbiAgdDE2ICs9IHYgKiBiMTI7XG4gIHQxNyArPSB2ICogYjEzO1xuICB0MTggKz0gdiAqIGIxNDtcbiAgdDE5ICs9IHYgKiBiMTU7XG4gIHYgPSBhWzVdO1xuICB0NSArPSB2ICogYjA7XG4gIHQ2ICs9IHYgKiBiMTtcbiAgdDcgKz0gdiAqIGIyO1xuICB0OCArPSB2ICogYjM7XG4gIHQ5ICs9IHYgKiBiNDtcbiAgdDEwICs9IHYgKiBiNTtcbiAgdDExICs9IHYgKiBiNjtcbiAgdDEyICs9IHYgKiBiNztcbiAgdDEzICs9IHYgKiBiODtcbiAgdDE0ICs9IHYgKiBiOTtcbiAgdDE1ICs9IHYgKiBiMTA7XG4gIHQxNiArPSB2ICogYjExO1xuICB0MTcgKz0gdiAqIGIxMjtcbiAgdDE4ICs9IHYgKiBiMTM7XG4gIHQxOSArPSB2ICogYjE0O1xuICB0MjAgKz0gdiAqIGIxNTtcbiAgdiA9IGFbNl07XG4gIHQ2ICs9IHYgKiBiMDtcbiAgdDcgKz0gdiAqIGIxO1xuICB0OCArPSB2ICogYjI7XG4gIHQ5ICs9IHYgKiBiMztcbiAgdDEwICs9IHYgKiBiNDtcbiAgdDExICs9IHYgKiBiNTtcbiAgdDEyICs9IHYgKiBiNjtcbiAgdDEzICs9IHYgKiBiNztcbiAgdDE0ICs9IHYgKiBiODtcbiAgdDE1ICs9IHYgKiBiOTtcbiAgdDE2ICs9IHYgKiBiMTA7XG4gIHQxNyArPSB2ICogYjExO1xuICB0MTggKz0gdiAqIGIxMjtcbiAgdDE5ICs9IHYgKiBiMTM7XG4gIHQyMCArPSB2ICogYjE0O1xuICB0MjEgKz0gdiAqIGIxNTtcbiAgdiA9IGFbN107XG4gIHQ3ICs9IHYgKiBiMDtcbiAgdDggKz0gdiAqIGIxO1xuICB0OSArPSB2ICogYjI7XG4gIHQxMCArPSB2ICogYjM7XG4gIHQxMSArPSB2ICogYjQ7XG4gIHQxMiArPSB2ICogYjU7XG4gIHQxMyArPSB2ICogYjY7XG4gIHQxNCArPSB2ICogYjc7XG4gIHQxNSArPSB2ICogYjg7XG4gIHQxNiArPSB2ICogYjk7XG4gIHQxNyArPSB2ICogYjEwO1xuICB0MTggKz0gdiAqIGIxMTtcbiAgdDE5ICs9IHYgKiBiMTI7XG4gIHQyMCArPSB2ICogYjEzO1xuICB0MjEgKz0gdiAqIGIxNDtcbiAgdDIyICs9IHYgKiBiMTU7XG4gIHYgPSBhWzhdO1xuICB0OCArPSB2ICogYjA7XG4gIHQ5ICs9IHYgKiBiMTtcbiAgdDEwICs9IHYgKiBiMjtcbiAgdDExICs9IHYgKiBiMztcbiAgdDEyICs9IHYgKiBiNDtcbiAgdDEzICs9IHYgKiBiNTtcbiAgdDE0ICs9IHYgKiBiNjtcbiAgdDE1ICs9IHYgKiBiNztcbiAgdDE2ICs9IHYgKiBiODtcbiAgdDE3ICs9IHYgKiBiOTtcbiAgdDE4ICs9IHYgKiBiMTA7XG4gIHQxOSArPSB2ICogYjExO1xuICB0MjAgKz0gdiAqIGIxMjtcbiAgdDIxICs9IHYgKiBiMTM7XG4gIHQyMiArPSB2ICogYjE0O1xuICB0MjMgKz0gdiAqIGIxNTtcbiAgdiA9IGFbOV07XG4gIHQ5ICs9IHYgKiBiMDtcbiAgdDEwICs9IHYgKiBiMTtcbiAgdDExICs9IHYgKiBiMjtcbiAgdDEyICs9IHYgKiBiMztcbiAgdDEzICs9IHYgKiBiNDtcbiAgdDE0ICs9IHYgKiBiNTtcbiAgdDE1ICs9IHYgKiBiNjtcbiAgdDE2ICs9IHYgKiBiNztcbiAgdDE3ICs9IHYgKiBiODtcbiAgdDE4ICs9IHYgKiBiOTtcbiAgdDE5ICs9IHYgKiBiMTA7XG4gIHQyMCArPSB2ICogYjExO1xuICB0MjEgKz0gdiAqIGIxMjtcbiAgdDIyICs9IHYgKiBiMTM7XG4gIHQyMyArPSB2ICogYjE0O1xuICB0MjQgKz0gdiAqIGIxNTtcbiAgdiA9IGFbMTBdO1xuICB0MTAgKz0gdiAqIGIwO1xuICB0MTEgKz0gdiAqIGIxO1xuICB0MTIgKz0gdiAqIGIyO1xuICB0MTMgKz0gdiAqIGIzO1xuICB0MTQgKz0gdiAqIGI0O1xuICB0MTUgKz0gdiAqIGI1O1xuICB0MTYgKz0gdiAqIGI2O1xuICB0MTcgKz0gdiAqIGI3O1xuICB0MTggKz0gdiAqIGI4O1xuICB0MTkgKz0gdiAqIGI5O1xuICB0MjAgKz0gdiAqIGIxMDtcbiAgdDIxICs9IHYgKiBiMTE7XG4gIHQyMiArPSB2ICogYjEyO1xuICB0MjMgKz0gdiAqIGIxMztcbiAgdDI0ICs9IHYgKiBiMTQ7XG4gIHQyNSArPSB2ICogYjE1O1xuICB2ID0gYVsxMV07XG4gIHQxMSArPSB2ICogYjA7XG4gIHQxMiArPSB2ICogYjE7XG4gIHQxMyArPSB2ICogYjI7XG4gIHQxNCArPSB2ICogYjM7XG4gIHQxNSArPSB2ICogYjQ7XG4gIHQxNiArPSB2ICogYjU7XG4gIHQxNyArPSB2ICogYjY7XG4gIHQxOCArPSB2ICogYjc7XG4gIHQxOSArPSB2ICogYjg7XG4gIHQyMCArPSB2ICogYjk7XG4gIHQyMSArPSB2ICogYjEwO1xuICB0MjIgKz0gdiAqIGIxMTtcbiAgdDIzICs9IHYgKiBiMTI7XG4gIHQyNCArPSB2ICogYjEzO1xuICB0MjUgKz0gdiAqIGIxNDtcbiAgdDI2ICs9IHYgKiBiMTU7XG4gIHYgPSBhWzEyXTtcbiAgdDEyICs9IHYgKiBiMDtcbiAgdDEzICs9IHYgKiBiMTtcbiAgdDE0ICs9IHYgKiBiMjtcbiAgdDE1ICs9IHYgKiBiMztcbiAgdDE2ICs9IHYgKiBiNDtcbiAgdDE3ICs9IHYgKiBiNTtcbiAgdDE4ICs9IHYgKiBiNjtcbiAgdDE5ICs9IHYgKiBiNztcbiAgdDIwICs9IHYgKiBiODtcbiAgdDIxICs9IHYgKiBiOTtcbiAgdDIyICs9IHYgKiBiMTA7XG4gIHQyMyArPSB2ICogYjExO1xuICB0MjQgKz0gdiAqIGIxMjtcbiAgdDI1ICs9IHYgKiBiMTM7XG4gIHQyNiArPSB2ICogYjE0O1xuICB0MjcgKz0gdiAqIGIxNTtcbiAgdiA9IGFbMTNdO1xuICB0MTMgKz0gdiAqIGIwO1xuICB0MTQgKz0gdiAqIGIxO1xuICB0MTUgKz0gdiAqIGIyO1xuICB0MTYgKz0gdiAqIGIzO1xuICB0MTcgKz0gdiAqIGI0O1xuICB0MTggKz0gdiAqIGI1O1xuICB0MTkgKz0gdiAqIGI2O1xuICB0MjAgKz0gdiAqIGI3O1xuICB0MjEgKz0gdiAqIGI4O1xuICB0MjIgKz0gdiAqIGI5O1xuICB0MjMgKz0gdiAqIGIxMDtcbiAgdDI0ICs9IHYgKiBiMTE7XG4gIHQyNSArPSB2ICogYjEyO1xuICB0MjYgKz0gdiAqIGIxMztcbiAgdDI3ICs9IHYgKiBiMTQ7XG4gIHQyOCArPSB2ICogYjE1O1xuICB2ID0gYVsxNF07XG4gIHQxNCArPSB2ICogYjA7XG4gIHQxNSArPSB2ICogYjE7XG4gIHQxNiArPSB2ICogYjI7XG4gIHQxNyArPSB2ICogYjM7XG4gIHQxOCArPSB2ICogYjQ7XG4gIHQxOSArPSB2ICogYjU7XG4gIHQyMCArPSB2ICogYjY7XG4gIHQyMSArPSB2ICogYjc7XG4gIHQyMiArPSB2ICogYjg7XG4gIHQyMyArPSB2ICogYjk7XG4gIHQyNCArPSB2ICogYjEwO1xuICB0MjUgKz0gdiAqIGIxMTtcbiAgdDI2ICs9IHYgKiBiMTI7XG4gIHQyNyArPSB2ICogYjEzO1xuICB0MjggKz0gdiAqIGIxNDtcbiAgdDI5ICs9IHYgKiBiMTU7XG4gIHYgPSBhWzE1XTtcbiAgdDE1ICs9IHYgKiBiMDtcbiAgdDE2ICs9IHYgKiBiMTtcbiAgdDE3ICs9IHYgKiBiMjtcbiAgdDE4ICs9IHYgKiBiMztcbiAgdDE5ICs9IHYgKiBiNDtcbiAgdDIwICs9IHYgKiBiNTtcbiAgdDIxICs9IHYgKiBiNjtcbiAgdDIyICs9IHYgKiBiNztcbiAgdDIzICs9IHYgKiBiODtcbiAgdDI0ICs9IHYgKiBiOTtcbiAgdDI1ICs9IHYgKiBiMTA7XG4gIHQyNiArPSB2ICogYjExO1xuICB0MjcgKz0gdiAqIGIxMjtcbiAgdDI4ICs9IHYgKiBiMTM7XG4gIHQyOSArPSB2ICogYjE0O1xuICB0MzAgKz0gdiAqIGIxNTtcblxuICB0MCAgKz0gMzggKiB0MTY7XG4gIHQxICArPSAzOCAqIHQxNztcbiAgdDIgICs9IDM4ICogdDE4O1xuICB0MyAgKz0gMzggKiB0MTk7XG4gIHQ0ICArPSAzOCAqIHQyMDtcbiAgdDUgICs9IDM4ICogdDIxO1xuICB0NiAgKz0gMzggKiB0MjI7XG4gIHQ3ICArPSAzOCAqIHQyMztcbiAgdDggICs9IDM4ICogdDI0O1xuICB0OSAgKz0gMzggKiB0MjU7XG4gIHQxMCArPSAzOCAqIHQyNjtcbiAgdDExICs9IDM4ICogdDI3O1xuICB0MTIgKz0gMzggKiB0Mjg7XG4gIHQxMyArPSAzOCAqIHQyOTtcbiAgdDE0ICs9IDM4ICogdDMwO1xuICAvLyB0MTUgbGVmdCBhcyBpc1xuXG4gIC8vIGZpcnN0IGNhclxuICBjID0gMTtcbiAgdiA9ICB0MCArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQwID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9ICB0MSArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQxID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9ICB0MiArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQyID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9ICB0MyArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQzID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9ICB0NCArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQ0ID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9ICB0NSArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQ1ID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9ICB0NiArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQ2ID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9ICB0NyArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQ3ID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9ICB0OCArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQ4ID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9ICB0OSArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQ5ID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9IHQxMCArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgdDEwID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9IHQxMSArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgdDExID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9IHQxMiArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgdDEyID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9IHQxMyArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgdDEzID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9IHQxNCArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgdDE0ID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9IHQxNSArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgdDE1ID0gdiAtIGMgKiA2NTUzNjtcbiAgdDAgKz0gYy0xICsgMzcgKiAoYy0xKTtcblxuICAvLyBzZWNvbmQgY2FyXG4gIGMgPSAxO1xuICB2ID0gIHQwICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDAgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQxICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDEgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQyICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDIgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQzICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDMgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQ0ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDQgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQ1ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDUgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQ2ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDYgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQ3ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDcgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQ4ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDggPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQ5ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDkgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gdDEwICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyB0MTAgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gdDExICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyB0MTEgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gdDEyICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyB0MTIgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gdDEzICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyB0MTMgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gdDE0ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyB0MTQgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gdDE1ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyB0MTUgPSB2IC0gYyAqIDY1NTM2O1xuICB0MCArPSBjLTEgKyAzNyAqIChjLTEpO1xuXG4gIG9bIDBdID0gdDA7XG4gIG9bIDFdID0gdDE7XG4gIG9bIDJdID0gdDI7XG4gIG9bIDNdID0gdDM7XG4gIG9bIDRdID0gdDQ7XG4gIG9bIDVdID0gdDU7XG4gIG9bIDZdID0gdDY7XG4gIG9bIDddID0gdDc7XG4gIG9bIDhdID0gdDg7XG4gIG9bIDldID0gdDk7XG4gIG9bMTBdID0gdDEwO1xuICBvWzExXSA9IHQxMTtcbiAgb1sxMl0gPSB0MTI7XG4gIG9bMTNdID0gdDEzO1xuICBvWzE0XSA9IHQxNDtcbiAgb1sxNV0gPSB0MTU7XG59XG5cbmZ1bmN0aW9uIFMobywgYSkge1xuICBNKG8sIGEsIGEpO1xufVxuXG5mdW5jdGlvbiBpbnYyNTUxOShvLCBpKSB7XG4gIHZhciBjID0gZ2YoKTtcbiAgdmFyIGE7XG4gIGZvciAoYSA9IDA7IGEgPCAxNjsgYSsrKSBjW2FdID0gaVthXTtcbiAgZm9yIChhID0gMjUzOyBhID49IDA7IGEtLSkge1xuICAgIFMoYywgYyk7XG4gICAgaWYoYSAhPT0gMiAmJiBhICE9PSA0KSBNKGMsIGMsIGkpO1xuICB9XG4gIGZvciAoYSA9IDA7IGEgPCAxNjsgYSsrKSBvW2FdID0gY1thXTtcbn1cblxuZnVuY3Rpb24gcG93MjUyMyhvLCBpKSB7XG4gIHZhciBjID0gZ2YoKTtcbiAgdmFyIGE7XG4gIGZvciAoYSA9IDA7IGEgPCAxNjsgYSsrKSBjW2FdID0gaVthXTtcbiAgZm9yIChhID0gMjUwOyBhID49IDA7IGEtLSkge1xuICAgICAgUyhjLCBjKTtcbiAgICAgIGlmKGEgIT09IDEpIE0oYywgYywgaSk7XG4gIH1cbiAgZm9yIChhID0gMDsgYSA8IDE2OyBhKyspIG9bYV0gPSBjW2FdO1xufVxuXG5mdW5jdGlvbiBjcnlwdG9fc2NhbGFybXVsdChxLCBuLCBwKSB7XG4gIHZhciB6ID0gbmV3IFVpbnQ4QXJyYXkoMzIpO1xuICB2YXIgeCA9IG5ldyBGbG9hdDY0QXJyYXkoODApLCByLCBpO1xuICB2YXIgYSA9IGdmKCksIGIgPSBnZigpLCBjID0gZ2YoKSxcbiAgICAgIGQgPSBnZigpLCBlID0gZ2YoKSwgZiA9IGdmKCk7XG4gIGZvciAoaSA9IDA7IGkgPCAzMTsgaSsrKSB6W2ldID0gbltpXTtcbiAgelszMV09KG5bMzFdJjEyNyl8NjQ7XG4gIHpbMF0mPTI0ODtcbiAgdW5wYWNrMjU1MTkoeCxwKTtcbiAgZm9yIChpID0gMDsgaSA8IDE2OyBpKyspIHtcbiAgICBiW2ldPXhbaV07XG4gICAgZFtpXT1hW2ldPWNbaV09MDtcbiAgfVxuICBhWzBdPWRbMF09MTtcbiAgZm9yIChpPTI1NDsgaT49MDsgLS1pKSB7XG4gICAgcj0oeltpPj4+M10+Pj4oaSY3KSkmMTtcbiAgICBzZWwyNTUxOShhLGIscik7XG4gICAgc2VsMjU1MTkoYyxkLHIpO1xuICAgIEEoZSxhLGMpO1xuICAgIFooYSxhLGMpO1xuICAgIEEoYyxiLGQpO1xuICAgIFooYixiLGQpO1xuICAgIFMoZCxlKTtcbiAgICBTKGYsYSk7XG4gICAgTShhLGMsYSk7XG4gICAgTShjLGIsZSk7XG4gICAgQShlLGEsYyk7XG4gICAgWihhLGEsYyk7XG4gICAgUyhiLGEpO1xuICAgIFooYyxkLGYpO1xuICAgIE0oYSxjLF8xMjE2NjUpO1xuICAgIEEoYSxhLGQpO1xuICAgIE0oYyxjLGEpO1xuICAgIE0oYSxkLGYpO1xuICAgIE0oZCxiLHgpO1xuICAgIFMoYixlKTtcbiAgICBzZWwyNTUxOShhLGIscik7XG4gICAgc2VsMjU1MTkoYyxkLHIpO1xuICB9XG4gIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgeFtpKzE2XT1hW2ldO1xuICAgIHhbaSszMl09Y1tpXTtcbiAgICB4W2krNDhdPWJbaV07XG4gICAgeFtpKzY0XT1kW2ldO1xuICB9XG4gIHZhciB4MzIgPSB4LnN1YmFycmF5KDMyKTtcbiAgdmFyIHgxNiA9IHguc3ViYXJyYXkoMTYpO1xuICBpbnYyNTUxOSh4MzIseDMyKTtcbiAgTSh4MTYseDE2LHgzMik7XG4gIHBhY2syNTUxOShxLHgxNik7XG4gIHJldHVybiAwO1xufVxuXG5mdW5jdGlvbiBjcnlwdG9fc2NhbGFybXVsdF9iYXNlKHEsIG4pIHtcbiAgcmV0dXJuIGNyeXB0b19zY2FsYXJtdWx0KHEsIG4sIF85KTtcbn1cblxuZnVuY3Rpb24gY3J5cHRvX2JveF9rZXlwYWlyKHksIHgpIHtcbiAgcmFuZG9tYnl0ZXMoeCwgMzIpO1xuICByZXR1cm4gY3J5cHRvX3NjYWxhcm11bHRfYmFzZSh5LCB4KTtcbn1cblxuZnVuY3Rpb24gY3J5cHRvX2JveF9iZWZvcmVubShrLCB5LCB4KSB7XG4gIHZhciBzID0gbmV3IFVpbnQ4QXJyYXkoMzIpO1xuICBjcnlwdG9fc2NhbGFybXVsdChzLCB4LCB5KTtcbiAgcmV0dXJuIGNyeXB0b19jb3JlX2hzYWxzYTIwKGssIF8wLCBzLCBzaWdtYSk7XG59XG5cbnZhciBjcnlwdG9fYm94X2FmdGVybm0gPSBjcnlwdG9fc2VjcmV0Ym94O1xudmFyIGNyeXB0b19ib3hfb3Blbl9hZnRlcm5tID0gY3J5cHRvX3NlY3JldGJveF9vcGVuO1xuXG5mdW5jdGlvbiBjcnlwdG9fYm94KGMsIG0sIGQsIG4sIHksIHgpIHtcbiAgdmFyIGsgPSBuZXcgVWludDhBcnJheSgzMik7XG4gIGNyeXB0b19ib3hfYmVmb3Jlbm0oaywgeSwgeCk7XG4gIHJldHVybiBjcnlwdG9fYm94X2FmdGVybm0oYywgbSwgZCwgbiwgayk7XG59XG5cbmZ1bmN0aW9uIGNyeXB0b19ib3hfb3BlbihtLCBjLCBkLCBuLCB5LCB4KSB7XG4gIHZhciBrID0gbmV3IFVpbnQ4QXJyYXkoMzIpO1xuICBjcnlwdG9fYm94X2JlZm9yZW5tKGssIHksIHgpO1xuICByZXR1cm4gY3J5cHRvX2JveF9vcGVuX2FmdGVybm0obSwgYywgZCwgbiwgayk7XG59XG5cbnZhciBLID0gW1xuICAweDQyOGEyZjk4LCAweGQ3MjhhZTIyLCAweDcxMzc0NDkxLCAweDIzZWY2NWNkLFxuICAweGI1YzBmYmNmLCAweGVjNGQzYjJmLCAweGU5YjVkYmE1LCAweDgxODlkYmJjLFxuICAweDM5NTZjMjViLCAweGYzNDhiNTM4LCAweDU5ZjExMWYxLCAweGI2MDVkMDE5LFxuICAweDkyM2Y4MmE0LCAweGFmMTk0ZjliLCAweGFiMWM1ZWQ1LCAweGRhNmQ4MTE4LFxuICAweGQ4MDdhYTk4LCAweGEzMDMwMjQyLCAweDEyODM1YjAxLCAweDQ1NzA2ZmJlLFxuICAweDI0MzE4NWJlLCAweDRlZTRiMjhjLCAweDU1MGM3ZGMzLCAweGQ1ZmZiNGUyLFxuICAweDcyYmU1ZDc0LCAweGYyN2I4OTZmLCAweDgwZGViMWZlLCAweDNiMTY5NmIxLFxuICAweDliZGMwNmE3LCAweDI1YzcxMjM1LCAweGMxOWJmMTc0LCAweGNmNjkyNjk0LFxuICAweGU0OWI2OWMxLCAweDllZjE0YWQyLCAweGVmYmU0Nzg2LCAweDM4NGYyNWUzLFxuICAweDBmYzE5ZGM2LCAweDhiOGNkNWI1LCAweDI0MGNhMWNjLCAweDc3YWM5YzY1LFxuICAweDJkZTkyYzZmLCAweDU5MmIwMjc1LCAweDRhNzQ4NGFhLCAweDZlYTZlNDgzLFxuICAweDVjYjBhOWRjLCAweGJkNDFmYmQ0LCAweDc2Zjk4OGRhLCAweDgzMTE1M2I1LFxuICAweDk4M2U1MTUyLCAweGVlNjZkZmFiLCAweGE4MzFjNjZkLCAweDJkYjQzMjEwLFxuICAweGIwMDMyN2M4LCAweDk4ZmIyMTNmLCAweGJmNTk3ZmM3LCAweGJlZWYwZWU0LFxuICAweGM2ZTAwYmYzLCAweDNkYTg4ZmMyLCAweGQ1YTc5MTQ3LCAweDkzMGFhNzI1LFxuICAweDA2Y2E2MzUxLCAweGUwMDM4MjZmLCAweDE0MjkyOTY3LCAweDBhMGU2ZTcwLFxuICAweDI3YjcwYTg1LCAweDQ2ZDIyZmZjLCAweDJlMWIyMTM4LCAweDVjMjZjOTI2LFxuICAweDRkMmM2ZGZjLCAweDVhYzQyYWVkLCAweDUzMzgwZDEzLCAweDlkOTViM2RmLFxuICAweDY1MGE3MzU0LCAweDhiYWY2M2RlLCAweDc2NmEwYWJiLCAweDNjNzdiMmE4LFxuICAweDgxYzJjOTJlLCAweDQ3ZWRhZWU2LCAweDkyNzIyYzg1LCAweDE0ODIzNTNiLFxuICAweGEyYmZlOGExLCAweDRjZjEwMzY0LCAweGE4MWE2NjRiLCAweGJjNDIzMDAxLFxuICAweGMyNGI4YjcwLCAweGQwZjg5NzkxLCAweGM3NmM1MWEzLCAweDA2NTRiZTMwLFxuICAweGQxOTJlODE5LCAweGQ2ZWY1MjE4LCAweGQ2OTkwNjI0LCAweDU1NjVhOTEwLFxuICAweGY0MGUzNTg1LCAweDU3NzEyMDJhLCAweDEwNmFhMDcwLCAweDMyYmJkMWI4LFxuICAweDE5YTRjMTE2LCAweGI4ZDJkMGM4LCAweDFlMzc2YzA4LCAweDUxNDFhYjUzLFxuICAweDI3NDg3NzRjLCAweGRmOGVlYjk5LCAweDM0YjBiY2I1LCAweGUxOWI0OGE4LFxuICAweDM5MWMwY2IzLCAweGM1Yzk1YTYzLCAweDRlZDhhYTRhLCAweGUzNDE4YWNiLFxuICAweDViOWNjYTRmLCAweDc3NjNlMzczLCAweDY4MmU2ZmYzLCAweGQ2YjJiOGEzLFxuICAweDc0OGY4MmVlLCAweDVkZWZiMmZjLCAweDc4YTU2MzZmLCAweDQzMTcyZjYwLFxuICAweDg0Yzg3ODE0LCAweGExZjBhYjcyLCAweDhjYzcwMjA4LCAweDFhNjQzOWVjLFxuICAweDkwYmVmZmZhLCAweDIzNjMxZTI4LCAweGE0NTA2Y2ViLCAweGRlODJiZGU5LFxuICAweGJlZjlhM2Y3LCAweGIyYzY3OTE1LCAweGM2NzE3OGYyLCAweGUzNzI1MzJiLFxuICAweGNhMjczZWNlLCAweGVhMjY2MTljLCAweGQxODZiOGM3LCAweDIxYzBjMjA3LFxuICAweGVhZGE3ZGQ2LCAweGNkZTBlYjFlLCAweGY1N2Q0ZjdmLCAweGVlNmVkMTc4LFxuICAweDA2ZjA2N2FhLCAweDcyMTc2ZmJhLCAweDBhNjM3ZGM1LCAweGEyYzg5OGE2LFxuICAweDExM2Y5ODA0LCAweGJlZjkwZGFlLCAweDFiNzEwYjM1LCAweDEzMWM0NzFiLFxuICAweDI4ZGI3N2Y1LCAweDIzMDQ3ZDg0LCAweDMyY2FhYjdiLCAweDQwYzcyNDkzLFxuICAweDNjOWViZTBhLCAweDE1YzliZWJjLCAweDQzMWQ2N2M0LCAweDljMTAwZDRjLFxuICAweDRjYzVkNGJlLCAweGNiM2U0MmI2LCAweDU5N2YyOTljLCAweGZjNjU3ZTJhLFxuICAweDVmY2I2ZmFiLCAweDNhZDZmYWVjLCAweDZjNDQxOThjLCAweDRhNDc1ODE3XG5dO1xuXG5mdW5jdGlvbiBjcnlwdG9faGFzaGJsb2Nrc19obChoaCwgaGwsIG0sIG4pIHtcbiAgdmFyIHdoID0gbmV3IEludDMyQXJyYXkoMTYpLCB3bCA9IG5ldyBJbnQzMkFycmF5KDE2KSxcbiAgICAgIGJoMCwgYmgxLCBiaDIsIGJoMywgYmg0LCBiaDUsIGJoNiwgYmg3LFxuICAgICAgYmwwLCBibDEsIGJsMiwgYmwzLCBibDQsIGJsNSwgYmw2LCBibDcsXG4gICAgICB0aCwgdGwsIGksIGosIGgsIGwsIGEsIGIsIGMsIGQ7XG5cbiAgdmFyIGFoMCA9IGhoWzBdLFxuICAgICAgYWgxID0gaGhbMV0sXG4gICAgICBhaDIgPSBoaFsyXSxcbiAgICAgIGFoMyA9IGhoWzNdLFxuICAgICAgYWg0ID0gaGhbNF0sXG4gICAgICBhaDUgPSBoaFs1XSxcbiAgICAgIGFoNiA9IGhoWzZdLFxuICAgICAgYWg3ID0gaGhbN10sXG5cbiAgICAgIGFsMCA9IGhsWzBdLFxuICAgICAgYWwxID0gaGxbMV0sXG4gICAgICBhbDIgPSBobFsyXSxcbiAgICAgIGFsMyA9IGhsWzNdLFxuICAgICAgYWw0ID0gaGxbNF0sXG4gICAgICBhbDUgPSBobFs1XSxcbiAgICAgIGFsNiA9IGhsWzZdLFxuICAgICAgYWw3ID0gaGxbN107XG5cbiAgdmFyIHBvcyA9IDA7XG4gIHdoaWxlIChuID49IDEyOCkge1xuICAgIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgICBqID0gOCAqIGkgKyBwb3M7XG4gICAgICB3aFtpXSA9IChtW2orMF0gPDwgMjQpIHwgKG1baisxXSA8PCAxNikgfCAobVtqKzJdIDw8IDgpIHwgbVtqKzNdO1xuICAgICAgd2xbaV0gPSAobVtqKzRdIDw8IDI0KSB8IChtW2orNV0gPDwgMTYpIHwgKG1bais2XSA8PCA4KSB8IG1bais3XTtcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IDgwOyBpKyspIHtcbiAgICAgIGJoMCA9IGFoMDtcbiAgICAgIGJoMSA9IGFoMTtcbiAgICAgIGJoMiA9IGFoMjtcbiAgICAgIGJoMyA9IGFoMztcbiAgICAgIGJoNCA9IGFoNDtcbiAgICAgIGJoNSA9IGFoNTtcbiAgICAgIGJoNiA9IGFoNjtcbiAgICAgIGJoNyA9IGFoNztcblxuICAgICAgYmwwID0gYWwwO1xuICAgICAgYmwxID0gYWwxO1xuICAgICAgYmwyID0gYWwyO1xuICAgICAgYmwzID0gYWwzO1xuICAgICAgYmw0ID0gYWw0O1xuICAgICAgYmw1ID0gYWw1O1xuICAgICAgYmw2ID0gYWw2O1xuICAgICAgYmw3ID0gYWw3O1xuXG4gICAgICAvLyBhZGRcbiAgICAgIGggPSBhaDc7XG4gICAgICBsID0gYWw3O1xuXG4gICAgICBhID0gbCAmIDB4ZmZmZjsgYiA9IGwgPj4+IDE2O1xuICAgICAgYyA9IGggJiAweGZmZmY7IGQgPSBoID4+PiAxNjtcblxuICAgICAgLy8gU2lnbWExXG4gICAgICBoID0gKChhaDQgPj4+IDE0KSB8IChhbDQgPDwgKDMyLTE0KSkpIF4gKChhaDQgPj4+IDE4KSB8IChhbDQgPDwgKDMyLTE4KSkpIF4gKChhbDQgPj4+ICg0MS0zMikpIHwgKGFoNCA8PCAoMzItKDQxLTMyKSkpKTtcbiAgICAgIGwgPSAoKGFsNCA+Pj4gMTQpIHwgKGFoNCA8PCAoMzItMTQpKSkgXiAoKGFsNCA+Pj4gMTgpIHwgKGFoNCA8PCAoMzItMTgpKSkgXiAoKGFoNCA+Pj4gKDQxLTMyKSkgfCAoYWw0IDw8ICgzMi0oNDEtMzIpKSkpO1xuXG4gICAgICBhICs9IGwgJiAweGZmZmY7IGIgKz0gbCA+Pj4gMTY7XG4gICAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICAgIC8vIENoXG4gICAgICBoID0gKGFoNCAmIGFoNSkgXiAofmFoNCAmIGFoNik7XG4gICAgICBsID0gKGFsNCAmIGFsNSkgXiAofmFsNCAmIGFsNik7XG5cbiAgICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcblxuICAgICAgLy8gS1xuICAgICAgaCA9IEtbaSoyXTtcbiAgICAgIGwgPSBLW2kqMisxXTtcblxuICAgICAgYSArPSBsICYgMHhmZmZmOyBiICs9IGwgPj4+IDE2O1xuICAgICAgYyArPSBoICYgMHhmZmZmOyBkICs9IGggPj4+IDE2O1xuXG4gICAgICAvLyB3XG4gICAgICBoID0gd2hbaSUxNl07XG4gICAgICBsID0gd2xbaSUxNl07XG5cbiAgICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcblxuICAgICAgYiArPSBhID4+PiAxNjtcbiAgICAgIGMgKz0gYiA+Pj4gMTY7XG4gICAgICBkICs9IGMgPj4+IDE2O1xuXG4gICAgICB0aCA9IGMgJiAweGZmZmYgfCBkIDw8IDE2O1xuICAgICAgdGwgPSBhICYgMHhmZmZmIHwgYiA8PCAxNjtcblxuICAgICAgLy8gYWRkXG4gICAgICBoID0gdGg7XG4gICAgICBsID0gdGw7XG5cbiAgICAgIGEgPSBsICYgMHhmZmZmOyBiID0gbCA+Pj4gMTY7XG4gICAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xuXG4gICAgICAvLyBTaWdtYTBcbiAgICAgIGggPSAoKGFoMCA+Pj4gMjgpIHwgKGFsMCA8PCAoMzItMjgpKSkgXiAoKGFsMCA+Pj4gKDM0LTMyKSkgfCAoYWgwIDw8ICgzMi0oMzQtMzIpKSkpIF4gKChhbDAgPj4+ICgzOS0zMikpIHwgKGFoMCA8PCAoMzItKDM5LTMyKSkpKTtcbiAgICAgIGwgPSAoKGFsMCA+Pj4gMjgpIHwgKGFoMCA8PCAoMzItMjgpKSkgXiAoKGFoMCA+Pj4gKDM0LTMyKSkgfCAoYWwwIDw8ICgzMi0oMzQtMzIpKSkpIF4gKChhaDAgPj4+ICgzOS0zMikpIHwgKGFsMCA8PCAoMzItKDM5LTMyKSkpKTtcblxuICAgICAgYSArPSBsICYgMHhmZmZmOyBiICs9IGwgPj4+IDE2O1xuICAgICAgYyArPSBoICYgMHhmZmZmOyBkICs9IGggPj4+IDE2O1xuXG4gICAgICAvLyBNYWpcbiAgICAgIGggPSAoYWgwICYgYWgxKSBeIChhaDAgJiBhaDIpIF4gKGFoMSAmIGFoMik7XG4gICAgICBsID0gKGFsMCAmIGFsMSkgXiAoYWwwICYgYWwyKSBeIChhbDEgJiBhbDIpO1xuXG4gICAgICBhICs9IGwgJiAweGZmZmY7IGIgKz0gbCA+Pj4gMTY7XG4gICAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICAgIGIgKz0gYSA+Pj4gMTY7XG4gICAgICBjICs9IGIgPj4+IDE2O1xuICAgICAgZCArPSBjID4+PiAxNjtcblxuICAgICAgYmg3ID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xuICAgICAgYmw3ID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xuXG4gICAgICAvLyBhZGRcbiAgICAgIGggPSBiaDM7XG4gICAgICBsID0gYmwzO1xuXG4gICAgICBhID0gbCAmIDB4ZmZmZjsgYiA9IGwgPj4+IDE2O1xuICAgICAgYyA9IGggJiAweGZmZmY7IGQgPSBoID4+PiAxNjtcblxuICAgICAgaCA9IHRoO1xuICAgICAgbCA9IHRsO1xuXG4gICAgICBhICs9IGwgJiAweGZmZmY7IGIgKz0gbCA+Pj4gMTY7XG4gICAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICAgIGIgKz0gYSA+Pj4gMTY7XG4gICAgICBjICs9IGIgPj4+IDE2O1xuICAgICAgZCArPSBjID4+PiAxNjtcblxuICAgICAgYmgzID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xuICAgICAgYmwzID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xuXG4gICAgICBhaDEgPSBiaDA7XG4gICAgICBhaDIgPSBiaDE7XG4gICAgICBhaDMgPSBiaDI7XG4gICAgICBhaDQgPSBiaDM7XG4gICAgICBhaDUgPSBiaDQ7XG4gICAgICBhaDYgPSBiaDU7XG4gICAgICBhaDcgPSBiaDY7XG4gICAgICBhaDAgPSBiaDc7XG5cbiAgICAgIGFsMSA9IGJsMDtcbiAgICAgIGFsMiA9IGJsMTtcbiAgICAgIGFsMyA9IGJsMjtcbiAgICAgIGFsNCA9IGJsMztcbiAgICAgIGFsNSA9IGJsNDtcbiAgICAgIGFsNiA9IGJsNTtcbiAgICAgIGFsNyA9IGJsNjtcbiAgICAgIGFsMCA9IGJsNztcblxuICAgICAgaWYgKGklMTYgPT09IDE1KSB7XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCAxNjsgaisrKSB7XG4gICAgICAgICAgLy8gYWRkXG4gICAgICAgICAgaCA9IHdoW2pdO1xuICAgICAgICAgIGwgPSB3bFtqXTtcblxuICAgICAgICAgIGEgPSBsICYgMHhmZmZmOyBiID0gbCA+Pj4gMTY7XG4gICAgICAgICAgYyA9IGggJiAweGZmZmY7IGQgPSBoID4+PiAxNjtcblxuICAgICAgICAgIGggPSB3aFsoais5KSUxNl07XG4gICAgICAgICAgbCA9IHdsWyhqKzkpJTE2XTtcblxuICAgICAgICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICAgICAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICAgICAgICAvLyBzaWdtYTBcbiAgICAgICAgICB0aCA9IHdoWyhqKzEpJTE2XTtcbiAgICAgICAgICB0bCA9IHdsWyhqKzEpJTE2XTtcbiAgICAgICAgICBoID0gKCh0aCA+Pj4gMSkgfCAodGwgPDwgKDMyLTEpKSkgXiAoKHRoID4+PiA4KSB8ICh0bCA8PCAoMzItOCkpKSBeICh0aCA+Pj4gNyk7XG4gICAgICAgICAgbCA9ICgodGwgPj4+IDEpIHwgKHRoIDw8ICgzMi0xKSkpIF4gKCh0bCA+Pj4gOCkgfCAodGggPDwgKDMyLTgpKSkgXiAoKHRsID4+PiA3KSB8ICh0aCA8PCAoMzItNykpKTtcblxuICAgICAgICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICAgICAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICAgICAgICAvLyBzaWdtYTFcbiAgICAgICAgICB0aCA9IHdoWyhqKzE0KSUxNl07XG4gICAgICAgICAgdGwgPSB3bFsoaisxNCklMTZdO1xuICAgICAgICAgIGggPSAoKHRoID4+PiAxOSkgfCAodGwgPDwgKDMyLTE5KSkpIF4gKCh0bCA+Pj4gKDYxLTMyKSkgfCAodGggPDwgKDMyLSg2MS0zMikpKSkgXiAodGggPj4+IDYpO1xuICAgICAgICAgIGwgPSAoKHRsID4+PiAxOSkgfCAodGggPDwgKDMyLTE5KSkpIF4gKCh0aCA+Pj4gKDYxLTMyKSkgfCAodGwgPDwgKDMyLSg2MS0zMikpKSkgXiAoKHRsID4+PiA2KSB8ICh0aCA8PCAoMzItNikpKTtcblxuICAgICAgICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICAgICAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICAgICAgICBiICs9IGEgPj4+IDE2O1xuICAgICAgICAgIGMgKz0gYiA+Pj4gMTY7XG4gICAgICAgICAgZCArPSBjID4+PiAxNjtcblxuICAgICAgICAgIHdoW2pdID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xuICAgICAgICAgIHdsW2pdID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gYWRkXG4gICAgaCA9IGFoMDtcbiAgICBsID0gYWwwO1xuXG4gICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcbiAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xuXG4gICAgaCA9IGhoWzBdO1xuICAgIGwgPSBobFswXTtcblxuICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICBiICs9IGEgPj4+IDE2O1xuICAgIGMgKz0gYiA+Pj4gMTY7XG4gICAgZCArPSBjID4+PiAxNjtcblxuICAgIGhoWzBdID0gYWgwID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xuICAgIGhsWzBdID0gYWwwID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xuXG4gICAgaCA9IGFoMTtcbiAgICBsID0gYWwxO1xuXG4gICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcbiAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xuXG4gICAgaCA9IGhoWzFdO1xuICAgIGwgPSBobFsxXTtcblxuICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICBiICs9IGEgPj4+IDE2O1xuICAgIGMgKz0gYiA+Pj4gMTY7XG4gICAgZCArPSBjID4+PiAxNjtcblxuICAgIGhoWzFdID0gYWgxID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xuICAgIGhsWzFdID0gYWwxID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xuXG4gICAgaCA9IGFoMjtcbiAgICBsID0gYWwyO1xuXG4gICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcbiAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xuXG4gICAgaCA9IGhoWzJdO1xuICAgIGwgPSBobFsyXTtcblxuICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICBiICs9IGEgPj4+IDE2O1xuICAgIGMgKz0gYiA+Pj4gMTY7XG4gICAgZCArPSBjID4+PiAxNjtcblxuICAgIGhoWzJdID0gYWgyID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xuICAgIGhsWzJdID0gYWwyID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xuXG4gICAgaCA9IGFoMztcbiAgICBsID0gYWwzO1xuXG4gICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcbiAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xuXG4gICAgaCA9IGhoWzNdO1xuICAgIGwgPSBobFszXTtcblxuICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICBiICs9IGEgPj4+IDE2O1xuICAgIGMgKz0gYiA+Pj4gMTY7XG4gICAgZCArPSBjID4+PiAxNjtcblxuICAgIGhoWzNdID0gYWgzID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xuICAgIGhsWzNdID0gYWwzID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xuXG4gICAgaCA9IGFoNDtcbiAgICBsID0gYWw0O1xuXG4gICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcbiAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xuXG4gICAgaCA9IGhoWzRdO1xuICAgIGwgPSBobFs0XTtcblxuICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICBiICs9IGEgPj4+IDE2O1xuICAgIGMgKz0gYiA+Pj4gMTY7XG4gICAgZCArPSBjID4+PiAxNjtcblxuICAgIGhoWzRdID0gYWg0ID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xuICAgIGhsWzRdID0gYWw0ID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xuXG4gICAgaCA9IGFoNTtcbiAgICBsID0gYWw1O1xuXG4gICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcbiAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xuXG4gICAgaCA9IGhoWzVdO1xuICAgIGwgPSBobFs1XTtcblxuICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICBiICs9IGEgPj4+IDE2O1xuICAgIGMgKz0gYiA+Pj4gMTY7XG4gICAgZCArPSBjID4+PiAxNjtcblxuICAgIGhoWzVdID0gYWg1ID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xuICAgIGhsWzVdID0gYWw1ID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xuXG4gICAgaCA9IGFoNjtcbiAgICBsID0gYWw2O1xuXG4gICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcbiAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xuXG4gICAgaCA9IGhoWzZdO1xuICAgIGwgPSBobFs2XTtcblxuICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICBiICs9IGEgPj4+IDE2O1xuICAgIGMgKz0gYiA+Pj4gMTY7XG4gICAgZCArPSBjID4+PiAxNjtcblxuICAgIGhoWzZdID0gYWg2ID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xuICAgIGhsWzZdID0gYWw2ID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xuXG4gICAgaCA9IGFoNztcbiAgICBsID0gYWw3O1xuXG4gICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcbiAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xuXG4gICAgaCA9IGhoWzddO1xuICAgIGwgPSBobFs3XTtcblxuICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICBiICs9IGEgPj4+IDE2O1xuICAgIGMgKz0gYiA+Pj4gMTY7XG4gICAgZCArPSBjID4+PiAxNjtcblxuICAgIGhoWzddID0gYWg3ID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xuICAgIGhsWzddID0gYWw3ID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xuXG4gICAgcG9zICs9IDEyODtcbiAgICBuIC09IDEyODtcbiAgfVxuXG4gIHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBjcnlwdG9faGFzaChvdXQsIG0sIG4pIHtcbiAgdmFyIGhoID0gbmV3IEludDMyQXJyYXkoOCksXG4gICAgICBobCA9IG5ldyBJbnQzMkFycmF5KDgpLFxuICAgICAgeCA9IG5ldyBVaW50OEFycmF5KDI1NiksXG4gICAgICBpLCBiID0gbjtcblxuICBoaFswXSA9IDB4NmEwOWU2Njc7XG4gIGhoWzFdID0gMHhiYjY3YWU4NTtcbiAgaGhbMl0gPSAweDNjNmVmMzcyO1xuICBoaFszXSA9IDB4YTU0ZmY1M2E7XG4gIGhoWzRdID0gMHg1MTBlNTI3ZjtcbiAgaGhbNV0gPSAweDliMDU2ODhjO1xuICBoaFs2XSA9IDB4MWY4M2Q5YWI7XG4gIGhoWzddID0gMHg1YmUwY2QxOTtcblxuICBobFswXSA9IDB4ZjNiY2M5MDg7XG4gIGhsWzFdID0gMHg4NGNhYTczYjtcbiAgaGxbMl0gPSAweGZlOTRmODJiO1xuICBobFszXSA9IDB4NWYxZDM2ZjE7XG4gIGhsWzRdID0gMHhhZGU2ODJkMTtcbiAgaGxbNV0gPSAweDJiM2U2YzFmO1xuICBobFs2XSA9IDB4ZmI0MWJkNmI7XG4gIGhsWzddID0gMHgxMzdlMjE3OTtcblxuICBjcnlwdG9faGFzaGJsb2Nrc19obChoaCwgaGwsIG0sIG4pO1xuICBuICU9IDEyODtcblxuICBmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSB4W2ldID0gbVtiLW4raV07XG4gIHhbbl0gPSAxMjg7XG5cbiAgbiA9IDI1Ni0xMjgqKG48MTEyPzE6MCk7XG4gIHhbbi05XSA9IDA7XG4gIHRzNjQoeCwgbi04LCAgKGIgLyAweDIwMDAwMDAwKSB8IDAsIGIgPDwgMyk7XG4gIGNyeXB0b19oYXNoYmxvY2tzX2hsKGhoLCBobCwgeCwgbik7XG5cbiAgZm9yIChpID0gMDsgaSA8IDg7IGkrKykgdHM2NChvdXQsIDgqaSwgaGhbaV0sIGhsW2ldKTtcblxuICByZXR1cm4gMDtcbn1cblxuZnVuY3Rpb24gYWRkKHAsIHEpIHtcbiAgdmFyIGEgPSBnZigpLCBiID0gZ2YoKSwgYyA9IGdmKCksXG4gICAgICBkID0gZ2YoKSwgZSA9IGdmKCksIGYgPSBnZigpLFxuICAgICAgZyA9IGdmKCksIGggPSBnZigpLCB0ID0gZ2YoKTtcblxuICBaKGEsIHBbMV0sIHBbMF0pO1xuICBaKHQsIHFbMV0sIHFbMF0pO1xuICBNKGEsIGEsIHQpO1xuICBBKGIsIHBbMF0sIHBbMV0pO1xuICBBKHQsIHFbMF0sIHFbMV0pO1xuICBNKGIsIGIsIHQpO1xuICBNKGMsIHBbM10sIHFbM10pO1xuICBNKGMsIGMsIEQyKTtcbiAgTShkLCBwWzJdLCBxWzJdKTtcbiAgQShkLCBkLCBkKTtcbiAgWihlLCBiLCBhKTtcbiAgWihmLCBkLCBjKTtcbiAgQShnLCBkLCBjKTtcbiAgQShoLCBiLCBhKTtcblxuICBNKHBbMF0sIGUsIGYpO1xuICBNKHBbMV0sIGgsIGcpO1xuICBNKHBbMl0sIGcsIGYpO1xuICBNKHBbM10sIGUsIGgpO1xufVxuXG5mdW5jdGlvbiBjc3dhcChwLCBxLCBiKSB7XG4gIHZhciBpO1xuICBmb3IgKGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgc2VsMjU1MTkocFtpXSwgcVtpXSwgYik7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFjayhyLCBwKSB7XG4gIHZhciB0eCA9IGdmKCksIHR5ID0gZ2YoKSwgemkgPSBnZigpO1xuICBpbnYyNTUxOSh6aSwgcFsyXSk7XG4gIE0odHgsIHBbMF0sIHppKTtcbiAgTSh0eSwgcFsxXSwgemkpO1xuICBwYWNrMjU1MTkociwgdHkpO1xuICByWzMxXSBePSBwYXIyNTUxOSh0eCkgPDwgNztcbn1cblxuZnVuY3Rpb24gc2NhbGFybXVsdChwLCBxLCBzKSB7XG4gIHZhciBiLCBpO1xuICBzZXQyNTUxOShwWzBdLCBnZjApO1xuICBzZXQyNTUxOShwWzFdLCBnZjEpO1xuICBzZXQyNTUxOShwWzJdLCBnZjEpO1xuICBzZXQyNTUxOShwWzNdLCBnZjApO1xuICBmb3IgKGkgPSAyNTU7IGkgPj0gMDsgLS1pKSB7XG4gICAgYiA9IChzWyhpLzgpfDBdID4+IChpJjcpKSAmIDE7XG4gICAgY3N3YXAocCwgcSwgYik7XG4gICAgYWRkKHEsIHApO1xuICAgIGFkZChwLCBwKTtcbiAgICBjc3dhcChwLCBxLCBiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzY2FsYXJiYXNlKHAsIHMpIHtcbiAgdmFyIHEgPSBbZ2YoKSwgZ2YoKSwgZ2YoKSwgZ2YoKV07XG4gIHNldDI1NTE5KHFbMF0sIFgpO1xuICBzZXQyNTUxOShxWzFdLCBZKTtcbiAgc2V0MjU1MTkocVsyXSwgZ2YxKTtcbiAgTShxWzNdLCBYLCBZKTtcbiAgc2NhbGFybXVsdChwLCBxLCBzKTtcbn1cblxuZnVuY3Rpb24gY3J5cHRvX3NpZ25fa2V5cGFpcihwaywgc2ssIHNlZWRlZCkge1xuICB2YXIgZCA9IG5ldyBVaW50OEFycmF5KDY0KTtcbiAgdmFyIHAgPSBbZ2YoKSwgZ2YoKSwgZ2YoKSwgZ2YoKV07XG4gIHZhciBpO1xuXG4gIGlmICghc2VlZGVkKSByYW5kb21ieXRlcyhzaywgMzIpO1xuICBjcnlwdG9faGFzaChkLCBzaywgMzIpO1xuICBkWzBdICY9IDI0ODtcbiAgZFszMV0gJj0gMTI3O1xuICBkWzMxXSB8PSA2NDtcblxuICBzY2FsYXJiYXNlKHAsIGQpO1xuICBwYWNrKHBrLCBwKTtcblxuICBmb3IgKGkgPSAwOyBpIDwgMzI7IGkrKykgc2tbaSszMl0gPSBwa1tpXTtcbiAgcmV0dXJuIDA7XG59XG5cbnZhciBMID0gbmV3IEZsb2F0NjRBcnJheShbMHhlZCwgMHhkMywgMHhmNSwgMHg1YywgMHgxYSwgMHg2MywgMHgxMiwgMHg1OCwgMHhkNiwgMHg5YywgMHhmNywgMHhhMiwgMHhkZSwgMHhmOSwgMHhkZSwgMHgxNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMHgxMF0pO1xuXG5mdW5jdGlvbiBtb2RMKHIsIHgpIHtcbiAgdmFyIGNhcnJ5LCBpLCBqLCBrO1xuICBmb3IgKGkgPSA2MzsgaSA+PSAzMjsgLS1pKSB7XG4gICAgY2FycnkgPSAwO1xuICAgIGZvciAoaiA9IGkgLSAzMiwgayA9IGkgLSAxMjsgaiA8IGs7ICsraikge1xuICAgICAgeFtqXSArPSBjYXJyeSAtIDE2ICogeFtpXSAqIExbaiAtIChpIC0gMzIpXTtcbiAgICAgIGNhcnJ5ID0gKHhbal0gKyAxMjgpID4+IDg7XG4gICAgICB4W2pdIC09IGNhcnJ5ICogMjU2O1xuICAgIH1cbiAgICB4W2pdICs9IGNhcnJ5O1xuICAgIHhbaV0gPSAwO1xuICB9XG4gIGNhcnJ5ID0gMDtcbiAgZm9yIChqID0gMDsgaiA8IDMyOyBqKyspIHtcbiAgICB4W2pdICs9IGNhcnJ5IC0gKHhbMzFdID4+IDQpICogTFtqXTtcbiAgICBjYXJyeSA9IHhbal0gPj4gODtcbiAgICB4W2pdICY9IDI1NTtcbiAgfVxuICBmb3IgKGogPSAwOyBqIDwgMzI7IGorKykgeFtqXSAtPSBjYXJyeSAqIExbal07XG4gIGZvciAoaSA9IDA7IGkgPCAzMjsgaSsrKSB7XG4gICAgeFtpKzFdICs9IHhbaV0gPj4gODtcbiAgICByW2ldID0geFtpXSAmIDI1NTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWR1Y2Uocikge1xuICB2YXIgeCA9IG5ldyBGbG9hdDY0QXJyYXkoNjQpLCBpO1xuICBmb3IgKGkgPSAwOyBpIDwgNjQ7IGkrKykgeFtpXSA9IHJbaV07XG4gIGZvciAoaSA9IDA7IGkgPCA2NDsgaSsrKSByW2ldID0gMDtcbiAgbW9kTChyLCB4KTtcbn1cblxuLy8gTm90ZTogZGlmZmVyZW5jZSBmcm9tIEMgLSBzbWxlbiByZXR1cm5lZCwgbm90IHBhc3NlZCBhcyBhcmd1bWVudC5cbmZ1bmN0aW9uIGNyeXB0b19zaWduKHNtLCBtLCBuLCBzaykge1xuICB2YXIgZCA9IG5ldyBVaW50OEFycmF5KDY0KSwgaCA9IG5ldyBVaW50OEFycmF5KDY0KSwgciA9IG5ldyBVaW50OEFycmF5KDY0KTtcbiAgdmFyIGksIGosIHggPSBuZXcgRmxvYXQ2NEFycmF5KDY0KTtcbiAgdmFyIHAgPSBbZ2YoKSwgZ2YoKSwgZ2YoKSwgZ2YoKV07XG5cbiAgY3J5cHRvX2hhc2goZCwgc2ssIDMyKTtcbiAgZFswXSAmPSAyNDg7XG4gIGRbMzFdICY9IDEyNztcbiAgZFszMV0gfD0gNjQ7XG5cbiAgdmFyIHNtbGVuID0gbiArIDY0O1xuICBmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSBzbVs2NCArIGldID0gbVtpXTtcbiAgZm9yIChpID0gMDsgaSA8IDMyOyBpKyspIHNtWzMyICsgaV0gPSBkWzMyICsgaV07XG5cbiAgY3J5cHRvX2hhc2gociwgc20uc3ViYXJyYXkoMzIpLCBuKzMyKTtcbiAgcmVkdWNlKHIpO1xuICBzY2FsYXJiYXNlKHAsIHIpO1xuICBwYWNrKHNtLCBwKTtcblxuICBmb3IgKGkgPSAzMjsgaSA8IDY0OyBpKyspIHNtW2ldID0gc2tbaV07XG4gIGNyeXB0b19oYXNoKGgsIHNtLCBuICsgNjQpO1xuICByZWR1Y2UoaCk7XG5cbiAgZm9yIChpID0gMDsgaSA8IDY0OyBpKyspIHhbaV0gPSAwO1xuICBmb3IgKGkgPSAwOyBpIDwgMzI7IGkrKykgeFtpXSA9IHJbaV07XG4gIGZvciAoaSA9IDA7IGkgPCAzMjsgaSsrKSB7XG4gICAgZm9yIChqID0gMDsgaiA8IDMyOyBqKyspIHtcbiAgICAgIHhbaStqXSArPSBoW2ldICogZFtqXTtcbiAgICB9XG4gIH1cblxuICBtb2RMKHNtLnN1YmFycmF5KDMyKSwgeCk7XG4gIHJldHVybiBzbWxlbjtcbn1cblxuZnVuY3Rpb24gdW5wYWNrbmVnKHIsIHApIHtcbiAgdmFyIHQgPSBnZigpLCBjaGsgPSBnZigpLCBudW0gPSBnZigpLFxuICAgICAgZGVuID0gZ2YoKSwgZGVuMiA9IGdmKCksIGRlbjQgPSBnZigpLFxuICAgICAgZGVuNiA9IGdmKCk7XG5cbiAgc2V0MjU1MTkoclsyXSwgZ2YxKTtcbiAgdW5wYWNrMjU1MTkoclsxXSwgcCk7XG4gIFMobnVtLCByWzFdKTtcbiAgTShkZW4sIG51bSwgRCk7XG4gIFoobnVtLCBudW0sIHJbMl0pO1xuICBBKGRlbiwgclsyXSwgZGVuKTtcblxuICBTKGRlbjIsIGRlbik7XG4gIFMoZGVuNCwgZGVuMik7XG4gIE0oZGVuNiwgZGVuNCwgZGVuMik7XG4gIE0odCwgZGVuNiwgbnVtKTtcbiAgTSh0LCB0LCBkZW4pO1xuXG4gIHBvdzI1MjModCwgdCk7XG4gIE0odCwgdCwgbnVtKTtcbiAgTSh0LCB0LCBkZW4pO1xuICBNKHQsIHQsIGRlbik7XG4gIE0oclswXSwgdCwgZGVuKTtcblxuICBTKGNoaywgclswXSk7XG4gIE0oY2hrLCBjaGssIGRlbik7XG4gIGlmIChuZXEyNTUxOShjaGssIG51bSkpIE0oclswXSwgclswXSwgSSk7XG5cbiAgUyhjaGssIHJbMF0pO1xuICBNKGNoaywgY2hrLCBkZW4pO1xuICBpZiAobmVxMjU1MTkoY2hrLCBudW0pKSByZXR1cm4gLTE7XG5cbiAgaWYgKHBhcjI1NTE5KHJbMF0pID09PSAocFszMV0+PjcpKSBaKHJbMF0sIGdmMCwgclswXSk7XG5cbiAgTShyWzNdLCByWzBdLCByWzFdKTtcbiAgcmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIGNyeXB0b19zaWduX29wZW4obSwgc20sIG4sIHBrKSB7XG4gIHZhciBpLCBtbGVuO1xuICB2YXIgdCA9IG5ldyBVaW50OEFycmF5KDMyKSwgaCA9IG5ldyBVaW50OEFycmF5KDY0KTtcbiAgdmFyIHAgPSBbZ2YoKSwgZ2YoKSwgZ2YoKSwgZ2YoKV0sXG4gICAgICBxID0gW2dmKCksIGdmKCksIGdmKCksIGdmKCldO1xuXG4gIG1sZW4gPSAtMTtcbiAgaWYgKG4gPCA2NCkgcmV0dXJuIC0xO1xuXG4gIGlmICh1bnBhY2tuZWcocSwgcGspKSByZXR1cm4gLTE7XG5cbiAgZm9yIChpID0gMDsgaSA8IG47IGkrKykgbVtpXSA9IHNtW2ldO1xuICBmb3IgKGkgPSAwOyBpIDwgMzI7IGkrKykgbVtpKzMyXSA9IHBrW2ldO1xuICBjcnlwdG9faGFzaChoLCBtLCBuKTtcbiAgcmVkdWNlKGgpO1xuICBzY2FsYXJtdWx0KHAsIHEsIGgpO1xuXG4gIHNjYWxhcmJhc2UocSwgc20uc3ViYXJyYXkoMzIpKTtcbiAgYWRkKHAsIHEpO1xuICBwYWNrKHQsIHApO1xuXG4gIG4gLT0gNjQ7XG4gIGlmIChjcnlwdG9fdmVyaWZ5XzMyKHNtLCAwLCB0LCAwKSkge1xuICAgIGZvciAoaSA9IDA7IGkgPCBuOyBpKyspIG1baV0gPSAwO1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCBuOyBpKyspIG1baV0gPSBzbVtpICsgNjRdO1xuICBtbGVuID0gbjtcbiAgcmV0dXJuIG1sZW47XG59XG5cbnZhciBjcnlwdG9fc2VjcmV0Ym94X0tFWUJZVEVTID0gMzIsXG4gICAgY3J5cHRvX3NlY3JldGJveF9OT05DRUJZVEVTID0gMjQsXG4gICAgY3J5cHRvX3NlY3JldGJveF9aRVJPQllURVMgPSAzMixcbiAgICBjcnlwdG9fc2VjcmV0Ym94X0JPWFpFUk9CWVRFUyA9IDE2LFxuICAgIGNyeXB0b19zY2FsYXJtdWx0X0JZVEVTID0gMzIsXG4gICAgY3J5cHRvX3NjYWxhcm11bHRfU0NBTEFSQllURVMgPSAzMixcbiAgICBjcnlwdG9fYm94X1BVQkxJQ0tFWUJZVEVTID0gMzIsXG4gICAgY3J5cHRvX2JveF9TRUNSRVRLRVlCWVRFUyA9IDMyLFxuICAgIGNyeXB0b19ib3hfQkVGT1JFTk1CWVRFUyA9IDMyLFxuICAgIGNyeXB0b19ib3hfTk9OQ0VCWVRFUyA9IGNyeXB0b19zZWNyZXRib3hfTk9OQ0VCWVRFUyxcbiAgICBjcnlwdG9fYm94X1pFUk9CWVRFUyA9IGNyeXB0b19zZWNyZXRib3hfWkVST0JZVEVTLFxuICAgIGNyeXB0b19ib3hfQk9YWkVST0JZVEVTID0gY3J5cHRvX3NlY3JldGJveF9CT1haRVJPQllURVMsXG4gICAgY3J5cHRvX3NpZ25fQllURVMgPSA2NCxcbiAgICBjcnlwdG9fc2lnbl9QVUJMSUNLRVlCWVRFUyA9IDMyLFxuICAgIGNyeXB0b19zaWduX1NFQ1JFVEtFWUJZVEVTID0gNjQsXG4gICAgY3J5cHRvX3NpZ25fU0VFREJZVEVTID0gMzIsXG4gICAgY3J5cHRvX2hhc2hfQllURVMgPSA2NDtcblxubmFjbC5sb3dsZXZlbCA9IHtcbiAgY3J5cHRvX2NvcmVfaHNhbHNhMjA6IGNyeXB0b19jb3JlX2hzYWxzYTIwLFxuICBjcnlwdG9fc3RyZWFtX3hvcjogY3J5cHRvX3N0cmVhbV94b3IsXG4gIGNyeXB0b19zdHJlYW06IGNyeXB0b19zdHJlYW0sXG4gIGNyeXB0b19zdHJlYW1fc2Fsc2EyMF94b3I6IGNyeXB0b19zdHJlYW1fc2Fsc2EyMF94b3IsXG4gIGNyeXB0b19zdHJlYW1fc2Fsc2EyMDogY3J5cHRvX3N0cmVhbV9zYWxzYTIwLFxuICBjcnlwdG9fb25ldGltZWF1dGg6IGNyeXB0b19vbmV0aW1lYXV0aCxcbiAgY3J5cHRvX29uZXRpbWVhdXRoX3ZlcmlmeTogY3J5cHRvX29uZXRpbWVhdXRoX3ZlcmlmeSxcbiAgY3J5cHRvX3ZlcmlmeV8xNjogY3J5cHRvX3ZlcmlmeV8xNixcbiAgY3J5cHRvX3ZlcmlmeV8zMjogY3J5cHRvX3ZlcmlmeV8zMixcbiAgY3J5cHRvX3NlY3JldGJveDogY3J5cHRvX3NlY3JldGJveCxcbiAgY3J5cHRvX3NlY3JldGJveF9vcGVuOiBjcnlwdG9fc2VjcmV0Ym94X29wZW4sXG4gIGNyeXB0b19zY2FsYXJtdWx0OiBjcnlwdG9fc2NhbGFybXVsdCxcbiAgY3J5cHRvX3NjYWxhcm11bHRfYmFzZTogY3J5cHRvX3NjYWxhcm11bHRfYmFzZSxcbiAgY3J5cHRvX2JveF9iZWZvcmVubTogY3J5cHRvX2JveF9iZWZvcmVubSxcbiAgY3J5cHRvX2JveF9hZnRlcm5tOiBjcnlwdG9fYm94X2FmdGVybm0sXG4gIGNyeXB0b19ib3g6IGNyeXB0b19ib3gsXG4gIGNyeXB0b19ib3hfb3BlbjogY3J5cHRvX2JveF9vcGVuLFxuICBjcnlwdG9fYm94X2tleXBhaXI6IGNyeXB0b19ib3hfa2V5cGFpcixcbiAgY3J5cHRvX2hhc2g6IGNyeXB0b19oYXNoLFxuICBjcnlwdG9fc2lnbjogY3J5cHRvX3NpZ24sXG4gIGNyeXB0b19zaWduX2tleXBhaXI6IGNyeXB0b19zaWduX2tleXBhaXIsXG4gIGNyeXB0b19zaWduX29wZW46IGNyeXB0b19zaWduX29wZW4sXG5cbiAgY3J5cHRvX3NlY3JldGJveF9LRVlCWVRFUzogY3J5cHRvX3NlY3JldGJveF9LRVlCWVRFUyxcbiAgY3J5cHRvX3NlY3JldGJveF9OT05DRUJZVEVTOiBjcnlwdG9fc2VjcmV0Ym94X05PTkNFQllURVMsXG4gIGNyeXB0b19zZWNyZXRib3hfWkVST0JZVEVTOiBjcnlwdG9fc2VjcmV0Ym94X1pFUk9CWVRFUyxcbiAgY3J5cHRvX3NlY3JldGJveF9CT1haRVJPQllURVM6IGNyeXB0b19zZWNyZXRib3hfQk9YWkVST0JZVEVTLFxuICBjcnlwdG9fc2NhbGFybXVsdF9CWVRFUzogY3J5cHRvX3NjYWxhcm11bHRfQllURVMsXG4gIGNyeXB0b19zY2FsYXJtdWx0X1NDQUxBUkJZVEVTOiBjcnlwdG9fc2NhbGFybXVsdF9TQ0FMQVJCWVRFUyxcbiAgY3J5cHRvX2JveF9QVUJMSUNLRVlCWVRFUzogY3J5cHRvX2JveF9QVUJMSUNLRVlCWVRFUyxcbiAgY3J5cHRvX2JveF9TRUNSRVRLRVlCWVRFUzogY3J5cHRvX2JveF9TRUNSRVRLRVlCWVRFUyxcbiAgY3J5cHRvX2JveF9CRUZPUkVOTUJZVEVTOiBjcnlwdG9fYm94X0JFRk9SRU5NQllURVMsXG4gIGNyeXB0b19ib3hfTk9OQ0VCWVRFUzogY3J5cHRvX2JveF9OT05DRUJZVEVTLFxuICBjcnlwdG9fYm94X1pFUk9CWVRFUzogY3J5cHRvX2JveF9aRVJPQllURVMsXG4gIGNyeXB0b19ib3hfQk9YWkVST0JZVEVTOiBjcnlwdG9fYm94X0JPWFpFUk9CWVRFUyxcbiAgY3J5cHRvX3NpZ25fQllURVM6IGNyeXB0b19zaWduX0JZVEVTLFxuICBjcnlwdG9fc2lnbl9QVUJMSUNLRVlCWVRFUzogY3J5cHRvX3NpZ25fUFVCTElDS0VZQllURVMsXG4gIGNyeXB0b19zaWduX1NFQ1JFVEtFWUJZVEVTOiBjcnlwdG9fc2lnbl9TRUNSRVRLRVlCWVRFUyxcbiAgY3J5cHRvX3NpZ25fU0VFREJZVEVTOiBjcnlwdG9fc2lnbl9TRUVEQllURVMsXG4gIGNyeXB0b19oYXNoX0JZVEVTOiBjcnlwdG9faGFzaF9CWVRFU1xufTtcblxuLyogSGlnaC1sZXZlbCBBUEkgKi9cblxuZnVuY3Rpb24gY2hlY2tMZW5ndGhzKGssIG4pIHtcbiAgaWYgKGsubGVuZ3RoICE9PSBjcnlwdG9fc2VjcmV0Ym94X0tFWUJZVEVTKSB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBrZXkgc2l6ZScpO1xuICBpZiAobi5sZW5ndGggIT09IGNyeXB0b19zZWNyZXRib3hfTk9OQ0VCWVRFUykgdGhyb3cgbmV3IEVycm9yKCdiYWQgbm9uY2Ugc2l6ZScpO1xufVxuXG5mdW5jdGlvbiBjaGVja0JveExlbmd0aHMocGssIHNrKSB7XG4gIGlmIChway5sZW5ndGggIT09IGNyeXB0b19ib3hfUFVCTElDS0VZQllURVMpIHRocm93IG5ldyBFcnJvcignYmFkIHB1YmxpYyBrZXkgc2l6ZScpO1xuICBpZiAoc2subGVuZ3RoICE9PSBjcnlwdG9fYm94X1NFQ1JFVEtFWUJZVEVTKSB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBzZWNyZXQga2V5IHNpemUnKTtcbn1cblxuZnVuY3Rpb24gY2hlY2tBcnJheVR5cGVzKCkge1xuICB2YXIgdCwgaTtcbiAgZm9yIChpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICBpZiAoKHQgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJndW1lbnRzW2ldKSkgIT09ICdbb2JqZWN0IFVpbnQ4QXJyYXldJylcbiAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd1bmV4cGVjdGVkIHR5cGUgJyArIHQgKyAnLCB1c2UgVWludDhBcnJheScpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNsZWFudXAoYXJyKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBhcnJbaV0gPSAwO1xufVxuXG4vLyBUT0RPOiBDb21wbGV0ZWx5IHJlbW92ZSB0aGlzIGluIHYwLjE1LlxuaWYgKCFuYWNsLnV0aWwpIHtcbiAgbmFjbC51dGlsID0ge307XG4gIG5hY2wudXRpbC5kZWNvZGVVVEY4ID0gbmFjbC51dGlsLmVuY29kZVVURjggPSBuYWNsLnV0aWwuZW5jb2RlQmFzZTY0ID0gbmFjbC51dGlsLmRlY29kZUJhc2U2NCA9IGZ1bmN0aW9uKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignbmFjbC51dGlsIG1vdmVkIGludG8gc2VwYXJhdGUgcGFja2FnZTogaHR0cHM6Ly9naXRodWIuY29tL2RjaGVzdC90d2VldG5hY2wtdXRpbC1qcycpO1xuICB9O1xufVxuXG5uYWNsLnJhbmRvbUJ5dGVzID0gZnVuY3Rpb24obikge1xuICB2YXIgYiA9IG5ldyBVaW50OEFycmF5KG4pO1xuICByYW5kb21ieXRlcyhiLCBuKTtcbiAgcmV0dXJuIGI7XG59O1xuXG5uYWNsLnNlY3JldGJveCA9IGZ1bmN0aW9uKG1zZywgbm9uY2UsIGtleSkge1xuICBjaGVja0FycmF5VHlwZXMobXNnLCBub25jZSwga2V5KTtcbiAgY2hlY2tMZW5ndGhzKGtleSwgbm9uY2UpO1xuICB2YXIgbSA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19zZWNyZXRib3hfWkVST0JZVEVTICsgbXNnLmxlbmd0aCk7XG4gIHZhciBjID0gbmV3IFVpbnQ4QXJyYXkobS5sZW5ndGgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG1zZy5sZW5ndGg7IGkrKykgbVtpK2NyeXB0b19zZWNyZXRib3hfWkVST0JZVEVTXSA9IG1zZ1tpXTtcbiAgY3J5cHRvX3NlY3JldGJveChjLCBtLCBtLmxlbmd0aCwgbm9uY2UsIGtleSk7XG4gIHJldHVybiBjLnN1YmFycmF5KGNyeXB0b19zZWNyZXRib3hfQk9YWkVST0JZVEVTKTtcbn07XG5cbm5hY2wuc2VjcmV0Ym94Lm9wZW4gPSBmdW5jdGlvbihib3gsIG5vbmNlLCBrZXkpIHtcbiAgY2hlY2tBcnJheVR5cGVzKGJveCwgbm9uY2UsIGtleSk7XG4gIGNoZWNrTGVuZ3RocyhrZXksIG5vbmNlKTtcbiAgdmFyIGMgPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2VjcmV0Ym94X0JPWFpFUk9CWVRFUyArIGJveC5sZW5ndGgpO1xuICB2YXIgbSA9IG5ldyBVaW50OEFycmF5KGMubGVuZ3RoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBib3gubGVuZ3RoOyBpKyspIGNbaStjcnlwdG9fc2VjcmV0Ym94X0JPWFpFUk9CWVRFU10gPSBib3hbaV07XG4gIGlmIChjLmxlbmd0aCA8IDMyKSByZXR1cm4gZmFsc2U7XG4gIGlmIChjcnlwdG9fc2VjcmV0Ym94X29wZW4obSwgYywgYy5sZW5ndGgsIG5vbmNlLCBrZXkpICE9PSAwKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiBtLnN1YmFycmF5KGNyeXB0b19zZWNyZXRib3hfWkVST0JZVEVTKTtcbn07XG5cbm5hY2wuc2VjcmV0Ym94LmtleUxlbmd0aCA9IGNyeXB0b19zZWNyZXRib3hfS0VZQllURVM7XG5uYWNsLnNlY3JldGJveC5ub25jZUxlbmd0aCA9IGNyeXB0b19zZWNyZXRib3hfTk9OQ0VCWVRFUztcbm5hY2wuc2VjcmV0Ym94Lm92ZXJoZWFkTGVuZ3RoID0gY3J5cHRvX3NlY3JldGJveF9CT1haRVJPQllURVM7XG5cbm5hY2wuc2NhbGFyTXVsdCA9IGZ1bmN0aW9uKG4sIHApIHtcbiAgY2hlY2tBcnJheVR5cGVzKG4sIHApO1xuICBpZiAobi5sZW5ndGggIT09IGNyeXB0b19zY2FsYXJtdWx0X1NDQUxBUkJZVEVTKSB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBuIHNpemUnKTtcbiAgaWYgKHAubGVuZ3RoICE9PSBjcnlwdG9fc2NhbGFybXVsdF9CWVRFUykgdGhyb3cgbmV3IEVycm9yKCdiYWQgcCBzaXplJyk7XG4gIHZhciBxID0gbmV3IFVpbnQ4QXJyYXkoY3J5cHRvX3NjYWxhcm11bHRfQllURVMpO1xuICBjcnlwdG9fc2NhbGFybXVsdChxLCBuLCBwKTtcbiAgcmV0dXJuIHE7XG59O1xuXG5uYWNsLnNjYWxhck11bHQuYmFzZSA9IGZ1bmN0aW9uKG4pIHtcbiAgY2hlY2tBcnJheVR5cGVzKG4pO1xuICBpZiAobi5sZW5ndGggIT09IGNyeXB0b19zY2FsYXJtdWx0X1NDQUxBUkJZVEVTKSB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBuIHNpemUnKTtcbiAgdmFyIHEgPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2NhbGFybXVsdF9CWVRFUyk7XG4gIGNyeXB0b19zY2FsYXJtdWx0X2Jhc2UocSwgbik7XG4gIHJldHVybiBxO1xufTtcblxubmFjbC5zY2FsYXJNdWx0LnNjYWxhckxlbmd0aCA9IGNyeXB0b19zY2FsYXJtdWx0X1NDQUxBUkJZVEVTO1xubmFjbC5zY2FsYXJNdWx0Lmdyb3VwRWxlbWVudExlbmd0aCA9IGNyeXB0b19zY2FsYXJtdWx0X0JZVEVTO1xuXG5uYWNsLmJveCA9IGZ1bmN0aW9uKG1zZywgbm9uY2UsIHB1YmxpY0tleSwgc2VjcmV0S2V5KSB7XG4gIHZhciBrID0gbmFjbC5ib3guYmVmb3JlKHB1YmxpY0tleSwgc2VjcmV0S2V5KTtcbiAgcmV0dXJuIG5hY2wuc2VjcmV0Ym94KG1zZywgbm9uY2UsIGspO1xufTtcblxubmFjbC5ib3guYmVmb3JlID0gZnVuY3Rpb24ocHVibGljS2V5LCBzZWNyZXRLZXkpIHtcbiAgY2hlY2tBcnJheVR5cGVzKHB1YmxpY0tleSwgc2VjcmV0S2V5KTtcbiAgY2hlY2tCb3hMZW5ndGhzKHB1YmxpY0tleSwgc2VjcmV0S2V5KTtcbiAgdmFyIGsgPSBuZXcgVWludDhBcnJheShjcnlwdG9fYm94X0JFRk9SRU5NQllURVMpO1xuICBjcnlwdG9fYm94X2JlZm9yZW5tKGssIHB1YmxpY0tleSwgc2VjcmV0S2V5KTtcbiAgcmV0dXJuIGs7XG59O1xuXG5uYWNsLmJveC5hZnRlciA9IG5hY2wuc2VjcmV0Ym94O1xuXG5uYWNsLmJveC5vcGVuID0gZnVuY3Rpb24obXNnLCBub25jZSwgcHVibGljS2V5LCBzZWNyZXRLZXkpIHtcbiAgdmFyIGsgPSBuYWNsLmJveC5iZWZvcmUocHVibGljS2V5LCBzZWNyZXRLZXkpO1xuICByZXR1cm4gbmFjbC5zZWNyZXRib3gub3Blbihtc2csIG5vbmNlLCBrKTtcbn07XG5cbm5hY2wuYm94Lm9wZW4uYWZ0ZXIgPSBuYWNsLnNlY3JldGJveC5vcGVuO1xuXG5uYWNsLmJveC5rZXlQYWlyID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwayA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19ib3hfUFVCTElDS0VZQllURVMpO1xuICB2YXIgc2sgPSBuZXcgVWludDhBcnJheShjcnlwdG9fYm94X1NFQ1JFVEtFWUJZVEVTKTtcbiAgY3J5cHRvX2JveF9rZXlwYWlyKHBrLCBzayk7XG4gIHJldHVybiB7cHVibGljS2V5OiBwaywgc2VjcmV0S2V5OiBza307XG59O1xuXG5uYWNsLmJveC5rZXlQYWlyLmZyb21TZWNyZXRLZXkgPSBmdW5jdGlvbihzZWNyZXRLZXkpIHtcbiAgY2hlY2tBcnJheVR5cGVzKHNlY3JldEtleSk7XG4gIGlmIChzZWNyZXRLZXkubGVuZ3RoICE9PSBjcnlwdG9fYm94X1NFQ1JFVEtFWUJZVEVTKVxuICAgIHRocm93IG5ldyBFcnJvcignYmFkIHNlY3JldCBrZXkgc2l6ZScpO1xuICB2YXIgcGsgPSBuZXcgVWludDhBcnJheShjcnlwdG9fYm94X1BVQkxJQ0tFWUJZVEVTKTtcbiAgY3J5cHRvX3NjYWxhcm11bHRfYmFzZShwaywgc2VjcmV0S2V5KTtcbiAgcmV0dXJuIHtwdWJsaWNLZXk6IHBrLCBzZWNyZXRLZXk6IG5ldyBVaW50OEFycmF5KHNlY3JldEtleSl9O1xufTtcblxubmFjbC5ib3gucHVibGljS2V5TGVuZ3RoID0gY3J5cHRvX2JveF9QVUJMSUNLRVlCWVRFUztcbm5hY2wuYm94LnNlY3JldEtleUxlbmd0aCA9IGNyeXB0b19ib3hfU0VDUkVUS0VZQllURVM7XG5uYWNsLmJveC5zaGFyZWRLZXlMZW5ndGggPSBjcnlwdG9fYm94X0JFRk9SRU5NQllURVM7XG5uYWNsLmJveC5ub25jZUxlbmd0aCA9IGNyeXB0b19ib3hfTk9OQ0VCWVRFUztcbm5hY2wuYm94Lm92ZXJoZWFkTGVuZ3RoID0gbmFjbC5zZWNyZXRib3gub3ZlcmhlYWRMZW5ndGg7XG5cbm5hY2wuc2lnbiA9IGZ1bmN0aW9uKG1zZywgc2VjcmV0S2V5KSB7XG4gIGNoZWNrQXJyYXlUeXBlcyhtc2csIHNlY3JldEtleSk7XG4gIGlmIChzZWNyZXRLZXkubGVuZ3RoICE9PSBjcnlwdG9fc2lnbl9TRUNSRVRLRVlCWVRFUylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBzZWNyZXQga2V5IHNpemUnKTtcbiAgdmFyIHNpZ25lZE1zZyA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19zaWduX0JZVEVTK21zZy5sZW5ndGgpO1xuICBjcnlwdG9fc2lnbihzaWduZWRNc2csIG1zZywgbXNnLmxlbmd0aCwgc2VjcmV0S2V5KTtcbiAgcmV0dXJuIHNpZ25lZE1zZztcbn07XG5cbm5hY2wuc2lnbi5vcGVuID0gZnVuY3Rpb24oc2lnbmVkTXNnLCBwdWJsaWNLZXkpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDIpXG4gICAgdGhyb3cgbmV3IEVycm9yKCduYWNsLnNpZ24ub3BlbiBhY2NlcHRzIDIgYXJndW1lbnRzOyBkaWQgeW91IG1lYW4gdG8gdXNlIG5hY2wuc2lnbi5kZXRhY2hlZC52ZXJpZnk/Jyk7XG4gIGNoZWNrQXJyYXlUeXBlcyhzaWduZWRNc2csIHB1YmxpY0tleSk7XG4gIGlmIChwdWJsaWNLZXkubGVuZ3RoICE9PSBjcnlwdG9fc2lnbl9QVUJMSUNLRVlCWVRFUylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBwdWJsaWMga2V5IHNpemUnKTtcbiAgdmFyIHRtcCA9IG5ldyBVaW50OEFycmF5KHNpZ25lZE1zZy5sZW5ndGgpO1xuICB2YXIgbWxlbiA9IGNyeXB0b19zaWduX29wZW4odG1wLCBzaWduZWRNc2csIHNpZ25lZE1zZy5sZW5ndGgsIHB1YmxpY0tleSk7XG4gIGlmIChtbGVuIDwgMCkgcmV0dXJuIG51bGw7XG4gIHZhciBtID0gbmV3IFVpbnQ4QXJyYXkobWxlbik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbS5sZW5ndGg7IGkrKykgbVtpXSA9IHRtcFtpXTtcbiAgcmV0dXJuIG07XG59O1xuXG5uYWNsLnNpZ24uZGV0YWNoZWQgPSBmdW5jdGlvbihtc2csIHNlY3JldEtleSkge1xuICB2YXIgc2lnbmVkTXNnID0gbmFjbC5zaWduKG1zZywgc2VjcmV0S2V5KTtcbiAgdmFyIHNpZyA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19zaWduX0JZVEVTKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaWcubGVuZ3RoOyBpKyspIHNpZ1tpXSA9IHNpZ25lZE1zZ1tpXTtcbiAgcmV0dXJuIHNpZztcbn07XG5cbm5hY2wuc2lnbi5kZXRhY2hlZC52ZXJpZnkgPSBmdW5jdGlvbihtc2csIHNpZywgcHVibGljS2V5KSB7XG4gIGNoZWNrQXJyYXlUeXBlcyhtc2csIHNpZywgcHVibGljS2V5KTtcbiAgaWYgKHNpZy5sZW5ndGggIT09IGNyeXB0b19zaWduX0JZVEVTKVxuICAgIHRocm93IG5ldyBFcnJvcignYmFkIHNpZ25hdHVyZSBzaXplJyk7XG4gIGlmIChwdWJsaWNLZXkubGVuZ3RoICE9PSBjcnlwdG9fc2lnbl9QVUJMSUNLRVlCWVRFUylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBwdWJsaWMga2V5IHNpemUnKTtcbiAgdmFyIHNtID0gbmV3IFVpbnQ4QXJyYXkoY3J5cHRvX3NpZ25fQllURVMgKyBtc2cubGVuZ3RoKTtcbiAgdmFyIG0gPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2lnbl9CWVRFUyArIG1zZy5sZW5ndGgpO1xuICB2YXIgaTtcbiAgZm9yIChpID0gMDsgaSA8IGNyeXB0b19zaWduX0JZVEVTOyBpKyspIHNtW2ldID0gc2lnW2ldO1xuICBmb3IgKGkgPSAwOyBpIDwgbXNnLmxlbmd0aDsgaSsrKSBzbVtpK2NyeXB0b19zaWduX0JZVEVTXSA9IG1zZ1tpXTtcbiAgcmV0dXJuIChjcnlwdG9fc2lnbl9vcGVuKG0sIHNtLCBzbS5sZW5ndGgsIHB1YmxpY0tleSkgPj0gMCk7XG59O1xuXG5uYWNsLnNpZ24ua2V5UGFpciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcGsgPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2lnbl9QVUJMSUNLRVlCWVRFUyk7XG4gIHZhciBzayA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19zaWduX1NFQ1JFVEtFWUJZVEVTKTtcbiAgY3J5cHRvX3NpZ25fa2V5cGFpcihwaywgc2spO1xuICByZXR1cm4ge3B1YmxpY0tleTogcGssIHNlY3JldEtleTogc2t9O1xufTtcblxubmFjbC5zaWduLmtleVBhaXIuZnJvbVNlY3JldEtleSA9IGZ1bmN0aW9uKHNlY3JldEtleSkge1xuICBjaGVja0FycmF5VHlwZXMoc2VjcmV0S2V5KTtcbiAgaWYgKHNlY3JldEtleS5sZW5ndGggIT09IGNyeXB0b19zaWduX1NFQ1JFVEtFWUJZVEVTKVxuICAgIHRocm93IG5ldyBFcnJvcignYmFkIHNlY3JldCBrZXkgc2l6ZScpO1xuICB2YXIgcGsgPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2lnbl9QVUJMSUNLRVlCWVRFUyk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGsubGVuZ3RoOyBpKyspIHBrW2ldID0gc2VjcmV0S2V5WzMyK2ldO1xuICByZXR1cm4ge3B1YmxpY0tleTogcGssIHNlY3JldEtleTogbmV3IFVpbnQ4QXJyYXkoc2VjcmV0S2V5KX07XG59O1xuXG5uYWNsLnNpZ24ua2V5UGFpci5mcm9tU2VlZCA9IGZ1bmN0aW9uKHNlZWQpIHtcbiAgY2hlY2tBcnJheVR5cGVzKHNlZWQpO1xuICBpZiAoc2VlZC5sZW5ndGggIT09IGNyeXB0b19zaWduX1NFRURCWVRFUylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBzZWVkIHNpemUnKTtcbiAgdmFyIHBrID0gbmV3IFVpbnQ4QXJyYXkoY3J5cHRvX3NpZ25fUFVCTElDS0VZQllURVMpO1xuICB2YXIgc2sgPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2lnbl9TRUNSRVRLRVlCWVRFUyk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMzI7IGkrKykgc2tbaV0gPSBzZWVkW2ldO1xuICBjcnlwdG9fc2lnbl9rZXlwYWlyKHBrLCBzaywgdHJ1ZSk7XG4gIHJldHVybiB7cHVibGljS2V5OiBwaywgc2VjcmV0S2V5OiBza307XG59O1xuXG5uYWNsLnNpZ24ucHVibGljS2V5TGVuZ3RoID0gY3J5cHRvX3NpZ25fUFVCTElDS0VZQllURVM7XG5uYWNsLnNpZ24uc2VjcmV0S2V5TGVuZ3RoID0gY3J5cHRvX3NpZ25fU0VDUkVUS0VZQllURVM7XG5uYWNsLnNpZ24uc2VlZExlbmd0aCA9IGNyeXB0b19zaWduX1NFRURCWVRFUztcbm5hY2wuc2lnbi5zaWduYXR1cmVMZW5ndGggPSBjcnlwdG9fc2lnbl9CWVRFUztcblxubmFjbC5oYXNoID0gZnVuY3Rpb24obXNnKSB7XG4gIGNoZWNrQXJyYXlUeXBlcyhtc2cpO1xuICB2YXIgaCA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19oYXNoX0JZVEVTKTtcbiAgY3J5cHRvX2hhc2goaCwgbXNnLCBtc2cubGVuZ3RoKTtcbiAgcmV0dXJuIGg7XG59O1xuXG5uYWNsLmhhc2guaGFzaExlbmd0aCA9IGNyeXB0b19oYXNoX0JZVEVTO1xuXG5uYWNsLnZlcmlmeSA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgY2hlY2tBcnJheVR5cGVzKHgsIHkpO1xuICAvLyBaZXJvIGxlbmd0aCBhcmd1bWVudHMgYXJlIGNvbnNpZGVyZWQgbm90IGVxdWFsLlxuICBpZiAoeC5sZW5ndGggPT09IDAgfHwgeS5sZW5ndGggPT09IDApIHJldHVybiBmYWxzZTtcbiAgaWYgKHgubGVuZ3RoICE9PSB5Lmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gKHZuKHgsIDAsIHksIDAsIHgubGVuZ3RoKSA9PT0gMCkgPyB0cnVlIDogZmFsc2U7XG59O1xuXG5uYWNsLnNldFBSTkcgPSBmdW5jdGlvbihmbikge1xuICByYW5kb21ieXRlcyA9IGZuO1xufTtcblxuKGZ1bmN0aW9uKCkge1xuICAvLyBJbml0aWFsaXplIFBSTkcgaWYgZW52aXJvbm1lbnQgcHJvdmlkZXMgQ1NQUk5HLlxuICAvLyBJZiBub3QsIG1ldGhvZHMgY2FsbGluZyByYW5kb21ieXRlcyB3aWxsIHRocm93LlxuICB2YXIgY3J5cHRvID0gdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gKHNlbGYuY3J5cHRvIHx8IHNlbGYubXNDcnlwdG8pIDogbnVsbDtcbiAgaWYgKGNyeXB0byAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgLy8gQnJvd3NlcnMuXG4gICAgdmFyIFFVT1RBID0gNjU1MzY7XG4gICAgbmFjbC5zZXRQUk5HKGZ1bmN0aW9uKHgsIG4pIHtcbiAgICAgIHZhciBpLCB2ID0gbmV3IFVpbnQ4QXJyYXkobik7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbjsgaSArPSBRVU9UQSkge1xuICAgICAgICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKHYuc3ViYXJyYXkoaSwgaSArIE1hdGgubWluKG4gLSBpLCBRVU9UQSkpKTtcbiAgICAgIH1cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBuOyBpKyspIHhbaV0gPSB2W2ldO1xuICAgICAgY2xlYW51cCh2KTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgcmVxdWlyZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBOb2RlLmpzLlxuICAgIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuICAgIGlmIChjcnlwdG8gJiYgY3J5cHRvLnJhbmRvbUJ5dGVzKSB7XG4gICAgICBuYWNsLnNldFBSTkcoZnVuY3Rpb24oeCwgbikge1xuICAgICAgICB2YXIgaSwgdiA9IGNyeXB0by5yYW5kb21CeXRlcyhuKTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG47IGkrKykgeFtpXSA9IHZbaV07XG4gICAgICAgIGNsZWFudXAodik7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0pKCk7XG5cbn0pKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzID8gbW9kdWxlLmV4cG9ydHMgOiAoc2VsZi5uYWNsID0gc2VsZi5uYWNsIHx8IHt9KSk7XG4iXX0=

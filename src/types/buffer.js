'use strict';

const utils = require('./utils');

const ENCODINGS = {
  hex: {
    validate (str, expectedLength) {
      return (str.length === expectedLength * 2) && str.match(/^[0-9a-f]+$/i);
    },

    decode (str, buffer) {
      for (var i = 0; i < buffer.length; i++) {
        var byte = str.substring(2 * i, 2 * i + 2);
        buffer[i] = parseInt(byte, 16);
      }
    },

    encode (buffer) {
      return Array.prototype.map.call(buffer, x => x.toString(16))
        .map(x => (x.length === 1) ? ('0' + x) : x)
        .join('');
    }
  }
};

/**
 * @param {Number} expectedLength expected buffer length in bytes
 * @returns {Boolean} is `str` valid for the buffer?
 */
function validateString (str, expectedLength, encoding) {
  if (!ENCODINGS[encoding]) {
    throw new TypeError('Unknown encoding: ' + encoding);
  }
  return ENCODINGS[encoding].validate(str, expectedLength);
}

/**
 * Checks if an object is an Exonum buffer.
 */
function isBuffer (obj) {
  return (typeof obj === 'object') && obj && obj.raw && obj.raw.length;
}

function decode (str, length, encoding) {
  if (!ENCODINGS[encoding]) {
    throw new TypeError('Unknown encoding: ' + encoding);
  }
  var buffer = new Uint8Array(length);
  ENCODINGS[encoding].decode(str, buffer);
  return buffer;
}

function encode (buffer, encoding) {
  if (!ENCODINGS[encoding]) {
    throw new TypeError('Unknown encoding: ' + encoding);
  }
  return ENCODINGS[encoding].encode(buffer);
}

/**
 * Attempts to get encoding from an object. To extract an encoding,
 * the object should have a key-value pair `enc: str`, where `enc` is one of
 * recognized encodings and `str` is a string.
 *
 * @param {Any} obj
 * @returns {String|undefined} encoding
 */
function getEncoding (obj) {
  if (!obj) return undefined;

  for (var enc in ENCODINGS) {
    if (obj[enc] && typeof obj[enc] === 'string') {
      return enc;
    }
  }
  return undefined;
}

/**
 * Creates a new fixed-length buffer type.
 *
 * @param {length} length of the buffer
 * @api public
 */
function fixedBuffer (length) {
  /**
   * @param {String|Array|Uint8Array|FixedBuffer} obj
   * @param {String} [encoding]
   */
  function SizedBuffer (obj, encoding) {
    var _raw;

    if (getEncoding(obj)) {
      // Allow initializations like `SizedBuffer({ hex: 'abcdef' })`,
      // which are useful in JSON parsing
      encoding = getEncoding(obj);
      obj = obj[encoding];
    }

    if (obj === undefined) {
      // Initialize with zeros
      _raw = new Uint8Array(length);
    } else if (typeof obj === 'string') {
      if (!encoding) encoding = 'hex';
      if (!validateString(obj, length, encoding)) {
        throw new TypeError('Cannot parse string: ' + obj);
      }
      _raw = decode(obj, length, encoding);
    } else if (isBuffer(obj)) {
      if (obj.byteLength !== length) {
        throw new TypeError('Invalid buffer length');
      }
      _raw = obj.raw;
    } else {
      // Assume `obj` is array-like
      if (!obj || obj.length === undefined) {
        throw new TypeError('Invalid buffer initializer');
      }
      if (obj.length !== length) {
        throw new TypeError('Invalid buffer length');
      }
      _raw = new Uint8Array(obj);
    }

    utils.defineRawValue(this, _raw);
  }

  SizedBuffer.prototype.serialize = function (buffer) {
    if (buffer.length !== this.byteLength) {
      throw new Error('Unexpected buffer length: ' + buffer.length +
        '; ' + this.byteLength + ' expected');
    }

    buffer.set(this.raw);
    return buffer;
  };

  SizedBuffer.prototype.toJSON = function () {
    return encode(this.raw, 'hex');
  };

  utils.configureType(SizedBuffer, {
    byteLength: length
  });

  return SizedBuffer;
}

module.exports = {
  fixedBuffer: fixedBuffer
};

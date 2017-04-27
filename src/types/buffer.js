'use strict';

const utils = require('./utils');

/**
 * @param {Number} expectedLength expected buffer length in bytes
 * @returns {Boolean} does `str` have the expected length?
 */
function checkLength (str, expectedLength, encoding) {
  switch (encoding) {
    case 'hex':
      return str.length === expectedLength * 2;
    default:
      throw new TypeError('Unknown encoding: ' + encoding);
  }
}

/**
 * Checks if an object is an Exonum buffer.
 */
function isBuffer (obj) {
  return (typeof obj === 'object') && obj.raw && obj.raw.length;
}

function decode (str, length, encoding) {
  var buffer = new Uint8Array(length);
  if (encoding === 'hex') {
    for (var i = 0; i < length; i++) {
      var byte = str.substring(2 * i, 2 * i + 2);
      buffer[i] = parseInt(byte, 16);
    }
  }
  return buffer;
}

function encode (buffer, encoding) {
  if (encoding === 'hex') {
    return Array.prototype.map.call(buffer, x => x.toString(16))
      .map(x => (x.length === 1) ? ('0' + x) : x)
      .join('');
  }
}

function FixedBuffer (length) {
  /**
   * @param {String|Array|Uint8Array|FixedBuffer}
   */
  function SizedBuffer (obj, encoding) {
    var _raw;

    if (obj === undefined) {
      // Initialize with zeros
      _raw = new Uint8Array(length);
    } else if (typeof obj === 'string') {
      if (!encoding) encoding = 'hex';
      if (!checkLength(obj, length, encoding)) {
        throw new TypeError('Invalid buffer length');
      }
      _raw = decode(obj, length, encoding);
    } else if (isBuffer(obj)) {
      if (obj.byteLength !== length) {
        throw new TypeError('Invalid buffer length');
      }
      _raw = obj.raw;
    } else {
      // Assume `obj` is array-like
      if (obj.length !== length) {
        throw new TypeError('Invalid buffer length');
      }
      _raw = new Uint8Array(obj);
    }

    utils.addConstant(this, 'raw', _raw);
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
  FixedBuffer: FixedBuffer
};

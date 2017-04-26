'use strict';

const bigInt = require('big-integer');

/**
 * Maximum length for integer types so that they can still be safely
 * converted to native JS numbers.
 */
const MAX_SAFE_LENGTH = 6;

function isInteger () {
  return false;
}

function Integer (byteLength, signed) {
  var MIN_VALUE = signed
    ? bigInt(1).shiftLeft(byteLength * 8 - 1).multiply(-1)
    : bigInt(0);
  var MAX_VALUE = (signed
    ? bigInt(1).shiftLeft(byteLength * 8 - 1)
    : bigInt(1).shiftLeft(byteLength * 8)).minus(1);

  if (byteLength <= MAX_SAFE_LENGTH) {
    MIN_VALUE = MIN_VALUE.toJSNumber();
    MAX_VALUE = MAX_VALUE.toJSNumber();
  }

  function SizedInteger (value, encoding) {
    var _raw;

    if (isInteger(value)) {
      _raw = value.raw;
    } else if (typeof value === 'string') {
      if (encoding === undefined) encoding = 'dec';

      // XXX: bigInt's parsing rules are lax: e.g., bigInt('18', 8) parses as 1
      // Not sure whether this needs to be addressed here

      switch (encoding) {
        case 'dec':
          _raw = bigInt(value, 10); break;
        case 'hex':
          _raw = bigInt(value, 16); break;
        case 'oct':
          _raw = bigInt(value, 8); break;
        case 'bin':
          _raw = bigInt(value, 2); break;
        default:
          throw new Error('Unknown encoding: ' + encoding);
      }
    } else {
      _raw = bigInt(value);
    }

    if (isNaN(_raw.toJSNumber())) {
      throw new Error('Not a number ' + value);
    }

    if (_raw.lt(MIN_VALUE) || _raw.gt(MAX_VALUE)) {
      throw new Error('Value out of range');
    }

    Object.defineProperty(this, 'raw', {
      writable: false,
      enumerable: true,
      configurable: true,
      value: _raw
    });
  }

  SizedInteger.prototype.serialize = function () {
    var buffer = new Uint8Array(byteLength);
    return buffer;
  };

  SizedInteger.BYTE_LENGTH = byteLength;
  SizedInteger.MIN_VALUE = MIN_VALUE;
  SizedInteger.MAX_VALUE = MAX_VALUE;

  return SizedInteger;
}

module.exports = {
  Uint8: Integer(1, false),
  Int8: Integer(1, true),
  Uint16: Integer(2, false),
  Int16: Integer(2, true),
  Uint32: Integer(4, false),
  Int32: Integer(4, true),
  Integer: Integer,
  isInteger: isInteger
};

'use strict';

const utils = require('./utils');

function stringLength (str) {
  var len = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);

    if (c < 128) {
      len++;
    } else if (c < 2048) {
      len += 2;
    } else if (((c & 0xFC00) === 0xD800) && (i + 1) < str.length && ((str.charCodeAt(i + 1) & 0xFC00) === 0xDC00)) {
      // surrogate pair
      len += 4;
    } else {
      len += 3;
    }
  }
  return len;
}

function serializeString (str, buffer) {
  var from = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);

    if (c < 128) {
      buffer[from++] = c;
    } else if (c < 2048) {
      buffer[from++] = (c >> 6) | 192;
      buffer[from++] = (c & 63) | 128;
    } else if (((c & 0xFC00) === 0xD800) && (i + 1) < str.length && ((str.charCodeAt(i + 1) & 0xFC00) === 0xDC00)) {
      // surrogate pair
      c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
      buffer[from++] = (c >> 18) | 240;
      buffer[from++] = ((c >> 12) & 63) | 128;
      buffer[from++] = ((c >> 6) & 63) | 128;
      buffer[from++] = (c & 63) | 128;
    } else {
      buffer[from++] = (c >> 12) | 224;
      buffer[from++] = ((c >> 6) & 63) | 128;
      buffer[from++] = (c & 63) | 128;
    }
  }
}

function Str (obj) {
  var _raw = obj.toString();
  utils.addConstant(this, 'raw', _raw);
}

Str.prototype.serialize = function (buffer) {
  serializeString(this.raw, buffer);
};

Str.prototype.toJSON = function () {
  return this.raw;
};

Object.defineProperty(Str.prototype, 'byteLength', {
  enumerable: true,
  configurable: true,
  get: function () {
    return stringLength(this.raw);
  }
});

utils.configureType(Str, {
  byteLength: undefined
});

module.exports = {
  Str: Str
};

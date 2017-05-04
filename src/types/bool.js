'use strict';

const utils = require('./utils');

function isBool (obj) {
  return typeof obj === 'object' && typeof obj.raw === 'boolean';
}

function Bool (obj) {
  var _raw = isBool(obj) ? obj.raw : !!obj;
  utils.defineRawValue(this, _raw);
}

Bool.prototype.serialize = function (buffer) {
  buffer[0] = this.raw ? 1 : 0;
  return buffer;
};

Bool.prototype.toJSON = function () {
  return this.raw;
};

utils.configureType(Bool, {
  byteLength: 1
});

utils.defineConstant(Bool, 'true', new Bool(true));
utils.defineConstant(Bool, 'false', new Bool(false));

module.exports = {
  Bool: Bool
};

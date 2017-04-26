'use strict';

const objectAssign = Object.assign || require('object-assign');

const DEFAULT_OPTIONS = {
  byteLength: false,
  wrapSerialize: true
};

function addConstant (obj, name, value) {
  Object.defineProperty(obj, name, {
    writable: false,
    enumerable: true,
    configurable: true,
    value: value
  });
}

function configureType (type, options) {
  options = objectAssign({}, DEFAULT_OPTIONS, options);

  // A little bit of magic
  type.__exonumType = true;

  var hasFixedLength = !!options.byteLength;
  if (hasFixedLength) {
    addConstant(type, 'byteLength', options.byteLength);
    // Copy the property to instances
    addConstant(type.prototype, 'byteLength', options.byteLength);
  }

  addConstant(type, 'hasFixedLength', hasFixedLength);

  if (options.wrapSerialize) {
    // Helper for `serialize`
    type.prototype.serialize = (function (serializer) {
      return function (buffer) {
        if (!buffer) buffer = new Uint8Array(this.byteLength);
        return serializer.call(this, buffer);
      };
    })(type.prototype.serialize);
  }

  type.prototype.toString = function () {
    return this.raw.toString.apply(this.raw, arguments);
  };
  type.prototype.valueOf = function () {
    return this.raw.valueOf.apply(this.raw, arguments);
  };
}

function isExonumType (type) {
  return type.__exonumType;
}

module.exports = {
  configureType: configureType,
  addConstant: addConstant,
  isExonumType: isExonumType
};

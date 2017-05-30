'use strict';

const objectAssign = Object.assign || require('object-assign');

const crypto = require('../_crypto');

const DEFAULT_OPTIONS = {
  byteLength: false,
  wrapSerialize: true,
  proxiedMethods: [
    'valueOf',
    'toString'
  ]
};

/**
 * Defines a constant property for an object.
 */
function defineConstant (obj, name, value) {
  Object.defineProperty(obj, name, {
    writable: false,
    enumerable: true,
    configurable: true,
    value: value
  });
}

/**
 * Defines a raw value for Exonum type instance.
 *
 * @param {Array<String>} [proxiedMethods]
 *   list of method names that should be proxied from the raw value
 *   to the Exonum type instance. If not specified, `toString` and `valueOf` are proxied.
 */
function defineRawValue (obj, value) {
  defineConstant(obj, 'raw', value);
}

/**
 * Retrieves owned method names from an object.
 *
 * @returns {Array<String>} list of method names
 */
function getMethodNames (obj) {
  return Object.getOwnPropertyNames(obj).filter(name => {
    var descriptor = Object.getOwnPropertyDescriptor(obj, name);
    return name !== 'constructor' &&
      name[0] !== '_' &&   // usually used for "private" APIs
      typeof descriptor.value === 'function';
  });
}

function configureType (type, options) {
  options = objectAssign({}, DEFAULT_OPTIONS, options);

  // A little bit of magic
  type.__exonumType = true;

  var hasFixedLength = !!options.byteLength;
  if (hasFixedLength) {
    defineConstant(type, 'byteLength', options.byteLength);
    // Copy the property to instances
    defineConstant(type.prototype, 'byteLength', options.byteLength);
  }

  defineConstant(type, 'hasFixedLength', hasFixedLength);

  if (options.wrapSerialize) {
    // Helper for `serialize`
    type.prototype.serialize = (function (serializer) {
      return function (buffer) {
        if (!buffer) buffer = new Uint8Array(this.byteLength);
        return serializer.call(this, buffer);
      };
    })(type.prototype.serialize);
  }

  options.proxiedMethods.forEach(name => {
    type.prototype[name] = function () {
      return this.raw[name].apply(this.raw, arguments);
    };
  });

  type.prototype.hash = function () {
    return crypto.hash(this.serialize());
  };
}

function isExonumType (type) {
  return type.__exonumType;
}

module.exports = {
  configureType: configureType,
  defineConstant: defineConstant,
  defineRawValue: defineRawValue,
  getMethodNames: getMethodNames,
  isExonumType: isExonumType
};

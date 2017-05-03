'use strict';

const integers = require('./integers');
const utils = require('./utils');

const reservedPropertyNames = [
  'get',
  'set',
  'byteLength',
  'hasFixedLength'
];

// throws on error
function validateSpec (spec) {
  spec.forEach((property, i) => {
    if (!property.name) {
      throw new Error('No property name specified for property #' + i);
    }
    if (reservedPropertyNames.indexOf(property.name) >= 0) {
      throw new Error('Reserved property name: ' + property.name);
    }
    if (!property.type) {
      throw new Error('No property type specified for property #' + i);
    }
    if (!utils.isExonumType(property.type)) {
      throw new Error('Invalid type: ' + property.type);
    }
  });

  // TODO check property uniqueness
}

function sequence (spec) {
  'use strict';
  validateSpec(spec);

  const propertyNames = spec.map(f => f.name);
  // Starting and ending positions of properties/segments
  let startPos = [];
  let endPos = [];
  for (var i = 0; i < spec.length; i++) {
    startPos[i] = (i === 0) ? 0 : endPos[i - 1];
    endPos[i] = startPos[i] + (spec[i].type.hasFixedLength
      ? spec[i].type.byteLength
      : Segment.byteLength);
  }
  const fixedLength = endPos[spec.length - 1];

  function SequenceType (obj) {
    var i;
    utils.defineConstant(this, 'raw', []);

    if (arguments.length === 1 && Array.isArray(obj)) {
      // Assume `obj` is the sequence of properties
      // in the order of their declaration in the type
      for (i = 0; i < obj.length; i++) {
        this.set(spec[i].name, obj[i]);
      }
    } else if (arguments.length === 1 && typeof obj === 'object') {
      // Read object property-by-property
      for (i = 0; i < spec.length; i++) {
        if (obj[spec[i].name] !== undefined) {
          this.set(spec[i].name, obj[spec[i].name]);
        }
      }
    } else {
      // Assume arguments are the properties
      for (i = 0; i < arguments.length; i++) {
        this.set(spec[i].name, arguments[i]);
      }
    }
  }

  SequenceType.prototype.get = function (name) {
    var idx = propertyNames.indexOf(name);
    if (idx >= 0) {
      return this.raw[idx];
    }
    return undefined;
  };

  SequenceType.prototype.set = function (name, value) {
    var idx = propertyNames.indexOf(name);
    if (idx >= 0) {
      var Type = spec[idx].type;
      if (value instanceof Type) {
        this.raw[idx] = value;
      } else {
        this.raw[idx] = new Type(value);
      }
    } else {
      throw new Error('Unknown property: ' + name);
    }
  };

  propertyNames.forEach(name => {
    Object.defineProperty(SequenceType.prototype, name, {
      enumerable: true,
      configurable: true,
      get: function () { return this.get(name); },
      set: function (value) { this.set(name, value); }
    });
  });

  function getByteLength () {
    var len = 0;
    for (var i = 0; i < spec.length; i++) {
      if (spec[i].type.hasFixedLength) {
        len += spec[i].type.byteLength;
      } else {
        var value = this.get(spec[i].name);
        len += Segment.byteLength;
        if (value) len += value.byteLength;
      }
    }
    return len;
  }

  Object.defineProperty(SequenceType.prototype, 'byteLength', {
    enumerable: true,
    configurable: true,
    get: getByteLength
  });

  SequenceType.prototype.serialize = function (buffer) {
    if (buffer.length !== this.byteLength) {
      throw new Error('Unexpected buffer length: ' + buffer.length +
        '; ' + this.byteLength + ' expected');
    }

    var ptr = fixedLength;
    for (var i = 0; i < spec.length; i++) {
      var value = this.get(spec[i].name);

      if (spec[i].type.hasFixedLength) {
        // Write the value in place
        value.serialize(buffer.subarray(startPos[i], endPos[i]));
      } else {
        // Write the value as a segment pointer
        var len = value.byteLength;
        // Serialize value in heap
        var heap = buffer.subarray(ptr, ptr + len);
        value.serialize(heap);
        // Serialize segment in place
        var segment = new Segment(heap.byteOffset, len);
        segment.serialize(buffer.subarray(startPos[i], endPos[i]));
        ptr += len;
      }
    }
    return buffer;
  };

  SequenceType.prototype.toJSON = function () {
    var obj = {};
    for (var i = 0; i < spec.length; i++) {
      var value = this.get(spec[i].name);
      obj[spec[i].name] = value ? value.toJSON() : undefined;
    }
    return obj;
  };

  var hasFixedLength = spec.every(f => f.type.hasFixedLength);
  utils.configureType(SequenceType, {
    byteLength: hasFixedLength ? fixedLength : undefined
  });

  return SequenceType;
}

var Segment = sequence([
  { name: 'start', type: integers.Uint32 },
  { name: 'length', type: integers.Uint32 }
]);

module.exports = {
  sequence: sequence,
  validateSpec: validateSpec
};

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serialize = serialize;

var _generic = require('./generic');

var _array = require('./array');

var _primitive = require('./primitive');

/**
 * Serialize data into array of 8-bit integers and insert into buffer
 * @param {Array} buffer
 * @param {number} shift - the index to start write into buffer
 * @param {Object} data
 * @param type - can be {NewType} or one of built-in types
 * @param {boolean} [isTransactionBody]
 * @returns {Array}
 */
function serialize(buffer, shift, data, type, isTransactionBody) {
  /**
   * Serialize instanceof of NewType
   * @param {Array} buffer
   * @param {number} shift
   * @param {number} from
   * @param {Object} data
   * @param {NewType} type
   * @returns {Array}
   */
  function serializeInstanceofOfNewType(buffer, shift, from, data, type) {
    if ((0, _generic.newTypeIsFixed)(type)) {
      buffer = serialize(buffer, from, data, type);
      return buffer;
    }

    var end = buffer.length;
    _primitive.Uint32.serialize(end - shift, buffer, from); // start index
    buffer = serialize(buffer, end, data, type);
    _primitive.Uint32.serialize(buffer.length - end, buffer, from + 4); // length
    return buffer;
  }

  /**
   * Serialize instanceof of NewArray for NewType
   * @param {Array} buffer
   * @param {number} shift
   * @param {Object} data
   * @param {NewType} type
   * @returns {Array}
   */
  function serializeInstanceofOfNewArrayForNewType(buffer, shift, data, type) {
    var start = buffer.length;

    // reserve segment for pointers
    for (var i = start; i < start + data.length * 8; i++) {
      buffer[i] = 0;
    }

    for (var _i = 0; _i < data.length; _i++) {
      var index = start + _i * 8;
      var end = buffer.length;

      _primitive.Uint32.serialize(end - shift, buffer, index); // start index
      buffer = serialize(buffer, end, data[_i], type.type);
      _primitive.Uint32.serialize(buffer.length - end, buffer, index + 4); // length
    }
    return buffer;
  }

  /**
   * Serialize instanceof of NewArray
   * @param {Array} buffer
   * @param {number} shift
   * @param {number} from
   * @param {Object} data
   * @param {NewType} type
   * @returns {Array}
   */
  function serializeInstanceofOfNewArray(buffer, shift, from, data, type) {
    if (!Array.isArray(data)) {
      throw new TypeError('Data of wrong type is passed. Array expected.');
    }

    if (type.type === _primitive.String) {
      throw new TypeError('Array of String types is not supported.');
    }

    _primitive.Uint32.serialize(buffer.length, buffer, from); // start index
    _primitive.Uint32.serialize(data.length, buffer, from + 4); // array length

    if ((0, _generic.isInstanceofOfNewType)(type.type)) {
      return serializeInstanceofOfNewArrayForNewType(buffer, shift, data, type);
    }

    if ((0, _array.isInstanceofOfNewArray)(type.type)) {
      var start = buffer.length;

      // reserve segment for pointers
      for (var i = start; i < start + data.length * 8; i++) {
        buffer[i] = 0;
      }

      for (var _i2 = 0; _i2 < data.length; _i2++) {
        var index = start + _i2 * 8;

        buffer = serializeInstanceofOfNewArray(buffer, shift, index, data[_i2], type.type);
      }
      return buffer;
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;

        buffer = type.type.serialize(item, buffer, buffer.length, buffer.length + type.type.size());
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return buffer;
  }

  // reserve array cells
  for (var i = 0; i < type.size(); i++) {
    buffer[shift + i] = 0;
  }

  var localShift = 0;
  type.fields.forEach(function (field) {
    var value = data[field.name];

    if (value === undefined) {
      throw new TypeError('Field ' + field.name + ' is not defined.');
    }

    var from = shift + localShift;

    var nestedShift = isTransactionBody === true ? 0 : shift;

    if ((0, _generic.isInstanceofOfNewType)(field.type)) {
      buffer = serializeInstanceofOfNewType(buffer, nestedShift, from, value, field.type);
      if ((0, _generic.fieldIsFixed)(field)) {
        localShift += field.type.size();
      } else {
        localShift += 8;
      }
    } else if ((0, _array.isInstanceofOfNewArray)(field.type)) {
      buffer = serializeInstanceofOfNewArray(buffer, nestedShift, from, value, field.type);
      localShift += field.type.size();
    } else {
      buffer = field.type.serialize(value, buffer, from, buffer.length - nestedShift);
      localShift += field.type.size();
    }
  });

  return buffer;
}

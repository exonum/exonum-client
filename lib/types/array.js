'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.newArray = newArray;
exports.isInstanceofOfNewArray = isInstanceofOfNewArray;

var _serialization = require('./serialization');

var serialization = _interopRequireWildcard(_serialization);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @constructor
 * @param {Object} type
 */
var NewArray = function () {
  function NewArray(type) {
    _classCallCheck(this, NewArray);

    this.type = type.type;
  }

  _createClass(NewArray, [{
    key: 'size',
    value: function size() {
      return 8;
    }

    /**
     * Serialize data of NewArray type into array of 8-bit integers
     * @param {Object} data
     * @returns {Array}
     */

  }, {
    key: 'serialize',
    value: function serialize(data) {
      return serialization.serialize([], 0, data, this);
    }
  }]);

  return NewArray;
}();

/**
 * Create element of NewArray class
 * @param {Object} arr
 * @returns {NewArray}
 */


function newArray(arr) {
  return new NewArray(arr);
}

/**
 * Check if passed object is of type NewArray
 * @param {Object} arr
 * @returns {boolean}
 */
function isInstanceofOfNewArray(arr) {
  return arr instanceof NewArray;
}

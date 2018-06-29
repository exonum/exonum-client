'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.merkleProof = merkleProof;

var _bigInteger = require('big-integer');

var _bigInteger2 = _interopRequireDefault(_bigInteger);

var _helpers = require('../helpers');

var _generic = require('../types/generic');

var _validate = require('../types/validate');

var _convert = require('../types/convert');

var _crypto = require('../crypto');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Calculate height of merkle tree
 * @param {bigInt} count
 * @return {number}
 */
function calcHeight(count) {
  var i = 0;
  while ((0, _bigInteger2.default)(2).pow(i).lt(count)) {
    i++;
  }
  return i;
}

/**
 * Check proof of Merkle tree and return array of elements
 * @param {string} rootHash
 * @param {number} count
 * @param {Object} proofNode
 * @param {Array} range
 * @param {NewType} [type] - optional
 * @return {Array}
 */
function merkleProof(rootHash, count, proofNode, range, type) {
  var elements = [];
  var rootBranch = 'left';

  /**
   * Get value from node, insert into elements array and return its hash
   * @param data
   * @param {number} depth
   * @param {number} index
   * @returns {string}
   */
  function getHash(data, depth, index) {
    var element = void 0;
    var elementsHash = void 0;

    if (depth !== 0 && depth + 1 !== height) {
      throw new Error('Value node is on wrong height in tree.');
    }

    if (start.gt(index) || end.lt(index)) {
      throw new Error('Wrong index of value node.');
    }

    if (start.plus(elements.length).neq(index)) {
      throw new Error('Value node is on wrong position in tree.');
    }

    if (typeof data === 'string') {
      if (!(0, _validate.validateHexadecimal)(data)) {
        throw new TypeError('Tree element of wrong type is passed. Hexadecimal expected.');
      }
      element = data;
      elementsHash = element;
    } else {
      if (Array.isArray(data)) {
        if (!(0, _validate.validateBytesArray)(data)) {
          throw new TypeError('Tree element of wrong type is passed. Bytes array expected.');
        }
        element = data.slice(0); // clone array of 8-bit integers
        elementsHash = (0, _crypto.hash)(element);
      } else {
        if (!(0, _helpers.isObject)(data)) {
          throw new TypeError('Invalid value of data parameter.');
        }
        if (!(0, _generic.isInstanceofOfNewType)(type)) {
          throw new TypeError('Invalid type of type parameter.');
        }
        element = data;
        elementsHash = (0, _crypto.hash)(element, type);
      }
    }

    elements.push(element);
    return elementsHash;
  }

  /**
   * Recursive tree traversal function
   * @param {Object} node
   * @param {number} depth
   * @param {number} index
   * @returns {string}
   */
  function recursive(node, depth, index) {
    var hashLeft = void 0;
    var hashRight = void 0;
    var summingBuffer = void 0;

    // case with single node in tree
    if (depth === 0 && node.val !== undefined) {
      return getHash(node.val, depth, index * 2);
    }

    if (node.left === undefined) {
      throw new Error('Left node is missed.');
    }
    if (typeof node.left === 'string') {
      if (!(0, _validate.validateHexadecimal)(node.left)) {
        throw new TypeError('Tree element of wrong type is passed. Hexadecimal expected.');
      }
      hashLeft = node.left;
    } else {
      if (!(0, _helpers.isObject)(node.left)) {
        throw new TypeError('Invalid type of left node.');
      }
      if (node.left.val !== undefined) {
        hashLeft = getHash(node.left.val, depth, index * 2);
      } else {
        hashLeft = recursive(node.left, depth + 1, index * 2);
      }
    }

    if (depth === 0) {
      rootBranch = 'right';
    }

    if (node.right !== undefined) {
      if (typeof node.right === 'string') {
        if (!(0, _validate.validateHexadecimal)(node.right)) {
          throw new TypeError('Tree element of wrong type is passed. Hexadecimal expected.');
        }
        hashRight = node.right;
      } else {
        if (!(0, _helpers.isObject)(node.right)) {
          throw new TypeError('Invalid type of right node.');
        }

        if (node.right.val !== undefined) {
          hashRight = getHash(node.right.val, depth, index * 2 + 1);
        } else {
          hashRight = recursive(node.right, depth + 1, index * 2 + 1);
        }
      }

      summingBuffer = new Uint8Array(64);
      summingBuffer.set((0, _convert.hexadecimalToUint8Array)(hashLeft));
      summingBuffer.set((0, _convert.hexadecimalToUint8Array)(hashRight), 32);
      return (0, _crypto.hash)(summingBuffer);
    }

    if (depth === 0 || rootBranch === 'left') {
      throw new Error('Right leaf is missed in left branch of tree.');
    }
    summingBuffer = (0, _convert.hexadecimalToUint8Array)(hashLeft);
    return (0, _crypto.hash)(summingBuffer);
  }

  // validate rootHash
  if (!(0, _validate.validateHexadecimal)(rootHash)) {
    throw new TypeError('Root hash of wrong type is passed. Hexadecimal expected.');
  }

  // validate count
  if (!(typeof count === 'number' || typeof count === 'string')) {
    throw new TypeError('Invalid value is passed as count parameter. Number or string is expected.');
  }

  count = (0, _bigInteger2.default)(count);

  if (count.lt(0)) {
    throw new RangeError('Invalid count parameter. Count can\'t be below zero.');
  }

  // validate range
  if (!Array.isArray(range) || range.length !== 2) {
    throw new TypeError('Invalid type of range parameter. Array of two elements expected.');
  }
  if (!(typeof range[0] === 'number' || typeof range[0] === 'string')) {
    throw new TypeError('Invalid value is passed as start of range parameter.');
  }
  if (!(typeof range[1] === 'number' || typeof range[1] === 'string')) {
    throw new TypeError('Invalid value is passed as end of range parameter.');
  }

  var rangeStart = (0, _bigInteger2.default)(range[0]);
  var rangeEnd = (0, _bigInteger2.default)(range[1]);

  if (rangeStart.gt(rangeEnd)) {
    throw new RangeError('Invalid range parameter. Start index can\'t be out of range.');
  }
  if (rangeStart.lt(0)) {
    throw new RangeError('Invalid range parameter. Start index can\'t be below zero.');
  }
  if (rangeEnd.lt(0)) {
    throw new RangeError('Invalid range parameter. End index can\'t be below zero.');
  }
  if (rangeStart.gt(count.minus(1))) {
    return [];
  }

  // validate proofNode
  if (!(0, _helpers.isObject)(proofNode)) {
    throw new TypeError('Invalid type of proofNode parameter. Object expected.');
  }

  var height = calcHeight(count);
  var start = rangeStart;
  var end = rangeEnd.lt(count) ? rangeEnd : count.minus(1);

  var actualHash = recursive(proofNode, 0, 0);

  if (rootHash.toLowerCase() !== actualHash) {
    throw new Error('rootHash parameter is not equal to actual hash.');
  }
  if ((0, _bigInteger2.default)(elements.length).neq(end.eq(start) ? 1 : end.minus(start).plus(1))) {
    throw new Error('Actual elements in tree amount is not equal to requested.');
  }

  return elements;
}

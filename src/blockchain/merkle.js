import bigInt from 'big-integer'
import { isObject } from '../helpers'
import { isType } from '../types/generic'
import { validateHexadecimal, validateBytesArray } from '../types/validate'
import { hexadecimalToUint8Array } from '../types/convert'
import { hash, HASH_LENGTH } from '../crypto'
import { BLOB_PREFIX, LIST_PREFIX, LIST_BRANCH_PREFIX } from './constants'

/**
 * Calculate height of merkle tree
 * @param {bigInt} count
 * @return {number}
 */
function calcHeight (count) {
  let i = 0
  while (bigInt(2).pow(i).lt(count)) {
    i++
  }
  return i
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
export function merkleProof (rootHash, count, proofNode, range, type) {
  const elements = []
  let rootBranch = 'left'

  /**
   * Get value from node, insert into elements array and return its hash
   * @param data
   * @param {number} depth
   * @param {number} index
   * @returns {string}
   */
  function getHash (data, depth, index) {
    let element
    let elementsHash

    if (depth !== 0 && (depth + 1) !== height) {
      throw new Error('Value node is on wrong height in tree.')
    }

    if (start.gt(index) || end.lt(index)) {
      throw new Error('Wrong index of value node.')
    }

    if (start.plus(elements.length).neq(index)) {
      throw new Error('Value node is on wrong position in tree.')
    }

    if (typeof data === 'string') {
      if (!validateHexadecimal(data)) {
        throw new TypeError('Tree element of wrong type is passed. Hexadecimal expected.')
      }
      element = data
      elementsHash = element
    } else {
      if (Array.isArray(data)) {
        if (!validateBytesArray(data)) {
          throw new TypeError('Tree element of wrong type is passed. Bytes array expected.')
        }
        element = data.slice(0) // clone array of 8-bit integers
        elementsHash = hash(element)
      } else {
        if (!isObject(data)) {
          throw new TypeError('Invalid value of data parameter.')
        }
        if (!isType(type)) {
          throw new TypeError('Invalid type of type parameter.')
        }
        element = data
        elementsHash = hash(element, type)
      }
    }

    elements.push(element)
    const hashedBuffer = new Uint8Array(1 + HASH_LENGTH)
    hashedBuffer[0] = BLOB_PREFIX
    hashedBuffer.set(hexadecimalToUint8Array(elementsHash), 1)
    return hash(hashedBuffer)
  }

  /**
   * Recursive tree traversal function
   * @param {Object} node
   * @param {number} depth
   * @param {number} index
   * @returns {string}
   */
  function recursive (node, depth, index) {
    let hashLeft
    let hashRight

    // case with single node in tree
    if (depth === 0 && node.val !== undefined) {
      return getHash(node.val, depth, index * 2)
    }

    if (node.left === undefined) {
      throw new Error('Left node is missed.')
    }
    if (typeof node.left === 'string') {
      if (!validateHexadecimal(node.left)) {
        throw new TypeError('Tree element of wrong type is passed. Hexadecimal expected.')
      }
      hashLeft = node.left
    } else {
      if (!isObject(node.left)) {
        throw new TypeError('Invalid type of left node.')
      }
      if (node.left.val !== undefined) {
        hashLeft = getHash(node.left.val, depth, index * 2)
      } else {
        hashLeft = recursive(node.left, depth + 1, index * 2)
      }
    }

    if (depth === 0) {
      rootBranch = 'right'
    }

    if (node.right !== undefined) {
      if (typeof node.right === 'string') {
        if (!validateHexadecimal(node.right)) {
          throw new TypeError('Tree element of wrong type is passed. Hexadecimal expected.')
        }
        hashRight = node.right
      } else {
        if (!isObject(node.right)) {
          throw new TypeError('Invalid type of right node.')
        }

        if (node.right.val !== undefined) {
          hashRight = getHash(node.right.val, depth, index * 2 + 1)
        } else {
          hashRight = recursive(node.right, depth + 1, index * 2 + 1)
        }
      }

      const hashedBuffer = new Uint8Array(1 + 2 * HASH_LENGTH)
      hashedBuffer[0] = LIST_BRANCH_PREFIX
      hashedBuffer.set(hexadecimalToUint8Array(hashLeft), 1)
      hashedBuffer.set(hexadecimalToUint8Array(hashRight), 1 + HASH_LENGTH)
      return hash(hashedBuffer)
    }

    if (depth === 0 || rootBranch === 'left') {
      throw new Error('Right leaf is missed in left branch of tree.')
    }
    const hashedBuffer = new Uint8Array(1 + HASH_LENGTH)
    hashedBuffer[0] = LIST_BRANCH_PREFIX
    hashedBuffer.set(hexadecimalToUint8Array(hashLeft), 1)
    return hash(hashedBuffer)
  }

  // validate rootHash
  if (!validateHexadecimal(rootHash)) {
    throw new TypeError('Root hash of wrong type is passed. Hexadecimal expected.')
  }

  // validate count
  if (!(typeof count === 'number' || typeof count === 'string')) {
    throw new TypeError('Invalid value is passed as count parameter. Number or string is expected.')
  }

  count = bigInt(count)

  if (count.lt(0)) {
    throw new RangeError('Invalid count parameter. Count can\'t be below zero.')
  }

  // validate range
  if (!Array.isArray(range) || range.length !== 2) {
    throw new TypeError('Invalid type of range parameter. Array of two elements expected.')
  }
  if (!(typeof range[0] === 'number' || typeof range[0] === 'string')) {
    throw new TypeError('Invalid value is passed as start of range parameter.')
  }
  if (!(typeof range[1] === 'number' || typeof range[1] === 'string')) {
    throw new TypeError('Invalid value is passed as end of range parameter.')
  }

  const rangeStart = bigInt(range[0])
  const rangeEnd = bigInt(range[1])

  if (rangeStart.gt(rangeEnd)) {
    throw new RangeError('Invalid range parameter. Start index can\'t be out of range.')
  }
  if (rangeStart.lt(0)) {
    throw new RangeError('Invalid range parameter. Start index can\'t be below zero.')
  }
  if (rangeEnd.lt(0)) {
    throw new RangeError('Invalid range parameter. End index can\'t be below zero.')
  }
  if (rangeStart.gt(count.minus(1))) {
    return []
  }

  // validate proofNode
  if (!isObject(proofNode)) {
    throw new TypeError('Invalid type of proofNode parameter. Object expected.')
  }

  const height = calcHeight(count)
  const start = rangeStart
  const end = rangeEnd.lt(count) ? rangeEnd : count.minus(1)

  const merkleRoot = recursive(proofNode, 0, 0)
  const hashedBuffer = new Uint8Array(9 + HASH_LENGTH)
  hashedBuffer[0] = LIST_PREFIX
  // Set bytes 1..9 as little-endian list length
  let quotient = count
  for (let byte = 1; byte < 9; byte++) {
    let remainder
    ({ quotient, remainder } = quotient.divmod(256))
    hashedBuffer[byte] = remainder
  }
  hashedBuffer.set(hexadecimalToUint8Array(merkleRoot), 9)
  const actualHash = hash(hashedBuffer)

  if (rootHash.toLowerCase() !== actualHash) {
    throw new Error('rootHash parameter is not equal to actual hash.')
  }
  if (bigInt(elements.length).neq(end.minus(start).plus(1))) {
    throw new Error('Actual elements in tree amount is not equal to requested.')
  }

  return elements
}

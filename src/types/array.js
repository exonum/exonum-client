import * as serialization from './serialization'

/**
 * @constructor
 * @param {Object} type
 */
class NewArray {
  constructor (type) {
    this.type = type.type
  }

  size () {
    return 8
  }

  /**
   * Serialize data of NewArray type into array of 8-bit integers
   * @param {Object} data
   * @returns {Array}
   */
  serialize (data) {
    return serialization.serialize([], 0, data, this)
  }
}

/**
 * Create element of NewArray class
 * @param {Object} arr
 * @returns {NewArray}
 */
export function newArray (arr) {
  return new NewArray(arr)
}

/**
 * Check if passed object is of type NewArray
 * @param {Object} arr
 * @returns {boolean}
 */
export function isNewArray (arr) {
  return arr instanceof NewArray
}

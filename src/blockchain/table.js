import { hash } from '../crypto'
import { Uint16, Uint32 } from '../types/primitive'
import { Hash } from '../types/hexadecimal'
import { MapProof } from './merkle-patricia'

const IndexCoordinates = {
  /**
   * Serialization index coordinates
   * @param {Object} data
   * @returns {Array}
   */
  serialize: function (data) {
    let buffer = []
    Uint16.serialize(data.origin_label, buffer, buffer.length, true)
    Uint32.serialize(data.local_schema_id, buffer, buffer.length, true)
    Uint16.serialize(data.index_id, buffer, buffer.length, true)
    return buffer
  },

  hash: function (data) {
    return hash(this.serialize(data))
  }
}

Object.compare = function (obj1, obj2) {
  // loop through properties in object 1
  for (let p in obj1) {
    // check property exists on both objects
    if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false

    switch (typeof (obj1[p])) {
      // deep compare objects
      case 'object':
        if (!Object.compare(obj1[p], obj2[p])) return false
        break
      // compare function code
      case 'function':
        if (typeof (obj2[p]) === 'undefined' || (p !== 'compare' && obj1[p].toString() !== obj2[p].toString())) return false
        break
      // compare values
      default:
        if (obj1[p] !== obj2[p]) return false
    }
  }

  // check object 2 for any extra properties
  for (let p in obj2) {
    if (typeof (obj1[p]) === 'undefined') return false
  }
  return true
}

/**
 * Validate path from tree root to some table
 * @param {Object} proof
 * @param {string} stateHash
 * @param {Object} key
 * @returns {string}
 */
export function verifyTable (proof, stateHash, key) {
  // validate proof of table existence in root tree
  const tableProof = new MapProof(proof, IndexCoordinates, Hash)

  if (tableProof.merkleRoot !== stateHash) {
    throw new Error('Table proof is corrupted')
  }

  let rootHash
  // get root hash of the table
  for (let k of tableProof.entries.keys()) {
    // use `Object.compare` for 'deep' key comparison, because keys may be objects
    if (Object.compare(k, key)) {
      rootHash = tableProof.entries.get(k)
    }
  }

  if (typeof rootHash === 'undefined') {
    throw new Error('Table not found in the root tree')
  }

  return rootHash
}

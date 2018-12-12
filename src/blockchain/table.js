import { hash } from '../crypto'
import { Uint16 } from '../types/primitive'
import { Hash } from '../types/hexadecimal'
import { MapProof } from './merkle-patricia'

/**
 * Serialization table key
 * @param {number} serviceId
 * @param {number} tableIndex
 * @returns {Array}
 */
function serializeKey (serviceId, tableIndex) {
  let buffer = []
  Uint16.serialize(serviceId, buffer, buffer.length)
  Uint16.serialize(tableIndex, buffer, buffer.length)
  return buffer
}

/**
 * Validate path from tree root to some table
 * @param {Object} proof
 * @param {string} stateHash
 * @param {number} serviceId
 * @param {number} tableIndex
 * @returns {string}
 */
export function verifyTable (proof, stateHash, serviceId, tableIndex) {
  const keyBuffer = serializeKey(serviceId, tableIndex)

  // calculate key of table in the root tree
  const key = hash(keyBuffer)

  // validate proof of table existence in root tree
  const tableProof = new MapProof(proof, Hash, Hash)

  if (tableProof.merkleRoot !== stateHash) {
    throw new Error('Table proof is corrupted')
  }

  // get root hash of the table
  const rootHash = tableProof.entries.get(key)

  if (typeof rootHash === 'undefined') {
    throw new Error('Table not found in the root tree')
  }

  return rootHash
}

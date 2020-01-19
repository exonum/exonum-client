import { Hash } from '../types/hexadecimal'
import { MapProof } from './merkle-patricia'

/**
 * Validate path from tree root to some table
 * @param {Object} proof
 * @param {string} stateHash
 * @param {string} tableFullName
 * @returns {string}
 */
export function verifyTable (proof, stateHash, tableFullName) {
  // Validate proof of table existence in the state hash.
  const tableProof = new MapProof(proof, Hash, Hash)
  if (tableProof.merkleRoot !== stateHash) {
    throw new Error('Table proof is corrupted')
  }

  // Get root hash of the table.
  const rootHash = tableProof.entries.get(tableFullName)
  if (typeof rootHash === 'undefined') {
    throw new Error('Table not found in the root tree')
  }
  return rootHash
}

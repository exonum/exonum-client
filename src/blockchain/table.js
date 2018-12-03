import { Hash } from '../types/hexadecimal'
import { MapProof } from './merkle-patricia'
import { TableKey } from '../../proto/protocol'
import { hash } from '../crypto'
/**
 * Validate path from tree root to some table
 * @param {Object} proof
 * @param {string} stateHash
 * @param {number} serviceId
 * @param {number} tableIndex
 * @returns {string}
 */
export function verifyTable (proof, stateHash, serviceId, tableIndex) {

  const table = {
    service_id: { data: serviceId },
    stateHash: { data: tableIndex }
  }

  const message = TableKey.create(table)
  const buffer = TableKey.encode(message).finish()

  // calculate key of table in the root tree
  const key = hash(buffer)

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

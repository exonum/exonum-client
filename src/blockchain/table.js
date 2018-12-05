import { Uint16 } from '../types/primitive'
import { newType } from '../types/generic'
import { Hash } from '../types/hexadecimal'
import { MapProof } from './merkle-patricia'

const TableKey = newType({
  fields: [
    { name: 'service_id', type: Uint16 },
    { name: 'table_index', type: Uint16 }
  ]
})

/**
 * Validate path from tree root to some table
 * @param {Object} proof
 * @param {string} stateHash
 * @param {number} serviceId
 * @param {number} tableIndex
 * @returns {string}
 */
export function verifyTable (proof, stateHash, serviceId, tableIndex) {
  // calculate key of table in the root tree
  const key = TableKey.hash({
    service_id: serviceId,
    table_index: tableIndex
  })

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

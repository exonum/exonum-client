import * as primitive from '../types/primitive'
import { newPrecommit, SIGNATURE_LENGTH } from '../types/message'
import { Hash, PUBLIC_KEY_LENGTH } from '../types/hexadecimal'
import { newType } from '../types/generic'
import { hexadecimalToUint8Array, uint8ArrayToHexadecimal } from '../types/convert'
import { hash, verifySignature } from '../crypto'
import { compareUint8Arrays } from '../helpers'

const Block = newType({
  fields: [
    { name: 'proposer_id', type: primitive.Uint16 },
    { name: 'height', type: primitive.Uint64 },
    { name: 'tx_count', type: primitive.Uint32 },
    { name: 'prev_hash', type: Hash },
    { name: 'tx_hash', type: Hash },
    { name: 'state_hash', type: Hash }
  ]
})
const SystemTime = newType({
  fields: [
    { name: 'secs', type: primitive.Uint64 },
    { name: 'nanos', type: primitive.Uint32 }
  ]
})

/**
 * Validate block and each precommit in block
 * @param {Object} data
 * @param {Array} validators
 * @return {boolean}
 */
export function verifyBlock (data, validators) {
  let blockHash
  try {
    blockHash = hash(data.block, Block)
  } catch (error) {
    return false
  }

  for (let i = 0; i < data.precommits.length; i++) {
    const precommit = data.precommits[i]
    const buffer = hexadecimalToUint8Array(precommit.message)

    if (precommit.payload.height !== data.block.height) {
      // height of block is not match
      return false
    }

    if (precommit.payload.block_hash !== blockHash) {
      // hash of block is not match
      return false
    }

    const publicKey = validators[precommit.payload.validator]
    if (uint8ArrayToHexadecimal(buffer.slice(0, PUBLIC_KEY_LENGTH)) !== publicKey) {
      // public key is not match
      return false
    }

    const Precommit = newPrecommit({
      author: publicKey,
      fields: [
        { name: 'validator', type: primitive.Uint16 },
        { name: 'height', type: primitive.Uint64 },
        { name: 'round', type: primitive.Uint32 },
        { name: 'propose_hash', type: Hash },
        { name: 'block_hash', type: Hash },
        { name: 'time', type: SystemTime }
      ]
    })

    const precommitBody = buffer.slice(0, buffer.length - SIGNATURE_LENGTH)

    if (!compareUint8Arrays(Precommit.serialize(precommit.payload), precommitBody)) {
      // payload is not match
      return false
    }

    const signature = uint8ArrayToHexadecimal(buffer.slice(buffer.length - SIGNATURE_LENGTH, buffer.length))

    try {
      if (!verifySignature(signature, publicKey, precommitBody)) {
        // signature is not match
        return false
      }
    } catch (error) {
      return false
    }
  }

  return true
}

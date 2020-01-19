import * as Long from 'long'
import { Verified } from '../types/message'
import { hexadecimalToUint8Array, uint8ArrayToHexadecimal } from '../types/convert'
import { hash } from '../crypto'

import * as protobuf from '../../proto/protocol'
const Block = protobuf.exonum.Block
const { CoreMessage } = protobuf.exonum.messages

/**
 * Validate block and each precommit in block
 * @param {Object} data
 * @param {Array} validators
 */
export function verifyBlock ({ block, precommits }, validators) {
  const buffer = Block.encode(block).finish()
  const blockHash = hash(buffer)

  if (precommits.length < quorumSize(validators.length)) {
    throw new Error('Insufficient number of precommits')
  }

  const endorsingValidators = new Set()
  for (let i = 0; i < precommits.length; i++) {
    const message = Verified.deserialize(CoreMessage, hexadecimalToUint8Array(precommits[i]))
    if (!message) {
      throw new Error('Precommit signature is wrong')
    }
    const precommit = message.precommit
    if (!precommit) {
      throw new Error('Invalid message type')
    }

    const plain = precommit.payload

    if (Long.fromValue(plain.height).compare(Long.fromValue(block.height)) !== 0) {
      throw new Error('Precommit height does not match with block height')
    }

    if (uint8ArrayToHexadecimal(plain.block_hash.data) !== blockHash) {
      throw new Error('Precommit block hash does not match with calculated block hash')
    }

    const validatorId = plain.validator || 0
    if (endorsingValidators.has(validatorId)) {
      throw new Error('Double endorsement from a validator')
    }
    endorsingValidators.add(validatorId)

    const actualKey = uint8ArrayToHexadecimal(precommit.author)
    const expectedKey = validators[validatorId]
    if (actualKey !== expectedKey) {
      throw new Error('Precommit public key is not match with buffer')
    }
  }
}

function quorumSize (validatorCount) {
  return Math.floor(validatorCount * 2 / 3) + 1
}

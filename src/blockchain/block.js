import * as Long from 'long'
import { Verified } from '../types/message'
import { hexadecimalToUint8Array, uint8ArrayToHexadecimal } from '../types/convert'
import { hash } from '../crypto'

import * as protobuf from '../../proto/protocol'
import { cleanZeroValuedFields } from '../helpers'
const Block = protobuf.exonum.Block
const { CoreMessage } = protobuf.exonum.messages

/**
 * Validate block and each precommit in block
 * @param {Object} data
 * @param {Array} validators
 */
export function verifyBlock ({ block, precommits }, validators) {
  const blockMessage = cleanZeroValuedFields(block, {})
  // Transform hashes to the format accepted by Protobuf.
  const fields = ['prev_hash', 'tx_hash', 'state_hash', 'error_hash']
  fields.forEach(fieldName => {
    blockMessage[fieldName] = { data: hexadecimalToUint8Array(blockMessage[fieldName]) }
  })
  // Transform additional headers to the Protobuf format.
  const additionalHeaders = Object.entries(block.additional_headers.headers)
    .map(([key, value]) => ({
      key,
      value: Uint8Array.from(value)
    }))
  blockMessage.additional_headers = { headers: { entry: additionalHeaders } }

  const buffer = Block.encode(blockMessage).finish()
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
    const plain = message.payload.precommit
    if (!plain) {
      throw new Error('Invalid message type (not a Precommit)')
    }

    if (Long.fromValue(plain.height).compare(Long.fromValue(block.height)) !== 0) {
      throw new Error('Precommit height does not match block height')
    }

    if (uint8ArrayToHexadecimal(plain.block_hash.data) !== blockHash) {
      throw new Error('Precommit block hash does not match calculated block hash')
    }

    const validatorId = plain.validator || 0
    if (endorsingValidators.has(validatorId)) {
      throw new Error('Double endorsement from a validator')
    }
    endorsingValidators.add(validatorId)

    const expectedKey = validators[validatorId]
    if (message.author !== expectedKey) {
      throw new Error('Precommit public key does not match key of corresponding validator')
    }
  }
}

function quorumSize (validatorCount) {
  return Math.floor(validatorCount * 2 / 3) + 1
}

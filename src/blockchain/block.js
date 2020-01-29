import * as Long from 'long'
import * as protocol from '../../proto/protocol.js'
import { hexadecimalToUint8Array, uint8ArrayToHexadecimal } from '../types/convert'
import { hash, verifySignature } from '../crypto'

/**
 * Validate block and each precommit in block
 * @param {Object} data
 * @param {Array} validators
 * @return {Promise}
 */
export function verifyBlock (data, validators) {
  return new Promise(resolve => {
    const block = {
      additional_headers: { headers: {
          entry:
          [
            {
              key: 'proposer_id',
              value: data.block.additional_headers.headers.proposer_id
            }
          ]
        }
      },
      error_hash: { data: hexadecimalToUint8Array(data.block.error_hash) },
      prev_hash: { data: hexadecimalToUint8Array(data.block.prev_hash) },
      tx_hash: { data: hexadecimalToUint8Array(data.block.tx_hash) },
      state_hash: { data: hexadecimalToUint8Array(data.block.state_hash) }
    }
    let blockHash

    if (data.block.height !== 0) {
      block.height = data.block.height
    }

    if (data.block.tx_count !== 0) {
      block.tx_count = data.block.tx_count
    }

    const message = protocol.exonum.Block.create(block)
    const buffer = new Uint8Array(protocol.exonum.Block.encode(message).finish())

    blockHash = hash(buffer)

    for (let i = 0; i < data.precommits.length; i++) {
      const precommit = data.precommits[i]
      const buffer = hexadecimalToUint8Array(precommit)
      const singedMsg = protocol.exonum.consensus.SignedMessage.decode(new Uint8Array(buffer))
      let message = protocol.exonum.consensus.ExonumMessage.decode(singedMsg.payload)
      message = message.precommit
      const plain = protocol.exonum.consensus.Precommit.toObject(message)

      if (Long.fromValue(plain.height).compare(Long.fromValue(data.block.height)) !== 0) {
        throw new Error('Precommit height is not match with block height')
      }

      if (uint8ArrayToHexadecimal(plain.block_hash.data) !== blockHash) {
        throw new Error('Precommit block hash is not match with calculated block hash')
      }

      const publicKey = validators[plain.validator || 0]
      if (uint8ArrayToHexadecimal(singedMsg.author.data) !== publicKey) {
        throw new Error('Precommit public key is not match with buffer')
      }

      const signature = uint8ArrayToHexadecimal(singedMsg.signature.data)

      if (!verifySignature(signature, publicKey, singedMsg.payload)) {
        throw new Error('Precommit signature is wrong')
      }
    }

    resolve()
  })
}

export { protocol }

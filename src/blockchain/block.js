import * as Long from 'long'
import * as protocol from '../../proto/protocol.js'
import { SIGNATURE_LENGTH } from '../types/message'
import { hexadecimalToUint8Array, uint8ArrayToHexadecimal } from '../types/convert'
import { PUBLIC_KEY_LENGTH } from '../types/hexadecimal'
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
      prevHash: { data: hexadecimalToUint8Array(data.block.prev_hash) },
      txHash: { data: hexadecimalToUint8Array(data.block.tx_hash) },
      stateHash: { data: hexadecimalToUint8Array(data.block.state_hash) }
    }
    let blockHash

    if (data.block.proposer_id !== 0) {
      block.proposerId = data.block.proposer_id
    }

    if (data.block.height !== 0) {
      block.height = data.block.height
    }

    if (data.block.tx_count !== 0) {
      block.txCount = data.block.tx_count
    }

    const message = protocol.exonum.Block.create(block)
    const buffer = protocol.exonum.Block.encode(message).finish()

    blockHash = hash(buffer)

    for (let i = 0; i < data.precommits.length; i++) {
      const precommit = data.precommits[i]
      const buffer = hexadecimalToUint8Array(precommit)
      const message = protocol.exonum.consensus.Precommit.decode(new Uint8Array(buffer.slice(34, buffer.length - SIGNATURE_LENGTH)))
      const plain = protocol.exonum.consensus.Precommit.toObject(message)

      if (Long.fromValue(plain.height).compare(Long.fromValue(data.block.height)) !== 0) {
        throw new Error('Precommit height is not match with block height')
      }

      if (uint8ArrayToHexadecimal(plain.blockHash.data) !== blockHash) {
        throw new Error('Precommit block hash is not match with calculated block hash')
      }

      const publicKey = validators[plain.validator || 0]
      if (uint8ArrayToHexadecimal(buffer.slice(0, PUBLIC_KEY_LENGTH)) !== publicKey) {
        throw new Error('Precommit public key is not match with buffer')
      }

      const signature = uint8ArrayToHexadecimal(buffer.slice(buffer.length - SIGNATURE_LENGTH, buffer.length))

      if (!verifySignature(signature, publicKey, buffer.slice(0, buffer.length - SIGNATURE_LENGTH))) {
        throw new Error('Precommit signature is wrong')
      }
    }

    resolve()
  })
}

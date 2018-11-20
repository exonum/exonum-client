import { Block, Precommit } from '../../stubs/protocol_pb.js'
import { newPrecommit, SIGNATURE_LENGTH } from '../types/message'
import { hexadecimalToUint8Array, uint8ArrayToHexadecimal } from '../types/convert'
import { PUBLIC_KEY_LENGTH } from '../types/hexadecimal'
import { hash, verifySignature } from '../crypto'
import { compareUint8Arrays } from '../helpers'

function fromISOString (str) {
  const arr = str.split('.')
  const date = new Date(`${arr[0]}.000Z`)
  const value = arr[1].substring(0, arr[1].length - 1)
  const ns = Number.parseInt(`${value}000000000`.substring(0, 9), 10)
  return [
    date.getTime() / 1000,
    ns
  ]
}

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

    const message = Block.create(block)
    const buffer = Block.encode(message).finish()

    blockHash = hash(buffer)

    for (let i = 0; i < data.precommits.length; i++) {
      const precommit = data.precommits[i]
      const buffer = hexadecimalToUint8Array(precommit.message)

      if (precommit.payload.height !== data.block.height) {
        throw new Error('Precommit height is not match with block height')
      }

      if (precommit.payload.block_hash !== blockHash) {
        throw new Error('Precommit block hash is not match with calculated block hash')
      }

      const publicKey = validators[precommit.payload.validator]
      if (uint8ArrayToHexadecimal(buffer.slice(0, PUBLIC_KEY_LENGTH)) !== publicKey) {
        throw new Error('Precommit public key is not match with buffer')
      }

      const PrecommitMessage = newPrecommit({
        author: publicKey,
        schema: Precommit
      })

      const precommitBody = buffer.slice(0, buffer.length - SIGNATURE_LENGTH)

      const payload = {
        proposeHash: { data: hexadecimalToUint8Array(precommit.payload.propose_hash) },
        blockHash: { data: hexadecimalToUint8Array(precommit.payload.block_hash) }
      }

      if (precommit.payload.validator !== 0) {
        payload.validator = precommit.payload.validator
      }

      if (precommit.payload.height !== 0) {
        payload.height = precommit.payload.height
      }

      if (precommit.payload.round !== 0) {
        payload.round = precommit.payload.round
      }

      const time = fromISOString(precommit.payload.time)
      payload.time = {
        seconds: time[0],
        nanos: time[1]
      }

      if (!compareUint8Arrays(PrecommitMessage.serialize(payload), precommitBody)) {
        throw new Error('Calculated precommit body is not match with buffer')
      }

      const signature = uint8ArrayToHexadecimal(buffer.slice(buffer.length - SIGNATURE_LENGTH, buffer.length))

      if (!verifySignature(signature, publicKey, precommitBody)) {
        throw new Error('Precommit signature is wrong')
      }
    }

    resolve()
  })
}

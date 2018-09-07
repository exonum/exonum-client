import { isObject } from '../helpers'
import * as primitive from '../types/primitive'
import { Hash } from '../types/hexadecimal'
import { newType } from '../types/generic'
import { newMessage } from '../types/message'
import { validateHexadecimal } from '../types/validate'
import { hash, verifySignature } from '../crypto'

const PROTOCOL_VERSION = 0
const CORE_SERVICE_ID = 0
const PRECOMMIT_MESSAGE_ID = 4
const PRECOMMIT_TAG = 0
const CONSENSUS_TAG = 0
const MESSAGE_TYPE_PRECOMMIT = 'precommit'
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

/**
 * Validate block and each precommit in block
 * @param {Object} data
 * @param {Array} validators
 * @return {boolean}
 */
export function verifyBlock (data, validators) {
  if (!isObject(data)) {
    return false
  }
  if (!isObject(data.block)) {
    return false
  }
  if (!Array.isArray(data.precommits)) {
    return false
  }
  if (!Array.isArray(validators)) {
    return false
  }

  for (let i = 0; i < validators.length; i++) {
    if (!validateHexadecimal(validators[i])) {
      return false
    }
  }
  let blockHash
  try {
    blockHash = hash(data.block, Block)
  } catch (error) {
    return false
  }

  const Precommit = newMessage({
    protocol_version: PROTOCOL_VERSION,
    message_id: PRECOMMIT_MESSAGE_ID,
    message_type: MESSAGE_TYPE_PRECOMMIT,
    service_id: CORE_SERVICE_ID,
    precommit_tag: PRECOMMIT_TAG,
    consensus_tag: CONSENSUS_TAG,
    fields: [
      { name: 'validator', type: primitive.Uint16 },
      { name: 'height', type: primitive.Uint64 },
      { name: 'round', type: primitive.Uint32 },
      { name: 'propose_hash', type: Hash },
      { name: 'block_hash', type: Hash },
      { name: 'date_timems', type: primitive.Uint64 },
      { name: 'date_timens', type: primitive.Uint32 }
    ]
  })

  const validatorsTotalNumber = validators.length
  const uniqueValidators = []
  let round

  for (let i = 0; i < data.precommits.length; i++) {
    const precommit = data.precommits[i]
    if (!isObject(precommit.body)) {
      return false
    }
    if (!validateHexadecimal(precommit.signature, 64)) {
      return false
    }
    if (precommit.body.validator >= validatorsTotalNumber) {
      // validator does not exist
      return false
    }

    if (uniqueValidators.indexOf(precommit.body.validator) === -1) {
      uniqueValidators.push(precommit.body.validator)
    }

    if (precommit.protocol_version !== PROTOCOL_VERSION ||
      precommit.service_id !== CORE_SERVICE_ID ||
      precommit.message_id !== PRECOMMIT_MESSAGE_ID) {
      return false
    }

    if (precommit.body.height !== data.block.height) {
      // wrong height of block in precommit
      return false
    }
    if (precommit.body.block_hash !== blockHash) {
      // wrong hash of block in precommit
      return false
    }

    if (round === undefined) {
      round = precommit.body.round
    }
    if (precommit.body.round !== round) {
      // wrong round in precommit
      return false
    }

    const publicKey = validators[precommit.body.validator]

    Precommit.public_key = publicKey

    if (!verifySignature(precommit.signature, publicKey, precommit.body, Precommit)) {
      return false
    }
  }

  return uniqueValidators.length > validatorsTotalNumber * 2 / 3
}

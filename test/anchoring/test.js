/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const Exonum = require('src')
const nock = require('nock')

describe('Anchoring', function () {
  console.log('ji')
  const Block = Exonum.newType({
    size: 112,
    fields: {
      schema_version: { type: Exonum.Uint16, size: 2, from: 0, to: 2 },
      proposer_id: { type: Exonum.Uint16, size: 2, from: 2, to: 4 },
      height: { type: Exonum.Uint64, size: 8, from: 4, to: 12 },
      tx_count: { type: Exonum.Uint32, size: 4, from: 12, to: 16 },
      prev_hash: { type: Exonum.Hash, size: 32, from: 16, to: 48 },
      tx_hash: { type: Exonum.Hash, size: 32, from: 48, to: 80 },
      state_hash: { type: Exonum.Hash, size: 32, from: 80, to: 112 }
    }
  })
  const blockToHash = {
    height: '663936',
    prev_hash: '3ec548fc067bdf63541798476c78b72ebf3565728de3e0193aca9f5e36dad90b',
    proposer_id: 0,
    schema_version: 0,
    state_hash: '3725959a7d1f83c8b80a596e78a49ca38ebefdb611130585689c814b92847d23',
    tx_count: 0,
    tx_hash: '0000000000000000000000000000000000000000000000000000000000000000'
  }
  console.log(
    JSON.stringify(Block.serialize(blockToHash)),
    'next',
    JSON.stringify(Block.serialize(blockToHash).splice(80, 32)),
    Exonum.hash(Block.serialize(blockToHash)))
})

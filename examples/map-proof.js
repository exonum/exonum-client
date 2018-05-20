/**
 * Example how to use `MapProof`s in client apps.
 */
'use strict'

const Exonum = require('../')
const expect = require('chai').expect

// Declare the value type used in the proof.
const Wallet = Exonum.newType({
  fields: [
    { name: 'pub_key', type: Exonum.PublicKey },
    { name: 'name', type: Exonum.String },
    { name: 'balance', type: Exonum.Uint64 }
  ]
})

// This proof JSON for 2 existing and 2 missing wallets is generated
// with the help of the `/random` endpoint of the integration test server
// (located in the `integration-tests` directory):
//
//   cd integration-tests
//   cargo run &
//   curl http://localhost:8000/endpoint?seed=1337&wallets=20&wallets_in_proof=2
let proof = {
  entries: [
    {
      key: 'd00d21c3d01cd84188f3ec92a84f8637c616edc535d80541af81baf3c0b527e2',
      value: {
        balance: '13969599690876119175',
        name: 'd00d21c3',
        pub_key: 'd00d21c3d01cd84188f3ec92a84f8637c616edc535d80541af81baf3c0b527e2'
      }
    },
    { missing: '569bb4cfc5130af3ad824b3e4d111e1c3b536597c42aa640fe0d3dda6a87445d' },
    { missing: '2ea39bb12ac8ef87d666c8c4f7216ce13cf61d3303e7c5d0ccfe2d4c725a0a5c' },
    {
      key: '6d9a46cf3476811b33f6a2bb5fab8d0bd0b494cf7dcab75910432ee5ea4dfaaf',
      value: {
        balance: '10491468210891190018',
        name: '6d9a46cf',
        pub_key: '6d9a46cf3476811b33f6a2bb5fab8d0bd0b494cf7dcab75910432ee5ea4dfaaf'
      }
    }
  ],
  proof: [
    { path: '0001', hash: 'f43428abd106381717dc1b275240544815ef86ffb6f7c6c5dcb15fc08fe1aec0' },
    { path: '001', hash: 'dac5cf333d08a9f66769e948c6daa531eddc3b654a019cdf5c8356a6b47f59b3' },
    { path: '010', hash: '678a1c44ce08143c74a441405fec3e8702a8b45971f636e7ec7fdef090193fcc' },
    { path: '0110001100001110000111001110110110101000110001110100000111001011000000010101001100000100110110000001000100011100000101101110000001110111100011100001000110011000111010000011110001011000000011001001001000101011110011001111001000110010001100100000100010010100', hash: '3ea19ae82a0d35e2a98a9ff4b9d4f279ae9a2f6b22b3b1271054d1843c8f8fbd' },
    { path: '0110100011101000100110011111000011010111001010001001001011110100011011110011100010010100101101111111110111110000110111000001000010011100111011111111101111001011111011110000010101011010110110011000000010001101100011011001100010100001001110001101111101011001', hash: '6c1e9182aaddef6361d1a6a9c60f32afe8a1944642056a210517b09593249874' },
    { path: '0111100011010101000100010100101101001111001101010000001000000111000010100010110000111110110111100011100001111110100011110001010001001011001000001101100101110111111100010111110100010011110111010010011100110101111010011101001011010000001111001000000010110101', hash: 'e4916d59f1776745311b3dfd6cdf96b38461a1844328c5258a6572046a8cad99' },
    { path: '100', hash: '885e183fdd22fae157e14c0391af7bf296a27a2fe518b433fb5b1279514a040d' },
    { path: '101010', hash: '8d09f5ae5a534ddc3aba6cacd41584251b9cac075a9c9130cfefeff86233e139' },
    { path: '11', hash: 'cba4967eff747eaa417b36714af95fc77c9c6fad48267fdc329417fcc9c382f8' }
  ]
}

// Create a `MapProof` instance. The constructor will throw an error if
// the supplied JSON is malformed.
proof = new Exonum.MapProof(proof, Exonum.PublicKey, Wallet)
expect(proof.entries.size).to.equal(2)
expect(proof.missingKeys.size).to.equal(2)

// Output elements asserted by the proof to exist or to be absent in the
// underlying index.
console.log('\nEntries:')
for (let wallet of proof.entries.values()) {
  console.log(wallet)
}
console.log('\nMissing keys:')
for (let missingKey of proof.missingKeys) {
  console.log(missingKey)
}

// The Merkle root of the proof is usually propagated further to the trust anchor
// (usually, a `state_hash` field in the block header). Here, we just compare
// it to the reference value for simplicity.
expect(proof.merkleRoot).to.equal('b3f833e0bb9a814e4cb5aeae6f0ef45f5dc43af26ff57e4500b713d7ea32dcec')

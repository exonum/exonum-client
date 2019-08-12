/**
 * Example how to use `MapProof`s in client apps.
 */
'use strict'

const Exonum = require('..')
const { expect } = require('chai')
const { Type, Field } = require('protobufjs/light')

// Declare the value type used in the proof.
const PublicKeySchema = new Type('PublicKey')
PublicKeySchema.add(new Field('data', 1, 'bytes'))
const WalletSchema = new Type('Wallet')
WalletSchema.add(PublicKeySchema)
WalletSchema.add(new Field('pub_key', 1, 'PublicKey'))
WalletSchema.add(new Field('name', 2, 'string'))
WalletSchema.add(new Field('balance', 3, 'uint64'))
WalletSchema.add(new Field('uniq_id', 4, 'string'))
const Wallet = Exonum.newType(WalletSchema)

// This proof JSON for 2 existing and 2 missing wallets is generated
// with the help of the `/wallets/random` endpoint of the integration test server
// (located in the `integration-tests` directory):
//
//   cd integration-tests
//   cargo run &
//   curl http://localhost:8000/wallets/random?seed=1337&wallets=20&wallets_in_proof=2
let proof = {
  entries: [
    {
      missing: 'c6e167e6914c68fe9cb6d02e72ff4c8ecfe8fa1696625e4b1f89eb6597b1c16a'
    },
    {
      key: 'c1608da6fe83023f95c1d9d31d070c4e70b93059f1a298b1a02e85eb4414c855',
      value: {
        pub_key: 'c1608da6fe83023f95c1d9d31d070c4e70b93059f1a298b1a02e85eb4414c855',
        name: 'c1608da6',
        balance: 3986358255,
        uniq_id: '0621b404-80c5-bf18-04c1-6c466054f28a'
      }
    },
    {
      key: '049b1598a5b417fcd53e318bc90322b72c52bd771ff3febb3d53d36b77329ada',
      value: {
        pub_key: '049b1598a5b417fcd53e318bc90322b72c52bd771ff3febb3d53d36b77329ada',
        name: '049b1598',
        balance: 69049252,
        uniq_id: 'beb5bee7-ac51-c829-1b16-e8b77a12d371'
      }
    },
    {
      missing: '69a5411f3ec4c2cd7e83bf61130e15654d69b76585dcca6e1dcc986a50b96cad'
    }
  ],
  'proof': [
    {
      path: '0000110110110010100111000100010110011110110000100010100001000101010000110001110001010110010001111011011101000111101100111010010000010110011110111011110111001111001110110000101111101100111101100001000110010101101101010001111000111101000111110111110011000101',
      hash: '42458b0cf398d03cefb02fe31919b4bbe6ee6c68a79c49bea7c80a0b0bef3936'
    },
    {
      path: '001011',
      hash: 'dcaf092596dcd3e3a9a8405d8dfb3817df21657ecb1e5257a7779c0c3c0157f8'
    },
    {
      path: '01',
      hash: 'f7e72241fb9ee2351c9ab54c3020554bd26af62a217072d4eb8eaaba0a13af21'
    },
    {
      path: '10',
      hash: 'b69cd61a9c22f2467e1be1309a06671c7b2ab38b97a9bc47ce85e3646271b240'
    },
    {
      path: '1100101011001101010001000111001000101010100001110101110010111010100011010010101011100110111111100100101001111111010111000010010010100110110110001101000100110101101011100100011010000010111011001000111110000110110111010011110100011100100101111110110001111100',
      hash: 'da18257a7f0b9c0c863468f2c15819cd93a67a87408ddd884db1142e657965b7'
    },
    {
      path: '1101011001101000011110000011010100011010110001100100001110100110110111100010101000010100101100101011111011010011001000100110111111101111100010111100101110000100011011010101010000010000010111011011010000110011100011100100111010100110001101111101110100011101',
      hash: 'd156aba4c4e5c63124ac52295466e935ba5d2282a64082c85841e32bbf5b4c97'
    },
    {
      path: '1111100001001101101101000111010010001010100111001101100110101011110100110001110110110110101101000100100011101000011010100111001110000011100110111111101110000010010001011101000011111011000010100110110010100000111111111001110100000110100011001001100011000011',
      hash: '3bb6a394e0f69404bf8594f5fc42a2a5275b1d98f86bb766e4091597f4df7803'
    }
  ]
}

// Temporary hack to convert `PublicKey`s into the form compatible with the Protobuf reader.
proof.entries.forEach(({ value }) => {
  if (value && value.pub_key) {
    value.pub_key = {
      data: Buffer.from(value.pub_key, 'hex')
    }
  }
})

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
expect(proof.merkleRoot).to.equal('22e3fa8457f2226546f8919ef22bba7853ddc55e221c95644daf21970e8ea8a6')

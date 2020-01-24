/**
 * Example how to use `MapProof`s in client apps.
 */
'use strict'

const Exonum = require('..')
const { MapProof, PublicKey } = Exonum
const { expect } = require('chai')
const { Type, Field } = require('protobufjs/light')

// Declare the value type used in the proof.
const PublicKeySchema = new Type('PublicKey')
  .add(new Field('data', 1, 'bytes'))
const WalletSchema = new Type('Wallet')
  .add(PublicKeySchema)
  .add(new Field('pub_key', 1, 'PublicKey'))
  .add(new Field('name', 2, 'string'))
  .add(new Field('balance', 3, 'uint64'))
  .add(new Field('uniq_id', 4, 'string'))
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
  proof: [
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
function convertPublicKey (wallet) {
  if (wallet && wallet.pub_key) {
    wallet.pub_key = {
      data: Buffer.from(wallet.pub_key, 'hex')
    }
  }
}

proof.entries.forEach(({ value }) => convertPublicKey(value))

// Create a `MapProof` instance. The constructor will throw an error if
// the supplied JSON is malformed.
proof = new MapProof(proof, PublicKey, Wallet)
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

// Perform the same task, but for raw (unhashed) keys. These keys may be used
// with certain key types (e.g., `PublicKey`) to minimize the amount of hashing.
//
// This proof JSON is obtained using the following commands:
//
//   cd integration-tests
//   cargo run &
//   curl http://localhost:8000/wallets/random-raw?seed=1337&wallets=20&wallets_in_proof=2
proof = {
  entries: [
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
      missing: 'c6e167e6914c68fe9cb6d02e72ff4c8ecfe8fa1696625e4b1f89eb6597b1c16a'
    },
    {
      key: 'c1608da6fe83023f95c1d9d31d070c4e70b93059f1a298b1a02e85eb4414c855',
      'value': {
        pub_key: 'c1608da6fe83023f95c1d9d31d070c4e70b93059f1a298b1a02e85eb4414c855',
        name: 'c1608da6',
        balance: 3986358255,
        uniq_id: '0621b404-80c5-bf18-04c1-6c466054f28a'
      }
    },
    {
      missing: '69a5411f3ec4c2cd7e83bf61130e15654d69b76585dcca6e1dcc986a50b96cad'
    }
  ],
  proof: [
    {
      path: '000',
      hash: '990c60568f8aaba6f42fa082c3465e46d6fe294396eb545ba4d3b0696e3f1f86'
    },
    {
      path: '0011',
      hash: '89d4d997f806056d9d390a4e70ab4054d652a1eed345723b9af44e5fe87a309b'
    },
    {
      path: '0100101001110111101001000111001011101100001110010000101001110001011100011110110010111111001001001001010110001000101110011001000100100000011101011001010110001010000001111010000011010011010010000111110111100111110100100111010110111011010010011001100101011010',
      hash: 'eecd7bf7dc58b367dd059c8f6c13c8b7674c244e2f22e03af91c7d45bc4e85fc'
    },
    {
      path: '0110001100101011001000110110101110110111101100100101011011011111101010001010000100110011001000110011100111000100001001110110011100000101001110100011101110101010111101001110011011111111111001101000001100111000101011101010010000011000011000000110001111101011',
      hash: 'd156aba4c4e5c63124ac52295466e935ba5d2282a64082c85841e32bbf5b4c97'
    },
    {
      path: '0110100101001001110100110101000110101000111000000011000100111111111111100010100001001101111111011010011111010001011011011100010001011100101010011111011011011110101011101010001101110100110001000101011110011101101001000101100011000011111110010011101010111100',
      hash: 'a22631cc982f32971febdb758163585fcba1fa60ac247cdca9d7def498ded678'
    },
    {
      path: '0111101011101010010101110011000111011111000001000001111011110100110010101101111101110101001010110001001010111100001011001010011111111110001100111001001011001001101111110001010010101000100010111011101100110010000101110101111100101000110010101100100100001100',
      hash: '6843d354b2b761a346c5e341128b30beb8c5958783ac131de60d1352741d813c'
    },
    {
      path: '1000011110011001110000000100011001011000011110011011000110110110011000111010111100001010010010001011001011111110110000100000000110110110110000101010100011111010111000010111101110010100010011011101000000011101011101011011011100100000111010000001010000001101',
      hash: 'dd0a44b99e08e3f7eeb17c2f14487ae5ec764adbc6245ef09a7e0c6bfd89b680'
    },
    {
      path: '1001111101100101110010000101111110001110111001111101001001000001100111100101001110101101001100101101001001011101000100101101001101001110010100100011001010011100110011110001111101000110010011001100111011011100011110110101100001100100111011000010100100101010',
      hash: '3bb6a394e0f69404bf8594f5fc42a2a5275b1d98f86bb766e4091597f4df7803'
    },
    {
      path: '11',
      hash: '32a61b662d8a1720622f524162323f2c01bb6e706163e03a0724cfaa94814ebf'
    }
  ]
}

proof.entries.forEach(({ value }) => convertPublicKey(value))

// Create a `MapProof` instance. Note the use of `MapProof.rawKey`.
proof = new MapProof(proof, MapProof.rawKey(PublicKey), Wallet)
expect(proof.entries.size).to.equal(2)
expect(proof.missingKeys.size).to.equal(2)
expect(proof.merkleRoot).to.equal('facb561c29cc1aeac8bdd9a101a6644f8e49fa24a23c835723e8039e00979949')

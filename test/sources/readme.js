/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const $protobuf = require('protobufjs/light')
const { expect } = require('chai')
const Exonum = require('../../src')

const Type = $protobuf.Type
const Field = $protobuf.Field

describe('Examples from README.md', function () {
  describe('Custom type section', function () {
    let Message = new Type('CustomMessage')
    Message.add(new Field('balance', 1, 'uint32'))
    Message.add(new Field('name', 2, 'string'))
    const User = Exonum.newType(Message)
    const data = {
      balance: 100,
      name: 'John Doe'
    }
    const keyPair = {
      publicKey: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
      secretKey: '978e3321bd6331d56e5f4c2bdb95bf471e95a77a6839e68d4241e7b0932ebe2bfa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'
    }
    const hash = '9786347be1ab7e8f3d68a49ef8a995a4decb31103c53565a108170dec4c1c2fa'
    const buffer = [8, 100, 18, 8, 74, 111, 104, 110, 32, 68, 111, 101]
    const signature = 'a4cf7c457e3f4d54ef0c87900e7c860d2faa17a8dccbaafa573a3a960cda3f6627911088138526d9d7e46feba471e6bc7b93262349a5ed18262cbc39c8a47b04'

    it('should get hash of custom type', function () {
      expect(Exonum.hash(data, User)).to.equal(hash)
    })

    it('should get hash of byte array', function () {
      expect(Exonum.hash(buffer)).to.equal(hash)
    })

    it('should sign custom type', function () {
      expect(Exonum.sign(keyPair.secretKey, data, User)).to.equal(signature)
    })

    it('should verify custom type signature', function () {
      expect(Exonum.verifySignature(signature, keyPair.publicKey, data, User)).to.be.true
    })
  })

  describe('Transaction section', function () {
    const Transaction = new Type('CustomMessage')
    Transaction.add(new Field('to', 1, 'string'))
    Transaction.add(new Field('amount', 2, 'uint32'))
    const sendFunds = new Exonum.Transaction({
      serviceId: 130,
      methodId: 0,
      schema: Transaction
    })

    it('should work', () => {
      const keyPair = {
        publicKey: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
        secretKey: '978e3321bd6331d56e5f4c2bdb95bf471e95a77a6839e68d4241e7b0932ebe2bfa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'
      }
      const data = {
        to: 'Adam',
        amount: 50
      }
      const signed = sendFunds.create(data, keyPair)
      expect(signed.payload.any_tx.call_info.instance_id).to.equal(sendFunds.serviceId)
      expect(signed.payload.any_tx.arguments).to.deep.equal(Transaction.encode(data).finish())
      expect(signed.author).to.equal(keyPair.publicKey)

      const deserialized = sendFunds.deserialize(signed.serialize())
      expect(deserialized.payload.to).to.equal('Adam')
      expect(deserialized.payload.amount).to.equal(50)
    })
  })

  describe('Merkle tree verifying example', function () {
    it('should verify a Merkle tree', function () {
      const rootHash = 'e8191f90b68102a3ea427118646add7c7dddfa9a14ef33f95c051891fad5c38b'
      const count = 3
      const proofNode = {
        left: {
          left: {
            val: {
              firstName: 'John',
              lastName: 'Doe',
              age: 28,
              balance: 2500
            }
          },
          right: '8dc134fc6f0e0b7fccd32bb0f6090e68600710234c1cb318261d5e78be659bd1'
        },
        right: '3b45eedc6952cbec6a8b769c3e50f96d1d059853bbedb7c26f8621243b308e9a'
      }
      const range = [0, 0]
      let Schema = new Type('CustomMessage')
      Schema.add(new Field('firstName', 1, 'string'))
      Schema.add(new Field('lastName', 2, 'string'))
      Schema.add(new Field('age', 3, 'uint32'))
      Schema.add(new Field('balance', 4, 'uint32'))
      let User = Exonum.newType(Schema)

      expect(Exonum.merkleProof(rootHash, count, proofNode, range, User)).to.deep.equal([
        {
          firstName: 'John',
          lastName: 'Doe',
          age: 28,
          balance: 2500
        }
      ])
    })

    it('should verify a Merkle tree with elements passed as hashes', function () {
      const rootHash = '553c53eab1505aef358f078ef8102801240599ea5ac3dc97f4c8e146db391c80'
      const count = 2
      const proofNode = {
        left: {
          val: 'c19569c5b391b1106e16021f50d20763cbece4199fd1356f2d3e429ff13e1345'
        },
        right: {
          val: '3e1ff2f54195207e42d36ff0de1b345be9c59111b67263c31364506d11e2190f'
        }
      }
      const range = [0, 8]

      expect(Exonum.merkleProof(rootHash, count, proofNode, range)).to.deep.equal([
        'c19569c5b391b1106e16021f50d20763cbece4199fd1356f2d3e429ff13e1345',
        '3e1ff2f54195207e42d36ff0de1b345be9c59111b67263c31364506d11e2190f'
      ])
    })

    it('should verify a Merkle tree with elements passed as byte arrays', function () {
      const rootHash = '3f29780d915d5111e7852751684fee505f671520044fb6c01df9dd2283237a80'
      const count = 8
      const proofNode = {
        left: {
          left: {
            left: { val: [1, 2] },
            right: { val: [2, 3] }
          },
          right: {
            left: { val: [3, 4] },
            right: { val: [4, 5] }
          }
        },
        right: {
          left: {
            left: { val: [5, 6] },
            right: { val: [6, 7] }
          },
          right: {
            left: { val: [7, 8] },
            right: { val: [8, 9] }
          }
        }
      }
      const range = [0, 8]

      expect(Exonum.merkleProof(rootHash, count, proofNode, range)).to.deep.equal([
        [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]
      ])
    })
  })

  describe('Block verifying example', function () {
    it('should verify a block', function () {
      // FIXME: use new data
      const data = {
        'block': {
          'proposer_id': 0,
          'height': 175,
          'tx_count': 0,
          'prev_hash': 'c0521a0a97314b7b834eaa39e4a338c454342def89a02121b4e036eb7b457770',
          'tx_hash': '0000000000000000000000000000000000000000000000000000000000000000',
          'state_hash': 'a697f4806e3230b75c1bb2f7fa2e308509e4df7ee76ddbe1947f1c3b101a6601'
        },
        'precommits': [
          '71981ffe69aa80cc05457a5df32db891a6bbbca868aeb3288f676e7197dc96350100080210af01180122220a206d750c8aec9897261a8e64daf8a9fd47c0aaff5421b4f57065bfcde0ec5f11c52a220a20b83938eaccab6709f2a127b17a686dea53883ef86b03034f6c94fea739a64804320c08a2a5b9e0051098eee6ba023b02f53d0f59e065ce0a139aead0ba1b59c09e300924d1e34f1388606376c116b60ba1004955f1a09a80253f0585c0168652f5eafb699ad45b144ef19cbcbb08',
          'c4c7c60108aa053b8c2e758253da776e29553aa41056d553118a9c57e06243d90100080310af01180122220a206d750c8aec9897261a8e64daf8a9fd47c0aaff5421b4f57065bfcde0ec5f11c52a220a20b83938eaccab6709f2a127b17a686dea53883ef86b03034f6c94fea739a64804320c08a2a5b9e005108082e3ba02fc0a86a189010aa592a21c9bcf31ee72eca9e2f48f6635a0dff9b025b902a14f22a04ec15ddaa6419f789c52576726bdcf93a0ea772fcb44f53bbc053ba05304',
          '56dc946c2292b2425e92076e2d7ad8363a0940c03136090c41e85d35066d161e010010af01180122220a206d750c8aec9897261a8e64daf8a9fd47c0aaff5421b4f57065bfcde0ec5f11c52a220a20b83938eaccab6709f2a127b17a686dea53883ef86b03034f6c94fea739a64804320c08a2a5b9e00510c0c0e3ba020dc182f4fc9430efd73a5ef50de2654608ddfcfe9ad73c0dd7bd5efb571378ffd2e9156298d76c128ede33c4999f11d42aa620507ffc758a613c2a822d40f908'
        ]
      }
      const validators = [
        '56dc946c2292b2425e92076e2d7ad8363a0940c03136090c41e85d35066d161e',
        '6649b6e4c68fa7436b2481b70a174d938e8cbcf8f92157fa94308e7ee747b4ab',
        '71981ffe69aa80cc05457a5df32db891a6bbbca868aeb3288f676e7197dc9635',
        'c4c7c60108aa053b8c2e758253da776e29553aa41056d553118a9c57e06243d9'
      ]

      Exonum.verifyBlock(data, validators)
    })
  })
})

/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const $protobuf = require('protobufjs/light')
const chai = require('chai')
const expect = chai.expect
const assert = chai.assert
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
    let Transaction = new Type('CustomMessage')
    Transaction.add(new Field('from', 1, 'string'))
    Transaction.add(new Field('to', 2, 'string'))
    Transaction.add(new Field('amount', 3, 'uint32'))
    const keyPair = {
      publicKey: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
      secretKey: '978e3321bd6331d56e5f4c2bdb95bf471e95a77a6839e68d4241e7b0932ebe2bfa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'
    }
    const sendFunds = Exonum.newTransaction({
      author: keyPair.publicKey,
      instance_id: 130,
      method_id: 0,
      schema: Transaction
    })
    const data = {
      from: 'John',
      to: 'Adam',
      amount: 50
    }
    const buffer = new Uint8Array([
      10, 23, 10, 5, 8, 130, 1, 16,
      0, 18, 14, 10, 4, 74, 111, 104,
      110, 18, 4, 65, 100, 97, 109, 24,
      50
    ])
    const signature = '206aa6a97467b91ce8b7c7c650f8aca0f14d78be92478fd12fe20874ea20db385262cb4772891db05f73022829aef6018aa294db7cd1bafc9e5e7b3281255e02'
    const hash = 'babd11e9855c1f4546f46cd45f10048f17dcb3fdbd80e935cfbe3e8d7ffb0a60'

    it('should serialize transaction', function () {
      expect(sendFunds.serialize(data)).to.deep.equal(buffer)
    })

    it('should sign transaction', function () {
      expect(sendFunds.sign(keyPair.secretKey, data)).to.equal(signature)
    })

    it('should verify transaction signature', function () {
      expect(sendFunds.verifySignature(signature, keyPair.publicKey, data)).to.be.true
    })

    it('should get transaction hash', function () {
      sendFunds.signature = signature
      expect(sendFunds.hash(data)).to.equal(hash)
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
      const data = {
        'block': {
          'additional_headers': {
            'headers': {
              'proposer_id': [
                0,
                0
              ]
            }
          },
          'error_hash': '7324b5c72b51bb5d4c180f1109cfd347b60473882145841c39f3e584576296f9',
          'height': 3,
          'prev_hash': '752ea3263c40fc80a8f9b4d8961844dcf3437916087293799aeebfc37b61b672',
          'state_hash': 'bbaeae219c904979436bebc0ff22730fb132eac3c9f8f4f111941e802569bc12',
          'tx_count': 1,
          'tx_hash': '587c269e8f27571ff28dd502b527bf6a21f18603b93a9046623bd401e3f96865'
        },
        'precommits': [
          '0a5b22591003180122220a20d9f6a94f2ce42624cff62067cd1405cf0260f930bf960b1c57c4f1fa7e22b7542a220a203f2f0273ee6cae09ea3343c588c28ae7a7c5eb64b54059c52f96471edcfdd3dc320b08a887c5f10510e095c86d12220a20bc6121c63142e0aefdcf14073d831a912090029cf41b4efd5c9196364c97778a1a420a404d3d296f1ca1f3e73fcf6c47c3e0839c030b60309493b3eefd508a7e95e8cca1e889b362d0e4b751737cab3adcbf35b1cd328cdf08f9ddfca12266f0590a0001',
          '0a5d225b08011003180122220a20d9f6a94f2ce42624cff62067cd1405cf0260f930bf960b1c57c4f1fa7e22b7542a220a203f2f0273ee6cae09ea3343c588c28ae7a7c5eb64b54059c52f96471edcfdd3dc320b08a887c5f10510a8eccd6d12220a20f7e65c6231d53f7958cb10382fdbf365c13558551fa90b19908b544a155776c51a420a4021bc23dc4f843b08ab541847429459499aada7b59125c864d46ceaeed9f52d2596c250f4cccfa1dae7bcb81da63e8bb1393666fa489b5e736242a1141aacfd04',
          '0a5d225b08021003180122220a20d9f6a94f2ce42624cff62067cd1405cf0260f930bf960b1c57c4f1fa7e22b7542a220a203f2f0273ee6cae09ea3343c588c28ae7a7c5eb64b54059c52f96471edcfdd3dc320b08a887c5f105108094d36d12220a20d61fd43f09908a9b4481b46a30371330136bf9e37891b48f45391d64b04c6ad51a420a403d59638726fd2ea750cf2182d7c0b0269e72adb62c18da37eb45143228ea6ad6f154f3be8ba2d7f2f12a83f61b56dafcaab4df17724eeebe20186c28d2758007'
        ]
      }
      const validators = [
        'bc6121c63142e0aefdcf14073d831a912090029cf41b4efd5c9196364c97778a',
        'f7e65c6231d53f7958cb10382fdbf365c13558551fa90b19908b544a155776c5',
        'd61fd43f09908a9b4481b46a30371330136bf9e37891b48f45391d64b04c6ad5'
      ]

      return assert.isFulfilled(Exonum.verifyBlock(data, validators))
    })
  })
})

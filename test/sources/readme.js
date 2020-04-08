/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const $protobuf = require('protobufjs/light')
const { expect } = require('chai')
const Exonum = require('../../src')

const Type = $protobuf.Type
const Field = $protobuf.Field

describe('Examples from README.md', function () {
  describe('Custom type section', function () {
    const Message = new Type('CustomMessage')
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
      const rootHash = '92cb0ac4e56995b3dfe002be166dd18d2965535d9ad812b055b953c9b3d35456'
      const proofData = {
        proof: [
          { height: 1, index: 1, hash: '8dc134fc6f0e0b7fccd32bb0f6090e68600710234c1cb318261d5e78be659bd1' },
          { height: 2, index: 1, hash: '3b45eedc6952cbec6a8b769c3e50f96d1d059853bbedb7c26f8621243b308e9a' }
        ],
        entries: [
          [0, {
            firstName: 'John',
            lastName: 'Doe',
            age: 28,
            balance: 2500
          }]
        ],
        length: 3
      }

      const User = Exonum.newType(new Type('CustomMessage')
        .add(new Field('firstName', 1, 'string'))
        .add(new Field('lastName', 2, 'string'))
        .add(new Field('age', 3, 'uint32'))
        .add(new Field('balance', 4, 'uint32')))

      const listProof = new Exonum.ListProof(proofData, User)
      expect(listProof.merkleRoot).to.equal(rootHash)
    })
  })
})

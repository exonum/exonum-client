/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const Exonum = require('../../src')
let messages = require('../stubs/test_data_pb.js')

const keyPair = {
  publicKey: '84e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455',
  secretKey: '9aaa377f0880ae2aa6697ea45e6c26f164e923e73b31f52e6da0cf40798ca4c184e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455'
}

const data = {
  data: {
    'name': 'my name',
    'balance': 359120
  },
  hashType: '3af123e43b4f55da9d6e6e1df9436b74d3ae7012cfc73211269592b6879b94fd',
  hash: '2b326538becbb941ebd878b6123b9bf05d6443520d2af344a46e0eeeda91f978',
  signed: '7ebea36cb66364afa539210c6929bb8ff8940c6a14d2261e7ef0b8abff95d33ee9ac13f44d148f5dca8c2f1da206f2eab6d118a41072bf9bfe429fd72151020e',
  signedType: '4fcb814da99253c32241ade71555d6295a14b75fbdd5531c2518e7565bf38c0b439a9f03be1423b7467c0526c668220ba9528e2e62656f612c24969d19e43409',
  serialized: [
    132, 224, 212, 174, 23, 206, 239, 212, 87, 218, 17, 135, 41, 83, 157, 18, 28, 159, 85, 134, 248, 35, 56, 216, 149, 209, 116, 70, 82, 206, 68, 85, 0, 0, 130, 0, 0, 0, 18, 7, 109, 121, 32, 110, 97, 109, 101, 24, 208, 245, 21
  ]
}

let message = new messages.Type1Protobuf()
message.setName(data.data.name)
message.setBalance(data.data.balance)

const CreateTransaction = Exonum.newTransaction({
  author: keyPair.publicKey,
  service_id: 130,
  message_id: 0,
  schema: message
})

const CreateType = Exonum.newType(message)

describe('Check cryptography', function () {
  describe('Get SHA256 hash', function () {
    it('should return hash of data of newType type', function () {
      const hash = Exonum.hash(CreateType)
      expect(hash).to.equal(data.hashType)
    })

    it('should return hash of data of newType type using built-in method', function () {
      const hash = CreateType.hash()
      expect(hash).to.equal(data.hashType)
    })

    it('should return hash of data of Transaction type', function () {
      const hash = Exonum.hash(CreateTransaction)
      expect(hash).to.equal(data.hash)
    })

    it('should return hash of data of Transaction type using built-in method', function () {
      const hash = CreateTransaction.hash()
      expect(hash).to.equal(data.hash)
    })
  })

  describe('Get ED25519 signature', function () {
    it('should return signature of the data of NewType type', function () {
      const signature = Exonum.sign(keyPair.secretKey, CreateType)
      expect(signature).to.equal(data.signedType)
    })

    it('should return signature of the data of NewType type using built-in method', function () {
      const signature = CreateType.sign(keyPair.secretKey)
      expect(signature).to.equal(data.signedType)
    })

    it('should return signature of the data of Transaction type', function () {
      const signature = Exonum.sign(keyPair.secretKey, CreateTransaction)
      expect(signature).to.equal(data.signed)
    })

    it('should return signature of the data of Transaction type using built-in method', function () {
      const signature = CreateTransaction.sign(keyPair.secretKey)
      expect(signature).to.equal(data.signed)
    })

    it('should throw error when the type parameter of invalid type', function () {
      const secretKey = '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'
      const User = {
        alpha: 5
      }

      expect(() => Exonum.sign(secretKey, User))
        .to.throw(TypeError, 'Wrong type of data.')
    })
    /*
        it('should throw error when the secretKey parameter of wrong length', function () {
          const buffer = CreateType.serialize(CreateTransactionData.data)
          expect(() => Exonum.sign('1', buffer))
            .to.throw(TypeError, 'secretKey of wrong type is passed. Hexadecimal expected.')
        })

        it('should throw error when wrong secretKey parameter', function () {
          const buffer = CreateType.serialize(CreateTransactionData.data)
          expect(() => Exonum.sign(123, buffer))
            .to.throw(TypeError, 'secretKey of wrong type is passed. Hexadecimal expected.')
        })

        it('should throw error when the secretKey parameter of invalid type', function () {
          const buffer = CreateType.serialize(CreateTransactionData.data);

          [true, null, undefined, [], {}, 51, new Date()].forEach(function (secretKey) {
            expect(() => Exonum.sign(secretKey, buffer))
              .to.throw(TypeError, 'secretKey of wrong type is passed. Hexadecimal expected.')
          })
        })
      */
  })

  describe('Verify signature', function () {
    it('should verify signature of the data of NewType type and return true', function () {
      const signature = Exonum.sign(keyPair.secretKey, CreateType)
      CreateType.signed = signature
      expect(Exonum.verifySignature(data.signedType, keyPair.publicKey, CreateType)).to.be.true
    })

    it('should verify signature of the data of NewType type using built-in method and return true', function () {
      const signature = CreateType.sign(keyPair.secretKey)
      CreateType.signed = signature
      expect(CreateType.verifySignature(data.signedType, keyPair.publicKey)).to.be.true
    })

    it('should verify signature of the data of Transaction type and return true', function () {
      const signature = Exonum.sign(keyPair.secretKey, CreateTransaction)
      CreateTransaction.signed = signature
      expect(Exonum.verifySignature(data.signed, keyPair.publicKey, CreateTransaction)).to.be.true
    })

    it('should verify signature of the data of Transaction type using built-in method and return true', function () {
      const signature = CreateTransaction.sign(keyPair.secretKey)
      CreateType.signed = signature
      expect(CreateTransaction.verifySignature(data.signed, keyPair.publicKey)).to.be.true
    })

    it('should throw error when the signature parameter is of wrong length', function () {
      const publicKey = 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'
      const signature = 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'

      expect(() => Exonum.verifySignature(signature, publicKey))
        .to.throw(TypeError, 'Signature of wrong type is passed. Hexadecimal expected.')
    })

    it('should throw error when the signature parameter is invalid', function () {
      const publicKey = 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'
      const signature = '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7z'
      expect(() => Exonum.verifySignature(signature, publicKey))
        .to.throw(TypeError, 'Signature of wrong type is passed. Hexadecimal expected.')
    })
  })
})

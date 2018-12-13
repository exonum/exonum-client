/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const $protobuf = require('protobufjs/light')
const expect = require('chai').expect
const Exonum = require('../../src')
const proto = require('./proto/cryptocurrency.js')

const Root = $protobuf.Root
const Type = $protobuf.Type
const Field = $protobuf.Field

const keyPair = {
  publicKey: '84e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455',
  secretKey: '9aaa377f0880ae2aa6697ea45e6c26f164e923e73b31f52e6da0cf40798ca4c184e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455'
}

let root = new Root()
let CreateTypeProtobuf = new Type('CreateType').add(new Field('pub_key', 1, 'bytes'))
CreateTypeProtobuf.add(new Field('name', 2, 'string'))
CreateTypeProtobuf.add(new Field('balance', 3, 'int64'))
root.define('CreateTypeProtobuf').add(CreateTypeProtobuf)
const CreateType = Exonum.newType(CreateTypeProtobuf)
const CreateTypeData = {
  data: {
    'pub_key': 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
    'name': 'Smart wallet',
    'balance': 359120
  },
  hash: 'b6effedef97bd9bfee70bfa0007029d33d4526fa932c3d0d58ffca9c6a135246',
  signed: 'e0b074a33c370142ed7728782f579dd8701f55b2730f82ad5174c174fdcb597db2a8f9e2e4a4bcfbae8960ab47ddf9a5de741dba69785302649b5affcac1bb07'
}

let CreateTransactionProtobuf = new Type('CreateTransaction').add(new Field('pub_key', 1, 'bytes'))
CreateTransactionProtobuf.add(new Field('name', 2, 'string'))
CreateTransactionProtobuf.add(new Field('balance', 3, 'int64'))
root.define('CreateTransactionProtobuf').add(CreateTransactionProtobuf)
const CreateTransaction = Exonum.newTransaction({
  author: keyPair.publicKey,
  service_id: 130,
  message_id: 0,
  schema: CreateTransactionProtobuf
})
const CreateTransactionData = {
  data: {
    'pub_key': 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
    'name': 'Smart wallet',
    'balance': 359120
  },
  hash: '8f239bebc50e1a16e36732cf35cf0278e4b0ad2ec3fcd0370f846d0709764b25',
  signed: '76176937694edb44e128343a7ba5cc3bdee52d821f819d54ce523765955bb5cfeafab1d4c95e3f341ef23a045406f18a9b7f84401139ef3a51a3cb4744c13900'
}

describe('Check cryptography', function () {
  describe('Get SHA256 hash', function () {
    it('should return hash of data of newType type', function () {
      const hash = Exonum.hash(CreateTypeData.data, CreateType)
      expect(hash).to.equal(CreateTypeData.hash)
    })

    it('should serialize entity of newType', () => {
      const Wallet = Exonum.newType(proto.exonum.examples.cryptocurrency_advanced.Wallet)
      const data = {
        balance: 160,
        history_hash: { data: Exonum.hexadecimalToUint8Array('e6a4349d4c0f2e07c44f145cf765318ce14a0c869ca458e12bdae4724df853d4') },
        history_len: 3,
        name: 'Jane Doe',
        pub_key: { data: Exonum.hexadecimalToUint8Array('e2ad49552fdf95302a725890139f9d1af69c49670d466366bd3af214da086dc4') }
      }

      const buffer = Wallet.serialize(data)

      expect('d7923cc44dafaad4d89a1ed46bbb2390cfd0b2c9c5a18ba1ceb15955750ff455').to.equal(Exonum.hash(buffer))
    })

    it('should serialize entity of newType with zero int', () => {
      const Issue = Exonum.newType(proto.exonum.examples.cryptocurrency_advanced.Issue)
      const data = {
        amount: 0,
        seed: 1
      }

      const buffer = Issue.serialize(data)

      expect('27c24fcb8474773e2af799d0848495ff053272d33c432dc26277993df45c9276').to.equal(Exonum.hash(buffer))
    })

    it('should return hash of data of newType type using built-in method', function () {
      const hash = CreateType.hash(CreateTypeData.data)
      expect(hash).to.equal(CreateTypeData.hash)
    })

    it('should return hash of data of Transaction type', function () {
      const hash = Exonum.hash(CreateTransactionData.data, CreateTransaction)
      expect(hash).to.equal(CreateTransactionData.hash)
    })

    it('should return hash of data of Transaction type using built-in method', function () {
      const hash = CreateTransaction.hash(CreateTransactionData.data)
      expect(hash).to.equal(CreateTransactionData.hash)
    })

    it('should return hash of the array of 8-bit integers', function () {
      const buffer = CreateType.serialize(CreateTypeData.data)
      const hash = Exonum.hash(buffer)
      expect(hash).to.equal(CreateTypeData.hash)
    })
  })

  describe('Get ED25519 signature', function () {
    it('should return signature of the data of NewType type', function () {
      const signature = Exonum.sign(keyPair.secretKey, CreateTypeData.data, CreateType)
      expect(signature).to.equal(CreateTypeData.signed)
    })

    it('should return signature of the data of NewType type using built-in method', function () {
      const signature = CreateType.sign(keyPair.secretKey, CreateTypeData.data)
      expect(signature).to.equal(CreateTypeData.signed)
    })

    it('should return signature of the data of Transaction type', function () {
      const signature = Exonum.sign(keyPair.secretKey, CreateTransactionData.data, CreateTransaction)
      expect(signature).to.equal(CreateTransactionData.signed)
    })

    it('should return signature of the data of Transaction type using built-in method', function () {
      const signature = CreateTransaction.sign(keyPair.secretKey, CreateTransactionData.data)
      expect(signature).to.equal(CreateTransactionData.signed)
    })

    it('should return signature of the array of 8-bit integers', function () {
      const buffer = CreateTransaction.serialize(CreateTransactionData.data)
      const signature = Exonum.sign(keyPair.secretKey, buffer)
      expect(signature).to.equal(CreateTransactionData.signed)
    })

    it('should throw error when the type parameter of invalid type', function () {
      const secretKey = '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'
      const User = {
        alpha: 5
      }
      const userData = {
        firstName: 'John',
        lastName: 'Doe'
      }

      expect(() => Exonum.sign(secretKey, userData, User))
        .to.throw(TypeError, 'Wrong type of data.')
    })

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
  })

  describe('Verify signature', function () {
    it('should verify signature of the data of NewType type and return true', function () {
      const signature = Exonum.sign(keyPair.secretKey, CreateTypeData.data, CreateType)
      CreateType.signed = signature
      expect(Exonum.verifySignature(CreateTypeData.signed, keyPair.publicKey, CreateTypeData.data, CreateType)).to.be.true
    })

    it('should verify signature of the data of NewType type using built-in method and return true', function () {
      const signature = CreateType.sign(keyPair.secretKey, CreateTypeData.data)
      CreateType.signed = signature
      expect(CreateType.verifySignature(CreateTypeData.signed, keyPair.publicKey, CreateTypeData.data)).to.be.true
    })

    it('should verify signature of the data of Transaction type and return true', function () {
      const signature = Exonum.sign(keyPair.secretKey, CreateTransactionData.data, CreateTransaction)
      CreateTransaction.signed = signature
      expect(Exonum.verifySignature(CreateTransactionData.signed, keyPair.publicKey, CreateTransactionData.data, CreateTransaction)).to.be.true
    })

    it('should verify signature of the data of Transaction type using built-in method and return true', function () {
      const signature = CreateTransaction.sign(keyPair.secretKey, CreateTransactionData.data)
      CreateType.signed = signature
      expect(CreateTransaction.verifySignature(CreateTransactionData.signed, keyPair.publicKey, CreateTransactionData.data)).to.be.true
    })

    it('should verify signature of the array of 8-bit integers', function () {
      const buffer = CreateType.serialize(CreateTypeData.data)
      expect(Exonum.verifySignature(CreateTypeData.signed, keyPair.publicKey, buffer)).to.be.true
    })

    it('should verify signature of the array of 8-bit integers', function () {
      const buffer = CreateType.serialize(CreateTypeData.data)
      expect(Exonum.verifySignature(CreateTypeData.signed, keyPair.publicKey, buffer)).to.be.true
    })

    it('should throw error when the signature parameter is of wrong length', function () {
      const publicKey = 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'
      const signature = 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'
      const buffer = CreateType.serialize(CreateTypeData.data)

      expect(() => Exonum.verifySignature(signature, publicKey, buffer))
        .to.throw(TypeError, 'Signature of wrong type is passed. Hexadecimal expected.')
    })

    it('should throw error when the signature parameter is invalid', function () {
      const publicKey = 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'
      const signature = '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7z'
      const buffer = CreateType.serialize(CreateTypeData.data)

      expect(() => Exonum.verifySignature(signature, publicKey, buffer))
        .to.throw(TypeError, 'Signature of wrong type is passed. Hexadecimal expected.')
    })

    it('should throw error when the signature parameter is of wrong type', function () {
      const publicKey = 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'
      const buffer = CreateType.serialize(CreateTypeData.data);

      [true, null, undefined, [], {}, 51, new Date()].forEach(signature => {
        expect(() => Exonum.verifySignature(signature, publicKey, buffer))
          .to.throw(TypeError, 'Signature of wrong type is passed. Hexadecimal expected.')
      })
    })

    it('should throw error when the publicKey parameter is of wrong length', function () {
      const publicKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C'
      const signature = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C'
      const buffer = CreateType.serialize(CreateTypeData.data)
      expect(() => Exonum.verifySignature(signature, publicKey, buffer))
        .to.throw(TypeError, 'Signature of wrong type is passed. Hexadecimal expected.')
    })

    it('should throw error when the publicKey parameter is invalid', function () {
      const publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C3Z'
      const signature = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C'
      const buffer = CreateType.serialize(CreateTypeData.data)

      expect(() => Exonum.verifySignature(signature, publicKey, buffer))
        .to.throw(TypeError, 'Signature of wrong type is passed. Hexadecimal expected.')
    })

    it('should throw error when the publicKey parameter is of wrong type', function () {
      const signature = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C'
      const buffer = CreateType.serialize(CreateTypeData.data);
      [true, null, undefined, [], {}, 51, new Date()].forEach(function (publicKey) {
        expect(() => Exonum.verifySignature(signature, publicKey, buffer))
          .to.throw(TypeError, 'Signature of wrong type is passed. Hexadecimal expected.')
      })
    })
  })
})

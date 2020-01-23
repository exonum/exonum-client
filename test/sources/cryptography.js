/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const $protobuf = require('protobufjs/light')
const expect = require('chai').expect
const Exonum = require('../../src')
const proto = require('./proto/stubs')

const Root = $protobuf.Root
const Type = $protobuf.Type
const Field = $protobuf.Field

const keyPair = {
  publicKey: '84e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455',
  secretKey: '9aaa377f0880ae2aa6697ea45e6c26f164e923e73b31f52e6da0cf40798ca4c184e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455'
}

const root = new Root()
const CreateTypeProtobuf = new Type('CreateType')
  .add(new Field('pub_key', 1, 'bytes'))
  .add(new Field('name', 2, 'string'))
  .add(new Field('balance', 3, 'int64'))
root.define('CreateTypeProtobuf').add(CreateTypeProtobuf)

const CreateType = Exonum.newType(CreateTypeProtobuf)
const TYPE_DATA = {
  data: {
    'pub_key': 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
    'name': 'Smart wallet',
    'balance': 359120
  },
  hash: 'b6effedef97bd9bfee70bfa0007029d33d4526fa932c3d0d58ffca9c6a135246',
  signed: 'e0b074a33c370142ed7728782f579dd8701f55b2730f82ad5174c174fdcb597db2a8f9e2e4a4bcfbae8960ab47ddf9a5de741dba69785302649b5affcac1bb07'
}

const CreateTransactionProtobuf = new Type('CreateTransaction')
  .add(new Field('pub_key', 1, 'bytes'))
  .add(new Field('name', 2, 'string'))
  .add(new Field('balance', 3, 'int64'))
root.define('CreateTransactionProtobuf').add(CreateTransactionProtobuf)
const CreateTransaction = new Exonum.Transaction({
  serviceId: 130,
  methodId: 0,
  schema: CreateTransactionProtobuf
})

const TX_DATA = {
  data: {
    'pub_key': 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
    'name': 'Smart wallet',
    'balance': 359120
  },
  hash: 'b765a4f6f2a08f6c61876a090a18e9cfead4c80f6bab0f9e1b18a14433a94ff1',
  signature: '1224254b30ed5fa2f6f3e61be3e8b0400669eec29b1e295c75a37090fada3b79' +
    'e7e67f77f6175a16e3a50e8343d2b98a8a432e57667a41b6e706bfabaff4570b'
}

describe('Check cryptography', function () {
  describe('Get SHA256 hash', function () {
    it('should return hash of data of newType type', function () {
      const hash = Exonum.hash(TYPE_DATA.data, CreateType)
      expect(hash).to.equal(TYPE_DATA.hash)
    })

    it('should return key pair from seed', function () {
      const keyPair1 = Exonum.fromSeed(Uint8Array.from([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        31, 32]))

      expect(keyPair1.publicKey).to.not.equal(null)
      expect(keyPair1.secretKey).to.not.equal(null)
    })

    it('should throw if anything different is passed instead of Uint8Array as a seed', function () {
      expect(() => Exonum.fromSeed(undefined))
        .to.throw(TypeError, 'unexpected type [object Undefined], use Uint8Array')

      expect(() => Exonum.fromSeed(null))
        .to.throw(TypeError, 'unexpected type [object Null], use Uint8Array')

      expect(() => Exonum.fromSeed())
        .to.throw(TypeError, 'unexpected type [object Undefined], use Uint8Array')

      expect(() => Exonum.fromSeed('123'))
        .to.throw(TypeError, 'unexpected type [object String], use Uint8Array')
    })

    it('should throw bad size of Uint8Array is passed as a seed', function () {
      expect(() => Exonum.fromSeed(Uint8Array.from([1, 2, 3])))
        .to.throw(Error, 'bad seed size')
    })

    it('should return unique key pair from different seeds', function () {
      const keyPair1 = Exonum.fromSeed(Uint8Array.from([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        31, 32]))

      const keyPair2 = Exonum.fromSeed(Uint8Array.from([
        0, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        31, 32]))

      expect(keyPair1.publicKey).to.not.equal(null)
      expect(keyPair1.secretKey).to.not.equal(null)
      expect(keyPair2.publicKey).to.not.equal(null)
      expect(keyPair2.secretKey).to.not.equal(null)

      expect(keyPair1.publicKey).to.not.equal(keyPair2.publicKey)
      expect(keyPair1.secretKey).to.not.equal(keyPair2.secretKey)
    })

    it('should create entity of newType', () => {
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

    it('should create entity of newType with zero int', () => {
      const Issue = Exonum.newType(proto.exonum.examples.cryptocurrency_advanced.Issue)
      const data = {
        amount: 0,
        seed: 1
      }

      const buffer = Issue.serialize(data)

      expect('27c24fcb8474773e2af799d0848495ff053272d33c432dc26277993df45c9276')
        .to.equal(Exonum.hash(buffer))
    })

    it('should return hash of data of newType type using built-in method', function () {
      const hash = CreateType.hash(TYPE_DATA.data)
      expect(hash).to.equal(TYPE_DATA.hash)
    })

    it('should return hash of data of Transaction type using built-in method', function () {
      const hash = CreateTransaction.create(TX_DATA.data, keyPair).hash()
      expect(hash).to.equal(TX_DATA.hash)
    })

    it('should return hash of the array of 8-bit integers', function () {
      const buffer = CreateType.serialize(TYPE_DATA.data)
      const hash = Exonum.hash(buffer)
      expect(hash).to.equal(TYPE_DATA.hash)
    })
  })

  describe('Get ED25519 signature', function () {
    it('should return signature of the data of NewType type', function () {
      const signature = Exonum.sign(keyPair.secretKey, TYPE_DATA.data, CreateType)
      expect(signature).to.equal(TYPE_DATA.signed)
    })

    it('should return signature of the data of NewType type using built-in method', function () {
      const signature = CreateType.sign(keyPair.secretKey, TYPE_DATA.data)
      expect(signature).to.equal(TYPE_DATA.signed)
    })

    it('should return signature of the data of Transaction type', function () {
      const signature = Exonum.sign(keyPair.secretKey, TX_DATA.data, CreateTransaction)
      expect(signature).to.equal(TX_DATA.signature)
    })

    it('should return signature of the data of Transaction type using built-in method', function () {
      const { signature } = CreateTransaction.create(TX_DATA.data, keyPair)
      expect(signature).to.equal(TX_DATA.signature)
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
      const buffer = CreateType.serialize(TX_DATA.data)
      expect(() => Exonum.sign('1', buffer))
        .to.throw(TypeError, 'secretKey of wrong type is passed. Hexadecimal expected.')
    })

    it('should throw error when wrong secretKey parameter', function () {
      const buffer = CreateType.serialize(TX_DATA.data)
      expect(() => Exonum.sign(123, buffer))
        .to.throw(TypeError, 'secretKey of wrong type is passed. Hexadecimal expected.')
    })

    it('should throw error when the secretKey parameter of invalid type', function () {
      const buffer = CreateType.serialize(TX_DATA.data);

      [true, null, undefined, [], {}, 51, new Date()].forEach(function (secretKey) {
        expect(() => Exonum.sign(secretKey, buffer))
          .to.throw(TypeError, 'secretKey of wrong type is passed. Hexadecimal expected.')
      })
    })
  })

  describe('Verify signature', function () {
    it('should verify signature of the data of NewType type and return true', function () {
      const signature = Exonum.sign(keyPair.secretKey, TYPE_DATA.data, CreateType)
      expect(Exonum.verifySignature(signature, keyPair.publicKey, TYPE_DATA.data, CreateType)).to.be.true
    })

    it('should verify signature of the data of NewType type using built-in method and return true', function () {
      const signature = CreateType.sign(keyPair.secretKey, TYPE_DATA.data)
      expect(CreateType.verifySignature(signature, keyPair.publicKey, TYPE_DATA.data)).to.be.true
    })

    it('should verify signature of the data of Transaction type and return true', function () {
      const signature = Exonum.sign(keyPair.secretKey, TX_DATA.data, CreateTransaction)
      expect(Exonum.verifySignature(signature, keyPair.publicKey, TX_DATA.data, CreateTransaction)).to.be.true
    })

    it('should verify signature of the data in Verified', function () {
      const signed = CreateTransaction.create(TX_DATA.data, keyPair)
      expect(signed.author).to.equal(keyPair.publicKey)
      expect(Exonum.verifySignature(signed.signature, signed.author, signed.payload, CreateTransaction)).to.be.true
    })

    it('should verify signature of the array of 8-bit integers', function () {
      const buffer = CreateType.serialize(TYPE_DATA.data)
      expect(Exonum.verifySignature(TYPE_DATA.signed, keyPair.publicKey, buffer)).to.be.true
    })

    it('should verify signature of the array of 8-bit integers', function () {
      const buffer = CreateType.serialize(TYPE_DATA.data)
      expect(Exonum.verifySignature(TYPE_DATA.signed, keyPair.publicKey, buffer)).to.be.true
    })

    it('should throw error when the signature parameter is of wrong length', function () {
      const publicKey = 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'
      const signature = 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'
      const buffer = CreateType.serialize(TYPE_DATA.data)

      expect(() => Exonum.verifySignature(signature, publicKey, buffer))
        .to.throw(TypeError, 'Signature of wrong type is passed. Hexadecimal expected.')
    })

    it('should throw error when the signature parameter is invalid', function () {
      const publicKey = 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'
      const signature = '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7z'
      const buffer = CreateType.serialize(TYPE_DATA.data)

      expect(() => Exonum.verifySignature(signature, publicKey, buffer))
        .to.throw(TypeError, 'Signature of wrong type is passed. Hexadecimal expected.')
    })

    it('should throw error when the signature parameter is of wrong type', function () {
      const publicKey = 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'
      const buffer = CreateType.serialize(TYPE_DATA.data);

      [true, null, undefined, [], {}, 51, new Date()].forEach(signature => {
        expect(() => Exonum.verifySignature(signature, publicKey, buffer))
          .to.throw(TypeError, 'Signature of wrong type is passed. Hexadecimal expected.')
      })
    })

    it('should throw error when the publicKey parameter is of wrong length', function () {
      const publicKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C'
      const signature = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C'
      const buffer = CreateType.serialize(TYPE_DATA.data)
      expect(() => Exonum.verifySignature(signature, publicKey, buffer))
        .to.throw(TypeError, 'Signature of wrong type is passed. Hexadecimal expected.')
    })

    it('should throw error when the publicKey parameter is invalid', function () {
      const publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C3Z'
      const signature = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C'
      const buffer = CreateType.serialize(TYPE_DATA.data)

      expect(() => Exonum.verifySignature(signature, publicKey, buffer))
        .to.throw(TypeError, 'Signature of wrong type is passed. Hexadecimal expected.')
    })

    it('should throw error when the publicKey parameter is of wrong type', function () {
      const signature = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C'
      const buffer = CreateType.serialize(TYPE_DATA.data);
      [true, null, undefined, [], {}, 51, new Date()].forEach(function (publicKey) {
        expect(() => Exonum.verifySignature(signature, publicKey, buffer))
          .to.throw(TypeError, 'Signature of wrong type is passed. Hexadecimal expected.')
      })
    })
  })

  describe('publicKeyToAddress', () => {
    const referencePairs = {
      '0000000000000000000000000000000000000000000000000000000000000000':
        '13d0470e90875c1ac973e699573b24557ca9e255edcedcbec43cc820429852b9',
      '0000000000000000000000000000000000000000000000000000000000000001':
        '711f87668175afae5f158a4f16ec705e558b8f7c9e494f12534759453bbfa004',
      '84e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455':
        '069714edac1fdb7f932f7f0af657f19982b6e72318781e042d25cea12311086c',
      'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36':
        '4d711ad2af3dead1e8562806f665d203a4174eb961dc19c54eff31053c4c449d'
    }

    Object.entries(referencePairs).forEach(([key, address]) => {
      it(`should work on key ${key}`, () => {
        expect(Exonum.publicKeyToAddress(key)).to.equal(address)
      })
    })
  })
})

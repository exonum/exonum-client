/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
import * as $protobuf from 'protobufjs/light'
import { hexadecimalToUint8Array } from '../../src/types'

const expect = require('chai').expect
const Exonum = require('../../src')
const Root = $protobuf.Root
const Type = $protobuf.Type
const Field = $protobuf.Field

const root = new Root()

describe('Protobuf serialization', function () {
  it('should create data for transaction', function () {
    const keyPair = {
      publicKey: '84e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455',
      secretKey: '9aaa377f0880ae2aa6697ea45e6c26f164e923e73b31f52e6da0cf40798ca4c184e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455'
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

    const data = {
      pub_key: hexadecimalToUint8Array('f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'),
      name: 'Smart wallet',
      balance: 359120
    }

    const buffer = CreateTransaction.create(data, keyPair).serialize()
    expect(buffer.length).to.satisfy(len => len > 32 + 64)
    const restored = CreateTransaction.deserialize(buffer)
    expect(restored.author).to.equal(keyPair.publicKey)
    expect(restored.payload.pub_key).to.deep.equal(data.pub_key)
    expect(+restored.payload.balance).to.equal(data.balance)
  })

  it('should create data for small transactions', function () {
    const keyPair = Exonum.keyPair()

    const SmallTransactionProtobuf = new Type('SmallTransaction')
    SmallTransactionProtobuf.add(new Field('name', 1, 'string'))
    root.define('SmallTransaction').add(SmallTransactionProtobuf)

    const SmallTransaction = new Exonum.Transaction({
      serviceId: 128,
      methodId: 2,
      schema: SmallTransactionProtobuf
    })

    const verified = SmallTransaction.create({ name: 'test' }, keyPair)
    expect(verified).to.be.instanceOf(Exonum.Verified)
    const buffer = verified.serialize()
    expect(buffer).to.be.instanceOf(Uint8Array)

    const restored = SmallTransaction.deserialize(buffer)
    expect(restored.payload.name).to.equal('test')
  })

  it('should create data for small type', function () {
    const SmallTypeProtobuf = new Type('SmallType')
    SmallTypeProtobuf.add(new Field('name', 1, 'string'))
    root.define('SmallType').add(SmallTypeProtobuf)

    const SmallType = Exonum.newType(SmallTypeProtobuf)
    const data = {
      data: {
        name: ''
      },
      serialized: Uint8Array.from([])
    }
    const buffer = SmallType.serialize(data.data)
    expect(buffer).to.deep.equal(data.serialized)
  })

  it('should create data for new type', function () {
    const CreateTypeProtobuf = new Type('CreateType').add(new Field('pub_key', 1, 'bytes'))
    CreateTypeProtobuf.add(new Field('name', 2, 'string'))
    CreateTypeProtobuf.add(new Field('balance', 3, 'int64'))
    root.define('CreateTypeProtobuf').add(CreateTypeProtobuf)

    const CreateType = Exonum.newType(CreateTypeProtobuf)

    const data = {
      data: {
        pub_key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
        name: 'Smart wallet',
        balance: 359120
      },
      serialized: Uint8Array.from([
        10, 48, 127, 159, 58, 225, 166, 250, 107, 150, 182, 215, 221, 58,
        235, 166, 248, 237, 206, 187, 233, 183, 31, 215, 150, 181, 127, 103, 244, 239, 189, 55, 115, 150, 220,
        105, 246, 249, 239, 143, 90, 107, 189, 249, 113, 239, 27, 237, 205, 250, 18, 12, 83, 109, 97, 114, 116,
        32, 119, 97, 108, 108, 101, 116, 24, 208, 245, 21
      ])
    }

    const buffer = CreateType.serialize(data.data)

    expect(buffer).to.deep.equal(data.serialized)
  })

  it('should create data for new type with zero int', function () {
    const CreateTypeProtobuf = new Type('CreateType').add(new Field('pub_key', 1, 'bytes'))
    CreateTypeProtobuf.add(new Field('name', 2, 'string'))
    CreateTypeProtobuf.add(new Field('balance', 3, 'int64'))
    root.define('CreateTypeProtobuf1').add(CreateTypeProtobuf)

    const CreateType = Exonum.newType(CreateTypeProtobuf)

    const data = {
      data: {
        pub_key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
        name: 'Smart wallet',
        balance: 0
      },
      serialized: Uint8Array.from([
        10, 48, 127, 159, 58, 225, 166, 250, 107, 150, 182, 215, 221, 58,
        235, 166, 248, 237, 206, 187, 233, 183, 31, 215, 150, 181, 127, 103, 244, 239, 189, 55, 115, 150, 220,
        105, 246, 249, 239, 143, 90, 107, 189, 249, 113, 239, 27, 237, 205, 250, 18, 12, 83, 109, 97, 114, 116,
        32, 119, 97, 108, 108, 101, 116
      ])
    }

    const buffer = CreateType.serialize(data.data)

    expect(buffer).to.deep.equal(data.serialized)
  })

  it('should create data for new transaction with zero int', function () {
    const keyPair = {
      publicKey: '84e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455',
      secretKey: '9aaa377f0880ae2aa6697ea45e6c26f164e923e73b31f52e6da0cf40798ca4c184e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455'
    }
    const CreateTransactionProtobuf1 = new Type('CreateType1').add(new Field('pub_key', 1, 'bytes'))
    CreateTransactionProtobuf1.add(new Field('name', 2, 'string'))
    CreateTransactionProtobuf1.add(new Field('balance', 3, 'int64'))
    root.define('CreateTransactionProtobuf1').add(CreateTransactionProtobuf1)

    const CreateTransaction = new Exonum.Transaction({
      serviceId: 130,
      methodId: 0,
      schema: CreateTransactionProtobuf1
    })

    const data = {
      pub_key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
      name: 'Smart wallet',
      balance: 0
    }

    const signed = CreateTransaction.create(data, keyPair)
    // Check that zero balance is not present in the serialization.
    const args = signed.payload.any_tx.arguments
    const argsEnd = args.slice(-'Smart wallet'.length)
    expect(argsEnd).to.deep.equal(Buffer.from('Smart wallet'))

    const restored = CreateTransaction.deserialize(signed.serialize())
    expect(+restored.payload.balance).to.equal(0)
    expect(restored.payload.name).to.equal('Smart wallet')
  })
})

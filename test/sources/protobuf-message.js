/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
import * as $protobuf from 'protobufjs/light'

const expect = require('chai').expect
const Exonum = require('../../src')
const Root = $protobuf.Root
const Type = $protobuf.Type
const Field = $protobuf.Field

let root = new Root()

describe('Protobuf serialization', function () {
  it('should serialize data for transaction', function () {
    const keyPair = {
      publicKey: '84e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455',
      secretKey: '9aaa377f0880ae2aa6697ea45e6c26f164e923e73b31f52e6da0cf40798ca4c184e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455'
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

    const data = {
      data: {
        'pub_key': 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
        'name': 'Smart wallet',
        'balance': 359120
      },
      serialized: [
        132, 224, 212, 174, 23, 206, 239, 212, 87, 218, 17, 135, 41, 83, 157, 18, 28, 159, 85, 134, 248, 35, 56, 216, 149,
        209, 116, 70, 82, 206, 68, 85, 0, 0, 130, 0, 0, 0, 10, 48, 127, 159, 58, 225, 166, 250, 107, 150, 182, 215, 221, 58,
        235, 166, 248, 237, 206, 187, 233, 183, 31, 215, 150, 181, 127, 103, 244, 239, 189, 55, 115, 150, 220,
        105, 246, 249, 239, 143, 90, 107, 189, 249, 113, 239, 27, 237, 205, 250, 18, 12, 83, 109, 97, 114, 116,
        32, 119, 97, 108, 108, 101, 116, 24, 208, 245, 21
      ]
    }

    const buffer = CreateTransaction.serialize(data.data)

    expect(buffer).to.deep.equal(data.serialized)
  })

  it('should serialize data for small transactions', function () {
    const keyPair = {
      publicKey: '84e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455',
      secretKey: '9aaa377f0880ae2aa6697ea45e6c26f164e923e73b31f52e6da0cf40798ca4c184e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455'
    }

    let SmallTransactionProtobuf = new Type('SmallTransaction')
    SmallTransactionProtobuf.add(new Field('name', 1, 'string'))
    root.define('SmallTransaction').add(SmallTransactionProtobuf)

    const SmallTransaction = Exonum.newTransaction({
      author: keyPair.publicKey,
      service_id: 128,
      message_id: 0,
      schema: SmallTransactionProtobuf
    })

    const data = {
      data: {
        'name': 'test'
      },
      serialized: [
        132, 224, 212, 174, 23, 206, 239, 212, 87, 218, 17, 135, 41, 83, 157, 18, 28, 159, 85, 134, 248, 35, 56, 216, 149,
        209, 116, 70, 82, 206, 68, 85, 0, 0, 130, 0, 0, 0, 10, 48, 127, 159, 58, 225, 166, 250, 107, 150, 182, 215, 221, 58,
        235, 166, 248, 237, 206, 187, 233, 183, 31, 215, 150, 181, 127, 103, 244, 239, 189, 55, 115, 150, 220,
        105, 246, 249, 239, 143, 90, 107, 189, 249, 113, 239, 27, 237, 205, 250, 18, 12, 83, 109, 97, 114, 116,
        32, 119, 97, 108, 108, 101, 116, 24, 208, 245, 21
      ]
    }

    const buffer = SmallTransaction.serialize(data.data)

    expect(buffer).to.deep.equal(data.serialized)
  })

  it('should serialize data for small type', function () {

    let SmallTypeProtobuf = new Type('SmallType')
    SmallTypeProtobuf.add(new Field('name', 1, 'string'))
    root.define('SmallType').add(SmallTypeProtobuf)

    const SmallType = Exonum.newType(SmallTypeProtobuf)

    const data = {
      data: {
        'name': 'test'
      },
      serialized: [10, 4, 116, 101, 115, 116]
    }

    const buffer = SmallType.serialize(data.data)

    expect(buffer).to.deep.equal(data.serialized)
  })

  it('should serialize data for precommit', function () {
    const keyPair = {
      publicKey: '84e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455',
      secretKey: '9aaa377f0880ae2aa6697ea45e6c26f164e923e73b31f52e6da0cf40798ca4c184e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455'
    }

    let CreatePrecommitProtobuf = new Type('CreatePrecommit').add(new Field('pub_key', 1, 'bytes'))
    CreatePrecommitProtobuf.add(new Field('name', 2, 'string'))
    CreatePrecommitProtobuf.add(new Field('balance', 3, 'int64'))
    root.define('CreatePrecommitProtobuf').add(CreatePrecommitProtobuf)

    const CreatePrecommit = Exonum.newPrecommit({
      author: keyPair.publicKey,
      service_id: 130,
      message_id: 0,
      schema: CreatePrecommitProtobuf
    })

    const data = {
      data: {
        'pub_key': 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
        'name': 'Smart wallet',
        'balance': 359120
      },
      serialized: [
        132, 224, 212, 174, 23, 206, 239, 212, 87, 218, 17, 135, 41, 83, 157, 18, 28, 159, 85, 134, 248, 35, 56, 216, 149,
        209, 116, 70, 82, 206, 68, 85, 1, 0, 10, 48, 127, 159, 58, 225, 166, 250, 107, 150, 182, 215, 221, 58,
        235, 166, 248, 237, 206, 187, 233, 183, 31, 215, 150, 181, 127, 103, 244, 239, 189, 55, 115, 150, 220,
        105, 246, 249, 239, 143, 90, 107, 189, 249, 113, 239, 27, 237, 205, 250, 18, 12, 83, 109, 97, 114, 116,
        32, 119, 97, 108, 108, 101, 116, 24, 208, 245, 21
      ]
    }

    const buffer = CreatePrecommit.serialize(data.data)

    expect(buffer).to.deep.equal(data.serialized)
  })

  it('should serialize data for new type', function () {
    let CreateTypeProtobuf = new Type('CreateType').add(new Field('pub_key', 1, 'bytes'))
    CreateTypeProtobuf.add(new Field('name', 2, 'string'))
    CreateTypeProtobuf.add(new Field('balance', 3, 'int64'))
    root.define('CreateTypeProtobuf').add(CreateTypeProtobuf)

    const CreateType = Exonum.newType(CreateTypeProtobuf)

    const data = {
      data: {
        'pub_key': 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
        'name': 'Smart wallet',
        'balance': 359120
      },
      serialized: [
        10, 48, 127, 159, 58, 225, 166, 250, 107, 150, 182, 215, 221, 58,
        235, 166, 248, 237, 206, 187, 233, 183, 31, 215, 150, 181, 127, 103, 244, 239, 189, 55, 115, 150, 220,
        105, 246, 249, 239, 143, 90, 107, 189, 249, 113, 239, 27, 237, 205, 250, 18, 12, 83, 109, 97, 114, 116,
        32, 119, 97, 108, 108, 101, 116, 24, 208, 245, 21
      ]
    }

    const buffer = CreateType.serialize(data.data)

    expect(buffer).to.deep.equal(data.serialized)
  })

  it('should serialize data for new type with zero int', function () {
    let CreateTypeProtobuf = new Type('CreateType').add(new Field('pub_key', 1, 'bytes'))
    CreateTypeProtobuf.add(new Field('name', 2, 'string'))
    CreateTypeProtobuf.add(new Field('balance', 3, 'int64'))
    root.define('CreateTypeProtobuf1').add(CreateTypeProtobuf)

    const CreateType = Exonum.newType(CreateTypeProtobuf)

    const data = {
      data: {
        'pub_key': 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
        'name': 'Smart wallet',
        'balance': 0
      },
      serialized: [
        10, 48, 127, 159, 58, 225, 166, 250, 107, 150, 182, 215, 221, 58,
        235, 166, 248, 237, 206, 187, 233, 183, 31, 215, 150, 181, 127, 103, 244, 239, 189, 55, 115, 150, 220,
        105, 246, 249, 239, 143, 90, 107, 189, 249, 113, 239, 27, 237, 205, 250, 18, 12, 83, 109, 97, 114, 116,
        32, 119, 97, 108, 108, 101, 116, 24, 0
      ]
    }

    const buffer = CreateType.serialize(data.data)

    expect(buffer).to.deep.equal(data.serialized)
  })

  it('should serialize data for new transaction with zero int', function () {
    const keyPair = {
      publicKey: '84e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455',
      secretKey: '9aaa377f0880ae2aa6697ea45e6c26f164e923e73b31f52e6da0cf40798ca4c184e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455'
    }
    let CreateTransactionProtobuf1 = new Type('CreateType1').add(new Field('pub_key', 1, 'bytes'))
    CreateTransactionProtobuf1.add(new Field('name', 2, 'string'))
    CreateTransactionProtobuf1.add(new Field('balance', 3, 'int64'))
    root.define('CreateTransactionProtobuf1').add(CreateTransactionProtobuf1)

    const CreateTransaction = Exonum.newTransaction({
      author: keyPair.publicKey,
      service_id: 130,
      message_id: 0,
      schema: CreateTransactionProtobuf1
    })

    const data = {
      data: {
        'pub_key': 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
        'name': 'Smart wallet',
        'balance': 0
      },
      serialized: [
        132, 224, 212, 174, 23, 206, 239, 212, 87, 218, 17, 135, 41, 83, 157, 18, 28, 159, 85, 134, 248, 35, 56, 216, 149, 209, 116, 70, 82, 206, 68, 85, 0, 0, 130, 0, 0, 0, 10, 48, 127, 159, 58, 225, 166, 250, 107, 150, 182, 215, 221, 58, 235, 166, 248, 237, 206, 187, 233, 183, 31, 215, 150, 181, 127, 103, 244, 239, 189, 55, 115, 150, 220, 105, 246, 249, 239, 143, 90, 107, 189, 249, 113, 239, 27, 237, 205, 250, 18, 12, 83, 109, 97, 114, 116, 32, 119, 97, 108, 108, 101, 116, 24, 0
      ]
    }

    const buffer = CreateTransaction.serialize(data.data)
    expect(buffer).to.deep.equal(data.serialized)
  })
})

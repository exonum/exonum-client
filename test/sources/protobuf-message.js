/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const Exonum = require('../../src')

let messages = require('../stubs/test_data_pb.js')

describe('Protobuf serialization', function () {
  it('should serialize data for transaction', function () {
    const keyPair = {
      publicKey: '84e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455',
      secretKey: '9aaa377f0880ae2aa6697ea45e6c26f164e923e73b31f52e6da0cf40798ca4c184e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455'
    }
    const data = {
      data: {
        'name': 'my name',
        'balance': 359120
      },
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

    const buffer = CreateTransaction.serialize()

    expect(buffer).to.deep.equal(data.serialized)
  })

  it('should serialize data for precommit', function () {
    const keyPair = {
      publicKey: '84e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455',
      secretKey: '9aaa377f0880ae2aa6697ea45e6c26f164e923e73b31f52e6da0cf40798ca4c184e0d4ae17ceefd457da118729539d121c9f5586f82338d895d1744652ce4455'
    }

    const data = {
      data: {
        'name': 'Smart wallet',
        'balance': 359120
      },
      serialized: [
        132, 224, 212, 174, 23, 206, 239, 212, 87, 218, 17, 135, 41, 83, 157, 18, 28, 159, 85, 134, 248, 35, 56, 216, 149, 209, 116, 70, 82, 206, 68, 85, 1, 0, 18, 12, 83, 109, 97, 114, 116, 32, 119, 97, 108, 108, 101, 116, 24, 208, 245, 21
      ]
    }

    let message = new messages.Type1Protobuf()
    message.setName(data.data.name)
    message.setBalance(data.data.balance)

    const CreatePrecommit = Exonum.newPrecommit({
      author: keyPair.publicKey,
      service_id: 130,
      message_id: 0,
      schema: message
    })

    const buffer = CreatePrecommit.serialize()

    expect(buffer).to.deep.equal(data.serialized)
  })

  it('should serialize data for new type', function () {
    const data = {
      data: {
        'name': 'Smart wallet',
        'balance': 359120
      },
      serialized: [
        18, 12, 83, 109, 97, 114, 116, 32, 119, 97, 108, 108, 101, 116, 24, 208, 245, 21
      ]
    }
    let message = new messages.Type1Protobuf()
    message.setName(data.data.name)
    message.setBalance(data.data.balance)
    const CreateType = Exonum.newType(message)

    const buffer = CreateType.serialize()

    expect(buffer).to.deep.equal(data.serialized)
  })
})

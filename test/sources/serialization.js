/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const DataSchema = require('./data_schema/dataSchema').default
const serializationMock = require('./common_data/serialization/serialization.json')
const serialization = require('./common_data/serialization/serialization-config.json')
const schema = new DataSchema(serialization)

describe('Serialize data into array of 8-bit integers', function () {
  it('should serialize data of newType type and return array of 8-bit integers', function () {
    const buffer = schema.getType('wallet').serialize(serializationMock.wallet.data)

    expect(buffer).to.deep.equal(serializationMock.wallet.serialized)
  })

  it('should serialize data of newMessage type and return array of 8-bit integers', function () {
    const buffer = schema.getMessage('userMessage').serialize(serializationMock.user.data.content)

    expect(buffer).to.deep.equal(serializationMock.user.serialized)
  })

  it('should serialize data of newPrecommit type and return array of 8-bit integers', function () {
    console.log(schema.getMessage('precommit'), serializationMock.precommit.data)
    const buffer = schema.getMessage('precommit').serialize(serializationMock.precommit.data)
    // const buffer2 = schema.getMessage('precommit').sign(serializationMock.precommit2.data)
    // console.log('buffer2', buffer2)
    expect(buffer).to.deep.equal(serializationMock.precommit.serialized)
  })

  it('should serialize data of newMessage type with nester array and return array of 8-bit integers', function () {
    console.log('addUserArray')
    const buffer = schema.getMessage('addUserArray').serialize(serializationMock.userArray.data)

    expect(buffer).to.deep.equal(serializationMock.userArray.serialized)
  })

  it('should serialize data of simple array and return array of 8-bit integers', function () {
    const buffer = schema.getType('addSimpleArray').serialize(serializationMock.simpleArray2.data)

    expect(buffer).to.deep.equal(serializationMock.simpleArray2.serialized)
  })

  it('should serialize data of complicated non-fixed newType type and return array of 8-bit integers', function () {
    const buffer = schema.getType('transaction').serialize(serializationMock.transactionData.data)

    expect(buffer).to.deep.equal(serializationMock.transactionData.serialized)
  })

  it('should serialize data of complicated non-fixed newType type and return array of 8-bit integers', function () {
    const buffer = schema.getType('transaction2').serialize(serializationMock.transactionData2.data)

    expect(buffer).to.deep.equal(serializationMock.transactionData2.serialized)
  })

  it('should serialize data of complicated fixed newType type and return array of 8-bit integers', function () {
    const buffer = schema.getType('transaction3').serialize(serializationMock.transactionData3.data)

    expect(buffer).to.deep.equal(serializationMock.transactionData3.serialized)
  })

  it('should throw error when some data parameters are missed', function () {
    const walletData = { fake: 123 }

    expect(() => schema.getType('wallet4').serialize(walletData)).to.throw(TypeError)
  })
})

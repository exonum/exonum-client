/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const Exonum = require('../src')
const DataSchema = require('./data_schema/dataSchema').default
const serializationScheme = require('./common_data/serialization/serialization-types.json')
const scheme = new DataSchema(serializationScheme)

const serializationMock = require('./common_data/serialization/serialization.json')

describe('Serialize data into array of 8-bit integers', function () {
  it('should serialize data of newType type and return array of 8-bit integers', function () {
    const buffer = scheme.getType('wallet').serialize(serializationMock.wallet.data)

    expect(buffer).to.deep.equal(serializationMock.wallet.serialized)
  })

  it('should serialize data of newMessage type and return array of 8-bit integers', function () {
    const buffer = scheme.getMessage('addUser').serialize(serializationMock.user.data)

    expect(buffer).to.deep.equal(serializationMock.user.serialized)
  })

  it('should serialize data of newMessage type with nester array and return array of 8-bit integers', function () {
    const buffer = scheme.getMessage('addUserArray').serialize(serializationMock.userArray.data)

    expect(buffer).to.deep.equal(serializationMock.userArray.serialized)
  })

  it('should serialize data of complicated non-fixed newType type and return array of 8-bit integers', function () {
    const buffer = scheme.getType('transaction').serialize(serializationMock.transactionData.data)

    expect(buffer).to.deep.equal(serializationMock.transactionData.serialized)
  })

  it('should serialize data of complicated non-fixed newType type and return array of 8-bit integers', function () {
    const buffer = scheme.getType('transaction2').serialize(serializationMock.transactionData2.data)

    expect(buffer).to.deep.equal(serializationMock.transactionData2.serialized)
  })

  it('should serialize data of complicated fixed newType type and return array of 8-bit integers', function () {
    const buffer = scheme.getType('transaction3').serialize(serializationMock.transactionData3.data)

    expect(buffer).to.deep.equal(serializationMock.transactionData3.serialized)
  })

  it('should serialize data (with inherited properties that should be ignored) of newType type and return array of 8-bit integers', function () {
    function Data () {
      this.pub_key = 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'
      this.name = 'Smart wallet'
      this.balance = 359120
      this.history_hash = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030'
      return this
    }

    function DataAncestor () {
      return this
    }

    DataAncestor.prototype.someMethod = function () {
      return this
    }

    Data.prototype = Object.create(DataAncestor.prototype)

    const walletData = new Data()

    const buffer = scheme.getType('wallet3').serialize(walletData)

    expect(buffer).to.deep.equal([245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54, 80, 0, 0, 0, 12, 0, 0, 0, 208, 122, 5, 0, 0, 0, 0, 0, 103, 82, 190, 136, 35, 20, 245, 187, 188, 154, 106, 242, 174, 99, 79, 192, 112, 56, 88, 74, 74, 119, 81, 14, 165, 236, 237, 69, 245, 77, 192, 48, 83, 109, 97, 114, 116, 32, 119, 97, 108, 108, 101, 116])
  })

  it('should throw error when some data parameters are missed', function () {
    const walletData = { fake: 123 }

    expect(() => scheme.getType('wallet4').serialize(walletData)).to.throw(TypeError)
  })
})

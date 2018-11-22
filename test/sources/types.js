/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

let messages = require('../stubs/test_data_pb.js')

const expect = require('chai').expect
const Exonum = require('../../src')

describe('Check built-in types', function () {
  describe('Process Bytes', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid for bytes', function () {
      const data = {
        data: {
          'name': 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
          'type': 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'
        },
        serialized: [
          10, 48, 127, 159, 58, 225, 166, 250, 107, 150, 182, 215, 221, 58,
          235, 166, 248, 237, 206, 187, 233, 183, 31, 215, 150, 181, 127, 103, 244, 239, 189, 55, 115, 150, 220,
          105, 246, 249, 239, 143, 90, 107, 189, 249, 113, 239, 27, 237, 205, 250, 18, 64, 102, 53, 56, 54, 52, 97,
          98, 54, 97, 53, 97, 50, 49, 57, 48, 54, 54, 54, 98, 52, 55, 99, 54, 55, 54, 98, 99, 102, 49, 53, 97, 49, 102,
          50, 102, 48, 55, 55, 48, 51, 99, 53, 98, 99, 97, 102, 98, 53, 55, 52, 57, 97, 97, 55, 51, 53, 99, 101, 56, 98,
          55, 99, 51, 54
        ]
      }

      let message = new messages.Type2Protobuf()
      message.setName(data.data.name)
      message.setType(data.data.type)
      const Type1 = Exonum.newType(message)

      const buffer = Type1.serialize()
      expect(buffer).to.deep.equal(data.serialized)
    })

    it('should throw error when the value is invalid string', function () {
      const data = {
        data: {
          'name': 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
          'type': 1
        },
        serialized: [
          10, 48, 127, 159, 58, 225, 166, 250, 107, 150, 182, 215, 221, 58, 235, 166, 248, 237, 206, 187, 233, 183, 31, 215, 150, 181, 127, 103, 244, 239, 189, 55, 115, 150, 220, 105, 246, 249, 239, 143, 90, 107, 189, 249, 113, 239, 27, 237, 205, 250
        ]
      }
      let message = new messages.Type2Protobuf()
      message.setName(data.data.name)
      message.setType(data.data.type)
      const Type2 = Exonum.newType(message)
      const buffer = Type2.serialize()
      expect(buffer).to.deep.equal(data.serialized)
    })
  })

  describe('Process int', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid for int 64', function () {
      const data = {
        data: {
          'amount': 1
        },
        serialized: [8, 1]
      }
      let message = new messages.TypeIntProtobuf()
      message.setAmount(data.data.amount)
      const IntType1 = Exonum.newType(message)
      const buffer = IntType1.serialize()
      expect(buffer).to.deep.equal(data.serialized)
    })

    it('should serialize data and return empty array when the value is valid for int 64 but equal 0', function () {
      const data = {
        data: {
          'amount': 0
        },
        serialized: []
      }
      let message = new messages.TypeIntProtobuf()
      message.setAmount(data.data.amount)
      const IntType2 = Exonum.newType(message)
      const buffer = IntType2.serialize()
      expect(buffer).to.deep.equal(data.serialized)
    })

    it('should serialize data and return array of 8-bit integers when the value is valid for int 32 in string', function () {
      const data = {
        data: {
          'amount': '34506'
        },
        serialized: [8, 202, 141, 2]
      }
      let message = new messages.TypeIntProtobuf()
      message.setAmount(data.data.amount)
      const IntType1 = Exonum.newType(message)
      const buffer = IntType1.serialize()
      expect(buffer).to.deep.equal(data.serialized)
    })
  })
})

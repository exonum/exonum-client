/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
import * as Protobuf from 'protobufjs/light'

const Root = Protobuf.Root
const Type = Protobuf.Type
const Field = Protobuf.Field

let root = new Root()

const expect = require('chai').expect
const Exonum = require('../../src')

describe('Check built-in types', function () {
  describe('Process Bytes', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid for bytes', function () {
      let Type1Protobuf = new Type('Type1').add(new Field('name', 1, 'bytes'))
      Type1Protobuf.add(new Field('type', 2, 'string'))
      root.define('Type1Protobuf').add(Type1Protobuf)
      const Type1 = Exonum.newType(Type1Protobuf)
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
      const buffer = Type1.serialize(data.data)
      expect(buffer).to.deep.equal(data.serialized)
    })

    it('should throw error when the value is invalid string', function () {
      let Type2Protobuf = new Type('Type2').add(new Field('name', 1, 'bytes'))
      Type2Protobuf.add(new Field('type', 2, 'string'))
      root.define('Type2Protobuf').add(Type2Protobuf)
      const Type2 = Exonum.newType(Type2Protobuf)
      const data = {
        data: {
          'name': 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
          'type': 1
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
      expect(() => Type2.serialize(data.data))
        .to.throw(TypeError, '"string" must be a string, Buffer, or ArrayBuffer')
    })
  })

  describe('Process int', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid for int 32', function () {
      let IntType1Protobuf = new Type('IntType1').add(new Field('amount', 1, 'int32'))
      root.define('IntType1Protobuf').add(IntType1Protobuf)
      const IntType1 = Exonum.newType(IntType1Protobuf)
      const data = {
        data: {
          'amount': 1
        },
        serialized: [ 8, 1 ]
      }
      const buffer = IntType1.serialize(data.data)
      expect(buffer).to.deep.equal(data.serialized)
    })

    it('should serialize data and return array of 8-bit integers when the value is valid for int 32 in string', function () {
      let IntType2Protobuf = new Type('IntType2').add(new Field('amount', 1, 'int32'))
      root.define('IntType2Protobuf').add(IntType2Protobuf)
      const IntType2 = Exonum.newType(IntType2Protobuf)
      const data = {
        data: {
          'amount': '34506'
        },
        serialized: [ 8, 202, 141, 2 ]
      }
      expect(IntType2.serialize(data.data)).to.deep.equal(data.serialized)
    })

    it('should serialize data and return array of 8-bit integers when the value is valid for negative  int 32', function () {
      let IntType3Protobuf = new Type('IntType3').add(new Field('amount', 1, 'int32'))
      root.define('IntType3Protobuf').add(IntType3Protobuf)
      const IntType3 = Exonum.newType(IntType3Protobuf)
      const data = {
        data: {
          'amount': -1
        },
        serialized: [ 8, 255, 255, 255, 255, 255, 255, 255, 255, 255, 1 ]
      }
      expect(IntType3.serialize(data.data)).to.deep.equal(data.serialized)
    })

    it('should serialize data and return array of 8-bit integers with lenght and 0 when the value not found', function () {
      let IntType4Protobuf = new Type('IntType4').add(new Field('amount', 1, 'int32'))
      root.define('IntType4Protobuf').add(IntType4Protobuf)
      const IntType4 = Exonum.newType(IntType4Protobuf)
      const data = {
        data: {
          'amount': 'dsad'
        },
        serialized: [ 8, 0 ]
      }
      expect(IntType4.serialize(data.data)).to.deep.equal(data.serialized)
    })
  })
})

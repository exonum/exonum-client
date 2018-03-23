/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const Exonum = require('../src')
const DataSchema = require('./data_schema/dataSchema').default
const typesMock = require('./common_data/serialization/types.json')
const invalidTypesMock = require('./common_data/serialization/types-invalid.json')
const types = require('./common_data/serialization/types-config.json')
const scheme = new DataSchema(types)

describe('Check built-in types', function () {
  describe('Process Hash', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid hexadecimal string', function () {
      const buffer = scheme.getType('type1').serialize(typesMock.type1.data)
      expect(buffer).to.deep.equal(typesMock.type1.serialized)
    })

    it('should throw error when the name prop is missed', function () {
      expect(() => Exonum.newType({
        fields: [
          { type: Exonum.Hash }
        ]
      }))
        .to.throw(Error, 'Name prop is missed.')
    })

    it('should throw error when the type prop is missed', function () {
      expect(() => Exonum.newType({
        fields: [
          { name: 'hash' }
        ]
      }))
        .to.throw(Error, 'Type prop is missed.')
    })

    it('should throw error when the value is invalid string', function () {
      expect(() => scheme.getType('type1').serialize(invalidTypesMock.type1.data))
        .to.throw(TypeError, 'Hash of wrong type is passed: f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3z')
    })

    it('should throw error when the value is too long string', function () {
      expect(() => scheme.getType('type1').serialize(invalidTypesMock['type1-1'].data))
        .to.throw(TypeError, 'Hash of wrong type is passed: f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365')
    })

    it('should throw error when the value is too short string', function () {
      expect(() => scheme.getType('type1').serialize(invalidTypesMock['type1-2'].data))
        .to.throw(TypeError, 'Hash of wrong type is passed: f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3')
    })

    it('should throw error when the value of invalid type', function () {
      expect(() => scheme.getType('type1').serialize({ hash: undefined }))
        .to.throw(TypeError, 'Field hash is not defined.');

      [true, null, 57, [], {}, new Date()].forEach(function (hash) {
        expect(() => scheme.getType('type1').serialize({ hash: hash }))
          .to.throw(TypeError, /Hash of wrong type is passed:/)
      })
    })
  })

  describe('Process PublicKey', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid string', function () {
      const buffer = scheme.getType('type2').serialize(typesMock.type2.data)

      expect(buffer).to.deep.equal(typesMock.type2.serialized)
    })

    it('should throw error when the value is invalid string', function () {
      expect(() => scheme.getType('type2').serialize(invalidTypesMock.type2.data))
        .to.throw(TypeError, 'PublicKey of wrong type is passed: f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3z')
    })

    it('should throw error when the value is too long string', function () {
      expect(() => scheme.getType('type2').serialize(invalidTypesMock['type2-1'].data))
        .to.throw(TypeError, 'PublicKey of wrong type is passed: f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365')
    })

    it('should throw error when the value is too short string', function () {
      expect(() => scheme.getType('type2').serialize(invalidTypesMock['type2-2'].data))
        .to.throw(TypeError, 'PublicKey of wrong type is passed: f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3')
    })

    it('should throw error when the value of invalid type', function () {
      expect(() => scheme.getType('type2').serialize({ key: undefined }))
        .to.throw(TypeError, 'Field key is not defined.');

      [true, null, 57, [], {}, new Date()].forEach(function (key) {
        expect(() => scheme.getType('type2').serialize({ key: key }))
          .to.throw(TypeError, /PublicKey of wrong type is passed:/)
      })
    })
  })

  describe('Process Digest', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid string', function () {
      const buffer = scheme.getType('type3').serialize(typesMock.type3.data)
      expect(buffer).to.deep.equal(typesMock.type3.serialized)
    })

    it('should throw error when the value is invalid string', function () {
      expect(() => scheme.getType('type3').serialize(invalidTypesMock.type3.data))
        .to.throw(TypeError, 'Digest of wrong type is passed: f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3zf5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3z')
    })

    it('should throw error when the value is too long string', function () {
      expect(() => scheme.getType('type3').serialize(invalidTypesMock['type3-1'].data))
        .to.throw(TypeError, 'Digest of wrong type is passed: f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365')
    })

    it('should throw error when the value is too short string', function () {
      expect(() => scheme.getType('type3').serialize(invalidTypesMock['type3-2'].data))
        .to.throw(TypeError, 'Digest of wrong type is passed: f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3')
    })

    it('should throw error when the value of invalid type', function () {
      expect(() => scheme.getType('type3').serialize({ key: undefined }))
        .to.throw(TypeError, 'Field key is not defined.');

      [true, null, 57, [], {}, new Date()].forEach(function (key) {
        expect(() => scheme.getType('type3').serialize({ key: key }))
          .to.throw(TypeError, /Digest of wrong type is passed: /)
      })
    })
  })

  describe('Process Timespec', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid timestamp in nanoseconds passed as positive number', function () {
      const buffer = scheme.getType('type4').serialize(typesMock.type4.data)
      expect(buffer).to.deep.equal(typesMock.type4.serialized)
    })

    it('should serialize data and return array of 8-bit integers when the value is valid timestamp in nanoseconds passed as string', function () {
      const Type = Exonum.newType({
        fields: [
          { name: 'since', type: Exonum.Timespec }
        ]
      })
      const data = { since: '18446744073709551615' }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([255, 255, 255, 255, 255, 255, 255, 255])
    })

    it('should throw error when the value is negative number', function () {
      expect(() => scheme.getType('type4').serialize(invalidTypesMock.type4.data))
        .to.throw(TypeError, 'Timespec of wrong type is passed: -1483979894237')
    })

    it('should throw error when the value is out of range', function () {
      expect(() => scheme.getType('type4').serialize(invalidTypesMock['type4-1'].data))
        .to.throw(TypeError, 'Timespec of wrong type is passed: 18446744073709551616')
    })

    it('should throw error when the value of invalid type', function () {
      expect(() => scheme.getType('type4').serialize({ since: undefined }))
        .to.throw(TypeError, 'Field since is not defined.');

      [true, null, [], {}, new Date()].forEach(function (since) {
        expect(() => scheme.getType('type4').serialize({ since: since }))
          .to.throw(TypeError, /Timespec of wrong type is passed: /)
      })
    })
  })

  describe('Process Bool', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid positive boolean', function () {
      const buffer = scheme.getType('type5').serialize(typesMock.type5.data)

      expect(buffer).to.deep.equal(typesMock.type5.serialized)
    })

    it('should serialize data and return array of 8-bit integers when the value is valid negative boolean', function () {
      const Type = Exonum.newType({
        fields: [
          { name: 'active', type: Exonum.Bool }
        ]
      })
      const data = { active: false }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([0])
    })

    it('should throw error when the value of invalid type', function () {
      expect(() => scheme.getType('type5').serialize({ active: undefined }))
        .to.throw(TypeError, 'Field active is not defined.');

      ['Hello world', null, 57, [], {}, new Date()].forEach(function (active) {
        expect(() => scheme.getType('type5').serialize({ active: active }))
          .to.throw(TypeError, 'Wrong data type is passed as Boolean. Boolean is required')
      })
    })
  })

  describe('Process String', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid string', function () {
      const buffer = scheme.getType('type6').serialize(typesMock.type6.data)
      expect(buffer).to.deep.equal(typesMock.type6.serialized)
    })

    it('should throw error when the value of invalid type', function () {
      expect(() => scheme.getType('type6').serialize({ text: undefined }))
        .to.throw(TypeError, 'Field text is not defined.');

      [true, null, 57, [], {}, new Date()].forEach(function (text) {
        expect(() => scheme.getType('type6').serialize({ text: text }))
          .to.throw(TypeError, 'Wrong data type is passed as String. String is required')
      })
    })
  })

  describe('Process Int8', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid positive number', function () {
      const buffer = scheme.getType('type7').serialize(typesMock.type7.data)

      expect(buffer).to.deep.equal(typesMock.type7.serialized)
    })

    it('should serialize data and return array of 8-bit integers when the value is valid negative number', function () {
      const Type = Exonum.newType({
        fields: [
          { name: 'balance', type: Exonum.Int8 }
        ]
      })
      const data = { balance: -120 }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([136])
    })

    it('should throw error when the value is too big positive number', function () {
      expect(() => scheme.getType('type7').serialize(invalidTypesMock.type7.data))
        .to.throw(TypeError, 'Int8 of wrong type is passed: 130')
    })

    it('should throw error when the value is too big negative number', function () {
      expect(() => scheme.getType('type7').serialize(invalidTypesMock['type7-1'].data))
        .to.throw(TypeError, 'Int8 of wrong type is passed: -130')
    })

    it('should throw error when the value of invalid type', function () {
      expect(() => scheme.getType('type7').serialize({ balance: undefined }))
        .to.throw(TypeError, 'Field balance is not defined.');

      [true, null, [], {}, new Date()].forEach(function (balance) {
        expect(() => scheme.getType('type7').serialize({ balance: balance }))
          .to.throw(TypeError, /Int8 of wrong type is passed:/)
      })
    })
  })

  describe('Process Int16', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid positive number', function () {
      const buffer = scheme.getType('type8').serialize(typesMock.type8.data)
      expect(buffer).to.deep.equal(typesMock.type8.serialized)
    })

    it('should serialize data and return array of 8-bit integers when the value is valid negative number', function () {
      const data = { balance: -30767 }
      const buffer = scheme.getType('type8').serialize(data)

      expect(buffer).to.deep.equal([209, 135])
    })

    it('should throw error when the value is too big positive number', function () {
      expect(() => scheme.getType('type8').serialize(invalidTypesMock.type8.data))
        .to.throw(TypeError, 'Int16 of wrong type is passed: 32769')
    })

    it('should throw error when the value is too big negative number', function () {
      expect(() => scheme.getType('type8').serialize(invalidTypesMock['type8-1'].data))
        .to.throw(TypeError, 'Int16 of wrong type is passed: -32770')
    })

    it('should throw error when the value of invalid type', function () {
      expect(() => scheme.getType('type8').serialize({ balance: undefined }))
        .to.throw(TypeError, 'Field balance is not defined.');

      [true, null, [], {}, new Date()].forEach(function (balance) {
        expect(() => scheme.getType('type8').serialize({ balance: balance }))
          .to.throw(TypeError, /Int16 of wrong type is passed:/)
      })
    })
  })

  describe('Process Int32', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid positive number', function () {
      const buffer = scheme.getType('type9').serialize(typesMock.type9.data)

      expect(buffer).to.deep.equal(typesMock.type9.serialized)
    })

    it('should serialize data and return array of 8-bit integers when the value is valid negative number', function () {
      const data = { balance: -1147483648 }
      const buffer = scheme.getType('type9').serialize(data)

      expect(buffer).to.deep.equal([0, 202, 154, 187])
    })

    it('should throw error when the value is too big positive number', function () {
      expect(() => scheme.getType('type9').serialize(invalidTypesMock.type9.data))
        .to.throw(TypeError, 'Int32 of wrong type is passed: 2147483649')
    })

    it('should throw error when the value is too big negative number', function () {
      expect(() => scheme.getType('type9').serialize(invalidTypesMock['type9-1'].data))
        .to.throw(TypeError, 'Int32 of wrong type is passed: -2147483650')
    })

    it('should throw error when the value of invalid type', function () {
      expect(() => scheme.getType('type9').serialize({ balance: undefined }))
        .to.throw(TypeError, 'Field balance is not defined.');

      [true, null, [], {}, new Date()].forEach(function (balance) {
        expect(() => scheme.getType('type9').serialize({ balance: balance }))
          .to.throw(TypeError, /Int32 of wrong type is passed:/)
      })
    })
  })

  describe('Process Int64', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid positive number', function () {
      const buffer = scheme.getType('type10').serialize(typesMock.type10.data)
      expect(buffer).to.deep.equal(typesMock.type10.serialized)
    })

    it('should serialize data and return array of 8-bit integers when the value is valid positive number as string', function () {
      const data = { balance: '9223372036854775807' }
      const buffer = scheme.getType('type10').serialize(data)

      expect(buffer).to.deep.equal([255, 255, 255, 255, 255, 255, 255, 127])
    })

    it('should serialize data and return array of 8-bit integers when the value is valid negative number', function () {
      const data = { balance: -90071992547 }
      const buffer = scheme.getType('type10').serialize(data)

      expect(buffer).to.deep.equal([29, 119, 74, 7, 235, 255, 255, 255])
    })

    it('should serialize data and return array of 8-bit integers when the value is valid negative number as string', function () {
      const Type = Exonum.newType({
        fields: [
          { name: 'balance', type: Exonum.Int64 }
        ]
      })
      const data = { balance: '-9223372036854775808' }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 128])
    })

    it('should throw error when the value is too big positive number', function () {
      expect(() => scheme.getType('type10').serialize(invalidTypesMock.type10.data))
        .to.throw(TypeError, 'Int64 of wrong type is passed: 9223372036854775808')
    })

    it('should throw error when the value is too big negative number', function () {
      expect(() => scheme.getType('type10').serialize(invalidTypesMock['type10-1'].data))
        .to.throw(TypeError, 'Int64 of wrong type is passed: -9223372036854775809')
    })

    it('should throw error when the value of invalid type', function () {
      expect(() => scheme.getType('type10').serialize({ balance: undefined }))
        .to.throw(TypeError, 'Field balance is not defined.');

      [true, null, [], {}, new Date()].forEach(function (balance) {
        expect(() => scheme.getType('type10').serialize({ balance: balance }))
          .to.throw(TypeError, /Int64 of wrong type is passed:/)
      })
    })
  })

  describe('Process Uint8', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid positive number', function () {
      const buffer = scheme.getType('type11').serialize(typesMock.type11.data)
      expect(buffer).to.deep.equal(typesMock.type11.serialized)
    })

    it('should throw error when the value is negative number', function () {
      expect(() => scheme.getType('type11').serialize(invalidTypesMock.type11.data))
        .to.throw(TypeError, 'Uint8 of wrong type is passed: -1')
    })

    it('should throw error when the value is out of range', function () {
      expect(() => scheme.getType('type11').serialize(invalidTypesMock['type11-1'].data))
        .to.throw(TypeError, 'Uint8 of wrong type is passed: 256')
    })

    it('should throw error when the value of invalid type', function () {
      expect(() => scheme.getType('type11').serialize({ balance: undefined }))
        .to.throw(TypeError, 'Field balance is not defined.');

      [true, null, [], {}, new Date()].forEach(function (balance) {
        expect(() => scheme.getType('type11').serialize({ balance: balance }))
          .to.throw(TypeError, /Uint8 of wrong type is passed:/)
      })
    })
  })

  describe('Process Uint16', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid positive number', function () {
      const buffer = scheme.getType('type12').serialize(typesMock.type12.data)
      expect(buffer).to.deep.equal(typesMock.type12.serialized)
    })

    it('should throw error when the value is negative number', function () {
      expect(() => scheme.getType('type12').serialize(invalidTypesMock.type12.data))
        .to.throw(TypeError, 'Uint16 of wrong type is passed: -1')
    })

    it('should throw error when the value is out of range', function () {
      expect(() => scheme.getType('type12').serialize(invalidTypesMock['type12-1'].data))
        .to.throw(TypeError, 'Uint16 of wrong type is passed: 65536')
    })

    it('should throw error when the value of invalid type', function () {
      expect(() => scheme.getType('type12').serialize({ balance: undefined }))
        .to.throw(TypeError, 'Field balance is not defined.');

      [true, null, [], {}, new Date()].forEach(function (balance) {
        expect(() => scheme.getType('type12').serialize({ balance: balance }))
          .to.throw(TypeError, /Uint16 of wrong type is passed:/)
      })
    })
  })

  describe('Process Uint32', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid positive number', function () {
      const buffer = scheme.getType('type13').serialize(typesMock.type13.data)
      expect(buffer).to.deep.equal(typesMock.type13.serialized)
    })

    it('should throw error when the value is negative number', function () {
      expect(() => scheme.getType('type13').serialize(invalidTypesMock.type13.data))
        .to.throw(TypeError, 'Uint32 of wrong type is passed: -1')
    })

    it('should throw error when the value is out of range', function () {
      expect(() => scheme.getType('type13').serialize(invalidTypesMock['type13-1'].data))
        .to.throw(TypeError, 'Uint32 of wrong type is passed: 4294967296')
    })

    it('should throw error when the value of invalid type', function () {
      expect(() => scheme.getType('type13').serialize({ balance: undefined }))
        .to.throw(TypeError, 'Field balance is not defined.');

      [true, null, [], {}, new Date()].forEach(function (balance) {
        expect(() => scheme.getType('type13').serialize({ balance: balance }))
          .to.throw(TypeError, /Uint32 of wrong type is passed:/)
      })
    })
  })

  describe('Process Uint64', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid positive number', function () {
      const buffer = scheme.getType('type14').serialize(typesMock.type14.data)
      expect(buffer).to.deep.equal(typesMock.type14.serialized)
    })

    it('should serialize data and return array of 8-bit integers when the value is valid positive number passed as string', function () {
      const Type = Exonum.newType({
        fields: [
          { name: 'balance', type: Exonum.Uint64 }
        ]
      })
      const data = { balance: '9007199254740993' }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([1, 0, 0, 0, 0, 0, 32, 0])
    })

    it('should throw error when the value is negative number', function () {
      expect(() => scheme.getType('type14').serialize(invalidTypesMock.type14.data))
        .to.throw(TypeError, 'Uint64 of wrong type is passed: -613228')
    })

    it('should throw error when the value is out of range', function () {
      expect(() => scheme.getType('type14').serialize(invalidTypesMock['type14-1'].data))
        .to.throw(TypeError, 'Uint64 of wrong type is passed: 18446744073709551616')
    })

    it('should throw error when the value of invalid type', function () {
      expect(() => scheme.getType('type14').serialize({ balance: undefined }))
        .to.throw(TypeError, 'Field balance is not defined.');

      [true, null, [], {}, new Date()].forEach(function (balance) {
        expect(() => scheme.getType('type14').serialize({ balance: balance }))
          .to.throw(TypeError, /Uint64 of wrong type is passed:/)
      })
    })
  })

  describe('Process Float32', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid positive number', function () {
      const buffer = scheme.getType('type16').serialize(typesMock.type16.data)
      expect(buffer).to.deep.equal(typesMock.type16.serialized)
    })

    it('should serialize data and return array of 8-bit integers when the value is valid positive number as string', function () {
      const data = { balance: '340282350000000000000000000000000000000.0' }
      const buffer = scheme.getType('type16').serialize(data)

      expect(buffer).to.deep.equal([255, 255, 127, 127])
    })

    it('should serialize data and return array of 8-bit integers when the value is valid negative number', function () {
      const data = { balance: -1234.567 }
      const buffer = scheme.getType('type16').serialize(data)

      expect(buffer).to.deep.equal([37, 82, 154, 196])
    })

    it('should serialize data and return array of 8-bit integers when the value is valid negative number as string', function () {
      const data = { balance: '-340282350000000000000000000000000000000.0' }
      const buffer = scheme.getType('type16').serialize(data)

      expect(buffer).to.deep.equal([255, 255, 127, 255])
    })

    it('should throw error when the value of invalid type', function () {
      expect(() => scheme.getType('type16').serialize({ balance: undefined }))
        .to.throw(TypeError, 'Field balance is not defined.');

      [true, null, [], {}, new Date()].forEach(function (balance) {
        expect(() => scheme.getType('type16').serialize({ balance: balance }))
          .to.throw(TypeError, /Float32 of wrong type is passed:/)
      })
    })
  })

  describe('Process Float64', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid positive number', function () {
      const buffer = scheme.getType('type17').serialize(typesMock.type17.data)
      expect(buffer).to.deep.equal(typesMock.type17.serialized)
    })

    it('should serialize data and return array of 8-bit integers when the value is valid positive number as string', function () {
      const data = { balance: '179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000.0' }
      const buffer = scheme.getType('type17').serialize(data)

      expect(buffer).to.deep.equal([255, 255, 255, 255, 255, 255, 239, 127])
    })

    it('should serialize data and return array of 8-bit integers when the value is valid negative number', function () {
      const data = { balance: -98765.4321 }
      const buffer = scheme.getType('type17').serialize(data)

      expect(buffer).to.deep.equal([138, 176, 225, 233, 214, 28, 248, 192])
    })

    it('should serialize data and return array of 8-bit integers when the value is valid negative number as string', function () {
      const data = { balance: '-179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000.0' }
      const buffer = scheme.getType('type17').serialize(data)

      expect(buffer).to.deep.equal([255, 255, 255, 255, 255, 255, 239, 255])
    })

    it('should throw error when the value of invalid type', function () {
      expect(() => scheme.getType('type17').serialize({ balance: undefined }))
        .to.throw(TypeError, 'Field balance is not defined.');

      [true, null, [], {}, new Date()].forEach(function (balance) {
        expect(() => scheme.getType('type17').serialize({ balance: balance }))
          .to.throw(TypeError, /Float64 of wrong type is passed:/)
      })
    })
  })

  describe('Process Array', function () {
    it('should serialize valid array of Hash type and return array of 8-bit integers', function () {
      let buffer = scheme.getType('type15-2').serialize(typesMock.type15.data)
      expect(buffer).to.deep.equal(typesMock.type15.serialized)
    })

    it('should serialize valid array of PublicKey type and return array of 8-bit integers', function () {
      const Arr = Exonum.newArray({
        type: Exonum.PublicKey
      })
      const Type = Exonum.newType({
        fields: [
          { name: 'list', type: Arr }
        ]
      })
      const data = {
        list: [
          'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
          '1f2f07703c5bcafb5749aa735ce8b3336f5864ab6a5a2190666b47c612bcf15a'
        ]
      }
      let buffer = Type.serialize(data)
      expect(buffer).to.deep.equal([8, 0, 0, 0, 2, 0, 0, 0, 245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54, 31, 47, 7, 112, 60, 91, 202, 251, 87, 73, 170, 115, 92, 232, 179, 51, 111, 88, 100, 171, 106, 90, 33, 144, 102, 107, 71, 198, 18, 188, 241, 90])
    })

    it('should serialize valid array of Digest type and return array of 8-bit integers', function () {
      const Arr = Exonum.newArray({
        type: Exonum.Digest
      })
      const Type = Exonum.newType({
        fields: [
          { name: 'list', type: Arr }
        ]
      })
      const data = {
        list: [
          'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'
        ]
      }
      let buffer = Type.serialize(data)
      expect(buffer).to.deep.equal([8, 0, 0, 0, 1, 0, 0, 0, 245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54, 245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54])
    })

    it('should serialize valid array of Timespec type and return array of 8-bit integers', function () {
      const Arr = Exonum.newArray({
        type: Exonum.Timespec
      })
      const Type = Exonum.newType({
        fields: [
          { name: 'list', type: Arr }
        ]
      })
      const data = {
        list: [
          '1483979894237',
          '1483979103946',
          '1483979142801'
        ]
      }
      let buffer = Type.serialize(data)
      expect(buffer).to.deep.equal([8, 0, 0, 0, 3, 0, 0, 0, 221, 45, 24, 132, 89, 1, 0, 0, 202, 30, 12, 132, 89, 1, 0, 0, 145, 182, 12, 132, 89, 1, 0, 0])
    })

    it('should serialize valid array of Bool type and return array of 8-bit integers', function () {
      const Arr = Exonum.newArray({
        type: Exonum.Bool
      })
      const Type = Exonum.newType({
        fields: [
          { name: 'list', type: Arr }
        ]
      })
      const data = {
        list: [true, true, false]
      }
      let buffer = Type.serialize(data)
      expect(buffer).to.deep.equal([8, 0, 0, 0, 3, 0, 0, 0, 1, 1, 0])
    })

    it('should serialize valid array of Int8 type and return array of 8-bit integers', function () {
      const Arr = Exonum.newArray({
        type: Exonum.Int8
      })
      const Type = Exonum.newType({
        fields: [
          { name: 'list', type: Arr }
        ]
      })
      const data = {
        list: [
          0,
          -127,
          13
        ]
      }
      let buffer = Type.serialize(data)
      expect(buffer).to.deep.equal([8, 0, 0, 0, 3, 0, 0, 0, 0, 129, 13])
    })

    it('should serialize valid array of Int16 type and return array of 8-bit integers', function () {
      const Arr = Exonum.newArray({
        type: Exonum.Int16
      })
      const Type = Exonum.newType({
        fields: [
          { name: 'list', type: Arr }
        ]
      })
      const data = {
        list: [
          33,
          -578,
          1
        ]
      }
      let buffer = Type.serialize(data)
      expect(buffer).to.deep.equal([8, 0, 0, 0, 3, 0, 0, 0, 33, 0, 190, 253, 1, 0])
    })

    it('should serialize valid array of Int32 type and return array of 8-bit integers', function () {
      const Arr = Exonum.newArray({
        type: Exonum.Int32
      })
      const Type = Exonum.newType({
        fields: [
          { name: 'list', type: Arr }
        ]
      })
      const data = {
        list: [
          801,
          -311,
          0,
          -556,
          9
        ]
      }
      let buffer = Type.serialize(data)
      expect(buffer).to.deep.equal([8, 0, 0, 0, 5, 0, 0, 0, 33, 3, 0, 0, 201, 254, 255, 255, 0, 0, 0, 0, 212, 253, 255, 255, 9, 0, 0, 0])
    })

    it('should serialize valid array of Int64 type and return array of 8-bit integers', function () {
      const Arr = Exonum.newArray({
        type: Exonum.Int64
      })
      const Type = Exonum.newType({
        fields: [
          { name: 'list', type: Arr }
        ]
      })
      const data = {
        list: [
          167,
          -102851,
          22210,
          -724
        ]
      }
      let buffer = Type.serialize(data)
      expect(buffer).to.deep.equal([8, 0, 0, 0, 4, 0, 0, 0, 167, 0, 0, 0, 0, 0, 0, 0, 61, 110, 254, 255, 255, 255, 255, 255, 194, 86, 0, 0, 0, 0, 0, 0, 44, 253, 255, 255, 255, 255, 255, 255])
    })

    it('should serialize valid array of Uint8 type and return array of 8-bit integers', function () {
      const Arr = Exonum.newArray({
        type: Exonum.Uint8
      })
      const Type = Exonum.newType({
        fields: [
          { name: 'list', type: Arr }
        ]
      })
      const data = {
        list: [
          0,
          127,
          13
        ]
      }
      let buffer = Type.serialize(data)
      expect(buffer).to.deep.equal([8, 0, 0, 0, 3, 0, 0, 0, 0, 127, 13])
    })

    it('should serialize valid array of Uint16 type and return array of 8-bit integers', function () {
      const Arr = Exonum.newArray({
        type: Exonum.Uint16
      })
      const Type = Exonum.newType({
        fields: [
          { name: 'list', type: Arr }
        ]
      })
      const data = {
        list: [
          33,
          578,
          1
        ]
      }
      let buffer = Type.serialize(data)
      expect(buffer).to.deep.equal([8, 0, 0, 0, 3, 0, 0, 0, 33, 0, 66, 2, 1, 0])
    })

    it('should serialize valid array of Uint32 type and return array of 8-bit integers', function () {
      const Arr = Exonum.newArray({
        type: Exonum.Uint32
      })
      const Type = Exonum.newType({
        fields: [
          { name: 'list', type: Arr }
        ]
      })
      const data = {
        list: [
          801,
          311,
          0,
          556,
          9
        ]
      }
      let buffer = Type.serialize(data)
      expect(buffer).to.deep.equal([8, 0, 0, 0, 5, 0, 0, 0, 33, 3, 0, 0, 55, 1, 0, 0, 0, 0, 0, 0, 44, 2, 0, 0, 9, 0, 0, 0])
    })

    it('should serialize valid array of Uint64 type and return array of 8-bit integers', function () {
      const Arr = Exonum.newArray({
        type: Exonum.Uint64
      })
      const Type = Exonum.newType({
        fields: [
          { name: 'list', type: Arr }
        ]
      })
      const data = {
        list: [
          167,
          102851,
          22210,
          724
        ]
      }
      let buffer = Type.serialize(data)
      expect(buffer).to.deep.equal([8, 0, 0, 0, 4, 0, 0, 0, 167, 0, 0, 0, 0, 0, 0, 0, 195, 145, 1, 0, 0, 0, 0, 0, 194, 86, 0, 0, 0, 0, 0, 0, 212, 2, 0, 0, 0, 0, 0, 0])
    })

    it('should serialize valid array of Array type and return array of 8-bit integers', function () {
      const NestedArr = Exonum.newArray({
        type: Exonum.Uint8
      })
      const Arr = Exonum.newArray({
        type: NestedArr
      })
      const Type = Exonum.newType({
        fields: [
          { name: 'list', type: Arr }
        ]
      })
      const data = {
        list: [
          [5, 16, 0],
          [127, 14]
        ]
      }
      let buffer = Type.serialize(data)
      expect(buffer).to.deep.equal([8, 0, 0, 0, 2, 0, 0, 0, 24, 0, 0, 0, 3, 0, 0, 0, 27, 0, 0, 0, 2, 0, 0, 0, 5, 16, 0, 127, 14])
    })

    it('should serialize valid array of fixed-length newType type and return array of 8-bit integers', function () {
      const NestedType = Exonum.newType({
        fields: [
          { name: 'day', type: Exonum.Uint8 },
          { name: 'month', type: Exonum.Uint8 },
          { name: 'year', type: Exonum.Uint16 }
        ]
      })
      const Arr = Exonum.newArray({
        type: NestedType
      })
      const Type = Exonum.newType({
        fields: [
          { name: 'list', type: Arr }
        ]
      })
      const data = {
        list: [
          { day: 1, month: 5, year: 1841 },
          { day: 30, month: 9, year: 2012 }
        ]
      }
      let buffer = Type.serialize(data)
      expect(buffer).to.deep.equal([8, 0, 0, 0, 2, 0, 0, 0, 24, 0, 0, 0, 4, 0, 0, 0, 28, 0, 0, 0, 4, 0, 0, 0, 1, 5, 49, 7, 30, 9, 220, 7])
    })

    it('should serialize valid array of non-fixed-length newType type and return array of 8-bit integers', function () {
      const NestedType = Exonum.newType({
        fields: [
          { name: 'name', type: Exonum.String },
          { name: 'age', type: Exonum.Uint8 }
        ]
      })
      const Arr = Exonum.newArray({
        type: NestedType
      })
      const Type = Exonum.newType({
        fields: [
          { name: 'list', type: Arr }
        ]
      })
      const data = {
        list: [
          { age: 27, name: 'John Doe' },
          { age: 22, name: 'Helen Edinger' }
        ]
      }
      let buffer = Type.serialize(data)
      expect(buffer).to.deep.equal([8, 0, 0, 0, 2, 0, 0, 0, 24, 0, 0, 0, 17, 0, 0, 0, 41, 0, 0, 0, 22, 0, 0, 0, 9, 0, 0, 0, 8, 0, 0, 0, 27, 74, 111, 104, 110, 32, 68, 111, 101, 9, 0, 0, 0, 13, 0, 0, 0, 22, 72, 101, 108, 101, 110, 32, 69, 100, 105, 110, 103, 101, 114])
    })

    it('should serialize valid array of nested newType types and return array of 8-bit integers', function () {
      const Profile = Exonum.newType({
        fields: [
          { name: 'id', type: Exonum.Uint8 },
          { name: 'name', type: Exonum.String },
          { name: 'since', type: Exonum.Uint16 }
        ]
      })
      const Arr = Exonum.newArray({
        type: Profile
      })
      const Diploma = Exonum.newType({
        fields: [
          { name: 'title', type: Exonum.String },
          { name: 'year', type: Exonum.Uint16 }
        ]
      })
      const User = Exonum.newType({
        fields: [
          { name: 'name', type: Exonum.String },
          { name: 'age', type: Exonum.Uint8 },
          { name: 'profiles', type: Arr },
          { name: 'diploma', type: Diploma }
        ]
      })
      const data = {
        name: 'John Doe',
        age: 25,
        profiles: [
          {
            id: 1,
            name: 'Facebook',
            since: 2015
          },
          {
            id: 2,
            name: 'Twitter',
            since: 2015
          }
        ],
        diploma: {
          title: 'Bachelor',
          year: 1988
        }
      }
      let buffer = User.serialize(data)
      expect(buffer).to.deep.equal([25, 0, 0, 0, 8, 0, 0, 0, 25, 33, 0, 0, 0, 2, 0, 0, 0, 86, 0, 0, 0, 18, 0, 0, 0, 74, 111, 104, 110, 32, 68, 111, 101, 49, 0, 0, 0, 19, 0, 0, 0, 68, 0, 0, 0, 18, 0, 0, 0, 1, 11, 0, 0, 0, 8, 0, 0, 0, 223, 7, 70, 97, 99, 101, 98, 111, 111, 107, 2, 11, 0, 0, 0, 7, 0, 0, 0, 223, 7, 84, 119, 105, 116, 116, 101, 114, 10, 0, 0, 0, 8, 0, 0, 0, 196, 7, 66, 97, 99, 104, 101, 108, 111, 114])
    })

    it('should throw error when value of wrong type is passed', function () {
      const Arr = Exonum.newArray({
        type: Exonum.Bool
      })
      const Type = Exonum.newType({
        fields: [
          { name: 'list', type: Arr }
        ]
      })
      const data = {
        list: [
          33
        ]
      }
      expect(() => Type.serialize(data)).to.throw(TypeError)
    })

    it('should throw error when type of wrong type is passed', function () {
      const Arr = Exonum.newArray({
        type: Exonum.String
      })
      const Type = Exonum.newType({
        fields: [
          { name: 'list', type: Arr }
        ]
      })
      const data = {
        list: [
          10
        ]
      }
      expect(() => Type.serialize(data)).to.throw(TypeError)
    })

    it('should throw error when array of String type is passed', function () {
      const Arr = Exonum.newArray({
        type: Exonum.String
      })
      const Type = Exonum.newType({
        fields: [
          { name: 'list', type: Arr }
        ]
      })
      const data = {
        list: [
          'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
          '1f2f07703c5bcafb5749aa735ce8b3336f5864ab6a5a2190666b47c612bcf15a'
        ]
      }
      expect(() => Type.serialize(data)).to.throw(TypeError)
    })
  })
})

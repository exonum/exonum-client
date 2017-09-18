/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const Exonum = require('../src')

describe('Check built-in types', function () {
  describe('Process Hash', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid hexadecimal string', function () {
      const Type = Exonum.newType({
        size: 32,
        fields: { hash: { type: Exonum.Hash, size: 32, from: 0, to: 32 } }
      })
      const data = { hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36' }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54])
    })

    it('should throw error when the range of segment is invalid', function () {
      const Type = Exonum.newType({
        size: 32,
        fields: { hash: { type: Exonum.Hash, size: 32, from: 0, to: 16 } }
      })
      const data = { hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36' }

      expect(() => Type.serialize(data))
        .to.throw(Error, 'Hash segment is of wrong length. 32 bytes long is required to store transmitted value.')
    })

    it('should throw error when the value is invalid string', function () {
      const Type = Exonum.newType({
        size: 32,
        fields: { hash: { type: Exonum.Hash, size: 32, from: 0, to: 32 } }
      })
      const data = { hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3z' }

      expect(() => Type.serialize(data))
        .to.throw(TypeError, 'Hash of wrong type is passed: f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3z')
    })

    it('should throw error when the value is too long string', function () {
      const Type = Exonum.newType({
        size: 32,
        fields: { hash: { type: Exonum.Hash, size: 32, from: 0, to: 32 } }
      })
      const data = { hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365' }

      expect(() => Type.serialize(data))
        .to.throw(TypeError, 'Hash of wrong type is passed: f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365')
    })

    it('should throw error when the value is too short string', function () {
      const Type = Exonum.newType({
        size: 32,
        fields: { hash: { type: Exonum.Hash, size: 32, from: 0, to: 32 } }
      })
      const data = { hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3' }

      expect(() => Type.serialize(data))
        .to.throw(TypeError, 'Hash of wrong type is passed: f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3')
    })

    it('should throw error when the value of invalid type', function () {
      const Type = Exonum.newType({
        size: 32,
        fields: { hash: { type: Exonum.Hash, size: 32, from: 0, to: 32 } }
      })

      expect(() => Type.serialize({ hash: undefined }))
        .to.throw(TypeError, 'Field hash is not defined.');

      [true, null, 57, [], {}, new Date()].forEach(function (hash) {
        expect(() => Type.serialize({ hash: hash }))
          .to.throw(TypeError, /Hash of wrong type is passed:/)
      })
    })
  })

  describe('Process PublicKey', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid string', function () {
      const Type = Exonum.newType({
        size: 32,
        fields: { key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 } }
      })
      const data = { key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36' }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54])
    })

    it('should throw error when the range of segment is invalid', function () {
      const Type = Exonum.newType({
        size: 32,
        fields: { key: { type: Exonum.PublicKey, size: 32, from: 0, to: 16 } }
      })
      const data = { key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36' }

      expect(() => Type.serialize(data))
        .to.throw(Error, 'PublicKey segment is of wrong length. 32 bytes long is required to store transmitted value.')
    })

    it('should throw error when the value is invalid string', function () {
      const Type = Exonum.newType({
        size: 32,
        fields: { key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 } }
      })
      const data = { key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3z' }

      expect(() => Type.serialize(data))
        .to.throw(TypeError, 'PublicKey of wrong type is passed: f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3z')
    })

    it('should throw error when the value is too long string', function () {
      const Type = Exonum.newType({
        size: 32,
        fields: { key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 } }
      })
      const data = { key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365' }

      expect(() => Type.serialize(data))
        .to.throw(TypeError, 'PublicKey of wrong type is passed: f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365')
    })

    it('should throw error when the value is too short string', function () {
      const Type = Exonum.newType({
        size: 32,
        fields: { key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 } }
      })
      const data = { key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3' }

      expect(() => Type.serialize(data))
        .to.throw(TypeError, 'PublicKey of wrong type is passed: f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3')
    })

    it('should throw error when the value of invalid type', function () {
      const Type = Exonum.newType({
        size: 32,
        fields: { key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 } }
      })

      expect(() => Type.serialize({ key: undefined }))
        .to.throw(TypeError, 'Field key is not defined.');

      [true, null, 57, [], {}, new Date()].forEach(function (key) {
        expect(() => Type.serialize({ key: key }))
          .to.throw(TypeError, /PublicKey of wrong type is passed:/)
      })
    })
  })

  describe('Process Digest', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid string', function () {
      const Type = Exonum.newType({
        size: 64,
        fields: { key: { type: Exonum.Digest, size: 64, from: 0, to: 64 } }
      })
      const data = { key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36' }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54, 245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54])
    })

    it('should throw error when the range of segment is invalid', function () {
      const Type = Exonum.newType({
        size: 64,
        fields: { key: { type: Exonum.Digest, size: 64, from: 0, to: 32 } }
      })
      const data = { key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36' }

      expect(() => Type.serialize(data))
        .to.throw(Error, 'Digest segment is of wrong length. 64 bytes long is required to store transmitted value.')
    })

    it('should throw error when the value is invalid string', function () {
      const Type = Exonum.newType({
        size: 64,
        fields: { key: { type: Exonum.Digest, size: 64, from: 0, to: 64 } }
      })
      const data = { key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3zf5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3z' }

      expect(() => Type.serialize(data))
        .to.throw(TypeError, 'Digest of wrong type is passed: f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3zf5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3z')
    })

    it('should throw error when the value is too long string', function () {
      const Type = Exonum.newType({
        size: 64,
        fields: { key: { type: Exonum.Digest, size: 64, from: 0, to: 64 } }
      })
      const data = { key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365' }

      expect(() => Type.serialize(data))
        .to.throw(TypeError, 'Digest of wrong type is passed: f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365')
    })

    it('should throw error when the value is too short string', function () {
      const Type = Exonum.newType({
        size: 64,
        fields: { key: { type: Exonum.Digest, size: 64, from: 0, to: 64 } }
      })
      const data = { key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3' }

      expect(() => Type.serialize(data))
        .to.throw(TypeError, 'Digest of wrong type is passed: f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3')
    })

    it('should throw error when the value of invalid type', function () {
      const Type = Exonum.newType({
        size: 64,
        fields: { key: { type: Exonum.Digest, size: 64, from: 0, to: 64 } }
      })

      expect(() => Type.serialize({ key: undefined }))
        .to.throw(TypeError, 'Field key is not defined.');

      [true, null, 57, [], {}, new Date()].forEach(function (key) {
        expect(() => Type.serialize({ key: key }))
          .to.throw(TypeError, /Digest of wrong type is passed: /)
      })
    })
  })

  describe('Process Timespec', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid timestamp in nanoseconds passed as positive number', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { since: { type: Exonum.Timespec, size: 8, from: 0, to: 8 } }
      })
      const data = { since: 1483979894237 }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([221, 45, 24, 132, 89, 1, 0, 0])
    })

    it('should serialize data and return array of 8-bit integers when the value is valid timestamp in nanoseconds passed as string', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { since: { type: Exonum.Timespec, size: 8, from: 0, to: 8 } }
      })
      const data = { since: '18446744073709551615' }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([255, 255, 255, 255, 255, 255, 255, 255])
    })

    it('should throw error when the value is negative number', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { since: { type: Exonum.Timespec, size: 8, from: 0, to: 8 } }
      })

      expect(() => Type.serialize({ since: -1483979894237 }))
        .to.throw(TypeError, 'Timespec of wrong type is passed: -1483979894237')
    })

    it('should throw error when the range of segment is invalid', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { since: { type: Exonum.Timespec, size: 8, from: 0, to: 4 } }
      })

      expect(() => Type.serialize({ since: 1483979894237 }))
        .to.throw(TypeError, 'Timespec of wrong type is passed: 1483979894237')
    })

    it('should throw error when the value is out of range', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { since: { type: Exonum.Timespec, size: 8, from: 0, to: 8 } }
      })

      expect(() => Type.serialize({ since: '18446744073709551616' }))
        .to.throw(TypeError, 'Timespec of wrong type is passed: 18446744073709551616')
    })

    it('should throw error when the value of invalid type', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { since: { type: Exonum.Timespec, size: 8, from: 0, to: 8 } }
      })

      expect(() => Type.serialize({ since: undefined }))
        .to.throw(TypeError, 'Field since is not defined.');

      [true, null, [], {}, new Date()].forEach(function (since) {
        expect(() => Type.serialize({ since: since }))
          .to.throw(TypeError, /Timespec of wrong type is passed: /)
      })
    })
  })

  describe('Process Bool', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid positive boolean', function () {
      const Type = Exonum.newType({
        size: 1,
        fields: { active: { type: Exonum.Bool, size: 1, from: 0, to: 1 } }
      })
      const data = { active: true }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([1])
    })

    it('should serialize data and return array of 8-bit integers when the value is valid negative boolean', function () {
      const Type = Exonum.newType({
        size: 1,
        fields: { active: { type: Exonum.Bool, size: 1, from: 0, to: 1 } }
      })
      const data = { active: false }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([0])
    })

    it('should throw error when the range of segment is invalid', function () {
      const Type = Exonum.newType({
        size: 1,
        fields: { active: { type: Exonum.Bool, size: 1, from: 0, to: 0 } }
      })

      expect(() => Type.serialize({ active: true }))
        .to.throw(Error, 'Bool segment is of wrong length. 1 bytes long is required to store transmitted value.')
    })

    it('should throw error when the value of invalid type', function () {
      const Type = Exonum.newType({
        size: 1,
        fields: { active: { type: Exonum.Bool, size: 1, from: 0, to: 1 } }
      })
      expect(() => Type.serialize({ active: undefined }))
        .to.throw(TypeError, 'Field active is not defined.');

      ['Hello world', null, 57, [], {}, new Date()].forEach(function (active) {
        expect(() => Type.serialize({ active: active }))
          .to.throw(TypeError, 'Wrong data type is passed as Boolean. Boolean is required')
      })
    })
  })

  describe('Process String', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid string', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { text: { type: Exonum.String, size: 8, from: 0, to: 8 } }
      })
      const data = { text: 'Hello world' }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([8, 0, 0, 0, 11, 0, 0, 0, 72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100])
    })

    it('should throw error when the range of segment is invalid', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { text: { type: Exonum.String, size: 8, from: 0, to: 4 } }
      })

      expect(() => Type.serialize({ text: 'Hello world' }))
        .to.throw(Error, 'String segment is of wrong length. 8 bytes long is required to store transmitted value.')
    })

    it('should throw error when the value of invalid type', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { text: { type: Exonum.String, size: 8, from: 0, to: 8 } }
      })

      expect(() => Type.serialize({ text: undefined }))
        .to.throw(TypeError, 'Field text is not defined.');

      [true, null, 57, [], {}, new Date()].forEach(function (text) {
        expect(() => Type.serialize({ text: text }))
          .to.throw(TypeError, 'Wrong data type is passed as String. String is required')
      })
    })
  })

  describe('Process Int8', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid positive number', function () {
      const Type = Exonum.newType({
        size: 1,
        fields: { balance: { type: Exonum.Int8, size: 1, from: 0, to: 1 } }
      })
      const data = { balance: 120 }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([120])
    })

    it('should serialize data and return array of 8-bit integers when the value is valid negative number', function () {
      const Type = Exonum.newType({
        size: 1,
        fields: { balance: { type: Exonum.Int8, size: 1, from: 0, to: 1 } }
      })
      const data = { balance: -120 }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([136])
    })

    it('should throw error when the range of segment is invalid', function () {
      const Type = Exonum.newType({
        size: 1,
        fields: { balance: { type: Exonum.Int8, size: 1, from: 0, to: 0 } }
      })
      expect(() => Type.serialize({ balance: 120 }))
        .to.throw(TypeError, 'Int8 of wrong type is passed: 120')
    })

    it('should throw error when the value is too big positive number', function () {
      const Type = Exonum.newType({
        size: 1,
        fields: { balance: { type: Exonum.Int8, size: 1, from: 0, to: 1 } }
      })

      expect(() => Type.serialize({ balance: 130 }))
        .to.throw(TypeError, 'Int8 of wrong type is passed: 130')
    })

    it('should throw error when the value is too big negative number', function () {
      const Type = Exonum.newType({
        size: 1,
        fields: { balance: { type: Exonum.Int8, size: 1, from: 0, to: 1 } }
      })

      expect(() => Type.serialize({ balance: -130 }))
        .to.throw(TypeError, 'Int8 of wrong type is passed: -130')
    })

    it('should throw error when the value of invalid type', function () {
      const Type = Exonum.newType({
        size: 1,
        fields: { balance: { type: Exonum.Int8, size: 1, from: 0, to: 1 } }
      })

      expect(() => Type.serialize({ balance: undefined }))
        .to.throw(TypeError, 'Field balance is not defined.');

      [true, null, [], {}, new Date()].forEach(function (balance) {
        expect(() => Type.serialize({ balance: balance }))
          .to.throw(TypeError, /Int8 of wrong type is passed:/)
      })
    })
  })

  describe('Process Int16', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid positive number', function () {
      const Type = Exonum.newType({
        size: 2,
        fields: { balance: { type: Exonum.Int16, size: 2, from: 0, to: 2 } }
      })
      const data = { balance: 30767 }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([47, 120])
    })

    it('should serialize data and return array of 8-bit integers when the value is valid negative number', function () {
      const Type = Exonum.newType({
        size: 2,
        fields: { balance: { type: Exonum.Int16, size: 2, from: 0, to: 2 } }
      })
      const data = { balance: -30767 }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([209, 135])
    })

    it('should throw error when the range of segment is invalid', function () {
      const Type = Exonum.newType({
        size: 2,
        fields: { balance: { type: Exonum.Int16, size: 2, from: 0, to: 1 } }
      })

      expect(() => Type.serialize({ balance: 30767 }))
        .to.throw(TypeError, 'Int16 of wrong type is passed: 30767')
    })

    it('should throw error when the value is too big positive number', function () {
      const Type = Exonum.newType({
        size: 2,
        fields: { balance: { type: Exonum.Int16, size: 2, from: 0, to: 2 } }
      })

      expect(() => Type.serialize({ balance: 32769 }))
        .to.throw(TypeError, 'Int16 of wrong type is passed: 32769')
    })

    it('should throw error when the value is too big negative number', function () {
      const Type = Exonum.newType({
        size: 2,
        fields: { balance: { type: Exonum.Int16, size: 2, from: 0, to: 2 } }
      })

      expect(() => Type.serialize({ balance: -32770 }))
        .to.throw(TypeError, 'Int16 of wrong type is passed: -32770')
    })

    it('should throw error when the value of invalid type', function () {
      const Type = Exonum.newType({
        size: 2,
        fields: { balance: { type: Exonum.Int16, size: 2, from: 0, to: 2 } }
      })

      expect(() => Type.serialize({ balance: undefined }))
        .to.throw(TypeError, 'Field balance is not defined.');

      [true, null, [], {}, new Date()].forEach(function (balance) {
        expect(() => Type.serialize({ balance: balance }))
          .to.throw(TypeError, /Int16 of wrong type is passed:/)
      })
    })
  })

  describe('Process Int32', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid positive number', function () {
      const Type = Exonum.newType({
        size: 4,
        fields: { balance: { type: Exonum.Int32, size: 4, from: 0, to: 4 } }
      })
      const data = { balance: 1147483647 }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([255, 53, 101, 68])
    })

    it('should serialize data and return array of 8-bit integers when the value is valid negative number', function () {
      const Type = Exonum.newType({
        size: 4,
        fields: { balance: { type: Exonum.Int32, size: 4, from: 0, to: 4 } }
      })
      const data = { balance: -1147483648 }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([0, 202, 154, 187])
    })

    it('should throw error when the range of segment is invalid', function () {
      const Type = Exonum.newType({
        size: 4,
        fields: { balance: { type: Exonum.Int32, size: 4, from: 0, to: 3 } }
      })

      expect(() => Type.serialize({ balance: 613228 }))
        .to.throw(TypeError, 'Int32 of wrong type is passed: 613228')
    })

    it('should throw error when the value is too big positive number', function () {
      const Type = Exonum.newType({
        size: 4,
        fields: { balance: { type: Exonum.Int32, size: 4, from: 0, to: 4 } }
      })

      expect(() => Type.serialize({ balance: 2147483649 }))
        .to.throw(TypeError, 'Int32 of wrong type is passed: 2147483649')
    })

    it('should throw error when the value is too big negative number', function () {
      const Type = Exonum.newType({
        size: 4,
        fields: { balance: { type: Exonum.Int32, size: 4, from: 0, to: 4 } }
      })

      expect(() => Type.serialize({ balance: -2147483650 }))
        .to.throw(TypeError, 'Int32 of wrong type is passed: -2147483650')
    })

    it('should throw error when the value of invalid type', function () {
      const Type = Exonum.newType({
        size: 4,
        fields: { balance: { type: Exonum.Int32, size: 4, from: 0, to: 4 } }
      })

      expect(() => Type.serialize({ balance: undefined }))
        .to.throw(TypeError, 'Field balance is not defined.');

      [true, null, [], {}, new Date()].forEach(function (balance) {
        expect(() => Type.serialize({ balance: balance }))
          .to.throw(TypeError, /Int32 of wrong type is passed:/)
      })
    })
  })

  describe('Process Int64', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid positive number', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { balance: { type: Exonum.Int64, size: 8, from: 0, to: 8 } }
      })
      const data = { balance: 900719925474000 }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([208, 50, 51, 51, 51, 51, 3, 0])
    })

    it('should serialize data and return array of 8-bit integers when the value is valid positive number as string', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { balance: { type: Exonum.Int64, size: 8, from: 0, to: 8 } }
      })
      const data = { balance: '9223372036854775807' }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([255, 255, 255, 255, 255, 255, 255, 127])
    })

    it('should serialize data and return array of 8-bit integers when the value is valid negative number', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { balance: { type: Exonum.Int64, size: 8, from: 0, to: 8 } }
      })
      const data = { balance: -90071992547 }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([29, 119, 74, 7, 235, 255, 255, 255])
    })

    it('should serialize data and return array of 8-bit integers when the value is valid negative number as string', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { balance: { type: Exonum.Int64, size: 8, from: 0, to: 8 } }
      })
      const data = { balance: '-9223372036854775808' }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 128])
    })

    it('should throw error when the range of segment is invalid', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { balance: { type: Exonum.Int64, size: 8, from: 0, to: 4 } }
      })

      expect(() => Type.serialize({ balance: 613228 }))
        .to.throw(TypeError, 'Int64 of wrong type is passed: 613228')
    })

    it('should throw error when the value is too big positive number', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { balance: { type: Exonum.Int64, size: 8, from: 0, to: 8 } }
      })

      expect(() => Type.serialize({ balance: '9223372036854775808' }))
        .to.throw(TypeError, 'Int64 of wrong type is passed: 9223372036854775808')
    })

    it('should throw error when the value is too big negative number', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { balance: { type: Exonum.Int64, size: 8, from: 0, to: 8 } }
      })

      expect(() => Type.serialize({ balance: '-9223372036854775809' }))
        .to.throw(TypeError, 'Int64 of wrong type is passed: -9223372036854775809')
    })

    it('should throw error when the value of invalid type', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { balance: { type: Exonum.Int64, size: 8, from: 0, to: 8 } }
      })

      expect(() => Type.serialize({ balance: undefined }))
        .to.throw(TypeError, 'Field balance is not defined.');

      [true, null, [], {}, new Date()].forEach(function (balance) {
        expect(() => Type.serialize({ balance: balance }))
          .to.throw(TypeError, /Int64 of wrong type is passed:/)
      })
    })
  })

  describe('Process Uint8', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid positive number', function () {
      const Type = Exonum.newType({
        size: 1,
        fields: { balance: { type: Exonum.Uint8, size: 1, from: 0, to: 1 } }
      })
      const data = { balance: 230 }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([230])
    })

    it('should throw error when the range of segment is invalid', function () {
      const Type = Exonum.newType({
        size: 1,
        fields: { balance: { type: Exonum.Uint8, size: 1, from: 0, to: 0 } }
      })

      expect(() => Type.serialize({ balance: 230 }))
        .to.throw(TypeError, 'Uint8 of wrong type is passed: 230')
    })

    it('should throw error when the value is negative number', function () {
      const Type = Exonum.newType({
        size: 1,
        fields: { balance: { type: Exonum.Uint8, size: 1, from: 0, to: 1 } }
      })

      expect(() => Type.serialize({ balance: -1 }))
        .to.throw(TypeError, 'Uint8 of wrong type is passed: -1')
    })

    it('should throw error when the value is out of range', function () {
      const Type = Exonum.newType({
        size: 1,
        fields: { balance: { type: Exonum.Uint8, size: 1, from: 0, to: 1 } }
      })

      expect(() => Type.serialize({ balance: 256 }))
        .to.throw(TypeError, 'Uint8 of wrong type is passed: 256')
    })

    it('should throw error when the value of invalid type', function () {
      const Type = Exonum.newType({
        size: 1,
        fields: { balance: { type: Exonum.Uint8, size: 1, from: 0, to: 1 } }
      })

      expect(() => Type.serialize({ balance: undefined }))
        .to.throw(TypeError, 'Field balance is not defined.');

      [true, null, [], {}, new Date()].forEach(function (balance) {
        expect(() => Type.serialize({ balance: balance }))
          .to.throw(TypeError, /Uint8 of wrong type is passed:/)
      })
    })
  })

  describe('Process Uint16', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid positive number', function () {
      const Type = Exonum.newType({
        size: 2,
        fields: { balance: { type: Exonum.Uint16, size: 2, from: 0, to: 2 } }
      })
      const data = { balance: 60535 }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([119, 236])
    })

    it('should throw error when the range of segment is invalid', function () {
      const Type = Exonum.newType({
        size: 2,
        fields: { balance: { type: Exonum.Uint16, size: 2, from: 0, to: 1 } }
      })

      expect(() => Type.serialize({ balance: 60535 }))
        .to.throw(TypeError, 'Uint16 of wrong type is passed: 60535')
    })

    it('should throw error when the value is negative number', function () {
      const Type = Exonum.newType({
        size: 2,
        fields: { balance: { type: Exonum.Uint16, size: 2, from: 0, to: 2 } }
      })

      expect(() => Type.serialize({ balance: -1 }))
        .to.throw(TypeError, 'Uint16 of wrong type is passed: -1')
    })

    it('should throw error when the value is out of range', function () {
      const Type = Exonum.newType({
        size: 2,
        fields: { balance: { type: Exonum.Uint16, size: 2, from: 0, to: 2 } }
      })

      expect(() => Type.serialize({ balance: 65536 }))
        .to.throw(TypeError, 'Uint16 of wrong type is passed: 65536')
    })

    it('should throw error when the value of invalid type', function () {
      const Type = Exonum.newType({
        size: 2,
        fields: { balance: { type: Exonum.Uint16, size: 2, from: 0, to: 2 } }
      })

      expect(() => Type.serialize({ balance: undefined }))
        .to.throw(TypeError, 'Field balance is not defined.');

      [true, null, [], {}, new Date()].forEach(function (balance) {
        expect(() => Type.serialize({ balance: balance }))
          .to.throw(TypeError, /Uint16 of wrong type is passed:/)
      })
    })
  })

  describe('Process Uint32', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid positive number', function () {
      const Type = Exonum.newType({
        size: 4,
        fields: { balance: { type: Exonum.Uint32, size: 4, from: 0, to: 4 } }
      })
      const data = { balance: 613228 }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([108, 91, 9, 0])
    })

    it('should throw error when the range of segment is invalid', function () {
      const Type = Exonum.newType({
        size: 4,
        fields: { balance: { type: Exonum.Uint32, size: 4, from: 0, to: 3 } }
      })

      expect(() => Type.serialize({ balance: 613228 }))
        .to.throw(TypeError, 'Uint32 of wrong type is passed: 613228')
    })

    it('should throw error when the value is negative number', function () {
      const Type = Exonum.newType({
        size: 4,
        fields: { balance: { type: Exonum.Uint32, size: 4, from: 0, to: 4 } }
      })

      expect(() => Type.serialize({ balance: -1 }))
        .to.throw(TypeError, 'Uint32 of wrong type is passed: -1')
    })

    it('should throw error when the value is out of range', function () {
      const Type = Exonum.newType({
        size: 4,
        fields: { balance: { type: Exonum.Uint32, size: 4, from: 0, to: 4 } }
      })

      expect(() => Type.serialize({ balance: 4294967296 }))
        .to.throw(TypeError, 'Uint32 of wrong type is passed: 4294967296')
    })

    it('should throw error when the value of invalid type', function () {
      const Type = Exonum.newType({
        size: 4,
        fields: { balance: { type: Exonum.Uint32, size: 4, from: 0, to: 4 } }
      })

      expect(() => Type.serialize({ balance: undefined }))
        .to.throw(TypeError, 'Field balance is not defined.');

      [true, null, [], {}, new Date()].forEach(function (balance) {
        expect(() => Type.serialize({ balance: balance }))
          .to.throw(TypeError, /Uint32 of wrong type is passed:/)
      })
    })
  })

  describe('Process Uint64', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid positive number', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { balance: { type: Exonum.Uint64, size: 8, from: 0, to: 8 } }
      })
      const data = { balance: 613228 }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([108, 91, 9, 0, 0, 0, 0, 0])
    })

    it('should serialize data and return array of 8-bit integers when the value is valid positive number passed as string', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { balance: { type: Exonum.Uint64, size: 8, from: 0, to: 8 } }
      })
      const data = { balance: '9007199254740993' }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([1, 0, 0, 0, 0, 0, 32, 0])
    })

    it('should throw error when the range of segment is invalid', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { balance: { type: Exonum.Uint64, size: 8, from: 0, to: 4 } }
      })

      expect(() => Type.serialize({ balance: 613228 }))
        .to.throw(TypeError, 'Uint64 of wrong type is passed: 613228')
    })

    it('should throw error when the value is negative number', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { balance: { type: Exonum.Uint64, size: 8, from: 0, to: 8 } }
      })

      expect(() => Type.serialize({ balance: -613228 }))
        .to.throw(TypeError, 'Uint64 of wrong type is passed: -613228')
    })

    it('should throw error when the value is out of range', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { balance: { type: Exonum.Uint64, size: 8, from: 0, to: 8 } }
      })

      expect(() => Type.serialize({ balance: '18446744073709551616' }))
        .to.throw(TypeError, 'Uint64 of wrong type is passed: 18446744073709551616')
    })

    it('should throw error when the value of invalid type', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: { balance: { type: Exonum.Uint64, size: 8, from: 0, to: 8 } }
      })

      expect(() => Type.serialize({ balance: undefined }))
        .to.throw(TypeError, 'Field balance is not defined.');

      [true, null, [], {}, new Date()].forEach(function (balance) {
        expect(() => Type.serialize({ balance: balance }))
          .to.throw(TypeError, /Uint64 of wrong type is passed:/)
      })
    })
  })

  describe('Process FixedBuffer', function () {
    it('should serialize data and return array of 8-bit integers when the value is valid fixed buffer passed as array', function () {
      const Type = Exonum.newType({
        size: 16,
        fields: {
          balance: { type: Exonum.Uint64, size: 8, from: 0, to: 8 },
          phrase: { type: Exonum.FixedBuffer, size: 8, from: 8, to: 16 }
        }
      })
      const data = {
        balance: 613228,
        phrase: [245, 134, 74, 182, 165, 162, 25, 6]
      }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([108, 91, 9, 0, 0, 0, 0, 0, 245, 134, 74, 182, 165, 162, 25, 6])
    })

    it('should serialize data and return array of 8-bit integers when the value is valid fixed buffer passed as hexadecimal string', function () {
      const Type = Exonum.newType({
        size: 16,
        fields: {
          balance: { type: Exonum.Uint64, size: 8, from: 0, to: 8 },
          phrase: { type: Exonum.FixedBuffer, size: 8, from: 8, to: 16 }
        }
      })
      const data = {
        balance: 613228,
        phrase: 'f5864ab6a5a21906'
      }
      const buffer = Type.serialize(data)

      expect(buffer).to.deep.equal([108, 91, 9, 0, 0, 0, 0, 0, 245, 134, 74, 182, 165, 162, 25, 6])
    })

    it('should throw error when the range of segment is invalid', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: {
          phrase: { type: Exonum.FixedBuffer, size: 8, from: 0, to: 4 }
        }
      })
      const data = {
        phrase: [245, 134, 74, 182, 165, 162, 25, 6]
      }

      expect(() => Type.serialize(data))
        .to.throw(TypeError, 'FixedBuffer of wrong type is passed: 245,134,74,182,165,162,25,6')
    })

    it('should throw error when the value is too long bytes array', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: {
          phrase: { type: Exonum.FixedBuffer, size: 8, from: 0, to: 8 }
        }
      })
      const data = {
        phrase: [245, 134, 74, 182, 165, 162, 25, 6, 5]
      }

      expect(() => Type.serialize(data))
        .to.throw(TypeError, 'FixedBuffer of wrong type is passed: 245,134,74,182,165,162,25,6,5')
    })

    it('should throw error when the value is too short bytes array', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: {
          phrase: { type: Exonum.FixedBuffer, size: 8, from: 0, to: 8 }
        }
      })
      const data = {
        phrase: [245, 134, 74, 182, 165, 162, 25]
      }

      expect(() => Type.serialize(data))
        .to.throw(TypeError, 'FixedBuffer of wrong type is passed: 245,134,74,182,165,162,25')
    })

    it('should throw error when the value is invalid bytes array', function () {
      const Type = Exonum.newType({
        size: 1,
        fields: {
          phrase: { type: Exonum.FixedBuffer, size: 1, from: 0, to: 1 }
        }
      });

      [[300], [-5]].forEach(function (phrase) {
        expect(() => Type.serialize({ phrase: phrase }))
          .to.throw(TypeError, /FixedBuffer of wrong type is passed:/)
      })
    })

    it('should throw error when the value is bytes array of wrong type', function () {
      const Type = Exonum.newType({
        size: 1,
        fields: {
          phrase: { type: Exonum.FixedBuffer, size: 1, from: 0, to: 1 }
        }
      });

      [[true], [null], [undefined], ['Hello world'], [[]], [{}], [new Date()]].forEach(function (phrase) {
        expect(() => Type.serialize({ phrase: phrase }))
          .to.throw(TypeError, 'FixedBuffer of wrong type is passed: ')
      })
    })

    it('should throw error when the value is too short hexadecimal string', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: {
          phrase: { type: Exonum.FixedBuffer, size: 8, from: 0, to: 8 }
        }
      })
      const data = {
        phrase: 'f5864ab6a5a219'
      }

      expect(() => Type.serialize(data))
        .to.throw(TypeError, 'FixedBuffer of wrong type is passed: f5864ab6a5a219')
    })

    it('should throw error when the value is invalid hexadecimal string', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: {
          phrase: { type: Exonum.FixedBuffer, size: 8, from: 0, to: 8 }
        }
      })
      const data = {
        phrase: 'f5864ab6a5a2190z'
      }

      expect(() => Type.serialize(data))
        .to.throw(Error, 'FixedBuffer of wrong type is passed: f5864ab6a5a2190z')
    })

    it('should throw error when the value of wrong type', function () {
      const Type = Exonum.newType({
        size: 8,
        fields: {
          phrase: { type: Exonum.FixedBuffer, size: 8, from: 0, to: 8 }
        }
      })

      expect(() => Type.serialize({ phrase: undefined }))
        .to.throw(TypeError, 'Field phrase is not defined.');

      [true, null, 57, [], {}, new Date()].forEach(function (phrase) {
        expect(() => Type.serialize({ phrase: phrase }))
          .to.throw(TypeError, /FixedBuffer of wrong type is passed:/)
      })
    })
  })
})

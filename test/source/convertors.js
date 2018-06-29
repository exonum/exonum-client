/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const Exonum = require('../../src')

describe('Convert data from one type to another', function () {
  describe('Check Exonum.hexadecimalToUint8Array', function () {
    it('should convert valid hexadecimal into Uint8Array', function () {
      const data = require('./data/convertors/hexadecimalToUint8Array.json')
      expect(Exonum.hexadecimalToUint8Array(data.from)).to.deep.equal(new Uint8Array(data.to))
    })

    it('should throw error when convert invalid hexadecimal into Uint8Array', function () {
      expect(() => Exonum.hexadecimalToUint8Array('0438082601f8b38ae010a621a48f4b4cd021c4e6e69219e3c2d8abab482039ez'))
        .to.throw(TypeError, 'String of wrong type is passed. Hexadecimal expected.');

      [null, false, 42, new Date(), {}, []].forEach(function (value) {
        expect(() => Exonum.hexadecimalToUint8Array(value))
          .to.throw(TypeError, 'Wrong data type passed to convertor. Hexadecimal string is expected')
      })
    })
  })

  describe('Check Exonum.stringToUint8Array', function () {
    it('should convert valid string into Uint8Array', function () {
      const data = require('./data/convertors/stringToUint8Array.json')
      expect(Exonum.stringToUint8Array(data.from)).to.deep.equal(new Uint8Array(data.to))
    })

    it('should throw error when convert invalid string into Uint8Array', function () {
      [null, false, 42, new Date(), {}, []].forEach(function (value) {
        expect(() => Exonum.stringToUint8Array(value))
          .to.throw(TypeError, 'Wrong data type passed to convertor. String is expected')
      })
    })
  })

  describe('Check Exonum.binaryStringToUint8Array', function () {
    it('should convert valid binaryString into Uint8Array', function () {
      const data = require('./data/convertors/binaryStringToUint8Array.json')
      expect(Exonum.binaryStringToUint8Array(data.from)).to.deep.equal(new Uint8Array(data.to))
    })

    it('should throw error when convert wrong binaryString into Uint8Array', function () {
      [null, false, new Date(), {}, [], 42].forEach(function (value) {
        expect(() => Exonum.binaryStringToUint8Array(value))
          .to.throw(TypeError, 'Wrong data type passed to convertor. Binary string is expected')
      })
    })

    it('should throw error when convert invalid binaryString into Uint8Array', function () {
      ['102'].forEach(function (value) {
        expect(() => Exonum.binaryStringToUint8Array(value))
          .to.throw(TypeError, 'String of wrong type is passed. Binary string expected.')
      })
    })
  })

  describe('Check Exonum.uint8ArrayToHexadecimal', function () {
    it('should convert valid Uint8Array into hexadecimal', function () {
      const data = require('./data/convertors/uint8ArrayToHexadecimal.json')
      expect(Exonum.uint8ArrayToHexadecimal(new Uint8Array(data.from))).to.equal(data.to)
    })

    it('should throw error when convert invalid Uint8Array into hexadecimal', function () {
      [null, false, 42, new Date(), {}, 'Hello world', [4, 56]].forEach(function (value) {
        expect(() => Exonum.uint8ArrayToHexadecimal(value))
          .to.throw(TypeError, 'Wrong data type of array of 8-bit integers. Uint8Array is expected')
      })
    })
  })

  describe('Check Exonum.uint8ArrayToBinaryString', function () {
    it('should convert valid Uint8Array into binaryString', function () {
      const data = require('./data/convertors/uint8ArrayToBinaryString.json')
      expect(Exonum.uint8ArrayToBinaryString(new Uint8Array(data.from))).to.equal(data.to)
    })

    it('should throw error when convert invalid Uint8Array into binaryString', function () {
      [null, false, 42, new Date(), {}, 'Hello world', [4, 56]].forEach(function (value) {
        expect(() => Exonum.uint8ArrayToBinaryString(value))
          .to.throw(TypeError, 'Wrong data type of array of 8-bit integers. Uint8Array is expected')
      })
    })
  })

  describe('Check Exonum.binaryStringToHexadecimal', function () {
    it('should convert valid binaryString into hexadecimal', function () {
      const data = require('./data/convertors/binaryStringToHexadecimal.json')
      expect(Exonum.binaryStringToHexadecimal(data.from)).to.deep.equal(data.to)
    })

    it('should throw error when convert binaryString of wrong type into hexadecimal', function () {
      expect(() => Exonum.binaryStringToHexadecimal('102'))
        .to.throw(TypeError, 'String of wrong type is passed. Binary string expected.');

      [null, false, 42, new Date(), {}, []].forEach(function (value) {
        expect(() => Exonum.binaryStringToHexadecimal(value))
          .to.throw(TypeError, 'Wrong data type passed to convertor. Binary string is expected')
      })
    })
  })

  describe('Check Exonum.hexadecimalToBinaryString', function () {
    it('should convert valid hexadecimal into BinaryString', function () {
      const data = require('./data/convertors/hexadecimalToBinaryString.json')
      expect(Exonum.hexadecimalToBinaryString(data.from)).to.equal(data.to)
    })

    it('should throw error when convert invalid hexadecimal into binaryString', function () {
      expect(() => Exonum.hexadecimalToBinaryString('az'))
        .to.throw(TypeError, 'String of wrong type is passed. Hexadecimal expected.');

      [null, false, 42, new Date(), {}, []].forEach(function (value) {
        expect(() => Exonum.hexadecimalToBinaryString(value))
          .to.throw(TypeError, 'Wrong data type passed to convertor. Hexadecimal string is expected')
      })
    })

    it('should convert hexadecimal to BinaryString and back', function () {
      const hex = '0b513ad9b4924015ca0902ed079044d3ac5dbec2306f06948c10da8eb6e39f2d'
      expect(Exonum.binaryStringToHexadecimal(Exonum.hexadecimalToBinaryString(hex))).to.equal(hex)
    })
  })
})

/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const Exonum = require('../../src')

describe('Convert data from one type to another', function () {
  it('should convert hexadecimal string into Uint8Array', function () {
    const data = require('./data/converters/hexadecimalToUint8Array.json')
    expect(Exonum.hexadecimalToUint8Array(data.from)).to.deep.equal(new Uint8Array(data.to))
  })

  it('should convert string into Uint8Array', function () {
    const data = require('./data/converters/stringToUint8Array.json')
    expect(Exonum.stringToUint8Array(data.from)).to.deep.equal(new Uint8Array(data.to))
  })

  it('should convert binary string into Uint8Array', function () {
    const data = require('./data/converters/binaryStringToUint8Array.json')
    expect(Exonum.binaryStringToUint8Array(data.from)).to.deep.equal(new Uint8Array(data.to))
  })

  it('should convert Uint8Array into hexadecimal string', function () {
    const data = require('./data/converters/uint8ArrayToHexadecimal.json')
    expect(Exonum.uint8ArrayToHexadecimal(new Uint8Array(data.from))).to.equal(data.to)
  })

  it('should convert Uint8Array into binary string', function () {
    const data = require('./data/converters/uint8ArrayToBinaryString.json')
    expect(Exonum.uint8ArrayToBinaryString(new Uint8Array(data.from))).to.equal(data.to)
  })

  it('should convert binary string into hexadecimal', function () {
    const data = require('./data/converters/binaryStringToHexadecimal.json')
    expect(Exonum.binaryStringToHexadecimal(data.from)).to.deep.equal(data.to)
  })

  it('should convert hexadecimal string into binary string', function () {
    const data = require('./data/converters/hexadecimalToBinaryString.json')
    expect(Exonum.hexadecimalToBinaryString(data.from)).to.equal(data.to)
  })

  it('should convert hexadecimal string to binary string and back', function () {
    const hex = '0b513ad9b4924015ca0902ed079044d3ac5dbec2306f06948c10da8eb6e39f2d'
    expect(Exonum.binaryStringToHexadecimal(Exonum.hexadecimalToBinaryString(hex))).to.equal(hex)
  })
})

/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const Exonum = require('../../src')
const protobuf = require('protobufjs')
const Long = require('long')
const Type = protobuf.Type
const Field = protobuf.Field

describe('Check cryptography', function () {
  const keyPair = {
    publicKey: new Uint8Array([245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54]),
    secretKey: new Uint8Array([103, 82, 190, 136, 35, 20, 245, 187, 188, 154, 106, 242, 174, 99, 79, 192, 112, 56, 88, 74, 74, 119, 81, 14, 165, 236, 237, 69, 245, 77, 192, 48, 245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54])
  }
  const User = new Type('User').add(new Field('name', 1, 'string')).add(new Field('age', 2, 'int32'))
  const data = { name: 'John Doe', age: 29 }
  const hash = new Uint8Array([220, 85, 58, 17, 197, 19, 110, 184, 200, 155, 154, 176, 159, 237, 49, 67, 238, 59, 62, 128, 167, 54, 222, 82, 58, 7, 73, 214, 88, 183, 125, 195])
  const signature = new Uint8Array([204, 39, 136, 115, 147, 245, 192, 116, 103, 117, 163, 205, 16, 111, 66, 92, 192, 222, 20, 64, 127, 255, 150, 114, 32, 60, 230, 96, 37, 240, 148, 106, 76, 85, 93, 189, 235, 19, 45, 238, 86, 223, 52, 252, 141, 201, 229, 136, 182, 16, 204, 103, 68, 159, 39, 107, 157, 139, 252, 238, 141, 151, 57, 3])

  describe('Get SHA256 hash', function () {
    it('should return hash of data using .proto file', function () {
      expect(Exonum.hash(User, data)).to.deep.equal(hash)
    })
  })

  describe('Get ED25519 signature', function () {
    it('should return signature of the data of NewType type', function () {
      expect(Exonum.sign(User, data, keyPair.secretKey)).to.deep.equal(signature)
    })
  })

  describe('Verify signature', function () {
    it('should verify signature of the data', function () {
      expect(Exonum.verifySignature(User, data, signature, keyPair.publicKey)).to.be.true
    })
  })

  describe('Generate key pair', function () {
    it('should generate random key pair of secret and public keys', function () {
      let keyPair = Exonum.keyPair()
      expect(keyPair.publicKey).to.be.a('uint8array').to.have.lengthOf(32)
      expect(keyPair.secretKey).to.be.a('uint8array').to.have.lengthOf(64)
    })
  })

  describe('Generate random Uint64', function () {
    it('should generate random number of Uint64 type', function () {
      let number = Exonum.randomUint64()
      expect(Long.isLong(number)).to.be.true
    })
  })
})

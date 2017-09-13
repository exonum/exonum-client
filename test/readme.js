/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

var expect = require('chai').expect
var Exonum = require('../src')

describe('Examples from README.md', function () {
  describe('Custom type section', function () {
    var User = Exonum.newType({
      size: 9,
      fields: {
        name: {type: Exonum.String, size: 8, from: 0, to: 8},
        age: {type: Exonum.Int8, size: 1, from: 8, to: 9}
      }
    })
    var data = {
      name: 'Tom',
      age: 34
    }
    var keyPair = {
      publicKey: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
      secretKey: '978e3321bd6331d56e5f4c2bdb95bf471e95a77a6839e68d4241e7b0932ebe2bfa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'
    }
    var signature = 'c1db9a5f01ebdff27e02652a9aae5c9a4ac88787587dabceb9f471ae0b8e051b9632dfd26922f6abf24ff2d3275028fe286703d25ee7fe6b1711e89af4a7d307'

    it('should sign custom type', function () {
      expect(Exonum.sign(keyPair.secretKey, data, User)).to.equal(signature)
    })

    it('should verify custom type signature', function () {
      expect(Exonum.verifySignature(signature, keyPair.publicKey, data, User)).to.be.true
    })
  })

  describe('Transaction section', function () {
    var SendFunds = Exonum.newMessage({
      size: 72,
      network_id: 0,
      protocol_version: 0,
      service_id: 0,
      message_id: 0,
      fields: {
        from: {type: Exonum.Hash, size: 32, from: 0, to: 32},
        to: {type: Exonum.Hash, size: 32, from: 32, to: 64},
        amount: {type: Exonum.Uint64, size: 8, from: 64, to: 72}
      }
    })
    var data = {
      from: '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030',
      to: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
      amount: 50
    }
    var keyPair = {
      publicKey: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
      secretKey: '978e3321bd6331d56e5f4c2bdb95bf471e95a77a6839e68d4241e7b0932ebe2bfa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'
    }
    var signature = '8ff692b47d17f7738ec2d19f5296d3810909a62fe1480eb752b531f8e17056f6578985090db822612f88c3bcad4f0539401836e5ad58913c489784ff3e415a0b'

    it('should sign transaction', function () {
      expect(SendFunds.sign(keyPair.secretKey, data)).to.equal(signature)
    })

    it('should verify transaction signature', function () {
      expect(SendFunds.verifySignature(signature, keyPair.publicKey, data)).to.be.true
    })
  })
})

/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const Exonum = require('../src')

describe('Examples from README.md', function () {
  describe('Custom type section', function () {
    const User = Exonum.newType({
      fields: [
        { name: 'name', type: Exonum.String },
        { name: 'age', type: Exonum.Int8 }
      ]
    })
    const data = {
      name: 'Tom',
      age: 34
    }
    const keyPair = {
      publicKey: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
      secretKey: '978e3321bd6331d56e5f4c2bdb95bf471e95a77a6839e68d4241e7b0932ebe2bfa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'
    }
    const signature = 'c1db9a5f01ebdff27e02652a9aae5c9a4ac88787587dabceb9f471ae0b8e051b9632dfd26922f6abf24ff2d3275028fe286703d25ee7fe6b1711e89af4a7d307'

    it('should sign custom type', function () {
      expect(Exonum.sign(keyPair.secretKey, data, User)).to.equal(signature)
    })

    it('should verify custom type signature', function () {
      expect(Exonum.verifySignature(signature, keyPair.publicKey, data, User)).to.be.true
    })
  })

  describe('Transaction section', function () {
    const SendFunds = Exonum.newMessage({
      network_id: 0,
      protocol_version: 0,
      service_id: 0,
      message_id: 0,
      fields: [
        { name: 'from', type: Exonum.Hash },
        { name: 'to', type: Exonum.Hash },
        { name: 'amount', type: Exonum.Uint64 }
      ]
    })
    const data = {
      from: '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030',
      to: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
      amount: 50
    }
    const keyPair = {
      publicKey: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
      secretKey: '978e3321bd6331d56e5f4c2bdb95bf471e95a77a6839e68d4241e7b0932ebe2bfa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'
    }
    const signature = '8ff692b47d17f7738ec2d19f5296d3810909a62fe1480eb752b531f8e17056f6578985090db822612f88c3bcad4f0539401836e5ad58913c489784ff3e415a0b'
    const buffer = [0, 0, 0, 0, 0, 0, 146, 0, 0, 0, 103, 82, 190, 136, 35, 20, 245, 187, 188, 154, 106, 242, 174, 99, 79, 192, 112, 56, 88, 74, 74, 119, 81, 14, 165, 236, 237, 69, 245, 77, 192, 48, 245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54, 50, 0, 0, 0, 0, 0, 0, 0]

    it('should serialize transaction', function () {
      expect(SendFunds.serialize(data, true)).to.deep.equal(buffer)
    })

    it('should sign transaction', function () {
      expect(SendFunds.sign(keyPair.secretKey, data)).to.equal(signature)
    })

    it('should verify transaction signature', function () {
      expect(SendFunds.verifySignature(signature, keyPair.publicKey, data)).to.be.true
    })
  })
})

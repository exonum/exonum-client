/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const Exonum = require('../../src')

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
    const keyPair = {
      publicKey: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
      secretKey: '978e3321bd6331d56e5f4c2bdb95bf471e95a77a6839e68d4241e7b0932ebe2bfa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'
    }
    const SendFunds = Exonum.newTransaction({
      author: keyPair.publicKey,
      service_id: 130,
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
    const buffer = [250, 127, 158, 228, 58, 255, 112, 200, 121, 248, 15, 167, 253, 21, 149, 92, 24, 185, 140, 114, 49, 11, 9, 231, 129, 131, 16, 50, 80, 80, 207, 122, 0, 0, 130, 0, 0, 0, 103, 82, 190, 136, 35, 20, 245, 187, 188, 154, 106, 242, 174, 99, 79, 192, 112, 56, 88, 74, 74, 119, 81, 14, 165, 236, 237, 69, 245, 77, 192, 48, 245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54, 50, 0, 0, 0, 0, 0, 0, 0]
    const signature = '9c7d0e518eb547292b6326faf191dcdb2d97a48a0d0570dec955d3cc3f3bd1e6f6ca4a306675fecc2c144c2b636dfb2254c958b77cd27ea2d17fa1462f67080c'
    const hash = 'a0bd9da74d8329abe6ab7131a4a941e0bf6e5e2dded1197c6f75bbca42c81544'

    it('should serialize transaction', function () {
      expect(SendFunds.serialize(data)).to.deep.equal(buffer)
    })

    it('should sign transaction', function () {
      expect(SendFunds.sign(keyPair.secretKey, data)).to.equal(signature)
    })

    it('should verify transaction signature', function () {
      expect(SendFunds.verifySignature(signature, keyPair.publicKey, data)).to.be.true
    })

    it('should get transaction hash', function () {
      SendFunds.signature = signature
      expect(SendFunds.hash(data)).to.equal(hash)
    })
  })

  describe('Merkle tree verifying example', function () {
    it('should verify a Merkle tree', function () {
      const rootHash = '0b0f1916e7bba03e1e9cd8adf004072ef2ff83e41b8646b79ea3ab342c325925'
      const count = 3
      const proofNode = {
        left: {
          left: {
            val: {
              firstName: 'John',
              lastName: 'Doe',
              age: 28,
              balance: 2500
            }
          },
          right: '8dc134fc6f0e0b7fccd32bb0f6090e68600710234c1cb318261d5e78be659bd1'
        },
        right: '3b45eedc6952cbec6a8b769c3e50f96d1d059853bbedb7c26f8621243b308e9a'
      }
      const range = [0, 0]
      let user = Exonum.newType({
        fields: [
          { name: 'firstName', type: Exonum.String },
          { name: 'lastName', type: Exonum.String },
          { name: 'age', type: Exonum.Uint8 },
          { name: 'balance', type: Exonum.Uint32 }
        ]
      })

      expect(Exonum.merkleProof(rootHash, count, proofNode, range, user)).to.deep.equal([
        {
          firstName: 'John',
          lastName: 'Doe',
          age: 28,
          balance: 2500
        }
      ])
    })

    it('should verify a Merkle tree with elements passed as hashes', function () {
      const rootHash = 'd61dc473664954eaffc1c418a55cab83f7b49cc4276a8a799a42cbdc9722a009'
      const count = 2
      const proofNode = {
        left: {
          val: 'c19569c5b391b1106e16021f50d20763cbece4199fd1356f2d3e429ff13e1345'
        },
        right: {
          val: '3e1ff2f54195207e42d36ff0de1b345be9c59111b67263c31364506d11e2190f'
        }
      }
      const range = [0, 8]

      expect(Exonum.merkleProof(rootHash, count, proofNode, range)).to.deep.equal([
        'c19569c5b391b1106e16021f50d20763cbece4199fd1356f2d3e429ff13e1345',
        '3e1ff2f54195207e42d36ff0de1b345be9c59111b67263c31364506d11e2190f'
      ])
    })

    it('should verify a Merkle tree with elements passed as byte arrays', function () {
      const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
      const count = 8
      const proofNode = {
        left: {
          left: {
            left: { val: [1, 2] },
            right: { val: [2, 3] }
          },
          right: {
            left: { val: [3, 4] },
            right: { val: [4, 5] }
          }
        },
        right: {
          left: {
            left: { val: [5, 6] },
            right: { val: [6, 7] }
          },
          right: {
            left: { val: [7, 8] },
            right: { val: [8, 9] }
          }
        }
      }
      const range = [0, 8]

      expect(Exonum.merkleProof(rootHash, count, proofNode, range)).to.deep.equal([
        [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]
      ])
    })
  })

  describe('Block verifying example', function () {
    it('should verify a block', function () {
      const data = {
        block: {
          height: '2',
          prev_hash: '5107fe929f173a8fbe609ef907797daab959c6838eb26e074d80534c772e879a',
          proposer_id: 3,
          state_hash: '5f59a6b7810f2cde8a90a4b281c5722d0718cda07f1f321e531c5305ed3baf0e',
          tx_count: 3,
          tx_hash: '09224d3618942784363789a34e016f6f8e683f2ec96a5b9c51c23a02bca2ae1d'
        },
        precommits: [
          {
            payload: {
              block_hash: '7de0d426f0f287849f89e5758015aca00f2e85eda28d2c38581519e0f1de8105',
              height: '2',
              propose_hash: 'e000ec445f25b61d2ac9d38882cffcd59aa02c08a30b2173c5526b89dccd1fcd',
              round: 1,
              time: {
                nanos: 336073000,
                secs: '1537799426'
              },
              validator: 3
            },
            message: 'e6264b7f37f1fc2b4719d89a1360c25ad8b98e9723b485080382761ede1f318201000300020000000000000001000000e000ec445f25b61d2ac9d38882cffcd59aa02c08a30b2173c5526b89dccd1fcd7de0d426f0f287849f89e5758015aca00f2e85eda28d2c38581519e0f1de810502f5a85b00000000281108142da1ea5a2eb4b058a37a69ffb721b7f16c319a4fa1fd34c29efc9bedec454382f9c606a6574349d65be17154465eeb68c4558ca5a1e68a5cc8537aaf81ed780e'
          },
          {
            payload: {
              block_hash: '7de0d426f0f287849f89e5758015aca00f2e85eda28d2c38581519e0f1de8105',
              height: '2',
              propose_hash: 'e000ec445f25b61d2ac9d38882cffcd59aa02c08a30b2173c5526b89dccd1fcd',
              round: 1,
              time: {
                nanos: 336482000,
                secs: '1537799426'
              },
              validator: 0
            },
            message: '2bcd527a39ed80e7da4b767f402b6959cd74ce6980ce0a28c8b2e8a11c99b1f101000000020000000000000001000000e000ec445f25b61d2ac9d38882cffcd59aa02c08a30b2173c5526b89dccd1fcd7de0d426f0f287849f89e5758015aca00f2e85eda28d2c38581519e0f1de810502f5a85b00000000d04e0e14b7235d000fe404a4b9695c0a08c4fc763c9012685b0b37abb0e5b24425e98813c7f1b3a3c8c5cf31e97ada34d63830669ddb072bfc637e16c8d5922538121901'
          },
          {
            payload: {
              block_hash: '7de0d426f0f287849f89e5758015aca00f2e85eda28d2c38581519e0f1de8105',
              height: '2',
              propose_hash: 'e000ec445f25b61d2ac9d38882cffcd59aa02c08a30b2173c5526b89dccd1fcd',
              round: 1,
              time: {
                nanos: 338473000,
                secs: '1537799426'
              },
              validator: 2
            },
            message: 'c9decf2e0d150eec438242c37e628cc2eb5c45d6b18fb8b75c3f9be6529825a401000200020000000000000001000000e000ec445f25b61d2ac9d38882cffcd59aa02c08a30b2173c5526b89dccd1fcd7de0d426f0f287849f89e5758015aca00f2e85eda28d2c38581519e0f1de810502f5a85b0000000028b02c1426a2f9e45be72e3cc986eaa8b3a351d6bc8742653c11ba9fc37e1739addfc535bec2a203ebe345a1bbe637fdb3ce4d63974b20e721928b26a471cc6399d73809'
          }
        ]
      }
      const validators = [
        '2bcd527a39ed80e7da4b767f402b6959cd74ce6980ce0a28c8b2e8a11c99b1f1',
        '48dbd790d25e0705f2077b1406b4eb64ccf0dd33a8a2215bb840f26f05c6bc1e',
        'c9decf2e0d150eec438242c37e628cc2eb5c45d6b18fb8b75c3f9be6529825a4',
        'e6264b7f37f1fc2b4719d89a1360c25ad8b98e9723b485080382761ede1f3182'
      ]

      expect(Exonum.verifyBlock(data, validators)).to.equal(true)
    })
  })
})

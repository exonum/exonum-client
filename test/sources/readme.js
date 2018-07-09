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
    const SendFunds = Exonum.newMessage({
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
          height: '171',
          prev_hash: '7312470bbfed9a5df2cdd5a4dfca5e26cbc14fbde1a22ca9de14b56d653309be',
          proposer_id: 0,
          state_hash: '5fb7f245684709df9163dbe0d5b9cbfadadbda0c1133147356e355c8e46eceb4',
          tx_count: 4,
          tx_hash: 'a54d5ee4ee1a382e2d124e4d2f393226528b08368af5e2264eef991dee4ab379'
        },
        precommits: [
          {
            body: {
              block_hash: '08ca6f2da642e26c883010d12ef64df0638974863201e213af3d73a9f3c4733d',
              height: '171',
              propose_hash: '84da70e66af5c4e8eb7f4b76e7f10b637feffeb0b71ef0906eed4c969e38254c',
              round: 1,
              time: {
                nanos: 160188000,
                secs: '1531146090'
              },
              validator: 0
            },
            message_id: 4,
            protocol_version: 0,
            service_id: 0,
            signature: '672d9e1b3fb5e39f27a9c4d51b073f9e77a9ece054374ef63160e7b892d74c5b92b03241399b0e7284de87bf43c0a9fa2d37cd1606eef3ad5065ec563a814a02'
          },
          {
            body: {
              block_hash: '08ca6f2da642e26c883010d12ef64df0638974863201e213af3d73a9f3c4733d',
              height: '171',
              propose_hash: '84da70e66af5c4e8eb7f4b76e7f10b637feffeb0b71ef0906eed4c969e38254c',
              round: 1,
              time: {
                nanos: 160165000,
                secs: '1531146090'
              },
              validator: 2
            },
            message_id: 4,
            protocol_version: 0,
            service_id: 0,
            signature: 'd4ae174c6d64a3e689e2b99507688e7cbef3f6d0a6076ff0e613a913a642e282ec1dc4bde6f43bc0463b3425a559a7454c1d7f76709569b77dbb3f1f93b95805'
          },
          {
            body: {
              block_hash: '08ca6f2da642e26c883010d12ef64df0638974863201e213af3d73a9f3c4733d',
              height: '171',
              propose_hash: '84da70e66af5c4e8eb7f4b76e7f10b637feffeb0b71ef0906eed4c969e38254c',
              round: 1,
              time: {
                nanos: 160267000,
                secs: '1531146090'
              },
              validator: 3
            },
            message_id: 4,
            protocol_version: 0,
            service_id: 0,
            signature: '466836a761c7b08cd01f867153328054f0aea8e417bb8acd554ec74d0364e99677959bfdeb519ab4c7e25dbb87d7fb933411c8894d59a40b80e992101d02370a'
          }
        ]
      }
      const validators = [
        '3af676455d2f6ae08c21c61d48523be3e293b4b2c062b1754ae1fe63b066687d',
        '5831dfb1ed7546fd64ab33a53d78478722ee4a66bb8323fd45eaabe2c50703aa',
        '8b2d61a718a75e432fa581cc9781e24c82073994549e7f7126cb0ac9d55d554a',
        'ccf74bf9423b0253e223a17ecfdc852d46665b74ab36b05d4f4fe9c651c57e6d'
      ]
      const networkId = 0

      expect(Exonum.verifyBlock(data, validators, networkId)).to.equal(true)
    })
  })
})

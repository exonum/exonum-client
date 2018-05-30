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
          height: '4',
          prev_hash: '2e933eba2887a1d9bb38c396577be23db58ea5f414761f6dda939d660b323140',
          proposer_id: 0,
          schema_version: 0,
          state_hash: 'da5ae8362137d3e4acae0917e30388959b6d2a91760d25bb5eca832b449550ce',
          tx_count: 1,
          tx_hash: '759de4b2df16488e1c13c20cb9a356487204abcedd97177f2fe773c187beb29e'
        },
        precommits: [
          {
            body: {
              block_hash: '1a1b6bf4c9f7543809e1011b1d5e4ad0b76eab14924d8ff00ba1a79f0466ce6b',
              height: '4',
              propose_hash: '878165361bb6b207ca75cac83e2817b34564a9b5115128b21f4f89f729d60769',
              round: 4,
              time: {
                nanos: 804000000,
                secs: '1486720350'
              },
              validator: 0
            },
            message_id: 4,
            protocol_version: 0,
            service_id: 0,
            signature: 'f69f1cd9bd8dfd822a923f427556842b2cb194b75fc437248a6260f218e0d188911c1ef4616db3edcda78176d8d56273417439a1824a90e5df16775edb8dd608'
          },
          {
            body: {
              block_hash: '1a1b6bf4c9f7543809e1011b1d5e4ad0b76eab14924d8ff00ba1a79f0466ce6b',
              height: '4',
              propose_hash: '878165361bb6b207ca75cac83e2817b34564a9b5115128b21f4f89f729d60769',
              round: 4,
              time: {
                nanos: 804000000,
                secs: '1486720350'
              },
              validator: 1
            },
            message_id: 4,
            protocol_version: 0,
            service_id: 0,
            signature: '0660b18a35e6e9ee2a9f9447a2362a1e498314843aa8ddb838a81112dd2b290ff54cdd089a1877a82c3505b7376dc91e7e0d0f9a1150064ce1199a12845d560b'
          },
          {
            body: {
              block_hash: '1a1b6bf4c9f7543809e1011b1d5e4ad0b76eab14924d8ff00ba1a79f0466ce6b',
              height: '4',
              propose_hash: '878165361bb6b207ca75cac83e2817b34564a9b5115128b21f4f89f729d60769',
              round: 4,
              time: {
                nanos: 804000000,
                secs: '1486720350'
              },
              validator: 2
            },
            message_id: 4,
            protocol_version: 0,
            service_id: 0,
            signature: '02e26fac66f7e6fd9013f34832d53f7bbf928bd5824900594f8a247d4f4ec5f84c77420dd2bb98ebbf0910e48539d3abd9b57be70f15ca5ceccb85a92d41270a'
          }
        ]
      }
      const validators = [
        '0b513ad9b4924015ca0902ed079044d3ac5dbec2306f06948c10da8eb6e39f2d',
        '91a28a0b74381593a4d9469579208926afc8ad82c8839b7644359b9eba9a4b3a',
        '5c9c6df261c9cb840475776aaefcd944b405328fab28f9b3a95ef40490d3de84',
        '66cd608b928b88e50e0efeaa33faf1c43cefe07294b0b87e9fe0aba6a3cf7633'
      ]
      const networkId = 0

      expect(Exonum.verifyBlock(data, validators, networkId)).to.equal(true)
    })
  })
})

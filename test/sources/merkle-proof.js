/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const Exonum = require('../../src')

describe('Check proof of Merkle tree', function () {
  it('should return array of children of valid tree', function () {
    const data = require('./data/merkle-tree/valid-merkle-tree.json')
    const elements = Exonum.merkleProof(
      data.root_hash,
      data.list_length,
      data.proof,
      [data.range_st, data.range_end - 1]
    )
    expect(elements).to.deep.equal([
      [153, 209, 189, 13, 222, 26, 107, 28, 238, 121],
      [98, 142, 223, 244, 216, 184, 203, 213, 158, 53],
      [152, 213, 96, 73, 235, 62, 222, 64, 239, 47],
      [43, 93, 185, 75, 181, 229, 155, 34, 13, 95],
      [30, 13, 8, 60, 72, 173, 0, 135, 185, 216],
      [210, 127, 166, 231, 147, 251, 53, 14, 79, 139]
    ])
  })

  it('should return array of children of valid tree with range end placed out of possible range', function () {
    const data = require('./data/merkle-tree/valid-merkle-tree-with-single-node.json')
    const elements = Exonum.merkleProof(
      data.root_hash,
      data.list_length,
      data.proof,
      [data.range_st, data.range_end - 1]
    )
    expect(elements).to.deep.equal([[7, 8]])
  })

  it('should return array of children of fully balanced valid tree contained all its values', function () {
    const data = require('./data/merkle-tree/valid-merkle-tree-fully-balanced-with-all-values.json')
    const elements = Exonum.merkleProof(
      data.root_hash,
      data.list_length,
      data.proof,
      [data.range_st, data.range_end - 1]
    )
    expect(elements).to.deep.equal([
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 8],
      [8, 9]
    ])
  })

  it('should return array of children of valid tree with byte arrays as values', function () {
    const data = require('./data/merkle-tree/valid-merkle-tree-with-byte-arrays-as-values.json')
    const elements = Exonum.merkleProof(
      data.root_hash,
      data.list_length,
      data.proof,
      [data.range_st, data.range_end - 1]
    )
    expect(elements).to.deep.equal([
      [134, 140, 39, 206, 51, 52, 195, 129, 247, 238],
      [84, 134, 129, 99, 48, 28, 82, 50, 93, 196],
      [45, 124, 194, 40, 35, 96, 7, 14, 48, 166],
      [104, 30, 36, 155, 141, 166, 50, 66, 130, 59],
      [71, 245, 109, 245, 106, 82, 135, 138, 7, 206],
      [130, 111, 152, 31, 191, 42, 164, 205, 231, 252],
      [245, 155, 171, 154, 248, 151, 236, 42, 191, 220],
      [142, 41, 214, 159, 138, 88, 96, 37, 168, 152],
      [72, 118, 53, 38, 28, 102, 73, 130, 155, 215],
      [74, 72, 222, 50, 126, 175, 106, 176, 37, 34],
      [202, 34, 199, 21, 92, 67, 252, 33, 242, 149],
      [58, 91, 16, 23, 28, 38, 6, 27, 175, 200],
      [176, 2, 74, 250, 195, 70, 5, 248, 59, 115],
      [146, 85, 144, 140, 96, 8, 146, 75, 72, 91],
      [47, 98, 201, 204, 234, 233, 165, 77, 246, 73],
      [91, 134, 200, 73, 133, 205, 196, 86, 35, 253],
      [216, 157, 155, 28, 62, 73, 62, 207, 184, 122],
      [245, 128, 59, 70, 154, 65, 121, 169, 105, 93],
      [67, 110, 177, 128, 72, 158, 184, 160, 4, 93],
      [132, 150, 196, 184, 156, 220, 85, 92, 92, 61],
      [213, 187, 98, 6, 233, 192, 214, 227, 60, 246],
      [45, 65, 193, 165, 142, 100, 62, 74, 85, 209],
      [255, 67, 195, 154, 198, 53, 193, 2, 49, 241],
      [210, 142, 17, 96, 110, 17, 244, 153, 0, 46],
      [234, 136, 214, 84, 253, 222, 163, 72, 71, 105],
      [3, 115, 88, 172, 97, 196, 90, 212, 205, 132],
      [177, 140, 40, 229, 184, 197, 217, 42, 109, 225],
      [14, 249, 85, 137, 49, 190, 156, 54, 178, 3],
      [111, 112, 225, 191, 224, 71, 122, 203, 240, 229],
      [27, 181, 5, 56, 101, 140, 202, 133, 115, 47],
      [36, 169, 57, 208, 5, 45, 192, 7, 243, 75],
      [204, 166, 207, 121, 60, 169, 67, 24, 151, 32],
      [234, 60, 223, 214, 36, 45, 108, 57, 97, 215],
      [101, 68, 97, 69, 31, 9, 112, 57, 141, 216],
      [193, 195, 246, 1, 251, 236, 251, 61, 34, 15],
      [59, 28, 43, 157, 109, 174, 124, 36, 233, 103],
      [74, 30, 117, 221, 98, 143, 93, 233, 23, 55],
      [222, 142, 49, 194, 65, 209, 129, 7, 59, 21],
      [69, 63, 120, 84, 91, 70, 47, 31, 53, 103],
      [90, 253, 215, 215, 205, 251, 83, 48, 104, 60],
      [231, 41, 98, 179, 65, 117, 188, 207, 119, 41],
      [36, 200, 100, 145, 250, 5, 119, 75, 185, 90],
      [133, 88, 242, 35, 31, 100, 120, 72, 24, 43],
      [162, 241, 122, 52, 45, 26, 80, 74, 207, 174],
      [227, 171, 104, 45, 53, 6, 224, 122, 63, 152],
      [28, 190, 118, 21, 228, 207, 59, 57, 14, 238],
      [15, 174, 207, 133, 33, 250, 255, 114, 212, 251],
      [78, 246, 199, 16, 242, 30, 227, 180, 11, 140],
      [107, 215, 252, 1, 83, 162, 226, 202, 108, 30],
      [202, 41, 224, 85, 108, 41, 212, 43, 42, 21],
      [100, 179, 227, 200, 52, 241, 218, 146, 207, 12],
      [249, 228, 104, 62, 29, 205, 114, 224, 2, 9],
      [149, 186, 219, 31, 35, 226, 98, 117, 175, 131],
      [65, 103, 187, 61, 247, 78, 229, 253, 195, 249],
      [82, 254, 51, 253, 80, 64, 123, 197, 4, 145],
      [96, 87, 57, 243, 4, 96, 208, 54, 241, 217],
      [25, 195, 86, 44, 201, 196, 46, 11, 46, 173],
      [190, 79, 87, 197, 179, 0, 24, 98, 72, 236],
      [173, 39, 181, 15, 8, 31, 75, 47, 3, 173],
      [237, 62, 253, 9, 133, 234, 182, 205, 221, 108],
      [114, 162, 4, 109, 169, 106, 177, 191, 166, 233],
      [73, 90, 126, 189, 180, 122, 176, 25, 178, 220],
      [127, 218, 96, 130, 82, 12, 22, 94, 224, 239],
      [81, 2, 17, 94, 239, 202, 34, 126, 142, 203],
      [83, 156, 6, 113, 67, 30, 165, 255, 103, 116],
      [148, 13, 58, 190, 230, 143, 16, 183, 116, 162],
      [145, 149, 64, 53, 226, 178, 95, 255, 66, 212],
      [16, 255, 210, 237, 154, 167, 59, 12, 146, 106],
      [42, 182, 237, 121, 206, 58, 234, 33, 57, 179],
      [146, 109, 161, 235, 50, 152, 154, 204, 249, 233],
      [106, 37, 197, 193, 108, 6, 226, 7, 120, 12]
    ])
  })

  it('should return array of children of valid tree with hashes as values', function () {
    const data = require('./data/merkle-tree/valid-merkle-tree-with-hashes-as-values.json')
    const elements = Exonum.merkleProof(
      data.root_hash,
      data.list_length,
      data.proof,
      [data.range_st, data.range_end - 1]
    )
    expect(elements).to.deep.equal([
      'eeeebb395347996b3ee7aa2e91f9b74c498c84440ec98bc1dac97fa8a3aac38c',
      'fc44dbdc3cf6adbe4b75937c3cca9d632abaf53d8326fe8a8943964a25cf2e1e',
      'a90939b4eaefcaf740ca80a704efafa25230e4995eeb381e9410d7b07b1b140b'
    ])
  })

  it('should throw error when the tree with rootHash of wrong type', function () {
    const args = [
      true,
      null,
      undefined,
      [],
      {},
      42,
      new Date()
    ]

    args.forEach(function (rootHash) {
      expect(() => Exonum.merkleProof(rootHash, 8, {}, [0, 8])).to.throw(TypeError)
    })
  })

  it('should throw error when the tree with invalid rootHash', function () {
    const args = [
      '6z56f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
      '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1'
    ]

    args.forEach(function (rootHash) {
      expect(() => Exonum.merkleProof(rootHash, 8, {}, [0, 8])).to.throw(Error)
    })
  })

  it('should throw error when the tree with invalid count', function () {
    const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
    const args = [
      true,
      null,
      undefined,
      [],
      {},
      'Hello world',
      new Date()
    ]

    args.forEach(function (count) {
      expect(() => Exonum.merkleProof(rootHash, count, {}, [0, 8])).to.throw(Error)
    })
  })

  it('should throw error when the tree with count below', function () {
    const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13';

    [-42, '-42'].forEach(function (count) {
      expect(() => Exonum.merkleProof(rootHash, count, {}, [0, 8])).to.throw(RangeError)
    })
  })

  it('should throw error when the tree with invalid proofNode', function () {
    const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
    const args = [
      true,
      null,
      undefined,
      [],
      'Hello world',
      42,
      new Date()
    ]

    args.forEach(function (proofNode) {
      expect(() => Exonum.merkleProof(rootHash, 8, proofNode, [0, 8])).to.throw(TypeError)
    })
  })

  it('should throw error when the tree with invalid range', function () {
    const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
    const args = [
      true, null, undefined, [], {}, 'Hello world', 42, new Date(),
      [0], [0, 8, 16],
      [true, 8], [null, 8], [undefined, 8], [[], 8], [{}, 8], ['Hello world', 8], [new Date(), 8],
      [8, true], [8, null], [8, undefined], [8, []], [8, {}], [8, 'Hello world'], [8, new Date()]
    ]

    args.forEach(function (range) {
      expect(() => Exonum.merkleProof(rootHash, 8, {}, range)).to.throw(Error)
    })
  })

  it('should throw error when the tree with invalid range', function () {
    const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13';

    [[-1, 8], ['-1', 8], [0, -1], [0, '-1']].forEach(function (range) {
      expect(() => Exonum.merkleProof(rootHash, 8, {}, range)).to.throw(RangeError)
    })
  })

  it('should throw error when the tree with range start is out of range', function () {
    const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
    const count = 8
    const proofNode = {}
    const range = [9, 8]

    expect(() => Exonum.merkleProof(rootHash, count, proofNode, range)).to.throw(RangeError)
  })

  it('should return empty array when the tree with elements that out of tree range', function () {
    const elements = Exonum.merkleProof(
      '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
      8,
      {},
      [9, 9]
    )
    expect(elements).to.deep.equal([])
  })

  it('should throw error when the tree with leaf on wrong height', function () {
    const data = require('./data/merkle-tree/invalid-merkle-tree-with-leaf-on-wrong-height.json')
    const rootHash = data.root_hash
    const count = data.list_length
    const proofNode = data.proof
    const range = [data.range_st, data.range_end - 1]

    expect(() => Exonum.merkleProof(rootHash, count, proofNode, range)).to.throw(Error)
  })

  it('should throw error when the tree with wrong index of value node', function () {
    const data = require('./data/invalid-merkle-tree-with-wrong-index-of-value-node.json')
    const rootHash = data.root_hash
    const count = data.list_length
    const proofNode = data.proof
    const range = [data.range_st, data.range_end - 1]

    expect(() => Exonum.merkleProof(rootHash, count, proofNode, range)).to.throw(Error)
  })

  it('should throw error when the tree with value on wrong position', function () {
    const data = require('./data/invalid-merkle-tree-with-value-on-wrong-position.json')
    const rootHash = data.root_hash
    const count = data.list_length
    const proofNode = data.proof
    const range = [data.range_st, data.range_end - 1]

    expect(() => Exonum.merkleProof(rootHash, count, proofNode, range)).to.throw(Error)
  })

  it('should throw error when the tree with invalid type of type parameter', function () {
    [null, 42, [], new Date()].forEach(function (type) {
      const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
      const count = 2
      const proofNode = {
        left: { val: [255, 128] },
        right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
      }
      const range = [0, 2]

      expect(() => Exonum.merkleProof(rootHash, count, proofNode, range, type)).to.throw(Error)
    })
  })

  it('should throw error when the tree with invalid value', function () {
    const Type = Exonum.newType({
      fields: [
        { name: 'hash', type: Exonum.Hash }
      ]
    });

    [42, 'Hello world', [], new Date()].forEach(function (val) {
      const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
      const count = 2
      const proofNode = {
        left: { val: val },
        right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
      }
      const range = [0, 2]

      expect(() => Exonum.merkleProof(rootHash, count, proofNode, range, Type)).to.throw(Error)
    })
  })

  it('should throw error when the tree with invalid value not corresponding to passed type', function () {
    const Type = Exonum.newType({
      fields: [
        { name: 'hash', type: Exonum.Hash }
      ]
    })
    const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
    const count = 2
    const proofNode = {
      left: { val: { name: 'John' } },
      right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
    }
    const range = [0, 2]

    expect(() => Exonum.merkleProof(rootHash, count, proofNode, range, Type)).to.throw(TypeError)
  })

  it('should throw error when the tree with invalid array of 8-bit integers as value', function () {
    const args = [
      true, {}, 42, 'Hello world', new Date(),
      [153, 256], [153, -1], [153, true], [153, null],
      [153, undefined], [153, 'Hello world'], [153, {}], [153, []], [153, new Date()]
    ]

    args.forEach(function (val) {
      const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
      const count = 2
      const proofNode = {
        left: { val: val },
        right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
      }
      const range = [0, 2]

      expect(() => Exonum.merkleProof(rootHash, count, proofNode, range)).to.throw(Error)
    })
  })

  it('should throw error when the tree with missed left node', function () {
    const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
    const count = 4
    const proofNode = {
      left: {
        right: { val: [255, 128] }
      },
      right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
    }
    const range = [0, 2]

    expect(() => Exonum.merkleProof(rootHash, count, proofNode, range)).to.throw(Error)
  })

  it('should throw error when the tree with invalid string in left node', function () {
    const args = [
      'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fz',
      'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365c',
      'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fa52',
      '',
      true,
      null,
      undefined,
      [],
      42
    ]

    args.forEach(function (hash) {
      const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
      const count = 2
      const proofNode = {
        left: hash,
        right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
      }
      const range = [0, 2]

      expect(() => Exonum.merkleProof(rootHash, count, proofNode, range)).to.throw(Error)
    })
  })

  it('should throw error when the tree with invalid string in right node', function () {
    const args = [
      'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fz',
      'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365c',
      'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fa52',
      '',
      true,
      null,
      undefined,
      [],
      42
    ]

    args.forEach(function (hash) {
      const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
      const count = 2
      const proofNode = {
        left: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc',
        right: hash
      }
      const range = [0, 2]

      expect(() => Exonum.merkleProof(rootHash, count, proofNode, range)).to.throw(Error)
    })
  })

  it('should throw error when the tree with missed right leaf inside right tree branch', function () {
    const data = require('./data/merkle-tree/invalid-merkle-tree-missed-right-leaf-on-left-branch.json')
    const rootHash = data.root_hash
    const count = data.list_length
    const proofNode = data.proof
    const range = [data.range_st, data.range_end - 1]

    expect(() => Exonum.merkleProof(rootHash, count, proofNode, range)).to.throw(Error)
  })

  it('should throw error when the tree with wrong rootHash', function () {
    const data = require('./data/invalid-merkle-tree-with-wrong-root-hash.json')
    const rootHash = data.root_hash
    const count = data.list_length
    const proofNode = data.proof
    const range = [data.range_st, data.range_end - 1]

    expect(() => Exonum.merkleProof(rootHash, count, proofNode, range)).to.throw(Error)
  })

  it('should throw error when the tree with wrong amount of elements', function () {
    const data = require('./data/invalid-merkle-tree-with-wrong-amount-of-elements.json')
    const rootHash = data.root_hash
    const count = data.list_length
    const proofNode = data.proof
    const range = [data.range_st, data.range_end - 1]

    expect(() => Exonum.merkleProof(rootHash, count, proofNode, range)).to.throw(Error)
  })
})

/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const Exonum = require('../src')

describe('Check proof of Merkle Patricia tree', function () {
  it('should return null when an empty tree', function () {
    const data = require('./common_data/merkle-patricia-tree/valid-MPT-empty-tree.json')
    const element = Exonum.merklePatriciaProof(
      data.root_hash,
      data.proof,
      data.searched_key
    )
    expect(element).to.be.null
  })

  it('should return null when valid tree with leaf exclusive', function () {
    const data = require('./common_data/merkle-patricia-tree/valid-MPT-leaf-exclusive.json')
    const element = Exonum.merklePatriciaProof(
      data.root_hash,
      data.proof,
      data.searched_key
    )
    expect(element).to.be.null
  })

  it('should return the child of valid tree with leaf inclusive', function () {
    const data = require('./common_data/merkle-patricia-tree/valid-MPT-leaf-inclusive.json')
    const element = Exonum.merklePatriciaProof(
      data.root_hash,
      data.proof,
      data.searched_key
    )
    expect(element).to.deep.equal([2])
  })

  it('should return null when a tree with nested node exclusive', function () {
    const data = require('./common_data/merkle-patricia-tree/valid-MPT-nested-exclusive.json')
    const element = Exonum.merklePatriciaProof(
      data.root_hash,
      data.proof,
      data.searched_key
    )
    expect(element).to.be.null
  })

  it('should return the child of an valid tree with nested node inclusive', function () {
    const data = require('./common_data/merkle-patricia-tree/valid-MPT-nested-inclusive.json')
    const element = Exonum.merklePatriciaProof(
      data.root_hash,
      data.proof,
      data.searched_key
    )
    expect(element).to.deep.equal([36, 49, 15, 31, 163, 171, 247, 217])
  })

  it('should return the child of an valid tree with hash stored in value', () => {
    const data = require('./common_data/merkle-patricia-tree/valid-MPT-values.json')
    const element = Exonum.merklePatriciaProof(
      data.root_hash,
      data.proof,
      data.searched_key
    )
    expect(element).to.equal('2cc250e3c24b9d91f26b162d79b5031684607bf1c406581281953a14dc149c70')
  })

  it('should return the child of an valid tree with children which has common prefix', function () {
    const data = require('./common_data/merkle-patricia-tree/valid-MPT-common-prefix-children.json')
    const element = Exonum.merklePatriciaProof(
      data.root_hash,
      data.proof,
      data.searched_key
    )
    expect(element).to.deep.equal([186, 86, 216, 153, 23, 168, 188, 225])
  })

  it('should throw error when keys one key is full prefix of another', function () {
    const data = require('./data/invalid-MPT-common-prefix-children.json')
    expect(() => Exonum.merklePatriciaProof(data.root_hash, data.proof, data.searched_key)).to.throw(Error, 'Impossible to determine left and right nodes.')
  })

  it('should throw error when common-prefix keys are found on non-zero level', function () {
    const data = require('./data/invalid-MPT-common-prefix-children-at-non-zero-lvl.json')
    expect(() => Exonum.merklePatriciaProof(data.root_hash, data.proof, data.searched_key)).to.throw(Error, 'Nodes with common-prefix keys are located on non-zero level of the tree.')
  })

  it('should throw error when key suffix is of zero-length', function () {
    const data = require('./data/invalid-MPT-zero-len-keys-suffix.json')
    expect(() => Exonum.merklePatriciaProof(data.root_hash, data.proof, data.searched_key)).to.throw(Error, 'Empty key suffix is passed.')
  })

  it('should return the child of an valid tree with children which has common prefix and hashes as values', function () {
    const data = require('./common_data/merkle-patricia-tree/valid-MPT-common-prefix-children-hash-values.json')
    const element = Exonum.merklePatriciaProof(
      data.root_hash,
      data.proof,
      data.searched_key
    )
    expect(element).to.equal('7acfd59d96d77ed99169fdc0826a6ef8a6b45d87ac00536373882dfa7ba70925')
  })

  it('should throw error when rootHash parameter of wrong type', function () {
    const args = [
      true, null, undefined, [], {}, 42, new Date()
    ]

    args.forEach(function (rootHash) {
      expect(() => Exonum.merklePatriciaProof(rootHash)).to.throw(TypeError)
    })
  })

  it('should throw error when invalid rootHash parameter', function () {
    const args = [
      '6z56f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
      '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1'
    ]

    args.forEach(function (rootHash) {
      expect(() => Exonum.merklePatriciaProof(rootHash)).to.throw(Error)
    })
  })

  it('should throw error when invalid proofNode parameter', function () {
    const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
    const args = [
      true, null, undefined, [], 42, 'Hello world', new Date()
    ]

    args.forEach(function (proofNode) {
      expect(() => Exonum.merklePatriciaProof(rootHash, proofNode)).to.throw(TypeError)
    })
  })

  it('should throw error when invalid byte array key parameter', function () {
    const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
    const proofNode = {}
    const args = [
      [1, 114],
      [1, true, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0],
      [1, null, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0],
      [1, undefined, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0],
      [1, {}, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0],
      [1, new Date(), 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0],
      [1, 256, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0],
      [1, -1, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0]
    ]

    args.forEach(function (key) {
      expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
    })
  })

  it('should throw error when invalid string key parameter', function () {
    const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
    const proofNode = {}
    const args = [
      '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1',
      '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1z',
      ''
    ]

    args.forEach(function (key) {
      expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
    })
  })

  it('should throw error when key parameter of wrong type', function () {
    const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
    const proofNode = {}
    const args = [
      true, null, undefined, 42, [], {}, new Date()
    ]

    args.forEach(function (key) {
      expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
    })
  })

  it('should throw error when root is empty but rootHash is wrong', function () {
    const rootHash = '0000000000000000000000000000000000000000000000000000000000000001'
    const proofNode = {}
    const key = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
  })

  it('should throw error when key of node is invalid binary string', function () {
    const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
    let proofNode = { '11110000111100': {} }
    const key = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)

    proofNode = { '111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001a': {} }

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)

    proofNode = { '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110013': {} }

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
  })

  it('should throw error when it is invalid hash is value of tree node', function () {
    const vals = [
      '',
      '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1',
      '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1z'
    ]

    vals.forEach(function (val) {
      const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
      const proofNode = { '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': val }
      const key = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'

      expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
    })
  })

  it('should throw error when wrong rootHash parameter is passed (element is not found)', function () {
    const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
    const proofNode = { '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13' }
    const key = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
  })

  it('should throw error when invalid key with hash is in the root (element is not found)', function () {
    const rootHash = '335ec501d811725a9e60f89a1b67103e6fa5e65712a007ed33324719a6e2de3a'
    const proofNode = { '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13' }
    const key = 'f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3'

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
  })

  it('should throw error when value is of invalid type', function () {
    const vals = [
      false, null, undefined, 'Hello world', 42, new Date()
    ]

    vals.forEach(function (val) {
      const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
      const proofNode = {
        '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
          val: val
        }
      }
      const key = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'

      expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
    })
  })

  it('should throw error when invalid symbols in bytes array', function () {
    const vals = [
      [1, 'a', 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]
    ]

    vals.forEach(function (val) {
      const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
      const proofNode = {
        '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
          val: val
        }
      }
      const key = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'

      expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(TypeError)
    })
  })

  it('should throw error when invalid bytes array is on value position', function () {
    const vals = [
      [1, -1, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
      [1, 256, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]
    ]

    vals.forEach(function (val) {
      const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
      const proofNode = {
        '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
          val: val
        }
      }
      const key = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'

      expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(TypeError)
    })
  })

  it('should throw error when invalid value type', function () {
    const vals = [
      false, undefined, [], 42, new Date()
    ]

    vals.forEach(function (val) {
      const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
      const proofNode = {
        '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': val
      }
      const key = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'

      expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
    })
  })

  it('should throw error when invalid type parameter', function () {
    const vals = [
      null, false, 42, {}, [], new Date()
    ]

    vals.forEach(function (type) {
      const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
      const proofNode = {
        '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
          val: {
            name: 'John',
            surname: 'Doe'
          }
        }
      }
      const key = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'

      expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key, type)).to.throw(TypeError)
    })
  })

  it('should throw error when single node tree with wrong type parameter', function () {
    const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
    const proofNode = {
      '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
        val: {
          name: 'John',
          surname: 'Doe'
        }
      }
    }
    const key = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
    const Type = Exonum.newType({
      size: 8,
      fields: { balance: { type: Exonum.Int64, size: 8, from: 0, to: 8 } }
    })

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key, Type)).to.throw(TypeError)
  })

  it('should throw error when single node tree with rootHash parameter not equal to actual hash (element is found)', function () {
    const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
    const proofNode = {
      '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
        val: {
          balance: 4096
        }
      }
    }
    const key = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
    const Type = Exonum.newType({
      size: 8,
      fields: { balance: { type: Exonum.Int64, size: 8, from: 0, to: 8 } }
    })

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key, Type)).to.throw(Error)
  })

  it('should throw error when single node tree with invalid key with value in the root (element is found)', function () {
    const rootHash = '8cc79fea15327c3d6b11b8427ea0ea0a975fae454fbca696da03a033498cee05'
    const proofNode = {
      '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
        val: {
          balance: 4096
        }
      }
    }
    const key = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
    const Type = Exonum.newType({
      size: 8,
      fields: { balance: { type: Exonum.Int64, size: 8, from: 0, to: 8 } }
    })

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key, Type)).to.throw(Error)
  })

  it('should throw error when single node tree with invalid key in the root of proofNode parameter', function () {
    const rootHash = '8be78622dc7fd18b069a226133f1e943652bc5d53fd5df3d59735f49da1df692'
    const proofNode = {
      '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': 'dbc1b4c900ffe48d575b5da5c638040125f65db0fe3e24494b76ea986457d986'
    }
    const key = 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
  })

  it('should throw error when single node tree with invalid key with value in the root', function () {
    const rootHash = '8be78622dc7fd18b069a226133f1e943652bc5d53fd5df3d59735f49da1df692'
    const proofNode = {
      '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
        'val': [
          2
        ]
      }
    }
    const key = 'f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4'

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
  })

  it('should throw error when invalid number of children in the root node', function () {
    const rootHash = '0000000000000000000000000000000000000000000000000000000000000001'
    const proofNode = {
      '1': '',
      '2': '',
      '3': ''
    }
    const key = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
  })

  it('should throw error when tree with array as key parameter is passed ', function () {
    const rootHash = '8be78622dc7fd18b069a226133f1e943652bc5d53fd5df3d59735f49da1df692'
    const proofNode = {
      '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': 'dbc1b4c900ffe48d575b5da5c638040125f65db0fe3e24494b76ea986457d986'
    }
    const key = [244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244]

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(TypeError)
  })

  it('should throw error when wrong rootHash parameter', function () {
    const data = require('./data/invalid-MPT-wrong-root-hash.json')
    const rootHash = data.root_hash
    const proofNode = data.proof
    const key = data.searched_key

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
  })

  it('should throw error when invalid binary key', function () {
    const rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55'
    const proofNode = {
      '12323': {},
      '5927': {}
    }
    const key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(TypeError)
  })

  it('should throw error when tree contains non full key and value of wrong type', function () {
    [true, null, undefined, [], 42, new Date()].forEach(function (val) {
      const rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55'
      const proofNode = {
        '0': val,
        '1': {}
      }
      const key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'

      expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(TypeError)
    })
  })

  it('should throw error when tree contains full key and value of wrong type', function () {
    [true, null, undefined, [], 42, new Date()].forEach(function (val) {
      const rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55'
      const proofNode = {
        '0011001010001111110000101101101011111110000101010111001100101110011110010011110000111001011111111011110110100101111111111110111001110011111110011111001110011110111100001100100101110011010010111111011110001001000010000110000001000101101111100000101010100': val,
        '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
      }
      const key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'

      expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(TypeError)
    })
  })

  it('should throw error when tree contains non full key and invalid hash', function () {
    const args = [
      'Hello world',
      'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6ez',
      ''
    ]

    args.forEach(function (val) {
      const rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55'
      const proofNode = {
        '0': val,
        '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
      }
      const key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'

      expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
    })
  })

  it('should throw error when tree contains full key and invalid hash', function () {
    const args = [
      'Hello world',
      'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6ez',
      ''
    ]

    args.forEach(function (val) {
      const rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55'
      const proofNode = {
        '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': val,
        '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
      }
      const key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'

      expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
    })
  })

  it('should throw error when tree contains full key and missed value', function () {
    const rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55'
    const proofNode = {
      '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
        'age': 5
      },
      '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
    }
    const key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
  })

  it('should throw error when tree contains full key and duplicated value', function () {
    const rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55'
    const proofNode = {
      '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
        val: [25, 13]
      },
      '0110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
        val: [71]
      }
    }
    const key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
  })

  it('should throw error when tree contains non full key and value on wrong position', function () {
    const rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55'
    const proofNode = {
      '011001101': {
        val: [25, 13]
      },
      '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
    }
    const key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
  })

  it('should throw error when tree contains key is of wrong length', function () {
    const rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55'
    const proofNode = {
      '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6',
      '11100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101': {
        val: [25, 13]
      }
    }
    const key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
  })

  it('should throw error when tree contains full key and value of wrong type', function () {
    [false, null, 42].forEach(function (val) {
      const rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55'
      const proofNode = {
        '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': val,
        '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
      }
      const key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'

      expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(TypeError)
    })
  })

  it('should throw error when tree contains full key and invalid value', function () {
    ['Hello world'].forEach(function (val) {
      const rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55'
      const proofNode = {
        '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': val,
        '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
      }
      const key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'

      expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
    })
  })

  it('should throw error when tree contains full key and value as invalid binary array', function () {
    [[false], [null], ['Hello world'], [[]], [{}], [new Date()]].forEach(function (val) {
      const rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55'
      const proofNode = {
        '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
          val: val
        },
        '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
      }
      const key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'

      expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(TypeError)
    })
  })

  it('should throw error when tree contains full key and value as binary array with wrong value', function () {
    const rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55'
    const proofNode = {
      '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
        val: [257]
      },
      '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
    }
    const key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(TypeError)
  })

  it('should throw error when tree contains full key and wrong type parameter', function () {
    const rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55'
    const proofNode = {
      '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
        val: {
          name: 'John',
          surname: 'Doe'
        }
      },
      '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
    }
    const key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
    const Type = Exonum.newType({
      size: 80,
      fields: {
        pub_key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 },
        name: { type: Exonum.String, size: 8, from: 32, to: 40 },
        balance: { type: Exonum.Uint64, size: 8, from: 40, to: 48 },
        history_hash: { type: Exonum.Hash, size: 32, from: 48, to: 80 }
      }
    })

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key, Type)).to.throw(TypeError)
  })

  it('should throw error when tree contains non full key and wrong type parameter', function () {
    const rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55'
    const proofNode = {
      '111': {
        '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6',
        '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100': {
          val: {
            name: 'John',
            surname: 'Doe'
          }
        }
      },
      '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
    }
    const key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
    const Type = Exonum.newType({
      size: 80,
      fields: {
        pub_key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 },
        name: { type: Exonum.String, size: 8, from: 32, to: 40 },
        balance: { type: Exonum.Uint64, size: 8, from: 40, to: 48 },
        history_hash: { type: Exonum.Hash, size: 32, from: 48, to: 80 }
      }
    })

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key, Type)).to.throw(TypeError)
  })

  it('should throw error when tree contains duplicated left leaf', function () {
    const rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55'
    const proofNode = {
      '111': {
        '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6',
        '0110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100': {
          val: [255, 0, 5]
        }
      },
      '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
    }
    const key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
  })

  it('should throw error when tree contains duplicated right leaf', function () {
    const rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55'
    const proofNode = {
      '111': {
        '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6',
        '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100': {
          val: [255, 0, 5]
        }
      },
      '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
    }
    const key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
  })

  it('should throw error when tree contains left key which is part of search key but branch is not expanded', function () {
    const rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55'
    const proofNode = {
      '111': {
        '01111111010111000100100111101010110010111100011010100000100111111110101011011000011000000000100001000100000101101101100010101110110101101010001100000101110100011101101111100100101110100110010011011100011111011010110010100011111011010011000101111011010': '9be1fdaa5e58640e6c17dba7e734c56ec7ccab77f823933301661e3514284dd7',
        '11111111010111000100100111101010110010111100011010100000100110111110101011011000011000000000100001000100000101101101100010101110110101101010001100000101110100011101101111100100101110100110010011011100011111011010110010100011111011010011000101111011010': '9be1fdaa5e58640e6c17dba7e734c56ec7ccab77f823933301661e3514284dd7'
      },
      '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
    }
    const key = 'ecdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdc'

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
  })

  it('should throw error when tree contains right key which is part of search key but branch is not expanded', function () {
    const rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55'
    const proofNode = {
      '111': {
        '01111111010111000100100111101010110010111100011010100000100111111110101011011000011000000000100001000100000101101101100010101110110101101010001100000101110100011101101111100100101110100110010011011100011111011010110010100011111011010011000101111011010': '9be1fdaa5e58640e6c17dba7e734c56ec7ccab77f823933301661e3514284dd7',
        '11111111010111000100100111101010110010111100011010100000100110111110101011011000011000000000100001000100000101101101100010101110110101101010001100000101110100011101101111100100101110100110010011011100011111011010110010100011111011010011000101111011010': '9be1fdaa5e58640e6c17dba7e734c56ec7ccab77f823933301661e3514284dd7'
      },
      '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
    }
    const key = 'fcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdc'

    expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error)
  })
})

/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const Exonum = require('../../src')

describe('Check proof of Merkle tree', () => {
  it('should work for a single-element tree', () => {
    const data = {
      proof: {
        proof: [],
        entries: [
          [0, 'd6daf4cabee921faf9f9b2424b53bf49f7f1d8e813e4ed06d465d0ef5bcf2b4b']
        ],
        length: 1
      },
      trustedRoot: '11ab18c3230d71ee2272393ea31fadb1cf964a4bff0a4a57891ee506d32f26ca'
    }

    const proof = new Exonum.ListProof(data.proof, Exonum.Hash)
    expect(proof.merkleRoot).to.equal(data.trustedRoot)
  })

  it('should work for small fully-exposed tree', () => {
    const data = require('./data/merkle-tree/small.json')
    const proof = new Exonum.ListProof(data.proof, Exonum.Hash)
    expect(proof.merkleRoot).to.equal(data.trustedRoot)
    expect(proof.length).to.equal(4)
    proof.entries.forEach(({ index, value }, i) => {
      expect(index).to.equal(i)
      expect(value).to.be.a('string')
    })
  })

  it('should work for small tree with single element', () => {
    const data = require('./data/merkle-tree/single-element.json')
    const proof = new Exonum.ListProof(data.proof, Exonum.Hash)
    expect(proof.merkleRoot).to.equal(data.trustedRoot)
    expect(proof.entries).to.have.lengthOf(1)
    expect(proof.entries[0].index).to.equal(2)
  })

  it('should work for tree with several elements', () => {
    const data = require('./data/merkle-tree/several-elements.json')
    const proof = new Exonum.ListProof(data.proof, Exonum.Hash)
    expect(proof.merkleRoot).to.equal(data.trustedRoot)
    expect(proof.entries).to.have.lengthOf(3)
    const indexes = proof.entries.map(({ index }) => index)
    expect(indexes).to.deep.equal([3, 4, 5])
  })

  it('should error if value type is not specified', () => {
    const data = require('./data/merkle-tree/single-element.json')
    expect(() => new Exonum.ListProof(data))
      .to.throw('No `serialize` method in the value type')
    expect(() => new Exonum.ListProof(data, {}))
      .to.throw('No `serialize` method in the value type')
  })

  it('should error if proof part is malformed', () => {
    const malformedProof = {
      proof: [
        { height: 0, index: 0, hash: 'd6daf4cabee921faf9f9b2424b53bf49f7f1d8e813e4ed06d465d0ef5bcf2b4b' }
      ],
      entries: [
        [0, 'd6daf4cabee921faf9f9b2424b53bf49f7f1d8e813e4ed06d465d0ef5bcf2b4b']
      ]
    }
    expect(() => new Exonum.ListProof(malformedProof, Exonum.Hash))
      .to.throw('malformed `proof` part of the proof')

    malformedProof.proof[0].height = 100
    expect(() => new Exonum.ListProof(malformedProof, Exonum.Hash))
      .to.throw('malformed `proof` part of the proof')

    malformedProof.proof[0] = {
      height: 1,
      index: 'aaa',
      hash: 'd6daf4cabee921faf9f9b2424b53bf49f7f1d8e813e4ed06d465d0ef5bcf2b4b'
    }
    expect(() => new Exonum.ListProof(malformedProof, Exonum.Hash))
      .to.throw('malformed `proof` part of the proof')

    malformedProof.proof[0].index = 1
    malformedProof.proof[0].hash = 'd6daf4cabee9'
    expect(() => new Exonum.ListProof(malformedProof, Exonum.Hash))
      .to.throw('malformed `proof` part of the proof')
  })

  it('should error if entries are malformed', () => {
    const malformedProof = {
      proof: [],
      entries: [
        ['aa', 'd6daf4cabee921faf9f9b2424b53bf49f7f1d8e813e4ed06d465d0ef5bcf2b4b']
      ]
    }
    expect(() => new Exonum.ListProof(malformedProof, Exonum.Hash))
      .to.throw('malformed `entries` in the proof')
  })

  it('should error if `proof` entries are unordered', () => {
    const zeroHash = '00'.repeat(32)
    const malformedProof = {
      proof: [
        { height: 1, index: 1, hash: zeroHash },
        { height: 1, index: 0, hash: zeroHash }
      ],
      entries: [[0, zeroHash]]
    }
    expect(() => new Exonum.ListProof(malformedProof, Exonum.Hash))
      .to.throw('malformed `proof` part of the proof')

    // Duplicate "coordinates of a proof entry"
    malformedProof.proof[1].index = 1
    expect(() => new Exonum.ListProof(malformedProof, Exonum.Hash))
      .to.throw('malformed `proof` part of the proof')
  })

  it('should error if entries are unordered', () => {
    const zeroHash = '00'.repeat(32)
    const malformedProof = {
      proof: [],
      entries: [[5, zeroHash], [3, zeroHash]],
      length: 10
    }
    expect(() => new Exonum.ListProof(malformedProof, Exonum.Hash))
      .to.throw('malformed `entries` in the proof')

    malformedProof.entries[0][0] = 3
    expect(() => new Exonum.ListProof(malformedProof, Exonum.Hash))
      .to.throw('malformed `entries` in the proof')
  })

  it('should error on exceedingly large height of an entry', () => {
    const zeroHash = '00'.repeat(32)
    const malformedProof = {
      proof: [
        { height: 10, index: 1, hash: zeroHash }
      ],
      entries: [[0, zeroHash]],
      length: 2
    }
    expect(() => new Exonum.ListProof(malformedProof, Exonum.Hash))
      .to.throw('impossible according to list length')
  })

  it('should error on exceedingly large index of an entry', () => {
    const zeroHash = '00'.repeat(32)
    const malformedProof = {
      proof: [
        { height: 1, index: 3, hash: zeroHash }
      ],
      entries: [[0, zeroHash]],
      length: 2
    }
    expect(() => new Exonum.ListProof(malformedProof, Exonum.Hash))
      .to.throw('impossible according to list length')

    // Make index adequate in the `proof`, but break it in `entries[0]`.
    malformedProof.proof[0].index = 1
    malformedProof.entries = [[2, zeroHash]]
    expect(() => new Exonum.ListProof(malformedProof, Exonum.Hash))
      .to.throw('impossible according to list length')
  })

  it('should error on missing hash', () => {
    const malformedProof = {
      proof: [],
      entries: [
        [0, 'd6daf4cabee921faf9f9b2424b53bf49f7f1d8e813e4ed06d465d0ef5bcf2b4b'],
        [1, 'ef9c89edc71fdf62b1642aa13b5d6f6e9b09717b4e77c045dcbd24c1318a50e9'],
        [3, 'c808416e4ce59b474a9e6311d8619f5519bc72cea884b435215b52540912ca93']
      ],
      length: 4
    }
    expect(() => new Exonum.ListProof(malformedProof, Exonum.Hash))
      .to.throw('proof does not contain information to restore index hash')
  })

  it('should error on missing hash if some hashes are available', () => {
    const malformedProof = {
      proof: [
        { index: 3, height: 1, hash: '61119196a01db39f0b3a381579c366c8f85bf5186f53754531efe95f7e7a47c8' },
        { index: 0, height: 2, hash: '7bfe099e406e9c23b06ef1c6d50268524941cfa19152720fe841a9268b9375dc' }
      ],
      entries: [
        [2, '463249d0a1109e8469a2af46419655c9cd2a41f6ce5d2afc16597927467ab56c']
      ],
      length: 6
    }
    expect(() => new Exonum.ListProof(malformedProof, Exonum.Hash))
      .to.throw('proof does not contain information to restore index hash')
  })
})

/* eslint-env node, mocha */

import { hexadecimalToBinaryString } from '../../src/types'

const sha = require('sha.js')
const expect = require('chai')
  .use(require('dirty-chai'))
  .expect

const ProofPath = require('../../src/blockchain/ProofPath').default
const Exonum = require('../../src')
const { MapProof, MapProofError } = Exonum

const proto = require('./proto/stubs')

const samples = require('./data/map-proof.json')

/**
 * Helper function for hashing a variable number of arguments.
 *
 * @param {string | number[] | Uint8Array} args
 */
function streamHash (...args) {
  const stream = args.reduce((acc, arg) => {
    if (Array.isArray(arg)) {
      arg = Uint8Array.from(arg)
    }

    const encoding = (typeof arg === 'string') ? 'hex' : undefined
    return acc.update(arg, encoding)
  }, sha('sha256'))

  return stream.digest('hex')
}

describe('ProofPath', () => {
  const binaryStrings = [
    '0',
    '1',
    '10',
    '011',
    '10101',
    '1010101010010001',
    '10101010010100010010100101',
    '100000000000000000000001000000000000000000000000000000000000000000000000'
  ]

  describe('constructor', () => {
    binaryStrings.forEach(seq => {
      it(`should construct path from short bit sequence: ${seq}`, () => {
        const path = new ProofPath(seq)
        expect(path.bitLength).to.equal(seq.length)

        for (let i = 0; i < seq.length; i++) {
          expect(+seq[i]).to.equal(path.bit(i))
        }
        expect(path.bit(seq.length)).to.be.undefined()
      })
    })

    it('should construct path from 256-bit sequence', () => {
      const bits = Array.from(
        { length: 256 },
        () => (Math.random() > 0.5) ? '1' : '0'
      ).join('')
      expect(bits).to.match(/^[01]{256}$/)

      const path = new ProofPath(bits)
      expect(path.bitLength).to.equal(256)
      for (let i = 0; i < bits.length; i++) {
        expect(+bits[i]).to.equal(path.bit(i))
      }
    })

    it('should construct path from byte buffer', () => {
      const buffer = new Uint8Array(32)
      buffer[0] = 1

      const path = new ProofPath(buffer)
      expect(path.bitLength).to.equal(256)
      expect(path.bit(0)).to.equal(1)
      for (let i = 1; i < 256; i++) {
        expect(path.bit(i)).to.equal(0)
      }
    })

    it('should not construct paths from incorrectly typed objects', () => {
      const objects = [
        undefined,
        null,
        5,
        [],
        {},
        () => {}
      ]

      objects.forEach(obj => {
        expect(() => new ProofPath(obj)).to.throw(TypeError)
      })
    })

    it('should not construct paths from buffer with incorrect length', () => {
      const invalidBuffers = [
        new Uint8Array(10),
        new Uint8Array(40)
      ]

      invalidBuffers.forEach(buffer => {
        expect(() => new ProofPath(buffer)).to.throw(TypeError)
      })
    })
  })

  describe('compare', () => {
    it('should compare 2 equal full-length instances', () => {
      const buffer = new Uint8Array(32)
      let path = new ProofPath(buffer)
      let otherPath = new ProofPath(buffer)
      expect(path.compare(otherPath)).to.equal(0)

      buffer[0] = 192
      buffer[10] = 100
      path = new ProofPath(buffer)
      otherPath = new ProofPath(buffer)
      expect(path.compare(otherPath)).to.equal(0)
    })

    it('should compare 2 equal partial-length instances', () => {
      let path = new ProofPath('100010')
      let otherPath = new ProofPath('100010')
      expect(path.compare(otherPath)).to.equal(0)

      path = new ProofPath('1000101010001010')
      otherPath = new ProofPath('1000101010001010')
      expect(path.compare(otherPath)).to.equal(0)
    })

    binaryStrings.forEach(str => {
      const path = new ProofPath(str)

      binaryStrings.forEach(otherStr => {
        const otherPath = new ProofPath(otherStr)

        it(`should correctly compare ${str} and ${otherStr}`, () => {
          const comp = (str === otherStr)
            ? 0
            : (str < otherStr) ? -1 : 1
          expect(path.compare(otherPath)).to.equal(comp)
        })
      })
    })

    it('should correctly compare substring instances', () => {
      let path = new ProofPath('10001')
      let otherPath = new ProofPath('100010')
      expect(path.compare(otherPath)).to.equal(-1)
      expect(otherPath.compare(path)).to.equal(1)

      path = new ProofPath('1000100')
      otherPath = new ProofPath('10001000')
      expect(path.compare(otherPath)).to.equal(-1)
      expect(otherPath.compare(path)).to.equal(1)

      path = new ProofPath('1000100')
      otherPath = new ProofPath('100010001')
      expect(path.compare(otherPath)).to.equal(-1)
      expect(otherPath.compare(path)).to.equal(1)
    })
  })

  describe('serialize', () => {
    it('should work for a terminal key', () => {
      const path = new ProofPath('1'.repeat(256))
      const buffer = []
      path.serialize(buffer)
      let expectedBuffer = [128, 2]
      for (let i = 0; i < 32; i++) {
        expectedBuffer.push(255)
      }
      expect(buffer).to.deep.equal(expectedBuffer)

      const nonEmptyBuffer = [1, 2, 3]
      path.serialize(nonEmptyBuffer)
      expectedBuffer = [1, 2, 3, 128, 2]
      for (let i = 0; i < 32; i++) {
        expectedBuffer.push(255)
      }
      expect(nonEmptyBuffer).to.deep.equal(expectedBuffer)
    })

    it('should work for a short non-terminal key', () => {
      let buffer = []
      let path = new ProofPath('10110')
      path.serialize(buffer)
      expect(buffer).to.deep.equal([5, 0b00001101])

      buffer = []
      path = new ProofPath('10110101')
      path.serialize(buffer)
      expect(buffer).to.deep.equal([8, 0b10101101])
    })

    it('should work for a long non-terminal key', () => {
      const buffer = []
      const path = new ProofPath('10110001'.repeat(29))
      path.serialize(buffer)
      const expectedBuffer = [128 + (29 * 8 % 128), 1]
      for (let i = 0; i < 29; i++) {
        expectedBuffer.push(0b10001101)
      }
      expect(buffer).to.deep.equal(expectedBuffer)
    })
  })

  describe('truncate', () => {
    binaryStrings.forEach(str => {
      const repr = (str.length > 40) ? str.substring(0, 40) + '...' : str

      for (let len = 0; len < str.length; len++) {
        it(`should truncate bit string ${repr} to length ${len}`, () => {
          const path = new ProofPath(str).truncate(len)
          expect(path.bitLength).to.equal(len)
          expect(path.toJSON()).to.equal(str.substring(0, len))
        })
      }
    })

    it('should throw when instructed to truncate to an excessive length', () => {
      const path = new ProofPath('110101')
      expect(() => path.truncate(7)).to.throw(/Cannot truncate bit slice/i)
    })
  })

  describe('commonPrefix', () => {
    const pairs = [
      [ '100', '10001', '100' ],
      [ '1001', '1011101', '10' ],
      [ '1001', '1001', '1001' ],
      [ '00010100', '0001010111', '0001010' ],
      [ '000101010', '0001010111', '00010101' ],
      [ '0001001010000101010', '00010010100001010111', '000100101000010101' ]
    ]

    pairs.forEach(({ 0: xStr, 1: yStr, 2: prefix }) => {
      it(`should find common prefix for bit slices ${xStr} and ${yStr}`, () => {
        const x = new ProofPath(xStr)
        const y = new ProofPath(yStr)
        expect(x.commonPrefix(y).toJSON()).to.equal(prefix)
        expect(y.commonPrefix(x).toJSON()).to.equal(prefix)
      })
    })

    it('should return an empty bit slice when appropriate', () => {
      let x = new ProofPath('00')
      let y = new ProofPath('10001')
      expect(x.commonPrefix(y).toJSON()).to.equal('')
      expect(y.commonPrefix(x).toJSON()).to.equal('')

      x = new ProofPath('0000100000000000000000')
      expect(x.commonPrefix(y).toJSON()).to.equal('')
      expect(y.commonPrefix(x).toJSON()).to.equal('')
    })
  })

  describe('startsWith', () => {
    const prefixPairs = [
      ['01', '0'],
      ['111', ''],
      ['01000101', '0100010'],
      ['010001011', '0100010'],
      ['010001011', '01000101']
    ]

    prefixPairs.forEach(({ 0: full, 1: prefix }) => {
      const fullPath = new ProofPath(full)
      const prefixPath = new ProofPath(prefix)

      it(`should recognize ${prefixPath} as prefix of ${fullPath}`, () => {
        expect(fullPath.startsWith(prefixPath)).to.be.true()
        expect(prefixPath.startsWith(fullPath)).to.be.false()
      })
    })

    const nonPrefixPairs = [
      ['0', '1'],
      ['1001', '101'],
      ['10000000', '10000001'],
      ['100000001', '100000011']
    ]

    nonPrefixPairs.forEach(({ 0: full, 1: nonPrefix }) => {
      const fullPath = new ProofPath(full)
      const nonPrefixPath = new ProofPath(nonPrefix)

      it(`should recognize ${nonPrefixPath} as non-prefix of ${fullPath}`, () => {
        expect(fullPath.startsWith(nonPrefixPath)).to.be.false()
        expect(nonPrefixPath.startsWith(fullPath)).to.be.false()
      })
    })

    it('should recognize path as a prefix of self', () => {
      const path = new ProofPath('1001001')
      expect(path.startsWith(path)).to.be.true()
    })
  })

  describe('toJSON', () => {
    binaryStrings.forEach(str => {
      const repr = (str.length > 40) ? str.substring(0, 40) + '...' : str

      it(`should serialize non-terminal bit string '${repr}'`, () => {
        const path = new ProofPath(str)
        expect(path.toJSON()).to.equal(str)
      })
    })
  })

  describe('toString', () => {
    it('should output full bit contents for short slice', () => {
      const path = new ProofPath('110111')
      expect(path.toString()).to.equal('path(110111)')
    })

    it('should shorten bit contents for long slice', () => {
      const path = new ProofPath('1010101001')
      expect(path.toString()).to.equal('path(10101010...)')
    })
  })
})

describe('MapProof', () => {
  const PublicKey = Exonum.PublicKey

  const Wallet = Exonum.newType(proto.exonum.examples.cryptocurrency_advanced.Wallet)
  const TimestampEntry = Exonum.newType(proto.exonum.examples.timestamping.TimestampEntry)

  describe('type checks', () => {
    it('should fail on missing key and value type', () => {
      const json = { entries: [], proof: [] }
      expect(() => new MapProof(json)).to.throw('Invalid value type')
    })

    it('should fail on missing value type', () => {
      const json = { entries: [], proof: [] }
      expect(() => new MapProof(json, PublicKey)).to.throw('value type')
    })

    it('should fail on incorrect key type', () => {
      const json = { entries: [], proof: [] }
      const MyType = { foo: 'bar' }
      expect(() => new MapProof(json, MyType, Wallet)).to.throw('key type')
    })

    it('should fail on incorrect value type', () => {
      const json = { entries: [], proof: [] }
      const MyType = { foo: 'bar' }
      expect(() => new MapProof(json, PublicKey, MyType)).to.throw('value type')
    })
  })

  describe('initial parsing', () => {
    it('should throw on malformed `proof` field', () => {
      const objects = [
        { entries: [] }, // no proof
        { proof: 'abc', entries: [] },
        { proof: null, entries: [] },
        { proof: 124, entries: [] },
        { proof: { foo: 'bar' }, entries: [] }
      ]

      objects.forEach(obj => {
        expect(() => new MapProof(obj, PublicKey, Wallet)).to.throw(
          /malformed `proof`/i,
          MapProofError
        )
      })
    })

    const validPath = '100101'
    const validHash = Exonum.hash(new Uint8Array(10))

    const malformedProofEntries = [
      // No hash or path
      1,
      false,
      'foobar',
      [],
      { },

      // malformed hash
      { hash: false, path: validPath },
      { hash: 1234, path: validPath },
      { hash: 'foobar', path: validPath },
      { hash: '012345', path: validPath },

      // malformed path
      { hash: validHash, path: true },
      { hash: validHash, path: [] },
      { hash: validHash, path: 'f00' },
      { hash: validHash, path: '' },
      { hash: validHash, path: '0212' }
    ]
    const validProofEntry = { hash: validHash, path: '000000000000' }

    malformedProofEntries.forEach(entry => {
      it(`should throw on malformed entry in proof: ${JSON.stringify(entry)}`, () => {
        let obj = { proof: [entry], entries: [] }
        expect(() => new MapProof(obj, PublicKey, Wallet)).to.throw(
          /malformed `proof`/i,
          MapProofError
        )

        obj = { proof: [validProofEntry, entry], entries: [] }
        expect(() => new MapProof(obj, PublicKey, Wallet)).to.throw(
          /malformed `proof`/i,
          MapProofError
        )
      })
    })

    it('should throw on malformed `entries` field', () => {
      const objects = [
        { proof: [] }, // no entries
        { proof: [], entries: 'abc' },
        { proof: [], entries: null },
        { proof: [], entries: 124 },
        { proof: [], entries: { foo: 'bar' } }
      ]

      objects.forEach(obj => {
        expect(() => new MapProof(obj, PublicKey, Wallet)).to.throw(
          /malformed `entries`/i,
          MapProofError
        )
      })
    })

    const validKey = validHash
    const validValue = {
      pub_key: validKey,
      balance: '100',
      history_len: '0',
      history_hash: '0000000000000000000000000000000000000000000000000000000000000000'
    }
    const malformedEntries = [
      // No `missing` or `key` / `value`
      1,
      false,
      'foobar',
      [],
      { },
      { foo: 'bar' },

      // Malformed `key` / `value`
      { key: validKey },
      { value: validValue },

      // Ambigous entry type
      { missing: validKey, key: validKey },
      { missing: validKey, value: validValue }
    ]

    malformedEntries.forEach(entry => {
      it(`should throw on malformed entry: ${JSON.stringify(entry)}`, () => {
        let obj = { proof: [], entries: [entry] }
        expect(() => new MapProof(obj, PublicKey, Wallet)).to.throw(
          /malformed `entries`/i,
          MapProofError
        )

        obj = { proof: [], entries: [{ missing: validKey }, entry] }
        expect(() => new MapProof(obj, PublicKey, Wallet)).to.throw(
          /malformed `entries`/i,
          MapProofError
        )
      })
    })
  })

  describe('path prechecks', () => {
    it('should throw on non-terminal solitary node', () => {
      const json = {
        entries: [],
        proof: [
          { path: '001', hash: '34264463370758a230017c5635678c9a39fa90a5081ec08f85de6c56243f4011' }
        ]
      }
      expect(() => new MapProof(json, PublicKey, Wallet)).to.throw(/non-terminal isolated node/i)
    })

    it('should throw on discovered prefix key pairs', () => {
      let json = {
        entries: [],
        proof: [
          { path: '0', hash: '34264463370758a230017c5635678c9a39fa90a5081ec08f85de6c56243f4011' },
          { path: '001', hash: '34264463370758a230017c5635678c9a39fa90a5081ec08f85de6c56243f4011' }
        ]
      }
      expect(() => new MapProof(json, PublicKey, Exonum.Uint16))
        .to.throw('path(0) is a prefix of path(001)')

      const keyByte = '03'
      const keyBits = hexadecimalToBinaryString(streamHash(keyByte.repeat(32)))
      expect(keyBits).to.match(/^001/)

      json = {
        entries: [
          { key: keyByte.repeat(32), value: 10000 }
        ],
        proof: [
          { path: '001', hash: '34264463370758a230017c5635678c9a39fa90a5081ec08f85de6c56243f4011' }
        ]
      }
      expect(() => new MapProof(json, PublicKey, Exonum.Uint16))
        .to.throw('path(001) is a prefix')

      json = {
        entries: [
          { missing: keyByte.repeat(32) }
        ],
        proof: [
          { path: '001', hash: '34264463370758a230017c5635678c9a39fa90a5081ec08f85de6c56243f4011' }
        ]
      }
      expect(() => new MapProof(json, PublicKey, Exonum.Uint16))
        .to.throw('path(001) is a prefix')
    })

    it('should throw on duplicate paths', () => {
      let json = {
        entries: [],
        proof: [
          { path: '001', hash: '34264463370758a230017c5635678c9a39fa90a5081ec08f85de6c56243f4011' },
          { path: '001', hash: '34264463370758a230017c5635678c9a39fa90a5081ec08f85de6c56243f4012' }
        ]
      }
      expect(() => new MapProof(json, PublicKey, Exonum.Uint16))
        .to.throw('duplicate path(001)')

      json = {
        entries: [
          { missing: '34264463370758a230017c5635678c9a39fa90a5081ec08f85de6c56243f4011' },
          {
            key: '34264463370758a230017c5635678c9a39fa90a5081ec08f85de6c56243f4011',
            value: 123
          }
        ],
        proof: []
      }
      expect(() => new MapProof(json, PublicKey, Exonum.Uint16))
        .to.throw('duplicate path')

      const path = Exonum.hexadecimalToBinaryString(streamHash(json.entries[0].missing))
      json = {
        entries: [
          { missing: '34264463370758a230017c5635678c9a39fa90a5081ec08f85de6c56243f4011' }
        ],
        proof: [
          { path, hash: '34264463370758a230017c5635678c9a39fa90a5081ec08f85de6c56243f4011' }
        ]
      }
      expect(() => new MapProof(json, PublicKey, Exonum.Uint16))
        .to.throw('duplicate path')
    })

    it('should throw on unordered paths in proof', () => {
      let json = {
        entries: [],
        proof: [
          { path: '001', hash: '34264463370758a230017c5635678c9a39fa90a5081ec08f85de6c56243f4011' },
          { path: '0', hash: '34264463370758a230017c5635678c9a39fa90a5081ec08f85de6c56243f4011' }
        ]
      }
      expect(() => new MapProof(json, PublicKey, Exonum.Uint16))
        .to.throw('invalid path ordering')
    })
  })

  describe('merkleRoot', () => {
    it('should return zeros on empty map', () => {
      const proof = new MapProof({
        entries: [],
        proof: []
      }, PublicKey, Exonum.Uint16)

      const expHash = sha('sha256')
        .update([3])
        .update(new Uint8Array(32))
        .digest('hex')
      expect(proof.merkleRoot).to.equal(expHash)
    })

    it('should calculate hash for a single exposed node', () => {
      const key = '34264463370758a230017c5635678c9a39fa90a5081ec08f85de6c56243f4011'
      const proof = new MapProof({
        entries: [
          { key, value: 100 }
        ],
        proof: []
      }, PublicKey, Exonum.Uint16)

      const nodeHash = streamHash(
        [4, 1],
        streamHash(key),
        [0],
        streamHash([0, 100, 0]) // Blob marker + little-endian encoding of the value
      )
      const expHash = streamHash([3], nodeHash)
      expect(proof.merkleRoot).to.equal(expHash)
    })

    it('should calculate hash for a single hashed node', () => {
      const key = '34264463370758a230017c5635678c9a39fa90a5081ec08f85de6c56243f4011'
      const proof = new MapProof({
        entries: [],
        proof: [
          {
            path: Exonum.hexadecimalToBinaryString(key),
            hash: key
          }
        ]
      }, PublicKey, Exonum.Uint16)

      const nodeHash = streamHash(
        [4, 1],
        Exonum.PublicKey.serialize(key, [], 0),
        [0],
        key
      )
      const expHash = streamHash([3], nodeHash)
      expect(proof.merkleRoot).to.equal(expHash)
    })

    it('should calculate hash for 2-node tree', () => {
      const proof = new MapProof({
        entries: [],
        proof: [
          {
            path: '0',
            hash: '0000000000000000000000000000000000000000000000000000000000000000'
          },
          {
            path: '10',
            hash: '0f00000000000000000000000000000000000000000000000000000000000000'
          }
        ]
      }, PublicKey, Exonum.Uint16)

      const nodeHash = streamHash(
        [4], // marker
        '0000000000000000000000000000000000000000000000000000000000000000', // left hash
        '0f00000000000000000000000000000000000000000000000000000000000000', // right hash
        // left path:
        [1, 0], // LEB128-encoded bit length 1 + first byte of the key
        // right path:
        [2, 0b00000001] // LEB128-encoded bit length 2 + first byte of the key
      )
      const expHash = streamHash([3], nodeHash)
      expect(proof.merkleRoot).to.equal(expHash)
    })
  })

  function testValidSample (sampleName) {
    it(`should work on sample ${sampleName}`, () => {
      const sample = samples[sampleName]
      const expected = sample.expected
      const json = sample.data

      const entries = expected.entries || []
      const missingKeys = expected.missingKeys || []

      let valueType
      switch (expected.valueType) {
        case 'Wallet':
          valueType = Wallet
          break
        case 'TimestampEntry':
          valueType = TimestampEntry
          break
        case 'UniqueHash':
          valueType = {
            serialize: (value) => value
          }
          break
        case 'Uint16':
          valueType = Exonum.Uint16
          break
        default:
          throw new TypeError(`Unknown value type: ${expected.valueType}`)
      }

      const proof = new MapProof(json, Exonum.PublicKey, valueType)
      expect(proof.entries.size).to.equal(entries.length)

      entries.forEach(({ 0: key, 1: val }) => {
        expect(proof.entries.has(key)).to.be.true()
        expect(proof.entries.get(key)).to.deep.equal(val)
      })
      missingKeys.forEach(key => {
        expect(proof.missingKeys.has(key)).to.be.true()
      })

      expect(proof.merkleRoot).to.equal(expected.merkleRoot)
    })
  }

  testValidSample('valid-hash-value-short')
  testValidSample('valid-empty')
  testValidSample('valid-hash-value')
  testValidSample('valid-not-found')
  testValidSample('valid-single-wallet')
  testValidSample('valid-timestamp')
  testValidSample('valid-timestamp-empty-metadata')
})

import bigInt from 'big-integer'
import binarySearch from 'binary-search'
import { Hash } from '../types/hexadecimal'
import { hexadecimalToUint8Array } from '../types/convert'
import { hash, HASH_LENGTH } from '../crypto'
import { BLOB_PREFIX, LIST_PREFIX, LIST_BRANCH_PREFIX } from './constants'

/**
 * @typedef IEntry
 * @property {number} height Height of the entry
 * @property {number} index Index of the entry on the level
 * @property {string} hash SHA-256 digest of the entry
 */

// Maximum height of a valid Merkle tree
const MAX_TREE_HEIGHT = 58

export class ListProof {
  constructor ({ proof, entries, length }, valueType) {
    if (!valueType || typeof valueType.serialize !== 'function') {
      throw new TypeError('No `serialize` method in the value type')
    }
    this.valueType = valueType

    this.proof = parseProof(proof)
    this.entries = parseEntries(entries, valueType)
    this.length = length

    let rootHash
    if (this.length === 0) {
      if (this.proof.length === 0 && this.entries.length === 0) {
        rootHash = '0000000000000000000000000000000000000000000000000000000000000000'
      } else {
        throw new ListProofError('malformedEmptyProof')
      }
    } else {
      const completeProof = [...this.entries, ...this.proof]
      rootHash = collect(completeProof, this.length)
    }
    this.merkleRoot = hashList(rootHash, this.length)
  }
}

function parseProof (proof) {
  if (!Array.isArray(proof)) {
    throw new ListProofError('malformedProof')
  }

  const validEntries = proof.every(({ index, height, hash }) => {
    return /^[0-9a-f]{64}$/i.test(hash) &&
      Number.isInteger(index) &&
      Number.isInteger(height) &&
      height > 0 &&
      height <= MAX_TREE_HEIGHT
  })
  if (!validEntries) {
    throw new ListProofError('malformedProof')
  }

  // Check ordering of proof entries.
  for (let i = 0; i + 1 < proof.length; i++) {
    const [prev, next] = [proof[i], proof[i + 1]]
    if (prev.height > next.height || (prev.height === next.height && prev.index >= next.index)) {
      throw new ListProofError('invalidProofOrdering')
    }
  }

  return proof
}

/**
 * Performs some preliminary checks on list values and computes their hashes.
 *
 * @param entries
 * @param valueType
 * @returns {IEntry[]} parsed entries
 */
function parseEntries (entries, valueType) {
  if (!Array.isArray(entries)) {
    throw new ListProofError('malformedEntries')
  }

  // Check ordering of values.
  for (let i = 0; i + 1 < entries.length; i++) {
    const [prev, next] = [entries[i], entries[i + 1]]
    if (prev[0] >= next[0]) {
      throw new ListProofError('invalidValuesOrdering')
    }
  }

  return entries.map(([index, value]) => {
    if (!Number.isInteger(index)) {
      throw new ListProofError('malformedEntries')
    }

    return {
      index,
      height: 0,
      value,
      hash: hash([BLOB_PREFIX, ...valueType.serialize(value, [], 0)])
    }
  })
}

/**
 * Collects entries into a single hash of the Merkle tree.
 * @param {IEntry[]} entries
 * @param {number} listLength
 * @returns {string} hash of the Merkle tree
 */
function collect (entries, listLength) {
  const treeHeight = calcHeight(listLength)

  // Check that height is appropriate. Since we've checked ordering of `entries`,
  // we only check that the height of the last entry does not exceed the expected
  // value.
  if (entries[entries.length - 1].height >= treeHeight) {
    throw new ListProofError('unexpectedHeight')
  }

  // Check that indexes of `entries` are appropriate.
  entries.forEach(({ height, index }) => {
    const divisor = (height === 0) ? 1 : (2 ** (height - 1))
    const maxIndexOnLevel = Math.floor((listLength - 1) / divisor)
    if (index > maxIndexOnLevel) {
      throw new ListProofError('unexpectedIndex')
    }
  })

  // Copy values to the first layer (we've calculated their hashes already).
  let layer = spliceLayer(entries, 0).map(({ index, hash }) => ({
    height: 1,
    index,
    hash
  }))
  let lastIndex = listLength - 1
  for (let height = 1; height < treeHeight; height++) {
    // Merge with the next layer.
    const nextLayer = spliceLayer(entries, height)
    layer = mergeLayers(layer, nextLayer)
    // Zip the entries on the layer.
    hashLayer(layer, lastIndex)
    lastIndex = Math.floor(lastIndex / 2)
  }
  return layer[0].hash
}

/**
 * Splices entries with the specified height from the beginning of the array.
 * The entries are modified in place.
 *
 * @param {IEntry[]} entries
 * @param {number} height
 * @returns {IEntry[]} spliced entries
 */
function spliceLayer (entries, height) {
  const index = binarySearch(entries, height + 1, ({ height, index }, needleHeight) => {
    // Assume that all entries with `height === needleHeight` are larger than our needle.
    const x = (needleHeight !== height) ? (height - needleHeight) : 1
    return x
  })
  /* istanbul ignore next: should never be triggered */
  if (index >= 0) {
    throw new Error('Internal error while verifying list proof')
  }

  const greaterIndex = -index - 1
  return entries.splice(0, greaterIndex)
}

/**
 * Merges two sorted arrays together.
 *
 * @param {IEntry[]} xs
 * @param {IEntry[]} ys
 * @returns {IEntry[]}
 */
function mergeLayers (xs, ys) {
  let xIndex = 0
  let yIndex = 0
  const output = []
  while (xIndex < xs.length || yIndex < ys.length) {
    const [x, y] = [xs[xIndex], ys[yIndex]]
    if (!x) {
      output.push(y)
      yIndex++
    } else if (!y) {
      output.push(x)
      xIndex++
    } else if (x.index < y.index) {
      output.push(x)
      xIndex++
    } else if (x.index > y.index) {
      output.push(y)
      yIndex++
    } else {
      // x.index === y.index
      throw new ListProofError('duplicateHash')
    }
  }
  return output
}

/**
 * Elevates the layer to the next level by zipping pairs of entries together.
 *
 * @param {IEntry[]} layer
 * @param {number} lastIndex
 */
function hashLayer (layer, lastIndex) {
  for (let i = 0; i < layer.length; i += 2) {
    const [left, right] = [layer[i], layer[i + 1]]
    let hash
    if (right) {
      // To be able to zip two hashes on the layer, they need to be adjacent to each other,
      // and the first of them needs to have an even index.
      if (left.index % 2 !== 0 || right.index !== left.index + 1) {
        throw new ListProofError('missingHash')
      }
      hash = hashNode(left.hash, right.hash)
    } else {
      // If there is an odd number of hashes on the layer, the solitary hash must have
      // the greatest possible index.
      if (lastIndex % 2 === 1 || left.index !== lastIndex) {
        throw new ListProofError('missingHash')
      }
      hash = hashNode(left.hash)
    }

    layer[i / 2] = {
      height: layer[i].height + 1,
      index: Math.floor(layer[i].index / 2),
      hash
    }
  }
  layer.length /= 2
}

function hashNode (leftHash, maybeRightHash) {
  const buffer = [LIST_BRANCH_PREFIX]
  Hash.serialize(leftHash, buffer, buffer.length)
  if (maybeRightHash) {
    Hash.serialize(maybeRightHash, buffer, buffer.length)
  }
  return hash(buffer)
}

/**
 * Computes hash of the `ProofListIndex` given its length and root hash.
 * @param {string} rootHash
 * @param {number} length
 * @returns {string}
 */
function hashList (rootHash, length) {
  const buffer = new Uint8Array(9 + HASH_LENGTH)
  buffer[0] = LIST_PREFIX
  // Set bytes 1..9 as little-endian list length
  let quotient = bigInt(length)
  for (let byte = 1; byte < 9; byte++) {
    let remainder
    ({ quotient, remainder } = quotient.divmod(256))
    buffer[byte] = remainder
  }
  buffer.set(hexadecimalToUint8Array(rootHash), 9)
  return hash(buffer)
}

/**
 * Calculates height of a Merkle tree given its length.
 * @param {bigInt} count
 * @return {number}
 */
function calcHeight (count) {
  let i = 0
  while (bigInt(2).pow(i).lt(count)) {
    i++
  }
  return i + 1
}

export class ListProofError extends Error {
  constructor (type) {
    switch (type) {
      case 'malformedProof':
      case 'invalidProofOrdering':
        super('malformed `proof` part of the proof')
        break
      case 'malformedEntries':
      case 'invalidValuesOrdering':
        super('malformed `entries` in the proof')
        break
      case 'unexpectedHeight':
      case 'unexpectedIndex':
        super('proof contains a branch where it is impossible according to list length')
        break
      case 'duplicateHash':
        super('proof contains redundant entries')
        break
      case 'missingHash':
        super('proof does not contain information to restore index hash')
        break
      default:
        super(type)
    }
  }
}

import binarySearch from 'binary-search'

import { hash } from '../crypto'
import { newType } from '../types/generic'
import { Hash } from '../types/hexadecimal'
import ProofPath from './ProofPath'

/**
 * Proof of existence and/or absence of certain elements from a Merkelized
 * map index.
 */
export class MapProof {
  /**
   * Creates a new instance of a proof.
   *
   * @param {Object} json
   *   JSON object containing (untrusted) proof
   * @param {{serialize: (any) => Array<number>}} keyType
   *   Type of keys used in the underlying Merkelized map. Usually, `PublicKey`
   *   or `Hash`. The keys must serialize to exactly 32 bytes.
   * @param {{hash?: (any) => string, serialize: (any) => Array<number>}} valueType
   *   Type of values used in the underlying Merkelized map. Usually, it should
   *   be a type created with the `newType` function. The type should possess
   *   one of `hash` or `serialize` methods.
   * @throws {MapProofError}
   *   if the proof is malformed
   */
  constructor (json, keyType, valueType) {
    this.proof = parseProof(json.proof)
    this.entries = parseEntries(json.entries, keyType, valueType)

    if (!keyType || typeof keyType.serialize !== 'function') {
      throw new TypeError('No `serialize` method in the key type')
    }
    this.keyType = keyType

    if (!valueType || (
      typeof valueType.serialize !== 'function' &&
      typeof valueType.hash !== 'function'
    )) {
      throw new TypeError('No `hash` or `serialize` method in the value type')
    }
    this.valueType = valueType

    precheckProof.call(this)

    const completeProof = this.proof
      .concat(this.entries)
      .sort(({ path: pathA }, { path: pathB }) => pathA.compare(pathB))

    // This check is required as duplicate paths can be introduced by entries
    // (further, it's generally possible that two different entry keys lead
    //  to the same `ProofPath`).
    for (let i = 1; i < completeProof.length; i++) {
      const [{ path: pathA }, { path: pathB }] = [
        completeProof[i - 1],
        completeProof[i]
      ]

      if (pathA.compare(pathB) === 0) {
        throw new MapProofError('duplicatePath', pathA)
      }
    }

    this.merkleRoot = collect(completeProof.filter(({ hash }) => !!hash))
    this.missingKeys = new Set(
      this.entries
        .filter(e => e.missing !== undefined)
        .map(({ missing }) => missing)
    )
    this.entries = new Map(
      this.entries
        .filter(e => e.key !== undefined)
        .map(({ key, value }) => [key, value])
    )
  }
}

function parseProof (proof) {
  if (!Array.isArray(proof)) {
    throw new MapProofError('malformedProof')
  }

  const validEntries = proof.every(({ path, hash }) => {
    return /^[01]{1,256}$/.test(path) &&
      /^[0-9a-f]{64}$/i.test(hash)
  })
  if (!validEntries) {
    throw new MapProofError('malformedProof')
  }

  return proof.map(({ path, hash }) => ({
    path: new ProofPath(path),
    hash
  }))
}

function parseEntries (entries, keyType, valueType) {
  function createPath (data) {
    const bytes = keyType.serialize(data, [], 0)
    if (bytes.length !== ProofPath.BYTE_LENGTH) {
      throw new TypeError('invalid key type; keys should serialize to ' +
        `${ProofPath.BYTE_LENGTH}-byte buffers`)
    }

    return new ProofPath(Uint8Array.from(bytes))
  }

  if (!Array.isArray(entries)) {
    throw new MapProofError('malformedEntries')
  }

  return entries.map(({ missing, key, value }) => {
    if (missing === undefined && (key === undefined || value === undefined)) {
      throw new MapProofError('unknownEntryType')
    }
    if (missing !== undefined && (key !== undefined || value !== undefined)) {
      throw new MapProofError('ambiguousEntryType')
    }

    if (missing !== undefined) {
      return {
        missing,
        path: createPath(missing)
      }
    } else {
      return {
        key,
        value,
        path: createPath(key),
        hash: typeof valueType.hash === 'function'
          ? valueType.hash(value) // `newType`s
          : hash(valueType.serialize(value, [], 0)) // "primitive" types
      }
    }
  })
}

/**
 * @param this MapProof
 */
function precheckProof () {
  // Check that entries in proof are in increasing order
  for (let i = 1; i < this.proof.length; i++) {
    const [{ path: prevPath }, { path }] = [this.proof[i - 1], this.proof[i]]

    switch (prevPath.compare(path)) {
      case -1:
        if (path.startsWith(prevPath)) {
          throw new MapProofError('embeddedPaths', prevPath, path)
        }
        break
      case 0:
        throw new MapProofError('duplicatePath', path)
      case 1:
        throw new MapProofError('invalidOrdering', prevPath, path)
    }
  }

  // Check that no entry has a prefix among the paths in the proof entries.
  // In order to do this, it suffices to locate the closest smaller path
  // in the proof entries and check only it.
  this.entries.forEach(({ path: keyPath }) => {
    const index = binarySearch(this.proof, keyPath, ({ path }, needle) => {
      return path.compare(needle)
    })

    if (index >= 0) {
      throw new MapProofError('duplicatePath', keyPath)
    } else {
      const insertionIndex = -index - 1

      if (insertionIndex > 0) {
        const prevPath = this.proof[insertionIndex - 1].path
        if (keyPath.startsWith(prevPath)) {
          throw new MapProofError('embeddedPaths', prevPath, keyPath)
        }
      }
    }
  })
}

const IsolatedNode = newType({
  fields: [
    { name: 'path', type: ProofPath.TYPE },
    { name: 'hash', type: Hash }
  ]
})

const BranchNode = newType({
  fields: [
    { name: 'left_hash', type: Hash },
    { name: 'right_hash', type: Hash },
    { name: 'left_path', type: ProofPath.TYPE },
    { name: 'right_path', type: ProofPath.TYPE }
  ]
})

function collect (entries) {
  function hashIsolatedNode ({ path, hash: valueHash }) {
    return hash({ hash: valueHash, path }, IsolatedNode)
  }

  function hashBranch (left, right) {
    const branch = {
      left_hash: left.hash,
      right_hash: right.hash,
      left_path: left.path,
      right_path: right.path
    }

    return hash(branch, BranchNode)
  }

  function fold (contour, lastPrefix) {
    const lastEntry = contour.pop()
    const penultimateEntry = contour.pop()

    contour.push({
      path: lastPrefix,
      hash: hashBranch(penultimateEntry, lastEntry)
    })

    return (contour.length > 1)
      ? lastPrefix.commonPrefix(contour[contour.length - 2].path)
      : null
  }

  switch (entries.length) {
    case 0:
      return '0000000000000000000000000000000000000000000000000000000000000000'

    case 1:
      if (!entries[0].path.isTerminal) {
        throw new MapProofError('nonTerminalNode', entries[0].path)
      } else {
        return hashIsolatedNode(entries[0])
      }

    default:
      const contour = []

      // invariant: equal to the common prefix of the 2 last nodes in the contour
      let lastPrefix = entries[0].path.commonPrefix(entries[1].path)
      contour.push(entries[0], entries[1])

      for (let i = 2; i < entries.length; i++) {
        const entry = entries[i]
        const newPrefix = entry.path.commonPrefix(contour[contour.length - 1].path)

        while (contour.length > 1 && newPrefix.bitLength() < lastPrefix.bitLength()) {
          const foldedPrefix = fold(contour, lastPrefix)
          if (foldedPrefix) {
            lastPrefix = foldedPrefix
          }
        }

        contour.push(entry)
        lastPrefix = newPrefix
      }

      while (contour.length > 1) {
        lastPrefix = fold(contour, lastPrefix)
      }
      return contour[0].hash
  }
}

/**
 * Error indicating a malformed `MapProof`.
 */
export class MapProofError extends Error {
  constructor (type, ...args) {
    switch (type) {
      case 'malformedProof':
        super('malformed `proof` part of the proof')
        break
      case 'malformedEntries':
      case 'unknownEntryType':
      case 'ambiguousEntryType':
        super('malformed `entries` part of the proof')
        break
      case 'embeddedPaths':
        super(`embedded paths in proof: ${args[0]} is a prefix of ${args[1]}`)
        break
      case 'duplicatePath':
        super(`duplicate ${args[0]} in proof`)
        break
      case 'invalidOrdering':
        super('invalid path ordering')
        break
      case 'nonTerminalNode':
        super('non-terminal isolated node in proof')
        break
      default:
        super(type)
    }
  }
}

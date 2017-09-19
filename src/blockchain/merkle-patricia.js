import { isObject } from '../helpers'
import * as primitive from '../types/primitive'
import { newType } from '../types/generic'
import * as validate from '../types/validate'
import * as convert from '../types/convert'
import { hash } from '../crypto'

const MERKLE_PATRICIA_KEY_LENGTH = 32

/**
 * Check Merkle Patricia tree proof and return element
 * @param {string} rootHash
 * @param {Object} proofNode
 * @param {string} key
 * @param {NewType} [type] - optional
 * @return {Object}
 */
export function merklePatriciaProof (rootHash, proofNode, key, type) {
  const DBKey = newType({
    size: 34,
    fields: {
      variant: { type: primitive.Uint8, size: 1, from: 0, to: 1 },
      key: { type: primitive.Hash, size: 32, from: 1, to: 33 },
      length: { type: primitive.Uint8, size: 1, from: 33, to: 34 }
    }
  })
  const Branch = newType({
    size: 132,
    fields: {
      left_hash: { type: primitive.Hash, size: 32, from: 0, to: 32 },
      right_hash: { type: primitive.Hash, size: 32, from: 32, to: 64 },
      left_key: { type: DBKey, size: 34, from: 64, to: 98 },
      right_key: { type: DBKey, size: 34, from: 98, to: 132 }
    }
  })
  const RootBranch = newType({
    size: 66,
    fields: {
      key: { type: DBKey, size: 34, from: 0, to: 34 },
      hash: { type: primitive.Hash, size: 32, from: 34, to: 66 }
    }
  })

  /**
   * Get element from node
   * @param data
   * @returns {string} or {Array} or {Object}
   */
  function getElement (data) {
    if (typeof data === 'string') {
      if (!validate.validateHexadecimal(data)) {
        throw new TypeError('Element of wrong type is passed. Hexadecimal expected.')
      }
      return data
    } else if (Array.isArray(data)) {
      if (!validate.validateBytesArray(data)) {
        throw new TypeError('Element of wrong type is passed. Bytes array expected.')
      }
      return data.slice(0) // clone array of 8-bit integers
    } else if (isObject(data)) {
      return JSON.parse(JSON.stringify(data)) // deep clone
    }
  }

  /**
   * Get hash of element
   * @param element
   * @returns {string}
   */
  function getHash (element) {
    if (typeof element === 'string') {
      return element
    } else if (Array.isArray(element)) {
      return hash(element)
    } else if (isObject(element)) {
      return hash(element, type)
    }
  }

  /**
   * Check either suffix is a part of search key
   * @param {string} prefix
   * @param {string} suffix
   * @returns {boolean}
   */
  function isPartOfSearchKey (prefix, suffix) {
    // remove prefix from searched binary key
    const diff = keyBinary.substr(prefix.length)
    return diff.indexOf(suffix) === 0
  }

  /**
   * Order left and right nodes in a tree
   * @param {Array} nodes
   * @returns {Array} or {null}
   */
  function orderNodes (nodes) {
    const child1 = nodes[0]
    const child2 = nodes[1]
    const len = Math.min(child1.suffix.length, child2.suffix.length)
    for (let i = 0; i < len; i++) {
      if (child1.suffix[i] !== child2.suffix[i]) {
        return child1.suffix[i] === '0' ? [child1, child2] : [child2, child1]
      }
    }
    return null
  }

  /**
   * Recursive tree traversal function
   * @param {Object} node
   * @param {string} keyPrefix
   * @returns {string}
   */
  function recursive (node, keyPrefix) {
    if (Object.keys(node).length !== 2) {
      throw new Error('Invalid number of children in the tree node.')
    }

    const nodes = []
    let fullKey

    for (const keySuffix in node) {
      if (!node.hasOwnProperty(keySuffix)) {
        continue
      } else if (keySuffix.length === 0) {
        throw new TypeError('Empty key suffix is passed.')
      }

      // validate key
      if (!validate.validateBinaryString(keySuffix)) {
        throw new TypeError('Key suffix of wrong type is passed. Binary string expected.')
      }

      let branchValueHash
      const nodeValue = node[keySuffix]
      let branchType
      let branchKey
      let branchKeyHash

      fullKey = keyPrefix + keySuffix

      if (fullKey.length === MERKLE_PATRICIA_KEY_LENGTH * 8) {
        if (typeof nodeValue === 'string') {
          if (!validate.validateHexadecimal(nodeValue)) {
            throw new TypeError('Tree node of wrong type is passed. Hexadecimal expected.')
          }

          branchValueHash = nodeValue
          branchType = 'hash'
        } else if (isObject(nodeValue)) {
          if (nodeValue.val === undefined) {
            throw new TypeError('Leaf tree contains invalid data.')
          } else if (element !== undefined) {
            throw new Error('Tree can not contains more than one node with value.')
          }

          element = getElement(nodeValue.val)
          branchValueHash = getHash(element)

          branchType = 'value'
        } else {
          throw new TypeError('Invalid type of node in tree leaf.')
        }

        branchKeyHash = convert.binaryStringToHexadecimal(fullKey)

        branchKey = {
          variant: 1,
          key: branchKeyHash,
          length: 0
        }
      } else if (fullKey.length < MERKLE_PATRICIA_KEY_LENGTH * 8) { // node is branch
        if (typeof nodeValue === 'string') {
          if (!validate.validateHexadecimal(nodeValue)) {
            throw new TypeError('Tree node of wrong type is passed. Hexadecimal expected.')
          }

          branchValueHash = nodeValue
          branchType = 'hash'
        } else if (isObject(nodeValue)) {
          if (nodeValue.val !== undefined) {
            throw new Error('Node with value is at non-leaf position in tree.')
          }

          branchValueHash = recursive(nodeValue, fullKey)

          branchType = 'branch'
        } else {
          throw new TypeError('Invalid type of node in tree.')
        }

        const binaryKeyLength = fullKey.length
        let binaryKey = fullKey

        for (let j = 0; j < (MERKLE_PATRICIA_KEY_LENGTH * 8 - fullKey.length); j++) {
          binaryKey += '0'
        }

        branchKeyHash = convert.binaryStringToHexadecimal(binaryKey)

        branchKey = {
          variant: 0,
          key: branchKeyHash,
          length: binaryKeyLength
        }
      } else {
        throw new Error('Invalid length of key in tree.')
      }

      nodes.push({
        hash: branchValueHash,
        key: branchKey,
        type: branchType,
        suffix: keySuffix,
        size: fullKey.length
      })
    }

    if (nodes[0].suffix[0] === nodes[1].suffix[0] && keyPrefix.length > 0) {
      throw new Error('Nodes with common-prefix keys are located on non-zero level of the tree.')
    }

    let orderedNodes = orderNodes(nodes)

    if (!orderedNodes) {
      throw new Error('Impossible to determine left and right nodes.')
    }

    const left = orderedNodes[0]
    const right = orderedNodes[1]

    if (
      left.type === 'hash' &&
      right.type === 'hash' &&
      fullKey.length < MERKLE_PATRICIA_KEY_LENGTH * 8
    ) {
      if (isPartOfSearchKey(keyPrefix, left.suffix)) {
        throw new Error('Tree is invalid. Left key is a part of search key but its branch is not expanded.')
      } else if (isPartOfSearchKey(keyPrefix, right.suffix)) {
        throw new Error('Tree is invalid. Right key is a part of search key but its branch is not expanded.')
      }
    }

    return hash({
      left_hash: left.hash,
      right_hash: right.hash,
      left_key: left.key,
      right_key: right.key
    }, Branch)
  }

  let element

  // validate rootHash
  if (!validate.validateHexadecimal(rootHash)) {
    throw new TypeError('Root hash of wrong type is passed. Hexadecimal expected.')
  }

  rootHash = rootHash.toLowerCase()

  // validate proofNode parameter
  if (!isObject(proofNode)) {
    throw new TypeError('Invalid type of proofNode parameter. Object expected.')
  }

  // validate key parameter
  if (Array.isArray(key)) {
    if (!validate.validateBytesArray(key, MERKLE_PATRICIA_KEY_LENGTH)) {
      throw new TypeError('Key parameter of wrong type is passed. Bytes array expected.')
    }

    key = convert.uint8ArrayToHexadecimal(key)
  } else if (typeof key === 'string') {
    if (!validate.validateHexadecimal(key, MERKLE_PATRICIA_KEY_LENGTH)) {
      throw new TypeError('Key parameter of wrong type is passed. Hexadecimal expected.')
    }
  } else {
    throw new TypeError('Invalid type of key parameter. Array of 8-bit integers or hexadecimal string is expected.')
  }

  const keyBinary = convert.hexadecimalToBinaryString(key)

  const proofNodeRootNumberOfNodes = Object.keys(proofNode).length
  if (proofNodeRootNumberOfNodes === 0) {
    if (rootHash === (new Uint8Array(MERKLE_PATRICIA_KEY_LENGTH * 2)).join('')) {
      return null
    } else {
      throw new Error('Invalid rootHash parameter of empty tree.')
    }
  } else if (proofNodeRootNumberOfNodes === 1) {
    for (const i in proofNode) {
      if (!proofNode.hasOwnProperty(i)) {
        continue
      }

      if (!validate.validateBinaryString(i, 256)) {
        throw new TypeError('Tree key of wrong type is passed. Binary string expected.')
      }

      const data = proofNode[i]
      let nodeHash

      const nodeKeyBuffer = convert.binaryStringToUint8Array(i)
      const nodeKey = convert.uint8ArrayToHexadecimal(nodeKeyBuffer)

      if (typeof data === 'string') {
        if (!validate.validateHexadecimal(data)) {
          throw new TypeError('Tree element of wrong type is passed. Hexadecimal expected.')
        }

        nodeHash = hash({
          key: {
            variant: 1,
            key: nodeKey,
            length: 0
          },
          hash: data
        }, RootBranch)

        if (rootHash === nodeHash) {
          if (key !== nodeKey) {
            return null // no element with data in tree
          } else {
            throw new Error('Invalid key with hash is in the root of proofNode parameter.')
          }
        } else {
          throw new Error('rootHash parameter is not equal to actual hash.')
        }
      } else if (isObject(data)) {
        element = getElement(data.val)

        nodeHash = hash({
          key: {
            variant: 1,
            key: nodeKey,
            length: 0
          },
          hash: getHash(element)
        }, RootBranch)

        if (rootHash === nodeHash) {
          if (key === nodeKey) {
            return element
          } else {
            throw new Error('Invalid key with value is in the root of proofNode parameter.')
          }
        } else {
          throw new Error('rootHash parameter is not equal to actual hash.')
        }
      } else {
        throw new Error('Invalid type of value in the root of proofNode parameter.')
      }
    }
  } else {
    const actualHash = recursive(proofNode, '')

    if (rootHash !== actualHash) {
      throw new Error('rootHash parameter is not equal to actual hash.')
    } else if (element === undefined) {
      return null // no element with data in tree
    }

    return element
  }
}

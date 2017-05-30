import {isObject} from '../helpers';
import * as primitive from '../types/primitive';
import {newType} from '../types/generic';
import * as validate from '../types/validate';
import * as convert from '../types/convert';
import {hash} from '../crypto';

const MERKLE_PATRICIA_KEY_LENGTH = 32;

/**
 * Check Merkle Patricia tree proof and return element
 * @param {string} rootHash
 * @param {Object} proofNode
 * @param {string} key
 * @param {NewType} [type] - optional
 * @return {Object}
 */
export function merklePatriciaProof(rootHash, proofNode, key, type) {
    var DBKey = newType({
        size: 34,
        fields: {
            variant: {type: primitive.Uint8, size: 1, from: 0, to: 1},
            key: {type: primitive.Hash, size: 32, from: 1, to: 33},
            length: {type: primitive.Uint8, size: 1, from: 33, to: 34}
        }
    });
    var Branch = newType({
        size: 132,
        fields: {
            left_hash: {type: primitive.Hash, size: 32, from: 0, to: 32},
            right_hash: {type: primitive.Hash, size: 32, from: 32, to: 64},
            left_key: {type: DBKey, size: 34, from: 64, to: 98},
            right_key: {type: DBKey, size: 34, from: 98, to: 132}
        }
    });
    var RootBranch = newType({
        size: 66,
        fields: {
            key: {type: DBKey, size: 34, from: 0, to: 34},
            hash: {type: primitive.Hash, size: 32, from: 34, to: 66}
        }
    });

    /**
     * Get element from node
     * @param data
     * @returns {string} or {Array} or {Object}
     */
    function getElement(data) {
        if (typeof data === 'string') {
            if (validate.validateHexHash(data)) {
                return data;
            }
        } else if (Array.isArray(data)) {
            if (validate.validateBytesArray(data)) {
                return data.slice(0); // clone array of 8-bit integers
            }
        } else if (isObject(data)) {
            return JSON.parse(JSON.stringify(data)); // deep clone
        }
    }

    /**
     * Get hash of element
     * @param element
     * @returns {string}
     */
    function getHash(element) {
        if (typeof element === 'string') {
            return hash(convert.hexadecimalToUint8Array(element));
        } else if (Array.isArray(element)) {
            return hash(element);
        } else if (isObject(element)) {
            return hash(element, type);
        }
    }

    /**
     * Check either suffix is a part of search key
     * @param {string} prefix
     * @param {string} suffix
     * @returns {boolean}
     */
    function isPartOfSearchKey(prefix, suffix) {
        // remove prefix from searched binary key
        var diff = keyBinary.substr(prefix.length);
        return diff.indexOf(suffix) === 0;
    }

    /**
     * Recursive tree traversal function
     * @param {Object} node
     * @param {string} keyPrefix
     * @returns {string}
     */
    function recursive(node, keyPrefix) {
        if (Object.keys(node).length !== 2) {
            console.error('Invalid number of children in the tree node.');
            return null;
        }

        var levelData = {};
        var fullKey;

        for (var keySuffix in node) {
            if (!node.hasOwnProperty(keySuffix)) {
                continue;
            }

            // validate key
            if (validate.validateBinaryString(keySuffix) === false) {
                return null;
            }

            var branchValueHash;
            var nodeValue = node[keySuffix];
            var branchType;
            var branchKey;
            var branchKeyHash;

            fullKey = keyPrefix + keySuffix;

            if (fullKey.length === MERKLE_PATRICIA_KEY_LENGTH * 8) {
                if (typeof nodeValue === 'string') {
                    if (validate.validateHexHash(nodeValue) === false) {
                        return null;
                    }
                    branchValueHash = nodeValue;
                    branchType = 'hash';
                } else if (isObject(nodeValue)) {
                    if (nodeValue.val === undefined) {
                        console.error('Leaf tree contains invalid data.');
                        return null;
                    } else if (element !== undefined) {
                        console.error('Tree can not contains more than one node with value.');
                        return null;
                    }

                    element = getElement(nodeValue.val);
                    if (element === undefined) {
                        return null;
                    }
                    branchValueHash = getHash(element);
                    if (branchValueHash === undefined) {
                        return null;
                    }

                    branchType = 'value';
                }  else {
                    console.error('Invalid type of node in tree leaf.');
                    return null;
                }

                branchKeyHash = convert.binaryStringToHexadecimal(fullKey);
                branchKey = {
                    variant: 1,
                    key: branchKeyHash,
                    length: 0
                };
            } else if (fullKey.length < MERKLE_PATRICIA_KEY_LENGTH * 8) { // node is branch
                if (typeof nodeValue === 'string') {
                    if (validate.validateHexHash(nodeValue) === false) {
                        return null;
                    }
                    branchValueHash = nodeValue;
                    branchType = 'hash';
                } else if (isObject(nodeValue)) {
                    if (nodeValue.val !== undefined) {
                        console.error('Node with value is at non-leaf position in tree.');
                        return null;
                    }

                    branchValueHash = recursive(nodeValue, fullKey);
                    if (branchValueHash === null) {
                        return null;
                    }
                    branchType = 'branch';
                }  else {
                    console.error('Invalid type of node in tree.');
                    return null;
                }

                var binaryKeyLength = fullKey.length;
                var binaryKey = fullKey;

                for (var j = 0; j < (MERKLE_PATRICIA_KEY_LENGTH * 8 - fullKey.length); j++) {
                    binaryKey += '0';
                }

                branchKeyHash = convert.binaryStringToHexadecimal(binaryKey);
                branchKey = {
                    variant: 0,
                    key: branchKeyHash,
                    length: binaryKeyLength
                };
            } else {
                console.error('Invalid length of key in tree.');
                return null;
            }

            if (keySuffix[0] === '0') { // '0' at the beginning means left branch/leaf
                if (levelData.left === undefined) {
                    levelData.left = {
                        hash: branchValueHash,
                        key: branchKey,
                        type: branchType,
                        suffix: keySuffix,
                        size: fullKey.length
                    };
                } else {
                    console.error('Left node is duplicated in tree.');
                    return null;
                }
            } else { // '1' at the beginning means right branch/leaf
                if (levelData.right === undefined) {
                    levelData.right = {
                        hash: branchValueHash,
                        key: branchKey,
                        type: branchType,
                        suffix: keySuffix,
                        size: fullKey.length
                    };
                } else {
                    console.error('Right node is duplicated in tree.');
                    return null;
                }
            }
        }

        if ((levelData.left.type === 'hash') && (levelData.right.type === 'hash') && (fullKey.length < MERKLE_PATRICIA_KEY_LENGTH * 8)) {
            if (isPartOfSearchKey(keyPrefix, levelData.left.suffix)) {
                console.error('Tree is invalid. Left key is a part of search key but its branch is not expanded.');
                return null;
            } else if (isPartOfSearchKey(keyPrefix, levelData.right.suffix)) {
                console.error('Tree is invalid. Right key is a part of search key but its branch is not expanded.');
                return null;
            }
        }

        return hash({
            left_hash: levelData.left.hash,
            right_hash: levelData.right.hash,
            left_key: levelData.left.key,
            right_key: levelData.right.key
        }, Branch);
    }

    var element;

    // validate rootHash parameter
    if (validate.validateHexHash(rootHash) === false) {
        return;
    }
    rootHash = rootHash.toLowerCase();

    // validate proofNode parameter
    if (isObject(proofNode) === false) {
        console.error('Invalid type of proofNode parameter. Object expected.');
        return;
    }

    // validate key parameter
    if (Array.isArray(key)) {
        if (validate.validateBytesArray(key, MERKLE_PATRICIA_KEY_LENGTH)) {
            key = convert.uint8ArrayToHexadecimal(key);
        } else {
            return;
        }
    } else if (typeof key === 'string') {
        if (validate.validateHexHash(key, MERKLE_PATRICIA_KEY_LENGTH) === false) {
            return;
        }
    } else {
        console.error('Invalid type of key parameter. Array of 8-bit integers or hexadecimal string is expected.');
        return;
    }
    var keyBinary = convert.hexadecimalToBinaryString(key);

    var proofNodeRootNumberOfNodes = Object.keys(proofNode).length;
    if (proofNodeRootNumberOfNodes === 0) {
        if (rootHash === (new Uint8Array(MERKLE_PATRICIA_KEY_LENGTH * 2)).join('')) {
            return null;
        } else {
            console.error('Invalid rootHash parameter of empty tree.');
            return;
        }
    } else if (proofNodeRootNumberOfNodes === 1) {
        for (var i in proofNode) {
            if (!proofNode.hasOwnProperty(i)) {
                continue;
            }

            if (validate.validateBinaryString(i, 256) === false) {
                return;
            }

            var data = proofNode[i];
            var nodeKeyBuffer = convert.binaryStringToUint8Array(i);
            var nodeKey = convert.uint8ArrayToHexadecimal(nodeKeyBuffer);
            var nodeHash;

            if (typeof data === 'string') {
                if (validate.validateHexHash(data) === false) {
                    return;
                }

                nodeHash = hash({
                    key: {
                        variant: 1,
                        key: nodeKey,
                        length: 0
                    },
                    hash: data
                }, RootBranch);

                if (rootHash === nodeHash) {
                    if (key !== nodeKey) {
                        return null; // no element with data in tree
                    } else {
                        console.error('Invalid key with hash is in the root of proofNode parameter.');
                        return;
                    }
                } else {
                    console.error('rootHash parameter is not equal to actual hash.');
                    return;
                }
            } else if (isObject(data)) {
                element = getElement(data.val);
                if (element === undefined) {
                    return;
                }

                var elementsHash = getHash(element);

                nodeHash = hash({
                    key: {
                        variant: 1,
                        key: nodeKey,
                        length: 0
                    },
                    hash: elementsHash
                }, RootBranch);

                if (rootHash === nodeHash) {
                    if (key === nodeKey) {
                        return element;
                    } else {
                        console.error('Invalid key with value is in the root of proofNode parameter.');
                        return;
                    }
                } else {
                    console.error('rootHash parameter is not equal to actual hash.');
                    return;
                }
            } else {
                console.error('Invalid type of value in the root of proofNode parameter.');
                return;
            }

        }
    } else {
        var actualHash = recursive(proofNode, '');

        if (actualHash === null) { // tree is invalid
            return;
        } else if (rootHash !== actualHash) {
            console.error('rootHash parameter is not equal to actual hash.');
            return;
        } else if (element === undefined) {
            return null; // no element with data in tree
        }

        return element;
    }
}

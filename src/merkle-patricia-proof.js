'use strict';
var Exonum = require('../src/core');

require('../src/convertors');
require('../src/data-management');
require('../src/validators');

const MERKLE_PATRICIA_KEY_LENGTH = 32;

var DBKey = Exonum.newType({
    size: 34,
    fields: {
        variant: {type: Exonum.Uint8, size: 1, from: 0, to: 1},
        key: {type: Exonum.Hash, size: 32, from: 1, to: 33},
        length: {type: Exonum.Uint8, size: 1, from: 33, to: 34}
    }
});
var Branch = Exonum.newType({
    size: 132,
    fields: {
        left_hash: {type: Exonum.Hash, size: 32, from: 0, to: 32},
        right_hash: {type: Exonum.Hash, size: 32, from: 32, to: 64},
        left_key: {type: DBKey, size: 34, from: 64, to: 98},
        right_key: {type: DBKey, size: 34, from: 98, to: 132}
    }
});
var RootBranch = Exonum.newType({
    size: 66,
    fields: {
        key: {type: DBKey, size: 34, from: 0, to: 34},
        hash: {type: Exonum.Hash, size: 32, from: 34, to: 66}
    }
});

/**
 * Check Merkle Patricia tree proof and return element
 * @param {string} rootHash
 * @param {Object} proofNode
 * @param {string} key
 * @param {NewType} [type] - optional
 * @return {Object}
 */
Exonum.merklePatriciaProof = function(rootHash, proofNode, key, type) {
    /**
     * Get value from node
     * @param data
     * @returns {string} or {Array} or {Object}
     */
    function getHash(data) {
        var elementsHash;

        if (typeof data === 'string') {
            if (Exonum.validateHexHash(data)) {
                element = data;
                elementsHash = Exonum.hash(Exonum.hexadecimalToUint8Array(element));
            } else {
                console.error('Invalid hexadecimal string is passed as value in tree.');
                return;
            }
        } else if (Array.isArray(data)) {
            if (Exonum.validateBytesArray(data)) {
                element = data.slice(0); // clone array of 8-bit integers
                elementsHash = Exonum.hash(element);
            } else {
                return;
            }
        } else if (Exonum.isObject(data)) {
            element = data;
            elementsHash = Exonum.hash(element, type);
        } else {
            console.error('Invalid value node in tree. Object expected.');
            return;
        }

        if (elementsHash === undefined) {
            return;
        }

        return elementsHash;
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
            if (Exonum.validateBinaryString(keySuffix) === false) {
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
                    if (Exonum.validateHexHash(nodeValue) === false) {
                        return null;
                    }
                    branchValueHash = nodeValue;
                    branchType = 'hash';
                } else if (Exonum.isObject(nodeValue)) {
                    if (nodeValue.val === undefined) {
                        console.error('Leaf tree contains invalid data.');
                        return null;
                    } else if (element !== undefined) {
                        console.error('Tree can not contains more than one node with value.');
                        return null;
                    }

                    branchValueHash = getHash(nodeValue.val);
                    if (branchValueHash === undefined) {
                        return null;
                    }
                    branchType = 'value';
                }  else {
                    console.error('Invalid type of node in tree leaf.');
                    return null;
                }

                branchKeyHash = Exonum.binaryStringToHexadecimal(fullKey);
                branchKey = {
                    variant: 1,
                    key: branchKeyHash,
                    length: 0
                };
            } else if (fullKey.length < MERKLE_PATRICIA_KEY_LENGTH * 8) { // node is branch
                if (typeof nodeValue === 'string') {
                    if (Exonum.validateHexHash(nodeValue) === false) {
                        return null;
                    }
                    branchValueHash = nodeValue;
                    branchType = 'hash';
                } else if (Exonum.isObject(nodeValue)) {
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

                branchKeyHash = Exonum.binaryStringToHexadecimal(binaryKey);
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

        return Exonum.hash({
            left_hash: levelData.left.hash,
            right_hash: levelData.right.hash,
            left_key: levelData.left.key,
            right_key: levelData.right.key
        }, Branch);
    }

    var element;

    // validate rootHash parameter
    if (Exonum.validateHexHash(rootHash) === false) {
        return undefined;
    }
    rootHash = rootHash.toLowerCase();

    // validate proofNode parameter
    if (Exonum.isObject(proofNode) === false) {
        console.error('Invalid type of proofNode parameter. Object expected.');
        return undefined;
    }

    // validate key parameter
    if (Array.isArray(key)) {
        if (Exonum.validateBytesArray(key, MERKLE_PATRICIA_KEY_LENGTH)) {
            key = Exonum.uint8ArrayToHexadecimal(key);
        } else {
            return undefined;
        }
    } else if (typeof key === 'string') {
        if (Exonum.validateHexHash(key, MERKLE_PATRICIA_KEY_LENGTH) === false) {
            return undefined;
        }
    } else {
        console.error('Invalid type of key parameter. Array of 8-bit integers or hexadecimal string is expected.');
        return undefined;
    }
    var keyBinary = Exonum.hexadecimalToBinaryString(key);

    var proofNodeRootNumberOfNodes = Object.keys(proofNode).length;
    if (proofNodeRootNumberOfNodes === 0) {
        if (rootHash === (new Uint8Array(MERKLE_PATRICIA_KEY_LENGTH * 2)).join('')) {
            return null;
        } else {
            console.error('Invalid rootHash parameter of empty tree.');
            return undefined;
        }
    } else if (proofNodeRootNumberOfNodes === 1) {
        for (var i in proofNode) {
            if (!proofNode.hasOwnProperty(i)) {
                continue;
            }

            if (Exonum.validateBinaryString(i, 256) === false) {
                return undefined;
            }

            var data = proofNode[i];
            var nodeKeyBuffer = Exonum.binaryStringToUint8Array(i);
            var nodeKey = Exonum.uint8ArrayToHexadecimal(nodeKeyBuffer);
            var nodeHash;

            if (typeof data === 'string') {
                if (Exonum.validateHexHash(data) === false) {
                    return undefined;
                }

                nodeHash = Exonum.hash({
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
                        return undefined;
                    }
                } else {
                    console.error('rootHash parameter is not equal to actual hash.');
                    return undefined;
                }
            } else if (Exonum.isObject(data)) {
                var elementsHash = getHash(data.val);
                if (elementsHash === undefined) {
                    return undefined;
                }

                nodeHash = Exonum.hash({
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
                        return undefined;
                    }
                } else {
                    console.error('rootHash parameter is not equal to actual hash.');
                    return undefined;
                }
            } else {
                console.error('Invalid type of value in the root of proofNode parameter.');
                return undefined;
            }

        }
    } else {
        var actualHash = recursive(proofNode, '');

        if (actualHash === null) { // tree is invalid
            return undefined;
        } else if (rootHash !== actualHash) {
            console.error('rootHash parameter is not equal to actual hash.');
            return undefined;
        } else if (element === undefined) {
            return null; // no element with data in tree
        }

        return element;
    }
};

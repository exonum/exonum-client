'use strict';

import objectAssign from 'object-assign';

const MERKLE_PATRICIA_KEY_LENGTH = 32;

/**
 * Check Merkle Patricia tree proof and return element
 * @param {String} rootHash
 * @param {Object} proofNode
 * @param key
 * @param {NewType} type (optional)
 * @return {Object}
 */
export function merklePatriciaProof(rootHash, proofNode, key, type) {
    var self = this;
    var DBKey = this.newType({
        size: 34,
        fields: {
            variant: {type: this.Uint8, size: 1, from: 0, to: 1},
            key: {type: this.Hash, size: 32, from: 1, to: 33},
            length: {type: this.Uint8, size: 1, from: 33, to: 34}
        }
    });
    var Branch = this.newType({
        size: 132,
        fields: {
            left_hash: {type: this.Hash, size: 32, from: 0, to: 32},
            right_hash: {type: this.Hash, size: 32, from: 32, to: 64},
            left_key: {type: DBKey, size: 34, from: 64, to: 98},
            right_key: {type: DBKey, size: 34, from: 98, to: 132}
        }
    });
    var RootBranch = this.newType({
        size: 66,
        fields: {
            key: {type: DBKey, size: 34, from: 0, to: 34},
            hash: {type: this.Hash, size: 32, from: 34, to: 66}
        }
    });

    /**
     * Get value from node
     * @param data
     * @returns {String || Array || Object}
     */
    function getHash(data) {
        var elementsHash;

        if (typeof data === 'string') {
            if (self.validateHexHash.call(self, data) === true) {
                element = data;
                elementsHash = self.hash.call(self, self.hexadecimalToUint8Array.call(self, element));
            } else {
                console.error('Invalid hexadecimal string is passed as value in tree.');
                return;
            }
        } else if (Array.isArray(data)) {
            if (self.validateBytesArray.call(self, data) === true) {
                element = data.slice(0); // clone array of 8-bit integers
                elementsHash = self.hash.call(self, element);
            } else {
                return;
            }
        } else if (self.isObject.call(self, data) === true) {
            element = objectAssign(data); // deep copy
            elementsHash = self.hash.call(self, element, type);
        } else {
            console.error('Invalid value node in tree. Object expected.');
            return;
        }

        if (typeof elementsHash === 'undefined') {
            return;
        }

        return elementsHash;
    }

    /**
     * Check either suffix is a part of search key
     * @param {String} prefix
     * @param {String} suffix
     * @returns {Boolean}
     */
    function isPartOfSearchKey(prefix, suffix) {
        var diff = keyBinary.substr(prefix.length);
        return diff[0] === suffix[0];
    }

    /**
     * Recursive tree traversal function
     * @param {Object} node
     * @param {String} keyPrefix
     * @returns {String}
     */
    function recursive(node, keyPrefix) {
        if (self.getObjectLength.call(self, node) !== 2) {
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
            if (self.validateBinaryString.call(self, keySuffix) === false) {
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
                    if (self.validateHexHash.call(self, nodeValue) === false) {
                        return null;
                    }
                    branchValueHash = nodeValue;
                    branchType = 'hash';
                } else if (self.isObject.call(self, nodeValue) === true) {
                    if (typeof nodeValue.val === 'undefined') {
                        console.error('Leaf tree contains invalid data.');
                        return null;
                    } else if (typeof element !== 'undefined') {
                        console.error('Tree can not contains more than one node with value.');
                        return null;
                    }

                    branchValueHash = getHash(nodeValue.val);
                    if (typeof branchValueHash === 'undefined') {
                        return null;
                    }
                    branchType = 'value';
                }  else {
                    console.error('Invalid type of node in tree leaf.');
                    return null;
                }

                branchKeyHash = self.binaryStringToHexadecimal.call(self, fullKey);
                branchKey = {
                    variant: 1,
                    key: branchKeyHash,
                    length: 0
                };
            } else if (fullKey.length < MERKLE_PATRICIA_KEY_LENGTH * 8) { // node is branch
                if (typeof nodeValue === 'string') {
                    if (self.validateHexHash.call(self, nodeValue) === false) {
                        return null;
                    }
                    branchValueHash = nodeValue;
                    branchType = 'hash';
                } else if (self.isObject.call(self, nodeValue) === true) {
                    if (typeof nodeValue.val !== 'undefined') {
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

                branchKeyHash = self.binaryStringToHexadecimal.call(self, binaryKey);
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
                if (typeof levelData.left === 'undefined') {
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
                if (typeof levelData.right === 'undefined') {
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

        return self.hash.call(self, {
            left_hash: levelData.left.hash,
            right_hash: levelData.right.hash,
            left_key: levelData.left.key,
            right_key: levelData.right.key
        }, Branch);
    }

    var element;

    // validate rootHash parameter
    if (this.validateHexHash(rootHash) === false) {
        return undefined;
    }
    rootHash = rootHash.toLowerCase();

    // validate proofNode parameter
    if (this.isObject(proofNode) === false) {
        console.error('Invalid type of proofNode parameter. Object expected.');
        return undefined;
    }

    // validate key parameter
    if (Array.isArray(key)) {
        if (this.validateBytesArray(key, MERKLE_PATRICIA_KEY_LENGTH) === true) {
            key = this.uint8ArrayToHexadecimal(key);
        } else {
            return undefined;
        }
    } else if (typeof key === 'string') {
        if (this.validateHexHash(key, MERKLE_PATRICIA_KEY_LENGTH) === false) {
            return undefined;
        }
    } else {
        console.error('Invalid type of key parameter. Array of 8-bit integers or hexadecimal string is expected.');
        return undefined;
    }
    var keyBinary = this.hexadecimalToBinaryString(key);

    var proofNodeRootNumberOfNodes = this.getObjectLength(proofNode);
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

            if (this.validateBinaryString(i, 256) === false) {
                return undefined;
            }

            var data = proofNode[i];
            var nodeKeyBuffer = this.binaryStringToUint8Array(i);
            var nodeKey = this.uint8ArrayToHexadecimal(nodeKeyBuffer);
            var nodeHash;

            if (typeof data === 'string') {
                if (this.validateHexHash(data) === false) {
                    return undefined;
                }

                nodeHash = this.hash({
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
            } else if (this.isObject(data)) {
                var elementsHash = getHash(data.val);
                if (typeof elementsHash === 'undefined') {
                    return undefined;
                }

                nodeHash = this.hash({
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
        } else if (typeof element === 'undefined') {
            return null; // no element with data in tree
        }

        return element;
    }
}

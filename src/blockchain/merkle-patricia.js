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
            try {
                validate.validateHexHash(data);
            } catch (error) {
                throw error;
            }
            return data;
        } else if (Array.isArray(data)) {
            try {
                validate.validateBytesArray(data);
            } catch (error) {
                throw error;
            }
            return data.slice(0); // clone array of 8-bit integers
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
            try {
                return hash(convert.hexadecimalToUint8Array(element));
            } catch (error) {
                throw error;
            }
        } else if (Array.isArray(element)) {
            try {
                return hash(element);
            } catch (error) {
                throw error;
            }
        } else if (isObject(element)) {
            try {
                return hash(element, type);
            } catch (error) {
                throw error;
            }
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
            throw new Error('Invalid number of children in the tree node.');
        }

        var levelData = {};
        var fullKey;

        for (var keySuffix in node) {
            if (!node.hasOwnProperty(keySuffix)) {
                continue;
            }

            // validate key
            try {
                validate.validateBinaryString(keySuffix);
            } catch (error) {
                throw error;
            }

            var branchValueHash;
            var nodeValue = node[keySuffix];
            var branchType;
            var branchKey;
            var branchKeyHash;

            fullKey = keyPrefix + keySuffix;

            if (fullKey.length === MERKLE_PATRICIA_KEY_LENGTH * 8) {
                if (typeof nodeValue === 'string') {
                    try {
                        validate.validateHexHash(nodeValue);
                    } catch (error) {
                        throw error;
                    }

                    branchValueHash = nodeValue;
                    branchType = 'hash';
                } else if (isObject(nodeValue)) {
                    if (nodeValue.val === undefined) {
                        throw new TypeError('Leaf tree contains invalid data.');
                    } else if (element !== undefined) {
                        throw new Error('Tree can not contains more than one node with value.');
                    }

                    try {
                        element = getElement(nodeValue.val);
                        branchValueHash = getHash(element);
                    } catch (error) {
                        throw error;
                    }

                    branchType = 'value';
                }  else {
                    throw new TypeError('Invalid type of node in tree leaf.');
                }

                try {
                    branchKeyHash = convert.binaryStringToHexadecimal(fullKey);
                } catch (error) {
                    throw error;
                }

                branchKey = {
                    variant: 1,
                    key: branchKeyHash,
                    length: 0
                };
            } else if (fullKey.length < MERKLE_PATRICIA_KEY_LENGTH * 8) { // node is branch
                if (typeof nodeValue === 'string') {
                    try {
                        validate.validateHexHash(nodeValue);
                    } catch (error) {
                        throw error;
                    }

                    branchValueHash = nodeValue;
                    branchType = 'hash';
                } else if (isObject(nodeValue)) {
                    if (nodeValue.val !== undefined) {
                        throw new Error('Node with value is at non-leaf position in tree.');
                    }

                    try {
                        branchValueHash = recursive(nodeValue, fullKey);
                    } catch (error) {
                        throw error;
                    }

                    branchType = 'branch';
                }  else {
                    throw new TypeError('Invalid type of node in tree.');
                }

                var binaryKeyLength = fullKey.length;
                var binaryKey = fullKey;

                for (var j = 0; j < (MERKLE_PATRICIA_KEY_LENGTH * 8 - fullKey.length); j++) {
                    binaryKey += '0';
                }

                try {
                    branchKeyHash = convert.binaryStringToHexadecimal(binaryKey);
                } catch (error) {
                    throw error;
                }

                branchKey = {
                    variant: 0,
                    key: branchKeyHash,
                    length: binaryKeyLength
                };
            } else {
                throw new Error('Invalid length of key in tree.');
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
                    throw new Error('Left node is duplicated in tree.');
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
                    throw new Error('Right node is duplicated in tree.');
                }
            }
        }

        if ((levelData.left.type === 'hash') && (levelData.right.type === 'hash') && (fullKey.length < MERKLE_PATRICIA_KEY_LENGTH * 8)) {
            if (isPartOfSearchKey(keyPrefix, levelData.left.suffix)) {
                throw new Error('Tree is invalid. Left key is a part of search key but its branch is not expanded.');
            } else if (isPartOfSearchKey(keyPrefix, levelData.right.suffix)) {
                throw new Error('Tree is invalid. Right key is a part of search key but its branch is not expanded.');
            }
        }

        try {
            return hash({
                left_hash: levelData.left.hash,
                right_hash: levelData.right.hash,
                left_key: levelData.left.key,
                right_key: levelData.right.key
            }, Branch);
        } catch (error) {
            throw error;
        }
    }

    var element;

    // validate rootHash parameter
    try {
        validate.validateHexHash(rootHash);
    } catch (error) {
        throw error;
    }

    rootHash = rootHash.toLowerCase();

    // validate proofNode parameter
    if (isObject(proofNode) === false) {
        throw new TypeError('Invalid type of proofNode parameter. Object expected.');
    }

    // validate key parameter
    if (Array.isArray(key)) {
        try {
            validate.validateBytesArray(key, MERKLE_PATRICIA_KEY_LENGTH);
        } catch (error) {
            throw error;
        }

        key = convert.uint8ArrayToHexadecimal(key);
    } else if (typeof key === 'string') {
        try {
            validate.validateHexHash(key, MERKLE_PATRICIA_KEY_LENGTH);
        } catch (error) {
            throw error;
        }
    } else {
        throw new TypeError('Invalid type of key parameter. Array of 8-bit integers or hexadecimal string is expected.');
    }

    try {
        var keyBinary = convert.hexadecimalToBinaryString(key);
    } catch (error) {
        throw error;
    }

    var proofNodeRootNumberOfNodes = Object.keys(proofNode).length;
    if (proofNodeRootNumberOfNodes === 0) {
        if (rootHash === (new Uint8Array(MERKLE_PATRICIA_KEY_LENGTH * 2)).join('')) {
            return null;
        } else {
            throw new Error('Invalid rootHash parameter of empty tree.');
        }
    } else if (proofNodeRootNumberOfNodes === 1) {
        for (var i in proofNode) {
            if (!proofNode.hasOwnProperty(i)) {
                continue;
            }

            try {
                validate.validateBinaryString(i, 256);
            } catch (error) {
                throw error;
            }

            var data = proofNode[i];
            var nodeHash;

            try {
                var nodeKeyBuffer = convert.binaryStringToUint8Array(i);
                var nodeKey = convert.uint8ArrayToHexadecimal(nodeKeyBuffer);
            } catch (error) {
                throw error;
            }

            if (typeof data === 'string') {
                try {
                    validate.validateHexHash(data);

                    nodeHash = hash({
                        key: {
                            variant: 1,
                            key: nodeKey,
                            length: 0
                        },
                        hash: data
                    }, RootBranch);
                } catch (error) {
                    throw error;
                }

                if (rootHash === nodeHash) {
                    if (key !== nodeKey) {
                        return null; // no element with data in tree
                    } else {
                        throw new Error('Invalid key with hash is in the root of proofNode parameter.');
                    }
                } else {
                    throw new Error('rootHash parameter is not equal to actual hash.');
                }
            } else if (isObject(data)) {
                try {
                    element = getElement(data.val);

                    nodeHash = hash({
                        key: {
                            variant: 1,
                            key: nodeKey,
                            length: 0
                        },
                        hash: getHash(element)
                    }, RootBranch);
                } catch (error) {
                    throw error;
                }

                if (rootHash === nodeHash) {
                    if (key === nodeKey) {
                        return element;
                    } else {
                        throw new Error('Invalid key with value is in the root of proofNode parameter.');
                    }
                } else {
                    throw new Error('rootHash parameter is not equal to actual hash.');
                }
            } else {
                throw new Error('Invalid type of value in the root of proofNode parameter.');
            }

        }
    } else {
        try {
            var actualHash = recursive(proofNode, '');
        } catch (error) {
            throw error;
        }

        if (rootHash !== actualHash) {
            throw new Error('rootHash parameter is not equal to actual hash.');
        } else if (element === undefined) {
            return null; // no element with data in tree
        }

        return element;
    }
}

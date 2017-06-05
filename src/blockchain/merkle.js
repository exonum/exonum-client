import bigInt from 'big-integer';
import {isObject} from '../helpers';
import {isInstanceofOfNewType} from '../types/generic';
import {validateHexadecimal, validateBytesArray} from '../types/validate';
import {hexadecimalToUint8Array} from '../types/convert';
import {hash} from '../crypto';

/**
 * Calculate height of merkle tree
 * @param {bigInt} count
 * @return {number}
 */
function calcHeight(count) {
    var i = 0;
    while (bigInt(2).pow(i).lt(count)) {
        i++;
    }
    return i;
}

/**
 * Check proof of Merkle tree and return array of elements
 * @param {string} rootHash
 * @param {number} count
 * @param {Object} proofNode
 * @param {Array} range
 * @param {NewType} [type] - optional
 * @return {Array}
 */
export function merkleProof(rootHash, count, proofNode, range, type) {
    var elements = [];
    var rootBranch = 'left';

    /**
     * Get value from node, insert into elements array and return its hash
     * @param data
     * @param {number} depth
     * @param {number} index
     * @returns {string}
     */
    function getHash(data, depth, index) {
        var element;
        var elementsHash;

        if (depth !== 0 && (depth + 1) !== height) {
            throw new Error('Value node is on wrong height in tree.');
        } else if (start.gt(index) || end.lt(index)) {
            throw new Error('Wrong index of value node.');
        } else if (start.plus(elements.length).neq(index)) {
            throw new Error('Value node is on wrong position in tree.');
        }

        if (typeof data === 'string') {
            if (!validateHexadecimal(data)) {
                throw new TypeError('Tree element of wrong type is passed. Hexadecimal expected.');
            }
            element = data;
            elementsHash = hash(hexadecimalToUint8Array(element));
        } else if (Array.isArray(data)) {
            if (!validateBytesArray(data)) {
                throw new TypeError('Tree element of wrong type is passed. Bytes array expected.');
            }
            element = data.slice(0); // clone array of 8-bit integers
            elementsHash = hash(element);
        } else if (isObject(data)) {
            if (isInstanceofOfNewType(type)) {
                element = data;
                elementsHash = hash(element, type);
            } else {
                throw new TypeError('Invalid type of type parameter.');
            }
        } else {
            throw new TypeError('Invalid value of data parameter.');
        }

        elements.push(element);
        return elementsHash;
    }

    /**
     * Recursive tree traversal function
     * @param {Object} node
     * @param {number} depth
     * @param {number} index
     * @returns {string}
     */
    function recursive(node, depth, index) {
        var hashLeft;
        var hashRight;
        var summingBuffer;

        // case with single node in tree
        if (depth === 0 && node.val !== undefined) {
            return getHash(node.val, depth, index * 2);
        }

        if (node.left !== undefined) {
            if (typeof node.left === 'string') {
                if (!validateHexadecimal(node.left)) {
                    throw new TypeError('Tree element of wrong type is passed. Hexadecimal expected.');
                }
                hashLeft = node.left;
            } else if (isObject(node.left)) {
                if (node.left.val !== undefined) {
                    hashLeft = getHash(node.left.val, depth, index * 2);
                } else {
                    hashLeft = recursive(node.left, depth + 1, index * 2);
                }
            } else {
                throw new TypeError('Invalid type of left node.');
            }
        } else {
            throw new Error('Left node is missed.');
        }

        if (depth === 0) {
            rootBranch = 'right';
        }

        if (node.right !== undefined) {
            if (typeof node.right === 'string') {
                if (!validateHexadecimal(node.right)) {
                    throw new TypeError('Tree element of wrong type is passed. Hexadecimal expected.');
                }
                hashRight = node.right;
            } else if (isObject(node.right)) {
                if (node.right.val !== undefined) {
                    hashRight = getHash(node.right.val, depth, index * 2 + 1);
                } else {
                    hashRight = recursive(node.right, depth + 1, index * 2 + 1);
                }
            } else {
                throw new TypeError('Invalid type of right node.');
            }

            summingBuffer = new Uint8Array(64);
            summingBuffer.set(hexadecimalToUint8Array(hashLeft));
            summingBuffer.set(hexadecimalToUint8Array(hashRight), 32);
        } else if (depth === 0 || rootBranch === 'left') {
            throw new Error('Right leaf is missed in left branch of tree.');
        } else {
            summingBuffer = hexadecimalToUint8Array(hashLeft);
        }

        return hash(summingBuffer);
    }

    // validate rootHash
    if (!validateHexadecimal(rootHash)) {
        throw new TypeError('Root hash of wrong type is passed. Hexadecimal expected.');
    }

    // validate count
    if (!(typeof count === 'number' || typeof count === 'string')) {
        throw new TypeError('Invalid value is passed as count parameter. Number or string is expected.');
    }

    try {
        count = bigInt(count);
    } catch (e) {
        throw new TypeError('Invalid value is passed as count parameter.');
    }

    if (count.lt(0)) {
        throw new RangeError('Invalid count parameter. Count can\'t be below zero.');
    }

    // validate range
    if (Array.isArray(range) === false || range.length !== 2) {
        throw new TypeError('Invalid type of range parameter. Array of two elements expected.');
    } else if (!(typeof range[0] === 'number' || typeof range[0] === 'string')) {
        throw new TypeError('Invalid value is passed as start of range parameter.');
    } else if (!(typeof range[1] === 'number' || typeof range[1] === 'string')) {
        throw new TypeError('Invalid value is passed as end of range parameter.');
    }

    try {
        var rangeStart = bigInt(range[0]);
    } catch (e) {
        throw new TypeError('Invalid value is passed as start of range parameter. Number or string is expected.');
    }

    try {
        var rangeEnd = bigInt(range[1]);
    } catch (e) {
        throw new TypeError('Invalid value is passed as end of range parameter. Number or string is expected.');
    }

    if (rangeStart.gt(rangeEnd)) {
        throw new RangeError('Invalid range parameter. Start index can\'t be out of range.');
    } else if (rangeStart.lt(0)) {
        throw new RangeError('Invalid range parameter. Start index can\'t be below zero.');
    } else if (rangeEnd.lt(0)) {
        throw new RangeError('Invalid range parameter. End index can\'t be below zero.');
    } else if (rangeStart.gt(count.minus(1))) {
        return [];
    }

    // validate proofNode
    if (isObject(proofNode) === false) {
        throw new TypeError('Invalid type of proofNode parameter. Object expected.');
    }

    var height = calcHeight(count);
    var start = rangeStart;
    var end = rangeEnd.lt(count) ? rangeEnd : count.minus(1);

    var actualHash = recursive(proofNode, 0, 0);

    if (rootHash.toLowerCase() !== actualHash) {
        throw new Error('rootHash parameter is not equal to actual hash.');
    } else if (bigInt(elements.length).neq(end.eq(start) ? 1 : end.minus(start).plus(1))) {
        throw new Error('Actual elements in tree amount is not equal to requested.');
    }

    return elements;
}

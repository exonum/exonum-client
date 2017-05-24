'use strict';

import bigInt from 'big-integer';
import objectAssign from 'object-assign';

/**
 * Calculate height of merkle tree
 * @param {bigInt} count
 * @return {Number}
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
 * @param {String} rootHash
 * @param {Number} count
 * @param {Object} proofNode
 * @param {Array} range
 * @param type (optional)
 * @return {Array}
 */
exports.merkleProof = function(rootHash, count, proofNode, range, type) {
    var self = this;
    var elements = [];
    var rootBranch = 'left';

    /**
     * Get value from node, insert into elements array and return its hash
     * @param data
     * @param {Number} depth
     * @param {Number} index
     * @returns {String}
     */
    function getHash(data, depth, index) {
        var element;
        var elementsHash;

        if (depth !== 0 && (depth + 1) !== height) {
            console.error('Value node is on wrong height in tree.');
            return;
        } else if (start.gt(index) || end.lt(index)) {
            console.error('Wrong index of value node.');
            return;
        } else if (start.plus(elements.length).neq(index)) {
            console.error('Value node is on wrong position in tree.');
            return;
        }

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
                console.error('Invalid array of 8-bit integers in tree.');
                return;
            }
        } else if (self.isObject.call(self, data) === true) {
            if (self.isInstanceofOfNewType.call(self, type) === true) {
                element = objectAssign(data); // deep copy
                elementsHash = self.hash.call(self, element, type);
            } else {
                console.error('Invalid type of type parameter.');
                return;
            }
        } else {
            console.error('Invalid value of data parameter.');
            return;
        }

        if (typeof elementsHash === 'undefined') {
            return;
        }

        elements.push(element);
        return elementsHash;
    }

    /**
     * Recursive tree traversal function
     * @param {Object} node
     * @param {Number} depth
     * @param {Number} index
     * @returns {String}
     */
    function recursive(node, depth, index) {
        var hashLeft;
        var hashRight;
        var summingBuffer;

        // case with single node in tree
        if (depth === 0 && typeof node.val !== 'undefined') {
            return getHash(node.val, depth, index * 2);
        }

        if (typeof node.left !== 'undefined') {
            if (typeof node.left === 'string') {
                if (self.validateHexHash.call(self, node.left) === false) {
                    return null;
                }
                hashLeft = node.left;
            } else if (self.isObject.call(self, node.left) === true) {
                if (typeof node.left.val !== 'undefined') {
                    hashLeft = getHash(node.left.val, depth, index * 2);
                } else {
                    hashLeft = recursive(node.left, depth + 1, index * 2);
                }
                if (typeof hashLeft === 'undefined') {
                    return null;
                }
            } else {
                console.error('Invalid type of left node.');
                return null;
            }
        } else {
            console.error('Left node is missed.');
            return null;
        }

        if (depth === 0) {
            rootBranch = 'right';
        }

        if (typeof node.right !== 'undefined') {
            if (typeof node.right === 'string') {
                if (self.validateHexHash.call(self, node.right) === false) {
                    return null;
                }
                hashRight = node.right;
            } else if (self.isObject.call(self, node.right) === true) {
                if (typeof node.right.val !== 'undefined') {
                    hashRight = getHash(node.right.val, depth, index * 2 + 1);
                } else {
                    hashRight = recursive(node.right, depth + 1, index * 2 + 1);
                }
                if (typeof hashRight === 'undefined') {
                    return null;
                }
            } else {
                console.error('Invalid type of right node.');
                return null;
            }

            summingBuffer = new Uint8Array(64);
            summingBuffer.set(self.hexadecimalToUint8Array.call(self, hashLeft));
            summingBuffer.set(self.hexadecimalToUint8Array.call(self, hashRight), 32);
        } else if (depth === 0 || rootBranch === 'left') {
            console.error('Right leaf is missed in left branch of tree.');
            return null;
        } else {
            summingBuffer = self.hexadecimalToUint8Array.call(self, hashLeft);
        }

        return self.hash.call(self, summingBuffer);
    }

    // validate rootHash
    if (this.validateHexHash(rootHash) === false) {
        return undefined;
    }

    // validate count
    if (!(typeof count === 'number' || typeof count === 'string')) {
        console.error('Invalid value is passed as count parameter. Number or string is expected.');
        return undefined;
    }
    try {
        count = bigInt(count);
    } catch (e) {
        console.error('Invalid value is passed as count parameter.');
        return undefined;
    }
    if (count.lt(0)) {
        console.error('Invalid count parameter. Count can\'t be below zero.');
        return undefined;
    }

    // validate range
    if (Array.isArray(range) === false || range.length !== 2) {
        console.error('Invalid type of range parameter. Array of two elements expected.');
        return undefined;
    } else if (!(typeof range[0] === 'number' || typeof range[0] === 'string')) {
        console.error('Invalid value is passed as start of range parameter.');
        return undefined;
    } else if (!(typeof range[1] === 'number' || typeof range[1] === 'string')) {
        console.error('Invalid value is passed as end of range parameter.');
        return undefined;
    }
    var rangeStart;
    try {
        rangeStart = bigInt(range[0]);
    } catch (e) {
        console.error('Invalid value is passed as start of range parameter. Number or string is expected.');
        return undefined;
    }
    var rangeEnd;
    try {
        rangeEnd = bigInt(range[1]);
    } catch (e) {
        console.error('Invalid value is passed as end of range parameter. Number or string is expected.');
        return undefined;
    }
    if (rangeStart.gt(rangeEnd)) {
        console.error('Invalid range parameter. Start index can\'t be out of range.');
        return undefined;
    } else if (rangeStart.lt(0)) {
        console.error('Invalid range parameter. Start index can\'t be below zero.');
        return undefined;
    } else if (rangeEnd.lt(0)) {
        console.error('Invalid range parameter. End index can\'t be below zero.');
        return undefined;
    } else if (rangeStart.gt(count.minus(1))) {
        return [];
    }

    // validate proofNode
    if (this.isObject(proofNode) === false) {
        console.error('Invalid type of proofNode parameter. Object expected.');
        return undefined;
    }

    var height = calcHeight(count);
    var start = rangeStart;
    var end = rangeEnd.lt(count) ? rangeEnd : count.minus(1);
    var actualHash = recursive(proofNode, 0, 0);

    if (typeof actualHash === 'undefined') { // tree is invalid
        return undefined;
    } else if (rootHash.toLowerCase() !== actualHash) {
        console.error('rootHash parameter is not equal to actual hash.');
        return undefined;
    } else if (bigInt(elements.length).neq(end.eq(start) ? 1 : end.minus(start).plus(1))) {
        console.error('Actual elements in tree amount is not equal to requested.');
        return undefined;
    }

    return elements;
};

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAP_BRANCH_PREFIX = exports.MAP_PREFIX = exports.LIST_BRANCH_PREFIX = exports.LIST_PREFIX = exports.BLOB_PREFIX = void 0;

/**
 * Prefix marker for a blob node in a `ProofMapIndex`.
 *
 * @type {number}
 */
var BLOB_PREFIX = 0;
/**
 * Prefix marker for a `ProofListIndex` object.
 * It is defined in the `HashTag` enum in the `exonum_merkledb` crate.
 *
 * @type {number}
 */

exports.BLOB_PREFIX = BLOB_PREFIX;
var LIST_PREFIX = 2;
/**
 * Prefix marker for an intermediate `ProofListIndex` node.
 * It is defined in the `HashTag` enum in the `exonum_merkledb` crate.
 *
 * @type {number}
 */

exports.LIST_PREFIX = LIST_PREFIX;
var LIST_BRANCH_PREFIX = 1;
/**
 * Prefix marker for a `ProofMapIndex` object.
 * It is defined in the `HashTag` enum in the `exonum_merkledb` crate.
 *
 * @type {number}
 */

exports.LIST_BRANCH_PREFIX = LIST_BRANCH_PREFIX;
var MAP_PREFIX = 3;
/**
 * Prefix marker for an intermediate `ProofMapIndex` nodes.
 * It is defined in the `HashTag` enum in the `exonum_merkledb` crate.
 *
 * @type {number}
 */

exports.MAP_PREFIX = MAP_PREFIX;
var MAP_BRANCH_PREFIX = 4;
exports.MAP_BRANCH_PREFIX = MAP_BRANCH_PREFIX;

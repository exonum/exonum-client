/**
 * Prefix marker for a blob node in a `ProofMapIndex`.
 *
 * @type {number}
 */
export const BLOB_PREFIX = 0
/**
 * Prefix marker for a `ProofListIndex` object.
 * It is defined in the `HashTag` enum in the `exonum_merkledb` crate.
 *
 * @type {number}
 */
export const LIST_PREFIX = 2
/**
 * Prefix marker for an intermediate `ProofListIndex` node.
 * It is defined in the `HashTag` enum in the `exonum_merkledb` crate.
 *
 * @type {number}
 */
export const LIST_BRANCH_PREFIX = 1
/**
 * Prefix marker for a `ProofMapIndex` object.
 * It is defined in the `HashTag` enum in the `exonum_merkledb` crate.
 *
 * @type {number}
 */
export const MAP_PREFIX = 3
/**
 * Prefix marker for an intermediate `ProofMapIndex` nodes.
 * It is defined in the `HashTag` enum in the `exonum_merkledb` crate.
 *
 * @type {number}
 */
export const MAP_BRANCH_PREFIX = 4

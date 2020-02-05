"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyTable = verifyTable;

var _hexadecimal = require("../types/hexadecimal");

var _merklePatricia = require("./merkle-patricia");

/**
 * Validate path from tree root to some table
 * @param {Object} proof
 * @param {string} stateHash
 * @param {string} tableFullName
 * @returns {string}
 */
function verifyTable(proof, stateHash, tableFullName) {
  var stringKeys = {
    serialize: function serialize(str) {
      return Buffer.from(str);
    }
  }; // Validate proof of table existence in the state hash.

  var tableProof = new _merklePatricia.MapProof(proof, stringKeys, _hexadecimal.Hash);

  if (tableProof.merkleRoot !== stateHash) {
    throw new Error('Table proof is corrupted');
  } // Get root hash of the table.


  var rootHash = tableProof.entries.get(tableFullName);

  if (typeof rootHash === 'undefined') {
    throw new Error('Table not found in the root tree');
  }

  return rootHash;
}

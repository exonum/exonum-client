'use strict';

const sha = require('sha.js');
const nacl = require('tweetnacl');

function _hash (buffer) {
  return sha('sha256').update(buffer).digest();
}

function _sign (message, privkey) {
  return nacl.sign.detached(message, privkey);
}

function _verify (message, signature, pubkey) {
  return nacl.sign.detached.verify(message, signature, pubkey);
}

module.exports = {
  hash: _hash,
  sign: _sign,
  verify: _verify,

  hashLength: 32,
  privateKeyLength: 32,
  publicKeyLength: 32,
  signatureLength: 64
};

'use strict';

const sha = require('sha.js');
const nacl = require('tweetnacl');

function _hash (buffer) {
  return sha('sha256').update(buffer).digest();
}

function _sign (message, secretKey) {
  if (message.raw) message = message.raw;
  if (secretKey.raw) secretKey = secretKey.raw;

  return nacl.sign.detached(message, secretKey);
}

function _verify (message, signature, pubkey) {
  if (message.raw) message = message.raw;
  if (signature.raw) signature = pubkey.raw;
  if (pubkey.raw) pubkey = pubkey.raw;

  return nacl.sign.detached.verify(message, signature, pubkey);
}

function _fromSecretKey (secretKey) {
  if (secretKey.raw) secretKey = secretKey.raw;
  return nacl.sign.keyPair.fromSecretKey(secretKey).publicKey;
}

module.exports = {
  hash: _hash,
  sign: _sign,
  verify: _verify,
  fromSecretKey: _fromSecretKey,

  hashLength: 32,
  secretKeyLength: nacl.sign.secretKeyLength,
  publicKeyLength: nacl.sign.publicKeyLength,
  signatureLength: nacl.sign.signatureLength
};

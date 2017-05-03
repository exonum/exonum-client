'use strict';

const sequence = require('./sequence').sequence;
const fixedBuffer = require('./buffer').fixedBuffer;
const crypto = require('../_crypto');

const Hash = fixedBuffer(crypto.hashLength);
const PrivateKey = fixedBuffer(crypto.privateKeyLength);
const Pubkey = fixedBuffer(crypto.publicKeyLength);
const Signature = fixedBuffer(crypto.signatureLength);

function authenticate (Type) {
  return class extends sequence([
    { name: 'from', type: Pubkey },
    { name: 'signature', type: Signature },
    { name: 'value', type: Type }
  ]) {
    sign (privkey) {
      this.signature = crypto.sign(this.value.serialize(), privkey.raw);
      if (!this.verify()) {
        throw new Error('Cannot sign object');
      }
    }

    verify () {
      return crypto.verify(this.value.serialize(), this.from.raw);
    }
  };
}

module.exports = {
  Hash: Hash,
  PrivateKey: PrivateKey,
  Pubkey: Pubkey,
  Signature: Signature,

  authenticate: authenticate
};

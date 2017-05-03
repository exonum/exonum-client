'use strict';

const sequence = require('./sequence').sequence;
const fixedBuffer = require('./buffer').fixedBuffer;
const crypto = require('../_crypto');

const Hash = fixedBuffer(crypto.hashLength);
const SecretKey = fixedBuffer(crypto.secretKeyLength);
const Pubkey = fixedBuffer(crypto.publicKeyLength);
const Signature = fixedBuffer(crypto.signatureLength);

function authenticated (Type) {
  return class extends sequence([
    { name: 'from', type: Pubkey },
    { name: 'signature', type: Signature },
    { name: 'inner', type: Type }
  ]) {
    static wrap (obj) {
      return new this({ inner: obj });
    }

    sign (secretKey) {
      this.from = crypto.fromSecretKey(secretKey.raw);
      this.signature = crypto.sign(this.inner.serialize(), secretKey.raw);
      return this;
    }

    verify () {
      return crypto.verify(this.inner.serialize(), this.signature.raw, this.from.raw);
    }
  };
}

module.exports = {
  Hash: Hash,
  SecretKey: SecretKey,
  Pubkey: Pubkey,
  Signature: Signature,

  authenticated: authenticated
};

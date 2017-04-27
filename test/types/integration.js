'use strict';
/* eslint-env node, mocha */

const expect = require('chai').expect;

// FIXME remove `/index` after replacing types
const types = require('../../src/types/index');

describe('Type integration', function () {
  var Pubkey = types.FixedBuffer(32);
  var Hash = types.FixedBuffer(32);

  var Wallet = types.Sequence([
    { name: 'pubkey', type: Pubkey },
    { name: 'name', type: types.Str },
    { name: 'balance', type: types.Uint64 },
    { name: 'history_hash', type: Hash }
  ]);

  it('should parse wallet from JSON', function () {
    var json = {
      pubkey: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
      name: 'Smart wallet',
      balance: 359120,
      history_hash: '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030'
    };
    var wallet = new Wallet(json);
    expect(wallet.pubkey.toJSON()).to.equal('f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36');
    expect(wallet.name.toJSON()).to.equal('Smart wallet');
    expect(wallet.balance.toJSON()).to.equal(359120);
    expect(wallet.history_hash.toJSON()).to.equal('6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030');
    expect(wallet.toJSON()).to.deep.equal(json);
  });
});

'use strict';
/* eslint-env node, mocha */

const expect = require('chai').expect;

// FIXME remove `/index` after replacing types
const types = require('../../src/types/index');

describe('Type integration', function () {
  var Wallet = types.sequence([
    { name: 'pubkey', type: types.Pubkey },
    { name: 'name', type: types.Str },
    { name: 'balance', type: types.Uint64 },
    { name: 'history_hash', type: types.Hash }
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

  it('should assign properties in various formats', function () {
    var json = {
      pubkey: { hex: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36' },
      balance: { oct: '1234567' },
      history_hash: '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030'
    };
    var wallet = new Wallet(json);
    expect(wallet.pubkey.toJSON()).to.equal('f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36');
    expect(wallet.balance.toJSON()).to.equal(342391);
    expect(wallet.history_hash.toJSON()).to.equal('6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030');
  });

  it('should support operations on integer properties', function () {
    var wallet = new Wallet({ balance: 10 });
    expect(wallet.balance.toJSON()).to.equal(10);
    wallet.balance += 15;
    expect(wallet.balance.toJSON()).to.equal(25);
    wallet.balance += '00';
    expect(wallet.balance.toJSON()).to.equal(2500);
    expect(wallet.balance > 2499).to.be.true;
    expect(wallet.balance <= 2501).to.be.true;
    wallet.balance -= 2499;
    expect('123'.substring(wallet.balance)).to.equal('23');
  });
});

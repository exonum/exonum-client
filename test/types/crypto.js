'use strict';
/* eslint-env node, mocha */

const chai = require('chai');
chai.use(require('../chai-equal-array'));
const expect = chai.expect;

// FIXME remove `/index` after replacing types
const types = require('../../src/types/index');
const Hash = types.Hash;
const SecretKey = types.SecretKey;
const Signature = types.Signature;

describe('Hash', function () {
  var SequenceType = types.sequence([
    { name: 'foo', type: types.fixedBuffer(4) },
    { name: 'bar', type: types.Uint32 }
  ]);

  var Wallet = types.sequence([
    { name: 'pubkey', type: types.Pubkey },
    { name: 'name', type: types.Str },
    { name: 'balance', type: types.Uint64 },
    { name: 'history_hash', type: types.Hash }
  ]);

  it('should be an Exonum type', function () {
    expect(types.isExonumType(Hash)).to.be.true;
  });

  it('should declare fixed length', function () {
    expect(Hash.byteLength).to.equal(32);
    expect(Hash.hasFixedLength).to.be.true;
  });

  describe('mixin', function () {
    [
      'Int8',
      'Uint8',
      'Int16',
      'Uint16',
      'Int32',
      'Uint32',
      'Int64',
      'Uint64',
      'Str',
      'Bool',
      'Hash',
      'Pubkey',
      'Signature'
    ].forEach(typeName => {
      it('should give hash method to built-in type ' + typeName, function () {
        expect(types[typeName].prototype).to.have.property('hash')
          .that.is.a('function');
      });
    });

    it('should give hash method to custom type', function () {
      var x = new SequenceType('deadbeef', 555);
      expect(x).to.have.property('hash').that.is.a('function');
    });

    it('should calculate hash correctly for custom type', function () {
      var x = new SequenceType('deadbeef', 555);
      // SHA256(0xdeadbeef2b020000)
      expect(x.hash()).to.equalArray(
        new Hash('739b3099b5fb4f2d51d02404e3e4383be880e16e2c2f1656a97ca27971777003').raw);
    });

    it('should calculate hash correctly for wallet type', function () {
      var wallet = new Wallet({
        pubkey: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
        name: 'Smart wallet',
        balance: 359120,
        history_hash: '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030'
      });
      expect(wallet.hash()).to.equalArray(
        new Hash('86b47510fbcbc83f9926d8898a57c53662518c97502625a6d131842f2003f974').raw);
    });
  });
});

describe('authenticated', function () {
  var AuthName = types.authenticated(types.sequence([
    { name: 'firstName', type: types.Str },
    { name: 'lastName', type: types.Str }
  ]));

  it('should have verify method', function () {
    expect(AuthName.prototype).to.have.property('verify').that.is.a('function');
  });

  it('should have sign method', function () {
    expect(AuthName.prototype).to.have.property('sign').that.is.a('function');
  });

  it('should sign a message', function () {
    var secretKey = new SecretKey(
      '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030' +
      'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36');
    var record = AuthName.wrap({
      firstName: 'John',
      lastName: 'Doe'
    }).sign(secretKey);

    expect(record.signature.raw).to.equalArray(
      new Signature(
        '7ccad21d76359c8c3ed1161eb8231edd44a91d53ea468d23f8528e2985e5547f' +
        '72f98ccc61d96ecad173bdc29627abbf6d46908807f6dd0a0d767ae3887d040e').raw);
  });

  it('should verify signed message', function () {
    var secretKey = new SecretKey(
      '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030' +
      'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36');
    var record = AuthName.wrap({
      firstName: 'John',
      lastName: 'Doe'
    }).sign(secretKey);

    expect(record.signature.raw).to.equalArray(
      new Signature(
        '7ccad21d76359c8c3ed1161eb8231edd44a91d53ea468d23f8528e2985e5547f' +
        '72f98ccc61d96ecad173bdc29627abbf6d46908807f6dd0a0d767ae3887d040e').raw);
  });
});

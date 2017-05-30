'use strict';
/* eslint-env node, mocha */

const expect = require('chai')
  .use(require('../chai-bytes'))
  .expect;

const Bool = require('../../src/types/bool').Bool;

describe('Bool', function () {
  it('should declare correct byteLength', function () {
    expect(Bool.byteLength).to.equal(1);
  });

  it('should declare hasFixedLength', function () {
    expect(Bool.hasFixedLength).to.be.true;
  });

  it('should declare true contant', function () {
    expect(Bool.true.raw).to.be.true;
  });

  it('should declare false contant', function () {
    expect(Bool.false.raw).to.be.false;
  });

  describe('constructor', function () {
    it('should accept JS boolean', function () {
      var x = new Bool(true);
      expect(x.raw).to.be.true;
      x = new Bool(false);
      expect(x.raw).to.be.false;
    });

    it('should accept another Bool', function () {
      var x = new Bool(Bool.true);
      expect(x.raw).to.be.true;
      x = new Bool(Bool.false);
      expect(x.raw).to.be.false;
    });
  });

  describe('serialize', function () {
    it('should serialize false as [0]', function () {
      expect(Bool.false.serialize()).to.equalBytes('00');
    });

    it('should serialize true as [1]', function () {
      expect(Bool.true.serialize()).to.equalBytes('01');
    });
  });

  describe('toJSON', function () {
    it('should return raw value', function () {
      expect(Bool.true.toJSON()).to.be.true;
      expect(Bool.false.toJSON()).to.be.false;
    });
  });
});

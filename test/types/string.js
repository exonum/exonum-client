'use strict';
/* eslint-env node, mocha */

const expect = require('chai').expect;

const Str = require('../../src/types/string').Str;

describe('str', function () {
  it('should declare variable length', function () {
    expect(Str.hasFixedLength).to.be.false;
  });

  describe('constructor', function () {
    it('should accept string', function () {
      var s = new Str('abcdef');
      expect(s.raw).to.be.equal('abcdef');
    });

    it('should accept non-ASCII string', function () {
      var s = new Str('абцдеф');
      expect(s.raw).to.be.equal('абцдеф');
    });

    it('should accept another Str', function () {
      var s = new Str('abc');
      expect(new Str(s).raw).to.be.equal('abc');
    });
  });

  describe('byteLength', function () {
    it('should calculate length correctly for ASCII strings', function () {
      var s = new Str('a12!@#');
      expect(s.byteLength).to.equal(6);
    });

    it('should calculate length correctly for 2-byte UTF-8 strings', function () {
      var s = new Str('абцдеф');
      expect(s.byteLength).to.equal(12);
    });

    it('should calculate length correctly for 3-byte UTF-8 strings', function () {
      var s = new Str('愛');
      expect(s.byteLength).to.equal(3);
    });

    it('should calculate length correctly for 4-byte UTF-8 strings', function () {
      var s = new Str('😆');
      expect(s.byteLength).to.equal(4);
    });

    it('should calculate length correctly for mixed-length UTF-8 strings', function () {
      var s = new Str('悔しい😆 !!');
      expect(s.byteLength).to.equal(9 + 4 + 3);
    });
  });

  describe('serialize', function () {
    it('should serialize ASCII strings', function () {
      var s = new Str('ABC');
      expect(s.serialize()).to.deep.equal(new Uint8Array([65, 66, 67]));
    });

    it('should serialize non-ASCII strings', function () {
      var s = new Str('👌хД');
      expect(s.serialize()).to.deep.equal(new Uint8Array([0xf0, 0x9f, 0x91, 0x8c, 0xd1, 0x85, 0xd0, 0x94]));
    });
  });

  describe('toJSON', function () {
    it('should return an original string', function () {
      var s = new Str('abc');
      expect(s.toJSON()).to.equal('abc');
    });
  });
});

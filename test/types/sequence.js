'use strict';
/* eslint-env node, mocha */

const expect = require('chai')
  .use(require('../chai-bytes'))
  .expect;
const bigInt = require('big-integer');

const types = require('../../src/types/index');
const sequence = types.sequence;

function expectInt (obj, expected) {
  expect(types.isInteger(obj)).to.be.true;
  expect(obj.toString()).to.equal(expected.toString());
}

describe('sequence', function () {
  var Type = sequence([
    { name: 'foo', type: types.Uint32 },
    { name: 'bar', type: types.Int64 }
  ]);

  var VarType = sequence([
    { name: 'str', type: types.Str },
    { name: 'foo', type: types.Uint8 }
  ]);

  var ComplexType = sequence([
    { name: 'a', type: types.Int16 },
    { name: 'b', type: VarType },
    { name: 'c', type: types.Str }
  ]);

  var Wallet = sequence([
    { name: 'pubkey', type: types.Pubkey },
    { name: 'name', type: types.Str },
    { name: 'balance', type: types.Uint64 },
    { name: 'history_hash', type: types.Hash }
  ]);

  describe('constructor', function () {
    it('should parse spec', function () {
      expect(Type).to.be.a('function');
      // FIXME verify schema
    });

    it('should calculate hasFixedLength', function () {
      expect(Type.hasFixedLength).to.be.true;
      expect(VarType.hasFixedLength).to.be.false;
    });

    it('should calculate byteLength', function () {
      expect(Type.byteLength).to.equal(12);
      expect(VarType.byteLength).to.be.undefined;
    });

    it('should instantiate from arguments', function () {
      var x = new Type(12, -344666);
      expect(x).to.have.property('foo');
      expect(x).to.have.property('bar');
      expectInt(x.foo, 12);
      expectInt(x.bar, -344666);
    });

    it('should instantiate from an object', function () {
      var x = new Type({
        foo: 12,
        bar: -344666
      });
      expect(x).to.have.property('foo');
      expect(x).to.have.property('bar');
      expectInt(x.foo, 12);
      expectInt(x.bar, -344666);
    });

    it('should instantiate from an array', function () {
      var x = new Type([ 12, -30000 ]);
      expect(x).to.have.property('foo');
      expect(x).to.have.property('bar');
      expectInt(x.foo, 12);
      expectInt(x.bar, -30000);
    });

    it('should support sequence-typed properties', function () {
      var ComplexType = sequence([
        { name: 'complex', type: Type },
        { name: 'simple', type: types.Int64 }
      ]);

      var x = new ComplexType(
        new Type(1, -2),
        new types.Int64(25)
      );
      expect(x).to.have.property('complex');
      expect(x).to.have.property('simple');
      expect(x).to.have.deep.property('complex.foo');
      expect(x).to.have.deep.property('complex.bar');
      expectInt(x.complex.foo, 1);
      expectInt(x.complex.bar, -2);
      expectInt(x.simple, 25);
    });

    it('should support object assignment of sequence-typed properties', function () {
      var ComplexType = sequence([
        { name: 'complex', type: Type },
        { name: 'simple', type: types.Int64 }
      ]);

      var x = new ComplexType({
        complex: {
          foo: 1,
          bar: -2
        },
        simple: 25
      });
      expectInt(x.complex.foo, 1);
      expectInt(x.complex.bar, -2);
      expectInt(x.simple, 25);
    });

    it('should support partial assignement through arguments', function () {
      var x = new Type(11);
      expectInt(x.foo, 11);
      expect(x.bar).to.be.undefined;
    });

    it('should support partial assignement through object', function () {
      var x = new Type({ bar: 11 });
      expectInt(x.bar, 11);
      expect(x.foo).to.be.undefined;
    });

    it('should support partial assignement through array', function () {
      var x = new Type([ 11 ]);
      expectInt(x.foo, 11);
      expect(x.bar).to.be.undefined;
    });

    it('should parse wallet from JSON', function () {
      var json = {
        pubkey: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
        name: 'Smart wallet',
        balance: 359120,
        history_hash: '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030'
      };
      var wallet = new Wallet(json);

      expect(wallet.pubkey.raw).to.equalBytes('f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36');
      expect(wallet.name.toString()).to.equal('Smart wallet');
      expect(wallet.balance.valueOf()).to.equal(359120);
      expect(wallet.history_hash.raw).to.equalBytes('6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030');
      expect(wallet.toJSON()).to.deep.equal(json);
    });
  });

  describe('get', function () {
    it('should return values of defined properties', function () {
      var x = new Type(1, -2);
      expectInt(x.get('foo'), 1);
      expectInt(x.get('bar'), -2);
    });

    it('should return undefined for undefined properties', function () {
      var x = new Type(1, -2);
      expect(x.get('bazz')).to.be.undefined;
      expect(x.get('get')).to.be.undefined;
      expect(x.get('set')).to.be.undefined;
      expect(x.get('hasContsantLength')).to.be.undefined;
    });
  });

  describe('set', function () {
    it('should set defined properties', function () {
      var x = new Type(1, -2);
      x.set('foo', 5);
      expectInt(x.foo, 5);
      x.set('foo', '256765');
      expectInt(x.foo, 256765);
    });

    it('should throw for undefined properties', function () {
      var x = new Type(1, -2);
      expect(() => x.set('bazz', 5)).to.throw(Error, /property/i);
      expect(() => x.set('get', 5)).to.throw(Error, /property/i);
      expect(() => x.set('set', 5)).to.throw(Error, /property/i);
    });

    it('should support property writes with various coercible types', function () {
      var x = new Type(12, -344666);
      x.foo = 23;
      expectInt(x.foo, 23);
      x.foo = '42';
      expectInt(x.foo, 42);
      x.foo = bigInt('111');
      expectInt(x.foo, 111);
      x.foo = new types.Uint32(57566);
      expectInt(x.foo, 57566);
    });

    it('should support implicit conversions for compound operations on integer properties', function () {
      var x = new Type(12, -344666);
      x.foo += 13;
      expect(x.foo.valueOf()).to.equal(25);
      x.foo *= 4;
      expect(x.foo.valueOf()).to.equal(100);
      x.foo++;
      expect(x.foo.valueOf()).to.equal(101);
    });

    it('should throw for out-of-range assignments of integer properties', function () {
      var x = new Type(12, -344666);
      expect(() => { x.foo = 5000000000; }).to.throw();
      expect(() => { x.foo -= 13; }).to.throw();
      expect(() => { x.foo *= x.bar; }).to.throw();
    });
  });

  describe('byteLength', function () {
    it('should count segments in var-length types', function () {
      var x = new VarType('ABC', 55);
      expect(x.byteLength).to.equal(8 + 1 + 3);
    });

    it('should count all segments in embedded var-length types', function () {
      var x = new ComplexType({
        a: -10,
        b: {
          str: 'ABC',
          foo: 55
        },
        c: 'f00'
      });
      expect(x.byteLength).to.equal(2 + (8 + (8 + 1 + 3)) + (8 + 3));
    });
  });

  describe('serialize', function () {
    it('should serialize a fixed-length type', function () {
      var x = new Type(1, -2);
      expect(x.serialize()).to.equalBytes([1, 0, 0, 0, 254, 255, 255, 255, 255, 255, 255, 255]);
    });

    it('should serialize a var-length type', function () {
      var x = new VarType('ABC', 55);
      expect(x.serialize()).to.equalBytes([
        9, 0, 0, 0, // segment start
        3, 0, 0, 0,  // segment length
        55, // x.bar
        65, 66, 67 // x.foo
      ]);
    });

    it('should serialize a complex var-length type', function () {
      var x = new ComplexType({
        a: -10,
        b: {
          str: 'cabbage',
          foo: 16
        },
        c: 'f00'
      });
      expect(x.serialize()).to.equalBytes([
        // offset: contents
        /*  0: */ 0xf6, 0xff, // x.a
        /*  2: */ 18, 0, 0, 0, // segment for x.b
        /*  6: */ 16, 0, 0, 0,
        /* 10: */ 34, 0, 0, 0, // segment for x.c
        /* 14: */ 3, 0, 0, 0,
        // start x.b
        /* 18: */ 27, 0, 0, 0, // segment for x.b.str
        /* 22: */ 7, 0, 0, 0,
        /* 26: */ 16, // x.b.foo
        /* 27: */ 99, 97, 98, 98, 97, 103, 101, // x.b.str
        // end x.b
        /* 34: */ 102, 48, 48 // x.c
      ]);
    });

    it('should serialize a type with several var-length properties', function () {
      var Type = sequence([
        { name: 'foo', type: types.Str },
        { name: 'bar', type: types.Str }
      ]);

      var x = new Type('ABC', '----');
      expect(x.serialize()).to.equalBytes([
        16, 0, 0, 0,   // segment for x.foo
        3, 0, 0, 0,
        19, 0, 0, 0,   // segment for x.bar
        4, 0, 0, 0,
        65, 66, 67,    // x.foo
        45, 45, 45, 45 // x.bar
      ]);
    });

    it('should serialize wallet type', function () {
      var wallet = new Wallet({
        pubkey: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
        name: 'Smart wallet',
        balance: 359120,
        history_hash: '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030'
      });

      expect(wallet.serialize()).to.equalBytes([
        245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161,
        242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54,
        80, 0, 0, 0, 12, 0, 0, 0, 208, 122, 5, 0, 0, 0, 0, 0, 103, 82, 190, 136, 35,
        20, 245, 187, 188, 154, 106, 242, 174, 99, 79, 192, 112, 56, 88, 74, 74, 119,
        81, 14, 165, 236, 237, 69, 245, 77, 192, 48, 83, 109, 97, 114, 116, 32, 119,
        97, 108, 108, 101, 116
      ]);
    });

    it('should throw when there are uninitialized properties', function () {
      var x = new Type(1);
      expect(() => x.serialize()).to.throw();
    });
  });

  describe('toJSON', function () {
    it('should work for simple sequence type', function () {
      var obj = { foo: 5, bar: -1000 };
      var x = new Type(obj);
      expect(x.toJSON()).to.deep.equal(obj);
    });

    it('should work for hierarchical sequence type', function () {
      var obj = {
        a: -10,
        b: {
          str: 'cabbage',
          foo: 16
        },
        c: 'f00'
      };
      var x = new ComplexType(obj);
      expect(x.toJSON()).to.deep.equal(obj);
    });

    it('should return uninitialized properties as undefined', function () {
      var x = new ComplexType({
        a: 10,
        b: { str: 'foo' }
      });
      expect(x.toJSON()).to.deep.equal({
        a: 10,
        b: { str: 'foo', foo: undefined },
        c: undefined
      });
    });
  });
});

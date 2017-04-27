'use strict';
/* eslint-env node, mocha */

const expect = require('chai').expect;
const bigInt = require('big-integer');

const Sequence = require('../../src/types/sequence').Sequence;
const integers = require('../../src/types/integers');
const Str = require('../../src/types/string').Str;

function expectInt (obj, expected) {
  expect(integers.isInteger(obj)).to.be.true;
  expect(obj.toString()).to.equal(expected.toString());
}

describe('Sequence', function () {
  var Type = Sequence([
    { name: 'foo', type: integers.Uint32 },
    { name: 'bar', type: integers.Int64 }
  ]);

  var VarType = Sequence([
    { name: 'str', type: Str },
    { name: 'foo', type: integers.Uint8 }
  ]);

  var ComplexType = Sequence([
    { name: 'a', type: integers.Int16 },
    { name: 'b', type: VarType },
    { name: 'c', type: Str }
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

    it('should support field writes with various coercible types', function () {
      var x = new Type(12, -344666);
      x.foo = 23;
      expectInt(x.foo, 23);
      x.foo = '42';
      expectInt(x.foo, 42);
      x.foo = bigInt('111');
      expectInt(x.foo, 111);
      x.foo = new integers.Uint32(57566);
      expectInt(x.foo, 57566);
    });

    it('should support sequence-typed properties', function () {
      var ComplexType = Sequence([
        { name: 'complex', type: Type },
        { name: 'simple', type: integers.Int64 }
      ]);

      var x = new ComplexType(
        new Type(1, -2),
        new integers.Int64(25)
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
      var ComplexType = Sequence([
        { name: 'complex', type: Type },
        { name: 'simple', type: integers.Int64 }
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
      expect(x.serialize()).to.deep.equal(new Uint8Array([1, 0, 0, 0, 254, 255, 255, 255, 255, 255, 255, 255]));
    });

    it('should serialize a var-length type', function () {
      var x = new VarType('ABC', 55);
      expect(x.serialize()).to.deep.equal(new Uint8Array([
        9, 0, 0, 0, // segment start
        3, 0, 0, 0,  // segment length
        55, // x.bar
        65, 66, 67 // x.foo
      ]));
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
      expect(x.serialize()).to.deep.equal(new Uint8Array([
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
      ]));
    });

    it('should serialize a type with several var-length fields', function () {
      var Type = Sequence([
        { name: 'foo', type: Str },
        { name: 'bar', type: Str }
      ]);

      var x = new Type('ABC', '----');
      expect(x.serialize()).to.deep.equal(new Uint8Array([
        16, 0, 0, 0,   // segment for x.foo
        3, 0, 0, 0,
        19, 0, 0, 0,   // segment for x.bar
        4, 0, 0, 0,
        65, 66, 67,    // x.foo
        45, 45, 45, 45 // x.bar
      ]));
    });
  });
});

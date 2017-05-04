/* eslint-env node, mocha */

const expect = require('chai')
  .use(require('../chai-bytes'))
  .expect;
const bigInt = require('big-integer');

const integers = require('../../src/types/integers');

const typeDefs = {
  Uint8: {
    byteLength: 1,
    signed: false,
    range: [ 0, 255 ],
    valuesInRange: [ 7, 23, 42, 114 ]
  },

  Int8: {
    byteLength: 1,
    signed: true,
    range: [ -128, 127 ],
    valuesInRange: [ 23, -42, -109 ]
  },

  Uint16: {
    byteLength: 2,
    signed: false,
    range: [ 0, 65535 ],
    valuesInRange: [ 7, 2323, 42000 ],
    serializations: [
      { from: 4660, expect: new Uint8Array([0x34, 0x12]) }
    ]
  },

  Int16: {
    byteLength: 2,
    signed: true,
    range: [ -32768, 32767 ],
    valuesInRange: [ -7, 2323, -32140 ],
    serializations: [
      { from: -28671, expect: new Uint8Array([0x01, 0x90]) }
    ]
  },

  Uint32: {
    byteLength: 4,
    signed: false,
    range: [ 0, 4294967295 ],
    valuesInRange: [ 77, 11111, 3000000000 ],
    serializations: [
      { from: 3735928559, expect: new Uint8Array([0xef, 0xbe, 0xad, 0xde]) }
    ]
  },

  Int32: {
    byteLength: 4,
    signed: true,
    range: [ -2147483648, 2147483647 ],
    valuesInRange: [ -2000000000, 111111, 1999999999 ],
    serializations: [
      { from: -1056969216, expect: new Uint8Array([0x00, 0xee, 0xff, 0xc0]) }
    ]
  },

  Uint64: {
    byteLength: 8,
    signed: false,
    range: [ 0, bigInt('18446744073709551615') ],
    valuesInRange: [ 11111, 3000000000, bigInt('1234567890987654321') ],
    serializations: [
      // 1234567890987654321 === 0x112210f4b16c1cb1
      { from: bigInt('1234567890987654321'), expect: new Uint8Array([0xb1, 0x1c, 0x6c, 0xb1, 0xf4, 0x10, 0x22, 0x11]) }
    ]
  },

  Int64: {
    byteLength: 8,
    signed: true,
    range: [ bigInt('-9223372036854775808'), bigInt('9223372036854775807') ],
    valuesInRange: [ 2000000000, bigInt('-1234567890987654321') ],
    serializations: [
    ]
  }
};

const baseEncodings = {
  dec: 10,
  hex: 16,
  oct: 8,
  bin: 2
};

(function () {
  'use strict'; // Needed to enable `let`s (which are needed to generate tests dynamically)

  for (var typeName in typeDefs) {
    let def = typeDefs[typeName];

    describe(typeName, function () {
      let Type = integers[typeName];

      it('should declare fixed length', function () {
        expect(Type.hasFixedLength).to.be.true;
      });

      it('should declare correct length', function () {
        expect(Type.byteLength).to.equal(def.byteLength);
      });

      it('should declare correct minValue', function () {
        expect(Type.minValue).to.deep.equal(def.range[0]);
      });

      it('should declare correct maxValue', function () {
        expect(Type.maxValue).to.deep.equal(def.range[1]);
      });

      describe('constructor', function () {
        let allowedValues = [ ];
        allowedValues.push(def.range[0]); // minValue
        allowedValues.push(bigInt.isInstance(def.range[0])
          ? def.range[0].plus(1)
          : def.range[0] + 1);

        allowedValues.push(def.range[1]); // maxValue
        allowedValues.push(bigInt.isInstance(def.range[1])
          ? def.range[1].minus(1)
          : def.range[1] - 1);

        if (def.signed) {
          allowedValues.push(0, 1, -1);
        }
        Array.prototype.push.apply(allowedValues, def.valuesInRange);

        allowedValues.forEach(value => {
          it('should constuct from a Number ' + value, function () {
            var wrapped = new Type(value);
            expect(wrapped).to.have.property('raw');
            expect(wrapped.raw.toString()).to.equal(value.toString());
          });

          let str = value.toString();
          it('should construct from a String ' + value, function () {
            var wrapped = new Type(str);
            expect(wrapped).to.have.property('raw');
            expect(wrapped.raw.toString()).to.equal(value.toString());
          });

          for (let enc in baseEncodings) {
            let str = value.toString(baseEncodings[enc]);
            it('should construct from a ' + enc + ' string ' + str, function () {
              var wrapped = new Type(str, enc);
              expect(wrapped).to.have.property('raw');
              expect(wrapped.raw.toString()).to.equal(value.toString());
            });

            it('should construct from an object {' + str + ', ' + enc + '}', function () {
              var wrapped = new Type({ [enc]: str });
              expect(wrapped.raw.toString()).to.equal(value.toString());
            });
          }
        });

        it('should construct from bigInt', function () {
          var x = bigInt(10);
          expect(new Type(x).raw).to.deep.equal(x);
        });

        it('should construct from another type instance', function () {
          var x = new Type(10);
          expect(new Type(x).raw).to.deep.equal(x.raw);
        });

        let disallowedValues = [
          bigInt.isInstance(def.range[0])
            ? def.range[0].minus(1)
            : def.range[0] - 1,
          bigInt.isInstance(def.range[1])
            ? def.range[1].plus(1)
            : def.range[1] + 1
        ];

        disallowedValues.forEach(value => {
          it('should not accept an out-of-range Number ' + value.toString(), function () {
            expect(() => new Type(value)).to.throw(Error, /range/i);
          });

          let str = value.toString();
          it('should not construct from an out-of-range String ' + str, function () {
            expect(() => new Type(str)).to.throw(Error, /range/i);
          });

          for (let enc in baseEncodings) {
            let str = value.toString(baseEncodings[enc]);
            it('should not construct from an out-of-range ' + enc + ' string ' + str, function () {
              expect(() => new Type(str, enc)).to.throw(Error, /range/i);
            });
          }
        });

        it('should fail with a faulty string', function () {
          expect(() => new Type('__Faulty__')).to.throw(Error);
        });

        it('should fail with a faulty dec string', function () {
          expect(() => new Type('DE', 'dec')).to.throw(Error);
        });

        it('should fail with a faulty hex string', function () {
          expect(() => new Type('XX', 'hex')).to.throw(Error);
        });

        it('should fail with a faulty oct string', function () {
          expect(() => new Type('88', 'oct')).to.throw(Error);
        });

        it('should fail with a faulty bin string', function () {
          expect(() => new Type('2', 'bin')).to.throw(Error);
        });

        [
          [],
          {},
          { hax: '0' },
          { hex: 1 },
          null,
          false,
          function () {}
        ].forEach(value => {
          it('should fail with invalid type value ' + value, function () {
            expect(() => new Type(value)).to.throw(TypeError);
          });
        });
      });

      describe('serialize', function () {
        it('should serialize as Uint8Array', function () {
          var s = new Type().serialize();
          expect(s).to.be.a('uint8array');
        });

        // Generic expected serializations for datatypes
        let serializations = [
          {
            from: 0,
            expect: new Uint8Array(def.byteLength)
          },
          {
            from: 1,
            expect: (() => {
              var b = new Uint8Array(def.byteLength);
              b[0] = 1;
              return b;
            })()
          }
        ];

        if (def.signed) {
          // Signed type

          // -1 should serialize as all 1 bits
          serializations.push({
            from: -1,
            expect: (() => {
              var b = new Uint8Array(def.byteLength);
              b.fill(255);
              return b;
            })()
          });

          // minValue should serialize as [0, 0, ..., 128]
          serializations.push({
            from: def.range[0],
            expect: (() => {
              var b = new Uint8Array(def.byteLength);
              b[b.length - 1] = 128;
              return b;
            })()
          });

          // maxValue should serialize as [255, 255, ..., 127]
          serializations.push({
            from: def.range[1],
            expect: (() => {
              var b = new Uint8Array(def.byteLength);
              b.fill(255);
              b[b.length - 1] = 127;
              return b;
            })()
          });
        } else {
          // Unsigned type

          // maxValue should serialize as [255, ..., 255]
          serializations.push({
            from: def.range[1],
            expect: (() => {
              var b = new Uint8Array(def.byteLength);
              b.fill(255);
              return b;
            })()
          });
        }

        if (def.serializations) {
          Array.prototype.push.apply(serializations, def.serializations);
        }

        serializations.forEach(s => {
          it('should serialize ' + s.from.toString() + ' as [' + s.expect.join(', ') + ']', function () {
            var x = new Type(s.from);
            expect(x.serialize()).to.equalBytes(s.expect);
          });
        });
      });
    });
  }
})();

describe('Integer', function () {
  describe('valueOf', function () {
    it('should proxy integer value for comparisons', function () {
      var x = new integers.Int64(100);
      expect(x > 99).to.be.true;
      expect(x <= 101).to.be.true;
    });

    it('should proxy integer value for arithmetic operations', function () {
      var x = new integers.Int64(100);
      expect(x - 100).to.equal(0);
      expect(x * 2).to.equal(200);
    });

    it('should proxy integer value for functions that expect integer', function () {
      var x = new integers.Uint32(1);
      expect('abc'.substring(x)).to.equal('bc');
    });
  });

  describe('toJSON', function () {
    var safeInts = [
      1, -1, 1234567, -1234567, 9007199254740991, -9007199254740991,
      '777', '-9876543210',
      bigInt(8888888), bigInt(-9000000000)
    ];
    safeInts.forEach(num => {
      it('should return a JS number for ' + num, function () {
        var x = new integers.Int64(num);
        expect(x.toJSON()).to.equal(parseInt(num.toString()));
      });
    });

    var unsafeInts = [
      '9007199254740992',
      '-9007199254740992',
      bigInt(1).shiftLeft(60),
      bigInt(1).shiftLeft(62).multiply(-1)
    ];
    unsafeInts.forEach(num => {
      it('should return a string for ' + num.toString(), function () {
        var x = new integers.Int64(num);
        expect(x.toJSON()).to.equal(num.toString());
      });
    });
  });
});

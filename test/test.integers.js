/* eslint-env node, mocha */

const expect = require('chai').expect;

const integers = require('../src/types/integers');

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

      it('should declare correct length', function () {
        expect(Type.BYTE_LENGTH).to.equal(def.byteLength);
      });

      it('should declare correct MIN_VALUE', function () {
        expect(Type.MIN_VALUE).to.equal(def.range[0]);
      });

      it('should declare correct MAX_VALUE', function () {
        expect(Type.MAX_VALUE).to.equal(def.range[1]);
      });

      describe('constructor', function () {
        let allowedValues = [ 0, 1, 2 ];
        allowedValues.push(def.range[0]); // MIN_VALUE
        allowedValues.push(def.range[0] + 1);
        allowedValues.push(def.range[1]); // MAX_VALUE
        allowedValues.push(def.range[1] - 1);
        if (def.signed) {
          allowedValues.push(-1, -2);
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
          }
        });

        it('should construct from bigInt', function () {
          var x = bigInt(10);
          expect(new Type(x).raw).to.deep.equal(x);
        });

        it('should construct from another type instance', function () {
          var x = new Type(10);
          expect(new Type(x)).to.deep.equal(x);
        });

        let disallowedValues = [
          def.range[0] - 1,
          def.range[0] - 2,
          def.range[1] + 1,
          def.range[1] + 2
        ];

        disallowedValues.forEach(value => {
          it('should not accept an out-of-range Number ' + value, function () {
            expect(() => new Type(value)).to.throw(Error, /range/i);
          });

          let str = value.toString();
          it('should not construct from an out-of-range String ' + value, function () {
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

        let invalidTypeValues = [
          [],
          {},
          null,
          false,
          function () {}
        ];

        invalidTypeValues.forEach(value => {
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

          // MIN_VALUE should serialize as [0, 0, ..., 128]
          serializations.push({
            from: def.range[0],
            expect: (() => {
              var b = new Uint8Array(def.byteLength);
              b[b.length - 1] = 128;
              return b;
            })()
          });

          // MAX_VALUE should serialize as [255, 255, ..., 127]
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

          // MAX_VALUE should serialize as [255, ..., 255]
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
          it('should serialize ' + s.from + ' as [' + s.expect.join(', ') + ']', function () {
            var x = new Type(s.from);
            expect(x.serialize()).to.deep.equal(s.expect);
          });
        });
      });
    });
  }
})();

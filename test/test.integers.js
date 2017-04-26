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
      });
    });
  }
})();

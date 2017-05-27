var expect = require('chai').expect;
var Exonum = require('../src/index');

describe('Convert data from one type to another', function() {

    describe('Check Exonum.hexadecimalToUint8Array', function() {
        it('should convert valid hexadecimal into Uint8Array', function() {
            var data = require('./data/convertors/hexadecimalToUint8Array.json');
            expect(Exonum.hexadecimalToUint8Array(data.from)).to.deep.equal(new Uint8Array(data.to));
        });

        it('should return undefined when convert invalid hexadecimal into Uint8Array', function() {
            [null, false, 42, new Date(), {}, [], '0438082601f8b38ae010a621a48f4b4cd021c4e6e69219e3c2d8abab482039ez'].forEach(function(value) {
                expect(Exonum.hexadecimalToUint8Array(value)).to.be.undefined;
            });
        });
    });

    describe('Check Exonum.stringToUint8Array', function() {
        it('should convert valid string into Uint8Array', function() {
            var data = require('./data/convertors/stringToUint8Array.json');
            expect(Exonum.stringToUint8Array(data.from)).to.deep.equal(new Uint8Array(data.to));
        });

        it('should return undefined when convert invalid string into Uint8Array', function() {
            [null, false, 42, new Date(), {}, []].forEach(function(value) {
                expect(Exonum.stringToUint8Array(value)).to.be.undefined;
            });
        });
    });

    describe('Check Exonum.binaryStringToUint8Array', function() {
        it('should convert valid binaryString into Uint8Array', function() {
            var data = require('./data/convertors/binaryStringToUint8Array.json');
            expect(Exonum.binaryStringToUint8Array(data.from)).to.deep.equal(new Uint8Array(data.to));
        });

        it('should return undefined when convert invalid binaryString into Uint8Array', function() {
            [null, false, 42, new Date(), {}, [], '102'].forEach(function(value) {
                expect(Exonum.binaryStringToUint8Array(value)).to.be.undefined;
            });
        });
    });

    describe('Check Exonum.uint8ArrayToHexadecimal', function() {
        it('should convert valid Uint8Array into hexadecimal', function() {
            var data = require('./data/convertors/uint8ArrayToHexadecimal.json');
            expect(Exonum.uint8ArrayToHexadecimal(new Uint8Array(data.from))).to.equal(data.to);
        });

        it('should return undefined when convert invalid Uint8Array into hexadecimal', function() {
            [null, false, 42, new Date(), {}, 'Hello world', [4,56]].forEach(function(value) {
                expect(Exonum.uint8ArrayToHexadecimal(value)).to.be.undefined;
            });
        });
    });

    describe('Check Exonum.binaryStringToHexadecimal', function() {
        it('should convert valid binaryString into hexadecimal', function() {
            var data = require('./data/convertors/binaryStringToHexadecimal.json');
            expect(Exonum.binaryStringToHexadecimal(data.from)).to.deep.equal(data.to);
        });

        it('should return undefined when convert invalid binaryString into hexadecimal', function() {
            [null, false, 42, new Date(), {}, [], '102'].forEach(function(value) {
                expect(Exonum.binaryStringToHexadecimal(value)).to.be.undefined;
            });
        });
    });

    describe('Check Exonum.hexadecimalToBinaryString', function() {
        it('should convert valid hexadecimal into BinaryString', function() {
            var data = require('./data/convertors/hexadecimalToBinaryString.json');
            expect(Exonum.hexadecimalToBinaryString(data.from)).to.equal(data.to);
        });

        it('should return undefined when convert invalid hexadecimal into BinaryString', function() {
            [null, false, 42, new Date(), {}, [], 'az'].forEach(function(value) {
                expect(Exonum.hexadecimalToBinaryString(value)).to.be.undefined;
            });
        });
    });

});

/* eslint-env node, mocha */

var expect = require('chai').expect;
var Exonum = require('..');

describe('Check built-in types', function() {

    describe('Process Hash', function() {

        it('should serialize data and return array of 8-bit integers when the value is valid hexadecimal string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 32}}
            });
            var data = {hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54]);
        });

        it('should throw error when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 16}}
            });
            var data = {hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'};

            expect(() => Type.serialize(data)).to.throw(Error);
        });

        it('should throw error when the value is invalid string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 32}}
            });
            var data = {hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3z'};

            expect(() => Type.serialize(data)).to.throw(Error);
        });

        it('should throw error when the value is too long string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 32}}
            });
            var data = {hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365'};

            expect(() => Type.serialize(data)).to.throw(Error);
        });

        it('should throw error when the value is too short string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 32}}
            });
            var data = {hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3'};

            expect(() => Type.serialize(data)).to.throw(Error);
        });

        it('should throw error when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 32}}
            });

            [true, null, undefined, 57, [], {}, new Date()].forEach(function(hash) {
                expect(() => Type.serialize({hash: hash})).to.throw(TypeError);
            });
        });

    });

    describe('Process PublicKey', function() {

        it('should serialize data and return array of 8-bit integers when the value is valid string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54]);
        });

        it('should throw error when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {key: {type: Exonum.PublicKey, size: 32, from: 0, to: 16}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'};

            expect(() => Type.serialize(data)).to.throw(Error);
        });

        it('should throw error when the value is invalid string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3z'};

            expect(() => Type.serialize(data)).to.throw(Error);
        });

        it('should throw error when the value is too long string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365'};

            expect(() => Type.serialize(data)).to.throw(Error);
        });

        it('should throw error when the value is too short string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3'};

            expect(() => Type.serialize(data)).to.throw(Error);
        });

        it('should throw error when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32}}
            });

            [true, null, undefined, 57, [], {}, new Date()].forEach(function(key) {
                expect(() => Type.serialize({key: key})).to.throw(TypeError);
            });
        });

    });

    describe('Process Digest', function() {

        it('should serialize data and return array of 8-bit integers when the value is valid string', function() {
            var Type = Exonum.newType({
                size: 64,
                fields: {key: {type: Exonum.Digest, size: 64, from: 0, to: 64}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54, 245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54]);
        });

        it('should throw error when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 64,
                fields: {key: {type: Exonum.Digest, size: 64, from: 0, to: 32}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'};

            expect(() => Type.serialize(data)).to.throw(Error);
        });

        it('should throw error when the value is invalid string', function() {
            var Type = Exonum.newType({
                size: 64,
                fields: {key: {type: Exonum.Digest, size: 64, from: 0, to: 64}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3zf5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3z'};

            expect(() => Type.serialize(data)).to.throw(Error);
        });

        it('should throw error when the value is too long string', function() {
            var Type = Exonum.newType({
                size: 64,
                fields: {key: {type: Exonum.Digest, size: 64, from: 0, to: 64}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365'};

            expect(() => Type.serialize(data)).to.throw(Error);
        });

        it('should throw error when the value is too short string', function() {
            var Type = Exonum.newType({
                size: 64,
                fields: {key: {type: Exonum.Digest, size: 64, from: 0, to: 64}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3'};

            expect(() => Type.serialize(data)).to.throw(Error);
        });

        it('should throw error when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 64,
                fields: {key: {type: Exonum.Digest, size: 64, from: 0, to: 64}}
            });

            [true, null, undefined, 57, [], {}, new Date()].forEach(function(key) {
                expect(() => Type.serialize({key: key})).to.throw(TypeError);
            });
        });

    });

    describe('Process Timespec', function() {

        it('should serialize data and return array of 8-bit integers when the value is valid timestamp in nanoseconds passed as positive number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {since: {type: Exonum.Timespec, size: 8, from: 0, to: 8}}
            });
            var data = {since: 1483979894237};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([221, 45, 24, 132, 89, 1, 0, 0]);
        });

        it('should serialize data and return array of 8-bit integers when the value is valid timestamp in nanoseconds passed as string', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {since: {type: Exonum.Timespec, size: 8, from: 0, to: 8}}
            });
            var data = {since: '18446744073709551615'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([255, 255, 255, 255, 255, 255, 255, 255]);
        });

        it('should throw error when the value is negative number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {since: {type: Exonum.Timespec, size: 8, from: 0, to: 8}}
            });

            expect(() => Type.serialize({since: -1483979894237})).to.throw(RangeError);
        });

        it('should throw error when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {since: {type: Exonum.Timespec, size: 8, from: 0, to: 4}}
            });

            expect(() => Type.serialize({since: 1483979894237})).to.throw(Error);
        });

        it('should throw error when the value is out of range', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {since: {type: Exonum.Timespec, size: 8, from: 0, to: 8}}
            });

            expect(() => Type.serialize({since: '18446744073709551616'})).to.throw(RangeError);
        });

        it('should throw error when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {since: {type: Exonum.Timespec, size: 8, from: 0, to: 8}}
            });

            [true, null, undefined, [], {}, new Date()].forEach(function(since) {
                expect(() => Type.serialize({since: since})).to.throw(TypeError);
            });
        });

    });

    describe('Process Bool', function() {

        it('should serialize data and return array of 8-bit integers when the value is valid positive boolean', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {active: {type: Exonum.Bool, size: 1, from: 0, to: 1}}
            });
            var data = {active: true};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([1]);
        });

        it('should serialize data and return array of 8-bit integers when the value is valid negative boolean', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {active: {type: Exonum.Bool, size: 1, from: 0, to: 1}}
            });
            var data = {active: false};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0]);
        });

        it('should throw error when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {active: {type: Exonum.Bool, size: 1, from: 0, to: 0}}
            });
            expect(() => Type.serialize({active: true})).to.throw(Error);
        });

        it('should throw error when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {active: {type: Exonum.Bool, size: 1, from: 0, to: 1}}
            });

            ['Hello world', null, undefined, 57, [], {}, new Date()].forEach(function(active) {
                expect(() => Type.serialize({active: active})).to.throw(TypeError);
            });
        });

    });

    describe('Process String', function() {

        it('should serialize data and return array of 8-bit integers when the value is valid string', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {text: {type: Exonum.String, size: 8, from: 0, to: 8}}
            });
            var data = {text: 'Hello world'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([8, 0, 0, 0, 11, 0, 0, 0, 72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]);
        });

        it('should throw error when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {text: {type: Exonum.String, size: 8, from: 0, to: 4}}
            });

            expect(() => Type.serialize({text: 'Hello world'})).to.throw(Error);
        });

        it('should throw error when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {text: {type: Exonum.String, size: 8, from: 0, to: 8}}
            });

            [true, null, undefined, 57, [], {}, new Date()].forEach(function(text) {
                expect(() => Type.serialize({text: text})).to.throw(TypeError);
            });
        });

    });

    describe('Process Int8', function() {

        it('should serialize data and return array of 8-bit integers when the value is valid positive number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Int8, size: 1, from: 0, to: 1}}
            });
            var data = {balance: 120};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([120]);
        });

        it('should serialize data and return array of 8-bit integers when the value is valid negative number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Int8, size: 1, from: 0, to: 1}}
            });
            var data = {balance: -120};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([136]);
        });

        it('should throw error when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Int8, size: 1, from: 0, to: 0}}
            });
            expect(() => Type.serialize({balance: 120})).to.throw(Error);
        });

        it('should throw error when the value is too big positive number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Int8, size: 1, from: 0, to: 1}}
            });
            expect(() => Type.serialize({balance: 130})).to.throw(RangeError);
        });

        it('should throw error when the value is too big negative number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Int8, size: 1, from: 0, to: 1}}
            });
            expect(() => Type.serialize({balance: -130})).to.throw(RangeError);
        });

        it('should throw error when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Int8, size: 1, from: 0, to: 1}}
            });

            [true, null, undefined, [], {}, new Date()].forEach(function(balance) {
                expect(() => Type.serialize({balance: balance})).to.throw(TypeError);
            });
        });

    });

    describe('Process Int16', function() {

        it('should serialize data and return array of 8-bit integers when the value is valid positive number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Int16, size: 2, from: 0, to: 2}}
            });
            var data = {balance: 30767};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([47, 120]);
        });

        it('should serialize data and return array of 8-bit integers when the value is valid negative number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Int16, size: 2, from: 0, to: 2}}
            });
            var data = {balance: -30767};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([209, 135]);
        });

        it('should throw error when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Int16, size: 2, from: 0, to: 1}}
            });

            expect(() => Type.serialize({balance: 30767})).to.throw(Error);
        });

        it('should throw error when the value is too big positive number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Int16, size: 2, from: 0, to: 2}}
            });

            expect(() => Type.serialize({balance: 32769})).to.throw(RangeError);
        });

        it('should throw error when the value is too big negative number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Int16, size: 2, from: 0, to: 2}}
            });

            expect(() => Type.serialize({balance: -32770})).to.throw(RangeError);
        });

        it('should throw error when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Int16, size: 2, from: 0, to: 2}}
            });

            [true, null, undefined, [], {}, new Date()].forEach(function(balance) {
                expect(() => Type.serialize({balance: balance})).to.throw(TypeError);
            });
        });

    });

    describe('Process Int32', function() {

        it('should serialize data and return array of 8-bit integers when the value is valid positive number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Int32, size: 4, from: 0, to: 4}}
            });
            var data = {balance: 1147483647};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([255, 53, 101, 68]);
        });

        it('should serialize data and return array of 8-bit integers when the value is valid negative number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Int32, size: 4, from: 0, to: 4}}
            });
            var data = {balance: -1147483648};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 202, 154, 187]);
        });

        it('should throw error when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Int32, size: 4, from: 0, to: 3}}
            });

            expect(() => Type.serialize({balance: 613228})).to.throw(Error);
        });

        it('should throw error when the value is too big positive number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Int32, size: 4, from: 0, to: 4}}
            });

            expect(() => Type.serialize({balance: 2147483649})).to.throw(RangeError);
        });

        it('should throw error when the value is too big negative number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Int32, size: 4, from: 0, to: 4}}
            });

            expect(() => Type.serialize({balance: -2147483650})).to.throw(RangeError);
        });

        it('should throw error when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Int32, size: 4, from: 0, to: 4}}
            });

            [true, null, undefined, [], {}, new Date()].forEach(function(balance) {
                expect(() => Type.serialize({balance: balance})).to.throw(TypeError);
            });
        });

    });

    describe('Process Int64', function() {

        it('should serialize data and return array of 8-bit integers when the value is valid positive number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: 900719925474000};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([208, 50, 51, 51, 51, 51, 3, 0]);
        });

        it('should serialize data and return array of 8-bit integers when the value is valid positive number as string', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: '9223372036854775807'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([255, 255, 255, 255, 255, 255, 255, 127]);
        });

        it('should serialize data and return array of 8-bit integers when the value is valid negative number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: -90071992547};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([29, 119, 74, 7, 235, 255, 255, 255]);
        });

        it('should serialize data and return array of 8-bit integers when the value is valid negative number as string', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: '-9223372036854775808'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 128]);
        });

        it('should throw error when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 4}}
            });

            expect(() => Type.serialize({balance: 613228})).to.throw(Error);
        });

        it('should throw error when the value is too big positive number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 8}}
            });

            expect(() => Type.serialize({balance: '9223372036854775808'})).to.throw(RangeError);
        });

        it('should throw error when the value is too big negative number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 8}}
            });

            expect(() => Type.serialize({balance: '-9223372036854775809'})).to.throw(RangeError);
        });

        it('should throw error when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 8}}
            });

            [true, null, undefined, [], {}, new Date()].forEach(function(balance) {
                expect(() => Type.serialize({balance: balance})).to.throw(TypeError);
            });
        });

    });

    describe('Process Uint8', function() {

        it('should serialize data and return array of 8-bit integers when the value is valid positive number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Uint8, size: 1, from: 0, to: 1}}
            });
            var data = {balance: 230};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([230]);
        });

        it('should throw error when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Uint8, size: 1, from: 0, to: 0}}
            });

            expect(() => Type.serialize({balance: 230})).to.throw(Error);
        });

        it('should throw error when the value is negative number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Uint8, size: 1, from: 0, to: 1}}
            });

            expect(() => Type.serialize({balance: -1})).to.throw(RangeError);
        });

        it('should throw error when the value is out of range', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Uint8, size: 1, from: 0, to: 1}}
            });

            expect(() => Type.serialize({balance: 256})).to.throw(RangeError);
        });

        it('should throw error when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Uint8, size: 1, from: 0, to: 1}}
            });

            [true, null, undefined, [], {}, new Date()].forEach(function(balance) {
                expect(() => Type.serialize({balance: balance})).to.throw(TypeError);
            });
        });

    });

    describe('Process Uint16', function() {

        it('should serialize data and return array of 8-bit integers when the value is valid positive number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Uint16, size: 2, from: 0, to: 2}}
            });
            var data = {balance: 60535};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([119, 236]);
        });

        it('should throw error when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Uint16, size: 2, from: 0, to: 1}}
            });

            expect(() => Type.serialize({balance: 60535})).to.throw(Error);
        });

        it('should throw error when the value is negative number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Uint16, size: 2, from: 0, to: 2}}
            });

            expect(() => Type.serialize({balance: -1})).to.throw(RangeError);
        });

        it('should throw error when the value is out of range', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Uint16, size: 2, from: 0, to: 2}}
            });

            expect(() => Type.serialize({balance: 65536})).to.throw(RangeError);
        });

        it('should throw error when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Uint16, size: 2, from: 0, to: 2}}
            });

            [true, null, undefined, [], {}, new Date()].forEach(function(balance) {
                expect(() => Type.serialize({balance: balance})).to.throw(TypeError);
            });
        });

    });

    describe('Process Uint32', function() {

        it('should serialize data and return array of 8-bit integers when the value is valid positive number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Uint32, size: 4, from: 0, to: 4}}
            });
            var data = {balance: 613228};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([108, 91, 9, 0]);
        });

        it('should throw error when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Uint32, size: 4, from: 0, to: 3}}
            });

            expect(() => Type.serialize({balance: 613228})).to.throw(Error);
        });

        it('should throw error when the value is negative number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Uint32, size: 4, from: 0, to: 4}}
            });

            expect(() => Type.serialize({balance: -1})).to.throw(RangeError);
        });

        it('should throw error when the value is out of range', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Uint32, size: 4, from: 0, to: 4}}
            });

            expect(() => Type.serialize({balance: 4294967296})).to.throw(RangeError);
        });

        it('should throw error when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Uint32, size: 4, from: 0, to: 4}}
            });

            [true, null, undefined, [], {}, new Date()].forEach(function(balance) {
                expect(() => Type.serialize({balance: balance})).to.throw(TypeError);
            });
        });

    });

    describe('Process Uint64', function() {

        it('should serialize data and return array of 8-bit integers when the value is valid positive number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Uint64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: 613228};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([108, 91, 9, 0, 0, 0, 0, 0]);
        });

        it('should serialize data and return array of 8-bit integers when the value is valid positive number passed as string', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Uint64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: '9007199254740993'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([1, 0, 0, 0, 0, 0, 32, 0]);
        });

        it('should throw error when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Uint64, size: 8, from: 0, to: 4}}
            });

            expect(() => Type.serialize({balance: 613228})).to.throw(Error);
        });

        it('should throw error when the value is negative number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Uint64, size: 8, from: 0, to: 8}}
            });

            expect(() => Type.serialize({balance: -613228})).to.throw(RangeError);
        });

        it('should throw error when the value is out of range', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Uint64, size: 8, from: 0, to: 8}}
            });

            expect(() => Type.serialize({balance: '18446744073709551616'})).to.throw(RangeError);
        });

        it('should throw error when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Uint64, size: 8, from: 0, to: 8}}
            });

            [true, null, undefined, [], {}, new Date()].forEach(function(balance) {
                expect(() => Type.serialize({balance: balance})).to.throw(TypeError);
            });
        });

    });

});

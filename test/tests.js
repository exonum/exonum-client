var expect = require('chai').expect;
var Exonum = require('../src/index');
var fs = require('fs');

describe('Client for Exonum blockchain platform', function() {

    /*
     -------------------------------------------------------------------------------------------------------------------
     Cover built-in types
     -------------------------------------------------------------------------------------------------------------------
     */

    /*
     Exonum.Hash
     */
    describe('Process Hash', function() {

        it('should serialize data and return array of 8-bit integers when the value is valid string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 32}}
            });
            var data = {hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54]);
        });

        it('should return undefined when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 16}}
            });
            var data = {hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is invalid string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 32}}
            });
            var data = {hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3z'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is too long string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 32}}
            });
            var data = {hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is too short string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 32}}
            });
            var data = {hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 32}}
            });
            var args = [true, null, undefined, 57, [], {}, new Date()];

            function test(hash) {
                var buffer = Type.serialize({hash: hash});
                expect(buffer).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i])
            }
        });

    });

    /*
     Exonum.PublicKey
     */
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

        it('should return undefined when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {key: {type: Exonum.PublicKey, size: 32, from: 0, to: 16}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is invalid string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3z'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is too long string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is too short string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32}}
            });
            var args = [true, null, undefined, 57, [], {}, new Date()];

            function test(key) {
                var buffer = Type.serialize({key: key});
                expect(buffer).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i])
            }
        });

    });

    /*
     Exonum.Digest
     */
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

        it('should return undefined when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 64,
                fields: {key: {type: Exonum.Digest, size: 64, from: 0, to: 32}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is invalid string', function() {
            var Type = Exonum.newType({
                size: 64,
                fields: {key: {type: Exonum.Digest, size: 64, from: 0, to: 64}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3zf5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3z'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is too long string', function() {
            var Type = Exonum.newType({
                size: 64,
                fields: {key: {type: Exonum.Digest, size: 64, from: 0, to: 64}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is too short string', function() {
            var Type = Exonum.newType({
                size: 64,
                fields: {key: {type: Exonum.Digest, size: 64, from: 0, to: 64}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 64,
                fields: {key: {type: Exonum.Digest, size: 64, from: 0, to: 64}}
            });
            var args = [true, null, undefined, 57, [], {}, new Date()];

            function test(key) {
                var buffer = Type.serialize({key: key});
                expect(buffer).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i])
            }
        });

    });

    /*
     Exonum.Timespec
     */
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

        it('should return undefined when the value is negative number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {since: {type: Exonum.Timespec, size: 8, from: 0, to: 8}}
            });
            var data = {since: -1483979894237};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {since: {type: Exonum.Timespec, size: 8, from: 0, to: 4}}
            });
            var data = {since: 1483979894237};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is out of range', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {since: {type: Exonum.Timespec, size: 8, from: 0, to: 8}}
            });
            var data = {since: '18446744073709551616'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {since: {type: Exonum.Timespec, size: 8, from: 0, to: 8}}
            });
            var args = [true, null, undefined, [], {}, new Date()];

            function test(since) {
                var buffer = Type.serialize({since: since});
                expect(buffer).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i])
            }
        });

    });

    /*
     Exonum.Bool
     */
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

        it('should return undefined when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {active: {type: Exonum.Bool, size: 1, from: 0, to: 0}}
            });
            var data = {active: true};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {active: {type: Exonum.Bool, size: 1, from: 0, to: 1}}
            });
            var args = ['Hello world', null, undefined, 57, [], {}, new Date()];

            function test(since) {
                var buffer = Type.serialize({since: since});
                expect(buffer).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i])
            }
        });

    });

    /*
     Exonum.String
     */
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

        it('should return undefined when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {text: {type: Exonum.String, size: 8, from: 0, to: 4}}
            });
            var data = {text: 'Hello world'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {text: {type: Exonum.String, size: 8, from: 0, to: 8}}
            });
            var args = [true, null, undefined, 57, [], {}, new Date()];

            function test(text) {
                var buffer = Type.serialize({text: text});
                expect(buffer).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i])
            }
        });

    });

    /*
     Exonum.Int8
     */
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

        it('should return undefined when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Int8, size: 1, from: 0, to: 0}}
            });
            var data = {balance: 120};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is too big positive number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Int8, size: 1, from: 0, to: 1}}
            });
            var data = {balance: 130};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is too big negative number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Int8, size: 1, from: 0, to: 1}}
            });
            var data = {balance: -130};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Int8, size: 1, from: 0, to: 1}}
            });
            var args = [true, null, undefined, [], {}, new Date()];

            function test(balance) {
                var buffer = Type.serialize({balance: balance});
                expect(buffer).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i])
            }
        });

    });

    /*
     Exonum.Int16
     */
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

        it('should return undefined when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Int16, size: 2, from: 0, to: 1}}
            });
            var data = {balance: 30767};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is too big positive number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Int16, size: 2, from: 0, to: 2}}
            });
            var data = {balance: 32769};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is too big negative number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Int16, size: 2, from: 0, to: 2}}
            });
            var data = {balance: -32770};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Int16, size: 2, from: 0, to: 2}}
            });
            var args = [true, null, undefined, [], {}, new Date()];

            function test(balance) {
                var buffer = Type.serialize({balance: balance});
                expect(buffer).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i])
            }
        });

    });

    /*
     Exonum.Int32
     */
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

        it('should return undefined when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Int32, size: 4, from: 0, to: 3}}
            });
            var data = {balance: 613228};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is too big positive number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Int32, size: 4, from: 0, to: 4}}
            });
            var data = {balance: 2147483649};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is too big negative number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Int32, size: 4, from: 0, to: 4}}
            });
            var data = {balance: -2147483650};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Int32, size: 4, from: 0, to: 4}}
            });
            var args = [true, null, undefined, [], {}, new Date()];

            function test(balance) {
                var buffer = Type.serialize({balance: balance});
                expect(buffer).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i])
            }
        });

    });

    /*
     Exonum.Int64
     */
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

        it('should return undefined when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 4}}
            });
            var data = {balance: 613228};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is too big positive number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: '9223372036854775808'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is too big negative number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: '-9223372036854775809'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 8}}
            });
            var args = [true, null, undefined, [], {}, new Date()];

            function test(balance) {
                var buffer = Type.serialize({balance: balance});
                expect(buffer).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i])
            }
        });

    });

    /*
     Exonum.Uint8
     */
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

        it('should return undefined when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Uint8, size: 1, from: 0, to: 0}}
            });
            var data = {balance: 230};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is negative number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Uint8, size: 1, from: 0, to: 1}}
            });
            var data = {balance: -1};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is out of range', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Uint8, size: 1, from: 0, to: 1}}
            });
            var data = {balance: 256};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Uint8, size: 1, from: 0, to: 1}}
            });
            var args = [true, null, undefined, [], {}, new Date()];

            function test(balance) {
                var buffer = Type.serialize({balance: balance});
                expect(buffer).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i])
            }
        });

    });

    /*
     Exonum.Uint16
     */
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

        it('should return undefined when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Uint16, size: 2, from: 0, to: 1}}
            });
            var data = {balance: 60535};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is negative number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Uint16, size: 2, from: 0, to: 2}}
            });
            var data = {balance: -1};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is out of range', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Uint16, size: 2, from: 0, to: 2}}
            });
            var data = {balance: 65536};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Uint16, size: 2, from: 0, to: 2}}
            });
            var args = [true, null, undefined, [], {}, new Date()];

            function test(balance) {
                var buffer = Type.serialize({balance: balance});
                expect(buffer).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i])
            }
        });

    });

    /*
     Exonum.Uint32
     */
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

        it('should return undefined when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Uint32, size: 4, from: 0, to: 3}}
            });
            var data = {balance: 613228};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is negative number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Uint32, size: 4, from: 0, to: 4}}
            });
            var data = {balance: -1};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is out of range', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Uint32, size: 4, from: 0, to: 4}}
            });
            var data = {balance: 4294967296};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Uint32, size: 4, from: 0, to: 4}}
            });
            var args = [true, null, undefined, [], {}, new Date()];

            function test(balance) {
                var buffer = Type.serialize({balance: balance});
                expect(buffer).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i])
            }
        });

    });

    /*
     Exonum.Uint64
     */
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

        it('should return undefined when the range of segment is invalid', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Uint64, size: 8, from: 0, to: 4}}
            });
            var data = {balance: 613228};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is negative number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Uint64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: -613228};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value is out of range', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Uint64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: '18446744073709551616'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('should return undefined when the value of invalid type', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Uint64, size: 8, from: 0, to: 8}}
            });
            var args = [true, null, undefined, [], {}, new Date()];

            function test(balance) {
                var buffer = Type.serialize({balance: balance});
                expect(buffer).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i])
            }
        });

    });

    /*
     -------------------------------------------------------------------------------------------------------------------
     Cover public methods
     -------------------------------------------------------------------------------------------------------------------
     */

    /*
     Exonum.newType.serialize
     */
    describe('Build array of 8-bit integers', function() {

        it('should serialize data of newType type and return array of 8-bit integers', function() {
            var Wallet = Exonum.newType({
                size: 80,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_hash: {type: Exonum.Hash, size: 32, from: 48, to: 80}
                }
            });
            var walletData = {
                pub_key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
                name: 'Smart wallet',
                balance: 359120,
                history_hash: '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030'
            };

            var buffer = Wallet.serialize(walletData);

            expect(buffer).to.deep.equal([245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54, 80, 0, 0, 0, 12, 0, 0, 0, 208, 122, 5, 0, 0, 0, 0, 0, 103, 82, 190, 136, 35, 20, 245, 187, 188, 154, 106, 242, 174, 99, 79, 192, 112, 56, 88, 74, 74, 119, 81, 14, 165, 236, 237, 69, 245, 77, 192, 48, 83, 109, 97, 114, 116, 32, 119, 97, 108, 108, 101, 116]);
        });

        it('should serialize data of complicated non-fixed newType type and return array of 8-bit integers', function() {
            var User = Exonum.newType({
                size: 16,
                fields: {
                    name: {type: Exonum.String, size: 8, from: 0, to: 8},
                    surname: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var Transaction = Exonum.newType({
                size: 40,
                fields: {
                    from: {type: User, size: 16, from: 0, to: 16},
                    to: {type: User, size: 16, from: 16, to: 32},
                    sum: {type: Exonum.Uint64, size: 8, from: 32, to: 40}
                }
            });
            var transactionData = {
                from: {
                    name: 'John',
                    surname: 'Doe'
                },
                to: {
                    name: 'Steven',
                    surname: 'Black'
                },
                sum: 200
            };

            var buffer = Transaction.serialize(transactionData);

            expect(buffer).to.deep.equal([40, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 63, 0, 0, 0, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 0, 0, 0, 0, 0, 0, 0, 56, 0, 0, 0, 4, 0, 0, 0, 60, 0, 0, 0, 3, 0, 0, 0, 74, 111, 104, 110, 68, 111, 101, 79, 0, 0, 0, 6, 0, 0, 0, 85, 0, 0, 0, 5, 0, 0, 0, 83, 116, 101, 118, 101, 110, 66, 108, 97, 99, 107]);
        });

        it('should serialize data of complicated fixed newType type and return array of 8-bit integers', function() {
            var Wallet = Exonum.newType({
                size: 16,
                fields: {
                    id: {type: Exonum.Uint64, size: 8, from: 0, to: 8},
                    balance: {type: Exonum.Uint64, size: 8, from: 8, to: 16}
                }
            });
            var Transaction = Exonum.newType({
                size: 40,
                fields: {
                    from: {type: Wallet, size: 16, from: 0, to: 16},
                    to: {type: Wallet, size: 16, from: 16, to: 32},
                    sum: {type: Exonum.Uint64, size: 8, from: 32, to: 40}
                }
            });
            var transactionData = {
                from: {
                    id: 57,
                    balance: 500
                },
                to: {
                    id: 921,
                    balance: 0
                },
                sum: 200
            };

            var buffer = Transaction.serialize(transactionData);

            expect(buffer).to.deep.equal([57, 0, 0, 0, 0, 0, 0, 0, 244, 1, 0, 0, 0, 0, 0, 0, 153, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 0, 0, 0, 0, 0, 0, 0]);
        });

        it('should serialize data (with inherited properties that should be ignored) of newType type and return array of 8-bit integers', function() {
            var Wallet = Exonum.newType({
                size: 80,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_hash: {type: Exonum.Hash, size: 32, from: 48, to: 80}
                }
            });

            function Data() {
                this.pub_key = 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36';
                this.name = 'Smart wallet';
                this.balance = 359120;
                this.history_hash = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030';
                return this;
            }

            function DataAncestor() {
                return this;
            }

            DataAncestor.prototype.someMethod = function() {
                return this;
            };

            Data.prototype = Object.create(DataAncestor.prototype);

            var walletData = new Data();

            var buffer = Wallet.serialize(walletData);

            expect(buffer).to.deep.equal([245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54, 80, 0, 0, 0, 12, 0, 0, 0, 208, 122, 5, 0, 0, 0, 0, 0, 103, 82, 190, 136, 35, 20, 245, 187, 188, 154, 106, 242, 174, 99, 79, 192, 112, 56, 88, 74, 74, 119, 81, 14, 165, 236, 237, 69, 245, 77, 192, 48, 83, 109, 97, 114, 116, 32, 119, 97, 108, 108, 101, 116]);
        });

        it('should return undefined when some data parameters are missed', function() {
            var Wallet = Exonum.newType({
                size: 80,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_hash: {type: Exonum.Hash, size: 32, from: 48, to: 80}
                }
            });
            var walletData = {fake: 123};
            var buffer = Wallet.serialize(walletData);

            expect(buffer).to.equal(undefined);
        });

    });

    /*
     Exonum.hash
     */
    describe('Get SHA256 hash', function() {

        it('should return hash of data of newType type', function() {
            var Wallet = Exonum.newType({
                size: 80,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_hash: {type: Exonum.Hash, size: 32, from: 48, to: 80}
                }
            });
            var walletData = {
                pub_key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
                name: 'Smart wallet',
                balance: 359120,
                history_hash: '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030'
            };
            var hash = Exonum.hash(walletData, Wallet);

            expect(hash).to.equal('86b47510fbcbc83f9926d8898a57c53662518c97502625a6d131842f2003f974');
        });

        it('should return hash of data of newType type using built-in method', function() {
            var Wallet = Exonum.newType({
                size: 80,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_hash: {type: Exonum.Hash, size: 32, from: 48, to: 80}
                }
            });
            var walletData = {
                pub_key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
                name: 'Smart wallet',
                balance: 359120,
                history_hash: '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030'
            };
            var hash = Wallet.hash(walletData);

            expect(hash).to.equal('86b47510fbcbc83f9926d8898a57c53662518c97502625a6d131842f2003f974');
        });

        it('should return hash of data of newMessage type', function() {
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_id: 2,
                fields: {
                    name: {type: Exonum.String, size: 8, from: 0, to: 8},
                    age: {type: Exonum.Uint8, size: 1, from: 8, to: 9},
                    balance: {type: Exonum.Uint64, size: 8, from: 9, to: 17},
                    status: {type: Exonum.Bool, size: 1, from: 17, to: 18}
                }
            });
            var messageData = {
                name: 'John Doe',
                age: 34,
                balance: 17,
                status: true
            };
            var hash = Exonum.hash(messageData, CustomMessage);

            expect(hash).to.equal('21fea5e2dbd068fc51efb7ac26ad9a84b6bdd91e80c104e58e93af1ea39fc5d7');
        });

        it('should return hash of data of newMessage type using built-in method', function() {
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_id: 2,
                fields: {
                    name: {type: Exonum.String, size: 8, from: 0, to: 8},
                    age: {type: Exonum.Uint8, size: 1, from: 8, to: 9},
                    balance: {type: Exonum.Uint64, size: 8, from: 9, to: 17},
                    status: {type: Exonum.Bool, size: 1, from: 17, to: 18}
                }
            });
            var messageData = {
                name: 'John Doe',
                age: 34,
                balance: 17,
                status: true
            };
            var hash = CustomMessage.hash(messageData);

            expect(hash).to.equal('21fea5e2dbd068fc51efb7ac26ad9a84b6bdd91e80c104e58e93af1ea39fc5d7');
        });

        it('should return hash of the array of 8-bit integers', function() {
            var Wallet = Exonum.newType({
                size: 80,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_hash: {type: Exonum.Hash, size: 32, from: 48, to: 80}
                }
            });
            var walletData = {
                pub_key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
                name: 'Smart wallet',
                balance: 359120,
                history_hash: '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030'
            };
            var buffer = Wallet.serialize(walletData);
            var hash = Exonum.hash(buffer);

            expect(hash).to.equal('86b47510fbcbc83f9926d8898a57c53662518c97502625a6d131842f2003f974');
        });

        it('should return undefined when data of invalid NewType type', function() {
            var Wallet = Exonum.newType({
                size: 80,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_hash: {type: Exonum.Hash, size: 32, from: 48, to: 80}
                }
            });
            var args = [undefined, false, 42, new Date(), []];

            function test(_hash) {
                var hash = Exonum.hash(_hash, Wallet);
                expect(hash).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i])
            }
        });

        it('should return undefined when data of invalid NewMessage type', function() {
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_id: 2,
                fields: {
                    name: {type: Exonum.String, size: 8, from: 0, to: 8},
                    age: {type: Exonum.Uint8, size: 1, from: 8, to: 9},
                    balance: {type: Exonum.Uint64, size: 8, from: 9, to: 17},
                    status: {type: Exonum.Bool, size: 1, from: 17, to: 18}
                }
            });
            var args = [undefined, false, 42, new Date(), []];

            function test(_hash) {
                var hash = Exonum.hash(_hash, CustomMessage);
                expect(hash).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

    });

    /*
     Exonum.signature
     */
    describe('Get ED25519 signature', function() {

        it('should return signature of the data of NewType type', function() {
            var secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var signature = Exonum.sign(userData, User, secretKey);

            expect(signature).to.equal('7ccad21d76359c8c3ed1161eb8231edd44a91d53ea468d23f8528e2985e5547f72f98ccc61d96ecad173bdc29627abbf6d46908807f6dd0a0d767ae3887d040e');
        });

        it('should return signature of the data of NewType type using built-in method', function() {
            var secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var signature = User.sign(userData, secretKey);

            expect(signature).to.equal('7ccad21d76359c8c3ed1161eb8231edd44a91d53ea468d23f8528e2985e5547f72f98ccc61d96ecad173bdc29627abbf6d46908807f6dd0a0d767ae3887d040e');
        });

        it('should return signature of the data of NewMessage type', function() {
            var secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_id: 2,
                fields: {
                    name: {type: Exonum.String, size: 8, from: 0, to: 8},
                    age: {type: Exonum.Uint8, size: 1, from: 8, to: 9},
                    balance: {type: Exonum.Uint64, size: 8, from: 9, to: 17},
                    status: {type: Exonum.Bool, size: 1, from: 17, to: 18}
                }
            });
            var messageData = {
                name: 'John Doe',
                age: 34,
                balance: 173008,
                status: true
            };
            var signature = Exonum.sign(messageData, CustomMessage, secretKey);

            expect(signature).to.equal('4006cef1884941850a6b97a64ed7f12d1e1053188618ef71b8c9f87438b943b1969e08011e45db8299bb738fec60c9dcd1936ab9ba44392cacc7f0385f18dd09');
        });

        it('should return signature of the data of NewMessage type using built-in method', function() {
            var secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_id: 2,
                fields: {
                    name: {type: Exonum.String, size: 8, from: 0, to: 8},
                    age: {type: Exonum.Uint8, size: 1, from: 8, to: 9},
                    balance: {type: Exonum.Uint64, size: 8, from: 9, to: 17},
                    status: {type: Exonum.Bool, size: 1, from: 17, to: 18}
                }
            });
            var messageData = {
                name: 'John Doe',
                age: 34,
                balance: 173008,
                status: true
            };
            var signature = CustomMessage.sign(messageData, secretKey);

            expect(signature).to.equal('4006cef1884941850a6b97a64ed7f12d1e1053188618ef71b8c9f87438b943b1969e08011e45db8299bb738fec60c9dcd1936ab9ba44392cacc7f0385f18dd09');
        });

        it('should return signature of the array of 8-bit integers', function() {
            var secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var buffer = User.serialize(userData);
            var signature = Exonum.sign(buffer, secretKey);

            expect(signature).to.equal('7ccad21d76359c8c3ed1161eb8231edd44a91d53ea468d23f8528e2985e5547f72f98ccc61d96ecad173bdc29627abbf6d46908807f6dd0a0d767ae3887d040e');
        });

        it('should return undefined when the data parameter of wrong NewType type', function() {
            var secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                sum: 500,
                hash: 'Hello world'
            };
            var signature = Exonum.sign(userData, User, secretKey);

            expect(signature).to.equal(undefined);
        });

        it('should return undefined when the data parameter of wrong NewMessage type', function() {
            var secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_id: 2,
                fields: {
                    name: {type: Exonum.String, size: 8, from: 0, to: 8},
                    age: {type: Exonum.Uint8, size: 1, from: 8, to: 9},
                    balance: {type: Exonum.Uint64, size: 8, from: 9, to: 17},
                    status: {type: Exonum.Bool, size: 1, from: 17, to: 18}
                }
            });
            var someData = {
                sum: 500,
                hash: 'Hello world'
            };
            var signature = Exonum.sign(someData, CustomMessage, secretKey);

            expect(signature).to.equal(undefined);
        });

        it('should return undefined when the type parameter of invalid type', function() {
            var secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var User = {
                alpha: 5
            };
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var signature = Exonum.sign(userData, User, secretKey);

            expect(signature).to.equal(undefined);
        });

        it('should return undefined when the secretKey parameter of wrong length', function() {
            var secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var buffer = User.serialize(userData);
            var signature = Exonum.sign(buffer, secretKey);

            expect(signature).to.equal(undefined);
        });

        it('should return undefined when wrong secretKey parameter', function() {
            var secretKey = '6752ZE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var buffer = User.serialize(userData);
            var signature = Exonum.sign(buffer, secretKey);

            expect(signature).to.equal(undefined);
        });

        it('should return undefined when the secretKey parameter of invalid type', function() {
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var buffer = User.serialize(userData);
            var args = [true, null, undefined, [], {}, 51, new Date()];

            function test(secretKey) {
                expect(Exonum.sign(buffer, secretKey)).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

    });

    /*
     Exonum.signature
     */
    describe('Verify signature', function() {

        it('should verify signature of the data of NewType type and return true', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var signature = '7ccad21d76359c8c3ed1161eb8231edd44a91d53ea468d23f8528e2985e5547f72f98ccc61d96ecad173bdc29627abbf6d46908807f6dd0a0d767ae3887d040e';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };

            expect(Exonum.verifySignature(userData, User, signature, publicKey)).to.equal(true);
        });

        it('should verify signature of the data of NewType type using built-in method and return true', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var signature = '7ccad21d76359c8c3ed1161eb8231edd44a91d53ea468d23f8528e2985e5547f72f98ccc61d96ecad173bdc29627abbf6d46908807f6dd0a0d767ae3887d040e';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };

            expect(User.verifySignature(userData, signature, publicKey)).to.equal(true);
        });

        it('should verify signature of the data of NewMessage type and return true', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var signature = '4006cef1884941850a6b97a64ed7f12d1e1053188618ef71b8c9f87438b943b1969e08011e45db8299bb738fec60c9dcd1936ab9ba44392cacc7f0385f18dd09';
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_id: 2,
                fields: {
                    name: {type: Exonum.String, size: 8, from: 0, to: 8},
                    age: {type: Exonum.Uint8, size: 1, from: 8, to: 9},
                    balance: {type: Exonum.Uint64, size: 8, from: 9, to: 17},
                    status: {type: Exonum.Bool, size: 1, from: 17, to: 18}
                }
            });
            var messageData = {
                name: 'John Doe',
                age: 34,
                balance: 173008,
                status: true
            };

            expect(Exonum.verifySignature(messageData, CustomMessage, signature, publicKey)).to.equal(true);
        });

        it('should verify signature of the data of NewMessage type using built-in method and return true', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var signature = '4006cef1884941850a6b97a64ed7f12d1e1053188618ef71b8c9f87438b943b1969e08011e45db8299bb738fec60c9dcd1936ab9ba44392cacc7f0385f18dd09';
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_id: 2,
                fields: {
                    name: {type: Exonum.String, size: 8, from: 0, to: 8},
                    age: {type: Exonum.Uint8, size: 1, from: 8, to: 9},
                    balance: {type: Exonum.Uint64, size: 8, from: 9, to: 17},
                    status: {type: Exonum.Bool, size: 1, from: 17, to: 18}
                }
            });
            var messageData = {
                name: 'John Doe',
                age: 34,
                balance: 173008,
                status: true
            };

            expect(CustomMessage.verifySignature(messageData, signature, publicKey)).to.equal(true);
        });

        it('should verify signature of the array of 8-bit integers', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var signature = '7ccad21d76359c8c3ed1161eb8231edd44a91d53ea468d23f8528e2985e5547f72f98ccc61d96ecad173bdc29627abbf6d46908807f6dd0a0d767ae3887d040e';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var buffer = User.serialize(userData);

            expect(Exonum.verifySignature(buffer, signature, publicKey)).to.equal(true);
        });

        it('should return undefined when the data parameter is of wrong NewType type', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var signature = '9e0f0122c2963b76ba10842951cd1b67c8197b3f964c34f8b667aa655a7b4a8d844d567698d99de30590fc5002ddb4b9b5927ec05cd73572b972cb6b034cd40b';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                sum: 500,
                hash: 'Hello world'
            };

            expect(Exonum.verifySignature(userData, User, signature, publicKey)).to.equal(undefined);
        });

        it('should return undefined when the data parameter is of wrong NewMessage type', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var signature = '24a5224702d670c95a78ef1f753c9e6e698da5b2a2c52dcc51b5bf9e556e717fb763b1a5e78bd39e5369a139ab68ae50dd19a129038e8da3af30985f09549500';
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_id: 2,
                fields: {
                    name: {type: Exonum.String, size: 8, from: 0, to: 8},
                    age: {type: Exonum.Uint8, size: 1, from: 8, to: 9},
                    balance: {type: Exonum.Uint64, size: 8, from: 9, to: 17},
                    status: {type: Exonum.Bool, size: 1, from: 17, to: 18}
                }
            });
            var someData = {
                sum: 500,
                hash: 'Hello world'
            };

            expect(Exonum.verifySignature(someData, CustomMessage, signature, publicKey)).to.equal(undefined);
        });

        it('should return undefined when the type parameter is of wrong type', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var signature = '9e0f0122c2963b76ba10842951cd1b67c8197b3f964c34f8b667aa655a7b4a8d844d567698d99de30590fc5002ddb4b9b5927ec05cd73572b972cb6b034cd40b';
            var User = {
                alpha: 3
            };
            var userData = {
                sum: 500,
                hash: 'Hello world'
            };

            expect(Exonum.verifySignature(userData, User, signature, publicKey)).to.equal(undefined);
        });

        it('should return undefined when the signature parameter is of wrong length', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var signature = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var buffer = User.serialize(userData);

            expect(Exonum.verifySignature(buffer, signature, publicKey)).to.equal(undefined);
        });

        it('should return undefined when the signature parameter is invalid', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var signature = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7Z';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var buffer = User.serialize(userData);

            expect(Exonum.verifySignature(buffer, signature, publicKey)).to.equal(undefined);
        });

        it('should return undefined when the signature parameter is of wrong type', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var buffer = User.serialize(userData);
            var args = [true, null, undefined, [], {}, 51, new Date()];

            function test(signature) {
                expect(Exonum.verifySignature(buffer, signature, publicKey)).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when the publicKey parameter is of wrong length', function() {
            var publicKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C';
            var signature = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var buffer = User.serialize(userData);

            expect(Exonum.verifySignature(buffer, signature, publicKey)).to.equal(undefined);
        });

        it('should return undefined when the publicKey parameter is invalid', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C3Z';
            var signature = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var buffer = User.serialize(userData);

            expect(Exonum.verifySignature(buffer, signature, publicKey)).to.equal(undefined);
        });

        it('should return undefined when the publicKey parameter is of wrong type', function() {
            var signature = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var buffer = User.serialize(userData);
            var args = [true, null, undefined, [], {}, 51, new Date()];

            function test(publicKey) {
                expect(Exonum.verifySignature(buffer, signature, publicKey)).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

    });

    /*
     Exonum.merkleProof
     */
    describe('Check proof of Merkle tree', function() {

        it('should return array of children of valid tree', function() {
            var data = require('./common_data/merkle-tree/valid-merkle-tree.json');
            var elements = Exonum.merkleProof(
                data.root_hash,
                data.list_length,
                data.proof,
                [data.range_st, data.range_end - 1]
            );
            expect(elements).to.deep.equal([
                [153, 209, 189, 13, 222, 26, 107, 28, 238, 121],
                [98, 142, 223, 244, 216, 184, 203, 213, 158, 53],
                [152, 213, 96, 73, 235, 62, 222, 64, 239, 47],
                [43, 93, 185, 75, 181, 229, 155, 34, 13, 95],
                [30, 13, 8, 60, 72, 173, 0, 135, 185, 216],
                [210, 127, 166, 231, 147, 251, 53, 14, 79, 139]
            ]);
        });

        it('should return array of children of valid tree with range end placed out of possible range', function() {
            var data = require('./common_data/merkle-tree/valid-merkle-tree-with-single-node.json');
            var elements = Exonum.merkleProof(
                data.root_hash,
                data.list_length,
                data.proof,
                [data.range_st, data.range_end - 1]
            );
            expect(elements).to.deep.equal([[7, 8]]);
        });

        it('should return array of children of fully balanced valid tree contained all its values', function() {
            var data = require('./common_data/merkle-tree/valid-merkle-tree-fully-balanced-with-all-values.json');
            var elements = Exonum.merkleProof(
                data.root_hash,
                data.list_length,
                data.proof,
                [data.range_st, data.range_end - 1]
            );
            expect(elements).to.deep.equal([
                [1, 2],
                [2, 3],
                [3, 4],
                [4, 5],
                [5, 6],
                [6, 7],
                [7, 8],
                [8, 9]
            ]);
        });

        it('should return array of children of valid tree with hashes as values', function() {
            var data = require('./common_data/merkle-tree/valid-merkle-tree-with-hashes-as-values.json');
            var elements = Exonum.merkleProof(
                data.root_hash,
                data.list_length,
                data.proof,
                [data.range_st, data.range_end - 1]
            );
            expect(elements).to.deep.equal([
                '6b12e527ec9c6c0254a64bee9e6bbcc46b42c28d822cd84f052d0fc188b74f2b',
                'a51c09752dbbd672aa9bb1c1741bcf225027e8826065295418b141937f3e72f4',
                '0848c44013f082dced067c631550b8ba91764582f82aef6b63a8f2203ae488b2',
                '36c5278cecf57e032089a258185bec2bd924a98a8807750c3ef0d40dae60f8df',
                '8a817f5d86a7c16ae2dc5bbf12d20e0df7d3cf5f10af8a3a8ab8196889d13059'
            ]);
        });

        it('should return array of children of valid tree with single value', function() {
            var elements = Exonum.merkleProof(
                '0fcee0b2e0e62b423048578861e7a14d7a3191289ef68ce8e72abbdc53b3c677',
                1,
                {
                    "val": "fae96592ccc79963e15f22b7036b4a688224e5127592f6ea8ddd2355a33e4162"
                },
                [0, 1]
            );
            expect(elements).to.deep.equal([
                'fae96592ccc79963e15f22b7036b4a688224e5127592f6ea8ddd2355a33e4162'
            ]);
        });

        it('should return undefined when the tree with invalid rootHash', function() {
            var args = [
                '6z56f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1',
                true,
                null,
                undefined,
                [],
                {},
                42,
                new Date()
            ];

            function test(rootHash) {
                expect(Exonum.merkleProof(
                    rootHash,
                    8,
                    {},
                    [0, 8]
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when the tree with invalid count', function() {
            var args = [
                true,
                null,
                undefined,
                [],
                {},
                'Hello world',
                -42,
                '-42',
                new Date()
            ];

            function test(count) {
                expect(Exonum.merkleProof(
                    '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                    count,
                    {},
                    [0, 8]
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when the tree with invalid proofNode', function() {
            var args = [
                true,
                null,
                undefined,
                [],
                'Hello world',
                42,
                new Date()
            ];

            function test(proofNode) {
                expect(Exonum.merkleProof(
                    '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                    8,
                    proofNode,
                    [0, 8]
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when the tree with invalid range', function() {
            var args = [
                true, null, undefined, [], {}, 'Hello world', 42, new Date(),
                [0], [0, 8, 16],
                [true, 8], [null, 8], [undefined, 8], [[], 8], [{}, 8], ['Hello world', 8], [new Date(), 8], ['1', 8], ['-1', 8], [-1, 8],
                [8, true], [8, null], [8, undefined], [8, []], [8, {}], [8, 'Hello world'], [8, new Date()], [0, '1'], [0, '-1'], [0, -1]
            ];

            function test(range) {
                expect(Exonum.merkleProof(
                    '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                    8,
                    {},
                    range
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when the tree with range start is out of range', function() {
            var elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                [9, 8]
            );
            expect(elements).to.equal(undefined);
        });

        it('should return undefined when the tree with elements that out of tree range', function() {
            var elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                [9, 9]
            );
            expect(elements).to.deep.equal([]);
        });

        it('should return undefined when the tree with leaf on wrong height', function() {
            var data = require('./common_data/merkle-tree/invalid-merkle-tree-with-leaf-on-wrong-height.json');
            var elements = Exonum.merkleProof(
                data.root_hash,
                data.list_length,
                data.proof,
                [data.range_st, data.range_end - 1]
            );
            expect(elements).to.equal(undefined);
        });

        it('should return undefined when the tree with wrong index of value node', function() {
            var data = require('./data/invalid-merkle-tree-with-wrong-index-of-value-node.json');
            var elements = Exonum.merkleProof(
                data.root_hash,
                data.list_length,
                data.proof,
                [data.range_st, data.range_end - 1]
            );
            expect(elements).to.equal(undefined);
        });

        it('should return undefined when the tree with value on wrong position', function() {
            var data = require('./data/invalid-merkle-tree-with-value-on-wrong-position.json');
            var elements = Exonum.merkleProof(
                data.root_hash,
                data.list_length,
                data.proof,
                [data.range_st, data.range_end - 1]
            );
            expect(elements).to.equal(undefined);
        });

        it('should return undefined when the tree with invalid type of type parameter', function() {
            var args = [
                null, 42, [], new Date()
            ];

            function test(type) {
                expect(Exonum.merkleProof(
                    '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                    2,
                    {
                        left: {val: [255, 128]},
                        right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                    },
                    [0, 2],
                    type
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when the tree with invalid value', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 32}}
            });
            var args = [
                42, 'Hello world', [], new Date()
            ];

            function test(val) {
                expect(Exonum.merkleProof(
                    '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                    2,
                    {
                        left: {val: val},
                        right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                    },
                    [0, 2],
                    Type
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when the tree with invalid value not corresponding to passed type', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 32}}
            });
            var elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: {name: 'John'}},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2],
                Type
            );
            expect(elements).to.equal(undefined);
        });

        it('should return undefined when the tree with invalid array of 8-bit integers as value', function() {
            var args = [
                true, {}, 42, 'Hello world', new Date(),
                [153, 256], [153, -1], [153, true], [153, null], [153, undefined], [153, 'Hello world'], [153, {}], [153, []], [153, new Date()]
            ];

            function test(val) {
                expect(Exonum.merkleProof(
                    '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                    2,
                    {
                        left: {val: true},
                        right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                    },
                    [0, 2]
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when the tree with missed left node', function() {
            var elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                4,
                {
                    left: {
                        right: {val: [255, 128]}
                    },
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);
        });

        it('should return undefined when the tree with invalid string in left node', function() {
            var args = [
                'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fz',
                'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365c',
                'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fa52',
                '',
                true,
                null,
                undefined,
                [],
                42
            ];

            function test(hash) {
                expect(Exonum.merkleProof(
                    '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                    2,
                    {
                        left: hash,
                        right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                    },
                    [0, 2]
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when the tree with invalid string in right node', function() {
            var args = [
                'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fz',
                'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365c',
                'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fa52',
                '',
                true,
                null,
                undefined,
                [],
                42
            ];

            function test(hash) {
                expect(Exonum.merkleProof(
                    '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                    2,
                    {
                        left: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc',
                        right: hash
                    },
                    [0, 2]
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when the tree with missed right leaf inside right tree branch', function() {
            var data = require('./common_data/merkle-tree/invalid-merkle-tree-missed-right-leaf-on-left-branch.json');
            var elements = Exonum.merkleProof(
                data.root_hash,
                data.list_length,
                data.proof,
                [data.range_st, data.range_end - 1]
            );
            expect(elements).to.equal(undefined);
        });

        it('should return undefined when the tree with wrong rootHash', function() {
            var data = require('./data/invalid-merkle-tree-with-wrong-root-hash.json');
            var elements = Exonum.merkleProof(
                data.root_hash,
                data.list_length,
                data.proof,
                [data.range_st, data.range_end - 1]
            );
            expect(elements).to.equal(undefined);
        });

        it('should return undefined when the tree with wrong amount of elements', function() {
            var data = require('./data/invalid-merkle-tree-with-wrong-amount-of-elements.json');
            var elements = Exonum.merkleProof(
                data.root_hash,
                data.list_length,
                data.proof,
                [data.range_st, data.range_end - 1]
            );
            expect(elements).to.equal(undefined);
        });

    });

    /*
     Exonum.merklePatriciaProof
     */
    describe('Check proof of Merkle Patricia tree', function() {

        it('should return null when an empty tree', function() {
            var data = require('./common_data/merkle-patricia-tree/valid-merkle-patricia-tree-empty-tree.json');
            var element = Exonum.merklePatriciaProof(
                data.root_hash,
                data.proof,
                data.searched_key
            );
            expect(element).to.equal(null);
        });

        it('should return null when valid tree with leaf exclusive', function() {
            var data = require('./common_data/merkle-patricia-tree/valid-merkle-patricia-tree-leaf-exclusive.json');
            var element = Exonum.merklePatriciaProof(
                data.root_hash,
                data.proof,
                data.searched_key
            );
            expect(element).to.equal(null);
        });

        it('should return the child of valid tree with leaf inclusive', function() {
            var data = require('./common_data/merkle-patricia-tree/valid-merkle-patricia-tree-leaf-inclusive.json');
            var element = Exonum.merklePatriciaProof(
                data.root_hash,
                data.proof,
                data.searched_key
            );
            expect(element).to.deep.equal([2]);
        });

        it('should return null when a tree with nested node exclusive', function() {
            var data = require('./common_data/merkle-patricia-tree/valid-merkle-patricia-tree-nested-exclusive.json');
            var element = Exonum.merklePatriciaProof(
                data.root_hash,
                data.proof,
                data.searched_key
            );
            expect(element).to.equal(null);
        });

        it('should return the child of an valid tree with nested node inclusive', function() {
            var data = require('./common_data/merkle-patricia-tree/valid-merkle-patricia-tree-nested-inclusive.json');
            var element = Exonum.merklePatriciaProof(
                data.root_hash,
                data.proof,
                data.searched_key
            );
            expect(element).to.deep.equal([36, 49, 15, 31, 163, 171, 247, 217]);
        });

        it('should return the child of an valid tree with hash stored in value', function() {
            var data = require('./common_data/merkle-patricia-tree/valid-merkle-patricia-tree-with-hashes-as-values.json');
            var element = Exonum.merklePatriciaProof(
                data.root_hash,
                data.proof,
                data.searched_key
            );
            expect(element).to.equal('d7897e2f9d336f6ef53315f26c720193c5c22854850c6d66c380d05172e92acd');
        });

        it('should return undefined when invalid rootHash parameter', function() {
            var args = [
                '6z56f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1',
                true, null, undefined, [], {}, 42, new Date()
            ];

            function test(rootHash) {
                expect(Exonum.merklePatriciaProof(rootHash)).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when invalid proofNode parameter', function() {
            var args = [
                true, null, undefined, [], 42, 'Hello world', new Date()
            ];

            function test(proofNode) {
                expect(Exonum.merklePatriciaProof('6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13', proofNode)).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when invalid byte array key parameter', function() {
            var args = [
                [1, 114],
                [1, true, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0],
                [1, null, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0],
                [1, undefined, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0],
                [1, {}, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0],
                [1, new Date(), 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0],
                [1, 256, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0],
                [1, -1, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0]
            ];

            function test(key) {
                expect(Exonum.merklePatriciaProof(
                    '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                    {},
                    key
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when invalid string key parameter', function() {
            var args = [
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1',
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1z',
                ''
            ];

            function test(key) {
                expect(Exonum.merklePatriciaProof(
                    '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                    {},
                    key
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when key parameter of wrong type', function() {
            var args = [
                true, null, undefined, 42, [], {}, new Date()
            ];

            function test(key) {
                expect(Exonum.merklePatriciaProof(
                    '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                    {},
                    key
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when root is empty but rootHash is wrong', function() {
            var elements = Exonum.merklePatriciaProof(
                '0000000000000000000000000000000000000000000000000000000000000001',
                {},
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);
        });

        it('should return undefined when key of node is invalid binary string', function() {
            var elements;

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '11110000111100': {}
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001a': {}
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110013': {}
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);
        });

        it('should return undefined when it is invalid hash is value of tree node', function() {
            var args = [
                '',
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1',
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1z'
            ];

            function test(val) {
                expect(Exonum.merklePatriciaProof(
                    '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                    {
                        '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': val
                    },
                    '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when wrong rootHash parameter is passed (element is not found)', function() {
            var elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);
        });

        it('should return undefined when invalid key with hash is in the root (element is not found)', function() {
            var elements = Exonum.merklePatriciaProof(
                '335ec501d811725a9e60f89a1b67103e6fa5e65712a007ed33324719a6e2de3a',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
                },
                'f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3'
            );
            expect(elements).to.equal(undefined);
        });

        it('should return undefined when value is of invalid type', function() {
            var args = [
                false, null, undefined, 'Hello world', 42, new Date()
            ];

            function test(val) {
                expect(Exonum.merklePatriciaProof(
                    '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                    {
                        '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
                            val: val
                        }
                    },
                    '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when invalid bytes array is on value position', function() {
            var args = [
                [1, 'a', 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
                [1, -1, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
                [1, 256, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]
            ];

            function test(val) {
                expect(Exonum.merklePatriciaProof(
                    '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                    {
                        '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
                            val: val
                        }
                    },
                    '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when invalid value type', function() {
            var args = [
                false, undefined, [], 42, new Date()
            ];

            function test(val) {
                expect(Exonum.merklePatriciaProof(
                    '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                    {
                        '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': val
                    },
                    '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when invalid type parameter', function() {
            var args = [
                null, false, 42, {}, [], new Date()
            ];

            function test(type) {
                expect(Exonum.merklePatriciaProof(
                    '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                    {
                        '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
                            val: {
                                name: 'John',
                                surname: 'Doe'
                            }
                        }
                    },
                    '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                    type
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when single node tree with wrong type parameter', function() {
            var elements;
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 8}}
            });

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
                        val: {
                            name: 'John',
                            surname: 'Doe'
                        }
                    }
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                Type
            );
            expect(elements).to.equal(undefined);
        });

        it('should return undefined when single node tree with rootHash parameter not equal to actual hash (element is found)', function() {
            var elements;
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 8}}
            });

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
                        val: {
                            balance: 4096
                        }
                    }
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                Type
            );
            expect(elements).to.equal(undefined);
        });

        it('should return undefined when single node tree with invalid key with value in the root (element is found)', function() {
            var elements;
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 8}}
            });

            elements = Exonum.merklePatriciaProof(
                '8cc79fea15327c3d6b11b8427ea0ea0a975fae454fbca696da03a033498cee05',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
                        val: {
                            balance: 4096
                        }
                    }
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                Type
            );
            expect(elements).to.equal(undefined);
        });

        it('should return undefined when single node tree with invalid key in the root of proofNode parameter', function() {
            var elements;

            elements = Exonum.merklePatriciaProof(
                '8be78622dc7fd18b069a226133f1e943652bc5d53fd5df3d59735f49da1df692',
                {
                    "1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110": "dbc1b4c900ffe48d575b5da5c638040125f65db0fe3e24494b76ea986457d986"
                },
                'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
            );
            expect(elements).to.equal(undefined);
        });

        it('should return undefined when single node tree with invalid key with value in the root', function() {
            var elements;

            elements = Exonum.merklePatriciaProof(
                '8be78622dc7fd18b069a226133f1e943652bc5d53fd5df3d59735f49da1df692',
                {
                    "1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110": {
                        "val": [
                            2
                        ]
                    }
                },
                'f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4'
            );
            expect(elements).to.equal(undefined);
        });

        it('should return undefined when invalid number of children in the root node', function() {
            var elements = Exonum.merklePatriciaProof(
                '0000000000000000000000000000000000000000000000000000000000000001',
                {
                    '1': '',
                    '2': '',
                    '3': ''
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);
        });

        it('should return null when tree with array as key parameter is passed ', function() {
            var elements = Exonum.merklePatriciaProof(
                '8be78622dc7fd18b069a226133f1e943652bc5d53fd5df3d59735f49da1df692',
                {
                    "1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110": "dbc1b4c900ffe48d575b5da5c638040125f65db0fe3e24494b76ea986457d986"
                },
                [244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244]
            );
            expect(elements).to.equal(null);
        });

        it('should return undefined when wrong rootHash parameter', function() {
            var data = require('./data/invalid-merkle-patricia-tree-wrong-root-hash.json');
            var element = Exonum.merklePatriciaProof(
                data.root_hash,
                data.proof,
                data.searched_key
            );
            expect(element).to.deep.equal(undefined);
        });

        it('should return undefined when invalid binary key', function() {
            var element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '12323': {},
                    '5927': {}
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);
        });

        it('should return undefined when tree contains non full key and value of wrong type', function() {
            var args = [
                true, null, undefined, [], 42, new Date()
            ];

            function test(val) {
                expect(Exonum.merklePatriciaProof(
                    '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                    {
                        '0': val,
                        '1': {}
                    },
                    '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when tree contains full key and value of wrong type', function() {
            var args = [
                true, null, undefined, [], 42, new Date()
            ];

            function test(val) {
                expect(Exonum.merklePatriciaProof(
                    '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                    {
                        '0011001010001111110000101101101011111110000101010111001100101110011110010011110000111001011111111011110110100101111111111110111001110011111110011111001110011110111100001100100101110011010010111111011110001001000010000110000001000101101111100000101010100': val,
                        '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                    },
                    '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when tree contains non full key and invalid hash', function() {
            var args = [
                'Hello world',
                'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6ez',
                ''
            ];

            function test(val) {
                expect(Exonum.merklePatriciaProof(
                    '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                    {
                        '0': val,
                        '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                    },
                    '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when tree contains full key and invalid hash', function() {
            var args = [
                'Hello world',
                'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6ez',
                ''
            ];

            function test(val) {
                expect(Exonum.merklePatriciaProof(
                    '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                    {
                        '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': val,
                        '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                    },
                    '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when tree contains full key and missed value', function() {
            var element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
                        'age': 5
                    },
                    '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);
        });

        it('should return undefined when tree contains full key and duplicated value', function() {
            var element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
                        val: [25, 13]
                    },
                    '0110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
                        val: [71]
                    }
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);
        });

        it('should return undefined when tree contains non full key and value on wrong position', function() {
            var element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '011001101': {
                        val: [25, 13]
                    },
                    '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);
        });

        it('should return undefined when tree contains key is of wrong length', function() {
            var element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6',
                    '11100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101': {
                        val: [25, 13]
                    }
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);
        });

        it('should return undefined when tree contains full key and value of wrong type', function() {
            var args = [
                false, null, 42, 'Hello world'
            ];

            function test(val) {
                expect(Exonum.merklePatriciaProof(
                    '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                    {
                        '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
                            val: val
                        },
                        '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                    },
                    '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when tree contains full key and value as invalid binary array', function() {
            var args = [
                [false], [null], [257], ['Hello world'], [[]], [{}], [new Date()]
            ];

            function test(val) {
                expect(Exonum.merklePatriciaProof(
                    '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                    {
                        '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
                            val: val
                        },
                        '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                    },
                    '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
                )).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when tree contains full key and wrong type parameter', function() {
            var Wallet = Exonum.newType({
                size: 80,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_hash: {type: Exonum.Hash, size: 32, from: 48, to: 80}
                }
            });
            var element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
                        val: {
                            name: 'John',
                            surname: 'Doe'
                        }
                    },
                    '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3',
                Wallet
            );
            expect(element).to.deep.equal(undefined);
        });

        it('should return undefined when tree contains non full key and wrong type parameter', function() {
            var Wallet = Exonum.newType({
                size: 80,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_hash: {type: Exonum.Hash, size: 32, from: 48, to: 80}
                }
            });
            var element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '111': {
                        '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6',
                        '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100': {
                            val: {
                                name: 'John',
                                surname: 'Doe'
                            }
                        }
                    },
                    '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3',
                Wallet
            );
            expect(element).to.deep.equal(undefined);
        });

        it('should return undefined when tree contains duplicated left leaf', function() {
            var element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '111': {
                        '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6',
                        '0110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100': {
                            val: [255, 0, 5]
                        }
                    },
                    '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);
        });

        it('should return undefined when tree contains duplicated right leaf', function() {
            var element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '111': {
                        '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6',
                        '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100': {
                            val: [255, 0, 5]
                        }
                    },
                    '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);
        });

        it('should return undefined when tree contains left key which is part of search key but branch is not expanded', function() {
            var element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '111': {
                        "01111111010111000100100111101010110010111100011010100000100111111110101011011000011000000000100001000100000101101101100010101110110101101010001100000101110100011101101111100100101110100110010011011100011111011010110010100011111011010011000101111011010": "9be1fdaa5e58640e6c17dba7e734c56ec7ccab77f823933301661e3514284dd7",
                        "11111111010111000100100111101010110010111100011010100000100110111110101011011000011000000000100001000100000101101101100010101110110101101010001100000101110100011101101111100100101110100110010011011100011111011010110010100011111011010011000101111011010": "9be1fdaa5e58640e6c17dba7e734c56ec7ccab77f823933301661e3514284dd7",
                    },
                    '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                'ecdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdc'
            );
            expect(element).to.equal(undefined);
        });

        it('should return undefined when tree contains right key which is part of search key but branch is not expanded', function() {
            var element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '111': {
                        "01111111010111000100100111101010110010111100011010100000100111111110101011011000011000000000100001000100000101101101100010101110110101101010001100000101110100011101101111100100101110100110010011011100011111011010110010100011111011010011000101111011010": "9be1fdaa5e58640e6c17dba7e734c56ec7ccab77f823933301661e3514284dd7",
                        "11111111010111000100100111101010110010111100011010100000100110111110101011011000011000000000100001000100000101101101100010101110110101101010001100000101110100011101101111100100101110100110010011011100011111011010110010100011111011010011000101111011010": "9be1fdaa5e58640e6c17dba7e734c56ec7ccab77f823933301661e3514284dd7",
                    },
                    '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                'fcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdc'
            );
            expect(element).to.equal(undefined);
        });

    });

    /*
     Exonum.verifyBlock
     */
    describe('Verify block of precommits', function() {

        var validators = [
            "eb7e3ad55f97e5d5693fe0e69f4c26bd1173077dbffb5fff5b69f213f71bee3f",
            "3d17702a3f260ccf0d171279ceee74dc7309049e11bfd13d839f66f867f2d504",
            "612bc36d1de16541b40ee468157f1aeb3cf709347e32654b730e1f970dc20edd",
            "3016901f539f794dcc4c2466be14678b30c5d503107a2fc8bbed4680a306b177"
        ];

        it('should return true when valid block with precommits', function() {
            var data = require('./common_data/block-with-precommits/valid-block-with-precommits.json');
            expect(Exonum.verifyBlock(data, validators)).to.equal(true);
        });

        it('should return false when data of wrong type', function() {
            expect(Exonum.verifyBlock(null, validators)).to.equal(false);
            expect(Exonum.verifyBlock(undefined, validators)).to.equal(false);
            expect(Exonum.verifyBlock(42, validators)).to.equal(false);
            expect(Exonum.verifyBlock('Hello world', validators)).to.equal(false);
            expect(Exonum.verifyBlock([], validators)).to.equal(false);
            expect(Exonum.verifyBlock(new Date(), validators)).to.equal(false);
        });

        it('should return false when block info of wrong type', function() {
            expect(Exonum.verifyBlock({}, validators)).to.equal(false);
            expect(Exonum.verifyBlock({block: null}, validators)).to.equal(false);
            expect(Exonum.verifyBlock({block: undefined}, validators)).to.equal(false);
            expect(Exonum.verifyBlock({block: 'Hello world'}, validators)).to.equal(false);
            expect(Exonum.verifyBlock({block: []}, validators)).to.equal(false);
            expect(Exonum.verifyBlock({block: 42}, validators)).to.equal(false);
            expect(Exonum.verifyBlock({block: new Date()}, validators)).to.equal(false);
        });

        it('should return false when precommits info of wrong type', function() {
            expect(Exonum.verifyBlock({block: {}}, validators)).to.equal(false);
            expect(Exonum.verifyBlock({block: {}, precommits: null}, validators)).to.equal(false);
            expect(Exonum.verifyBlock({block: {}, precommits: undefined}, validators)).to.equal(false);
            expect(Exonum.verifyBlock({block: {}, precommits: 'Hello world'}, validators)).to.equal(false);
            expect(Exonum.verifyBlock({block: {}, precommits: {}}, validators)).to.equal(false);
            expect(Exonum.verifyBlock({block: {}, precommits: 42}, validators)).to.equal(false);
            expect(Exonum.verifyBlock({block: {}, precommits: new Date()}, validators)).to.equal(false);
        });

        it('should return false when body field of wrong type in precommit', function() {
            var args = [
                null, 42, 'Hello world', [], new Date()
            ];

            function test(body) {
                expect(Exonum.verifyBlock({
                    block: {},
                    precommits: [{
                        body: body
                    }]
                }, validators)).to.equal(false);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return false when signature field of wrong type in precommit', function() {
            var args = [
                null, undefined, 42, [], {}, new Date()
            ];

            function test(signature) {
                expect(Exonum.verifyBlock({
                    block: {},
                    precommits: [{
                        body: {},
                        signature: signature
                    }]
                }, validators)).to.equal(false);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return false when invalid signature field in precommit', function() {
            var args = [
                '22635e36303ff3ef4c86b855e57356f41483e6637136d1d2ec46ba2ec8f69fb9',
                '22635e36303ff3ef4c86b855e57356f41483e6637136d1d2ec46ba2ec8f69fb922635e36303ff3ef4c86b855e57356f41483e6637136d1d2ec46ba2ec8f69fbz'
            ];

            function test(signature) {
                expect(Exonum.verifyBlock({
                    block: {},
                    precommits: [{
                        body: {},
                        signature: signature
                    }]
                }, validators)).to.equal(false);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return false when precommit from non existed validator', function() {
            expect(Exonum.verifyBlock({
                block: {},
                precommits: [{
                    body: {
                        validator: 999999999
                    },
                    signature: '63b8341b82f0eb6f32be73bf36a4b605655e3979030df9e025713c972d1da6d263b8341b82f0eb6f32be73bf36a4b605655e3979030df9e025713c972d1da6d2'
                }]
            }, validators)).to.equal(false);
        });

        it('should return false when wrong height of block in precommit', function() {
            expect(Exonum.verifyBlock({
                block: {
                    height: 1
                },
                precommits: [{
                    body: {
                        height: 5,
                        validator: 0
                    },
                    signature: '63b8341b82f0eb6f32be73bf36a4b605655e3979030df9e025713c972d1da6d263b8341b82f0eb6f32be73bf36a4b605655e3979030df9e025713c972d1da6d2'
                }]
            }, validators)).to.equal(false);
        });

        it('should return false when wrong hash of block in precommit', function() {
            expect(Exonum.verifyBlock({
                    "block": {
                        "height": "5",
                        "propose_round": 3,
                        "time": "1487008150005000000",
                        "prev_hash": "fe5c606da552b2a3ad0ff8ef400a7071e9e72ab3b5f5c2996416ceb86c7f2c1e",
                        "tx_hash": "136c7952ed9f26b477797c23cf3d02faa46863ecc70d595b0b227027aacd0f94",
                        "state_hash": "bea2a1defd3b2ab410a1f501805d10ad94d30a5b5a1240574cade1553a60e189"
                    },
                    "precommits": [
                        {
                            "body": {
                                "validator": 0,
                                "height": "5",
                                "round": 3,
                                "propose_hash": "1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a",
                                "block_hash": "1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a"
                            },
                            "signature": "4616ef4bfac86c8ded9aa9c7e84958574e3f9df4f7aadea8b37dcdb40ebedd8ac009f8a9b54bd907bf4f43289bfec72e47e6338912f282a6b5a5ce8c558ef50b"
                        },
                        {
                            "body": {
                                "validator": 2,
                                "height": "5",
                                "round": 3,
                                "propose_hash": "1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a",
                                "block_hash": "1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a"
                            },
                            "signature": "5253cba87af1abac95c7c92f06b2b286af84353fd060ea1069f107094d97298473fe6431613c3e2d02d92624c82394b86cec047cd681e0f3fc98f0f877383a04"
                        },
                        {
                            "body": {
                                "validator": 3,
                                "height": "5",
                                "round": 3,
                                "propose_hash": "1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a",
                                "block_hash": "1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a"
                            },
                            "signature": "e35a3cb1ca834cce77d67d5945ef1d7021488a357a35e973cd1ef17099d4db55a28123d95f9c5dcedf34c86a12c20e91cc47622612039115f2a376d7e5f7ab00"
                        }
                    ]
                }, validators
            )).to.equal(false);
        });

        it('should return false when wrong round in precommit', function() {
            expect(Exonum.verifyBlock({
                    "block": {
                        "height": "5",
                        "propose_round": 3,
                        "time": "1487008150005000000",
                        "prev_hash": "fe5c606da552b2a3ad0ff8ef400a7071e9e72ab3b5f5c2996416ceb86c7f2c1e",
                        "tx_hash": "136c7952ed9f26b477797c23cf3d02faa46863ecc70d595b0b227027aacd0f94",
                        "state_hash": "bea2a1defd3b2ab410a1f501805d10ad94d30a5b5a1240574cade1553a60e189"
                    },
                    "precommits": [
                        {
                            "body": {
                                "validator": 0,
                                "height": "5",
                                "round": 3,
                                "propose_hash": "1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a",
                                "block_hash": "c2513f88478a32767c3cf7c068d60523212a005374d8d7398473c9601bf3d369"
                            },
                            "signature": "4616ef4bfac86c8ded9aa9c7e84958574e3f9df4f7aadea8b37dcdb40ebedd8ac009f8a9b54bd907bf4f43289bfec72e47e6338912f282a6b5a5ce8c558ef50b"
                        },
                        {
                            "body": {
                                "validator": 2,
                                "height": "5",
                                "round": 3,
                                "propose_hash": "1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a",
                                "block_hash": "c2513f88478a32767c3cf7c068d60523212a005374d8d7398473c9601bf3d369"
                            },
                            "signature": "5253cba87af1abac95c7c92f06b2b286af84353fd060ea1069f107094d97298473fe6431613c3e2d02d92624c82394b86cec047cd681e0f3fc98f0f877383a04"
                        },
                        {
                            "body": {
                                "validator": 1,
                                "height": "5",
                                "round": 7,
                                "propose_hash": "1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a",
                                "block_hash": "c2513f88478a32767c3cf7c068d60523212a005374d8d7398473c9601bf3d369"
                            },
                            "signature": "fc7d8d9150db263f03cb8a141b6a372a0bed1fa21128907b52485ad37ea19e71342ebbd8f80e76c81e42d125e3a2e4e15189212f6f78a307005c63c0eade6c06"
                        }
                    ]
                }, validators
            )).to.equal(false);
        });

        it('should return false when wrong signature of precommit', function() {
            expect(Exonum.verifyBlock({
                    "block": {
                        "height": "5",
                        "propose_round": 3,
                        "time": "1487008150005000000",
                        "prev_hash": "fe5c606da552b2a3ad0ff8ef400a7071e9e72ab3b5f5c2996416ceb86c7f2c1e",
                        "tx_hash": "136c7952ed9f26b477797c23cf3d02faa46863ecc70d595b0b227027aacd0f94",
                        "state_hash": "bea2a1defd3b2ab410a1f501805d10ad94d30a5b5a1240574cade1553a60e189"
                    },
                    "precommits": [
                        {
                            "body": {
                                "validator": 0,
                                "height": "5",
                                "round": 3,
                                "propose_hash": "1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a",
                                "block_hash": "c2513f88478a32767c3cf7c068d60523212a005374d8d7398473c9601bf3d369"
                            },
                            "signature": "5616ef4bfac86c8ded9aa9c7e84958574e3f9df4f7aadea8b37dcdb40ebedd8ac009f8a9b54bd907bf4f43289bfec72e47e6338912f282a6b5a5ce8c558ef50b"
                        }
                    ]
                }, validators
            )).to.equal(false);
        });

        it('should return false when insufficient precommits from unique validators', function() {
            expect(Exonum.verifyBlock({
                    "block": {
                        "height": "5",
                        "propose_round": 3,
                        "time": "1487008150005000000",
                        "prev_hash": "fe5c606da552b2a3ad0ff8ef400a7071e9e72ab3b5f5c2996416ceb86c7f2c1e",
                        "tx_hash": "136c7952ed9f26b477797c23cf3d02faa46863ecc70d595b0b227027aacd0f94",
                        "state_hash": "bea2a1defd3b2ab410a1f501805d10ad94d30a5b5a1240574cade1553a60e189"
                    },
                    "precommits": [
                        {
                            "body": {
                                "validator": 0,
                                "height": "5",
                                "round": 3,
                                "propose_hash": "1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a",
                                "block_hash": "c2513f88478a32767c3cf7c068d60523212a005374d8d7398473c9601bf3d369"
                            },
                            "signature": "4616ef4bfac86c8ded9aa9c7e84958574e3f9df4f7aadea8b37dcdb40ebedd8ac009f8a9b54bd907bf4f43289bfec72e47e6338912f282a6b5a5ce8c558ef50b"
                        }
                    ]
                }, validators
            )).to.equal(false);
        });

        it('should return false when validators of wrong type', function() {
            var block = {
                "block": {
                    "height": "5",
                    "propose_round": 3,
                    "time": "1487008150005000000",
                    "prev_hash": "fe5c606da552b2a3ad0ff8ef400a7071e9e72ab3b5f5c2996416ceb86c7f2c1e",
                    "tx_hash": "136c7952ed9f26b477797c23cf3d02faa46863ecc70d595b0b227027aacd0f94",
                    "state_hash": "bea2a1defd3b2ab410a1f501805d10ad94d30a5b5a1240574cade1553a60e189"
                },
                "precommits": [
                    {
                        "body": {
                            "validator": 0,
                            "height": "5",
                            "round": 3,
                            "propose_hash": "1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a",
                            "block_hash": "c2513f88478a32767c3cf7c068d60523212a005374d8d7398473c9601bf3d369"
                        },
                        "signature": "4616ef4bfac86c8ded9aa9c7e84958574e3f9df4f7aadea8b37dcdb40ebedd8ac009f8a9b54bd907bf4f43289bfec72e47e6338912f282a6b5a5ce8c558ef50b"
                    },
                    {
                        "body": {
                            "validator": 2,
                            "height": "5",
                            "round": 3,
                            "propose_hash": "1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a",
                            "block_hash": "c2513f88478a32767c3cf7c068d60523212a005374d8d7398473c9601bf3d369"
                        },
                        "signature": "5253cba87af1abac95c7c92f06b2b286af84353fd060ea1069f107094d97298473fe6431613c3e2d02d92624c82394b86cec047cd681e0f3fc98f0f877383a04"
                    },
                    {
                        "body": {
                            "validator": 3,
                            "height": "5",
                            "round": 3,
                            "propose_hash": "1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a",
                            "block_hash": "c2513f88478a32767c3cf7c068d60523212a005374d8d7398473c9601bf3d369"
                        },
                        "signature": "e35a3cb1ca834cce77d67d5945ef1d7021488a357a35e973cd1ef17099d4db55a28123d95f9c5dcedf34c86a12c20e91cc47622612039115f2a376d7e5f7ab00"
                    }
                ]
            };

            expect(Exonum.verifyBlock(block, [])).to.equal(false);

            expect(Exonum.verifyBlock(block, [true])).to.equal(false);

            expect(Exonum.verifyBlock(block, [undefined])).to.equal(false);

            expect(Exonum.verifyBlock(block, [null])).to.equal(false);

            expect(Exonum.verifyBlock(block, [42])).to.equal(false);

            expect(Exonum.verifyBlock(block, [{}])).to.equal(false);

            expect(Exonum.verifyBlock(block, [[]])).to.equal(false);

            expect(Exonum.verifyBlock(block, [new Date()])).to.equal(false);

            expect(Exonum.verifyBlock(block, ['asda123'])).to.equal(false);

            expect(Exonum.verifyBlock(block, ['eb7e3ad55f97e5d5693fe0e69f4c26bd1173077dbffb5fff5b69f213f71bee3f'])).to.equal(false);
        });

    });

    /*
     Exonum.keyPair
     */
    describe('Generate key pair', function() {

        it('should generate random key pair of secret and public keys, serialize it and return serialized array', function() {
            var Type = Exonum.newType({
                size: 96,
                fields: {
                    publicKey: {type: Exonum.Hash, size: 32, from: 0, to: 32},
                    secretKey: {type: Exonum.Digest, size: 64, from: 32, to: 96}
                }
            });
            var data = Exonum.keyPair();
            var buffer = Type.serialize(data);

            expect(buffer.length).to.equal(96);
        });

    });

    /*
     Exonum.randomUint64
     */
    describe('Generate random Uint64', function() {

        it('should generate random value if Uint64 type, serialize and return serialized array', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Uint64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: Exonum.randomUint64()};
            var buffer = Type.serialize(data);

            expect(buffer.length).to.equal(8);
        });

    });

    /*
     -------------------------------------------------------------------------------------------------------------------
     Cryptocurrency tests
     -------------------------------------------------------------------------------------------------------------------
     */

    describe('Check cryptocurrency wallet', function() {

        it('should serialize wallets data and compare its hash with passed', function() {
            var data = require('./common_data/cryptocurrency-wallet/valid-wallet-1.json');
            var Wallet = Exonum.newType({
                size: 88,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_len: {type: Exonum.Uint64, size: 8, from: 48, to: 56},
                    history_hash: {type: Exonum.Hash, size: 32, from: 56, to: 88}
                }
            });

            expect(Exonum.hash(data.wallet, Wallet)).to.equal(data.hash);
        });

        it('should serialize wallets data and compare its hash with passed', function() {
            var data = require('./common_data/cryptocurrency-wallet/valid-wallet-2.json');
            var Wallet = Exonum.newType({
                size: 88,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_len: {type: Exonum.Uint64, size: 8, from: 48, to: 56},
                    history_hash: {type: Exonum.Hash, size: 32, from: 56, to: 88}
                }
            });

            expect(Exonum.hash(data.wallet, Wallet)).to.equal(data.hash);
        });

        it('should serialize wallets data and compare its hash with passed', function() {
            var data = require('./common_data/cryptocurrency-wallet/valid-wallet-3.json');
            var Wallet = Exonum.newType({
                size: 88,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_len: {type: Exonum.Uint64, size: 8, from: 48, to: 56},
                    history_hash: {type: Exonum.Hash, size: 32, from: 56, to: 88}
                }
            });

            expect(Exonum.hash(data.wallet, Wallet)).to.equal(data.hash);
        });

        it('should serialize wallets data, compare its serialized array and compare its hash', function() {
            var data = require('./common_data/cryptocurrency-wallet/valid-wallet-with-raw-1.json');
            var Wallet = Exonum.newType({
                size: 88,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_len: {type: Exonum.Uint64, size: 8, from: 48, to: 56},
                    history_hash: {type: Exonum.Hash, size: 32, from: 56, to: 88}
                }
            });

            expect(Wallet.serialize(data.wallet)).to.deep.equal(data.raw);

            expect(Exonum.hash(data.wallet, Wallet)).to.equal(data.hash);
        });

        it('should serialize wallets data, compare its serialized array and compare its hash', function() {
            var data = require('./common_data/cryptocurrency-wallet/valid-wallet-with-raw-2.json');
            var Wallet = Exonum.newType({
                size: 88,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_len: {type: Exonum.Uint64, size: 8, from: 48, to: 56},
                    history_hash: {type: Exonum.Hash, size: 32, from: 56, to: 88}
                }
            });

            expect(Wallet.serialize(data.wallet)).to.deep.equal(data.raw);

            expect(Exonum.hash(data.wallet, Wallet)).to.equal(data.hash);
        });

        it('should serialize wallets data contained utf-8 name, compare its serialized array and compare its hash', function() {
            var data = require('./common_data/cryptocurrency-wallet/valid-wallet-with-utf8-and-raw.json');
            var Wallet = Exonum.newType({
                size: 88,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_len: {type: Exonum.Uint64, size: 8, from: 48, to: 56},
                    history_hash: {type: Exonum.Hash, size: 32, from: 56, to: 88}
                }
            });

            expect(Wallet.serialize(data.wallet)).to.deep.equal(data.raw);

            expect(Exonum.hash(data.wallet, Wallet)).to.equal(data.hash);
        });

    });

    describe('Check cryptocurrency transactions', function() {

        it('should create Create Wallet Transaction of class newMessage, check equality of its serialization and hash, and verify its signature', function() {
            var data = require('./common_data/cryptocurrency-transaction/create-wallet-with-raw.json');
            var TxCreateWallet = Exonum.newMessage({
                size: 40,
                service_id: 128,
                message_id: data.transaction.message_id,
                signature: data.transaction.signature,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40}
                }
            });

            expect(TxCreateWallet.serialize(data.transaction.body)).to.deep.equal(data.raw);

            expect(Exonum.hash(data.transaction.body, TxCreateWallet)).to.equal(data.hash);

            expect(Exonum.verifySignature(data.transaction.body, TxCreateWallet, data.transaction.signature, data.transaction.body.pub_key)).to.equal(true);
        });

        it('should create Create Wallet Transaction of class newMessage with UTF-8 encoded name of wallet, check equality of its serialization and hash, and verify its signature', function() {
            var data = require('./common_data/cryptocurrency-transaction/create-wallet-with-utf8-and-raw.json');
            var TxCreateWallet = Exonum.newMessage({
                size: 40,
                service_id: 128,
                message_id: data.transaction.message_id,
                signature: data.transaction.signature,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40}
                }
            });

            expect(TxCreateWallet.serialize(data.transaction.body)).to.deep.equal(data.raw);

            expect(Exonum.hash(data.transaction.body, TxCreateWallet)).to.equal(data.hash);

            expect(Exonum.verifySignature(data.transaction.body, TxCreateWallet, data.transaction.signature, data.transaction.body.pub_key)).to.equal(true);
        });

        it('should create Add Funds Transaction #1 of class newMessage, check equality of its serialization and hash, and verify its signature', function() {
            var data = require('./common_data/cryptocurrency-transaction/charge-with-raw-1.json');
            var TxIssue = Exonum.newMessage({
                size: 48,
                service_id: 128,
                message_id: data.transaction.message_id,
                signature: data.transaction.signature,
                fields: {
                    wallet: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    amount: {type: Exonum.Int64, size: 8, from: 32, to: 40},
                    seed: {type: Exonum.Uint64, size: 8, from: 40, to: 48}
                }
            });

            expect(TxIssue.serialize(data.transaction.body)).to.deep.equal(data.raw);

            expect(Exonum.hash(data.transaction.body, TxIssue)).to.equal(data.hash);

            expect(Exonum.verifySignature(data.transaction.body, TxIssue, data.transaction.signature, data.transaction.body.wallet)).to.equal(true);
        });

        it('should create Add Funds Transaction #2 of class newMessage, check equality of its serialization and hash, and verify its signature', function() {
            var data = require('./common_data/cryptocurrency-transaction/charge-with-raw-2.json');
            var TxIssue = Exonum.newMessage({
                size: 48,
                service_id: 128,
                message_id: data.transaction.message_id,
                signature: data.transaction.signature,
                fields: {
                    wallet: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    amount: {type: Exonum.Int64, size: 8, from: 32, to: 40},
                    seed: {type: Exonum.Uint64, size: 8, from: 40, to: 48}
                }
            });

            expect(TxIssue.serialize(data.transaction.body)).to.deep.equal(data.raw);

            expect(Exonum.hash(data.transaction.body, TxIssue)).to.equal(data.hash);

            expect(Exonum.verifySignature(data.transaction.body, TxIssue, data.transaction.signature, data.transaction.body.wallet)).to.equal(true);
        });

        it('should create Transfer Transaction #1 of class newMessage, check equality of its serialization and hash, and verify its signature', function() {
            var data = require('./common_data/cryptocurrency-transaction/transfer-with-raw-1.json');
            var TxTransfer = Exonum.newMessage({
                size: 80,
                service_id: 128,
                message_id: data.transaction.message_id,
                signature: data.transaction.signature,
                fields: {
                    from: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    to: {type: Exonum.PublicKey, size: 32, from: 32, to: 64},
                    amount: {type: Exonum.Int64, size: 8, from: 64, to: 72},
                    seed: {type: Exonum.Uint64, size: 8, from: 72, to: 80}
                }
            });

            expect(TxTransfer.serialize(data.transaction.body)).to.deep.equal(data.raw);

            expect(Exonum.hash(data.transaction.body, TxTransfer)).to.equal(data.hash);

            expect(Exonum.verifySignature(data.transaction.body, TxTransfer, data.transaction.signature, data.transaction.body.from)).to.equal(true);
        });

        it('should create Transfer Transaction #2 of class newMessage, check equality of its serialization and hash, and verify its signature', function() {
            var data = require('./common_data/cryptocurrency-transaction/transfer-with-raw-2.json');
            var TxTransfer = Exonum.newMessage({
                size: 80,
                service_id: 128,
                message_id: data.transaction.message_id,
                signature: data.transaction.signature,
                fields: {
                    from: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    to: {type: Exonum.PublicKey, size: 32, from: 32, to: 64},
                    amount: {type: Exonum.Int64, size: 8, from: 64, to: 72},
                    seed: {type: Exonum.Uint64, size: 8, from: 72, to: 80}
                }
            });

            expect(TxTransfer.serialize(data.transaction.body)).to.deep.equal(data.raw);

            expect(Exonum.hash(data.transaction.body, TxTransfer)).to.equal(data.hash);

            expect(Exonum.verifySignature(data.transaction.body, TxTransfer, data.transaction.signature, data.transaction.body.from)).to.equal(true);
        });

    });

    describe('Check wallet query', function() {

        var validators = [
            "8db92e93847f66f62f7c0f9f6516ede8c466bf316d78cea23481857c0706823c",
            "9bf83e5fc18432ea36aa222674677f38da1fcf72fc8a5111d382a8b9bc318b6f",
            "b60daa6973aa0f1992d669ed3b7a0c17d6fc315c711f4c8bbe250d5ae1f09f33",
            "2ac0bf3cf5c6a27b0e9705f7890b2f50bc8ad8c304a468f04427aca2086db480"
        ];

        function getTransactionType(transaction) {
            switch (transaction.message_id) {
                case 128:
                    return Exonum.newMessage({
                        size: 80,
                        service_id: 128,
                        message_id: 128,
                        signature: transaction.signature,
                        fields: {
                            from: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                            to: {type: Exonum.PublicKey, size: 32, from: 32, to: 64},
                            amount: {type: Exonum.Int64, size: 8, from: 64, to: 72},
                            seed: {type: Exonum.Uint64, size: 8, from: 72, to: 80}
                        }
                    });
                    break;
                case 129:
                    return Exonum.newMessage({
                        size: 48,
                        service_id: 128,
                        message_id: 129,
                        signature: transaction.signature,
                        fields: {
                            wallet: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                            amount: {type: Exonum.Int64, size: 8, from: 32, to: 40},
                            seed: {type: Exonum.Uint64, size: 8, from: 40, to: 48}
                        }
                    });
                case 130:
                    return Exonum.newMessage({
                        size: 40,
                        service_id: 128,
                        message_id: 130,
                        signature: transaction.signature,
                        fields: {
                            pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                            name: {type: Exonum.String, size: 8, from: 32, to: 40}
                        }
                    });
                    break;
            }
        }

        function getTransationPublicKey(transaction) {
            switch (transaction.message_id) {
                case 128:
                    return transaction.body.from;
                    break;
                case 129:
                    return transaction.body.wallet;
                    break;
                case 130:
                    return transaction.body.pub_key;
                    break;
            }
        }

        function verifyTransaction(transaction, hash) {
            var Type = getTransactionType(transaction);
            var publicKey = getTransationPublicKey(transaction);

            if (Exonum.hash(transaction.body, Type) !== hash) {
                console.error('Wrong transaction hash.');
                return false;
            } else if (!Exonum.verifySignature(transaction.body, Type, transaction.signature, publicKey)) {
                console.error('Wrong transaction signature.');
                return false;
            }

            return true;
        }

        function getObjectLength(obj) {
            var l = 0;
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    l++;
                }
            }
            return l;
        }

        function getWallet(query, publicKey) {
            if (!Exonum.verifyBlock(query.block_info, validators)) {
                return undefined;
            }

            var TableKey = Exonum.newType({
                size: 4,
                fields: {
                    service_id: {type: Exonum.Uint16, size: 2, from: 0, to: 2},
                    table_index: {type: Exonum.Uint16, size: 2, from: 2, to: 4}
                }
            });
            var walletsTableData = {
                service_id: 128,
                table_index: 0
            };
            var walletsTableKey = Exonum.hash(walletsTableData, TableKey);
            var walletsTableRootHash = Exonum.merklePatriciaProof(query.block_info.block.state_hash, query.wallet.mpt_proof, walletsTableKey);

            if (walletsTableRootHash === null) {
                console.error('Wallets can not exist.');
                return undefined;
            }

            var Wallet = Exonum.newType({
                size: 88,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_len: {type: Exonum.Uint64, size: 8, from: 48, to: 56},
                    history_hash: {type: Exonum.Hash, size: 32, from: 56, to: 88}
                }
            });

            var wallet = Exonum.merklePatriciaProof(walletsTableRootHash, query.wallet.value, publicKey, Wallet);

            if (wallet === null) {
                // wallet not found
                return null;
            }

            var HashesOftransactions = Exonum.merkleProof(wallet.history_hash, wallet.history_len, query.wallet_history.mt_proof, [0, wallet.history_len]);
            var transactions = query.wallet_history.values;

            if (getObjectLength(transactions) !== getObjectLength(HashesOftransactions)) {
                console.error('Number of transaction hashes is not equal to transactions number.');
                return undefined;
            }

            for (var i in HashesOftransactions) {
                if (!HashesOftransactions.hasOwnProperty(i)) {
                    continue;
                } if (!verifyTransaction(transactions[i], HashesOftransactions[i])) {
                    return undefined;
                }
            }

            return {
                wallet: wallet,
                transactions: transactions
            }
        }

        it('should return null when wallets table is empty', function() {
            var data = require('./common_data/wallet-query/empty-table.json');
            var publicKey = '8f115f2a0d78f1eb102976e62dc8aa3ca7f64329f19331ed346c3d817e51fe52';

            expect(getWallet(data, publicKey)).to.equal(null);
        });

        it('should return null wallet is not found', function() {
            var data = require('./common_data/wallet-query/not-found.json');
            var publicKey = '8f115f2a0d78f1eb102976e62dc8aa3ca7f64329f19331ed346c3d817e51fe52';

            expect(getWallet(data, publicKey)).to.equal(null);
        });

        it('should return object with wallet info and transactions list', function() {
            var data = require('./common_data/wallet-query/found.json');
            var publicKey = 'd51a7976869da2b397580b8a709dba0f23e6333960143b022d947a6f09ba56a3';

            expect(getWallet(data, publicKey)).to.deep.equal({
                wallet: {
                    "balance": "4000",
                    "history_hash": "bb3b712721225155810f142f017c42039529b84911f4f08cb61fce2f9063d3ba",
                    "history_len": "4",
                    "name": "Василий Васильевич",
                    "pub_key": "d51a7976869da2b397580b8a709dba0f23e6333960143b022d947a6f09ba56a3"
                },
                transactions: [
                    {
                        "body": {
                            "name": "Василий Васильевич",
                            "pub_key": "d51a7976869da2b397580b8a709dba0f23e6333960143b022d947a6f09ba56a3"
                        },
                        "message_id": 130,
                        "service_id": 128,
                        "signature": "ddc71ec1d77c49722d4a289a5e44b416607995ed69a94361f2a0522cbfabfbd0800249d49332605d7046274388a0d419a7d57c056f581d2eca183c4c02344408"
                    },
                    {
                        "body": {
                            "amount": "6000",
                            "seed": "15776710045565509997",
                            "wallet": "d51a7976869da2b397580b8a709dba0f23e6333960143b022d947a6f09ba56a3"
                        },
                        "message_id": 129,
                        "service_id": 128,
                        "signature": "cb7bb326432d7e4224e30449f0c44e8e7d9a9630d59bdade0a4fb744f1136609cda56ed4c88001941c49f800156f0f4308e7ae2efef203c6aeb160c755828909"
                    },
                    {
                        "body": {
                            "amount": "3000",
                            "from": "d51a7976869da2b397580b8a709dba0f23e6333960143b022d947a6f09ba56a3",
                            "seed": "14077233761219583473",
                            "to": "a2cbbf9a067ed4c5bc73f3dc8417bc4cfdf46aaae79548d5b797efe578f56bb4"
                        },
                        "message_id": 128,
                        "service_id": 128,
                        "signature": "6465366bedbf52abd89706fbde85075938c211a664112fe1d3dc728a41184887fb8f2c4cf5d4ce7496fb874c9d54e90fd7799c1f0a9d227ecffcd8ead81bc404"
                    },
                    {
                        "body": {
                            "amount": "1000",
                            "from": "a2cbbf9a067ed4c5bc73f3dc8417bc4cfdf46aaae79548d5b797efe578f56bb4",
                            "seed": "6951267718330218840",
                            "to": "d51a7976869da2b397580b8a709dba0f23e6333960143b022d947a6f09ba56a3"
                        },
                        "message_id": 128,
                        "service_id": 128,
                        "signature": "bf66f40cf041011e7dd53259578dfa3849c1eb62d45191ef96571ccf753750af66c6ebc3fadc88b9943477daeedb022e0012df4716223af68f26f8c064075d04"
                    }
                ]
            });
        });

    });

});

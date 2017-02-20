var expect = require('chai').expect;
var Exonum = require('../src/index');
var fs = require('fs');

describe('Client for Exonum blockchain platform: ', function() {

    /*
     -------------------------------------------------------------------------------------------------------------------
     Cover built-in types
     -------------------------------------------------------------------------------------------------------------------
     */

    /*
     Exonum.Hash
     */
    describe('Process Hash:', function() {

        it('Input correct string of 32 bytes', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 32}}
            });
            var data = {hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 16}}
            });
            var data = {hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input invalid string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 32}}
            });
            var data = {hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3z'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input too long string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 32}}
            });
            var data = {hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input too short string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 32}}
            });
            var data = {hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input data of wrong type', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 32}}
            });
            var data;
            var buffer;

            data = {hash: true};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {hash: null};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {hash: undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {hash: 57};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {hash: []};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {hash: {}};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {hash: new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);
        });

    });

    /*
     Exonum.PublicKey
     */
    describe('Process PublicKey:', function() {

        it('Input correct string of 32 bytes', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {key: {type: Exonum.PublicKey, size: 32, from: 0, to: 16}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input invalid string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3z'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input too long string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input too short string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input data of wrong type', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32}}
            });
            var data;
            var buffer;

            data = {key: true};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {key: null};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {key: undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {key: 57};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {key: []};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {key: {}};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {key: new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);
        });

    });

    /*
     Exonum.Digest
     */
    describe('Process Digest:', function() {

        it('Input correct string of 64 bytes', function() {
            var Type = Exonum.newType({
                size: 64,
                fields: {key: {type: Exonum.Digest, size: 64, from: 0, to: 64}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54, 245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 64,
                fields: {key: {type: Exonum.Digest, size: 64, from: 0, to: 32}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input invalid string', function() {
            var Type = Exonum.newType({
                size: 64,
                fields: {key: {type: Exonum.Digest, size: 64, from: 0, to: 64}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3zf5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3z'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input too long string', function() {
            var Type = Exonum.newType({
                size: 64,
                fields: {key: {type: Exonum.Digest, size: 64, from: 0, to: 64}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input too short string', function() {
            var Type = Exonum.newType({
                size: 64,
                fields: {key: {type: Exonum.Digest, size: 64, from: 0, to: 64}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input data of wrong type', function() {
            var Type = Exonum.newType({
                size: 64,
                fields: {key: {type: Exonum.Digest, size: 64, from: 0, to: 64}}
            });
            var data;
            var buffer;

            data = {key: true};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);
            data = {key: null};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);
            data = {key: undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);
            data = {key: 57};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);
            data = {key: []};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);
            data = {key: {}};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);
            data = {key: new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);
        });

    });

    /*
     Exonum.Timespec
     */
    describe('Process Timespec:', function() {

        it('Input correct timestamp in nanoseconds', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {since: {type: Exonum.Timespec, size: 8, from: 0, to: 8}}
            });
            var data = {since: 1483979894237};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([221, 45, 24, 132, 89, 1, 0, 0]);
        });

        it('Input correct timestamp in nanoseconds as string', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {since: {type: Exonum.Timespec, size: 8, from: 0, to: 8}}
            });
            var data = {since: '18446744073709551615'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([255, 255, 255, 255, 255, 255, 255, 255]);
        });

        it('Input negative number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {since: {type: Exonum.Timespec, size: 8, from: 0, to: 8}}
            });
            var data = {since: -1483979894237};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {since: {type: Exonum.Timespec, size: 8, from: 0, to: 4}}
            });
            var data = {since: 1483979894237};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input too big number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {since: {type: Exonum.Timespec, size: 8, from: 0, to: 8}}
            });
            var data = {since: '18446744073709551616'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input data of wrong type', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {since: {type: Exonum.Timespec, size: 8, from: 0, to: 8}}
            });
            var data;
            var buffer;

            data = {since:  true};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {since:  null};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {since:  undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {since:  []};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {since:  {}};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {since:  new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);
        });

    });

    /*
     Exonum.Bool
     */
    describe('Process Bool:', function() {

        it('Input positive boolean', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {active: {type: Exonum.Bool, size: 1, from: 0, to: 1}}
            });
            var data = {active: true};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([1]);
        });

        it('Input negative boolean', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {active: {type: Exonum.Bool, size: 1, from: 0, to: 1}}
            });
            var data = {active: false};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {active: {type: Exonum.Bool, size: 1, from: 0, to: 0}}
            });
            var data = {active: true};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input data of wrong type', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {active: {type: Exonum.Bool, size: 1, from: 0, to: 1}}
            });
            var data;
            var buffer;

            data = {active: 'Hello world'};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {active: null};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {active: undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {active: 57};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {active: []};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {active: {}};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {active: new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);
        });

    });

    /*
     Exonum.String
     */
    describe('Process String:', function() {

        it('Input correct string', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {text: {type: Exonum.String, size: 8, from: 0, to: 8}}
            });
            var data = {text: 'Hello world'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([8, 0, 0, 0, 11, 0, 0, 0, 72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {text: {type: Exonum.String, size: 8, from: 0, to: 4}}
            });
            var data = {text: 'Hello world'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input data of wrong type', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {text: {type: Exonum.String, size: 8, from: 0, to: 8}}
            });
            var data;
            var buffer;

            data = {text: true};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {text: null};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {text: undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {text: 57};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {text: []};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {text: {}};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {text: new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);
        });

    });

    /*
     Exonum.Int8
     */
    describe('Process Int8:', function() {

        it('Input correct number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Int8, size: 1, from: 0, to: 1}}
            });
            var data = {balance: 120};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([120]);
        });

        it('Input correct negative number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Int8, size: 1, from: 0, to: 1}}
            });
            var data = {balance: -120};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([136]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Int8, size: 1, from: 0, to: 0}}
            });
            var data = {balance: 120};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input too big number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Int8, size: 1, from: 0, to: 1}}
            });
            var data = {balance: 130};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input too small number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Int8, size: 1, from: 0, to: 1}}
            });
            var data = {balance: -130};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input data of wrong type', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Int8, size: 1, from: 0, to: 1}}
            });
            var data;
            var buffer;

            data = {balance:  true};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  null};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  []};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  {}};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);
        });

    });

    /*
     Exonum.Int16
     */
    describe('Process Int16:', function() {

        it('Input correct number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Int16, size: 2, from: 0, to: 2}}
            });
            var data = {balance: 30767};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([47, 120]);
        });

        it('Input correct negative number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Int16, size: 2, from: 0, to: 2}}
            });
            var data = {balance: -30767};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([209, 135]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Int16, size: 2, from: 0, to: 1}}
            });
            var data = {balance: 30767};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input too big number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Int16, size: 2, from: 0, to: 2}}
            });
            var data = {balance: 32769};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input too small number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Int16, size: 2, from: 0, to: 2}}
            });
            var data = {balance: -32770};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input data of wrong type', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Int16, size: 2, from: 0, to: 2}}
            });
            var data;
            var buffer;

            data = {balance:  true};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  null};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  []};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  {}};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);
        });

    });

    /*
     Exonum.Int32
     */
    describe('Process Int32:', function() {

        it('Input correct number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Int32, size: 4, from: 0, to: 4}}
            });
            var data = {balance: 1147483647};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([255, 53, 101, 68]);
        });

        it('Input correct negative number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Int32, size: 4, from: 0, to: 4}}
            });
            var data = {balance: -1147483648};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 202, 154, 187]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Int32, size: 4, from: 0, to: 3}}
            });
            var data = {balance: 613228};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input too big number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Int32, size: 4, from: 0, to: 4}}
            });
            var data = {balance: 2147483649};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input too small number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Int32, size: 4, from: 0, to: 4}}
            });
            var data = {balance: -2147483650};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input data of wrong type', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Int32, size: 4, from: 0, to: 4}}
            });
            var data;
            var buffer;

            data = {balance:  true};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  null};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  []};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  {}};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);
        });

    });

    /*
     Exonum.Int64
     */
    describe('Process Int64:', function() {

        it('Input correct number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: 900719925474000};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([208, 50, 51, 51, 51, 51, 3, 0]);
        });

        it('Input correct potentially unsafe number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: '9223372036854775807'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([255, 255, 255, 255, 255, 255, 255, 127]);
        });

        it('Input correct negative number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: '-9223372036854775808'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 128]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 4}}
            });
            var data = {balance: 613228};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input too big number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: '9223372036854775808'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input too small number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: '-9223372036854775809'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input data of wrong type', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 8}}
            });
            var data;
            var buffer;

            data = {balance:  true};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  null};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  []};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  {}};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);
        });

    });

    /*
     Exonum.Uint8
     */
    describe('Process Uint8:', function() {

        it('Input correct number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Uint8, size: 1, from: 0, to: 1}}
            });
            var data = {balance: 230};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([230]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Uint8, size: 1, from: 0, to: 0}}
            });
            var data = {balance: 230};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input negative number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Uint8, size: 1, from: 0, to: 1}}
            });
            var data = {balance: -1};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input unsafe number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Uint8, size: 1, from: 0, to: 1}}
            });
            var data = {balance: 256};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input data of wrong type', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.Uint8, size: 1, from: 0, to: 1}}
            });
            var data;
            var buffer;

            data = {balance:  true};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  null};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  []};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  {}};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);
        });

    });

    /*
     Exonum.Uint16
     */
    describe('Process Uint16:', function() {

        it('Input correct number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Uint16, size: 2, from: 0, to: 2}}
            });
            var data = {balance: 60535};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([119, 236]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Uint16, size: 2, from: 0, to: 1}}
            });
            var data = {balance: 60535};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input negative number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Uint16, size: 2, from: 0, to: 2}}
            });
            var data = {balance: -1};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input unsafe number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Uint16, size: 2, from: 0, to: 2}}
            });
            var data = {balance: 65536};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input data of wrong type', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.Uint16, size: 2, from: 0, to: 2}}
            });
            var data;
            var buffer;

            data = {balance:  true};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  null};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  []};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  {}};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);
        });

    });

    /*
     Exonum.Uint32
     */
    describe('Process Uint32:', function() {

        it('Input correct number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Uint32, size: 4, from: 0, to: 4}}
            });
            var data = {balance: 613228};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([108, 91, 9, 0]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Uint32, size: 4, from: 0, to: 3}}
            });
            var data = {balance: 613228};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input negative number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Uint32, size: 4, from: 0, to: 4}}
            });
            var data = {balance: -1};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input unsafe number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Uint32, size: 4, from: 0, to: 4}}
            });
            var data = {balance: 4294967296};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input data of wrong type', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.Uint32, size: 4, from: 0, to: 4}}
            });
            var data;
            var buffer;

            data = {balance:  true};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  null};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  []};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  {}};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);
        });

    });

    /*
     Exonum.Uint64
     */
    describe('Process Uint64:', function() {

        it('Input correct number to serialize in little endian', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Uint64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: 613228};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([108, 91, 9, 0, 0, 0, 0, 0]);
        });

        it('Input correct potentially unsafe number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Uint64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: '9007199254740993'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([1, 0, 0, 0, 0, 0, 32, 0]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Uint64, size: 8, from: 0, to: 4}}
            });
            var data = {balance: 613228};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input negative number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Uint64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: -613228};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input too big number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Uint64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: '18446744073709551616'};
            var buffer = Type.serialize(data);

            expect(buffer).to.equal(undefined);
        });

        it('Input data of wrong type', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.Uint64, size: 8, from: 0, to: 8}}
            });
            var data;
            var buffer;

            data = {balance:  true};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  null};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance: undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  []};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  {}};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);

            data = {balance:  new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.equal(undefined);
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
    describe('Build array of 8-bit integers:', function() {

        it('Check array of 8-bit integers of the data of type Wallet', function() {
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

        it('Check array of 8-bit integers of the data of type complicated non-fixed type Transaction', function() {
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

        it('Check array of 8-bit integers of the data of type complicated fixed type Transaction', function() {
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

        it('Send data with inherited properties that should be ignored', function() {
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

        it('Break on missed data parameters', function() {
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
    describe('Get SHA256 hash:', function() {

        it('Get hash of the data of NewType type', function() {
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

        it('Get hash of the data of NewMessage type', function() {
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_type: 2,
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

        it('Get hash of the array of 8-bit integers', function() {
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

        it('Insert data of wrong NewType type', function() {
            var Wallet = Exonum.newType({
                size: 80,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_hash: {type: Exonum.Hash, size: 32, from: 48, to: 80}
                }
            });
            var hash;

            hash = Exonum.hash(undefined, Wallet);
            expect(hash).to.equal(undefined);

            hash = Exonum.hash(false, Wallet);
            expect(hash).to.equal(undefined);

            hash = Exonum.hash(42, Wallet);
            expect(hash).to.equal(undefined);

            hash = Exonum.hash(new Date(), Wallet);
            expect(hash).to.equal(undefined);

            hash = Exonum.hash([], Wallet);
            expect(hash).to.equal(undefined);
        });

        it('Insert data of wrong NewMessage type', function() {
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_type: 2,
                fields: {
                    name: {type: Exonum.String, size: 8, from: 0, to: 8},
                    age: {type: Exonum.Uint8, size: 1, from: 8, to: 9},
                    balance: {type: Exonum.Uint64, size: 8, from: 9, to: 17},
                    status: {type: Exonum.Bool, size: 1, from: 17, to: 18}
                }
            });
            var hash;

            hash = Exonum.hash(undefined, CustomMessage);
            expect(hash).to.equal(undefined);

            hash = Exonum.hash(false, CustomMessage);
            expect(hash).to.equal(undefined);

            hash = Exonum.hash(42, CustomMessage);
            expect(hash).to.equal(undefined);

            hash = Exonum.hash(new Date(), CustomMessage);
            expect(hash).to.equal(undefined);

            hash = Exonum.hash([], CustomMessage);
            expect(hash).to.equal(undefined);
        });

    });

    /*
     Exonum.signature
     */
    describe('Get ED25519 signature:', function() {

        it('Get signature of the data of NewType type', function() {
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

        it('Get signature of the data of NewMessage type', function() {
            var secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_type: 2,
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

        it('Get signature of the array of 8-bit integers', function() {
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

        it('Input data parameter of wrong NewType type', function() {
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

        it('Input data parameter of wrong NewMessage type', function() {
            var secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_type: 2,
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

        it('Input type parameter of wrong type', function() {
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

        it('Input secretKey parameter of wrong length', function() {
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

        it('Input invalid secretKey parameter', function() {
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

        it('Input secretKey parameter of wrong type', function() {
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

            expect(Exonum.sign(buffer, true)).to.equal(undefined);

            expect(Exonum.sign(buffer, null)).to.equal(undefined);

            expect(Exonum.sign(buffer, undefined)).to.equal(undefined);

            expect(Exonum.sign(buffer, [])).to.equal(undefined);

            expect(Exonum.sign(buffer, {})).to.equal(undefined);

            expect(Exonum.sign(buffer, 51)).to.equal(undefined);

            expect(Exonum.sign(buffer, new Date())).to.equal(undefined);
        });

    });

    /*
     Exonum.signature
     */
    describe('Verify signature:', function() {

        it('Verify signature of the data of NewType type', function() {
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

        it('Verify signature of the data of NewMessage type', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var signature = '4006cef1884941850a6b97a64ed7f12d1e1053188618ef71b8c9f87438b943b1969e08011e45db8299bb738fec60c9dcd1936ab9ba44392cacc7f0385f18dd09';
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_type: 2,
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

        it('Verify signature of the array of 8-bit integers', function() {
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

        it('Input data parameter of wrong NewType type', function() {
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

        it('Input data parameter of wrong NewMessage type', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var signature = '24a5224702d670c95a78ef1f753c9e6e698da5b2a2c52dcc51b5bf9e556e717fb763b1a5e78bd39e5369a139ab68ae50dd19a129038e8da3af30985f09549500';
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_type: 2,
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

        it('Input type parameter of wrong type', function() {
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

        it('Input signature parameter of wrong length', function() {
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

        it('Input invalid signature parameter', function() {
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

        it('Input signature parameter of wrong type', function() {
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

            expect(Exonum.verifySignature(buffer, true, publicKey)).to.equal(undefined);

            expect(Exonum.verifySignature(buffer, null, publicKey)).to.equal(undefined);

            expect(Exonum.verifySignature(buffer, undefined, publicKey)).to.equal(undefined);

            expect(Exonum.verifySignature(buffer, [], publicKey)).to.equal(undefined);

            expect(Exonum.verifySignature(buffer, {}, publicKey)).to.equal(undefined);

            expect(Exonum.verifySignature(buffer, 51, publicKey)).to.equal(undefined);

            expect(Exonum.verifySignature(buffer, new Date(), publicKey)).to.equal(undefined);
        });

        it('Input publicKey parameter of wrong length', function() {
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

        it('Input invalid publicKey parameter', function() {
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

        it('Input publicKey parameter of wrong type', function() {
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

            expect(Exonum.verifySignature(buffer, signature, true)).to.equal(undefined);

            expect(Exonum.verifySignature(buffer, signature, null)).to.equal(undefined);

            expect(Exonum.verifySignature(buffer, signature, undefined)).to.equal(undefined);

            expect(Exonum.verifySignature(buffer, signature, [])).to.equal(undefined);

            expect(Exonum.verifySignature(buffer, signature, {})).to.equal(undefined);

            expect(Exonum.verifySignature(buffer, signature, 51)).to.equal(undefined);

            expect(Exonum.verifySignature(buffer, signature, new Date())).to.equal(undefined);
        });

    });

    /*
     Exonum.merkleProof
     */
    describe('Check proof of Merkle tree:', function() {

        it('Valid tree', function() {
            var data = require('./common_data/valid-merkle-tree.json');
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

        it('Valid tree but range end is out of range', function() {
            var data = require('./common_data/valid-merkle-tree-with-single-node.json');
            var elements = Exonum.merkleProof(
                data.root_hash,
                data.list_length,
                data.proof,
                [data.range_st, data.range_end - 1]
            );
            expect(elements).to.deep.equal([[7, 8]]);
        });

        it('Valid fully balanced tree with all values', function() {
            var data = require('./common_data/valid-merkle-tree-fully-balanced-with-all-values.json');
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

        it('Valid tree with hashes in values', function() {
            var data = require('./common_data/valid-merkle-tree-with-hashes-as-values.json');
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

        it('Invalid tree with invalid rootHash', function() {
            var elements;

            elements = Exonum.merkleProof(
                '6z56f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                [0, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1',
                8,
                {},
                [0, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                true,
                8,
                {},
                [0, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                null,
                8,
                {},
                [0, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                undefined,
                8,
                {},
                [0, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                [],
                8,
                {},
                [0, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                {},
                8,
                {},
                [0, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                42,
                8,
                {},
                [0, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                new Date(),
                8,
                {},
                [0, 8]
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with invalid count', function() {
            var elements;

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                true,
                {},
                [0, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                null,
                {},
                [0, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                undefined,
                {},
                [0, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                [],
                {},
                [0, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {},
                {},
                [0, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                new Date(),
                {},
                [0, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                'Hello world',
                {},
                [0, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                '42',
                {},
                [0, 8]
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with invalid proofNode', function() {
            var elements;

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                true,
                [0, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                null,
                [0, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                undefined,
                [0, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                42,
                [0, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                [],
                [0, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                'Hello world',
                [0, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                new Date(),
                [0, 8]
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with invalidrange', function() {
            var elements;

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                true
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                null
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                undefined
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                []
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                {}
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                new Date()
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                42
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                new Date()
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                'Hello world'
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                [0]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                [0, 8, 16]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                [true, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                [null, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                [undefined, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                ['Hello world', 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                [[], 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                [{}, 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                [new Date(), 8]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                [9, 8]
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with range start is out of range', function() {
            var elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                [9, 8]
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with elements that out of tree range', function() {
            var elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                [9, 9]
            );
            expect(elements).to.deep.equal([]);
        });

        it('Invalid tree with leaf on wrong height', function() {
            var data = require('./common_data/invalid-merkle-tree-with-leaf-on-wrong-height.json');
            var elements = Exonum.merkleProof(
                data.root_hash,
                data.list_length,
                data.proof,
                [data.range_st, data.range_end - 1]
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with wrong index of value node', function() {
            var data = require('./data/invalid-merkle-tree-with-wrong-index-of-value-node.json');
            var elements = Exonum.merkleProof(
                data.root_hash,
                data.list_length,
                data.proof,
                [data.range_st, data.range_end - 1]
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with value on wrong position', function() {
            var data = require('./data/invalid-merkle-tree-with-value-on-wrong-position.json');
            var elements = Exonum.merkleProof(
                data.root_hash,
                data.list_length,
                data.proof,
                [data.range_st, data.range_end - 1]
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with invalid type of type parameter', function() {
            var elements;

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: [255, 128]},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2],
                true
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: [255, 128]},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2],
                null
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: [255, 128]},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2],
                42
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: [255, 128]},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2],
                []
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: [255, 128]},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2],
                new Date()
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with invalid value', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 32}}
            });
            var elements;

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: true},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2],
                Type
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: 42},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2],
                Type
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: 'Hello world'},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2],
                Type
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: []},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2],
                Type
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: new Date()},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2],
                Type
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with invalid value not corresponding to passed type', function() {
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

        it('Invalid tree with invalid array of 8-bit integers as value', function() {
            var elements;

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: true},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: {}},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: 42},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: 'Hello world'},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: new Date()},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: [153, 256]},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: [153, -1]},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: [153, true]},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: [153, null]},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: [153, undefined]},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: [153, 'Hello world']},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: [153, {}]},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: [153, []]},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: {val: [153, new Date()]},
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with missed left node', function() {
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

        it('Invalid tree with invalid string in left node', function() {
            var elements;

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fz',
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365c',
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fa52',
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: '',
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with invalid string in right node', function() {
            var elements;

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc',
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fz'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc',
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365c'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc',
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fa52'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc',
                    right: ''
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with invalid type of left node', function() {
            var elements;

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: true,
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: null,
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: [],
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: 42,
                    right: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc'
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with invalid type of right node', function() {
            var elements;

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc',
                    right: true
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc',
                    right: null
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc',
                    right: []
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                2,
                {
                    left: 'b267fa0930dede7557b805fe643a3ce8ebe4434e366924df1d622785365cf0fc',
                    right: 42
                },
                [0, 2]
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with missed right leaf inside right tree branch', function() {
            var data = require('./common_data/invalid-merkle-tree-missed-right-leaf-on-left-branch.json');
            var elements = Exonum.merkleProof(
                data.root_hash,
                data.list_length,
                data.proof,
                [data.range_st, data.range_end - 1]
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with wrong rootHash', function() {
            var data = require('./data/invalid-merkle-tree-with-wrong-root-hash.json');
            var elements = Exonum.merkleProof(
                data.root_hash,
                data.list_length,
                data.proof,
                [data.range_st, data.range_end - 1]
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with wrong amount of elements', function() {
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
    describe('Check proof of Merkle Patricia tree:', function() {

        it('Valid empty tree', function() {
            var data = require('./common_data/valid-merkle-patricia-tree-empty-tree.json');
            var element = Exonum.merklePatriciaProof(
                data.root_hash,
                data.proof,
                data.searched_key
            );
            expect(element).to.equal(null);
        });

        it('Valid tree with leaf exclusive', function() {
            var data = require('./common_data/valid-merkle-patricia-tree-leaf-exclusive.json');
            var element = Exonum.merklePatriciaProof(
                data.root_hash,
                data.proof,
                data.searched_key
            );
            expect(element).to.equal(null);
        });

        it('Valid tree with leaf inclusive', function() {
            var data = require('./common_data/valid-merkle-patricia-tree-leaf-inclusive.json');
            var element = Exonum.merklePatriciaProof(
                data.root_hash,
                data.proof,
                data.searched_key
            );
            expect(element).to.deep.equal([2]);
        });

        it('Valid tree with nested node exclusive', function() {
            var data = require('./common_data/valid-merkle-patricia-tree-nested-exclusive.json');
            var element = Exonum.merklePatriciaProof(
                data.root_hash,
                data.proof,
                data.searched_key
            );
            expect(element).to.equal(null);
        });

        it('Valid tree with nested node inclusive', function() {
            var data = require('./common_data/valid-merkle-patricia-tree-nested-inclusive.json');
            var element = Exonum.merklePatriciaProof(
                data.root_hash,
                data.proof,
                data.searched_key
            );
            expect(element).to.deep.equal([36, 49, 15, 31, 163, 171, 247, 217]);
        });

        it('Valid tree with hashes in values', function() {
            var data = require('./common_data/valid-merkle-patricia-tree-with-hashes-as-values.json');
            var element = Exonum.merklePatriciaProof(
                data.root_hash,
                data.proof,
                data.searched_key
            );
            expect(element).to.equal('d7897e2f9d336f6ef53315f26c720193c5c22854850c6d66c380d05172e92acd');
        });

        it('Invalid tree with invalid rootHash parameter', function() {
            var elements;

            elements = Exonum.merklePatriciaProof('6z56f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13');
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof('6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1');
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(true);
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(null);
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(undefined);
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof([]);
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof({});
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(42);
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(new Date());
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with invalid proofNode parameter', function() {
            var elements;

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                true
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                null
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                undefined
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                42
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                []
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                'Hello world'
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                new Date()
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with invalid byte array key parameter', function() {
            var elements;

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {},
                [1, 114]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {},
                [1, true, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {},
                [1, null, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {},
                [1, undefined, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {},
                [1, {}, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {},
                [1, [], 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {},
                [1, new Date(), 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {},
                [1, 256, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0]
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {},
                [1, -1, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0, 1, 114, 5, 0]
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with invalid string key parameter', function() {
            var elements;

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {},
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1'
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {},
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1z'
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with key parameter of wrong type', function() {
            var elements;

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {},
                true
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {},
                null
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {},
                undefined
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {},
                42
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {},
                []
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {},
                'Hello world'
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {},
                new Date()
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with empty root and wrong rootHash', function() {
            var elements = Exonum.merklePatriciaProof(
                '0000000000000000000000000000000000000000000000000000000000000001',
                {},
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with single node and invalid binary string as key', function() {
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

        it('Invalid tree with single node and wrong invalid hash on value position', function() {
            var elements;

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': ''
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1'
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1z'
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with single node and rootHash parameter not equal to actual hash (element is not found)', function() {
            var elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with single node and invalid key with hash is in the root of proofNode parameter (element is not found)', function() {
            var elements = Exonum.merklePatriciaProof(
                '335ec501d811725a9e60f89a1b67103e6fa5e65712a007ed33324719a6e2de3a',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
                },
                'f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3'
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with single node and wrong type data on value position', function() {
            var elements;

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
                        val: false
                    }
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
                        val: null
                    }
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
                        val: undefined
                    }
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
                        val: 'Hello world'
                    }
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
                        val: 42
                    }
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
                        val: new Date()
                    }
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with single node and invalid bytes array on value position', function() {
            var elements;

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
                        val: [1, 'a', 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]
                    }
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
                        val: [1, -1, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]
                    }
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
                        val: [1, 256, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]
                    }
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with single node and invalid value type (not array, not object)', function() {
            var elements;

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': false
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': null
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': undefined
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': []
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': 42
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);

            elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': new Date()
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with single node and invalid type parameter', function() {
            var elements;

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
                null
            );
            expect(elements).to.equal(undefined);

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
                false
            );
            expect(elements).to.equal(undefined);

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
                42
            );
            expect(elements).to.equal(undefined);

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
                {}
            );
            expect(elements).to.equal(undefined);

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
                []
            );
            expect(elements).to.equal(undefined);

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
                42
            );
            expect(elements).to.equal(undefined);

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
                new Date()
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid tree with single node and wrong type parameter', function() {
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

        it('Invalid tree with single node and rootHash parameter not equal to actual hash (element is found)', function() {
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

        it('Invalid tree with single node and invalid key with value is in the root of proofNode parameter (element is found)', function() {
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

        it('Invalid tree with single node and invalid key in the root of proofNode parameneter', function() {
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

        it('Invalid tree with single node and invalid key with value in the root of proofNode parameneter', function() {
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

        it('Invalid tree with invalid number of children in root node', function() {
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

        it('Valid tree with array as key parameter ', function() {
            var elements = Exonum.merklePatriciaProof(
                '8be78622dc7fd18b069a226133f1e943652bc5d53fd5df3d59735f49da1df692',
                {
                    "1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110": "dbc1b4c900ffe48d575b5da5c638040125f65db0fe3e24494b76ea986457d986"
                },
                [244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244]
            );
            expect(elements).to.equal(null);
        });

        it('Invalid tree with wrong rootHash parameter ', function() {
            var data = require('./data/invalid-merkle-patricia-tree-wrong-root-hash.json');
            var element = Exonum.merklePatriciaProof(
                data.root_hash,
                data.proof,
                data.searched_key
            );
            expect(element).to.deep.equal(undefined);
        });

        it('Invalid tree with invalid binary key', function() {
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

        it('Invalid tree with non full key and value of wrong type', function() {
            var element;

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '0': true,
                    '1': {}
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '0': null,
                    '1': {}
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '0': undefined,
                    '1': {}
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '0': [],
                    '1': {}
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '0': 42,
                    '1': {}
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '0': new Date(),
                    '1': {}
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);
        });

        it('Invalid tree with full key and value of wrong type', function() {
            var element;

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '0011001010001111110000101101101011111110000101010111001100101110011110010011110000111001011111111011110110100101111111111110111001110011111110011111001110011110111100001100100101110011010010111111011110001001000010000110000001000101101111100000101010100': true,
                    '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '0011001010001111110000101101101011111110000101010111001100101110011110010011110000111001011111111011110110100101111111111110111001110011111110011111001110011110111100001100100101110011010010111111011110001001000010000110000001000101101111100000101010100': null,
                    '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '0011001010001111110000101101101011111110000101010111001100101110011110010011110000111001011111111011110110100101111111111110111001110011111110011111001110011110111100001100100101110011010010111111011110001001000010000110000001000101101111100000101010100': undefined,
                    '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '0011001010001111110000101101101011111110000101010111001100101110011110010011110000111001011111111011110110100101111111111110111001110011111110011111001110011110111100001100100101110011010010111111011110001001000010000110000001000101101111100000101010100': [],
                    '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '0011001010001111110000101101101011111110000101010111001100101110011110010011110000111001011111111011110110100101111111111110111001110011111110011111001110011110111100001100100101110011010010111111011110001001000010000110000001000101101111100000101010100': 42,
                    '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': new Date(),
                    '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);
        });

        it('Invalid tree with non full key and invalid hash', function() {
            var element;

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '0': 'ads',
                    '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6ez',
                    '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);
        });

        it('Invalid tree with full key and invalid hash', function() {
            var element;

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': 'ads',
                    '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6ez',
                    '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);
        });

        it('Invalid tree with full key and missed value', function() {
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

        it('Invalid tree with full key and duplicated value', function() {
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

        it('Invalid tree with non full key and value on wrong position', function() {
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

        it('Invalid tree with key of wrong length', function() {
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

        it('Invalid tree with full key and value of wrong type', function() {
            var element;

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
                        val: false
                    },
                    '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
                        val: null
                    },
                    '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
                        val: 42
                    },
                    '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
                        val: 'Hello world'
                    },
                    '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);
        });

        it('Invalid tree with full key and value as invalid binary array', function() {
            var element;

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
                        val: [false]
                    },
                    '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
                        val: [null]
                    },
                    '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
                        val: [257]
                    },
                    '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
                        val: [{}]
                    },
                    '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
                        val: [[]]
                    },
                    '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);

            element = Exonum.merklePatriciaProof(
                '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
                {
                    '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
                        val: [new Date()]
                    },
                    '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
            );
            expect(element).to.deep.equal(undefined);
        });

        it('Invalid tree with full key and wrong type parameter', function() {
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

        it('Invalid tree with non full key and wrong type parameter', function() {
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

        it('Invalid tree with duplicated left leaf', function() {
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

        it('Invalid tree with duplicated right leaf', function() {
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

        it('Invalid tree with left key which is part of search key but branch is not expanded', function() {
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

        it('Invalid tree with right key which is part of search key but branch is not expanded', function() {
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
    describe('Verify block of precommits:', function() {

        it('Valid block', function() {
            var data = require('./common_data/valid-block-with-precommits.json');
            expect(Exonum.verifyBlock(data)).to.equal(true);
        });

        it('Invalid block with data of wrong type', function() {
            expect(Exonum.verifyBlock(null)).to.equal(false);
            expect(Exonum.verifyBlock(undefined)).to.equal(false);
            expect(Exonum.verifyBlock(42)).to.equal(false);
            expect(Exonum.verifyBlock('Hello world')).to.equal(false);
            expect(Exonum.verifyBlock([])).to.equal(false);
            expect(Exonum.verifyBlock(new Date())).to.equal(false);
        });

        it('Invalid block with block info of wrong type', function() {
            expect(Exonum.verifyBlock({})).to.equal(false);
            expect(Exonum.verifyBlock({block: null})).to.equal(false);
            expect(Exonum.verifyBlock({block: undefined})).to.equal(false);
            expect(Exonum.verifyBlock({block: 'Hello world'})).to.equal(false);
            expect(Exonum.verifyBlock({block: []})).to.equal(false);
            expect(Exonum.verifyBlock({block: 42})).to.equal(false);
            expect(Exonum.verifyBlock({block: new Date()})).to.equal(false);
        });

        it('Invalid block with precommits info of wrong type', function() {
            expect(Exonum.verifyBlock({block: {}})).to.equal(false);
            expect(Exonum.verifyBlock({block: {}, precommits: null})).to.equal(false);
            expect(Exonum.verifyBlock({block: {}, precommits: undefined})).to.equal(false);
            expect(Exonum.verifyBlock({block: {}, precommits: 'Hello world'})).to.equal(false);
            expect(Exonum.verifyBlock({block: {}, precommits: {}})).to.equal(false);
            expect(Exonum.verifyBlock({block: {}, precommits: 42})).to.equal(false);
            expect(Exonum.verifyBlock({block: {}, precommits: new Date()})).to.equal(false);
        });

        it('Invalid block with body field of wrong type in precommit', function() {
            expect(Exonum.verifyBlock({
                block: {},
                precommits: [{
                    body: null
                }]
            })).to.equal(false);

            expect(Exonum.verifyBlock({
                block: {},
                precommits: [{
                    body: undefined
                }]
            })).to.equal(false);

            expect(Exonum.verifyBlock({
                block: {},
                precommits: [{
                    body: 42
                }]
            })).to.equal(false);

            expect(Exonum.verifyBlock({
                block: {},
                precommits: [{
                    body: 'Hello world'
                }]
            })).to.equal(false);

            expect(Exonum.verifyBlock({
                block: {},
                precommits: [{
                    body: []
                }]
            })).to.equal(false);

            expect(Exonum.verifyBlock({
                block: {},
                precommits: [{
                    body: new Date()
                }]
            })).to.equal(false);
        });

        it('Invalid block with signature field of wrong type in precommit', function() {
            expect(Exonum.verifyBlock({
                block: {},
                precommits: [{
                    body: {},
                    signature: null
                }]
            })).to.equal(false);

            expect(Exonum.verifyBlock({
                block: {},
                precommits: [{
                    body: {},
                    signature: undefined
                }]
            })).to.equal(false);

            expect(Exonum.verifyBlock({
                block: {},
                precommits: [{
                    body: {},
                    signature: 42
                }]
            })).to.equal(false);

            expect(Exonum.verifyBlock({
                block: {},
                precommits: [{
                    body: {},
                    signature: []
                }]
            })).to.equal(false);

            expect(Exonum.verifyBlock({
                block: {},
                precommits: [{
                    body: {},
                    signature: {}
                }]
            })).to.equal(false);

            expect(Exonum.verifyBlock({
                block: {},
                precommits: [{
                    body: {},
                    signature: new Date()
                }]
            })).to.equal(false);
        });

        it('Invalid block with invalid signature field in precommit', function() {
            expect(Exonum.verifyBlock({
                block: {},
                precommits: [{
                    body: {},
                    signature: '22635e36303ff3ef4c86b855e57356f41483e6637136d1d2ec46ba2ec8f69fb9'
                }]
            })).to.equal(false);

            expect(Exonum.verifyBlock({
                block: {},
                precommits: [{
                    body: {},
                    signature: '22635e36303ff3ef4c86b855e57356f41483e6637136d1d2ec46ba2ec8f69fb922635e36303ff3ef4c86b855e57356f41483e6637136d1d2ec46ba2ec8f69fbz'
                }]
            })).to.equal(false);
        });

        it('Invalid block with precommit from non existed validtor', function() {
            expect(Exonum.verifyBlock({
                block: {},
                precommits: [{
                    body: {
                        validator: 999999999
                    },
                    signature: '63b8341b82f0eb6f32be73bf36a4b605655e3979030df9e025713c972d1da6d263b8341b82f0eb6f32be73bf36a4b605655e3979030df9e025713c972d1da6d2'
                }]
            })).to.equal(false);
        });

        it('Invalid block with wrong height of block in precommit', function() {
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
            })).to.equal(false);
        });

        it('Invalid block with wrong hash of block in precommit', function() {
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
                }
            )).to.equal(false);
        });

        it('Invalid block with wrong round in precommit', function() {
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
                }
            )).to.equal(false);
        });

        it('Invalid block with wrong signature of precommit', function() {
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
                }
            )).to.equal(false);
        });

        it('Invalid block with insufficient precommits from unique validators', function() {
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
                }
            )).to.equal(false);
        });

    });

});

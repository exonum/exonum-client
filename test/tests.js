var expect = require('chai').expect;
var Exonum = require('../index');
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

            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        });

        it('Input invalid string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 32}}
            });
            var data = {hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3z'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        });

        it('Input too long string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 32}}
            });
            var data = {hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        });

        it('Input too short string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {hash: {type: Exonum.Hash, size: 32, from: 0, to: 32}}
            });
            var data = {hash: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
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
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

            data = {hash: null};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

            data = {hash: undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

            data = {hash: 57};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

            data = {hash: []};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

            data = {hash: {}};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

            data = {hash: new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
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

            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        });

        it('Input invalid string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3z'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        });

        it('Input too long string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c365'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        });

        it('Input too short string', function() {
            var Type = Exonum.newType({
                size: 32,
                fields: {key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32}}
            });
            var data = {key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c3'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
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
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

            data = {key: null};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

            data = {key: undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

            data = {key: 57};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

            data = {key: []};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

            data = {key: {}};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

            data = {key: new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
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

            expect(buffer).to.deep.equal([0, 0, 1, 89, 132, 24, 45, 221]);
        });

        it('Input negative number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {since: {type: Exonum.Timespec, size: 8, from: 0, to: 8}}
            });
            var data = {since: -1483979894237};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {since: {type: Exonum.Timespec, size: 8, from: 0, to: 4}}
            });
            var data = {since: 1483979894237};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);
        });

        it('Input unsafe number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {since: {type: Exonum.Timespec, size: 8, from: 0, to: 8}}
            });
            var data = {since: Number.MAX_SAFE_INTEGER + 1};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);
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
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);

            data = {since:  null};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);

            data = {since:  undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);

            data = {since:  []};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);

            data = {since:  {}};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);

            data = {since:  new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);
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

            expect(buffer).to.deep.equal([0]);
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
            expect(buffer).to.deep.equal([0]);

            data = {active: null};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0]);

            data = {active: undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0]);

            data = {active: 57};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0]);

            data = {active: []};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0]);

            data = {active: {}};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0]);

            data = {active: new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0]);
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

            expect(buffer).to.deep.equal([0, 0, 0, 8, 0, 0, 0, 11, 72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {text: {type: Exonum.String, size: 8, from: 0, to: 4}}
            });
            var data = {text: 'Hello world'};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);
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
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);

            data = {text: null};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);

            data = {text: undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);

            data = {text: 57};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);

            data = {text: []};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);

            data = {text: {}};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);

            data = {text: new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);
        });

    });

    /*
     Exonum.I8
     */
    describe('Process I8:', function() {

        it('Input correct number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.I8, size: 1, from: 0, to: 1}}
            });
            var data = {balance: 120};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([120]);
        });

        it('Input correct negative number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.I8, size: 1, from: 0, to: 1}}
            });
            var data = {balance: -120};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([136]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.I8, size: 1, from: 0, to: 0}}
            });
            var data = {balance: 120};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0]);
        });

        it('Input unsafe number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.I8, size: 1, from: 0, to: 1}}
            });
            var data = {balance: 130};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0]);
        });

        it('Input unsafe negative number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.I8, size: 1, from: 0, to: 1}}
            });
            var data = {balance: -130};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0]);
        });

        it('Input data of wrong type', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.I8, size: 1, from: 0, to: 1}}
            });
            var data;
            var buffer;

            data = {balance:  true};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0]);

            data = {balance:  null};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0]);

            data = {balance:  undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0]);

            data = {balance:  []};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0]);

            data = {balance:  {}};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0]);

            data = {balance:  new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0]);
        });

    });

    /*
     Exonum.I16
     */
    describe('Process I16:', function() {

        it('Input correct number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.I16, size: 2, from: 0, to: 2}}
            });
            var data = {balance: 30767};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([120, 47]);
        });

        it('Input correct negative number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.I16, size: 2, from: 0, to: 2}}
            });
            var data = {balance: -30767};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([135, 209]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.I16, size: 2, from: 0, to: 1}}
            });
            var data = {balance: 30767};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0]);
        });

        it('Input unsafe number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.I16, size: 2, from: 0, to: 2}}
            });
            var data = {balance: 32769};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0]);
        });

        it('Input unsafe negative number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.I16, size: 2, from: 0, to: 2}}
            });
            var data = {balance: -32770};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0]);
        });

        it('Input data of wrong type', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.I16, size: 2, from: 0, to: 2}}
            });
            var data;
            var buffer;

            data = {balance:  true};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0]);

            data = {balance:  null};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0]);

            data = {balance:  undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0]);

            data = {balance:  []};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0]);

            data = {balance:  {}};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0]);

            data = {balance:  new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0]);
        });

    });

    /*
     Exonum.I32
     */
    describe('Process I32:', function() {

        it('Input correct number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.I32, size: 4, from: 0, to: 4}}
            });
            var data = {balance: 1147483647};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([68, 101, 53, 255]);
        });

        it('Input correct negative number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.I32, size: 4, from: 0, to: 4}}
            });
            var data = {balance: -1147483648};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([187, 154, 202, 0]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.I32, size: 4, from: 0, to: 3}}
            });
            var data = {balance: 613228};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0]);
        });

        it('Input unsafe number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.I32, size: 4, from: 0, to: 4}}
            });
            var data = {balance: 2147483649};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0]);
        });

        it('Input unsafe negative number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.I32, size: 4, from: 0, to: 4}}
            });
            var data = {balance: -2147483650};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0]);
        });

        it('Input data of wrong type', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.I32, size: 4, from: 0, to: 4}}
            });
            var data;
            var buffer;

            data = {balance:  true};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0]);

            data = {balance:  null};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0]);

            data = {balance:  undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0]);

            data = {balance:  []};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0]);

            data = {balance:  {}};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0]);

            data = {balance:  new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0]);
        });

    });

    /*
     Exonum.I64
     */
    describe('Process I64:', function() {

        it('Input correct number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.I64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: 900719925474000};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 3, 51, 51, 51, 51, 50, 208]);
        });

        it('Input correct negative number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.I64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: -900719925474000};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([255, 252, 204, 204, 204, 204, 208, 0]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.I64, size: 8, from: 0, to: 4}}
            });
            var data = {balance: 613228};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);
        });

        it('Input unsafe number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.I64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: Number.MAX_SAFE_INTEGER + 1};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);
        });

        it('Input unsafe negative number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.I64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: Number.MIN_SAFE_INTEGER - 1};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);
        });

        it('Input data of wrong type', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.I64, size: 8, from: 0, to: 8}}
            });
            var data;
            var buffer;

            data = {balance:  true};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);

            data = {balance:  null};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);

            data = {balance:  undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);

            data = {balance:  []};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);

            data = {balance:  {}};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);

            data = {balance:  new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);
        });

    });

    /*
     Exonum.U8
     */
    describe('Process U8:', function() {

        it('Input correct number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.U8, size: 1, from: 0, to: 1}}
            });
            var data = {balance: 230};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([230]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.U8, size: 1, from: 0, to: 0}}
            });
            var data = {balance: 230};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0]);
        });

        it('Input negative number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.U8, size: 1, from: 0, to: 1}}
            });
            var data = {balance: -1};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0]);
        });

        it('Input unsafe number', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.U8, size: 1, from: 0, to: 1}}
            });
            var data = {balance: 256};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0]);
        });

        it('Input data of wrong type', function() {
            var Type = Exonum.newType({
                size: 1,
                fields: {balance: {type: Exonum.U8, size: 1, from: 0, to: 1}}
            });
            var data;
            var buffer;

            data = {balance:  true};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0]);

            data = {balance:  null};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0]);

            data = {balance:  undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0]);

            data = {balance:  []};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0]);

            data = {balance:  {}};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0]);

            data = {balance:  new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0]);
        });

    });

    /*
     Exonum.U16
     */
    describe('Process U16:', function() {

        it('Input correct number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.U16, size: 2, from: 0, to: 2}}
            });
            var data = {balance: 60535};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([236, 119]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.U16, size: 2, from: 0, to: 1}}
            });
            var data = {balance: 60535};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0]);
        });

        it('Input negative number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.U16, size: 2, from: 0, to: 2}}
            });
            var data = {balance: -1};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0]);
        });

        it('Input unsafe number', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.U16, size: 2, from: 0, to: 2}}
            });
            var data = {balance: 65536};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0]);
        });

        it('Input data of wrong type', function() {
            var Type = Exonum.newType({
                size: 2,
                fields: {balance: {type: Exonum.U16, size: 2, from: 0, to: 2}}
            });
            var data;
            var buffer;

            data = {balance:  true};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0]);

            data = {balance:  null};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0]);

            data = {balance:  undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0]);

            data = {balance:  []};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0]);

            data = {balance:  {}};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0]);

            data = {balance:  new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0]);
        });

    });

    /*
     Exonum.U32
     */
    describe('Process U32:', function() {

        it('Input correct number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.U32, size: 4, from: 0, to: 4}}
            });
            var data = {balance: 613228};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 9, 91, 108]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.U32, size: 4, from: 0, to: 3}}
            });
            var data = {balance: 613228};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0]);
        });

        it('Input negative number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.U32, size: 4, from: 0, to: 4}}
            });
            var data = {balance: -1};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0]);
        });

        it('Input unsafe number', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.U32, size: 4, from: 0, to: 4}}
            });
            var data = {balance: 4294967296};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0]);
        });

        it('Input data of wrong type', function() {
            var Type = Exonum.newType({
                size: 4,
                fields: {balance: {type: Exonum.U32, size: 4, from: 0, to: 4}}
            });
            var data;
            var buffer;

            data = {balance:  true};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0]);

            data = {balance:  null};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0]);

            data = {balance:  undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0]);

            data = {balance:  []};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0]);

            data = {balance:  {}};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0]);

            data = {balance:  new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0]);
        });

    });

    /*
     Exonum.U64
     */
    describe('Process U64:', function() {

        it('Input correct number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.U64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: 613228};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 9, 91, 108]);
        });

        it('Input wrong segment range', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.U64, size: 8, from: 0, to: 4}}
            });
            var data = {balance: 613228};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);
        });

        it('Input negative number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.U64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: -613228};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);
        });

        it('Input unsafe number', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.U64, size: 8, from: 0, to: 8}}
            });
            var data = {balance: Number.MAX_SAFE_INTEGER + 1};
            var buffer = Type.serialize(data);

            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);
        });

        it('Input data of wrong type', function() {
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.U64, size: 8, from: 0, to: 8}}
            });
            var data;
            var buffer;

            data = {balance:  true};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);

            data = {balance:  null};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);

            data = {balance:  undefined};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);

            data = {balance:  []};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);

            data = {balance:  {}};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);

            data = {balance:  new Date()};
            buffer = Type.serialize(data);
            expect(buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);
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
                    balance: {type: Exonum.U64, size: 8, from: 40, to: 48},
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

            expect(buffer).to.deep.equal([245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54, 0, 0, 0, 80, 0, 0, 0, 12, 0, 0, 0, 0, 0, 5, 122, 208, 103, 82, 190, 136, 35, 20, 245, 187, 188, 154, 106, 242, 174, 99, 79, 192, 112, 56, 88, 74, 74, 119, 81, 14, 165, 236, 237, 69, 245, 77, 192, 48, 83, 109, 97, 114, 116, 32, 119, 97, 108, 108, 101, 116]);
        });

        it('Send data with inherited properties that should be ignored', function() {
            var Wallet = Exonum.newType({
                size: 80,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.U64, size: 8, from: 40, to: 48},
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

            expect(buffer).to.deep.equal([245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54, 0, 0, 0, 80, 0, 0, 0, 12, 0, 0, 0, 0, 0, 5, 122, 208, 103, 82, 190, 136, 35, 20, 245, 187, 188, 154, 106, 242, 174, 99, 79, 192, 112, 56, 88, 74, 74, 119, 81, 14, 165, 236, 237, 69, 245, 77, 192, 48, 83, 109, 97, 114, 116, 32, 119, 97, 108, 108, 101, 116]);
        });

    });

    /*
     Exonum.hash
     */
    describe('Get SHA256 hash:', function() {

        it('Get hash of the data of type Wallet', function() {
            var Wallet = Exonum.newType({
                size: 80,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.U64, size: 8, from: 40, to: 48},
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

            expect(hash).to.equal('7ba0c9544176ce7e079da9c7869fc91dca2cfa4b8dc1c6098f74d96b75542e12');
        });

        it('Get hash of the array of 8-bit integers', function() {
            var Wallet = Exonum.newType({
                size: 80,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.U64, size: 8, from: 40, to: 48},
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

            expect(hash).to.equal('7ba0c9544176ce7e079da9c7869fc91dca2cfa4b8dc1c6098f74d96b75542e12');
        });

    });

    /*
     Exonum.signature
     */
    describe('Get ED25519 signature:', function() {

        it('Get signature of the data of type User', function() {
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

            expect(signature).to.equal('9e0f0122c2963b76ba10842951cd1b67c8197b3f964c34f8b667aa655a7b4a8d844d567698d99de30590fc5002ddb4b9b5927ec05cd73572b972cb6b034cd40b');
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

            expect(signature).to.equal('9e0f0122c2963b76ba10842951cd1b67c8197b3f964c34f8b667aa655a7b4a8d844d567698d99de30590fc5002ddb4b9b5927ec05cd73572b972cb6b034cd40b');
        });

        it('Input secretKey of wrong length', function() {
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

        it('Input invalid secretKey', function() {
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

        it('Input secretKey of wrong type', function() {
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
     Exonum.merkleProof
     */
    describe('Check proof of Merkle tree:', function() {

        it('Valid Merkle tree', function() {
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

        it('Valid Merkle tree but range end is out of range', function() {
            var data = require('./common_data/valid-merkle-tree-range-end-is-out-of-range.json');
            var elements = Exonum.merkleProof(
                data.root_hash,
                data.list_length,
                data.proof,
                [data.range_st, data.range_end - 1]
            );
            expect(elements).to.deep.equal([[7, 8]]);
        });

        it('Valid fully balanced Merkle tree with all values', function() {
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

        it('Invalid Merkle tree with invalid rootHash', function() {
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

        it('Invalid Merkle tree with invalid count', function() {
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

        it('Invalid Merkle tree with invalid proofNode', function() {
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

        it('Invalid Merkle tree with invalidrange', function() {
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

        it('Invalid Merkle tree with range start is out of range', function() {
            var elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                [9, 8]
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid Merkle tree with elements that out of tree range', function() {
            var elements = Exonum.merkleProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                8,
                {},
                [9, 9]
            );
            expect(elements).to.deep.equal([]);
        });

        it('Invalid Merkle tree with leaf on wrong height', function() {
            var data = require('./common_data/invalid-merkle-tree-with-leaf-on-wrong-height.json');
            var elements = Exonum.merkleProof(
                data.root_hash,
                data.list_length,
                data.proof,
                [data.range_st, data.range_end - 1]
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid Merkle tree with wrong index of value node', function() {
            var data = require('./data/invalid-merkle-tree-with-wrong-index-of-value-node.json');
            var elements = Exonum.merkleProof(
                data.root_hash,
                data.list_length,
                data.proof,
                [data.range_st, data.range_end - 1]
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid Merkle tree with value on wrong position', function() {
            var data = require('./data/invalid-merkle-tree-with-value-on-wrong-position.json');
            var elements = Exonum.merkleProof(
                data.root_hash,
                data.list_length,
                data.proof,
                [data.range_st, data.range_end - 1]
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid Merkle tree with invalid type of type parameter', function() {
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

        it('Invalid Merkle tree with invalid value', function() {
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

        it('Invalid Merkle tree with invalid value not corresponding to passed type', function() {
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

        it('Invalid Merkle tree with invalid array of 8-bit integers as value', function() {
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

        it('Invalid Merkle tree with missed left node', function() {
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

        it('Invalid Merkle tree with invalid string in left node', function() {
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

        it('Invalid Merkle tree with invalid string in right node', function() {
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

        it('Invalid Merkle tree with invalid type of left node', function() {
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

        it('Invalid Merkle tree with invalid type of right node', function() {
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

        it('Invalid Merkle tree with missed right leaf inside right tree branch', function() {
            var data = require('./common_data/invalid-merkle-tree-missed-right-leaf-on-right-branch.json');
            var elements = Exonum.merkleProof(
                data.root_hash,
                data.list_length,
                data.proof,
                [data.range_st, data.range_end - 1]
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid Merkle tree with wrong rootHash', function() {
            var data = require('./data/invalid-merkle-tree-with-wrong-root-hash.json');
            var elements = Exonum.merkleProof(
                data.root_hash,
                data.list_length,
                data.proof,
                [data.range_st, data.range_end - 1]
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid Merkle tree with wrong amount of elements', function() {
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

        it('Invalid Merkle Patricia tree with invalid rootHash parameter', function() {
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

        it('Invalid Merkle Patricia tree with invalid proofNode parameter', function() {
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

        it('Invalid Merkle Patricia tree with invalid byte array key parameter', function() {
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

        it('Invalid Merkle Patricia tree with invalid string key parameter', function() {
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

        it('Invalid Merkle Patricia tree with key parameter of wrong type', function() {
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

        it('Invalid Merkle Patricia tree with empty root and wrong rootHash', function() {
            var elements = Exonum.merklePatriciaProof(
                '0000000000000000000000000000000000000000000000000000000000000001',
                {},
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid Merkle Patricia tree with single node and invalid binary string as key', function() {
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

        it('Invalid Merkle Patricia tree with single node and wrong invalid hash on value position', function() {
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

        it('Invalid Merkle Patricia tree with single node and rootHash parameter not equal to actual hash (element is not found)', function() {
            var elements = Exonum.merklePatriciaProof(
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid Merkle Patricia tree with single node and invalid key with hash is in the root of proofNode parameter (element is not found)', function() {
            var elements = Exonum.merklePatriciaProof(
                '335ec501d811725a9e60f89a1b67103e6fa5e65712a007ed33324719a6e2de3a',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
                },
                'f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3'
            );
            expect(elements).to.equal(undefined);
        });

        it('Invalid Merkle Patricia tree with single node and wrong type data on value position', function() {
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

        it('Invalid Merkle Patricia tree with single node and invalid bytes array on value position', function() {
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

        it('Invalid Merkle Patricia tree with single node and invalid value type (not array, not object)', function() {
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

        it('Invalid Merkle Patricia tree with single node and invalid type parameter', function() {
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

        it('Invalid Merkle Patricia tree with single node and wrong type parameter', function() {
            var elements;
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.I64, size: 8, from: 0, to: 8}}
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

        it('Invalid Merkle Patricia tree with single node and rootHash parameter not equal to actual hash (element is found)', function() {
            var elements;
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.I64, size: 8, from: 0, to: 8}}
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

        it('Invalid Merkle Patricia tree with single node and invalid key with value is in the root of proofNode parameter (element is found)', function() {
            var elements;
            var Type = Exonum.newType({
                size: 8,
                fields: {balance: {type: Exonum.I64, size: 8, from: 0, to: 8}}
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

        it('Invalid Merkle Patricia tree with invalid number of children in root node', function() {
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

    });

});

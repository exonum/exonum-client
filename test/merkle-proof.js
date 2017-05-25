var expect = require('chai').expect;
var Exonum = require('..');
var fs = require('fs');

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

/* eslint-env node, mocha */

var expect = require('chai').expect;
var Exonum = require('..');

describe('Check proof of Merkle Patricia tree', function() {

    it('should return null when an empty tree', function() {
        var data = require('./common_data/merkle-patricia-tree/valid-merkle-patricia-tree-empty-tree.json');
        var element = Exonum.merklePatriciaProof(
            data.root_hash,
            data.proof,
            data.searched_key
        );
        expect(element).to.be.null;
    });

    it('should return null when valid tree with leaf exclusive', function() {
        var data = require('./common_data/merkle-patricia-tree/valid-merkle-patricia-tree-leaf-exclusive.json');
        var element = Exonum.merklePatriciaProof(
            data.root_hash,
            data.proof,
            data.searched_key
        );
        expect(element).to.be.null;
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
        expect(element).to.be.null;
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

    it('should throw error when rootHash parameter of wrong type', function() {
        var args = [
            true, null, undefined, [], {}, 42, new Date()
        ];

        args.forEach(function(rootHash) {
            expect(() => Exonum.merklePatriciaProof(rootHash)).to.throw(TypeError);
        });
    });

    it('should throw error when invalid rootHash parameter', function() {
        var args = [
            '6z56f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
            '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1'
        ];

        args.forEach(function(rootHash) {
            expect(() => Exonum.merklePatriciaProof(rootHash)).to.throw(Error);
        });
    });

    it('should throw error when invalid proofNode parameter', function() {
        var rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13';
        var args = [
            true, null, undefined, [], 42, 'Hello world', new Date()
        ];

        args.forEach(function(proofNode) {
            expect(() => Exonum.merklePatriciaProof(rootHash, proofNode)).to.throw(TypeError);
        });
    });

    it('should throw error when invalid byte array key parameter', function() {
        var rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13';
        var proofNode = {};
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

        args.forEach(function(key) {
            expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error);
        });
    });

    it('should throw error when invalid string key parameter', function() {
        var rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13';
        var proofNode = {};
        var args = [
            '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1',
            '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1z',
            ''
        ];

        args.forEach(function(key) {
            expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error);
        });
    });

    it('should throw error when key parameter of wrong type', function() {
        var rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13';
        var proofNode = {};
        var args = [
            true, null, undefined, 42, [], {}, new Date()
        ];

        args.forEach(function(key) {
            expect(() => Exonum.merklePatriciaProof(rootHash, proofNode, key)).to.throw(Error);
        });
    });

    it('should throw error when root is empty but rootHash is wrong', function() {
        var args = [
            '0000000000000000000000000000000000000000000000000000000000000001',
            {},
            '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
    });

    it('should throw error when key of node is invalid binary string', function() {
        var args = [
            '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
            {'11110000111100': {}},
            '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);

        args = [
            '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
            {'111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001a': {}},
            '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);

        args = [
            '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
            {'1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110013': {}},
            '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
    });

    it('should throw error when it is invalid hash is value of tree node', function() {
        var vals = [
            '',
            '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1',
            '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff1z'
        ];

        vals.forEach(function(val) {
            var args = [
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {'1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': val},
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            ];

            expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
        });
    });

    it('should throw error when wrong rootHash parameter is passed (element is not found)', function() {
        var args = [
            '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
            {'1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'},
            '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
    });

    it('should throw error when invalid key with hash is in the root (element is not found)', function() {
        var args = [
            '335ec501d811725a9e60f89a1b67103e6fa5e65712a007ed33324719a6e2de3a',
            {'1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'},
            'f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3f0f1f2f3'
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
    });

    it('should throw error when value is of invalid type', function() {
        var vals = [
            false, null, undefined, 'Hello world', 42, new Date()
        ];

        vals.forEach(function(val) {
            var args = [
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
                        val: val
                    }
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            ];

            expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
        });
    });

    it('should throw error when invalid symbols in bytes array', function() {
        var vals = [
            [1, 'a', 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]
        ];

        vals.forEach(function(val) {
            var args = [
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
                        val: val
                    }
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            ];

            expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(TypeError);
        });
    });

    it('should throw error when invalid bytes array is on value position', function() {
        var vals = [
            [1, -1, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
            [1, 256, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]
        ];

        vals.forEach(function(val) {
            var args = [
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {
                    '1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': {
                        val: val
                    }
                },
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            ];

            expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(RangeError);
        });
    });

    it('should throw error when invalid value type', function() {
        var vals = [
            false, undefined, [], 42, new Date()
        ];

        vals.forEach(function(val) {
            var args = [
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13',
                {'1111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011111100001111000111110010111100111111000011110001111100101111001111110000111100011111001011110011': val},
                '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
            ];

            expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
        });
    });

    it('should throw error when invalid type parameter', function() {
        var vals = [
            null, false, 42, {}, [], new Date()
        ];

        vals.forEach(function(type) {
            var args = [
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
            ];

            expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(TypeError);
        });
    });

    it('should throw error when single node tree with wrong type parameter', function() {
        var Type = Exonum.newType({
            size: 8,
            fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 8}}
        });
        var args = [
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
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(TypeError);
    });

    it('should throw error when single node tree with rootHash parameter not equal to actual hash (element is found)', function() {
        var Type = Exonum.newType({
            size: 8,
            fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 8}}
        });
        var args = [
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
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
    });

    it('should throw error when single node tree with invalid key with value in the root (element is found)', function() {
        var Type = Exonum.newType({
            size: 8,
            fields: {balance: {type: Exonum.Int64, size: 8, from: 0, to: 8}}
        });
        var args = [
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
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
    });

    it('should throw error when single node tree with invalid key in the root of proofNode parameter', function() {
        var args = [
            '8be78622dc7fd18b069a226133f1e943652bc5d53fd5df3d59735f49da1df692',
            {
                '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': 'dbc1b4c900ffe48d575b5da5c638040125f65db0fe3e24494b76ea986457d986'
            },
            'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
    });

    it('should throw error when single node tree with invalid key with value in the root', function() {
        var args = [
            '8be78622dc7fd18b069a226133f1e943652bc5d53fd5df3d59735f49da1df692',
            {
                '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
                    'val': [
                        2
                    ]
                }
            },
            'f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4f4'
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
    });

    it('should throw error when invalid number of children in the root node', function() {
        var args = [
            '0000000000000000000000000000000000000000000000000000000000000001',
            {
                '1': '',
                '2': '',
                '3': ''
            },
            '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
    });

    it('should throw error when tree with array as key parameter is passed ', function() {
        var args = [
            '8be78622dc7fd18b069a226133f1e943652bc5d53fd5df3d59735f49da1df692',
            {
                '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': 'dbc1b4c900ffe48d575b5da5c638040125f65db0fe3e24494b76ea986457d986'
            },
            [244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244, 244]
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(TypeError);
    });

    it('should throw error when wrong rootHash parameter', function() {
        var data = require('./data/invalid-merkle-patricia-tree-wrong-root-hash.json');
        var args = [
            data.root_hash,
            data.proof,
            data.searched_key
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
    });

    it('should throw error when invalid binary key', function() {
        var args = [
            '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
            {
                '12323': {},
                '5927': {}
            },
            '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(RangeError);
    });

    it('should throw error when tree contains non full key and value of wrong type', function() {
        var rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55';
        var key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3';

        [true, null, undefined, [], 42, new Date()].forEach(function(val) {
            var args = [
                rootHash,
                {
                    '0': val,
                    '1': {}
                },
                key
            ];

            expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(TypeError);
        });
    });

    it('should throw error when tree contains full key and value of wrong type', function() {
        var rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55';
        var key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3';

        [true, null, undefined, [], 42, new Date()].forEach(function(val) {
            var args = [
                rootHash,
                {
                    '0011001010001111110000101101101011111110000101010111001100101110011110010011110000111001011111111011110110100101111111111110111001110011111110011111001110011110111100001100100101110011010010111111011110001001000010000110000001000101101111100000101010100': val,
                    '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                key
            ];

            expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(TypeError);
        });
    });

    it('should throw error when tree contains non full key and invalid hash', function() {
        var rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55';
        var key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3';
        var args = [
            'Hello world',
            'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6ez',
            ''
        ];

        args.forEach(function(val) {
            var args = [
                rootHash,
                {
                    '0': val,
                    '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                key
            ];

            expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
        });
    });

    it('should throw error when tree contains full key and invalid hash', function() {
        var rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55';
        var key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3';
        var args = [
            'Hello world',
            'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6ez',
            ''
        ];

        args.forEach(function(val) {
            var args = [
                rootHash,
                {
                    '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': val,
                    '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                key
            ];

            expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
        });
    });

    it('should throw error when tree contains full key and missed value', function() {
        var args = [
            '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
            {
                '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
                    'age': 5
                },
                '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
            },
            '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
    });

    it('should throw error when tree contains full key and duplicated value', function() {
        var args = [
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
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
    });

    it('should throw error when tree contains non full key and value on wrong position', function() {
        var args = [
            '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
            {
                '011001101': {
                    val: [25, 13]
                },
                '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
            },
            '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
    });

    it('should throw error when tree contains key is of wrong length', function() {
        var args = [
            '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
            {
                '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6',
                '11100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101': {
                    val: [25, 13]
                }
            },
            '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3'
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
    });

    it('should throw error when tree contains full key and value of wrong type', function() {
        var rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55';
        var key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3';

        [false, null, 42].forEach(function(val) {
            var args = [
                rootHash,
                {
                    '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': val,
                    '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                key
            ];

            expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(TypeError);
        });
    });

    it('should throw error when tree contains full key and invalid value', function() {
        var rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55';
        var key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3';

        ['Hello world'].forEach(function(val) {
            var args = [
                rootHash,
                {
                    '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': val,
                    '1': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                key
            ];

            expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
        });
    });

    it('should throw error when tree contains full key and value as invalid binary array', function() {
        var rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55';
        var key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3';

        [[false], [null], ['Hello world'], [[]], [{}], [new Date()]].forEach(function(val) {
            var args = [
                rootHash,
                {
                    '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
                        val: val
                    },
                    '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                key
            ];

            expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(TypeError);
        });
    });

    it('should throw error when tree contains full key and value as binary array with wrong value', function() {
        var rootHash = '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55';
        var key = '2dd5bcc350a02229e987e1d2be7d6a3bc62daab50f8d7ce71eaf69b6093fcdc3';

        [[257]].forEach(function(val) {
            var args = [
                rootHash,
                {
                    '1110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110111001101110011011100110': {
                        val: val
                    },
                    '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
                },
                key
            ];

            expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(RangeError);
        });
    });

    it('should throw error when tree contains full key and wrong type parameter', function() {
        var Wallet = Exonum.newType({
            size: 80,
            fields: {
                pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                name: {type: Exonum.String, size: 8, from: 32, to: 40},
                balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                history_hash: {type: Exonum.Hash, size: 32, from: 48, to: 80}
            }
        });

        var args = [
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
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(TypeError);
    });

    it('should throw error when tree contains non full key and wrong type parameter', function() {
        var Wallet = Exonum.newType({
            size: 80,
            fields: {
                pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                name: {type: Exonum.String, size: 8, from: 32, to: 40},
                balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                history_hash: {type: Exonum.Hash, size: 32, from: 48, to: 80}
            }
        });
        var args = [
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
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(TypeError);
    });

    it('should throw error when tree contains duplicated left leaf', function() {
        var args = [
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
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
    });

    it('should throw error when tree contains duplicated right leaf', function() {
        var args = [
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
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
    });

    it('should throw error when tree contains left key which is part of search key but branch is not expanded', function() {
        var args = [
            '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
            {
                '111': {
                    '01111111010111000100100111101010110010111100011010100000100111111110101011011000011000000000100001000100000101101101100010101110110101101010001100000101110100011101101111100100101110100110010011011100011111011010110010100011111011010011000101111011010': '9be1fdaa5e58640e6c17dba7e734c56ec7ccab77f823933301661e3514284dd7',
                    '11111111010111000100100111101010110010111100011010100000100110111110101011011000011000000000100001000100000101101101100010101110110101101010001100000101110100011101101111100100101110100110010011011100011111011010110010100011111011010011000101111011010': '9be1fdaa5e58640e6c17dba7e734c56ec7ccab77f823933301661e3514284dd7',
                },
                '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
            },
            'ecdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdc'
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
    });

    it('should throw error when tree contains right key which is part of search key but branch is not expanded', function() {
        var args = [
            '95d1d8dbad15bb04478fad0c3a9343ac32502ae975858749a8c29cb24cccdd55',
            {
                '111': {
                    '01111111010111000100100111101010110010111100011010100000100111111110101011011000011000000000100001000100000101101101100010101110110101101010001100000101110100011101101111100100101110100110010011011100011111011010110010100011111011010011000101111011010': '9be1fdaa5e58640e6c17dba7e734c56ec7ccab77f823933301661e3514284dd7',
                    '11111111010111000100100111101010110010111100011010100000100110111110101011011000011000000000100001000100000101101101100010101110110101101010001100000101110100011101101111100100101110100110010011011100011111011010110010100011111011010011000101111011010': '9be1fdaa5e58640e6c17dba7e734c56ec7ccab77f823933301661e3514284dd7',
                },
                '0': 'e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6'
            },
            'fcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdc'
        ];

        expect(() => Exonum.merklePatriciaProof.apply(this, args)).to.throw(Error);
    });

});

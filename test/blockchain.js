var expect = require('chai').expect;
var Exonum = require('../src/index');
var fs = require('fs');

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

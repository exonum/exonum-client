/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const Exonum = require('../src')

describe('Verify block of precommits', function () {
  const validators = [
    '0b513ad9b4924015ca0902ed079044d3ac5dbec2306f06948c10da8eb6e39f2d',
    '91a28a0b74381593a4d9469579208926afc8ad82c8839b7644359b9eba9a4b3a',
    '5c9c6df261c9cb840475776aaefcd944b405328fab28f9b3a95ef40490d3de84',
    '66cd608b928b88e50e0efeaa33faf1c43cefe07294b0b87e9fe0aba6a3cf7633'
  ]
  const networkId = 0

  it('should return true when valid block with precommits', function () {
    const data = require('./common_data/block-with-precommits/valid-block-with-precommits.json')
    expect(Exonum.verifyBlock(data, validators, networkId)).to.be.true
  })

  it('should return false when data of wrong type', function () {
    [null, undefined, 42, 'Hello world', [], {}, new Date()].forEach(function (data) {
      expect(Exonum.verifyBlock(data, validators, networkId)).to.be.false
    })
  })

  it('should return false when block info of wrong type', function () {
    [null, undefined, 42, 'Hello world', [], new Date()].forEach(function (data) {
      expect(Exonum.verifyBlock({ block: data }, validators, networkId)).to.be.false
    })
  })

  it('should return false when precommits info of wrong type', function () {
    [null, undefined, 42, 'Hello world', [], new Date()].forEach(function (precommits) {
      expect(Exonum.verifyBlock({ block: {}, precommits: precommits }, validators, networkId)).to.be.false
    })
  })

  it('should return false when body field of wrong type in precommit', function () {
    [null, 42, 'Hello world', [], new Date()].forEach(function (body) {
      expect(Exonum.verifyBlock({ block: {}, precommits: [{ body: body }] }, validators, networkId)).to.be.false
    })
  })

  it('should return false when signature field of wrong type in precommit', function () {
    [null, undefined, 42, [], {}, new Date()].forEach(function (signature) {
      const data = {
        block: {},
        precommits: [{
          body: {},
          signature: signature
        }]
      }

      expect(Exonum.verifyBlock(data, validators, networkId)).to.be.false
    })
  })

  it('should return false when invalid signature field in precommit', function () {
    const args = [
      '22635e36303ff3ef4c86b855e57356f41483e6637136d1d2ec46ba2ec8f69fb9',
      '22635e36303ff3ef4c86b855e57356f41483e6637136d1d2ec46ba2ec8f69fb922635e36303ff3ef4c86b855e57356f41483e6637136d1d2ec46ba2ec8f69fbz'
    ]

    args.forEach(function (signature) {
      const data = {
        block: {},
        precommits: [{
          body: {},
          signature: signature
        }]
      }

      expect(Exonum.verifyBlock(data, validators, networkId)).to.be.false
    })
  })

  it('should return false when precommit from non existed validator', function () {
    const data = {
      block: {},
      precommits: [{
        body: {
          validator: 999999999
        },
        signature: '63b8341b82f0eb6f32be73bf36a4b605655e3979030df9e025713c972d1da6d263b8341b82f0eb6f32be73bf36a4b605655e3979030df9e025713c972d1da6d2'
      }]
    }

    expect(Exonum.verifyBlock(data, validators, networkId)).to.be.false
  })

  it('should return false when wrong height of block in precommit', function () {
    const data = {
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
    }

    expect(Exonum.verifyBlock(data, validators, networkId)).to.be.false
  })

  it('should return false when wrong hash of block in precommit', function () {
    const data = {
      block: {
        height: '5',
        propose_round: 3,
        prev_hash: 'fe5c606da552b2a3ad0ff8ef400a7071e9e72ab3b5f5c2996416ceb86c7f2c1e',
        tx_hash: '136c7952ed9f26b477797c23cf3d02faa46863ecc70d595b0b227027aacd0f94',
        state_hash: 'bea2a1defd3b2ab410a1f501805d10ad94d30a5b5a1240574cade1553a60e189'
      },
      precommits: [
        {
          body: {
            validator: 0,
            height: '5',
            round: 3,
            propose_hash: '1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a',
            block_hash: '1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a'
          },
          protocol_version: 0,
          message_id: 4,
          service_id: 0,
          signature: '4616ef4bfac86c8ded9aa9c7e84958574e3f9df4f7aadea8b37dcdb40ebedd8ac009f8a9b54bd907bf4f43289bfec72e47e6338912f282a6b5a5ce8c558ef50b'
        },
        {
          body: {
            validator: 2,
            height: '5',
            round: 3,
            propose_hash: '1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a',
            block_hash: '1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a'
          },
          protocol_version: 0,
          message_id: 4,
          service_id: 0,
          signature: '5253cba87af1abac95c7c92f06b2b286af84353fd060ea1069f107094d97298473fe6431613c3e2d02d92624c82394b86cec047cd681e0f3fc98f0f877383a04'
        },
        {
          body: {
            validator: 3,
            height: '5',
            round: 3,
            propose_hash: '1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a',
            block_hash: '1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a'
          },
          protocol_version: 0,
          message_id: 4,
          service_id: 0,
          signature: 'e35a3cb1ca834cce77d67d5945ef1d7021488a357a35e973cd1ef17099d4db55a28123d95f9c5dcedf34c86a12c20e91cc47622612039115f2a376d7e5f7ab00'
        }
      ]
    }

    expect(Exonum.verifyBlock(data, validators, networkId)).to.be.false
  })

  it('should return false when wrong round in precommit', function () {
    const data = {
      block: {
        height: '5',
        propose_round: 3,
        prev_hash: 'fe5c606da552b2a3ad0ff8ef400a7071e9e72ab3b5f5c2996416ceb86c7f2c1e',
        tx_hash: '136c7952ed9f26b477797c23cf3d02faa46863ecc70d595b0b227027aacd0f94',
        state_hash: 'bea2a1defd3b2ab410a1f501805d10ad94d30a5b5a1240574cade1553a60e189'
      },
      precommits: [
        {
          body: {
            validator: 0,
            height: '5',
            round: 3,
            propose_hash: '1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a',
            block_hash: 'c2513f88478a32767c3cf7c068d60523212a005374d8d7398473c9601bf3d369'
          },
          protocol_version: 0,
          message_id: 4,
          service_id: 0,
          signature: '4616ef4bfac86c8ded9aa9c7e84958574e3f9df4f7aadea8b37dcdb40ebedd8ac009f8a9b54bd907bf4f43289bfec72e47e6338912f282a6b5a5ce8c558ef50b'
        },
        {
          body: {
            validator: 2,
            height: '5',
            round: 3,
            propose_hash: '1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a',
            block_hash: 'c2513f88478a32767c3cf7c068d60523212a005374d8d7398473c9601bf3d369'
          },
          protocol_version: 0,
          message_id: 4,
          service_id: 0,
          signature: '5253cba87af1abac95c7c92f06b2b286af84353fd060ea1069f107094d97298473fe6431613c3e2d02d92624c82394b86cec047cd681e0f3fc98f0f877383a04'
        },
        {
          body: {
            validator: 1,
            height: '5',
            round: 7,
            propose_hash: '1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a',
            block_hash: 'c2513f88478a32767c3cf7c068d60523212a005374d8d7398473c9601bf3d369'
          },
          protocol_version: 0,
          message_id: 4,
          service_id: 0,
          signature: 'fc7d8d9150db263f03cb8a141b6a372a0bed1fa21128907b52485ad37ea19e71342ebbd8f80e76c81e42d125e3a2e4e15189212f6f78a307005c63c0eade6c06'
        }
      ]
    }

    expect(Exonum.verifyBlock(data, validators, networkId)).to.be.false
  })

  it('should return false when wrong signature of precommit', function () {
    const data = {
      block: {
        height: '5',
        propose_round: 3,
        prev_hash: 'fe5c606da552b2a3ad0ff8ef400a7071e9e72ab3b5f5c2996416ceb86c7f2c1e',
        tx_hash: '136c7952ed9f26b477797c23cf3d02faa46863ecc70d595b0b227027aacd0f94',
        state_hash: 'bea2a1defd3b2ab410a1f501805d10ad94d30a5b5a1240574cade1553a60e189'
      },
      precommits: [
        {
          body: {
            validator: 0,
            height: '5',
            round: 3,
            propose_hash: '1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a',
            block_hash: 'c2513f88478a32767c3cf7c068d60523212a005374d8d7398473c9601bf3d369'
          },
          protocol_version: 0,
          message_id: 4,
          service_id: 0,
          signature: '5616ef4bfac86c8ded9aa9c7e84958574e3f9df4f7aadea8b37dcdb40ebedd8ac009f8a9b54bd907bf4f43289bfec72e47e6338912f282a6b5a5ce8c558ef50b'
        }
      ]
    }

    expect(Exonum.verifyBlock(data, validators, networkId)).to.be.false
  })

  it('should return false when insufficient precommits from unique validators', function () {
    const data = {
      block: {
        height: '5',
        propose_round: 3,
        prev_hash: 'fe5c606da552b2a3ad0ff8ef400a7071e9e72ab3b5f5c2996416ceb86c7f2c1e',
        tx_hash: '136c7952ed9f26b477797c23cf3d02faa46863ecc70d595b0b227027aacd0f94',
        state_hash: 'bea2a1defd3b2ab410a1f501805d10ad94d30a5b5a1240574cade1553a60e189'
      },
      precommits: [
        {
          body: {
            validator: 0,
            height: '5',
            round: 3,
            propose_hash: '1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a',
            block_hash: 'c2513f88478a32767c3cf7c068d60523212a005374d8d7398473c9601bf3d369'
          },
          protocol_version: 0,
          message_id: 4,
          service_id: 0,
          signature: '4616ef4bfac86c8ded9aa9c7e84958574e3f9df4f7aadea8b37dcdb40ebedd8ac009f8a9b54bd907bf4f43289bfec72e47e6338912f282a6b5a5ce8c558ef50b'
        }
      ]
    }

    expect(Exonum.verifyBlock(data, validators, networkId)).to.be.false
  })

  it('should return false when validators of wrong type', function () {
    const block = {
      block: {
        height: '5',
        propose_round: 3,
        prev_hash: 'fe5c606da552b2a3ad0ff8ef400a7071e9e72ab3b5f5c2996416ceb86c7f2c1e',
        tx_hash: '136c7952ed9f26b477797c23cf3d02faa46863ecc70d595b0b227027aacd0f94',
        state_hash: 'bea2a1defd3b2ab410a1f501805d10ad94d30a5b5a1240574cade1553a60e189'
      },
      precommits: [
        {
          body: {
            validator: 0,
            height: '5',
            round: 3,
            propose_hash: '1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a',
            block_hash: 'c2513f88478a32767c3cf7c068d60523212a005374d8d7398473c9601bf3d369'
          },
          protocol_version: 0,
          message_id: 4,
          service_id: 0,
          signature: '4616ef4bfac86c8ded9aa9c7e84958574e3f9df4f7aadea8b37dcdb40ebedd8ac009f8a9b54bd907bf4f43289bfec72e47e6338912f282a6b5a5ce8c558ef50b'
        },
        {
          body: {
            validator: 2,
            height: '5',
            round: 3,
            propose_hash: '1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a',
            block_hash: 'c2513f88478a32767c3cf7c068d60523212a005374d8d7398473c9601bf3d369'
          },
          protocol_version: 0,
          message_id: 4,
          service_id: 0,
          signature: '5253cba87af1abac95c7c92f06b2b286af84353fd060ea1069f107094d97298473fe6431613c3e2d02d92624c82394b86cec047cd681e0f3fc98f0f877383a04'
        },
        {
          body: {
            validator: 3,
            height: '5',
            round: 3,
            propose_hash: '1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a',
            block_hash: 'c2513f88478a32767c3cf7c068d60523212a005374d8d7398473c9601bf3d369'
          },
          protocol_version: 0,
          message_id: 4,
          service_id: 0,
          signature: 'e35a3cb1ca834cce77d67d5945ef1d7021488a357a35e973cd1ef17099d4db55a28123d95f9c5dcedf34c86a12c20e91cc47622612039115f2a376d7e5f7ab00'
        }
      ]
    };

    [undefined, [true], [undefined], [null], [42], [[]], [{}], [new Date()]].forEach(function (validators) {
      expect(Exonum.verifyBlock(block, validators, networkId)).to.be.false
    })
  })

  it('should return false when validators of wrong type', function () {
    const block = {
      block: {
        height: '5',
        propose_round: 3,
        prev_hash: 'fe5c606da552b2a3ad0ff8ef400a7071e9e72ab3b5f5c2996416ceb86c7f2c1e',
        tx_hash: '136c7952ed9f26b477797c23cf3d02faa46863ecc70d595b0b227027aacd0f94',
        state_hash: 'bea2a1defd3b2ab410a1f501805d10ad94d30a5b5a1240574cade1553a60e189'
      },
      precommits: [
        {
          body: {
            validator: 0,
            height: '5',
            round: 3,
            propose_hash: '1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a',
            block_hash: 'c2513f88478a32767c3cf7c068d60523212a005374d8d7398473c9601bf3d369'
          },
          signature: '4616ef4bfac86c8ded9aa9c7e84958574e3f9df4f7aadea8b37dcdb40ebedd8ac009f8a9b54bd907bf4f43289bfec72e47e6338912f282a6b5a5ce8c558ef50b'
        },
        {
          body: {
            validator: 2,
            height: '5',
            round: 3,
            propose_hash: '1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a',
            block_hash: 'c2513f88478a32767c3cf7c068d60523212a005374d8d7398473c9601bf3d369'
          },
          signature: '5253cba87af1abac95c7c92f06b2b286af84353fd060ea1069f107094d97298473fe6431613c3e2d02d92624c82394b86cec047cd681e0f3fc98f0f877383a04'
        },
        {
          body: {
            validator: 3,
            height: '5',
            round: 3,
            propose_hash: '1783d20a053b5c45b40e76358a51a7fce90eea391a409decfb9f9cbbb5a4875a',
            block_hash: 'c2513f88478a32767c3cf7c068d60523212a005374d8d7398473c9601bf3d369'
          },
          signature: 'e35a3cb1ca834cce77d67d5945ef1d7021488a357a35e973cd1ef17099d4db55a28123d95f9c5dcedf34c86a12c20e91cc47622612039115f2a376d7e5f7ab00'
        }
      ]
    };

    [['asda123'], ['eb7e3ad55f97e5d5693fe0e69f4c26bd1173077dbffb5fff5b69f213f71bee3f']].forEach(function (validators) {
      expect(Exonum.verifyBlock(block, validators, networkId)).to.be.false
    })
  })
})

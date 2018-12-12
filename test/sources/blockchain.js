/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const MockAdapter = require('axios-mock-adapter')
const axios = require('axios')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const assert = chai.assert
const expect = chai.expect
const Exonum = require('../../src')
const proto = require('./proto/cryptocurrency.js')

chai.use(chaiAsPromised)
const mock = new MockAdapter(axios)

describe('Verify block of precommits', function () {
  const validators = [
    '2006d14a17808b39d803087cb7c4346a692714e82cf5c4868fc2dbe736fe5e38'
  ]

  it('should return fulfilled promise result when block with precommits is valid', function () {
    const data = require('./common_data/block-with-precommits/valid-block-with-precommits.json')
    return assert.isFulfilled(Exonum.verifyBlock(data, validators))
  })

  it('should throw error when precommit height is unexpected', function () {
    const data = {
      'block': {
        'proposer_id': 0,
        'height': 44128,
        'tx_count': 0,
        'prev_hash': '1eaa862bc8a0d17bcd0d524cdc7bb53245daa702290e794c80180e20a7e261bd',
        'tx_hash': '0000000000000000000000000000000000000000000000000000000000000000',
        'state_hash': '6a445788116c7c95417de326720bb1a9e56f01d2fe72315b4879b58be905bd02'
      },
      'precommits': [
        '2006d14a17808b39d803087cb7c4346a692714e82cf5c4868fc2dbe736fe5e38010010e1d802180122220a208524f6073155a6e7f18e0003eaa5cc254ab1345f7b2c51aa2a02da471640c2a52a220a20e2006e4a899f3686b8bb5b3f0274cb1fbf394f304a0bde08ee5ae2795d9f7a5f320c089aaba4e00510c897c8be026b49be4e61f47b5cd23264f63e7bf02e15bfa642aa558d0db8e9997699cb66b04721366a4c16a842c1e1733155d63c79f6b660e9cbfa10e6f939fc6cc2148104'
      ]
    }
    return assert.isRejected(Exonum.verifyBlock(data, validators), Error, 'Precommit height is not match with block height')
  })

  it('should throw error when block hash is unexpected', function () {
    const data = {
      'block': {
        'proposer_id': 1,
        'height': 44129,
        'tx_count': 0,
        'prev_hash': '1eaa862bc8a0d17bcd0d524cdc7bb53245daa702290e794c80180e20a7e261bd',
        'tx_hash': '0000000000000000000000000000000000000000000000000000000000000000',
        'state_hash': '6a445788116c7c95417de326720bb1a9e56f01d2fe72315b4879b58be905bd02'
      },
      'precommits': [
        '2006d14a17808b39d803087cb7c4346a692714e82cf5c4868fc2dbe736fe5e38010010e1d802180122220a208524f6073155a6e7f18e0003eaa5cc254ab1345f7b2c51aa2a02da471640c2a52a220a20e2006e4a899f3686b8bb5b3f0274cb1fbf394f304a0bde08ee5ae2795d9f7a5f320c089aaba4e00510c897c8be026b49be4e61f47b5cd23264f63e7bf02e15bfa642aa558d0db8e9997699cb66b04721366a4c16a842c1e1733155d63c79f6b660e9cbfa10e6f939fc6cc2148104'
      ]
    }
    return assert.isRejected(Exonum.verifyBlock(data, validators), Error, 'Precommit block hash is not match with calculated block hash')
  })

  it('should throw error when public key is unexpected', function () {
    const data = {
      'block': {
        'proposer_id': 0,
        'height': 44129,
        'tx_count': 0,
        'prev_hash': '1eaa862bc8a0d17bcd0d524cdc7bb53245daa702290e794c80180e20a7e261bd',
        'tx_hash': '0000000000000000000000000000000000000000000000000000000000000000',
        'state_hash': '6a445788116c7c95417de326720bb1a9e56f01d2fe72315b4879b58be905bd02'
      },
      'precommits': [
        '2106d14a17808b39d803087cb7c4346a692714e82cf5c4868fc2dbe736fe5e38010010e1d802180122220a208524f6073155a6e7f18e0003eaa5cc254ab1345f7b2c51aa2a02da471640c2a52a220a20e2006e4a899f3686b8bb5b3f0274cb1fbf394f304a0bde08ee5ae2795d9f7a5f320c089aaba4e00510c897c8be026b49be4e61f47b5cd23264f63e7bf02e15bfa642aa558d0db8e9997699cb66b04721366a4c16a842c1e1733155d63c79f6b660e9cbfa10e6f939fc6cc2148104'
      ]
    }
    return assert.isRejected(Exonum.verifyBlock(data, validators), Error, 'Precommit public key is not match with buffer')
  })

  it('should throw error when signature is unexpected', function () {
    const data = {
      'block': {
        'proposer_id': 0,
        'height': 44129,
        'tx_count': 0,
        'prev_hash': '1eaa862bc8a0d17bcd0d524cdc7bb53245daa702290e794c80180e20a7e261bd',
        'tx_hash': '0000000000000000000000000000000000000000000000000000000000000000',
        'state_hash': '6a445788116c7c95417de326720bb1a9e56f01d2fe72315b4879b58be905bd02'
      },
      'precommits': [
        '2006d14a17808b39d803087cb7c4346a692714e82cf5c4868fc2dbe736fe5e38010010e1d802180122220a208524f6073155a6e7f18e0003eaa5cc254ab1345f7b2c51aa2a02da471640c2a52a220a20e2006e4a899f3686b8bb5b3f0274cb1fbf394f304a0bde08ee5ae2795d9f7a5f320c089aaba4e00510c897c8be026b49be4e61f47b5cd23264f63e7bf02e15bfa642aa558d0db8e9997699cb66b04721366a4c16a842c1e1733155d63c79f6b660e9cbfa10e6f939fc6cc2148105'
      ]
    }
    return assert.isRejected(Exonum.verifyBlock(data, validators), Error, 'Precommit signature is wrong')
  })
})

describe('Verify table existence', function () {
  const proof = {
    'entries': [
      {
        'key': '50c8ba3a6170f0a2fb6736ece8a603576ef6309a35e810911599bc6211b554a9',
        'value': 'b6515d670579b2932bc4295398a631f2b57bf4690f8a61893b02a470649022a2'
      }
    ],
    'proof': [
      {
        'path': '0000101010101110110000001010110110011000000001100011001110110111000101011001101100100100000010011111001000011101110010101110111001111111101111101110100011111110000111011111101111110011011010100100110101110010101000101110101000100110011100100010101101100001',
        'hash': '0000000000000000000000000000000000000000000000000000000000000000'
      },
      {
        'path': '11',
        'hash': '9a956751533579014822f8265925f7ed591a9af654e75b129f999e549f7e8ae6'
      }
    ]
  }
  const serviceId = 128
  const tableIndex = 0
  const stateHash = '6a445788116c7c95417de326720bb1a9e56f01d2fe72315b4879b58be905bd02'
  const rootHash = 'b6515d670579b2932bc4295398a631f2b57bf4690f8a61893b02a470649022a2'

  it('should return root hash when valid proof', function () {
    expect(Exonum.verifyTable(proof, stateHash, serviceId, tableIndex)).to.equals(rootHash)
  })

  it('should throw error when merkleRoot is unexpected', function () {
    expect(() => Exonum.verifyTable(proof, '', serviceId, tableIndex))
      .to.throw(Error, 'Table proof is corrupted')
  })
})

describe('Send transaction to the blockchain', function () {
  const keyPair = {
    publicKey: '78cf8b5e5c020696319eb32a1408e6c65e7d97733d34528fbdce08438a0243e8',
    secretKey: 'b5b3ccf6ca4475b7ff3d910d5ab31e4723098490a3e341dd9d2896b42ebc9f8978cf8b5e5c020696319eb32a1408e6c65e7d97733d34528fbdce08438a0243e8'
  }
  const sendFunds = Exonum.newTransaction({
    author: keyPair.publicKey,
    service_id: 128,
    message_id: 0,
    schema: proto.exonum.examples.cryptocurrency_advanced.Transfer
  })
  const data = {
    to: { data: Exonum.hexadecimalToUint8Array('278663010ebe1136011618ad5be1b9d6f51edc5b6c6b51b5450ffc72f54a57df') },
    amount: '25',
    seed: '7743941227375415562'
  }
  const txHash = 'b4f78eab1d9b0b04a82f77f30ac0656e3a41765a4fccb513f8f6e4571a1f4003'
  const explorerBasePath = '/api/explorer/v1/transactions'
  const transactionPath = `${explorerBasePath}?hash=${txHash}`

  describe('Valid transaction has been sent', function () {
    before(function () {
      mock
        .onPost(explorerBasePath)
        .replyOnce(200)

      mock
        .onGet(transactionPath)
        .replyOnce(200, {
          type: 'in-pool'
        })
        .onGet(transactionPath)
        .replyOnce(200, {
          type: 'committed'
        })
    })

    after(function () {
      mock.reset()
    })

    it('should return fulfilled Promise state when transaction has accepted to the blockchain', function () {
      return Exonum.send(explorerBasePath, sendFunds, data, keyPair.secretKey).then(response => {
        expect(response).to.deep.equal(txHash)
      })
    })
  })

  describe('Valid transaction has been sent but node processes it very slow', function () {
    before(function () {
      mock
        .onPost(explorerBasePath)
        .replyOnce(200)

      mock
        .onGet(transactionPath)
        .replyOnce(404)
        .onGet(transactionPath)
        .replyOnce(404)
        .onGet(transactionPath)
        .replyOnce(404)
        .onGet(transactionPath)
        .replyOnce(200, {
          type: 'in-pool'
        })
        .onGet(transactionPath)
        .replyOnce(200, {
          type: 'committed'
        })
    })

    after(function () {
      mock.reset()
    })

    it('should return fulfilled Promise state when transaction has accepted to the blockchain', function () {
      this.timeout(5000)
      return Exonum.send(explorerBasePath, sendFunds, data, keyPair.secretKey).then(response => {
        expect(response).to.deep.equal(txHash)
      })
    })
  })

  describe('Valid transaction has been sent with custom attempts and timeout number', function () {
    before(function () {
      mock
        .onPost(explorerBasePath)
        .replyOnce(200)

      mock
        .onGet(transactionPath)
        .replyOnce(200, {
          type: 'in-pool'
        })
        .onGet(transactionPath)
        .replyOnce(200, {
          type: 'in-pool'
        })
        .onGet(transactionPath)
        .replyOnce(200, {
          type: 'in-pool'
        })
        .onGet(transactionPath)
        .replyOnce(200, {
          type: 'in-pool'
        })
        .onGet(transactionPath)
        .replyOnce(200, {
          type: 'in-pool'
        })
        .onGet(transactionPath)
        .replyOnce(200, {
          type: 'in-pool'
        })
        .onGet(transactionPath)
        .replyOnce(200, {
          type: 'committed'
        })
    })

    after(function () {
      mock.reset()
    })

    it('should return fulfilled Promise state when transaction has accepted to the blockchain', function () {
      return Exonum.send(explorerBasePath, sendFunds, data, keyPair.secretKey, 100, 7).then(response => {
        expect(response).to.deep.equal(txHash)
      })
    })
  })

  describe('Valid transaction has been sent with zero attempts', function () {
    before(function () {
      mock
        .onPost(explorerBasePath)
        .replyOnce(200)
    })

    after(function () {
      mock.reset()
    })

    it('should return fulfilled Promise state when transaction has been sent to the blockchain', function () {
      return Exonum.send(explorerBasePath, sendFunds, data, keyPair.secretKey, 0).then(response => {
        expect(response).to.deep.equal(txHash)
      })
    })
  })

  describe('Invalid data has been passed', function () {
    it('should throw error when wrong explorer base path is passed', function () {
      const paths = [null, false, 42, new Date(), {}, []]

      paths.forEach(function (value) {
        expect(() => Exonum.send(value))
          .to.throw(Error, 'Explorer base path endpoint of wrong data type is passed. String is required.')
      })
    })

    it('should throw error when wrong transaction type is passed', function () {
      const types = [null, false, 42, new Date(), '', []]

      types.forEach(function (value) {
        expect(() => Exonum.send(explorerBasePath, value))
          .to.throw(Error, 'Transaction of wrong type is passed.')
      })
    })

    it('should throw error when wrong data is passed', function () {
      const data = [null, false, 42, new Date(), '', []]

      data.forEach(function (value) {
        expect(() => Exonum.send(explorerBasePath, sendFunds, value))
          .to.throw(Error, 'Data of wrong data type is passed. Object is required.')
      })
    })

    it('should throw error when wrong secret key is passed', function () {
      const keys = [null, false, 42, new Date(), '', {}, []]

      keys.forEach(function (value) {
        expect(() => Exonum.send(explorerBasePath, sendFunds, data, value))
          .to.throw(Error, 'secretKey of wrong type is passed. Hexadecimal expected.')
      })
    })

    it('should throw error when wrong transaction attempts number is passed', function () {
      const types = [null, false, new Date(), '', {}, []]

      types.forEach(function (value) {
        expect(() => Exonum.send(explorerBasePath, sendFunds, data, keyPair.secretKey, value))
          .to.throw(Error, 'Attempts of wrong type is passed.')
      })
    })

    it('should throw error when wrong transaction timeout is passed', function () {
      const timeouts = [null, false, new Date(), '', {}, []]

      timeouts.forEach(function (value) {
        expect(() => Exonum.send(explorerBasePath, sendFunds, data, keyPair.secretKey, 500, value))
          .to.throw(Error, 'Timeout of wrong type is passed.')
      })
    })
  })

  describe('Unexpected node behavior', function () {
    describe('Stay suspended in pool', function () {
      before(function () {
        mock
          .onPost(explorerBasePath)
          .reply(200)

        mock
          .onGet(transactionPath)
          .reply(200, {
            type: 'in-pool'
          })
      })

      after(function () {
        mock.reset()
      })

      it('should return rejected Promise state', function () {
        return Exonum.send(explorerBasePath, sendFunds, data, keyPair.secretKey, 3, 100).catch(error => {
          expect(() => {
            throw new Error(error)
          }).to.throw(Error, 'The transaction was not accepted to the block for the expected period.')
        })
      })
    })

    describe('Node responded in unknown format', function () {
      before(function () {
        mock
          .onPost(explorerBasePath)
          .reply(200)

        mock
          .onGet(transactionPath)
          .reply(200)
      })

      after(function () {
        mock.reset()
      })

      it('should return rejected Promise state', function () {
        return Exonum.send(explorerBasePath, sendFunds, data, keyPair.secretKey, 3, 100).catch(error => {
          expect(() => {
            throw new Error(error)
          }).to.throw(Error, 'The transaction was not accepted to the block for the expected period.')
        })
      })
    })

    describe('Node responded with error', function () {
      before(function () {
        mock
          .onPost(explorerBasePath)
          .reply(200)

        mock
          .onGet(transactionPath)
          .reply(404)
      })

      after(function () {
        mock.reset()
      })

      it('should return rejected Promise state', function () {
        return Exonum.send(explorerBasePath, sendFunds, data, keyPair.secretKey, 3, 100).catch(error => {
          expect(() => {
            throw new Error(error)
          }).to.throw(Error, 'The request failed or the blockchain node did not respond.')
        })
      })
    })
  })
})

describe('Send multiple transactions to the blockchain', function () {
  const keyPair = {
    publicKey: '78cf8b5e5c020696319eb32a1408e6c65e7d97733d34528fbdce08438a0243e8',
    secretKey: 'b5b3ccf6ca4475b7ff3d910d5ab31e4723098490a3e341dd9d2896b42ebc9f8978cf8b5e5c020696319eb32a1408e6c65e7d97733d34528fbdce08438a0243e8'
  }
  let sendFunds = Exonum.newTransaction({
    author: keyPair.publicKey,
    service_id: 128,
    message_id: 0,
    schema: proto.exonum.examples.cryptocurrency_advanced.Transfer
  })
  const explorerBasePath = '/api/explorer/v1/transactions'
  const transactions = [
    {
      data: {
        to: { data: Exonum.hexadecimalToUint8Array('278663010ebe1136011618ad5be1b9d6f51edc5b6c6b51b5450ffc72f54a57df') },
        amount: '20',
        seed: '8452680960415703000'
      },
      type: sendFunds
    },
    {
      data: {
        to: { data: Exonum.hexadecimalToUint8Array('278663010ebe1136011618ad5be1b9d6f51edc5b6c6b51b5450ffc72f54a57df') },
        amount: '25',
        seed: '7743941227375415562'
      },
      type: sendFunds
    }
  ]
  const transactionHashes = [
    'dcea2d6b9dd46ae6f4da47f1e3d79f5fa0348b3b156be714d2d9471d7f476482',
    'b4f78eab1d9b0b04a82f77f30ac0656e3a41765a4fccb513f8f6e4571a1f4003'
  ]

  transactions.forEach(transaction => {
    console.log(transaction)
    transaction.signature = transaction.type.sign(keyPair.secretKey, transaction.data)
  })

  describe('Queue of valid transactions has been sent', function () {
    before(function () {
      mock
        .onPost(explorerBasePath)
        .reply(200)

      mock
        .onGet(`${explorerBasePath}?hash=${transactionHashes[0]}`)
        .replyOnce(200, { type: 'in-pool' })
        .onGet(`${explorerBasePath}?hash=${transactionHashes[0]}`)
        .replyOnce(200, { type: 'committed' })
        .onGet(`${explorerBasePath}?hash=${transactionHashes[1]}`)
        .replyOnce(200, { type: 'in-pool' })
        .onGet(`${explorerBasePath}?hash=${transactionHashes[1]}`)
        .replyOnce(200, { type: 'committed' })
    })

    after(function () {
      mock.reset()
    })

    it('should return fulfilled Promise state when queue of valid transactions has been accepted to the blockchain', function () {
      return Exonum.sendQueue(explorerBasePath, transactions, keyPair.secretKey).then(response => {
        expect(response).to.deep.equal(transactionHashes)
      })
    })
  })

  describe('Queue of valid transactions has been sent with zero attempts', function () {
    before(function () {
      mock
        .onPost(explorerBasePath)
        .reply(200)
    })

    after(function () {
      mock.reset()
    })

    it('should return fulfilled Promise state when queue of valid transactions has been sent to the blockchain', function () {
      return Exonum.sendQueue(explorerBasePath, transactions, keyPair.secretKey, 0).then(response => {
        expect(response).to.deep.equal(transactionHashes)
      })
    })
  })
})

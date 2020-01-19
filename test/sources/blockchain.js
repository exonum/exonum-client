/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const MockAdapter = require('axios-mock-adapter')
const axios = require('axios')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const assert = chai.assert
const expect = chai.expect
const Exonum = require('../../src')

const proto = require('./proto/stubs')
const { cryptocurrency_advanced: cryptocurrency } = proto.exonum.examples

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

describe('Verify table existence', () => {
  // FIXME
  const proof = {}
  const stateHash = '14bb036786f213f573dc50f2550f8d23664ce9a3f3c32ea4060d704e139ac51b'
  const rootHash = '8ea22c377194b41307f8c8db6271737f0dfe938ad2ec21184f785ab39430bb13'

  it('should return root hash with valid proof', () => {
    expect(Exonum.verifyTable(proof, stateHash, 'token.wallets')).to.equal(rootHash)
  })

  it('should throw error when merkleRoot is unexpected', () => {
    expect(() => Exonum.verifyTable(proof, '', 'token.wallets'))
      .to.throw(Error, 'Table proof is corrupted')
  })
})

describe('Send transaction to the blockchain', () => {
  const sendFunds = new Exonum.Transaction({
    schema: cryptocurrency.Transfer,
    serviceId: 128,
    methodId: 1
  })

  const keyPair = {
    publicKey: '78cf8b5e5c020696319eb32a1408e6c65e7d97733d34528fbdce08438a0243e8',
    secretKey: 'b5b3ccf6ca4475b7ff3d910d5ab31e4723098490a3e341dd9d2896b42ebc9f8978cf8b5e5c020696319eb32a1408e6c65e7d97733d34528fbdce08438a0243e8'
  }
  const data = {
    to: {
      data: Exonum.hexadecimalToUint8Array('278663010ebe1136011618ad5be1b9d6f51edc5b6c6b51b5450ffc72f54a57df')
    },
    amount: '25',
    seed: '7743941227375415562'
  }
  const transaction = sendFunds.create(data, keyPair).serialize()

  const txHash = 'b4f78eab1d9b0b04a82f77f30ac0656e3a41765a4fccb513f8f6e4571a1f4003'
  const explorerBasePath = '/api/explorer/v1/transactions'
  const transactionPath = `${explorerBasePath}?hash=${txHash}`

  describe('Valid transaction has been sent', () => {
    before(() => {
      mock
        .onPost(explorerBasePath)
        .replyOnce(200, { tx_hash: txHash })

      mock
        .onGet(transactionPath)
        .replyOnce(200, { type: 'in_pool' })
        .onGet(transactionPath)
        .replyOnce(200, { type: 'committed' })
    })

    after(() => mock.reset())

    it('should return fulfilled Promise state when transaction has accepted to the blockchain', async () => {
      const response = await Exonum.send(explorerBasePath, transaction)
      expect(response).to.deep.equal(txHash)
    })
  })

  describe('Valid transaction has been sent but node processes it very slow', () => {
    before(() => {
      mock
        .onPost(explorerBasePath)
        .replyOnce(200, { tx_hash: txHash })

      mock
        .onGet(transactionPath)
        .replyOnce(404)
        .onGet(transactionPath)
        .replyOnce(404)
        .onGet(transactionPath)
        .replyOnce(404)
        .onGet(transactionPath)
        .replyOnce(200, { type: 'in_pool' })
        .onGet(transactionPath)
        .replyOnce(200, { type: 'committed' })
    })

    after(() => mock.reset())

    it('should return fulfilled Promise state when transaction has accepted to the blockchain', async function () {
      this.timeout(5000)
      const response = await Exonum.send(explorerBasePath, transaction)
      expect(response).to.deep.equal(txHash)
    })
  })

  describe('Valid transaction has been sent with custom attempts and timeout number', function () {
    before(() => {
      mock
        .onPost(explorerBasePath)
        .replyOnce(200, { tx_hash: txHash })

      mock
        .onGet(transactionPath)
        .replyOnce(200, { type: 'in_pool' })
        .onGet(transactionPath)
        .replyOnce(200, { type: 'in_pool' })
        .onGet(transactionPath)
        .replyOnce(200, { type: 'in_pool' })
        .onGet(transactionPath)
        .replyOnce(200, { type: 'in_pool' })
        .onGet(transactionPath)
        .replyOnce(200, { type: 'in_pool' })
        .onGet(transactionPath)
        .replyOnce(200, { type: 'in_pool' })
        .onGet(transactionPath)
        .replyOnce(200, { type: 'committed' })
    })

    after(() => mock.reset())

    it('should return fulfilled Promise state when transaction has accepted to the blockchain', async function () {
      this.timeout(5000)
      const response = await Exonum.send(explorerBasePath, transaction, 100, 7)
      expect(response).to.deep.equal(txHash)
    })
  })

  describe('Invalid data has been passed', function () {
    it('should throw error when wrong explorer base path is passed', async () => {
      const paths = [null, false, 42, new Date(), {}, []]

      for (let value of paths) {
        await expect(Exonum.send(value, transaction))
          .to.be.rejectedWith('Explorer base path endpoint of wrong data type is passed.')
      }
    })
  })

  describe('Unexpected node behavior', function () {
    describe('Stay suspended in pool', function () {
      before(() => {
        mock
          .onPost(explorerBasePath)
          .reply(200, { tx_hash: txHash })

        mock
          .onGet(transactionPath)
          .reply(200, { type: 'in_pool' })
      })

      after(() => mock.reset())

      it('should return rejected Promise state', async () => {
        await expect(Exonum.send(explorerBasePath, transaction, 3, 100))
          .to.be.rejectedWith('The transaction was not accepted to the block for the expected period.')
      })
    })

    describe('Node responded in unknown format', () => {
      before(() => {
        mock
          .onPost(explorerBasePath)
          .reply(200, { tx_hash: txHash })

        mock
          .onGet(transactionPath)
          .reply(200)
      })

      after(() => mock.reset())

      it('should return rejected Promise state', async () => {
        await expect(Exonum.send(explorerBasePath, transaction, 3, 100))
          .to.be.rejectedWith('The request failed or the blockchain node did not respond.')
      })
    })

    describe('Node responded with error', () => {
      before(() => {
        mock
          .onPost(explorerBasePath)
          .reply(200, { tx_hash: txHash })

        mock
          .onGet(transactionPath)
          .reply(404)
      })

      after(() => mock.reset())

      it('should return rejected Promise state', async () => {
        await expect(Exonum.send(explorerBasePath, transaction, 3, 100))
          .to.be.rejectedWith('The request failed or the blockchain node did not respond.')
      })
    })
  })
})

describe('Send multiple transactions to the blockchain', function () {
  const keyPair = {
    publicKey: '78cf8b5e5c020696319eb32a1408e6c65e7d97733d34528fbdce08438a0243e8',
    secretKey: 'b5b3ccf6ca4475b7ff3d910d5ab31e4723098490a3e341dd9d2896b42ebc9f8978cf8b5e5c020696319eb32a1408e6c65e7d97733d34528fbdce08438a0243e8'
  }
  const sendFunds = new Exonum.Transaction({
    schema: cryptocurrency.Transfer,
    serviceId: 128,
    methodId: 0
  })
  const explorerBasePath = '/api/explorer/v1/transactions'
  const transactionData = [
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
  const transactions = transactionData.map(data => sendFunds.create(data, keyPair))
  const transactionHashes = [
    'dcea2d6b9dd46ae6f4da47f1e3d79f5fa0348b3b156be714d2d9471d7f476482',
    'b4f78eab1d9b0b04a82f77f30ac0656e3a41765a4fccb513f8f6e4571a1f4003'
  ]

  describe('Queue of valid transactions has been sent', () => {
    before(() => {
      let txIndex = 0
      mock
        .onPost(explorerBasePath)
        .reply(() => [200, { tx_hash: transactionHashes[txIndex++] }])

      mock
        .onGet(`${explorerBasePath}?hash=${transactionHashes[0]}`)
        .replyOnce(200, { type: 'in_pool' })
        .onGet(`${explorerBasePath}?hash=${transactionHashes[0]}`)
        .replyOnce(200, { type: 'committed' })
        .onGet(`${explorerBasePath}?hash=${transactionHashes[1]}`)
        .replyOnce(200, { type: 'in_pool' })
        .onGet(`${explorerBasePath}?hash=${transactionHashes[1]}`)
        .replyOnce(200, { type: 'committed' })
    })

    after(() => mock.reset())

    it('should return fulfilled Promise', async () => {
      const response = await Exonum.sendQueue(explorerBasePath, transactions)
      expect(response).to.deep.equal(transactionHashes)
    })
  })
})

describe('Export proto stubs', () => {
  it('should export blockchain stubs', () => {
    expect(Exonum.protocol.exonum.Block).to.be.a('function')
    expect(Exonum.protocol.exonum.TxLocation).to.be.a('function')
  })

  it('should export helpers stubs', () => {
    expect(Exonum.protocol.exonum.crypto.Hash).to.be.a('function')
    expect(Exonum.protocol.exonum.crypto.PublicKey).to.be.a('function')
  })
})

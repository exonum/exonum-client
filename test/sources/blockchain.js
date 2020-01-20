/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

import { uint8ArrayToHexadecimal } from '../../src/types'

const MockAdapter = require('axios-mock-adapter')
const axios = require('axios')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const { expect } = chai
const Exonum = require('../../src')

const proto = require('./proto/stubs')
const { cryptocurrency_advanced: cryptocurrency } = proto.exonum.examples

chai.use(chaiAsPromised)
const mock = new MockAdapter(axios)

describe('Verify block of precommits', function () {
  const validators = [
    '55c48a5ccf060c4ab644277e4a98c6c4f4c480c115477e81523662948fa75a55'
  ]
  const validatorSecretKey =
    'a822fd6e7e8265fbc00f8401696a5bdc34f5a6d2ff3f922f58a28c18576b71e5' +
    '55c48a5ccf060c4ab644277e4a98c6c4f4c480c115477e81523662948fa75a55'

  const validBlockProof = {
    block: {
      height: 123,
      tx_count: 5,
      prev_hash: '4f319987a786107dc63b2b70115b3734cb9880b099b70c463c5e1b05521ab764',
      tx_hash: '0a2c6ea0370d1d49c411a6e2396695fcd4eab03d96e9e7a8a3ec1ec312d9ab38',
      state_hash: '0000000000000000000000000000000000000000000000000000000000000000',
      error_hash: '0000000000000000000000000000000000000000000000000000000000000000',
      additional_headers: {
        headers: {
          proposer_id: [0, 0]
        }
      }
    },
    precommits: [
      '0a5c125a107b180122220a20e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8552a2' +
      '20a201e4d7209d7a1a74b6c51921017324fc926ccf25e6721e158dffd89ff53608b15320c08ccb395f10510f4b5' +
      'b9cb0212220a2055c48a5ccf060c4ab644277e4a98c6c4f4c480c115477e81523662948fa75a551a420a406bb74' +
      'b0ea8362164f73520844a509b5cac80b6852791687a4571b218f9739429ac089be4dc4581d2331ee1e415676903' +
      'e47116e9c69234549f72e6cca1bccf0f'
    ]
  }

  const secondValidator = 'd519b0219afdf43556c4972c6efc37d971c8675ec8d0257b7f8e7f8206fb4d9e'
  const secondPrecommit =
    '0a5e125c0801107b180122220a20e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b85' +
    '52a220a201e4d7209d7a1a74b6c51921017324fc926ccf25e6721e158dffd89ff53608b15320c08d5ba95f10510' +
    'd49cfcb70112220a20d519b0219afdf43556c4972c6efc37d971c8675ec8d0257b7f8e7f8206fb4d9e1a420a402' +
    '77e69dc4050db11814a787f84e2b79318b7e47f8f09c45d8dcd0f26a9a45d08916c542606e8c331c1da6356a089' +
    '4c7b5a07e95b120e34d50d1823d47c045e01'

  it('should work when block with precommits is valid', () => {
    Exonum.verifyBlock(validBlockProof, validators)
  })

  it('should throw error when precommit height is unexpected', () => {
    const invalidBlockProof = {
      block: Object.assign({}, validBlockProof.block),
      precommits: validBlockProof.precommits
    }
    invalidBlockProof.block.height -= 1
    expect(() => Exonum.verifyBlock(invalidBlockProof, validators))
      .to.throw('Precommit height does not match block height')
  })

  it('should throw error when block hash is unexpected', () => {
    const invalidBlockProof = {
      block: Object.assign({}, validBlockProof.block),
      precommits: validBlockProof.precommits
    }
    invalidBlockProof.block.tx_count += 1
    expect(() => Exonum.verifyBlock(invalidBlockProof, validators))
      .to.throw('Precommit block hash does not match calculated block hash')
  })

  it('should throw error when public key is unexpected', () => {
    const invalidBlockProof = {
      block: validBlockProof.block,
      precommits: [secondPrecommit]
    }
    expect(() => Exonum.verifyBlock(invalidBlockProof, validators))
      .to.throw('Precommit public key does not match')
  })

  it('should throw error when signature is unexpected', () => {
    const precommit = validBlockProof.precommits[0]
    // The last bytes of the precommit correspond to the signature
    const mangledPrecommit = precommit.substring(0, precommit.length - 1) + 'a'
    expect(mangledPrecommit).to.not.equal(precommit)

    const invalidBlockProof = {
      block: validBlockProof.block,
      precommits: [mangledPrecommit]
    }
    expect(() => Exonum.verifyBlock(invalidBlockProof, validators))
      .to.throw('Precommit signature is wrong')
  })

  it('should work with 2 validators', () => {
    const allValidators = [validators[0], secondValidator]
    const newBlockProof = {
      block: validBlockProof.block,
      precommits: [validBlockProof.precommits[0], secondPrecommit]
    }
    Exonum.verifyBlock(newBlockProof, allValidators)

    newBlockProof.precommits = [secondPrecommit, validBlockProof.precommits[0]]
    Exonum.verifyBlock(newBlockProof, allValidators)
  })

  it('should throw when number of precommits is insufficient', () => {
    const allValidators = [validators[0], secondValidator]
    expect(() => Exonum.verifyBlock(validBlockProof, allValidators))
      .to.throw('Insufficient number of precommits')
  })

  it('should throw error when transaction is used instead of precommit', () => {
    const keyPair = { publicKey: validators[0], secretKey: validatorSecretKey }
    const sendFunds = new Exonum.Transaction({
      schema: cryptocurrency.Transfer,
      serviceId: 128,
      methodId: 1
    })
    const transactionData = {
      to: {
        data: Exonum.hexadecimalToUint8Array('278663010ebe1136011618ad5be1b9d6f51edc5b6c6b51b5450ffc72f54a57df')
      },
      amount: '25',
      seed: '7743941227375415562'
    }
    const transaction = sendFunds.create(transactionData, keyPair).serialize()
    const invalidBlockProof = {
      block: validBlockProof.block,
      precommits: [uint8ArrayToHexadecimal(transaction)]
    }
    expect(() => Exonum.verifyBlock(invalidBlockProof, validators))
      .to.throw('Invalid message type')
  })

  it('should throw error on double endorsement', () => {
    const allValidators = [validators[0], secondValidator]
    const invalidBlockProof = {
      block: validBlockProof.block,
      precommits: [secondPrecommit, secondPrecommit]
    }
    expect(() => Exonum.verifyBlock(invalidBlockProof, allValidators))
      .to.throw('Double endorsement from a validator')
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

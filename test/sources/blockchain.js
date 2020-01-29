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

chai.use(chaiAsPromised)
const mock = new MockAdapter(axios)

describe('Verify block of precommits', function () {
  const validators = [
    'dff802d1c2563ae95adfc70f0f66ff448fe189a89767f15b5fd2dfc29e0ee99d'
  ]

  it('should return fulfilled promise result when block with precommits is valid', function () {
    const data = require('./common_data/block-with-precommits/valid-block-with-precommits.json')
    return assert.isFulfilled(Exonum.verifyBlock(data, validators))
  })

  it('should throw error when precommit height is unexpected', function () {
    const data = {
      "block": {
        "additional_headers": {
          "headers": {
            "proposer_id": [
              0,
              0
            ]
          }
        },
        "error_hash": "7324b5c72b51bb5d4c180f1109cfd347b60473882145841c39f3e584576296f9",
        "height": 4,
        "prev_hash": "826593dafa78888fe6edec9803d308af63b4ed4cd4ca89251b560ea77c8e4bfc",
        "state_hash": "532a13b3d4346fb27d1c5d08549fb642866ac89863642cea8d8f16b5c54f93f8",
        "tx_count": 1,
        "tx_hash": "587c269e8f27571ff28dd502b527bf6a21f18603b93a9046623bd401e3f96865"
      },
      "precommits": [
        "0a5c225a1003180122220a20d5f94a56173c722a5c847b11a4e8e4f79dc6e6e53d0facfab52bc3023a7d1e8b2a220a208b37037d7b0ae9a6e6140d62d4f0d88406a3501bd33a74f3d98e5303256e816f320c088ed0c4f10510d8ebf2d90212220a20dff802d1c2563ae95adfc70f0f66ff448fe189a89767f15b5fd2dfc29e0ee99d1a420a403d306627272c40dd5593b8279ef48341a60cec6aa555b311bfc6b1adbc1657fcec922c047f8c6976ef87d4fa068d32300f975f79096c293db60d52e57d2def02"
      ]
    }
    return assert.isRejected(Exonum.verifyBlock(data, validators), Error, 'Precommit height is not match with block height')
  })

  it('should throw error when block hash is unexpected', function () {
    const data = {
      "block": {
        "additional_headers": {
          "headers": {
            "proposer_id": [
              0,
              0
            ]
          }
        },
        "error_hash": "7324b5c72b51bb5d4c180f1109cfd347b60473882145841c39f3e584576296f9",
        "height": 3,
        "prev_hash": "826593dafa78888fe6edec9803d308af63b4ed4cd4ca89251b560ea77c8e4bfc",
        "state_hash": "532a13b3d4346fb27d1c5d08549fb642866ac89863642cea8d8f16b5c54f93f8",
        "tx_count": 1,
        "tx_hash": "0000000000000000000000000000000000000000000000000000000000000000"
      },
      "precommits": [
        "0a5c225a1003180122220a20d5f94a56173c722a5c847b11a4e8e4f79dc6e6e53d0facfab52bc3023a7d1e8b2a220a208b37037d7b0ae9a6e6140d62d4f0d88406a3501bd33a74f3d98e5303256e816f320c088ed0c4f10510d8ebf2d90212220a20dff802d1c2563ae95adfc70f0f66ff448fe189a89767f15b5fd2dfc29e0ee99d1a420a403d306627272c40dd5593b8279ef48341a60cec6aa555b311bfc6b1adbc1657fcec922c047f8c6976ef87d4fa068d32300f975f79096c293db60d52e57d2def02"
      ]
    }
    return assert.isRejected(Exonum.verifyBlock(data, validators), Error, 'Precommit block hash is not match with calculated block hash')
  })

  it('should throw error when public key is unexpected', function () {
    const data = {
      "block": {
        "additional_headers": {
          "headers": {
            "proposer_id": [
              0,
              0
            ]
          }
        },
        "error_hash": "7324b5c72b51bb5d4c180f1109cfd347b60473882145841c39f3e584576296f9",
        "height": 3,
        "prev_hash": "826593dafa78888fe6edec9803d308af63b4ed4cd4ca89251b560ea77c8e4bfc",
        "state_hash": "532a13b3d4346fb27d1c5d08549fb642866ac89863642cea8d8f16b5c54f93f8",
        "tx_count": 1,
        "tx_hash": "587c269e8f27571ff28dd502b527bf6a21f18603b93a9046623bd401e3f96865"
      },
      "precommits": [
        "0a5c225a1003180122220a20d5f94a56173c722a5c847b11a4e8e4f79dc6e6e53d0facfab52bc3023a7d1e8b2a220a208b37037d7b0ae9a6e6140d62d4f0d88406a3501bd33a74f3d98e5303256e816f320c088ed0c4f10510d8ebf2d90212220a20dff802d1c2563ae95adfc70f0f66ff448fe189a89767f15b5fd2dfc29e0ee99e1a420a403d306627272c40dd5593b8279ef48341a60cec6aa555b311bfc6b1adbc1657fcec922c047f8c6976ef87d4fa068d32300f975f79096c293db60d52e57d2def02"
      ]
    }
    return assert.isRejected(Exonum.verifyBlock(data, validators), Error, 'Precommit public key is not match with buffer')
  })

  it('should throw error when signature is unexpected', function () {
    const data = {
      "block": {
        "additional_headers": {
          "headers": {
            "proposer_id": [
              0,
              0
            ]
          }
        },
        "error_hash": "7324b5c72b51bb5d4c180f1109cfd347b60473882145841c39f3e584576296f9",
        "height": 3,
        "prev_hash": "826593dafa78888fe6edec9803d308af63b4ed4cd4ca89251b560ea77c8e4bfc",
        "state_hash": "532a13b3d4346fb27d1c5d08549fb642866ac89863642cea8d8f16b5c54f93f8",
        "tx_count": 1,
        "tx_hash": "587c269e8f27571ff28dd502b527bf6a21f18603b93a9046623bd401e3f96865"
      },
      "precommits": [
        "0a5c225a1003180122220a20d5f94a56173c722a5c847b11a4e8e4f79dc6e6e53d0facfab52bc3023a7d1e8b2a220a208b37037d7b0ae9a6e6140d62d4f0d88406a3501bd33a74f3d98e5303256e816f320c088ed0c4f10510d8ebf2d90212220a20dff802d1c2563ae95adfc70f0f66ff448fe189a89767f15b5fd2dfc29e0ee99d1a420a403d306627272c40dd5593b8279ef48341a60cec6aa555b311bfc6b1adbc1657fcec922c047f8c6976ef87d4fa068d32300f975f79096c293db60d52e57d2def03"
      ]
    }
    return assert.isRejected(Exonum.verifyBlock(data, validators), Error, 'Precommit signature is wrong')
  })
})

describe('Verify table existence', function () {
  const proof = {
    entries: [
      {
        key: {
          origin_label: 3,
          local_schema_id: 3,
          index_id: 0
        },
        value: '12c3bf76289af0e08965a13675bd7f832e855e087f8281e033bd301303f70b1a'
      }
    ],
    proof: [
      {
        path: '0000001101011011111000001011011010111001101000010101001100110101000000110110011011111010110001110000001011110110110011000101010101100110100001100100000100110011010101111101110101110011101010110111111110001100010101000010101100111010110010111001001100010010',
        hash: '3e61e7ec4658b460b97cad78b10d638e060b89561499165c8c0a861a6ba2f899'
      },
      {
        path: '0001010101011011001001101111111000110001000101000001101010101101110000111111100011011110111001010000101011001111001010101011011101100010101010110111001010101001110010100011111110111010101110010111101111001010110100011000010010001010111100110100111000010000',
        hash: 'd5b9836080b4487d8880708a01168bd0420a4e6d3302310f1c64016fbf12c3c8'
      },
      {
        path: '0010101000101001110100111110011010110010000111001101000000100110100000000010100010111111110011111010111111110000100101101001011101010001000011100111010010011000101010000101110111110111001101000000001110101001100100001110001111110001000001001111100000011001',
        hash: '5d89f7a6c53eb250b0eab619360fc39a2bd9512e9b3d77909703aeb8700855a0'
      },
      {
        path: '0100000110100001010010111101001000111000010001010100000101110000000111110111110101011011110111101010110011001110011100011101110100010100000110000000111010001011010010010000010111000110000101000100101100100001001110111000110011101110001011110111111110001100',
        hash: '74d2a884005468cdf7139d14938f058b328101dcef09eb140ea1b4cbd01b3d55'
      },
      {
        path: '1',
        hash: '9447e11dab52ba59216419cb150ac2a7d4f06d68023be69714e5208f2f7d1cf4'
      }
    ]
  }
  const indexCoordinates = {
    'origin_label': 3,
    'local_schema_id': 3,
    'index_id': 0
  }
  const stateHash = '116f73811b81fd6db37fe91081e019c810c163f1e4ee720f55b28ceba2a98429'
  const rootHash = '12c3bf76289af0e08965a13675bd7f832e855e087f8281e033bd301303f70b1a'

  it('should return root hash when valid proof', function () {
    expect(Exonum.verifyTable(proof, stateHash, indexCoordinates)).to.equals(rootHash)
  })

  it('should throw error when merkleRoot is unexpected', function () {
    expect(() => Exonum.verifyTable(proof, '', indexCoordinates))
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
    instance_id: 128,
    method_id: 0,
    schema: proto.exonum.examples.cryptocurrency_advanced.Transfer
  })
  const data = {
    to: { data: Exonum.hexadecimalToUint8Array('278663010ebe1136011618ad5be1b9d6f51edc5b6c6b51b5450ffc72f54a57df') },
    amount: '25',
    seed: '7743941227375415562'
  }
  const txHash = '3738fe0e11d8dab85d93fe32d33632b0b785f77f705c6fa13edef239df3d7bbd'
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
    instance_id: 128,
    method_id: 0,
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
    '4a8a297ed327bb25ddac2cc05a980a86f9856c810c7e3dff4cbf31f80a077e0a',
    '3738fe0e11d8dab85d93fe32d33632b0b785f77f705c6fa13edef239df3d7bbd'
  ]

  transactions.forEach(transaction => {
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

describe('Export proto stubs', function () {
  it('should export blockchain stubs', function () {
    expect(Exonum.protocol.exonum.Block).to.be.an('function')
    expect(Exonum.protocol.exonum.TxLocation).to.be.an('function')
  })

  it('should export consensus stubs', function () {
    expect(Exonum.protocol.exonum.consensus.Connect).to.be.an('function')
    expect(Exonum.protocol.exonum.consensus.Status).to.be.an('function')
    expect(Exonum.protocol.exonum.consensus.Propose).to.be.an('function')
    expect(Exonum.protocol.exonum.consensus.Prevote).to.be.an('function')
    expect(Exonum.protocol.exonum.consensus.Precommit).to.be.an('function')
    expect(Exonum.protocol.exonum.consensus.BlockResponse).to.be.an('function')
    expect(Exonum.protocol.exonum.consensus.TransactionsResponse).to.be.an('function')
    expect(Exonum.protocol.exonum.consensus.ProposeRequest).to.be.an('function')
    expect(Exonum.protocol.exonum.consensus.TransactionsRequest).to.be.an('function')
    expect(Exonum.protocol.exonum.consensus.PrevotesRequest).to.be.an('function')
    expect(Exonum.protocol.exonum.consensus.PeersRequest).to.be.an('function')
    expect(Exonum.protocol.exonum.consensus.BlockRequest).to.be.an('function')
  })

  it('should export helpers stubs', function () {
    expect(Exonum.protocol.exonum.crypto.Hash).to.be.an('function')
    expect(Exonum.protocol.exonum.crypto.PublicKey).to.be.an('function')
    expect(Exonum.protocol.exonum.common.BitVec).to.be.an('function')
  })
})

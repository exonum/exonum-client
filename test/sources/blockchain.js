/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const MockAdapter = require('axios-mock-adapter')
const axios = require('axios')
const Exonum = require('../../src')

const mock = new MockAdapter(axios)

describe('Verify block of precommits', function () {
  const validators = [
    '2bcd527a39ed80e7da4b767f402b6959cd74ce6980ce0a28c8b2e8a11c99b1f1',
    '48dbd790d25e0705f2077b1406b4eb64ccf0dd33a8a2215bb840f26f05c6bc1e',
    'c9decf2e0d150eec438242c37e628cc2eb5c45d6b18fb8b75c3f9be6529825a4',
    'e6264b7f37f1fc2b4719d89a1360c25ad8b98e9723b485080382761ede1f3182'
  ]

  it('should return true when valid block with precommits', function () {
    const data = require('./common_data/block-with-precommits/valid-block-with-precommits.json')
    expect(Exonum.verifyBlock(data, validators)).to.be.true
  })

  it('should return false when height of block is not match', function () {
    const data = {
      block: {
        height: '2',
        prev_hash: '5107fe929f173a8fbe609ef907797daab959c6838eb26e074d80534c772e879a',
        proposer_id: 3,
        state_hash: '5f59a6b7810f2cde8a90a4b281c5722d0718cda07f1f321e531c5305ed3baf0e',
        tx_count: 3,
        tx_hash: '09224d3618942784363789a34e016f6f8e683f2ec96a5b9c51c23a02bca2ae1d'
      },
      precommits: [
        {
          payload: {
            block_hash: '7de0d426f0f287849f89e5758015aca00f2e85eda28d2c38581519e0f1de8105',
            height: '4',
            propose_hash: 'e000ec445f25b61d2ac9d38882cffcd59aa02c08a30b2173c5526b89dccd1fcd',
            round: 1,
            time: {
              nanos: 336073000,
              secs: '1537799426'
            },
            validator: 3
          },
          message: 'e6264b7f37f1fc2b4719d89a1360c25ad8b98e9723b485080382761ede1f318201000300020000000000000001000000e000ec445f25b61d2ac9d38882cffcd59aa02c08a30b2173c5526b89dccd1fcd7de0d426f0f287849f89e5758015aca00f2e85eda28d2c38581519e0f1de810502f5a85b00000000281108142da1ea5a2eb4b058a37a69ffb721b7f16c319a4fa1fd34c29efc9bedec454382f9c606a6574349d65be17154465eeb68c4558ca5a1e68a5cc8537aaf81ed780e'
        }
      ]
    }

    expect(Exonum.verifyBlock(data, validators)).to.be.false
  })

  it('should return false when hash of block is not match', function () {
    const data = {
      block: {
        height: '2',
        prev_hash: '5107fe929f173a8fbe609ef907797daab959c6838eb26e074d80534c772e879a',
        proposer_id: 3,
        state_hash: '5f59a6b7810f2cde8a90a4b281c5722d0718cda07f1f321e531c5305ed3baf0e',
        tx_count: 3,
        tx_hash: '09224d3618942784363789a34e016f6f8e683f2ec96a5b9c51c23a02bca2ae1d'
      },
      precommits: [
        {
          payload: {
            block_hash: '8de0d426f0f287849f89e5758015aca00f2e85eda28d2c38581519e0f1de8105',
            height: '2',
            propose_hash: 'e000ec445f25b61d2ac9d38882cffcd59aa02c08a30b2173c5526b89dccd1fcd',
            round: 1,
            time: {
              nanos: 336073000,
              secs: '1537799426'
            },
            validator: 3
          },
          message: 'e6264b7f37f1fc2b4719d89a1360c25ad8b98e9723b485080382761ede1f318201000300020000000000000001000000e000ec445f25b61d2ac9d38882cffcd59aa02c08a30b2173c5526b89dccd1fcd7de0d426f0f287849f89e5758015aca00f2e85eda28d2c38581519e0f1de810502f5a85b00000000281108142da1ea5a2eb4b058a37a69ffb721b7f16c319a4fa1fd34c29efc9bedec454382f9c606a6574349d65be17154465eeb68c4558ca5a1e68a5cc8537aaf81ed780e'
        }
      ]
    }

    expect(Exonum.verifyBlock(data, validators)).to.be.false
  })

  it('should return false when public key of validator is not match', function () {
    const data = {
      block: {
        height: '2',
        prev_hash: '5107fe929f173a8fbe609ef907797daab959c6838eb26e074d80534c772e879a',
        proposer_id: 3,
        state_hash: '5f59a6b7810f2cde8a90a4b281c5722d0718cda07f1f321e531c5305ed3baf0e',
        tx_count: 3,
        tx_hash: '09224d3618942784363789a34e016f6f8e683f2ec96a5b9c51c23a02bca2ae1d'
      },
      precommits: [
        {
          payload: {
            block_hash: '7de0d426f0f287849f89e5758015aca00f2e85eda28d2c38581519e0f1de8105',
            height: '2',
            propose_hash: 'e000ec445f25b61d2ac9d38882cffcd59aa02c08a30b2173c5526b89dccd1fcd',
            round: 1,
            time: {
              nanos: 336073000,
              secs: '1537799426'
            },
            validator: 2
          },
          message: 'e6264b7f37f1fc2b4719d89a1360c25ad8b98e9723b485080382761ede1f318201000300020000000000000001000000e000ec445f25b61d2ac9d38882cffcd59aa02c08a30b2173c5526b89dccd1fcd7de0d426f0f287849f89e5758015aca00f2e85eda28d2c38581519e0f1de810502f5a85b00000000281108142da1ea5a2eb4b058a37a69ffb721b7f16c319a4fa1fd34c29efc9bedec454382f9c606a6574349d65be17154465eeb68c4558ca5a1e68a5cc8537aaf81ed780e'
        }
      ]
    }

    expect(Exonum.verifyBlock(data, validators)).to.be.false
  })

  it('should return false when payload is not match', function () {
    const data = {
      block: {
        height: '2',
        prev_hash: '5107fe929f173a8fbe609ef907797daab959c6838eb26e074d80534c772e879a',
        proposer_id: 3,
        state_hash: '5f59a6b7810f2cde8a90a4b281c5722d0718cda07f1f321e531c5305ed3baf0e',
        tx_count: 3,
        tx_hash: '09224d3618942784363789a34e016f6f8e683f2ec96a5b9c51c23a02bca2ae1d'
      },
      precommits: [
        {
          payload: {
            block_hash: '7de0d426f0f287849f89e5758015aca00f2e85eda28d2c38581519e0f1de8105',
            height: '2',
            propose_hash: 'e000ec445f25b61d2ac9d38882cffcd59aa02c08a30b2173c5526b89dccd1fcd',
            round: 2,
            time: {
              nanos: 336073000,
              secs: '1537799426'
            },
            validator: 3
          },
          message: 'e6264b7f37f1fc2b4719d89a1360c25ad8b98e9723b485080382761ede1f318201000300020000000000000001000000e000ec445f25b61d2ac9d38882cffcd59aa02c08a30b2173c5526b89dccd1fcd7de0d426f0f287849f89e5758015aca00f2e85eda28d2c38581519e0f1de810502f5a85b00000000281108142da1ea5a2eb4b058a37a69ffb721b7f16c319a4fa1fd34c29efc9bedec454382f9c606a6574349d65be17154465eeb68c4558ca5a1e68a5cc8537aaf81ed780e'
        }
      ]
    }

    expect(Exonum.verifyBlock(data, validators)).to.be.false
  })

  it('should return false when signature is not match', function () {
    const data = {
      block: {
        height: '2',
        prev_hash: '5107fe929f173a8fbe609ef907797daab959c6838eb26e074d80534c772e879a',
        proposer_id: 3,
        state_hash: '5f59a6b7810f2cde8a90a4b281c5722d0718cda07f1f321e531c5305ed3baf0e',
        tx_count: 3,
        tx_hash: '09224d3618942784363789a34e016f6f8e683f2ec96a5b9c51c23a02bca2ae1d'
      },
      precommits: [
        {
          payload: {
            block_hash: '7de0d426f0f287849f89e5758015aca00f2e85eda28d2c38581519e0f1de8105',
            height: '2',
            propose_hash: 'e000ec445f25b61d2ac9d38882cffcd59aa02c08a30b2173c5526b89dccd1fcd',
            round: 1,
            time: {
              nanos: 336073000,
              secs: '1537799426'
            },
            validator: 3
          },
          message: 'e6264b7f37f1fc2b4719d89a1360c25ad8b98e9723b485080382761ede1f318201000300020000000000000001000000e000ec445f25b61d2ac9d38882cffcd59aa02c08a30b2173c5526b89dccd1fcd7de0d426f0f287849f89e5758015aca00f2e85eda28d2c38581519e0f1de810502f5a85b00000000281108142da1ea5a2eb4b058a37a69ffb721b7f16c319a4fa1fd34c29efc9bedec454382f9c606a6574349d65be17154465eeb68c4558ca5a1e68a5cc8537aaf81ed780d'
        }
      ]
    }

    expect(Exonum.verifyBlock(data, validators)).to.be.false
  })
})

describe('Verify table existence', function () {
  const proof = {
    entries: [
      {
        key: '775be457774803ff0221f0d18f407c9718a2f4c635445a691f6061bd5d651581',
        value: '540c35c61837aa819986e137b6ae0091faa781419e8234802094ef77a2cdc293'
      }
    ],
    proof: [
      {
        path: '0000101010101110110000001010110110011000000001100011001110110111000101011001101100100100000010011111001000011101110010101110111001111111101111101110100011111110000111011111101111110011011010100100110101110010101000101110101000100110011100100010101101100001',
        hash: '0000000000000000000000000000000000000000000000000000000000000000'
      },
      {
        path: '1101',
        hash: '9d57d84328c5fce997b0dd0cf806c114a37ebf32bd1b966154244548206acd27'
      },
      {
        path: '1110011011010101101110110100111000001000001001000000111111111111011100101101000011111100001100101111010010000011110111001010001101011101001010111011010011010000000111101000101000101011011010100001101110110001000001001011110010101000010101010010010100001010',
        hash: '0000000000000000000000000000000000000000000000000000000000000000'
      },
      {
        path: '1111101111111100100001100001100100100000100101011111010011011011000000101110101010011000101101000010001110111100111010110001001001010111111011100101000100111011010010100011110110010010001100010001011110100000001001000000001100101000000111011000100010011000',
        hash: '15ca2aa05d8f054125ee327ac35805c5a20d9305aae10880dc56373219126a47'
      }
    ]
  }
  const serviceId = 130
  const tableIndex = 0
  const stateHash = 'dd09c5ec10fe7eb5d82aeabf362772440880394dfabb0a4c4cfbfdecc2d6bad7'
  const rootHash = '540c35c61837aa819986e137b6ae0091faa781419e8234802094ef77a2cdc293'

  it('should return root hash when valid proof', function () {
    expect(Exonum.verifyTable(proof, stateHash, serviceId, tableIndex)).to.equals(rootHash)
  })

  it('should throw error when wrong service ID is passed', function () {
    const endpoints = [null, false, 'Hello world', new Date(), {}, []]

    endpoints.forEach(function (value) {
      expect(() => Exonum.verifyTable(proof, stateHash, value, tableIndex))
        .to.throw(Error, `Uint16 of wrong type is passed: ${value}`)
    })
  })

  it('should throw error when wrong table index is passed', function () {
    const endpoints = [null, false, 'Hello world', new Date(), {}, []]

    endpoints.forEach(function (value) {
      expect(() => Exonum.verifyTable(proof, stateHash, serviceId, value))
        .to.throw(Error, `Uint16 of wrong type is passed: ${value}`)
    })
  })

  it('should throw error when wrong proof is passed', function () {
    const endpoints = [null, false, 42, 'Hello world', new Date(), {}, []]

    endpoints.forEach(function (value) {
      expect(() => Exonum.verifyTable(value, stateHash, serviceId, tableIndex)).to.throw(Error)
    })
  })
})

describe('Send transaction to the blockchain', function () {
  const keyPair = {
    publicKey: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
    secretKey: '978e3321bd6331d56e5f4c2bdb95bf471e95a77a6839e68d4241e7b0932ebe2bfa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'
  }
  const sendFunds = Exonum.newMessage({
    author: keyPair.publicKey,
    service_id: 130,
    message_id: 0,
    fields: [
      { name: 'from', type: Exonum.Hash },
      { name: 'to', type: Exonum.Hash },
      { name: 'amount', type: Exonum.Uint64 }
    ]
  })
  const data = {
    from: keyPair.publicKey,
    to: 'f7ea8fd02cb41cc2cd45fd5adc89ca1bf605b2e31f796a3417ddbcd4a3634647',
    amount: 1000
  }
  const txHash = 'b8a086ecda9973132ef6b2038c52c20e047f4a20950ed895f2652a4b500fe6bb'
  const explorerBasePath = 'http://127.0.0.1:8200/api/explorer/v1/transactions'
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
    publicKey: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
    secretKey: '978e3321bd6331d56e5f4c2bdb95bf471e95a77a6839e68d4241e7b0932ebe2bfa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'
  }
  let sendFunds = Exonum.newMessage({
    author: keyPair.publicKey,
    service_id: 130,
    message_id: 0,
    fields: [
      { name: 'from', type: Exonum.Hash },
      { name: 'to', type: Exonum.Hash },
      { name: 'amount', type: Exonum.Uint64 }
    ]
  })
  const explorerBasePath = 'http://127.0.0.1:8200/api/explorer/v1/transactions'
  const transactions = [
    {
      data: {
        from: keyPair.publicKey,
        to: '3adc89ca14f605b2e31f79663417ddbcd4a3634641f7ea8fd02cb41cc2cd45f0',
        amount: 1000
      },
      type: sendFunds
    },
    {
      data: {
        from: keyPair.publicKey,
        to: '5fd5adc89ca1bf605b2e31f796a3417ddbcd4a3634647f7ea8fd02cb41cc2cd4',
        amount: 250
      },
      type: sendFunds
    }
  ]
  const transactionHashes = [
    'c570e68ea656b7c898f0a01385861798ade2d553650a69dbd7981c2709bae007',
    'b4c52b190bd896abd9648924ce41877655b0b17a13a68d5b2a2d75790f06c30f'
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

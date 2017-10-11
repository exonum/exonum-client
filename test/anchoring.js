/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const Exonum = require('../src')
const nock = require('nock')

chai.use(chaiAsPromised)
chai.should()

const anchoringAddress = 'anchoringAddress'
const token = '4bbd8b0dc28c3cf1c2d14b3291b0d75003d46372'
const { blocktrailTransactions, blocktrailTransactionsConcated, blocktrailBlocks, blocktrailResponse } =
  require('./common_data/anchoring-providers/')

describe('Anchoring', function () {
  const anchoring = new Exonum.Anchoring({
    url: 'http://192.168.221.129:8000',
    anchorStep: 1000,
    provider: new Exonum.providers.Blocktrail({
      network: 'tBTC',
      token
    })
  })
  it('checkAnchorChain should return valid chain', function (done) {
    this.timeout(60000)
    nock('http://192.168.221.129:8000')
      .get('/api/services/btc_anchoring/v1/address/actual')
      .reply(200, anchoringAddress)

    for (let i = 0; i < blocktrailTransactions.length; ++i) {
      nock('https://api.blocktrail.com')
        .get(`/v1/tBTC/address/${anchoringAddress}/transactions`)
        .query({ api_key: '4bbd8b0dc28c3cf1c2d14b3291b0d75003d46372', limit: 200, page: i + 1, sort_dir: 'asc' })
        .reply(200, blocktrailTransactions[i])
    }

    for (let i = 0; i < blocktrailTransactionsConcated.length; ++i) {
      nock('http://192.168.221.129:8000')
        .get(/\/api\/explorer\/v1\/blocks\/\d+/)
        .reply(200, function (uri) {
          const block = Number(uri.split('blocks/')[1])
          return blocktrailBlocks[block]
        })
    }

    anchoring.checkAnchorChain()
      .should
      .eventually
      .to.deep
      .equal(blocktrailResponse)
      .notify(done)
  })
})

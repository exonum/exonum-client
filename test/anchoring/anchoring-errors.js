/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const Exonum = require('src')
const nock = require('nock')
chai.use(chaiAsPromised)
chai.should()

const exonumUrl = 'http://localhost'
const address = 'address'

const { getNTx } = require('test/common_data/anchoring-providers/')

describe('Anchoring errors', function () {
  const anchoring = new Exonum.Anchoring({
    url: exonumUrl,
    anchorStep: 1000,
    provider: new Exonum.providers.Blocktrail()
  })

  it('should return error if actual address request failed', done => {
    nock(exonumUrl)
      .get('/api/services/btc_anchoring/v1/address/actual')
      .reply(500)

    anchoring.checkAnchorChain()
      .then(({ response }) => response.status)
      .should
      .eventually
      .equal(500)
      .notify(done)
  })

  it('getAddressTransactions should made 5 attempts before returning error', done => {
    nock(exonumUrl)
      .get('/api/services/btc_anchoring/v1/address/actual')
      .reply(200, address)

    for (let i = 0; i < 5; ++i) {
      nock('https://api.blocktrail.com')
        .get(`/v1/BTC/address/${address}/transactions`)
        .query({ limit: 200, page: 1, sort_dir: 'asc' })
        .reply(401)
    }

    anchoring.checkAnchorChain()
      .then(({ response }) => response.status)
      .should
      .eventually
      .equal(401)
      .notify(done)
  })

  it('checkAnchorChain should made 5 attempts of getting block before returning error', done => {
    nock(exonumUrl)
      .get('/api/services/btc_anchoring/v1/address/actual')
      .reply(200, address)

    const txs = getNTx(3, 3)
    nock('https://api.blocktrail.com')
      .get(`/v1/BTC/address/${address}/transactions`)
      .query({ limit: 200, page: 1, sort_dir: 'asc' })
      .reply(200, txs)

    for (let i = 0; i < 5; ++i) {
      nock(exonumUrl)
        .get(/\/api\/explorer\/v1\/blocks\/\d+/)
        .reply(500)
    }

    anchoring.checkAnchorChain()
      .then(({ response }) => response.status)
      .should
      .eventually
      .equal(500)
      .notify(done)
  })
})

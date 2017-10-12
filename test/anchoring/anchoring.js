/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const Exonum = require('src')
const nock = require('nock')
const {
  btTransactionsConcated, btBlocks, wrongSequenceRes, getNTx,
  btWrongSequence, btRes, btTransactions, wrongHashRes
} = require('test/common_data/anchoring-providers/')

chai.use(chaiAsPromised)
chai.should()
const { expect } = chai

const exonumUrl = 'http://localhost'
const anchoringAddress = '12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX'
const token = 'token'
const network = 'BTC'

describe('Anchoring', function () {
  const anchoring = new Exonum.Anchoring({
    url: exonumUrl,
    anchorStep: 1000,
    provider: new Exonum.providers.Blocktrail({
      network,
      token
    })
  })

  it('checkOpReturn should allow only valid Exonum OP_RETURN', () => {
    expect(anchoring
      .checkOpReturn('6a3045584f4e554d01000000000000000000bf972faf7fa1586019aa7fe40ec7cdaea292bbd33cbe27c9d81b4885a9bd4273'))
      .to.equal(true)

    expect(anchoring
      .checkOpReturn('OP_RETURN 45584f4e554d01000000000000000000bf972faf7fa1586019aa7fe40ec7cdaea292bbd33cbe27c9d81b4885a9bd4273'))
      .to.equal(true);

    [null, undefined, 42,
      '45584f4e554a01000000000000000000bf972faf7fa1586019aa7fe40ec7cdaea292bbd33cbe27c9d81b4885a9bd4273',
      '45584f4e554d01000000000000000000bf972faf7fa1586019aa7f+40ec7cdaea292bbd33cbe27c9d81b4885a9bd4273',
      [], {}, new Date()]
      .forEach(item => expect(anchoring.checkOpReturn(item)).to.equal(false))
  })

  it('parseOpReturn should parse valid Exonum OP_RETURN into Object', () => {
    const parsedObject = {
      version: 1,
      payloadType: 0,
      blockHeight: 0,
      blockHash: 'bf972faf7fa1586019aa7fe40ec7cdaea292bbd33cbe27c9d81b4885a9bd4273'
    }
    expect(anchoring
      .parseOpReturn('6a3045584f4e554d01000000000000000000bf972faf7fa1586019aa7fe40ec7cdaea292bbd33cbe27c9d81b4885a9bd4273'))
      .to.deep.equal(parsedObject)
    expect(anchoring
      .parseOpReturn('OP_RETURN 45584f4e554d01000000000000000000bf972faf7fa1586019aa7fe40ec7cdaea292bbd33cbe27c9d81b4885a9bd4273'))
      .to.deep.equal(parsedObject)
  })

  it('getActualAddress should load address from Exonum anchoring', done => {
    nock(exonumUrl)
      .get('/api/services/btc_anchoring/v1/address/actual')
      .reply(200, anchoringAddress)

    anchoring.getActualAddress()
      .should
      .eventually
      .equal(anchoringAddress)
      .notify(done)
  })

  it('getBlock should load block from Exonum explorer', done => {
    const block = 1000
    nock(exonumUrl)
      .get(/\/api\/explorer\/v1\/blocks\/\d+/)
      .reply(200, btBlocks[block])

    anchoring.getBlock(block)
      .should
      .eventually
      .to.deep
      .equal(btBlocks[block])
      .notify(done)
  })

  it('checkAnchorChain should return wrong block hash error', done => {
    nock(exonumUrl)
      .get('/api/services/btc_anchoring/v1/address/actual')
      .reply(200, anchoringAddress)

    const txs = getNTx(3, 3)
    nock('https://api.blocktrail.com')
      .get(`/v1/${network}/address/${anchoringAddress}/transactions`)
      .query({ api_key: token, limit: 200, page: 1, sort_dir: 'asc' })
      .reply(200, txs)

    for (let i = 0; i < txs.data.length - 1; ++i) {
      nock(exonumUrl)
        .get(/\/api\/explorer\/v1\/blocks\/\d+/)
        .reply(200, function (uri) {
          const block = Number(uri.split('blocks/')[1])
          if (block === 1000) {
            return {
              'precommits': [{
                'body': {
                  'block_hash': '5c8cf15e8c7caab0cfab99266a6a7bf52dcb519a143d076b99a6df0a3c25d3c4',
                  'height': block
                }
              }]
            }
          }
          return btBlocks[block]
        })
    }

    anchoring.checkAnchorChain()
      .should
      .eventually
      .to.deep
      .equal(wrongHashRes)
      .notify(done)
  })

  it('checkAnchorChain should return blockHeight error', done => {
    nock(exonumUrl)
      .get('/api/services/btc_anchoring/v1/address/actual')
      .reply(200, anchoringAddress)

    nock('https://api.blocktrail.com')
      .get(`/v1/${network}/address/${anchoringAddress}/transactions`)
      .query({ api_key: token, limit: 200, page: 1, sort_dir: 'asc' })
      .reply(200, btWrongSequence)

    for (let i = 0; i < 2; ++i) {
      nock(exonumUrl)
        .get(/\/api\/explorer\/v1\/blocks\/\d+/)
        .reply(200, function (uri) {
          const block = Number(uri.split('blocks/')[1])
          return btBlocks[block]
        })
    }

    anchoring.checkAnchorChain()
      .should
      .eventually
      .to.deep
      .equal(wrongSequenceRes)
      .notify(done)
  })

  it('checkAnchorChain should return valid chain', done => {
    nock(exonumUrl)
      .get('/api/services/btc_anchoring/v1/address/actual')
      .reply(200, anchoringAddress)

    for (let i = 0; i < btTransactions.length; ++i) {
      nock('https://api.blocktrail.com')
        .get(`/v1/${network}/address/${anchoringAddress}/transactions`)
        .query({ api_key: token, limit: 200, page: i + 1, sort_dir: 'asc' })
        .reply(200, btTransactions[i])
    }

    for (let i = 0; i < btTransactionsConcated.length; ++i) {
      nock(exonumUrl)
        .get(/\/api\/explorer\/v1\/blocks\/\d+/)
        .reply(200, function (uri) {
          const block = Number(uri.split('blocks/')[1])
          return btBlocks[block]
        })
    }

    anchoring.checkAnchorChain()
      .should
      .eventually
      .to.deep
      .equal(btRes)
      .notify(done)
  })
})

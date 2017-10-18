/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const Exonum = require('src')
const nock = require('nock')
const {
  inTransactions, inTransactionsConcated,
  btTransactions, btTransactionsConcated
} = require('test/common_data/anchoring-providers/')
chai.use(chaiAsPromised)
chai.should()
const { expect } = chai

const address = 'address'
const network = 'network'
const token = 'token'

describe('Providers', function () {
  const Blocktrail = new Exonum.providers.Blocktrail({ network, token })
  const Insight = new Exonum.providers.Insight()

  it('Blocktrail provider getOpReturnFromTx should return valid OP_RETURN', () => {
    expect(Blocktrail.getOpReturnFromTx(btTransactionsConcated[10]))
      .to.equal('6a3045584f4e554d0100581b00000000000069044627bb9f004b09fdef693b62234a91a7631ef836ecbed42c2a59efe4b57f')
  })

  it('Blocktrail provider _getAddressTransactions should return array of transactions', done => {
    nock('https://api.blocktrail.com')
      .get(`/v1/${network}/address/${address}/transactions`)
      .query({ api_key: token, limit: 200, page: 1, sort_dir: 'asc' })
      .reply(200, btTransactions[0])

    Blocktrail._getAddressTransactions({ address, page: 1, limit: 200 })
      .should
      .eventually
      .to.deep
      .equal(btTransactions[0].data)
      .notify(done)
  })

  it('Blocktrail provider getAddressTransactions should return array of all transactions', done => {
    for (let i = 0; i < btTransactions.length; ++i) {
      nock('https://api.blocktrail.com')
        .get(`/v1/${network}/address/${address}/transactions`)
        .query({ api_key: token, limit: 200, page: i + 1, sort_dir: 'asc' })
        .reply(200, btTransactions[i])
    }

    Blocktrail.getAddressTransactions(address)
      .should
      .eventually
      .to.deep
      .equal(btTransactionsConcated)
      .notify(done)
  })

  it('Insight provider getOpReturnFromTx should return valid OP_RETURN', () => {
    expect(Insight.getOpReturnFromTx(inTransactionsConcated[0]))
      .to.equal('6a3045584f4e554d010050fe0b000000000031c85586ed74826289fd32d0ee4eb48c8aad52d04844061fa8faf936e41707eb')
  })

  it('Insight provider _getAddressTransactions should return array of transactions', done => {
    nock('https://insight.bitpay.com/api')
      .get(`/txs`)
      .query({ address, pageNum: 1 })
      .reply(200, inTransactions[0])

    Insight._getAddressTransactions({ address, page: 1 })
      .should
      .eventually
      .to.deep
      .equal(inTransactions[0].txs)
      .notify(done)
  })

  it('Insight provider getAddressTransactions should return array of all transactions', done => {
    for (let i = 0; i < inTransactions.length; ++i) {
      nock('https://insight.bitpay.com/api')
        .get(`/txs`)
        .query({ address, pageNum: i + 1 })
        .reply(200, inTransactions[i])
    }

    Insight.getAddressTransactions(address)
      .should
      .eventually
      .to.deep
      .equal(inTransactionsConcated)
      .notify(done)
  })
})

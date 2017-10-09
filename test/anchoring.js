/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const Exonum = require('../src')

chai.use(chaiAsPromised)
const should = chai.should()

describe('Anchoring', function () {
  const anchoring = new Exonum.Anchoring({
    url: 'http://192.168.221.129:8000',
    anchorStep: 1000,
    provider: new Exonum.providers.Blocktrail({
      network: 'tBTC',
      token: '4bbd8b0dc28c3cf1c2d14b3291b0d75003d46372',
      // api: 'https://test-insight.bitpay.com/api'
    })
  })
  it('should check last N', function (done) {
    this.timeout(20000)
    anchoring.checkAnchorChain()
      .should
      .eventually
      // .equal('foo')
      .notify(done)
  })
})

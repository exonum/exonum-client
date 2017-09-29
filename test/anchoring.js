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
    provider: new Exonum.providers.Blockcypher({ network: 'test3' })
  })
  it('should return true when valid block with precommits', function (done) {
    anchoring.checkLast()
      .should
      .eventually
      .equal('foo')
      .notify(done)
  })
})

/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const Exonum = require('../../lib')

describe('Serialize data into array of 8-bit integers', function () {
  it('should return current library version', function () {
    const version = require('../../package.json').version
    expect(Exonum.version).to.equal(version)
  })
})

/**
 * A simple plugin for Chai that compares byte arrays on per-element basis.
 *
 * @example
 *   expect(new Uint8Array([1, 2])).to.equalBytes([1, 2]);
 *   expect(new Uint8Array[65, 66, 67])).to.equalBytes('414243');
 */
module.exports = function (chai, utils) {
  const Assertion = chai.Assertion;

  Assertion.addMethod('equalBytes', function (expected) {
    var actual = this._obj;
    new Assertion(actual).to.be.a('uint8array');

    var assert = false;
    if (typeof expected === 'string') {
      // expected value is a hex string
      assert = expected.length === actual.length * 2 &&
        actual.every((x, i) => x === parseInt(expected.substring(2 * i, 2 * i + 2), 16));
    } else if (expected.length !== undefined) {
      // expected value is an array
      assert = expected.length === actual.length &&
        actual.every((x, i) => expected[i] === x);
    }

    this.assert(
      assert,
      'expected #{this} to equal #{exp}',
      'expected #{this} to not equal #{exp}',
      expected
    );
  });
};

/**
 * A simple plugin for Chai that compares arrays on per-element basis.
 * `expect(x).to.deep.equal(y)` would suffice, but it does not work in PhantomJS.
 *
 * @example
 *   expect([1, 2]).to.equalArray([1, 2]);
 */
module.exports = function (chai, utils) {
  const Assertion = chai.Assertion;

  Assertion.addMethod('equalArray', function (expected) {
    var actual = this._obj;
    this.assert(
      expected.length === actual.length &&
        (function () {
          for (var i = 0; i < expected.length; i++) {
            if (expected[i] !== actual[i]) return false;
          }
          return true;
        })(),
        // An adequate way to write this is
        // actual.every((x, i) => (expected[i] === actual[i])
        // but PhantomJS doesn't understand it :(
      'expected #{this} to equal #{exp}',
      'expected #{this} to not equal #{exp}',
      expected
    );
  });
};

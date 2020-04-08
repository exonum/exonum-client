"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.send = send;
exports.sendQueue = sendQueue;

var _axios = _interopRequireDefault(require("axios"));

var _convert = require("../types/convert");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var ATTEMPTS = 10;
var ATTEMPT_TIMEOUT = 500;
/**
 * Send transaction to the blockchain
 * @param {string} explorerBasePath
 * @param {Uint8Array | string} transaction
 * @param {number} attempts
 * @param {number} timeout
 * @return {Promise}
 */

function send(_x, _x2) {
  return _send.apply(this, arguments);
}
/**
 * Sends several transactions to the blockchain.
 *
 * @param {string} explorerBasePath
 * @param {Array} transactions
 * @param {number} attempts
 * @param {number} timeout
 * @return {Promise}
 */


function _send() {
  _send = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(explorerBasePath, transaction) {
    var attempts,
        timeout,
        sleep,
        response,
        txHash,
        count,
        errored,
        _response,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            sleep = function _sleep(timeout) {
              return new Promise(function (resolve) {
                setTimeout(resolve, timeout);
              });
            };

            attempts = _args.length > 2 && _args[2] !== undefined ? _args[2] : ATTEMPTS;
            timeout = _args.length > 3 && _args[3] !== undefined ? _args[3] : ATTEMPT_TIMEOUT;

            if (!(typeof explorerBasePath !== 'string')) {
              _context.next = 5;
              break;
            }

            throw new TypeError('Explorer base path endpoint of wrong data type is passed. String is required.');

          case 5:
            attempts = +attempts;
            timeout = +timeout;

            if (typeof transaction !== 'string') {
              transaction = (0, _convert.uint8ArrayToHexadecimal)(new Uint8Array(transaction));
            }

            _context.next = 10;
            return _axios["default"].post("".concat(explorerBasePath), {
              tx_body: transaction
            });

          case 10:
            response = _context.sent;
            txHash = response.data.tx_hash;
            count = attempts;
            errored = false;

          case 14:
            if (!(count >= 0)) {
              _context.next = 32;
              break;
            }

            _context.prev = 15;
            _context.next = 18;
            return _axios["default"].get("".concat(explorerBasePath, "?hash=").concat(txHash));

          case 18:
            _response = _context.sent;

            if (!(_response.data.type === 'committed')) {
              _context.next = 21;
              break;
            }

            return _context.abrupt("return", txHash);

          case 21:
            errored = false;
            _context.next = 27;
            break;

          case 24:
            _context.prev = 24;
            _context.t0 = _context["catch"](15);
            errored = true;

          case 27:
            count--;
            _context.next = 30;
            return sleep(timeout);

          case 30:
            _context.next = 14;
            break;

          case 32:
            if (!errored) {
              _context.next = 36;
              break;
            }

            throw new Error('The request failed or the blockchain node did not respond.');

          case 36:
            throw new Error('The transaction was not accepted to the block for the expected period.');

          case 37:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[15, 24]]);
  }));
  return _send.apply(this, arguments);
}

function sendQueue(explorerBasePath, transactions) {
  var attempts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ATTEMPTS;
  var timeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ATTEMPT_TIMEOUT;
  var index = 0;
  var responses = [];
  return function shift() {
    var transaction = transactions[index++];
    return send(explorerBasePath, transaction, attempts, timeout).then(function (response) {
      responses.push(response);

      if (index < transactions.length) {
        return shift();
      } else {
        return responses;
      }
    });
  }();
}

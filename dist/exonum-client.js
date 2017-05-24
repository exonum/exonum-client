(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Exonum = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.verifyBlock = function () {
    return 'blockchain::block verifyBlock() result here';
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _merkle = require('./merkle');

Object.keys(_merkle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _merkle[key];
    }
  });
});

var _merklePatricia = require('./merkle-patricia');

Object.keys(_merklePatricia).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _merklePatricia[key];
    }
  });
});

var _block = require('./block');

Object.keys(_block).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _block[key];
    }
  });
});

},{"./block":1,"./merkle":4,"./merkle-patricia":3}],3:[function(require,module,exports){
'use strict';

exports.MerklePatriciaProof = function () {
    return 'blockchain::merkle-patricia MerklePatriciaProof() result here';
};

},{}],4:[function(require,module,exports){
'use strict';

exports.MerkleProof = function () {
    return 'blockchain::merkle MerkleProof() result here';
};

},{}],5:[function(require,module,exports){
'use strict';

exports.hash = function () {
    return 'crypto hash() result here';
};

exports.sign = function () {
    return 'crypto sign() result here';
};

exports.verifySignature = function () {
    return 'crypto verifySignature() result here';
};

exports.keyPair = function () {
    return 'crypto keyPair() result here';
};

},{}],6:[function(require,module,exports){
'use strict';

var _index = require('./types/index');

var types = _interopRequireWildcard(_index);

var _index2 = require('./crypto/index');

var crypto = _interopRequireWildcard(_index2);

var _index3 = require('./blockchain/index');

var blockchain = _interopRequireWildcard(_index3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Exonum = function Exonum() {
    _classCallCheck(this, Exonum);
};

var methods = Object.assign(types, crypto, blockchain);
for (var i in methods) {
    Exonum.prototype[i] = methods[i];
}

module.exports = new Exonum();

},{"./blockchain/index":2,"./crypto/index":5,"./types/index":8}],7:[function(require,module,exports){
'use strict';

exports.newType = function () {
    return 'types::generic newType() result here';
};

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _primitive = require('./primitive');

Object.keys(_primitive).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _primitive[key];
    }
  });
});

var _generic = require('./generic');

Object.keys(_generic).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _generic[key];
    }
  });
});

var _message = require('./message');

Object.keys(_message).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _message[key];
    }
  });
});

},{"./generic":7,"./message":9,"./primitive":10}],9:[function(require,module,exports){
'use strict';

exports.newMessage = function () {
    return 'types::message newMessage() result here';
};

},{}],10:[function(require,module,exports){
'use strict';

exports.Uint8 = function () {
    return 'types::primitive Uint8() result here';
};

},{}]},{},[6])(6)
});
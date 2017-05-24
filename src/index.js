'use strict';

import * as types from './types/index';
import * as crypto from './crypto/index';
import * as blockchain from './blockchain/index';

class Exonum {
    constructor() {
        this.NETWORK_ID = 0;
    }
}

const methods = Object.assign(types, crypto, blockchain);
for (let i in methods) {
    Exonum.prototype[i] = methods[i];
}

module.exports = new Exonum(); // TODO rework with ES6 syntax

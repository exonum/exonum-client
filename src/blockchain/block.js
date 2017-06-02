import {isObject} from '../helpers';
import * as primitive from '../types/primitive';
import {newType} from '../types/generic';
import {newMessage} from '../types/message';
import {validateHexHash} from '../types/validate';
import {hash, verifySignature} from '../crypto';

/**
 * Validate block and each precommit in block
 * @param {Object} data
 * @param {Array} validators
 * @return {boolean}
 */
export function verifyBlock(data, validators) {
    var Block = newType({
        size: 108,
        fields: {
            height: {type: primitive.Uint64, size: 8, from: 0, to: 8},
            propose_round: {type: primitive.Uint32, size: 4, from: 8, to: 12},
            prev_hash: {type: primitive.Hash, size: 32, from: 12, to: 44},
            tx_hash: {type: primitive.Hash, size: 32, from: 44, to: 76},
            state_hash: {type: primitive.Hash, size: 32, from: 76, to: 108}
        }
    });
    var SystemTime = newType({
        size: 12,
        fields: {
            secs: {type: primitive.Uint64, size: 8, from: 0, to: 8},
            nanos: {type: primitive.Uint32, size: 4, from: 8, to: 12}
        }
    });
    var Precommit = newMessage({
        size: 96,
        service_id: 0,
        message_id: 4,
        fields: {
            validator: {type: primitive.Uint32, size: 4, from: 0, to: 4},
            height: {type: primitive.Uint64, size: 8, from: 8, to: 16},
            round: {type: primitive.Uint32, size: 4, from: 16, to: 20},
            propose_hash: {type: primitive.Hash, size: 32, from: 20, to: 52},
            block_hash: {type: primitive.Hash, size: 32, from: 52, to: 84},
            time: {type: SystemTime, size: 12, from: 84, to: 96}
        }
    });

    if (isObject(data) === false) {
        throw new TypeError('Wrong type of data parameter. Object is expected.');
    } else if (isObject(data.block) === false) {
        throw new TypeError('Wrong type of block field in data parameter. Object is expected.');
    } else if (Array.isArray(data.precommits) === false) {
        throw new TypeError('Wrong type of precommits field in data parameter. Array is expected.');
    } else if (Array.isArray(validators) === false) {
        throw new TypeError('Wrong type of validators parameter. Array is expected.');
    }

    for (var i = 0; i < validators.length; i++) {
        try {
            validateHexHash(validators[i]);
        } catch (error) {
            throw error;
        }
    }

    var validatorsTotalNumber = validators.length;
    var uniqueValidators = [];
    var round;

    try {
        var blockHash = hash(data.block, Block);
    } catch (error) {
        throw error;
    }

    for (i = 0; i < data.precommits.length; i++) {
        var precommit = data.precommits[i];

        if (isObject(precommit.body) === false) {
            throw new TypeError('Wrong type of precommits body. Object is expected.');
        }

        try {
            validateHexHash(precommit.signature, 64);
        } catch (error) {
            throw error;
        }

        if (precommit.body.validator >= validatorsTotalNumber) {
            throw new Error('Wrong index passed. Validator does not exist.');
        }

        if (uniqueValidators.indexOf(precommit.body.validator) === -1) {
            uniqueValidators.push(precommit.body.validator);
        }

        if (precommit.body.height !== data.block.height) {
            throw new Error('Wrong height of block in precommit.');
        } else if (precommit.body.block_hash !== blockHash) {
            throw new Error('Wrong hash of block in precommit.');
        }

        if (round === undefined) {
            round = precommit.body.round;
        } else if (precommit.body.round !== round) {
            throw new Error('Wrong round in precommit.');
        }

        var publicKey = validators[precommit.body.validator];

        try {
            verifySignature(precommit.signature, publicKey, precommit.body, Precommit);
        } catch (error) {
            throw error;
        }
    }

    if (uniqueValidators.length <= validatorsTotalNumber * 2 / 3) {
        throw new Error('Not enough precommits from unique validators.');
    }

    return true;
}

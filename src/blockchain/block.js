import * as helpers from '../helpers';
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

    if (helpers.isObject(data) === false) {
        console.error('Wrong type of data parameter. Object is expected.');
        return false;
    } else if (helpers.isObject(data.block) === false) {
        console.error('Wrong type of block field in data parameter. Object is expected.');
        return false;
    } else if (Array.isArray(data.precommits) === false) {
        console.error('Wrong type of precommits field in data parameter. Array is expected.');
        return false;
    } else if (Array.isArray(validators) === false) {
        console.error('Wrong type of validators parameter. Array is expected.');
        return false;
    }

    for (var i = 0; i < validators.length; i++) {
        if (validateHexHash(validators[i]) === false) {
            return false;
        }
    }

    var validatorsTotalNumber = validators.length;
    var uniqueValidators = [];
    var round;
    var blockHash = hash(data.block, Block);

    for (var i = 0; i < data.precommits.length; i++) {
        var precommit = data.precommits[i];

        if (helpers.isObject(precommit.body) === false) {
            console.error('Wrong type of precommits body. Object is expected.');
            return false;
        } else if (validateHexHash(precommit.signature, 64) === false) {
            console.error('Wrong type of precommits signature. Hexadecimal of 64 length is expected.');
            return false;
        }

        if (precommit.body.validator >= validatorsTotalNumber) {
            console.error('Wrong index passed. Validator does not exist.');
            return false;
        }

        if (uniqueValidators.indexOf(precommit.body.validator) === -1) {
            uniqueValidators.push(precommit.body.validator);
        }

        if (precommit.body.height !== data.block.height) {
            console.error('Wrong height of block in precommit.');
            return false;
        } else if (precommit.body.block_hash !== blockHash) {
            console.error('Wrong hash of block in precommit.');
            return false;
        }

        if (round === undefined) {
            round = precommit.body.round;
        } else if (precommit.body.round !== round) {
            console.error('Wrong round in precommit.');
            return false;
        }

        var publicKey = validators[precommit.body.validator];

        if (verifySignature(precommit.body, Precommit, precommit.signature, publicKey) === false) {
            console.error('Wrong signature of precommit.');
            return false;
        }
    }

    if (uniqueValidators.length <= validatorsTotalNumber * 2 / 3) {
        console.error('Not enough precommits from unique validators.');
        return false;
    }

    return true;
}

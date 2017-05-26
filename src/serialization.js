'use strict';
var Exonum = require('../src/core');

require('../src/types');

/**
 * Serialize data into array of 8-bit integers and insert into buffer
 * @param {Array} buffer
 * @param {number} shift - the index to start write into buffer
 * @param {Object} data
 * @param type - can be {NewType} or one of built-in types
 */
Exonum.serialize = function(buffer, shift, data, type) {
    function isFixed(fields) {
        for (var fieldName in fields) {
            if (!fields.hasOwnProperty(fieldName)) {
                continue;
            }

            if (Exonum.isInstanceofOfNewType(fields[fieldName].type)) {
                isFixed(fields[fieldName].type.fields);
            } else if (fields[fieldName].type === String) {
                return false;
            }
        }
        return true;
    }

    for (var i = 0; i < type.size; i++) {
        buffer[shift + i] = 0;
    }

    for (var fieldName in type.fields) {
        if (!type.fields.hasOwnProperty(fieldName)) {
            continue;
        }

        var fieldData = data[fieldName];

        if (fieldData === undefined) {
            return;
        }

        var fieldType = type.fields[fieldName];
        var from = shift + fieldType.from;

        if (Exonum.isInstanceofOfNewType(fieldType.type)) {
            if (isFixed(fieldType.type.fields)) {
                buffer = Exonum.serialize(buffer, from, fieldData, fieldType.type);
            } else {
                var end = buffer.length;
                Exonum.Uint32(end, buffer, from, from + 4);
                buffer = Exonum.serialize(buffer, end, fieldData, fieldType.type);
                Exonum.Uint32(buffer.length - end, buffer, from + 4, from + 8);
            }
        } else {
            buffer = fieldType.type(fieldData, buffer, from, shift + fieldType.to);
        }
    }

    return buffer;
};

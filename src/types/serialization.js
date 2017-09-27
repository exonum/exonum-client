import { isInstanceofOfNewType } from './generic'
import { isInstanceofOfNewArray } from './array'
import { Uint32, String, FixedBuffer } from './primitive'

/**
 * Serialize data into array of 8-bit integers and insert into buffer
 * @param {Array} buffer
 * @param {number} shift - the index to start write into buffer
 * @param {Object} data
 * @param type - can be {NewType} or one of built-in types
 * @param {boolean} [isTransactionBody]
 * @returns {Array}
 */
export function serialize (buffer, shift, data, type, isTransactionBody) {
  /**
   * Check if field is of fixed-length type. Fixed-length means field serialized (inserted) directly into buffer without pointer
   * @param {Object} field
   * @returns {boolean}
   */
  function fieldIsFixed (field) {
    if (isInstanceofOfNewType(field.type)) {
      return fieldsAreFixed(field.type.fields)
    } else if (field.type === String || field.type === FixedBuffer) {
      return false
    }
    return true
  }

  /**
   * Check if all fields are of fixed-length type
   * @param {Array} fields
   * @returns {boolean}
   */
  function fieldsAreFixed (fields) {
    for (let fieldName in fields) {
      if (!fieldIsFixed(fields[fieldName])) {
        return false
      }
    }
    return true
  }

  /**
   * Serialize instanceof of NewType
   * @param {Array} buffer
   * @param {number} shift
   * @param {number} from
   * @param {Object} data
   * @param {NewType} type
   * @returns {Array}
   */
  function serializeInstanceofOfNewType (buffer, shift, from, data, type) {
    if (fieldsAreFixed(type.fields)) {
      buffer = serialize(buffer, from, data, type)
    } else {
      const end = buffer.length
      Uint32(end - shift, buffer, from, from + 4) // start index
      buffer = serialize(buffer, end, data, type)
      Uint32(buffer.length - end, buffer, from + 4, from + 8) // length
    }

    return buffer
  }

  /**
   * Serialize instanceof of NewArray
   * @param {Array} buffer
   * @param {number} shift
   * @param {number} from
   * @param {Object} data
   * @param {NewType} type
   * @returns {Array}
   */
  function serializeInstanceofOfNewArray (buffer, shift, from, data, type) {
    if (!Array.isArray(data)) {
      throw new TypeError('Data of wrong type is passed. Array expected.')
    }

    Uint32(buffer.length, buffer, from, from + 4) // start index
    Uint32(data.length, buffer, from + 4, from + 8) // array length

    if (isInstanceofOfNewType(type.type)) {
      const start = buffer.length

      // reserve segment for pointers
      for (let i = start; i < start + data.length * 8; i++) {
        buffer[i] = 0
      }

      for (let i = 0; i < data.length; i++) {
        const index = start + i * 8
        const end = buffer.length

        Uint32(end - shift, buffer, index, index + 4) // start index
        buffer = serialize(buffer, end, data[i], type.type)
        Uint32(buffer.length - end, buffer, index + 4, index + 8) // length
      }
    } else if (isInstanceofOfNewArray(type.type)) {
      const start = buffer.length

      // reserve segment for pointers
      for (let i = start; i < start + data.length * 8; i++) {
        buffer[i] = 0
      }

      for (let i = 0; i < data.length; i++) {
        const index = start + i * 8

        buffer = serializeInstanceofOfNewArray(buffer, shift, index, data[i], type.type)
      }
    } else if (type.type === String || type.type === FixedBuffer) {
      throw new TypeError('Array of String and FixedBuffer types is not supported.')
    } else {
      for (let item of data) {
        buffer = type.type(item, buffer, buffer.length, buffer.length + type.size)
      }
    }

    return buffer
  }

  for (let i = 0; i < type.size; i++) {
    buffer[shift + i] = 0
  }

  for (let fieldName in type.fields) {
    const fieldData = data[fieldName]

    if (fieldData === undefined) {
      throw new TypeError('Field ' + fieldName + ' is not defined.')
    }

    const fieldType = type.fields[fieldName]
    const from = shift + fieldType.from
    const fieldShift = (isTransactionBody === true) ? 0 : shift

    if (isInstanceofOfNewType(fieldType.type)) {
      buffer = serializeInstanceofOfNewType(buffer, fieldShift, from, fieldData, fieldType.type)
    } else if (isInstanceofOfNewArray(fieldType.type)) {
      buffer = serializeInstanceofOfNewArray(buffer, fieldShift, from, fieldData, fieldType.type)
    } else {
      buffer = fieldType.type(fieldData, buffer, from, shift + fieldType.to, buffer.length - fieldShift)
    }
  }

  return buffer
}

import { isInstanceofOfNewType, newTypeIsFixed, fieldIsFixed } from './generic'
import { isInstanceofOfNewArray } from './array'
import { Uint32, String } from './primitive'

export const POINTER_LENGTH = 8

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
   * Serialize instanceof of NewType
   * @param {Array} buffer
   * @param {number} shift
   * @param {number} from
   * @param {Object} data
   * @param {NewType} type
   * @returns {Array}
   */
  function serializeInstanceofOfNewType (buffer, shift, from, data, type) {
    if (newTypeIsFixed(type)) {
      buffer = serialize(buffer, from, data, type)
      return buffer
    }

    const end = buffer.length
    Uint32.serialize(end - shift, buffer, from) // start index
    buffer = serialize(buffer, end, data, type)
    Uint32.serialize(buffer.length - end, buffer, from + 4) // length
    return buffer
  }

  /**
   * Serialize instanceof of NewArray for NewType
   * @param {Array} buffer
   * @param {number} shift
   * @param {Object} data
   * @param {NewType} type
   * @returns {Array}
   */
  function serializeInstanceofOfNewArrayForNewType (buffer, shift, data, type) {
    const start = buffer.length

    // reserve segment for pointers
    for (let i = start; i < start + data.length * POINTER_LENGTH; i++) {
      buffer[i] = 0
    }

    for (let i = 0; i < data.length; i++) {
      const index = start + i * POINTER_LENGTH
      const end = buffer.length

      Uint32.serialize(end - shift, buffer, index) // start index
      buffer = serialize(buffer, end, data[i], type.type)
      Uint32.serialize(buffer.length - end, buffer, index + 4) // length
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

    if (type.type === String) {
      throw new TypeError('Array of String types is not supported.')
    }

    Uint32.serialize(buffer.length - shift, buffer, from) // start index
    Uint32.serialize(data.length, buffer, from + 4) // array length

    if (isInstanceofOfNewType(type.type)) {
      return serializeInstanceofOfNewArrayForNewType(buffer, shift, data, type)
    }

    if (isInstanceofOfNewArray(type.type)) {
      const start = buffer.length

      // reserve segment for pointers
      for (let i = start; i < start + data.length * POINTER_LENGTH; i++) {
        buffer[i] = 0
      }

      for (let i = 0; i < data.length; i++) {
        const index = start + i * POINTER_LENGTH

        buffer = serializeInstanceofOfNewArray(buffer, shift, index, data[i], type.type)
      }
      return buffer
    }

    for (const item of data) {
      buffer = type.type.serialize(item, buffer, buffer.length, buffer.length + type.type.size())
    }

    return buffer
  }

  // reserve array cells
  for (let i = 0; i < type.size(); i++) {
    buffer[shift + i] = 0
  }

  let localShift = 0
  type.fields.forEach(field => {
    const value = data[field.name]

    if (value === undefined) {
      throw new TypeError('Field ' + field.name + ' is not defined.')
    }

    const from = shift + localShift
    let nestedShift = (isTransactionBody === true) ? 0 : shift

    if (isInstanceofOfNewType(field.type)) {
      buffer = serializeInstanceofOfNewType(buffer, nestedShift, from, value, field.type)
      if (fieldIsFixed(field)) {
        localShift += field.type.size()
      } else {
        localShift += POINTER_LENGTH
      }
    } else if (isInstanceofOfNewArray(field.type)) {
      buffer = serializeInstanceofOfNewArray(buffer, nestedShift, from, value, field.type)
      localShift += field.type.size()
    } else {
      buffer = field.type.serialize(value, buffer, from, buffer.length - nestedShift)
      localShift += field.type.size()
    }
  })

  return buffer
}

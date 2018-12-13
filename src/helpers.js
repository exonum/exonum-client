const intTypes = ['sint32', 'uint32', 'int32', 'sfixed32', 'fixed32', 'sint64', 'uint64', 'int64', 'sfixed64', 'fixed64']

/**
 * Check if element is of type Object
 * @param obj
 * @returns {boolean}
 */
export function isObject (obj) {
  return (typeof obj === 'object' && !Array.isArray(obj) && obj !== null && !(obj instanceof Date))
}

/**
 * @param {Object} data
 * @returns {Object}
 */
export function cleanZeroValuedFields (schema, data, object) {
  const keys = Object.keys(data)
  keys.forEach(element => {
    if (schema.fields && schema.fields[element] && schema.fields[element].name && schema.fields[element].type) {
      if (schema.fields[element].type === 'message') {
        object[element] = cleanZeroValuedFields(schema.fields[element], data[element], object)
      }
      if (!(intTypes.find((value) => { return value === schema.fields[element].type }) && data[element] === 0)) {
        object[element] = data[element]
      }
    }
  })

  return data
}

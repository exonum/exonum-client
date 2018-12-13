function isStrictTypedArray (arr) {
  return (
    arr instanceof Int8Array ||
    arr instanceof Int16Array ||
    arr instanceof Int32Array ||
    arr instanceof Uint8Array ||
    arr instanceof Uint8ClampedArray ||
    arr instanceof Uint16Array ||
    arr instanceof Uint32Array ||
    arr instanceof Float32Array ||
    arr instanceof Float64Array
  )
}

/**
 * Check if element is of type Object
 * @param obj
 * @returns {boolean}
 */
export function isObject (obj) {
  return (typeof obj === 'object' && !Array.isArray(obj) && obj !== null && !(obj instanceof Date))
}

/**
 * @param {Object} element
 * @returns {boolean}
 */
export function verifyElement (element) {
  switch (typeof element) {
    case 'string':
      return element !== '0' && element.length !== 0
    case 'number':
      return element !== 0
  }
  return true
}

/**
 * @param {Object} data
 * @param {Object} object
 * @returns {Object}
 */
export function cleanZeroValuedFields (data, object) {
  const keys = Object.keys(data)
  keys.forEach(key => {
    if (isStrictTypedArray(data[key]) || data[key] instanceof Array) {
      object[key] = data[key]
    } else {
      if (typeof data[key] === 'object') {
        object[key] = cleanZeroValuedFields(data[key], {})
      } else {
        if (verifyElement(data[key])) {
          object[key] = data[key]
        }
      }
    }
  })
  return object
}

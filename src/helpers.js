/**
 * Check if element is of type Object
 * @param obj
 * @returns {boolean}
 */
export function isObject(obj) {
  return (typeof obj === 'object' && !Array.isArray(obj) && obj !== null && !(obj instanceof Date))
}

/**
 * @param {Object} element
 * @returns {boolean}
 */
export function verifyElement(element) {
  switch (typeof element) {
    case 'string' :
      return element !== '0' && element.length !== 0
    case 'number' :
      return element !== 0
  }
  return true
}

/**
 * @param {Object} data
 * @param {Object} object
 * @returns {Object}
 */
export function cleanZeroValuedFields(data, object) {
  const keys = Object.keys(data)
  keys.forEach(element => {
    if (element instanceof Object) {
      object[element] = cleanZeroValuedFields(data[element], object)
    } else {
      if (verifyElement(data[element])) {
        object[element] = data[element]
      }
    }
  })
  return object
}

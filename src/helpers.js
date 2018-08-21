/**
 * Check if element is of type Object
 * @param obj
 * @returns {boolean}
 */
export function isObject (obj) {
  return (typeof obj === 'object' && !Array.isArray(obj) && obj !== null && !(obj instanceof Date))
}

/**
 * Compare two Uint8Arrays
 * @param a {Uint8Array}
 * @param b {Uint8Array}
 * @returns {boolean}
 */
export function compareUint8Arrays (a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

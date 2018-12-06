/**
 * Check if element is of type Object
 * @param obj
 * @returns {boolean}
 */
export function isObject (obj) {
  return (typeof obj === 'object' && !Array.isArray(obj) && obj !== null && !(obj instanceof Date))
}

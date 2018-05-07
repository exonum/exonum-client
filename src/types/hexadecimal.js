import * as validate from './validate'

class BaseHexType {
  constructor (size, name) {
    this.size = () => size
    this.name = name
    this.type = name.toLowerCase()
  }

  /**
   * @param {string} str string to encode
   * @param {Array} buffer buffer to place result to
   * @param {number} from position to write from
   * @returns {Array} modified buffer
   */
  _insertHexadecimalToByteArray (str, buffer, from) {
    for (let i = 0; i < str.length; i += 2) {
      buffer[from] = parseInt(str.substr(i, 2), 16)
      from++
    }
    return buffer
  }

  validate (value) {
    if (!validate.validateHexadecimal(value, this.size())) {
      throw new TypeError(`${this.name} of wrong type is passed: ${value}`)
    }
  }

  /**
   * @param {string} value hex string to encode
   * @param {Array} buffer buffer to output encoded string
   * @param {number} from position to write to
   * @returns {Array} buffer with encoded data appended
   */
  serialize (value, buffer, from) {
    this.validate(value)

    return this._insertHexadecimalToByteArray(value, buffer, from)
  }
}

class Uuid extends BaseHexType {
  constructor () {
    super(16, 'Uuid')
  }

  /**
   * @param {string} value hex string to encode
   * @param {Array} buffer buffer to output encoded string
   * @param {number} from position to write to
   * @returns {Array} buffer with encoded data appended
   */
  serialize (value, buffer, from) {
    value = value && String(value).replace(/-/g, '')
    return super.serialize(value, buffer, from)
  }
}

class Hash extends BaseHexType {
  constructor () {
    super(32, 'Hash')
  }

  /**
   * @param value
   * @returns value
   */
  hash (value) {
    this.validate(value)

    return value
  }
}

class Digest extends BaseHexType {
  constructor () {
    super(64, 'Digest')
  }
}

class PublicKey extends BaseHexType {
  constructor () {
    super(32, 'PublicKey')
  }
}

const uuid = new Uuid()
const hash = new Hash()
const digest = new Digest()
const publicKey = new PublicKey()

export { uuid as Uuid, hash as Hash, digest as Digest, publicKey as PublicKey }

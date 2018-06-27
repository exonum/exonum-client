const Exonum = require('../../src')

export default class DataSchema {
  constructor (schema) {
    this.types = {}
    this.arrays = {}
    this.messages = {}

    const ExonumTypes = ['Uuid', 'PublicKey', 'String', 'Hash', 'Digest', 'Timespec',
      'Bool', 'Int8', 'Int16', 'Int32', 'Int64', 'Uint8', 'Uint16', 'Uint32', 'Uint64', 'Float32', 'Float64', 'Decimal']
    ExonumTypes.forEach(item => (this.types[item] = Exonum[item]))

    Object.keys(schema).forEach(key => {
      const item = schema[key]
      if (!item.as || item.as === 'type' || item.as === 'message') {
        item.fields.forEach(field => {
          field.type = this.getTypeOrArray(field.type)
        })
        if (!item.as || item.as === 'type') this.types[key] = Exonum.newType(item)
        if (item.as === 'message') this.messages[key] = Exonum.newMessage(item)
      } else {
        if (item.as === 'array') {
          item.type = this.getTypeOrArray(item.type)
          this.arrays[key] = Exonum.newArray(item)
        }
      }
    })
  }

  getTypeOrArray (name) {
    return this.getType(name) || this.getArray(name)
  }

  getType (name) {
    return this.types[name]
  }

  getMessage (name) {
    return this.messages[name]
  }

  getArray (name) {
    return this.arrays[name]
  }
}

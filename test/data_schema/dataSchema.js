const Exonum = require('src')

export default class DataSchema {
  constructor (schema) {
    this.types = {}
    this.arrays = {}
    this.messages = {}

    const ExonumTypes = ['PublicKey', 'String', 'Uint64', 'Hash', 'FixedBuffer']
    ExonumTypes.forEach(item => (this.types[item] = Exonum[item]))

    Object.keys(schema.types)
      .forEach(key => {
        const type = schema.types[key]
        Object.keys(type.fields)
          .forEach(fieldKey => {
            const field = type.fields[fieldKey]
            field.type = this.getTypeOrArray(field.type)
          })
        this.types[key] = Exonum.newType(type)
      })

    Object.keys(schema.arrays)
      .forEach(key => {
        const array = schema.arrays[key]
        array.type = this.getTypeOrArray(array.type)
        this.arrays[key] = Exonum.newArray(array)
      })

    Object.keys(schema.messages)
      .forEach(key => {
        const message = schema.messages[key]
        Object.keys(message.fields)
          .forEach(fieldKey => {
            const field = message.fields[fieldKey]
            field.type = this.getTypeOrArray(field.type)
          })
        this.messages[key] = Exonum.newMessage(message)
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

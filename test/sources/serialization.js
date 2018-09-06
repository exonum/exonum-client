/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const protobuf = require('protobufjs')
const Type = protobuf.Type
const Field = protobuf.Field

describe('Serialize data', function () {
  const data = { name: 'John Doe', age: 29 }
  const buffer = new Uint8Array([10, 8, 74, 111, 104, 110, 32, 68, 111, 101, 16, 29])

  it('should serialize data', function () {
    let User = new Type('User').add(new Field('name', 1, 'string')).add(new Field('age', 2, 'int32'))
    let Message = User.create(data)

    expect(User.encode(Message).finish()).to.deep.equal(buffer)
  })

  it('should serialize data using scheme defined in .proto file', function () {
    return protobuf.load('./test/sources/schemas/user.proto')
      .then(root => {
        let User = root.lookupType('User')
        let Message = User.create(data)
        expect(User.encode(Message).finish()).to.deep.equal(buffer)
      })
  })
})

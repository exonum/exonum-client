/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect
const Exonum = require('../src')

describe('Serialize data into array of 8-bit integers', function () {
  it('should serialize data of newType type and return array of 8-bit integers', function () {
    const Wallet = Exonum.newType({
      size: 80,
      fields: {
        pub_key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 },
        name: { type: Exonum.String, size: 8, from: 32, to: 40 },
        balance: { type: Exonum.Uint64, size: 8, from: 40, to: 48 },
        history_hash: { type: Exonum.Hash, size: 32, from: 48, to: 80 }
      }
    })
    const walletData = {
      pub_key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
      name: 'Smart wallet',
      balance: 359120,
      history_hash: '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030'
    }

    const buffer = Wallet.serialize(walletData)

    expect(buffer).to.deep.equal([245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54, 80, 0, 0, 0, 12, 0, 0, 0, 208, 122, 5, 0, 0, 0, 0, 0, 103, 82, 190, 136, 35, 20, 245, 187, 188, 154, 106, 242, 174, 99, 79, 192, 112, 56, 88, 74, 74, 119, 81, 14, 165, 236, 237, 69, 245, 77, 192, 48, 83, 109, 97, 114, 116, 32, 119, 97, 108, 108, 101, 116])
  })

  it('should serialize data of newMessage type with nested String and return array of 8-bit integers', function () {
    const TxRemoveRepository = Exonum.newMessage({
      size: 40,
      network_id: 0,
      protocol_version: 0,
      service_id: 198,
      message_id: 6,
      signature: 'a8f09060198192799b3bdc1634878369bb2a72fdb6c0c5dd92636605723be24e57feebe705116287604f1f93df8953d2abab9ce2ddad7e6a1d83a7651376640c',
      fields: {
        public_key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 },
        repo_id: { type: Exonum.String, size: 8, from: 32, to: 40 }
      }
    })
    const data = {
      public_key: '4f0d8cf2b2d1ca3d0ce355514ab24069c7c9f83ebd8a3987821e923ddb43ae9a',
      repo_id: '86123088'
    }

    const buffer = TxRemoveRepository.serialize(data)

    expect(buffer).to.deep.equal([0, 0, 6, 0, 198, 0, 122, 0, 0, 0, 79, 13, 140, 242, 178, 209, 202, 61, 12, 227, 85, 81, 74, 178, 64, 105, 199, 201, 248, 62, 189, 138, 57, 135, 130, 30, 146, 61, 219, 67, 174, 154, 50, 0, 0, 0, 8, 0, 0, 0, 56, 54, 49, 50, 51, 48, 56, 56, 168, 240, 144, 96, 25, 129, 146, 121, 155, 59, 220, 22, 52, 135, 131, 105, 187, 42, 114, 253, 182, 192, 197, 221, 146, 99, 102, 5, 114, 59, 226, 78, 87, 254, 235, 231, 5, 17, 98, 135, 96, 79, 31, 147, 223, 137, 83, 210, 171, 171, 156, 226, 221, 173, 126, 106, 29, 131, 167, 101, 19, 118, 100, 12])
  })

  it('should serialize data of newMessage type with nested NewType and return array of 8-bit integers', function () {
    const User = Exonum.newType({
      size: 64,
      fields: {
        public_key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 },
        login: { type: Exonum.String, size: 8, from: 32, to: 40 },
        name: { type: Exonum.String, size: 8, from: 40, to: 48 },
        url: { type: Exonum.String, size: 8, from: 48, to: 56 },
        avatar_url: { type: Exonum.String, size: 8, from: 56, to: 64 }
      }
    })
    const TxAddUser = Exonum.newMessage({
      size: 40,
      network_id: 0,
      protocol_version: 0,
      service_id: 198,
      message_id: 0,
      signature: 'a8f09060198192799b3bdc1634878369bb2a72fdb6c0c5dd92636605723be24e57feebe705116287604f1f93df8953d2abab9ce2ddad7e6a1d83a7651376640c',
      fields: {
        public_key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 },
        content: { type: User, size: 8, from: 32, to: 40 }
      }
    })
    const data = {
      public_key: 'bfa0558f3768a9d06019aa13f8ebe227a160a3c31fc2f9201d2c72dc7f77da98',
      content: {
        public_key: 'bfa0558f3768a9d06019aa13f8ebe227a160a3c31fc2f9201d2c72dc7f77da98',
        login: 'login',
        name: 'name',
        url: 'url',
        avatar_url: 'avatar_url'
      }
    }

    const buffer = TxAddUser.serialize(data)

    expect(buffer).to.deep.equal([0, 0, 0, 0, 198, 0, 200, 0, 0, 0, 191, 160, 85, 143, 55, 104, 169, 208, 96, 25, 170, 19, 248, 235, 226, 39, 161, 96, 163, 195, 31, 194, 249, 32, 29, 44, 114, 220, 127, 119, 218, 152, 50, 0, 0, 0, 86, 0, 0, 0, 191, 160, 85, 143, 55, 104, 169, 208, 96, 25, 170, 19, 248, 235, 226, 39, 161, 96, 163, 195, 31, 194, 249, 32, 29, 44, 114, 220, 127, 119, 218, 152, 64, 0, 0, 0, 5, 0, 0, 0, 69, 0, 0, 0, 4, 0, 0, 0, 73, 0, 0, 0, 3, 0, 0, 0, 76, 0, 0, 0, 10, 0, 0, 0, 108, 111, 103, 105, 110, 110, 97, 109, 101, 117, 114, 108, 97, 118, 97, 116, 97, 114, 95, 117, 114, 108, 168, 240, 144, 96, 25, 129, 146, 121, 155, 59, 220, 22, 52, 135, 131, 105, 187, 42, 114, 253, 182, 192, 197, 221, 146, 99, 102, 5, 114, 59, 226, 78, 87, 254, 235, 231, 5, 17, 98, 135, 96, 79, 31, 147, 223, 137, 83, 210, 171, 171, 156, 226, 221, 173, 126, 106, 29, 131, 167, 101, 19, 118, 100, 12])
  })

  it('should serialize data of newMessage type with nested Array and return array of 8-bit integers', function () {
    const User = Exonum.newType({
      size: 64,
      fields: {
        public_key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 },
        login: { type: Exonum.String, size: 8, from: 32, to: 40 },
        name: { type: Exonum.String, size: 8, from: 40, to: 48 },
        url: { type: Exonum.String, size: 8, from: 48, to: 56 },
        avatar_url: { type: Exonum.String, size: 8, from: 56, to: 64 }
      }
    })
    const Arr = Exonum.newArray({
      size: 64,
      type: User
    })
    const TxAddUser = Exonum.newMessage({
      size: 40,
      network_id: 0,
      protocol_version: 0,
      service_id: 198,
      message_id: 0,
      signature: 'a8f09060198192799b3bdc1634878369bb2a72fdb6c0c5dd92636605723be24e57feebe705116287604f1f93df8953d2abab9ce2ddad7e6a1d83a7651376640c',
      fields: {
        public_key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 },
        content: { type: Arr, size: 8, from: 32, to: 40 }
      }
    })
    const data = {
      public_key: 'bfa0558f3768a9d06019aa13f8ebe227a160a3c31fc2f9201d2c72dc7f77da98',
      content: [
        {
          public_key: 'bfa0558f3768a9d06019aa13f8ebe227a160a3c31fc2f9201d2c72dc7f77da98',
          login: 'login',
          name: 'name',
          url: 'url',
          avatar_url: 'avatar_url'
        }
      ]
    }

    const buffer = TxAddUser.serialize(data)

    expect(buffer).to.deep.equal([0, 0, 0, 0, 198, 0, 208, 0, 0, 0, 191, 160, 85, 143, 55, 104, 169, 208, 96, 25, 170, 19, 248, 235, 226, 39, 161, 96, 163, 195, 31, 194, 249, 32, 29, 44, 114, 220, 127, 119, 218, 152, 50, 0, 0, 0, 1, 0, 0, 0, 58, 0, 0, 0, 86, 0, 0, 0, 191, 160, 85, 143, 55, 104, 169, 208, 96, 25, 170, 19, 248, 235, 226, 39, 161, 96, 163, 195, 31, 194, 249, 32, 29, 44, 114, 220, 127, 119, 218, 152, 64, 0, 0, 0, 5, 0, 0, 0, 69, 0, 0, 0, 4, 0, 0, 0, 73, 0, 0, 0, 3, 0, 0, 0, 76, 0, 0, 0, 10, 0, 0, 0, 108, 111, 103, 105, 110, 110, 97, 109, 101, 117, 114, 108, 97, 118, 97, 116, 97, 114, 95, 117, 114, 108, 168, 240, 144, 96, 25, 129, 146, 121, 155, 59, 220, 22, 52, 135, 131, 105, 187, 42, 114, 253, 182, 192, 197, 221, 146, 99, 102, 5, 114, 59, 226, 78, 87, 254, 235, 231, 5, 17, 98, 135, 96, 79, 31, 147, 223, 137, 83, 210, 171, 171, 156, 226, 221, 173, 126, 106, 29, 131, 167, 101, 19, 118, 100, 12])
  })

  it('should serialize data of complicated non-fixed newType type and return array of 8-bit integers', function () {
    const User = Exonum.newType({
      size: 16,
      fields: {
        name: { type: Exonum.String, size: 8, from: 0, to: 8 },
        surname: { type: Exonum.String, size: 8, from: 8, to: 16 }
      }
    })
    const Transaction = Exonum.newType({
      size: 24,
      fields: {
        from: { type: User, size: 8, from: 0, to: 8 },
        to: { type: User, size: 8, from: 8, to: 16 },
        sum: { type: Exonum.Uint64, size: 8, from: 16, to: 24 }
      }
    })
    const transactionData = {
      from: {
        name: 'John',
        surname: 'Doe'
      },
      to: {
        name: 'Steven',
        surname: 'Black'
      },
      sum: 200
    }

    const buffer = Transaction.serialize(transactionData)

    expect(buffer).to.deep.equal([24, 0, 0, 0, 23, 0, 0, 0, 47, 0, 0, 0, 27, 0, 0, 0, 200, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 4, 0, 0, 0, 20, 0, 0, 0, 3, 0, 0, 0, 74, 111, 104, 110, 68, 111, 101, 16, 0, 0, 0, 6, 0, 0, 0, 22, 0, 0, 0, 5, 0, 0, 0, 83, 116, 101, 118, 101, 110, 66, 108, 97, 99, 107])
  })

  it('should serialize data of complicated non-fixed newType type and return array of 8-bit integers', function () {
    const User = Exonum.newType({
      size: 12,
      fields: {
        name: { type: Exonum.String, size: 8, from: 0, to: 8 }
      }
    })
    const Transaction = Exonum.newType({
      size: 16,
      fields: {
        to: { type: User, size: 8, from: 0, to: 8 },
        sum: { type: Exonum.Uint64, size: 8, from: 8, to: 16 }
      }
    })
    const transactionData = {
      to: {
        name: 'John Doe'
      },
      sum: 200
    }

    const buffer = Transaction.serialize(transactionData)

    expect(buffer).to.deep.equal([16, 0, 0, 0, 20, 0, 0, 0, 200, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 74, 111, 104, 110, 32, 68, 111, 101])
  })

  it('should serialize data of complicated fixed newType type and return array of 8-bit integers', function () {
    const Wallet = Exonum.newType({
      size: 16,
      fields: {
        id: { type: Exonum.Uint64, size: 8, from: 0, to: 8 },
        balance: { type: Exonum.Uint64, size: 8, from: 8, to: 16 }
      }
    })
    const Transaction = Exonum.newType({
      size: 24,
      fields: {
        from: { type: Wallet, size: 8, from: 0, to: 8 },
        to: { type: Wallet, size: 8, from: 8, to: 16 },
        sum: { type: Exonum.Uint64, size: 8, from: 16, to: 24 }
      }
    })
    const transactionData = {
      from: {
        id: 57,
        balance: 500
      },
      to: {
        id: 921,
        balance: 0
      },
      sum: 200
    }

    const buffer = Transaction.serialize(transactionData)

    expect(buffer).to.deep.equal([57, 0, 0, 0, 0, 0, 0, 0, 153, 3, 0, 0, 0, 0, 0, 0, 200, 0, 0, 0, 0, 0, 0, 0])
  })

  it('should serialize data (with inherited properties that should be ignored) of newType type and return array of 8-bit integers', function () {
    const Wallet = Exonum.newType({
      size: 80,
      fields: {
        pub_key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 },
        name: { type: Exonum.String, size: 8, from: 32, to: 40 },
        balance: { type: Exonum.Uint64, size: 8, from: 40, to: 48 },
        history_hash: { type: Exonum.Hash, size: 32, from: 48, to: 80 }
      }
    })

    function Data () {
      this.pub_key = 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36'
      this.name = 'Smart wallet'
      this.balance = 359120
      this.history_hash = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030'
      return this
    }

    function DataAncestor () {
      return this
    }

    DataAncestor.prototype.someMethod = function () {
      return this
    }

    Data.prototype = Object.create(DataAncestor.prototype)

    const walletData = new Data()

    const buffer = Wallet.serialize(walletData)

    expect(buffer).to.deep.equal([245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54, 80, 0, 0, 0, 12, 0, 0, 0, 208, 122, 5, 0, 0, 0, 0, 0, 103, 82, 190, 136, 35, 20, 245, 187, 188, 154, 106, 242, 174, 99, 79, 192, 112, 56, 88, 74, 74, 119, 81, 14, 165, 236, 237, 69, 245, 77, 192, 48, 83, 109, 97, 114, 116, 32, 119, 97, 108, 108, 101, 116])
  })

  it('should throw error when some data parameters are missed', function () {
    const Wallet = Exonum.newType({
      size: 80,
      fields: {
        pub_key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 },
        name: { type: Exonum.String, size: 8, from: 32, to: 40 },
        balance: { type: Exonum.Uint64, size: 8, from: 40, to: 48 },
        history_hash: { type: Exonum.Hash, size: 32, from: 48, to: 80 }
      }
    })
    const walletData = { fake: 123 }

    expect(() => Wallet.serialize(walletData)).to.throw(TypeError)
  })
})

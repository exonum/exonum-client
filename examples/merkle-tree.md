# Verify a Merkle tree

An example of verifying a Merkle tree:

```javascript
const rootHash = '1b896884ccc3777b961b7cc3b120d96a79861f19510ace2d36ec2d52648f5821'
const count = 3
const proofNode = {
  left: {
    left: {
      val: {
        firstName: 'John',
        lastName: 'Doe',
        age: 28,
        balance: 2500
      }
    },
    right: '8dc134fc6f0e0b7fccd32bb0f6090e68600710234c1cb318261d5e78be659bd1'
  },
  right: '3b45eedc6952cbec6a8b769c3e50f96d1d059853bbedb7c26f8621243b308e9a'
}
const range = [0, 0]
let Schema = new Type('CustomMessage')
Schema.add(new Field('firstName', 1, 'string'))
Schema.add(new Field('lastName', 2, 'string'))
Schema.add(new Field('age', 3, 'uint32'))
Schema.add(new Field('balance', 4, 'uint32'))
let User = Exonum.newType(Schema)

let elements = Exonum.merkleProof(rootHash, count, proofNode, range, User) // [{firstName: 'John', lastName: 'Doe', age: 28, balance: 2500}]
```

An example of verifying a Merkle tree with elements passed as hashes:

```javascript
const rootHash = 'd61dc473664954eaffc1c418a55cab83f7b49cc4276a8a799a42cbdc9722a009'
const count = 2
const proofNode = {
  left: {
    val: 'c19569c5b391b1106e16021f50d20763cbece4199fd1356f2d3e429ff13e1345'
  },
  right: {
    val: '3e1ff2f54195207e42d36ff0de1b345be9c59111b67263c31364506d11e2190f'
  }
}
const range = [0, 8]

let elements = Exonum.merkleProof(rootHash, count, proofNode, range) // ['c19569c5b391b1106e16021f50d20763cbece4199fd1356f2d3e429ff13e1345', '3e1ff2f54195207e42d36ff0de1b345be9c59111b67263c31364506d11e2190f']
```

An example of verifying a Merkle tree with elements passed as byte arrays:

```javascript
const rootHash = '6956f2d3b391b1106e160210de1345c563cbece4199fd13f5c195207e429ff13'
const count = 8
const proofNode = {
  left: {
    left: {
      left: {val: [1, 2]},
      right: {val: [2, 3]}
    },
    right: {
      left: {val: [3, 4]},
      right: {val: [4, 5]}
    }
  },
  right: {
    left: {
      left: {val: [5, 6]},
      right: {val: [6, 7]}
    },
    right: {
      left: {val: [7, 8]},
      right: {val: [8, 9]}
    }
  }
}
const range = [0, 8]

let elements = Exonum.merkleProof(rootHash, count, proofNode, range) // [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]]
```

# Examples of operations on transactions

## Serialize transaction

An example of serialization into a byte array:

```javascript
// Define a transaction schema
let Transaction = new Type('CustomMessage')
Transaction.add(new Field('from', 1, 'string'))
Transaction.add(new Field('to', 2, 'string'))
Transaction.add(new Field('amount', 3, 'uint32'))

// Define a transaction
const sendFunds = Exonum.newTransaction({
  author: keyPair.publicKey,
  service_id: 130,
  message_id: 0,
  schema: Transaction
})

// Data
const data = {
  from: 'John',
  to: 'Adam',
  amount: 50
}

// Serialize
let buffer = sendFunds.serialize(data)
```

Read more about [serialization](../README.md#serialization).

## Sign transaction

An example of transaction signing:

```javascript
// Define a transaction schema
let Transaction = new Type('CustomMessage')
Transaction.add(new Field('from', 1, 'string'))
Transaction.add(new Field('to', 2, 'string'))
Transaction.add(new Field('amount', 3, 'uint32'))

// Define a transaction
const sendFunds = Exonum.newTransaction({
  author: keyPair.publicKey,
  service_id: 130,
  message_id: 0,
  schema: Transaction
})

// Data to be serialized
const data = {
  from: 'John',
  to: 'Adam',
  amount: 50
}

// Define
const keyPair = {
  publicKey: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
  secretKey: '978e3321bd6331d56e5f4c2bdb95bf471e95a77a6839e68d4241e7b0932ebe2b' +
  'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'
}

// Sign the data
let signature = sendFunds.sign(keyPair.secretKey, data) // 'a4cf7c457e3f4d54ef0c87900e7c860d2faa17a8dccbaafa573a3a960cda3f6627911088138526d9d7e46feba471e6bc7b93262349a5ed18262cbc39c8a47b04'
```

Read more about [data signing](../README.md#sign-data).

## Verify signed transaction

An example of signature verification:

```javascript
// Define a transaction schema
let Transaction = new Type('CustomMessage')
Transaction.add(new Field('from', 1, 'string'))
Transaction.add(new Field('to', 2, 'string'))
Transaction.add(new Field('amount', 3, 'uint32'))

// Define a transaction
const sendFunds = Exonum.newTransaction({
  author: keyPair.publicKey,
  service_id: 130,
  message_id: 0,
  schema: Transaction
})

// Data
const data = {
  from: 'John',
  to: 'Adam',
  amount: 50
}

// Define a signing key pair
const keyPair = {
  publicKey: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
  secretKey: '978e3321bd6331d56e5f4c2bdb95bf471e95a77a6839e68d4241e7b0932ebe2b' +
  'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'
}

// Signature obtained upon signing using secret key
const signature = '3dcf7891f6c2dda876758818c11d50ffcdfec47f6b7145dd0a4a12705f51f219' +
 '65b192f6cec9175e5df4fd978af95e005afe5c8218e234e7552b716e64708b0f'

// Verify the signature
let result = sendFunds.verifySignature(signature, keyPair.publicKey, data) // true
```

Read more about [signature verification](../README.md#verify-signature).

## Get a transaction hash

Note, the transaction **must be signed** before the hash is calculated.

Example of calculation of a transaction hash:

```javascript
// Define a transaction schema
let Transaction = new Type('CustomMessage')
Transaction.add(new Field('from', 1, 'string'))
Transaction.add(new Field('to', 2, 'string'))
Transaction.add(new Field('amount', 3, 'uint32'))

// Define a transaction
const sendFunds = Exonum.newTransaction({
  author: keyPair.publicKey,
  service_id: 130,
  message_id: 0,
  schema: Transaction
})

// Data
const data = {
  from: 'John',
  to: 'Adam',
  amount: 50
}

// Define a signing key pair
const keyPair = {
  publicKey: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
  secretKey: '978e3321bd6331d56e5f4c2bdb95bf471e95a77a6839e68d4241e7b0932ebe2b' +
  'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'
}

// Sign the data
const signature = sendFunds.sign(keyPair.secretKey, data)

// Add a signature field
sendFunds.signature = signature

// Get the hash
let hash = sendFunds.hash(data) // 'b4791644c07054a60bcc8c40a6b87cc26160ac0da973fbe2ceb06e8f1da68f72'
```

Read more about [hashes](../README.md#hash).

## Send transaction

```javascript
// Define a transaction schema
let Transaction = new Type('CustomMessage')
Transaction.add(new Field('from', 1, 'string'))
Transaction.add(new Field('to', 2, 'string'))
Transaction.add(new Field('amount', 3, 'uint32'))

// Define a transaction
const sendFunds = Exonum.newTransaction({
  author: keyPair.publicKey,
  service_id: 130,
  message_id: 0,
  schema: Transaction
})

// Data
const data = {
  from: 'John',
  to: 'Adam',
  amount: 50
}

// Define a signing key pair
const keyPair = {
  publicKey: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
  secretKey: '978e3321bd6331d56e5f4c2bdb95bf471e95a77a6839e68d4241e7b0932ebe2b' +
  'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'
}

// Define transaction explorer address
const explorerBasePath = 'http://127.0.0.1:8200/api/explorer/v1/transactions'

// Send transaction
sendFunds.send(explorerBasePath, data, keyPair.secretKey).then(response => {
  // ...
})
```

## Send multiple transactions

```javascript
// Define a transaction schema
let Transaction = new Type('CustomMessage')
Transaction.add(new Field('from', 1, 'string'))
Transaction.add(new Field('to', 2, 'string'))
Transaction.add(new Field('amount', 3, 'uint32'))

// Define a transaction
const sendFunds = Exonum.newTransaction({
  author: keyPair.publicKey,
  service_id: 130,
  message_id: 0,
  schema: Transaction
})

// Data
const transactions = [
  {
    data: {
      from: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
      to: 'f7ea8fd02cb41cc2cd45fd5adc89ca1bf605b2e31f796a3417ddbcd4a3634647',
      amount: 1000
    },
    type: sendFunds
  },
  {
    data: {
      from: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
      to: 'd45fd5adc89ca1bf605b2e31f796a3417ddbcd4a3634647f7ea8fd02cb41cc2c',
      amount: 250
    },
    type: sendFunds
  }
]

// Define a signing key pair
const keyPair = {
  publicKey: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
  secretKey: '978e3321bd6331d56e5f4c2bdb95bf471e95a77a6839e68d4241e7b0932ebe2b' +
  'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'
}

// Define transaction explorer address
const explorerBasePath = 'http://127.0.0.1:8200/api/explorer/v1/transactions'

// Send transactions queue
Exonum.sendQueue(explorerBasePath, transactions, keyPair.secretKey).then(response => {
  // ...
})
```

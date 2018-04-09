# Examples of operations on transactions

## Serialize transaction

An example of serialization into a byte array:

```javascript
// Define a transaction
let sendFunds = Exonum.newMessage({
  network_id: 0,
  protocol_version: 0,
  service_id: 130,
  message_id: 128,
  fields: [
    { name: 'from', type: Exonum.Hash },
    { name: 'to', type: Exonum.Hash },
    { name: 'amount', type: Exonum.Uint64 }
  ]
})

// Data to be serialized
const data = {
  from: 'f5602a686807fbf54b47eb4c96b5bac3352a44e7500f6e507b8b4e341302c799',
  to: 'f7ea8fd02cb41cc2cd45fd5adc89ca1bf605b2e31f796a3417ddbcd4a3634647',
  amount: 1000
}

// Serialize
let buffer = sendFunds.serialize(data, true) // [0, 0, 128, 0, 130, 0, 146, 0, 0, 0, 245, 96, 42, 104, 104, 7, 251, 245, 75, 71, 235, 76, 150, 181, 186, 195, 53, 42, 68, 231, 80, 15, 110, 80, 123, 139, 78, 52, 19, 2, 199, 153, 247, 234, 143, 208, 44, 180, 28, 194, 205, 69, 253, 90, 220, 137, 202, 27, 246, 5, 178, 227, 31, 121, 106, 52, 23, 221, 188, 212, 163, 99, 70, 71, 232, 3, 0, 0, 0, 0, 0, 0]
```

Read more about [serialization](../README.md#serialization).

## Sign transaction

An example of transaction signing:

```javascript
// Define a transaction
let sendFunds = Exonum.newMessage({
  network_id: 0,
  protocol_version: 0,
  service_id: 130,
  message_id: 128,
  fields: [
    { name: 'from', type: Exonum.Hash },
    { name: 'to', type: Exonum.Hash },
    { name: 'amount', type: Exonum.Uint64 }
  ]
})

// Data to be signed
const data = {
  from: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
  to: 'f7ea8fd02cb41cc2cd45fd5adc89ca1bf605b2e31f796a3417ddbcd4a3634647',
  amount: 1000
}

// Define the signing key pair 
const publicKey = 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'
const secretKey = '978e3321bd6331d56e5f4c2bdb95bf471e95a77a6839e68d4241e7b0932ebe2b' +
 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'

// Sign the data
let signature = sendFunds.sign(secretKey, data) // 'c304505c8a46ca19454ff5f18335d520823cd0eb984521472ec7638b312a0f5b1180a3c39a50cbe3b68ed15023c6761ed1495da648c7fe484876f92a659ee10a'
```

Read more about [data signing](../README.md#sign-data).

## Verify signed transaction

An example of signature verification:

```javascript
// Define a transaction
let sendFunds = Exonum.newMessage({
  network_id: 0,
  protocol_version: 0,
  service_id: 130,
  message_id: 128,
  fields: [
    { name: 'from', type: Exonum.Hash },
    { name: 'to', type: Exonum.Hash },
    { name: 'amount', type: Exonum.Uint64 }
  ]
})

// Data that has been signed
const data = {
  from: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
  to: 'f7ea8fd02cb41cc2cd45fd5adc89ca1bf605b2e31f796a3417ddbcd4a3634647',
  amount: 1000
}

// Define a signing key pair 
const publicKey = 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'
const secretKey = '978e3321bd6331d56e5f4c2bdb95bf471e95a77a6839e68d4241e7b0932ebe2b' +
 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'

// Signature obtained upon signing using secret key
const signature = 'c304505c8a46ca19454ff5f18335d520823cd0eb984521472ec7638b312a0f5b' +
 '1180a3c39a50cbe3b68ed15023c6761ed1495da648c7fe484876f92a659ee10a'

// Verify the signature
let result = sendFunds.verifySignature(signature, publicKey, data) // true
```

Read more about [signature verification](../README.md#verify-signature).

## Get a transaction hash

Note, the transaction **must be signed** before the hash is calculated.

Example of calculation of a transaction hash:

```javascript
// Define a transaction
let sendFunds = Exonum.newMessage({
  network_id: 0,
  protocol_version: 0,
  service_id: 130,
  message_id: 128,
  fields: [
    { name: 'from', type: Exonum.Hash },
    { name: 'to', type: Exonum.Hash },
    { name: 'amount', type: Exonum.Uint64 }
  ]
})

// Data
const data = {
  from: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
  to: 'f7ea8fd02cb41cc2cd45fd5adc89ca1bf605b2e31f796a3417ddbcd4a3634647',
  amount: 1000
}

// Define a signing key pair 
const publicKey = 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'
const secretKey = '978e3321bd6331d56e5f4c2bdb95bf471e95a77a6839e68d4241e7b0932ebe2b' +
 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'

// Sign the data
const signature = sendFunds.sign(secretKey, data)

// Add a signature field
sendFunds.signature = signature

// Get the hash
let hash = sendFunds.hash(data) // '383900f7721acc9b7b45dd2495b28072d203b4e60137a95a94d98289970d5380'
```

Read more about [hashes](../README.md#hash).

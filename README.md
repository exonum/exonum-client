# Light Client for Exonum Blockchain

[![Build status][travis-image]][travis-url]
[![npm version][npmjs-image]][npmjs-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![js-standard-style][codestyle-image]][codestyle-url]

[travis-image]: https://img.shields.io/travis/exonum/exonum-client/master.svg
[travis-url]: https://travis-ci.org/exonum/exonum-client
[npmjs-image]: https://img.shields.io/npm/v/exonum-client.svg
[npmjs-url]: https://www.npmjs.com/package/exonum-client
[coveralls-image]: https://coveralls.io/repos/github/exonum/exonum-client/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/exonum/exonum-client?branch=master
[codestyle-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[codestyle-url]: http://standardjs.com

A JavaScript library to work with Exonum blockchain from browser and Node.js.
Used to sign transactions before sending to blockchain and verify blockchain responses using cryptographic proofs.
Contains numerous helper functions. Find out more information about the [architecture and tasks][docs:clients] of light clients in Exonum.

If you are using Exonum in your project and want to be listed on our website & GitHub list — write
us a line to <exonum@bitfury.com>.

Library compatibility with Exonum core:

| JavaScript light client | Exonum core |
|---|---|
| 0.18.3 | 1.0.0-rc.1 |
| 0.17.1 | 0.12.* |
| 0.16.9 | 0.11.* |
| 0.16.9 | 0.10.* |
| 0.13.0 | 0.9.* |
| 0.10.2 | 0.8.* |
| 0.9.0 | 0.7.* |
| 0.6.1 | 0.6.* |
| 0.6.1 | 0.5.* |
| 0.3.0 | 0.4.0 |
| 0.3.0 | 0.3.0 |
| 0.2.0 | 0.2.0 |
| 0.1.1 | 0.1.* |

* [Getting started](#getting-started)
* [Data types](#data-types)
* [Hash](#hash)
* [Signature](#signature)
  * [Sign data](#sign-data)
  * [Verify signature](#verify-signature)
* [Transactions](#transactions)
  * [Define transaction](#define-transaction)
  * [Sign transaction](#sign-transaction)
  * [Send transaction](#send-transaction)
  * [Send multiple transactions](#send-multiple-transactions)
* [Cryptographic proofs](#cryptographic-proofs)
  * [Merkle tree proof](#merkle-tree-proof)
  * [Map proof](#map-proof)
* [Integrity checks](#integrity-checks)
  * [Verify block](#verify-block)
  * [Verify table](#verify-table)
  * [Built-in structures](#built-in-structures)
* [Helpers](#helpers)
  * [Generate key pair](#generate-key-pair)
  * [Get random number](#get-random-number)
  * [Converters](#converters)
    * [Hexadecimal to Uint8Array](#hexadecimal-to-uint8array)
    * [Hexadecimal to String](#hexadecimal-to-string)
    * [Uint8Array to Hexadecimal](#uint8array-to-hexadecimal)
    * [Binary String to Uint8Array](#binary-string-to-uint8array)
    * [Binary String to Hexadecimal](#binary-string-to-hexadecimal)
    * [String to Uint8Array](#string-to-uint8array)
* [Contributing](#contributing)
  * [Coding standards](#coding-standards)
  * [Test coverage](#test-coverage)
* [Changelog](#changelog)
* [License](#license)

## Getting started

There are several options to include light client library in the application:

The preferred way is to install Exonum Client as a [package][npmjs] from npm registry:

```sh
npm install exonum-client
```

Otherwise you can download the source code from GitHub and compile it before use in browser.

Include in browser:

```html
<script src="node_modules/exonum-client/dist/exonum-client.min.js"></script>
```

Usage in Node.js:

```javascript
let Exonum = require('exonum-client')
```

## Data types

Exonum uses [protobufjs][protobufjs] library to serialize structured data into [protobuf][protobuf] format.

Each transaction is [signed](#sign-data) before sending into blockchain.
Before the transaction is signed it is converted into byte array under the hood.

The data received from the blockchain should be converted into byte array under the hood
before it will be possible to [verify proof of its existence](#cryptographic-proofs) using cryptographic algorithm.

Developer can both define data structures on the fly or use precompiled stubs with data structures.

To define Protobuf structures use [protobufjs][protobufjs] library.

Example:

```javascript
const MessageSchema = new Type('CustomMessage')
  .add(new Field('balance', 1, 'uint32'))
  .add(new Field('name', 2, 'string'))
const Message = Exonum.newType(MessageSchema)
```

**Exonum.newType** function requires a single argument of `protobuf.Type` type.

## Hash

Exonum uses [cryptographic hashes][docs:glossary:hash] of certain data for [transactions](#transactions) and
[proofs](#cryptographic-proofs).

Different signatures of the `hash` function are possible:

```javascript
Exonum.hash(data, type)
type.hash(data)
```

| Argument | Description | Type |
|---|---|---|
| **data** | Data to be processed using a hash function. | `Object` |
| **type** | Definition of the data type. | [Custom data type](#define-data-type) or [transaction](#define-transaction). |

An example of hash calculation:

```javascript
// Define a data structure
const Message = new Type('User')
  .add(new Field('balance', 1, 'uint32'))
  .add(new Field('name', 2, 'string'))
// Define a data type
const User = Exonum.newType(Message)

// Data to hash
const data = {
  balance: 100,
  name: 'John Doe'
}
// Get a hash
const hash = User.hash(data)
```

It is also possible to get a hash from byte array:

```javascript
Exonum.hash(buffer)
```

| Argument | Description | Type |
|---|---|---|
| **buffer** | Byte array. | `Array` or `Uint8Array`. |

An example of byte array hash calculation:

```javascript
const arr = [8, 100, 18, 8, 74, 111, 104, 110, 32, 68, 111, 101]
const hash = Exonum.hash(arr)
```

## Signature

The procedure for [**signing data**](#sign-data) using signing key pair
and [**verifying of obtained signature**](#verify-signature) is commonly used
in the process of data exchange between the client and the service.  

*Built-in [**Exonum.keyPair**](#generate-key-pair) helper function can be used
to generate a new random signing key pair.*

### Sign data

The signature can be obtained using the **secret key** of the signing pair.

There are three possible signatures of the `sign` function:

```javascript
Exonum.sign(secretKey, data, type)
type.sign(secretKey, data)
Exonum.sign(secretKey, buffer)
```

| Argument | Description | Type |
|---|---|---|
| **secretKey** | Secret key as hexadecimal string. | `String` |
| **data** | Data to be signed. | `Object` |
| **type** | Definition of the data type. | [Custom data type](#define-data-type). |
| **buffer** | Byte array. | `Array` or `Uint8Array`. |

The `sign` function returns value as hexadecimal `String`.

### Verify signature

The signature can be verified using the **author's public key**.

There are two possible signatures of the `verifySignature` function:

```javascript
Exonum.verifySignature(signature, publicKey, data, type)
type.verifySignature(signature, publicKey, data)
```

| Argument | Description | Type |
|---|---|---|
| **signature** | Signature as hexadecimal string. | `String` |
| **publicKey** | Author's public key as hexadecimal string. | `String` |
| **data** | Data that has been signed. | `Object` |
| **type** | Definition of the data type. | [Custom data type](#define-data-type). |

The `verifySignature` function returns value of `Boolean` type.

An example of signature creation and verification:

```javascript
// Define a data structure
const Message = new Type('User')
  .add(new Field('balance', 1, 'uint32'))
  .add(new Field('name', 2, 'string'))
const User = Exonum.newType(Message)

// Define a signing key pair
const keyPair = Exonum.keyPair()

// Data that has been hashed
const data = {
  balance: 100,
  name: 'John Doe'
}
// Signature obtained upon signing using secret key
const signature = Exonum.sign(keyPair.secretKey, data, User)
// Verify the signature
const result = Exonum.verifySignature(signature, keyPair.publicKey, data, User)
```

## Transactions

Transaction in Exonum is an operation to change the data stored in blockchain.
Transaction processing rules is a part of business logic implemented
in a [service][docs:architecture:services].

Sending data to the blockchain from a light client consist of 3 steps:

1. Describe the fields of transaction using [custom data types](#define-data-type)
2. [Sign](#sign-data) data of transaction using signing key pair
3. [Send transaction](#send-single-transaction) to the blockchain

Read more about [transactions][docs:architecture:transactions] in Exonum.

### Define transaction

An example of a transaction definition:

```javascript
const Transaction = new Type('CustomMessage')
  .add(new Field('to', 2, 'string'))
  .add(new Field('amount', 3, 'uint32'))

const SendFunds = new Exonum.Transaction({
  schema: Transaction,
  service_id: 130,
  method_id: 0
})
```

**Exonum.Transaction** constructor requires a single argument of `Object` type with
the next structure:

| Property | Description | Type |
|---|---|---|
| **schema** | Protobuf data structure. | `Object` |
| **service_id** | [Service ID][docs:architecture:serialization:service-id]. | `Number` |
| **method_id** | [Method ID][docs:architecture:serialization:message-id]. | `Number` |

`schema` structure is identical to that of [custom data type](#define-data-type).

### Sign transaction

An example of a transaction signing:

```javascript
// Signing key pair
const keyPair = Exonum.keyPair()

// Transaction data to be signed
const data = {
  from: 'John',
  to: 'Adam',
  amount: 50
}

// Create a signed transaction
const signed = SendFunds.create(data, keyPair)
```

### Send transaction

To submit transaction to the blockchain `send` function can be used.

```javascript
Exonum.send(explorerBasePath, transaction, attempts, timeout)
```

| Property | Description | Type |
|---|---|---|
| **explorerBasePath** | API address of transaction explorer on a blockchain node. | `String` |
| **transaction** | Signed transaction bytes. | `String`, `Uint8Array` or `Array`-like |
| **attempts** | Number of attempts to check transaction status. Pass `0` in case you do not need to verify if the transaction is accepted to the block. *Optional. Default value is `10`.* | `Number` |
| **timeout** | Timeout between attempts to check transaction status. *Optional. Default value is `500`.* | `Number` |

The `send` function returns a `Promise` with the transaction hash.
The promise resolves when the transaction is committed (accepted to a block).

An example of a transaction sending:

```javascript
// Define transaction explorer address
const explorerBasePath = 'http://127.0.0.1:8200/api/explorer/v1/transactions'
const transactionHash = await Exonum.send(explorerBasePath, signed.serialize())
```

### Send multiple transactions

To submit multiple transactions to the blockchain `sendQueue` function can be used.
Transactions will be sent in the order specified by the caller.
Each transaction from the queue will be sent to the blockchain only after the previous transaction
is committed.

```javascript
Exonum.sendQueue(explorerBasePath, transactions, attempts, timeout)
```

| Property | Description | Type |
|---|---|---|
| **explorerBasePath** | API address of transaction explorer on a blockchain node. | `String` |
| **transactions** | List of transactions. | `Array` |
| **attempts** | Number of attempts to check each transaction status. Pass `0` in case you do not need to verify if the transactions are accepted to the block. *Optional. Default value is `10`.* | `Number` |
| **timeout** | Timeout between attempts to check each transaction status. *Optional. Default value is `500`.* | `Number` |

The `sendQueue` function returns a `Promise` with an array of transaction hashes.
The promise resolves when all transactions are committed.

## Cryptographic proofs

A cryptographic proof is a format in which a Exonum node can provide sensitive data from a blockchain.
These proofs are based on [Merkle trees][docs:glossary:merkle-tree] and their variants.

Light client library validates the cryptographic proof and can prove the integrity and reliability
of the received data.

Read more about design of [cryptographic proofs][docs:advanced:merkelized-list] in Exonum.

### Merkle tree proof

```javascript
const proof = new Exonum.ListProof(json, ValueType)
console.log(proof.entries)
```

The `ListProof` class is used to validate proofs for Merkelized lists.

| Argument | Description | Type |
|---|---|---|
| **json** | The JSON presentation of the proof obtained from a full node. | `Object` |
| **ValueType** | Data type for values in the Merkelized list. | [Custom data type](#define-data-type) |

The returned object has the following fields:

| Field | Description | Type |
|---|---|---|
| **merkleRoot** | Hexadecimal hash of the root of the underlying Merkelized list | `String` |
| **entries** | Elements that are proven to exist in the list, together with their indexes | `Array<{ index: number, value: V }>` |
| **length** | List length | `Number` |

<!-- FIXME: Add example -->

### Map proof

```javascript
const proof = new Exonum.MapProof(json, KeyType, ValueType)
console.log(proof.entries)
```

The `MapProof` class is used to validate proofs for Merkelized maps.

| Argument | Description | Type |
|---|---|---|
| **json** | The JSON presentation of the proof obtained from a full node. | `Object` |
| **KeyType** | Data type for keys in the Merkelized map. | [Custom](#define-data-type) or built-in data type |
| **ValueType** | Data type for values in the Merkelized map. | [Custom data type](#define-data-type) |

Keys in a map proof can either be *hashed* (which is the default option)
or *raw*. To obtain a raw version for `KeyType`, use `MapProof.rawKey(KeyType)`.
The key type is determined by the service developer when the service schema
is created. Raw keys minimize the amount of hashing, but require that the underlying type
has fixed-width binary serialization.

The returned object has the following fields:

| Field | Description | Type |
|---|---|---|
| **merkleRoot** | Hexadecimal hash of the root of the underlying Merkelized map | `String` |
| **missingKeys** | Set of keys which the proof asserts as missing from the map | `Set<KeyType>` |
| **entries** | Map of key-value pairs that the are proven to exist in the map | `Map<KeyType, ValueType>` |

An [example of using a `MapProof`](examples/map-proof.js).

## Integrity checks

### Verify block

```javascript
Exonum.verifyBlock(data, validators)
```

Each new block in Exonum blockchain is signed by [validators][docs:glossary:validator].
To prove the integrity and reliability of the block, it is necessary to verify their signatures.
The signature of each validator are stored in the precommits.

The `verifyBlock` function throws an error if a block is invalid.

| Argument | Description | Type |
|---|---|---|
| **data** | Structure with block and precommits. | `Object` |
| **validators** | An array of validators public keys as a hexadecimal strings. | `Array` |

<!-- FIXME: Add example -->

### Verify table

```javascript
Exonum.verifyTable(proof, stateHash, fullTableName)
```

Verify table existence in the root tree.

Returns root hash for the table as hexadecimal `String`.

| Argument | Description | Type |
|---|---|---|
| **proof** | The JSON presentation of the proof obtained from a full node. | `Object` |
| **stateHash** | Hash of current blockchain state stored in each block. | `String` |
| **fullTableName** | Name of the table, such as `token.wallets`. | `String` |

### Built-in structures

The library exports Protobuf declarations from the core crate.
Consult [Protobuf files included into the library](proto) for more details.

## Helpers

### Generate key pair

```javascript
const pair = Exonum.keyPair()
```

```javascript
{
  publicKey: "...", // 32-byte public key
  secretKey: "..." // 64-byte secret key
}
```

**Exonum.keyPair** function generates a new random [Ed25519][docs:glossary:digital-signature]
signing key pair using the [TweetNaCl][tweetnacl:key-pair] cryptographic library.

### Get random number

```javascript
const rand = Exonum.randomUint64()
```

**Exonum.randomUint64** function generates a new random `Uint64` number of cryptographic quality
using the [TweetNaCl][tweetnacl:random-bytes] cryptographic library.

### Converters

#### Hexadecimal to `Uint8Array`

```javascript
const hex = '674718178bd97d3ac5953d0d8e5649ea373c4d98b3b61befd5699800eaa8513b'
Exonum.hexadecimalToUint8Array(hex)
```

#### Hexadecimal to String

```javascript
const hex = '674718178bd97d3ac5953d0d8e5649ea373c4d98b3b61befd5699800eaa8513b'
Exonum.hexadecimalToBinaryString(hex)
```

#### `Uint8Array` to Hexadecimal

```javascript
const arr = new Uint8Array([103, 71, 24, 23, 139, 217, 125, 58, 197, 149, 61])
Exonum.uint8ArrayToHexadecimal(arr)
```

#### `Uint8Array` to Binary String

```javascript
const arr = new Uint8Array([103, 71, 24, 23, 139, 217, 125, 58, 197, 149, 61])
Exonum.uint8ArrayToBinaryString(arr)
```

#### Binary String to `Uint8Array`

```javascript
const str = '0110011101000111000110000001011110001011110110010111110100111010'
Exonum.binaryStringToUint8Array(str)
```

#### Binary String to Hexadecimal

```javascript
const str = '0110011101000111000110000001011110001011110110010111110100111010'
Exonum.binaryStringToHexadecimal(str)
```

#### String to Uint8Array

```javascript
const str = 'Hello world'
Exonum.stringToUint8Array(str)
```

## Contributing

The contributing to the Exonum Client is based on the same principles and rules as
[the contributing to exonum-core][contributing].

### Coding standards

The coding standards are described in the [`.eslintrc`](.eslintrc.json) file.

To help developers define and maintain consistent coding styles between different editors and IDEs
we used [`.editorconfig`](.editorconfig) configuration file.

### Test coverage

All functions must include relevant unit tests.
This applies to both of adding new features and fixing existed bugs.

## Changelog

Detailed changes for each release are documented in the [CHANGELOG](CHANGELOG.md) file.

## License

Exonum Client is licensed under the Apache License (Version 2.0). See [LICENSE](LICENSE) for details.

[docs:clients]: https://exonum.com/doc/version/latest/architecture/clients
[docs:architecture:services]: https://exonum.com/doc/version/latest/architecture/services
[docs:architecture:serialization]: https://exonum.com/doc/version/latest/architecture/serialization
[docs:architecture:serialization:network-id]: https://exonum.com/doc/version/latest/architecture/serialization/#etwork-id
[docs:architecture:serialization:protocol-version]: https://exonum.com/doc/version/latest/architecture/serialization/#protocol-version
[docs:architecture:serialization:service-id]: https://exonum.com/doc/version/latest/architecture/serialization/#service-id
[docs:architecture:serialization:message-id]: https://exonum.com/doc/version/latest/architecture/serialization/#message-id
[docs:architecture:transactions]: https://exonum.com/doc/version/latest/architecture/transactions
[docs:advanced:merkelized-list]: https://exonum.com/doc/version/latest/advanced/merkelized-list
[docs:glossary:digital-signature]: https://exonum.com/doc/version/latest/glossary/#digital-signature
[docs:glossary:hash]: https://exonum.com/doc/version/latest/glossary/#hash
[docs:glossary:blockchain-state]: https://exonum.com/doc/version/latest/glossary/#blockchain-state
[docs:glossary:merkle-tree]: https://exonum.com/doc/version/latest/glossary/#merkle-tree
[docs:glossary:validator]: https://exonum.com/doc/version/latest/glossary/#validator
[npmjs]: https://www.npmjs.com/package/exonum-client
[gitter]: https://gitter.im/exonum/exonum
[twitter]: https://twitter.com/ExonumPlatform
[newsletter]: https://exonum.com/#newsletter
[contributing]: https://exonum.com/doc/version/latest/contributing/
[is-safe-integer]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger
[vector-structure]: https://doc.rust-lang.org/std/vec/struct.Vec.html
[tweetnacl:key-pair]: https://github.com/dchest/tweetnacl-js#naclsignkeypair
[tweetnacl:random-bytes]: https://github.com/dchest/tweetnacl-js#random-bytes-generation
[protobuf]: https://developers.google.com/protocol-buffers/
[protobufjs]: https://www.npmjs.com/package/protobufjs

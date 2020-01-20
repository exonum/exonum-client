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

The most preferred way is to install Exonum Client as a [package][npmjs] from npm registry:

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

Exonum use [protobufjs][protobufjs] library to serialize structured data into [protobuf][protobuf] format.

Each transaction is [signed](#sign-data) before sending into blockchain.
Before the transaction is signed it is converted into byte array under the hood.

The data received from the blockchain should be converted into byte array under the hood
before it will be possible to [verify proof of its existence](#cryptographic-proofs) using cryptographic algorithm.

Developer can both define data stuctures on the fly or use precompiled stubs with data structures.

To define protobuf structures use [protobufjs][protobufjs] library.

Example:

```javascript
let Message = new Type('CustomMessage')
Message.add(new Field('balance', 1, 'uint32'))
Message.add(new Field('name', 2, 'string'))

let type = Exonum.newType(Message)
```

**Exonum.newType** function requires a single argument of `protobuf.Type` type with next structure.

## Hash

Exonum uses [cryptographic hashes][docs:glossary:hash] of certain data for [transactions](#transactions) and
[proofs](#cryptographic-proofs).

Different signatures of the `hash` function are possible:

```javascript
Exonum.hash(data, type)
```

```javascript
type.hash(data)
```

| Argument | Description | Type |
|---|---|---|
| **data** | Data to be processed using a hash function. | `Object` |
| **type** | Definition of the data type. | [Custom data type](#define-data-type) or [transaction](#define-transaction). |

An example of hash calculation:

```javascript
// Define a data structure
let Message = new Type('CustomMessage')
Message.add(new Field('balance', 1, 'uint32'))
Message.add(new Field('name', 2, 'string'))

// Define a data type
const User = Exonum.newType(Message)

// Data that has been hashed
const data = {
  balance: 100,
  name: 'John Doe'
}

// Get a hash
let hash = User.hash(data) // 9786347be1ab7e8f3d68a49ef8a995a4decb31103c53565a108170dec4c1c2fa
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

let hash = Exonum.hash(arr) // 9786347be1ab7e8f3d68a49ef8a995a4decb31103c53565a108170dec4c1c2fa
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
```

```javascript
type.sign(secretKey, data)
```

```javascript
Exonum.sign(secretKey, buffer)
```

| Argument | Description | Type |
|---|---|---|
| **secretKey** | Secret key as hexadecimal string. | `String` |
| **data** | Data to be signed. | `Object` |
| **type** | Definition of the data type. | [Custom data type](#define-data-type) or [transaction](#define-transaction). |
| **buffer** | Byte array. | `Array` or `Uint8Array`. |

The `sign` function returns value as hexadecimal `String`.

An example of data signing:

```javascript
// Define a data structure
let Message = new Type('CustomMessage')
Message.add(new Field('balance', 1, 'uint32'))
Message.add(new Field('name', 2, 'string'))

// Define a data type
const User = Exonum.newType(Message)

// Data that has been hashed
const data = {
  balance: 100,
  name: 'John Doe'
}

// Define a signing key pair
const keyPair = {
  publicKey: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
  secretKey: '978e3321bd6331d56e5f4c2bdb95bf471e95a77a6839e68d4241e7b0932ebe2b' +
  'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'
}

// Sign the data
let signature = Exonum.sign(keyPair.secretKey, data, User)
```

### Verify signature

The signature can be verified using the **author's public key**.

There are two possible signatures of the `verifySignature` function:

```javascript
Exonum.verifySignature(signature, publicKey, data, type)
```

```javascript
type.verifySignature(signature, publicKey, data)
```

| Argument | Description | Type |
|---|---|---|
| **signature** | Signature as hexadecimal string. | `String` |
| **publicKey** | Author's public key as hexadecimal string. | `String` |
| **data** | Data that has been signed. | `Object` |
| **type** | Definition of the data type. | [Custom data type](#define-data-type) or [transaction](#define-transaction). |

The `verifySignature` function returns value of `Boolean` type.

An example of signature verification:

```javascript
// Define a data structure
let Message = new Type('CustomMessage')
Message.add(new Field('balance', 1, 'uint32'))
Message.add(new Field('name', 2, 'string'))

// Define a data type
const User = Exonum.newType(Message)

// Data that has been hashed
const data = {
  balance: 100,
  name: 'John Doe'
}

// Define a signing key pair
const keyPair = {
  publicKey: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
  secretKey: '978e3321bd6331d56e5f4c2bdb95bf471e95a77a6839e68d4241e7b0932ebe2b' +
  'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'
}

// Signature obtained upon signing using secret key
const signature = 'a4cf7c457e3f4d54ef0c87900e7c860d2faa17a8dccbaafa573a3a960cda3f66' +
 '27911088138526d9d7e46feba471e6bc7b93262349a5ed18262cbc39c8a47b04'

// Verify the signature
let result = Exonum.verifySignature(signature, keyPair.publicKey, data, User) // true
```

## Transactions

Transaction in Exonum is a operation to change the data stored in blockchain.
Transaction processing rules is a part of business logic implemented on [service][docs:architecture:services] side.

Sending data to the blockchain from a light client consist of 3 steps:

1) Describe the fields of transaction using [custom data types](#define-data-type);
2) [Sign](#sign-data) data of transaction using signing key pair;
3) [Send transaction](#send-single-transaction) to the blockchain.

Read more about [transactions][docs:architecture:transactions] in Exonum.

### Define transaction

An example of a transaction definition:

```javascript
let Transaction = new Type('CustomMessage')
Transaction.add(new Field('from', 1, 'string'))
Transaction.add(new Field('to', 2, 'string'))
Transaction.add(new Field('amount', 3, 'uint32'))

let sendFunds = Exonum.newTransaction({
  author: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
  instance_id: 130,
  method_id: 0,
  schema: Transaction
})
```

**Exonum.newTransaction** function requires a single argument of `Object` type with next structure:

| Property | Description | Type |
|---|---|---|
| **author** | Author's public key as hexadecimal string. | `String` |
| **instance_id** | [Instance ID][docs:architecture:serialization:instance-id]. | `Number` |
| **method_id** | [Method ID][docs:architecture:serialization:method-id]. | `Number` |
| **schema** | Protobuf data structure. | `Array` |
| **signature** | Signature as hexadecimal string. *Optional.* | `String` |

Field structure is identical to field structure of [custom data type](#define-data-type).

### Sign transaction

An example of a transaction signing:

```javascript
// Signing key pair
const keyPair = {
  publicKey: 'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a',
  secretKey: '978e3321bd6331d56e5f4c2bdb95bf471e95a77a6839e68d4241e7b0932ebe2b' +
  'fa7f9ee43aff70c879f80fa7fd15955c18b98c72310b09e7818310325050cf7a'
}

// Transaction data to be signed
const data = {
  from: 'John',
  to: 'Adam',
  amount: 50
}

// Sign the data
let signature = sendFunds.sign(keyPair.secretKey, data)
```

### Send transaction

To submit transaction to the blockchain `send` function can be used.

There are two possible signatures of the `send` function:

```javascript
Exonum.send(explorerBasePath, type, data, secretKey, attempts, timeout)

sendFunds.send(explorerBasePath, data, secretKey, attempts, timeout)
```

| Property | Description | Type |
|---|---|---|
| **explorerBasePath** | API address of transaction explorer on a blockchain node. | `String` |
| **type** | Definition of the transaction. | [Transaction](#define-transaction). |
| **data** | Data that has been signed. | `Object` |
| **secretKey** | Secret key as hexadecimal string. | `String` |
| **attempts** | Number of attempts to check transaction status. Pass `0` in case you do not need to verify if the transaction is accepted to the block. *Optional. Default value is `10`.* | `Number` |
| **timeout** | Timeout between attempts to check transaction status. *Optional. Default value is `500`.* | `Number` |

The `send` function returns value of `Promise` type with transaction hash as a fulfilled value.
Fulfilled state means that transaction is accepted to the block.
Fulfilled value contained transaction with its proof.

An example of a transaction sending:

```javascript
// Define transaction explorer address
const explorerBasePath = 'http://127.0.0.1:8200/api/explorer/v1/transactions'

sendFunds.send(explorerBasePath, data, keyPair.secretKey).then(txHash => {})
```

### Send multiple transactions

To submit multiple transactions to the blockchain `sendQueue` function can be used.
Transactions will be stored in the appropriate order.
Each transaction from the queue will be sent to the blockchain only after the previous transaction is accepted to the block.

```javascript
Exonum.sendQueue(explorerBasePath, transactions, secretKey, attempts, timeout)
```

| Property | Description | Type |
|---|---|---|
| **explorerBasePath** | API address of transaction explorer on a blockchain node. | `String` |
| **transactions** | List of transactions. | `Array` |
| **secretKey** | Secret key as hexadecimal string. | `String` |
| **attempts** | Number of attempts to check each transaction status. Pass `0` in case you do not need to verify if the transactions are accepted to the block. *Optional. Default value is `10`.* | `Number` |
| **timeout** | Timeout between attempts to check each transaction status. *Optional. Default value is `500`.* | `Number` |

Transaction structure:

| Field | Description | Type |
|---|---|---|
| **type** | Definition of the transaction. | [Transaction](#define-transaction). |
| **data** | Transaction data that has been signed. | `Object` |

The `sendQueue` function returns value of `Promise` type with an array of transaction hashes as a fulfilled value.
Fulfilled state means that all transactions are accepted to the block.
Fulfilled value contained an array of transactions with its proofs.

Find more examples of operations on transactions:

* [Define transaction](examples/transactions.md#define-transaction)
* [Serialize transaction](examples/transactions.md#serialize-transaction)
* [Sign transaction](examples/transactions.md#sign-transaction)
* [Verify signed transaction](examples/transactions.md#verify-signed-transaction)
* [Get a transaction hash](examples/transactions.md#get-a-transaction-hash)
* [Send transaction](examples/transactions.md#send-transaction)
* [Send multiple transactions](examples/transactions.md#send-multiple-transaction)

## Cryptographic proofs

A cryptographic proof is a format in which a Exonum node can provide sensitive data from a blockchain.
These proofs are based on [Merkle trees][docs:glossary:merkle-tree] and their variants.

Light client library validates the cryptographic proof and can prove the integrity and reliability of the received data.

Read more about design of [cryptographic proofs][docs:advanced:merkelized-list] in Exonum.

### Merkle tree proof

```javascript
let elements = Exonum.merkleProof(rootHash, count, tree, range, type)
```

The `merkleProof` method is used to validate the Merkle tree and extract a **list of data elements**.

| Argument | Description | Type |
|---|---|---|
| **rootHash** | The root hash of the Merkle tree as hexadecimal string. | `String` |
| **count** | The total number of elements in the Merkle tree. | `Number` |
| **proofNode** | The Merkle tree. | `Object` |
| **range** | An array of two elements of `Number` type. Represents list of obtained elements: `[startIndex; endIndex)`. | `Array` |
| **type** | Definition of the elements type. *Optional. The `merkleProof` method expects to find byte arrays or hashes as values in the tree if `type` is not passed.* | [Custom data type](#define-data-type) |

An [example of verifying a Merkle tree](examples/merkle-tree.md).

### Map proof

```javascript
let proof = new Exonum.MapProof(json, KeyType, ValueType)
console.log(proof.entries)
```

The `MapProof` class is used to validate proofs for Merkelized maps.

| Argument | Description | Type |
|---|---|---|
| **json** | The JSON presentation of the proof obtained from a full node. | `Object` |
| **KeyType** | Data type for keys in the Merkelized map. | [Custom](#define-data-type) or built-in data type |
| **ValueType** | Data type for values in the Merkelized map. | [Custom data type](#define-data-type) |

The returned object has the following fields:

| Field | Description | Type |
|---|---|---|
| **merkleRoot** | Hexadecimal hash of the root of the underlying Merkelized map | `String` |
| **missingKeys** | Set of keys which the proof asserts as missing from the map | `Set<KeyType>` |
| **entries** | Map of key-value pairs that the are proved to exist in the map | `Map<KeyType, ValueType>` |

An [example of using a `MapProof`](examples/map-proof.js).

## Integrity checks

### Verify block

```javascript
Exonum.verifyBlock(data, validators)
```

Each new block in Exonum blockchain is signed by [validators][docs:glossary:validator].
To prove the integrity and reliability of the block, it is necessary to verify their signatures.
The signature of each validator are stored in the precommits.

The `merkleProof` method is used to validate block and its precommits.

The `verifyBlock` function returns value of `Promise` type.
Fulfilled state means that block is valid.

| Argument | Description | Type |
|---|---|---|
| **data** | Structure with block and precommits. | `Object` |
| **validators** | An array of validators public keys as a hexadecimal strings. | `Array` |

An example of [block verification](examples/block.md).

### Verify table

```javascript
Exonum.verifyTable(proof, stateHash, instanceId, tableIndex)
```

Verify table existence in the root tree.

Returns root hash for the table as hexadecimal `String`.

| Argument | Description | Type |
|---|---|---|
| **proof** | The JSON presentation of the proof obtained from a full node. | `Object` |
| **stateHash** | Hash of current blockchain state stored in each block. | `String` |
| **instanceId** | [Instance ID][docs:architecture:serialization:instance-id]. | `Number` |
| **tableIndex** | Table index. | `Number` |

### Built-in structures

List of built-in Exonum [blockchain](proto/exonum/blockchain.proto) structures:

| Structure | Use as |
|---|---|
| **AdditionalHeaders** | `Exonum.protocol.exonum.AdditionalHeaders` |
| **Block** | `Exonum.protocol.exonum.Block` |
| **TxLocation** | `Exonum.protocol.exonum.TxLocation` |
| **CallInBlock** | `Exonum.protocol.exonum.CallInBlock` |
| **ValidatorKeys** | `Exonum.protocol.exonum.ValidatorKeys` |


List of built-in Exonum [consensus](proto/exonum/consensus.proto) structures:

| Structure | Use as |
|---|---|
| **SignedMessage** | `Exonum.protocol.exonum.consensus.SignedMessage` |
| **Verified** | `Exonum.protocol.exonum.consensus.Verified` |
| **Connect** | `Exonum.protocol.exonum.consensus.Connect` |
| **Status** | `Exonum.protocol.exonum.consensus.Status` |
| **Propose** | `Exonum.protocol.exonum.consensus.Propose` |
| **Prevote** | `Exonum.protocol.exonum.consensus.Prevote` |
| **Precommit** | `Exonum.protocol.exonum.consensus.Precommit` |
| **BlockResponse** | `Exonum.protocol.exonum.consensus.BlockResponse` |
| **TransactionsResponse** | `Exonum.protocol.exonum.consensus.TransactionsResponse` |
| **ProposeRequest** | `Exonum.protocol.exonum.consensus.ProposeRequest` |
| **TransactionsRequest** | `Exonum.protocol.exonum.consensus.TransactionsRequest` |
| **PrevotesRequest** | `Exonum.protocol.exonum.consensus.PrevotesRequest` |
| **PeersRequest** | `Exonum.protocol.exonum.consensus.PeersRequest` |
| **BlockRequest** | `Exonum.protocol.exonum.consensus.BlockRequest` |
| **PoolTransactionsRequest** | `Exonum.protocol.exonum.consensus.PoolTransactionsRequest` |
| **ExonumMessage** | `Exonum.protocol.exonum.consensus.ExonumMessage` |


List of built-in Exonum [key-value sequence](proto/exonum/key_value_sequence.proto) structures:

| Structure | Use as |
|---|---|
| **KeyValue** | `Exonum.protocol.exonum.KeyValue` |
| **KeyValueSequence** | `Exonum.protocol.exonum.KeyValueSequence` |


List of built-in Exonum [proofs](proto/exonum/proofs.proto) structures:

| Structure | Use as |
|---|---|
| **BlockProof** | `Exonum.protocol.exonum.BlockProof` |
| **IndexProof** | `Exonum.protocol.exonum.IndexProof` |


List of built-in Exonum [runtime](proto/exonum/runtime.proto) structures:

| Structure | Use as |
|---|---|
| **CallInfo** | `Exonum.protocol.exonum.runtime.CallInfo` |
| **AnyTx** | `Exonum.protocol.exonum.runtime.AnyTx` |
| **ArtifactId** | `Exonum.protocol.exonum.runtime.ArtifactId` |
| **ArtifactSpec** | `Exonum.protocol.exonum.runtime.ArtifactSpec` |
| **InstanceSpec** | `Exonum.protocol.exonum.runtime.InstanceSpec` |
| **InstanceInitParams** | `Exonum.protocol.exonum.runtime.InstanceInitParams` |
| **GenesisConfig** | `Exonum.protocol.exonum.runtime.GenesisConfig` |
| **ExecutionError** | `Exonum.protocol.exonum.runtime.ExecutionError` |
| **CallSite** | `Exonum.protocol.exonum.runtime.CallSite` |
| **ExecutionStatus** | `Exonum.protocol.exonum.runtime.ExecutionStatus` |
| **ArtifactState** | `Exonum.protocol.exonum.runtime.ArtifactState` |
| **InstanceStatus** | `Exonum.protocol.exonum.runtime.InstanceStatus` |
| **InstanceMigration** | `Exonum.protocol.exonum.runtime.InstanceMigration` |
| **InstanceState** | `Exonum.protocol.exonum.runtime.InstanceState` |
| **MigrationStatus** | `Exonum.protocol.exonum.runtime.MigrationStatus` |
| **ModifiedInstanceInfo** | `Exonum.protocol.exonum.runtime.ModifiedInstanceInfo` |


List of built-in Exonum [crypto](proto/crypto/types.proto) structures:

| Structure | Use as |
|---|---|
| **Hash** | `Exonum.protocol.exonum.Hash` |
| **PublicKey** | `Exonum.protocol.exonum.PublicKey` |
| **Signature** | `Exonum.protocol.exonum.Signature` |


List of built-in Exonum [common](proto/common.proto) structures:

| Structure | Use as |
|---|---|
| **BitVec** | `Exonum.protocol.exonum.BitVec` |


List of built-in Exonum [list proof](proto/merkledb/list_proof.proto) structures:

| Structure | Use as |
|---|---|
| **ListProof** | `Exonum.protocol.exonum.proof.ListProof` |
| **HashedEntry** | `Exonum.protocol.exonum.proof.HashedEntry` |
| **ListProofEntry** | `Exonum.protocol.exonum.proof.ListProofEntry` |
| **ProofListKey** | `Exonum.protocol.exonum.proof.ProofListKey` |


List of built-in Exonum [map proof](proto/merkledb/map_proof.proto) structures:

| Structure | Use as |
|---|---|
| **MapProof** | `Exonum.protocol.exonum.proof.MapProof` |
| **OptionalEntry** | `Exonum.protocol.exonum.proof.OptionalEntry` |
| **MapProofEntry** | `Exonum.protocol.exonum.proof.MapProofEntry` |


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

**Exonum.keyPair** function generates a new random [Ed25519][docs:glossary:digital-signature] signing key pair using the
[TweetNaCl][tweetnacl:key-pair] cryptographic library.

### Get random number

```javascript
const rand = Exonum.randomUint64()
```

**Exonum.randomUint64** function generates a new random `Uint64` number of cryptographic quality using the
[TweetNaCl][tweetnacl:random-bytes] cryptographic library.

### Converters

#### Hexadecimal to Uint8Array

```javascript
const hex = '674718178bd97d3ac5953d0d8e5649ea373c4d98b3b61befd5699800eaa8513b'

Exonum.hexadecimalToUint8Array(hex) // [103, 71, 24, 23, 139, 217, 125, 58, 197, 149, 61, 13, 142, 86, 73, 234, 55, 60, 77, 152, 179, 182, 27, 239, 213, 105, 152, 0, 234, 168, 81, 59]
```

#### Hexadecimal to String

```javascript
const hex = '674718178bd97d3ac5953d0d8e5649ea373c4d98b3b61befd5699800eaa8513b'

Exonum.hexadecimalToBinaryString(hex) // '0110011101000111000110000001011110001011110110010111110100111010110001011001010100111101000011011000111001010110010010011110101000110111001111000100110110011000101100111011011000011011111011111101010101101001100110000000000011101010101010000101000100111011'
```

#### Uint8Array to Hexadecimal

```javascript
const arr = new Uint8Array([103, 71, 24, 23, 139, 217, 125, 58, 197, 149, 61, 13, 142, 86, 73, 234, 55, 60, 77, 152, 179, 182, 27, 239, 213, 105, 152, 0, 234, 168, 81, 59])

Exonum.uint8ArrayToHexadecimal(arr) // '674718178bd97d3ac5953d0d8e5649ea373c4d98b3b61befd5699800eaa8513b'
```

#### Uint8Array to BinaryString

```javascript
const arr = new Uint8Array([103, 71, 24, 23, 139, 217, 125, 58, 197, 149, 61, 13, 142, 86, 73, 234, 55, 60, 77, 152, 179, 182, 27, 239, 213, 105, 152, 0, 234, 168, 81, 59])

Exonum.uint8ArrayToBinaryString(arr) // '0110011101000111000110000001011110001011110110010111110100111010110001011001010100111101000011011000111001010110010010011110101000110111001111000100110110011000101100111011011000011011111011111101010101101001100110000000000011101010101010000101000100111011'
```

#### Binary String to Uint8Array

```javascript
const str = '0110011101000111000110000001011110001011110110010111110100111010110001011001010100111101000011011000111001010110010010011110101000110111001111000100110110011000101100111011011000011011111011111101010101101001100110000000000011101010101010000101000100111011'

Exonum.binaryStringToUint8Array(str) // [103, 71, 24, 23, 139, 217, 125, 58, 197, 149, 61, 13, 142, 86, 73, 234, 55, 60, 77, 152, 179, 182, 27, 239, 213, 105, 152, 0, 234, 168, 81, 59]
```

#### Binary String to Hexadecimal

```javascript
const str = '0110011101000111000110000001011110001011110110010111110100111010110001011001010100111101000011011000111001010110010010011110101000110111001111000100110110011000101100111011011000011011111011111101010101101001100110000000000011101010101010000101000100111011'

Exonum.binaryStringToHexadecimal(str) // '674718178bd97d3ac5953d0d8e5649ea373c4d98b3b61befd5699800eaa8513b'
```

#### String to Uint8Array

```javascript
const str = 'Hello world'

Exonum.stringToUint8Array(str) // [72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]
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
[docs:architecture:serialization:instance-id]: https://exonum.com/doc/version/latest/architecture/serialization/#instance-id
[docs:architecture:serialization:method-id]: https://exonum.com/doc/version/latest/architecture/serialization/#method-id
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

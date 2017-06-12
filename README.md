# Client for Exonum blockchain platform

This is JavaScript toolkit to work with Exonum blockchain from browser and Node.js.

A detailed description of what it is and how it can be used can be found in [Exonum blockchain documentation](http://exonum.com/doc/architecture/clients.md).

Usage in browser:

```html
<script src="dist/exonum-client.min.js"></script>
<script>
    Exonum.hash([0, 255, 16, 8]);
</script>
```

Usage in Node.js:

```javascript
var Exonum = require('exonum-client');
Exonum.hash([0, 255, 16, 8]);
```

## Working with data

### Exonum.newType

Used to reproduce custom data structure.
It returns an instance of built-in class `NewType` that can be used to:

- [serialize]() data of passed structure;

- [get hash]() of data of passed structure;

- [sign]() data of passed structure;

- [verify signature]() of data of passed structure.

All this operations are useful while work with a blockchain.

To describe a custom data structure next basic primitive data types can be used:

* Signed integers: [Int8](), [Int16](), [Int32](), [Int64]()
* Unsigned integers: [Uint8](), [Uint16](), [Uint32](), [Uint64]()
* [String]()
* [Hash]()
* [PublicKey]()
* [Digest]()
* [Timespec]()
* [Bool]()
* [FixedBuffer]()

Here is an example of entity `User` described using `newType` method:

```javascript
var User = Exonum.newType({
    size: 9,
    fields: {
        name: {type: Exonum.String, size: 8, from: 0, to: 8},
        age: {type: Exonum.Int8, size: 8, from: 9, to: 1}
    }
});
```

It contains two fields: `name` of `string` type and `age` of `Int8` type.

Data of type `User` can be serialized into buffer:

```javascript
var data = {
    name: 'Tom',
    age: 34
};

var buffer = Exonum.serialize(data, User);
```

It is possible to get hash of this data:

```javascript
var hash = Exonum.hash(data, User);
```

And so on.

The `Exonum.newType` method requires the single Object-like parameter with next structure:

| Field | Type | Is mandatory | Description |
|---|---|---|---|
| size | `number` | yes | The total length in bytes |
| fields | `Array` | yes | Array of fields |

Field structure:

| Field | Type | Is mandatory | Description |
|---|---|---|---|
| type | built-in primitive type / entity of a `NewClass` | yes | Field type. Can contains fields of a `NewType` types |
| size | `number` | yes | The total length in bytes |
| from | `number` | yes | The beginning of the segment in the buffer |
| to | `number` | yes | The end of the segment in the buffer |

### Exonum.newMessage

Very similar to `Exonum.newType` method and used to describe blockchain transaction. 
It returns an instance of built-in class `NewMessage` that can be used to:

- [serialize] data of passed structure;

- [get hash] of data of passed structure;

- [sign data] of passed structure;

- [verify signature] of data of passed structure.

Here is an example of 'SendFunds' transaction:

```javascript
var SendFunds = Exonum.newMessage({
    size: 24,
    network_id: 0,
    protocol_version: 0,
    service_id: 0,
    message_id: 0,
    signature: '07038584a4a77510ea5eced45f54dc030f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c366752be882314f5bbbc9a6af2ae634fc',
    fields: {
        from: {type: Exonum.Hash, size: 8, from: 0, to: 8},
        to: {type: Exonum.Hash, size: 8, from: 8, to: 16},
        amount: {type: Exonum.Uint64, size: 8, from: 16, to: 24}
    }
});
```

`SendFunds` transaction is of three fields: `from` of `Hash` type, `to`  of `Hash` type and `amount` of `Uint64` type.
This transaction can be used to send funds from `from` wallet to `to` wallet.

Data of type `SendFunds` can be serialized into buffer:

```javascript
var data = {
    from: '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030',
    to: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
    amount: 50
};

var buffer = Exonum.serialize(data, SendFunds);
```

Data of type `SendFunds` can be signed with public key:

```javascript
var signature = Exonum.sign(data, SendFunds);
```

The `Exonum.newMessage` method requires the single Object-like parameter with next structure:

| Field | Type | Is mandatory | Description |
|---|---|---|---|
| size | `number` | yes | The total length in bytes |
| network_id | `number` | yes ||
| protocol_version | `number` | yes ||
| service_id | `number` | yes ||
| message_id | `number` | yes ||
| signature | `string` | no* | ED25519 signature of 64 bytes presented as hexadecimal string |
| fields | `Array` | yes | Array of fields |

*\* Note that `signature` field is mandatory for get hash method.*

Field structure:

| Name | Type | Is mandatory | Description |
|---|---|---|---|
| type | built-in primitive type / entity of a `NewClass` | yes | Field type. Can contains fields of a `NewType` types |
| size | `number` | yes | The total length in bytes |
| from | `number` | yes | The beginning of the segment in the buffer |
| to | `number` | yes | The end of the segment in the buffer |

## Cryptography

### Exonum.hash

Returns SHA256 hash of the data as hexadecimal string.

Accept two combinations of an arguments:

#### Exonum.hash(data, type)

| Parameter | Type | Description |
|---|---|---|
| data | `object` ||
| type | `NewType` or `NewMessage` ||


#### Exonum.hash(buffer)

| Parameter | Type | Description |
|---|---|---|
| buffer | `Array` | An array of 8-bit integers |

### Exonum.sign

Returns ED25519 signature of the data as hexadecimal string.

Accept two combinations of an arguments:

#### sign(secretKey, data, type)

| Parameter | Type | Description |
|---|---|---|
| secretKey | `string` | A 64-byte hexadecimal string |
| data | `object` ||
| type | `NewType` or `NewMessage` ||

#### sign(secretKey, buffer)

| Parameter | Type | Description |
|---|---|---|
| secretKey | `string` | A 64-byte hexadecimal string |
| buffer | `Array` | An array of 8-bit integers |

### Exonum.verifySignature

Returns `true` if verification succeeded or `false` if it failed.

Accept two combinations of an arguments:

#### verifySignature(signature, publicKey, data, type)

| Parameter | Type | Description |
|---|---|---|
| signature | `string` | A 64-byte hexadecimal string |
| publicKey | `string` | A 32-byte hexadecimal string |
| data | `Object` ||
| type | `NewType` or `NewMessage` ||

#### verifySignature(signature, publicKey, buffer)

| Parameter | Type | Description |
|---|---|---|
| signature | `string` | A 64-byte hexadecimal string |
| publicKey | `string` | A 32-byte hexadecimal string |
| buffer | `Array` | An array of 8-bit integers |

### Exonum.keyPair

Returns random pair of `publicKey` and `secretKey` as hexadecimal strings.

```json
{
    "publicKey": "...",
    "secretKey": "..."
}
```

### Exonum.randomUint64

Returns random `Uint64` of cryptographic quality as a string.

## Proofs of existence

### Exonum.merkleProof(rootHash, count, proofNode, range, type) 

Checks proof of Merkle tree.

Returns an array of elements if tree is valid. Otherwise, an error occurs.

| Parameter | Type | Description |
|---|---|---|
| rootHash | `string` | A 32-byte hexadecimal string |
| count | `number` | A total count of elements in tree |
| proofNode | `object` | A tree with proof |
| range | `Array` | An array of two numbers. Represents list of obtained elements: `[startIndex; endIndex)` |
| type | `NewType` | Optional parameter. MerkleProof method expects to find arrays of 8-bit integers as values in tree in the case when it is not passed | 

### Exonum.merklePatriciaProof(rootHash, proof, key)

Checks proof of Merkle Patricia tree.

Returns element if tree is valid element is found.
Returns `null` if tree is valid but element is not found.
Otherwise, an error occurs.

| Name | Type | Description |
|---|---|---|
| rootHash | `string` | A 32-byte hexadecimal string |
| proofNode | `Object` | A tree with proof|
| key | `string` | A 32-byte hexadecimal string |
| type | `NewType` | Optional parameter. MerkleProof method expects to find arrays of 8-bit integers as values in tree in the case when it is not passed |

## Blockchain integrity checks

### Exonum.verifyBlock(data, validators)

Validate block and each precommit in block.

Returns `true` if verification is succeeded or `false` if it is failed.

| Name | Type | Description |
|---|---|---|
| data | `object` ||
| validators | `Array` | An array of validators public keys. Each public key is hexadecimal string of a 32 bytes |

`data` field structure:

```
{
    "block": {
        "height": ...,
        "propose_round": ...,
        "prev_hash": ...,
        "tx_hash": ...,
        "state_hash": ...
    },
    "precommits": [
        {
            "validator": ...,
            "height": ...,
            "round": ...,
            "propose_hash": ...,
            "block_hash": ...,
            "time": ...,
        },
        ...
    ]
}
```

## Primitive data types

### Signed integers

| Name | Type | Size (bytes) | Description |
|---|---|---|---|
| Int8 | `number` | `1` | Signed integer in a range from `-128` to `127` |
| Int16 | `number` | `2` | Signed integer in a range from `-32768` to `32767` |
| Int32 | `number` | `4` | Signed integer in a range from `-2147483648` to `2147483647` |
| Int64 | `number` or `string`* | `8` | Signed integer in a range from `-9223372036854775808` to `9223372036854775807` |

*\*Note that JavaScript limits minimum and maximum integer number.
Minimum safe integer in JavaScript is `-(2^53-1)` which is equal to `-9007199254740991`.
Maximum safe integer in JavaScript is `2^53-1` which is equal to `9007199254740991`.
For unsafe numbers use `string` only.*

*To determine either number is safe use [Number.isSafeInteger()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger).*

### Unsigned integers

| Name | Type | Size (bytes) | Description |
|---|---|---|---|
| Uint8 | `number` | `1` | Signed integer in a range from `0` to `255` |
| Int16 | `number` | `2` | Signed integer in a range from `0` to `65535` |
| Int32 | `number` | `4` | Signed integer in a range from `0` to `4294967295` |
| Int64 | `number` or `string`* | `8` | Signed integer in a range from `0` to `18446744073709551615` |

*\*Note that JavaScript limits minimum and maximum integer number.
Maximum safe integer in JavaScript is `2^53-1` which is equal to `9007199254740991`.
For numbers greater than safe use `string` only.*

### String

| Type | Size (bytes) | Description |
|---|---|---|
| `string` | `8` | String of UTF-8 characters |

### Hash

| Type | Size (bytes) | Description |
|---|---|---|
| `string` | `32` | Hexadecimal string |

### PublicKey

| Type | Size (bytes) | Description |
|---|---|---|
| `string` | `32` | Hexadecimal string |

### Digest

| Type | Size (bytes) | Description |
|---|---|---|
| `string` | `64` | Hexadecimal string |

### Timespec

| Type | Size (bytes) | Description |
|---|---|---|
| `number` or `string`* | `8` | Unix time in nanosecond |

*\*Note that JavaScript limits minimum and maximum integer number.
Maximum safe integer in JavaScript is `2^53-1` which is equal to `9007199254740991`.
For numbers greater than safe use `string` only.*

### Bool

| Type | Size (bytes) | Description |
|---|---|---|
| `boolean` | `1` ||

### FixedBuffer

| Type | Size (bytes) | Description |
|---|---|---|
| `Array` | any | Array of 8-bit unsigned integers |

## Build

Install npm dependencies:

```
$ npm install
```

Compile browser version into `dist` folder:

```
$ grunt
```

## Test coverage

To run tests execute:

```
$ grunt test
```

## License

Exonum Client is licensed under the Apache License (Version 2.0). See [LICENSE](LICENSE) for details.

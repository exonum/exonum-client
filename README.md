# Client for Exonum blockchain platform

JavaScript toolkit to work with Exonum blockchain from both of browser and Node.js.

#### Use in browser:

```html
<script src="dist/exonum-client.min.js"></script>
<script>
    Exonum.hash(buffer);
</script>
```

#### Use in Node.js:

```javascript
var Exonum = require('exonum-client');
Exonum.hash(buffer);
```

#### Built-in data types:

* [Int8](#int8)
* [Int16](#int16)
* [Int32](#int32)
* [Int64](#int64)
* [Uint8](#uint8)
* [Uint16](#uint16)
* [Uint32](#uint32)
* [Uint64](#uint64)
* [String](#string)
* [Hash](#hash)
* [PublicKey](#public-key)
* [Digest](#digest)
* [Timespec](#timespec)
* [Bool](#bool)


#### Helpers

* [randomUint64](#randomuint64)

#### Custom data types:

* [newType](#newtype)
* [newMessage](#newmessage)

#### Cryptography:

* [Get hash](#hash-1)
* [Sign data](#sign)
* [Verify signature](#verifysignature)
* [Generate key pair](#keypair)

#### Proofs of existence:

* [Merkle proof](#merkleproofroothash-count-proofnode-range-type)
* [Merkle Patricia proof](#merklepatriciaproofroothash-proof-key)

#### Work with blockchain:

* [Verify block of precommits](#verifyblockdata-validators)

#### Other:

* [Build](#build)
* [Test](#test)
* [License](#license)

---

## Built-in data types

#### Int8

A Signed integer value of the length of `1` byte.

Values range is from `-128` to `127`.

```
var someType = Exonum.newType({
    size: 1,
    fields: {
        someNumber: {type: Exonum.Int8, size: 1, from: 0, to: 1}
    }
});
```

#### Int16

A Signed integer value of the length of `2` bytes.

Values range is from `-32768` to `32767`.

```
var someType = Exonum.newType({
    size: 2,
    fields: {
        someNumber: {type: Exonum.Int16, size: 2, from: 0, to: 2}
    }
});
```

#### Int32

A Signed integer value of the length of `4` bytes.

Values range is from `-2147483648` to `2147483647`.

```
var someType = Exonum.newType({
    size: 4,
    fields: {
        someNumber: {type: Exonum.Int32, size: 4, from: 0, to: 4}
    }
});
```

#### Int64

A Signed integer value of the length of `8` bytes.

Values range is from `-9223372036854775808` to `9223372036854775807`.

Please note that JavaScript limits minimum and maximum integer number.

Minimum safe integer in JavaScript is `-(2^53-1)` which is equal to `-9007199254740991`

Maximum safe integer in JavaScript is `2^53-1` which is equal to `9007199254740991`.

Work around is to use value not as `Number` but as `String`.

```
var someType = Exonum.newType({
    size: 8,
    fields: {
        someNumber: {type: Exonum.Int64, size: 8, from: 0, to: 8}
    }
});
```

#### Uint8

Unsigned integer value of the length of `1` byte.

Values range is from `0` to `255`.

```
var someType = Exonum.newType({
    size: 1,
    fields: {
        someNumber: {type: Exonum.Uint8, size: 1, from: 0, to: 1}
    }
});
```

#### Uint16

Unsigned integer value of the length of `2` bytes.

Values range is from `0` to `65535`.

```
var someType = Exonum.newType({
    size: 2,
    fields: {
        someNumber: {type: Exonum.Uint16, size: 2, from: 0, to: 2}
    }
});
```

#### Uint32

Unsigned integer value of the length of `4` bytes.

Values range is from `0` to `4294967295`.

```
var someType = Exonum.newType({
    size: 4,
    fields: {
        someNumber: {type: Exonum.Uint32, size: 4, from: 0, to: 4}
    }
});
```

#### Uint64

Unsigned integer value of the length of `8` bytes.

Values range is from `0` to `18446744073709551615`.

Please note that JavaScript limits maximum integer number.

Maximum safe integer in JavaScript is `2^53-1` which is equal to `9007199254740991`.

Work around is to use value not as `Number` but as `String`.

```
var someType = Exonum.newType({
    size: 8,
    fields: {
        someNumber: {type: Exonum.Uint64, size: 8, from: 0, to: 8}
    }
});
```

#### String

String value of the length of `8` bytes.

```
var someType = Exonum.newType({
    size: 8,
    fields: {
        someString: {type: Exonum.String, size: 8, from: 0, to: 8}
    }
});
```

#### Hash

Hexadecimal value of the length of `32` bytes.

```
var someType = Exonum.newType({
    size: 32,
    fields: {
        someHash: {type: Exonum.Hash, size: 32, from: 0, to: 32}
    }
});
```

#### PublicKey

Hexadecimal value of the length of `32` bytes.

```
var someType = Exonum.newType({
    size: 32,
    fields: {
        somePublicKey: {type: Exonum.PublicKey, size: 32, from: 0, to: 32}
    }
});
```

#### Digest

Hexadecimal value of the length of `64` bytes.


```
var someType = Exonum.newType({
    size: 64,
    fields: {
        someDigest: {type: Exonum.Digest, size: 64, from: 0, to: 64}
    }
});
```

#### Timespec

Unsigned integer value of the length of `8` bytes. Represents Unix time in nanosecond.

Maximum safe integer in JavaScript is `2^53-1` which is equal to `9007199254740991`.

Work around is to use value not as `Number` but as `String`.

```
var someType = Exonum.newType({
    size: 8,
    fields: {
        someTimespec: {type: Exonum.Timespec, size: 8, from: 0, to: 8}
    }
});
```

#### Bool

A Boolean value of the length of `1` byte.

```
var someType = Exonum.newType({
    size: 1,
    fields: {
        someBool: {type: Exonum.Bool, size: 1, from: 0, to: 1}
    }
});
```

---

## Helpers

#### randomUint64

Returns random integer in range from `0` to `18446744073709551615` as string.

```
var randomNumber = Exonum.randomUint64();
```

---

## Custom data types

#### newType

Used to describe custom data format to make it possible to serialize data of this format into array of 8-bit integers.

Allowed to contain fields of built-in types (such as String, Hash, Uint64 etc.) and fields on `newType` type.

The `size` parameter contains full length of listed fields.

The `fields` parameter is a list of fields.

Returns an object of format type.

##### newType.serialize(data)

Can be used to retrieve representation of data of type `newType` as array of 8-bit integers.

The `data` is a custom data in JSON format.

Example:

```javascript
var someType = Exonum.newType({
    size: 16,
    fields: {
        id: {type: Exonum.Uint64, size: 8, from: 0, to: 8},
        name: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var data = {id: 1, name: 'John Doe'};

var buffer = someType.serialize(data);
```

It is possible to use other custom types as type of field: 

```javascript
var someType = Exonum.newType({
    size: 16,
    fields: {
        id: {type: Exonum.Uint64, size: 8, from: 0, to: 8},
        name: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var someOtherType = Exonum.newType({
    size: 40,
    fields: {
        amount: {type: Exonum.Uint64, size: 8, from: 0, to: 8},
        from: {type: someType, size: 16, from: 8, to: 24},
        to: {type: someType, size: 16, from: 24, to: 40}
    }
});

var data = {
    amount: 500,
    from: {id: 1, name: 'John Doe'},
    to: {id: 2, name: 'Jane Roe'}
};

var buffer = someOtherType.serialize(data);
```

##### newType.hash(data)

The `data` is a custom data in JSON format.

Returns SHA256 hash of the data as hexadecimal string.

```javascript
var someType = Exonum.newType({
    size: 16,
    fields: {
        id: {type: Exonum.Uint64, size: 8, from: 0, to: 8},
        name: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var data = {id: 1, name: 'John Doe'};

var hash = someType.hash(data);
```

##### newType.sign(data, secretKey)

The `data` is a custom data in JSON format.

The `secretKey` is a 64 bit secret key.

Returns ED25519 signature of the data as hexadecimal string.

```javascript
var someType = Exonum.newType({
    size: 16,
    fields: {
        id: {type: Exonum.Uint64, size: 8, from: 0, to: 8},
        name: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var data = {id: 1, name: 'John Doe'};

var secretKey = '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36';

var signature = someType.sign(data, secretKey);
```

##### newType.verifySignature(data, signature, publicKey)

The `data` is a custom data in JSON format.

The `signature` is a 64 bit hexadecimal string.

The `publicKey` is a 32 bit secret key.

Returns `true` if verification succeeded or `false` if it failed.

```javascript
var someType = Exonum.newType({
    size: 16,
    fields: {
        id: {type: Exonum.Uint64, size: 8, from: 0, to: 8},
        name: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var data = {id: 1, name: 'John Doe'};

var signature = '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36';

var publicKey = '280a704efafae9410d7b07140bb130e4995eeb381ba90939b4eaefcaf740ca25';

someType.verifySignature(data, signature, publicKey);
```

#### newMessage

Used to describe custom data format to make it possible to serialize data of this format into array of 8-bit integers.

Allowed to contain fields of built-in types (such as String, Hash, Uint64 etc.) and fields of `newType` type.

This method is designed to represent messages. So method `newMessage` also contains header with fields that are specific for messages only.

The `size` parameter contains full length of listed fields.

The `service_id` is a numeric parameter.

The `message_id` is a numeric parameter.

The `fields` parameter is a list of fields.

Returns an object of format type.

##### newMessage.serialize(data, cutSignature)

Can be used to retrieve representation of data of type `newMessage` as array of 8-bit integers.

The `data` is a custom data in JSON format.

The `cutSignature` parameter is an optional boolean flag. If set to `true` signature will not be appended to serialized data.

Example:

```javascript
var someMessage = Exonum.newMessage({
    size: 16,
    service_id: 7,
    message_id: 15,
    signature: 'aa77e9f37671ab2e85851e518aca2288f61662816bce15cfc03a8e094e7f9ecd',
    fields: {
        name: {type: Exonum.String, size: 8, from: 0, to: 8},
        balance: {type: Exonum.Uint64, size: 8, from: 8, to: 16}
    }
});

var data = {
    name: 'John Doe',
    balance: 500
};

var buffer = someMessage.serialize(data);
```

##### newMessage.hash(data)

The `data` is a custom data in JSON format.

Returns SHA256 hash of the data as hexadecimal string.

```javascript
var someMessage = Exonum.newMessage({
    size: 16,
    service_id: 8,
    message_id: 12,
    signature: 'aa77e9f37671ab2e85851e518aca2288f61662816bce15cfc03a8e094e7f9ecd',
    fields: {
        id: {type: Exonum.Uint64, size: 8, from: 0, to: 8},
        name: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var data = {id: 1, name: 'John Doe'};

var hash = someMessage.hash(data);
```

##### newMessage.sign(data, secretKey)

The `data` is a custom data in JSON format.

The `secretKey` is a 64 bit secret key.

Returns ED25519 signature of the data as hexadecimal string.

```javascript
var someMessage = Exonum.newMessage({
    size: 16,
    service_id: 8,
    message_id: 12,
    signature: 'aa77e9f37671ab2e85851e518aca2288f61662816bce15cfc03a8e094e7f9ecd',
    fields: {
        id: {type: Exonum.Uint64, size: 8, from: 0, to: 8},
        name: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var data = {id: 1, name: 'John Doe'};

var secretKey = '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36';

var signature = someMessage.sign(data, secretKey);
```

##### newMessage.verifySignature(data, signature, publicKey)

The `data` is a custom data in JSON format.

The `signature` is a 64 bit hexadecimal string.

The `publicKey` is a 32 bit secret key.

Returns `true` if verification succeeded or `false` if it failed.

```javascript
var someMessage = Exonum.newMessage({
    size: 16,
    service_id: 8,
    message_id: 12,
    signature: 'aa77e9f37671ab2e85851e518aca2288f61662816bce15cfc03a8e094e7f9ecd',
    fields: {
        id: {type: Exonum.Uint64, size: 8, from: 0, to: 8},
        name: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var data = {id: 1, name: 'John Doe'};

var signature = '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36';

var publicKey = '280a704efafae9410d7b07140bb130e4995eeb381ba90939b4eaefcaf740ca25';

someMessage.verifySignature(data, signature, publicKey);
```

---

## Cryptography

#### hash

Returns SHA256 hash of the data as hexadecimal string.

Accept two combinations of an arguments:

##### hash(data, type)

The `data` is a custom data in JSON format.

The `type` is a description of type in the one of the internal data formats: `newType` or `newMessage`.

```javascript
var someType = Exonum.newType({
    size: 16,
    fields: {
        id: {type: Exonum.Uint64, size: 8, from: 0, to: 8},
        name: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var data = {id: 1, name: 'John Doe'};

var hash = Exonum.hash(data, someType);
```

```javascript
var someMessage = Exonum.newMessage({
    size: 16,
    service_id: 8,
    message_id: 12,
    signature: 'aa77e9f37671ab2e85851e518aca2288f61662816bce15cfc03a8e094e7f9ecd',
    fields: {
        id: {type: Exonum.Uint64, size: 8, from: 0, to: 8},
        name: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var data = {id: 1, name: 'John Doe'};

var hash = Exonum.hash(data, someMessage);
```

##### hash(buffer)

The `buffer` is an array of 8-bit integers.

```javascript
var buffer = [218, 0, 3, 12, 33, 68, 105, 0];

var hash = Exonum.hash(buffer);
```

#### sign

Returns ED25519 signature of the data as hexadecimal string.

Accept two combinations of an arguments:

##### sign(data, type, secretKey)

The `data` is a custom data in JSON format.

The `type` is a description of type in the one of the internal data formats: `newType` or `newMessage`.

The `secretKey` is a 64 bit secret key.

```javascript
var someType = Exonum.newType({
    size: 16,
    fields: {
        id: {type: Exonum.Uint64, size: 8, from: 0, to: 8},
        name: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var data = {id: 1, name: 'John Doe'};

var secretKey = '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36';

var signature = Exonum.sign(someType, data, secretKey);
```

```javascript
var someMessage = Exonum.newMessage({
    size: 16,
    service_id: 8,
    message_id: 12,
    signature: 'aa77e9f37671ab2e85851e518aca2288f61662816bce15cfc03a8e094e7f9ecd',
    fields: {
        id: {type: Exonum.Uint64, size: 8, from: 0, to: 8},
        name: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var data = {id: 1, name: 'John Doe'};

var secretKey = '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36';

var signature = Exonum.sign(data, someMessage, secretKey);
```

##### sign(buffer, secretKey)

The `buffer` is an array of 8-bit integers.

The `secretKey` is a 64 bit secret key.

```javascript
var buffer = [218, 0, 3, 12, 33, 68, 105, 0];

var secretKey = '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36';

var signature = Exonum.sign(buffer, secretKey);
```

#### verifySignature

Returns `true` if verification succeeded or `false` if it failed.

Accept two combinations of an arguments:

##### verifySignature(data, type, signature, publicKey)

The `data` is a custom data in JSON format.

The `type` is a description of type in the one of the internal data formats: `newType` or `newMessage`.

The `signature` is a 64 bit hexadecimal string.

The `publicKey` is a 32 bit secret key.

```javascript
var someType = Exonum.newType({
    size: 16,
    fields: {
        id: {type: Exonum.Uint64, size: 8, from: 0, to: 8},
        name: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var data = {id: 1, name: 'John Doe'};

var signature = '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36';

var publicKey = '280a704efafae9410d7b07140bb130e4995eeb381ba90939b4eaefcaf740ca25';

Exonum.verifySignature(data, someType, signature, publicKey);
```

```javascript
var someMessage = Exonum.newMessage({
    size: 16,
    service_id: 8,
    message_id: 12,
    signature: 'aa77e9f37671ab2e85851e518aca2288f61662816bce15cfc03a8e094e7f9ecd',
    fields: {
        id: {type: Exonum.Uint64, size: 8, from: 0, to: 8},
        name: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var data = {id: 1, name: 'John Doe'};

var signature = '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36';

var publicKey = '280a704efafae9410d7b07140bb130e4995eeb381ba90939b4eaefcaf740ca25';

Exonum.verifySignature(data, someMessage, signature, publicKey);
```

##### verifySignature(buffer, signature, publicKey)

The `buffer` is an array of 8-bit integers.

The `signature` is a 64 bit hexadecimal string.

The `publicKey` is a 32 bit secret key.

```javascript
var buffer = [218, 0, 3, 12, 33, 68, 105, 0];

var signature = '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36';

var publicKey = '280a704efafae9410d7b07140bb130e4995eeb381ba90939b4eaefcaf740ca25';

Exonum.verifySignature(buffer, signature, publicKey);
```

#### keyPair

Returns random pair of `publicKey` and `secretKey` as hexadecimal strings.

```javascript
{
    publicKey: '...',
    secretKey: '...'
}
```

---

## Proofs of existence

#### merkleProof(rootHash, count, proofNode, range, type)

This methods can check proof of Merkle tree.

The `rootHash` is a hash of root node as hexadecimal string.

The `count` is a total count of elements in tree.

The `proofNode` is a tree with proof in JSON format.

The `range` is array of two values: start and end indexes. Represents list of obtained elements.

The `type` is a format of data in a special format. It is an optional parameter. MerkleProof method expects to find arrays of 8-bit integers as values in tree in the case when it is not passed.

Returns an array of elements if tree is valid.

Returns `undefined` if tree is not valid.

#### merklePatriciaProof(rootHash, proof, key)

This methods can check proof of Merkle Patricia tree.

The `rootHash` is a hash of root node represented as hexadecimal string.

The `proofNode` is a tree with proof in JSON format.

The `key` is a key of element represented as hexadecimal string.

The `type` is a format of data in a special format. It is an optional parameter. MerkleProof method expects to find arrays of 8-bit integers as values in tree in the case when it is not passed.

Returns elements data in JSON format if tree is valid and element is found.

Returns `null` if tree is valid but element is not found.

Returns `undefined` if tree is not valid.

---

## Work with blockchain

#### verifyBlock(data, validators)

This methods can verify block of precommits.

The `data` is a custom data in JSON format.

The `validators` is an array of validators public keys. Each public key is hexadecimal string of a 32 bytes.

Returns `true` if verification is succeeded or `false` if it is failed.

---

## Other

#### Build

Install npm packages required for development:

```
$ npm install
```

To build minimised and development versions of library execute:

```
$ grunt
```

#### Test

To run tests execute:

```
$ grunt mochaTest
```

#### License

Exonum Client is licensed under the Apache License (Version 2.0). See [LICENSE](https://github.com/exonum/exonum-core/blob/master/LICENSE) for details.

# Client for Exonum blockchain platform

JavaScript toolkit to work with Exonum blockchain in both of browser and Node.js.

#### Table of Contents:
1. [Use in browser](#use-in-browser)
2. [Use in Node.js](#use-in-nodejs)
3. [API methods](#api-methods)
   * [hash](#hash)
   * [sign](#sign)
   * [verifySignature](#verifysignature)
   * [newType](#newtype)
   * [newMessage](#newmessage)
   * [merkleProof](#merkleproofroothash-count-proofnode-range-type)
   * [merklePatriciaProof](#merklepatriciaproofroothash-proof-key)
   * [verifyBlock](#verifyblockdata)
4. [Built-in types](#built-in-types)
   * [I8](#i8)
   * [I16](#i16)
   * [I32](#i32)
   * [I64](#i64)
   * [U8](#u8)
   * [U16](#u16)
   * [U32](#u32)
   * [U64](#u64)
   * [String](#string)
   * [Hash](#hash-1)
   * [PublicKey](#publickey)
   * [Digest](#digest)
   * [Timespec](#timespec)
   * [Bool](#bool)
5. [Tests](#tests)
5. [Build](#build)
5. [License](#license)

#### Use in browser:

```html
<script src="exonum-client.min.js"></script>
<script>
    Exonum.hash(buffer);
</script>
```

#### Use in Node.js:

```javascript
var Exonum = require('exonum-client');
Exonum.hash(buffer);
```

## API methods

### hash

Returns SHA256 hash of the data as hexadecimal string.

Accept two combinations of an arguments:

##### hash(data, type)

The `data` is a custom data in JSON format.

The `type` is a description of type in the one of the internal data formats: `newType` or `newMessage`.

```javascript
var CustomType = Exonum.newType({
    size: 16,
    fields: {
        id: {type: Exonum.U64, size: 8, from: 0, to: 8},
        name: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var data = {id: 1, name: 'John Doe'};

var hash = Exonum.hash(data, CustomType);
```

```javascript
var CustomMessage = Exonum.newMessage({
    size: 16,
    service_id: 8,
    message_type: 12,
    fields: {
        id: {type: Exonum.U64, size: 8, from: 0, to: 8},
        name: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var data = {id: 1, name: 'John Doe'};

var hash = Exonum.hash(data, CustomMessage);
```

##### hash(buffer)

The `buffer` is an array of 8-bit integers.

```javascript
var buffer = [218, 0, 3, 12, 33, 68, 105, 0];

var hash = Exonum.hash(buffer);
```

### sign

Returns ED25519 signature of the data as hexadecimal string.

Accept two combinations of an arguments:

##### sign(data, type, secretKey)

The `data` is a custom data in JSON format.

The `type` is a description of type in the one of the internal data formats: `newType` or `newMessage`.

The `secretKey` is a 64 bit secret key.

```javascript
var CustomType = Exonum.newType({
    size: 16,
    fields: {
        id: {type: Exonum.U64, size: 8, from: 0, to: 8},
        name: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var data = {id: 1, name: 'John Doe'};

var secretKey = '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36';

var signature = Exonum.sign(CustomType, data, secretKey);
```

```javascript
var CustomMessage = Exonum.newMessage({
    size: 16,
    service_id: 8,
    message_type: 12,
    fields: {
        id: {type: Exonum.U64, size: 8, from: 0, to: 8},
        name: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var data = {id: 1, name: 'John Doe'};

var secretKey = '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36';

var signature = Exonum.sign(data, CustomMessage, secretKey);
```

##### sign(buffer, secretKey)

The `buffer` is an array of 8-bit integers.

The `secretKey` is a 64 bit secret key.

```javascript
var buffer = [218, 0, 3, 12, 33, 68, 105, 0];

var secretKey = '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36';

var signature = Exonum.sign(buffer, secretKey);
```

### verifySignature

Returns `true` if verification succeeded or `false` if it failed.

Accept two combinations of an arguments:

##### verifySignature(data, type, signature, publicKey)

The `data` is a custom data in JSON format.

The `type` is a description of type in the one of the internal data formats: `newType` or `newMessage`.

The `signature` is a 64 bit hexadecimal string.

The `publicKey` is a 32 bit secret key.

```javascript
var CustomType = Exonum.newType({
    size: 16,
    fields: {
        id: {type: Exonum.U64, size: 8, from: 0, to: 8},
        name: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var data = {id: 1, name: 'John Doe'};

var signature = '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36';

var publicKey = '280a704efafae9410d7b07140bb130e4995eeb381ba90939b4eaefcaf740ca25';

Exonum.verifySignature(data, CustomType, signature, publicKey);
```

```javascript
var CustomMessage = Exonum.newMessage({
    size: 16,
    service_id: 8,
    message_type: 12,
    fields: {
        id: {type: Exonum.U64, size: 8, from: 0, to: 8},
        name: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var data = {id: 1, name: 'John Doe'};

var signature = '6752be882314f5bbbc9a6af2ae634fc07038584a4a77510ea5eced45f54dc030f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36';

var publicKey = '280a704efafae9410d7b07140bb130e4995eeb381ba90939b4eaefcaf740ca25';

Exonum.verifySignature(data, CustomMessage, signature, publicKey);
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

### newType

Used to create describe custom data format.

Allowed to contain fields of built-in types (such as String, Hash, U64 etc.) and fields on `newType` type.

Receive a declarative format of the data.

Returns an object of format type.

##### newType.serialize(data)

Can be used to retrieve representation of data of type `newType` as array of 8-bit integers.

Lets declare simple type `User` with field `id` of Integer type and field `name` of String type:

```javascript
var User = Exonum.newType({
    size: 16,
    fields: {
        id: {type: Exonum.U64, size: 8, from: 0, to: 8},
        name: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var userData = {id: 1, name: 'John Doe'};

var buffer = User.serialize(userData);
```

Lets declare custom type `Payment` that will use custom type `User` as one of the fields: 

```javascript
var User = Exonum.newType({
    size: 16,
    fields: {
        id: {type: Exonum.U64, size: 8, from: 0, to: 8},
        name: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var Payment = Exonum.newType({
    size: 40,
    fields: {
        amount: {type: Exonum.U64, size: 8, from: 0, to: 8},
        from: {type: User, size: 16, from: 8, to: 24},
        to: {type: User, size: 16, from: 24, to: 40}
    }
});

var paymentData = {
    amount: 500,
    from: {id: 1, name: 'John Doe'},
    to: {id: 2, name: 'Jenifer Lee'}
};

var buffer = Payment.serialize(paymentData);
```

All numeric fields of `newType` object are serialized as big endian by-default. To serialize them as little andian use `littleEndian: true` flag:

```
var SomeType = Exonum.newType({
    size: 16,
    littleEndian: true,
    fields: {
        ...
    }
});
```

### newMessage

Used to create describe custom data format.

Allowed to contain fields of built-in types (such as String, Hash, U64 etc.) and fields on `newMessage` type.

This method is designed to represent messages. So method `newMessage` also contains header with fields that are specific for messages only.

Receive a declarative format of the data.

Returns an object of format type.

##### newMessage.serialize(data)

Can be used to retrieve representation of data of type `newMessage` as array of 8-bit integers.

Lets declare custom type `CreateUser`:

```javascript
var CreateUser = Exonum.newMessage({
    size: 16,
    service_id: 7,
    message_type: 15,
    fields: {
        name: {type: Exonum.String, size: 8, from: 0, to: 8},
        balance: {type: Exonum.U64, size: 8, from: 8, to: 16}
    }
});

var userData = {
    name: 'John Doe',
    balance: 500
};

var buffer = CreateUser.serialize(userData);
```

All numeric fields of `newMessage` object are serialized as little endian.

### merkleProof(rootHash, count, proofNode, range, type)

This methods can check proof of Merkle tree.

The `rootHash` is a hash of root node as hexadecimal string.

The `count` is a total count of elements in tree.

The `proofNode` is a tree with proof in JSON format.

The `range` is array of two values: start and end indexes. Represents list of obtained elements.

The `type` is a format of data in a special format. It is an optional parameter. MerkleProof method expects to find arrays of 8-bit integers as values in tree in the case when it is not passed.

Returns an array of elements if tree is valid.

Returns `undefined` if tree is not valid.

### merklePatriciaProof(rootHash, proof, key)

This methods can check proof of Merkle Patricia tree.

The `rootHash` is a hash of root node represented as hexadecimal string.

The `proofNode` is a tree with proof in JSON format.

The `key` is a key of element represented as hexadecimal string.

The `type` is a format of data in a special format. It is an optional parameter. MerkleProof method expects to find arrays of 8-bit integers as values in tree in the case when it is not passed.

Returns elements data in JSON format if tree is valid and element is found.

Returns `null` if tree is valid but element is not found.

Returns `undefined` if tree is not valid.

### verifyBlock(data)

This methods can verify block with precommits.

The `data` is a custom data in JSON format.

Returns `true` if verification succeeded or `false` if it failed.

## Built-in types

#### I8

A Signed integer value of the length of `1` byte.

Values range is from `-128` to `127`.

```
var CustomType = Exonum.newType({
    size: 1,
    fields: {
        someNumber: {type: Exonum.I8, size: 1, from: 0, to: 1}
    }
});
```

#### I16

A Signed integer value of the length of `2` bytes.

Values range is from `-32768` to `32767`.

```
var CustomType = Exonum.newType({
    size: 2,
    fields: {
        someNumber: {type: Exonum.I16, size: 2, from: 0, to: 2}
    }
});
```

#### I32

A Signed integer value of the length of `4` bytes.

Values range is from `-2147483648` to `2147483647`.

```
var CustomType = Exonum.newType({
    size: 4,
    fields: {
        someNumber: {type: Exonum.I32, size: 4, from: 0, to: 4}
    }
});
```

#### I64

A Signed integer value of the length of `8` bytes.

Values range is from `-9223372036854775808` to `9223372036854775807`.

Please note that JavaScript limits minimum and maximum integer number.

Minimum safe integer in JavaScript is `-(2^53-1)` which is equal to `-9007199254740991`

Maximum safe integer in JavaScript is `2^53-1` which is equal to `9007199254740991`.

Work around is to use value not as `Number` but as `String`.

```
var CustomType = Exonum.newType({
    size: 8,
    fields: {
        someNumber: {type: Exonum.I64, size: 8, from: 0, to: 8}
    }
});
```

#### U8

Unsigned integer value of the length of `1` byte.

Values range is from `0` to `255`.

```
var CustomType = Exonum.newType({
    size: 1,
    fields: {
        someNumber: {type: Exonum.U8, size: 1, from: 0, to: 1}
    }
});
```

#### U16

Unsigned integer value of the length of `2` bytes.

Values range is from `0` to `65535`.

```
var CustomType = Exonum.newType({
    size: 2,
    fields: {
        someNumber: {type: Exonum.U16, size: 2, from: 0, to: 2}
    }
});
```

#### U32

Unsigned integer value of the length of `4` bytes.

Values range is from `0` to `4294967295`.

```
var CustomType = Exonum.newType({
    size: 4,
    fields: {
        someNumber: {type: Exonum.U32, size: 4, from: 0, to: 4}
    }
});
```

#### U64

Unsigned integer value of the length of `8` bytes.

Values range is from `0` to `18446744073709551615`.

Please note that JavaScript limits maximum integer number.

Maximum safe integer in JavaScript is `2^53-1` which is equal to `9007199254740991`.

Work around is to use value not as `Number` but as `String`.

```
var CustomType = Exonum.newType({
    size: 8,
    fields: {
        someNumber: {type: Exonum.U64, size: 8, from: 0, to: 8}
    }
});
```

#### String

String value of the length of `8` bytes.

```
var CustomType = Exonum.newType({
    size: 8,
    fields: {
        someString: {type: Exonum.String, size: 8, from: 0, to: 8}
    }
});
```

#### Hash

Hexadecimal value of the length of `32` bytes.

```
var CustomType = Exonum.newType({
    size: 32,
    fields: {
        someHash: {type: Exonum.Hash, size: 32, from: 0, to: 32}
    }
});
```

#### PublicKey

Hexadecimal value of the length of `32` bytes.

```
var CustomType = Exonum.newType({
    size: 32,
    fields: {
        somePublicKey: {type: Exonum.PublicKey, size: 32, from: 0, to: 32}
    }
});
```

#### Digest

Hexadecimal value of the length of `64` bytes.


```
var CustomType = Exonum.newType({
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
var CustomType = Exonum.newType({
    size: 8,
    fields: {
        someTimespec: {type: Exonum.Timespec, size: 8, from: 0, to: 8}
    }
});
```

#### Bool

A Boolean value of the length of `1` byte.

```
var CustomType = Exonum.newType({
    size: 1,
    fields: {
        someBool: {type: Exonum.Bool, size: 1, from: 0, to: 1}
    }
});
```

## Tests

To run tests execute:

```
npm run test
```

To check test coverage execute:

```
npm run test-coverage
```

## Build

To build minimised version of library execute:

```
npm run build
```

To build development version of library execute:

```
npm run build-debug
```

## License

TODO

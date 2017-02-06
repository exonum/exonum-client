# Client for Exonum blockchain platform

Pure JavaScript toolkit to work with Exonum blockchain in both of browser and Node.js.

#### Table of Contents:
1. [Use in browser](#use-in-browser)
2. [Use in Node.js](#use-in-nodejs)
3. [API methods](#api-methods)
   * [hash](#exonumhash)
   * [sign](#exonumsign)
   * [verifySignature](#exonumverifysignature)
   * [newType](#exonumnewtype)
   * [merkleProof](#exonummerkleproof)
   * [merklePatriciaProof](#exonummerklepatriciaproof)
   * [verifyBlock](#exonumverifyblock)
4. [Built-in types](#built-in-types)
   * [I8](#exonumi8)
   * [I16](#exonumi16)
   * [I32](#exonumi32)
   * [I64](#exonumi64)
   * [U8](#exonumu8)
   * [U16](#exonumu16)
   * [U32](#exonumu32)
   * [U64](#exonumu64)
   * [String](#exonumstring)
   * [Hash](#exonumhash-1)
   * [PublicKey](#exonumpublickey)
   * [Digest](#exonumdigest)
   * [Timespec](#exonumtimespec)
   * [Bool](#exonumbool)
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

### Exonum.hash(...)

Returns SHA256 hash of the data as hexadecimal string.

Accept two combinations of an arguments:

##### Exonum.hash(data, type)

The `data` is a custom data in JSON format.

The `type` is a format of data in a special format.

##### Exonum.hash(buffer)

The `buffer` is a data serialized according to its type (array of 8-bit integers).

### Exonum.sign(...)

Returns ED25519 signature of the data as hexadecimal string.

Accept two combinations of an arguments:

##### Exonum.sign(data, type, secretKey)

The `data` is a custom data in JSON format.

The `type` is a format of data in a special format.

The `secretKey` is a 64 bit secret key.

##### Exonum.sign(buffer, secretKey)

The `buffer` is a data serialized according to its type (array of 8-bit integers).

The `secretKey` is a 64 bit secret key.

### Exonum.verifySignature(...)

Returns `true` if verification succeeded or `false` if it failed.

Accept two combinations of an arguments:

##### Exonum.verifySignature(data, type, signature, publicKey)

The `data` is a custom data in JSON format.

The `type` is a format of data in a special format.

The `signature` is a 64 bit hexadecimal string.

The `publicKey` is a 32 bit secret key.

##### Exonum.verifySignature(buffer, signature, publicKey)

The `buffer` is a data serialized according to its type (array of 8-bit integers).

The `signature` is a 64 bit hexadecimal string.

The `publicKey` is a 32 bit secret key.

### Exonum.newType({...})

This methods create custom data format based on built-in formats and other custom formats:

Receive a declarative format of the data.

Returns an object of format type.

Object of `newType` has method `serialize` which can be used to retrieve representation of data of type newType as array of 8-bit integers.

### Example of usage of Exonum.newType

Lets declare custom format called `User` with two fields `firstName` and `lastName` of string type:

```javascript
var User = Exonum.newType({
    size: 16,
    fields: {
        firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
        lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
    }
});

var userData = {
    firstName: 'John',
    lastName: 'Doe'
};

var buffer = User.serialize(userData); // [0,0,0,67,0,0,0,4,0,0,0,71,0,0,0,3,74,111,104,110,68,111,101]

Exonum.hash(buffer); // 22635e36303ff3ef4c86b855e57356f41483e6637136d1d2ec46ba2ec8f69fb9
```

Lets declare custom type `Transfer` that will use custom type `User` as one of the fields: 

```javascript
var Transfer = Exonum.newType({
    size: 24,
    fields: {
        amount: {type: Exonum.I64, size: 8, from: 0, to: 8, fixed: true},
        from: {type: User, size: 8, from: 8, to: 16},
        to: {type: User, size: 8, from: 16, to: 24}
    }
});

var transerData = {
    amount: 500,
    from: {
        firstName: 'Vasya',
        lastName: 'Pupkin'
    },
    to: {
        firstName: 'John',
        lastName: 'Doe'
    }
};

var buffer = Transfer.serialize(transerData);

Exonum.hash(buffer) // 63b8341b82f0eb6f32be73bf36a4b605655e3979030df9e025713c972d1da6d2
```

### Exonum.merkleProof(rootHash, count, proofNode, range, type)

This methods can check proof of Merkle tree. 

The `rootHash` is a hash of root node as hexadecimal string.

The `count` is a total count of elements in tree.

The `proofNode` is a tree with proof in JSON format.

The `range` is array of two values: start and end indexes. Represents list of obtained elements.

The `type` is a format of data in a special format. It is an optional parameter. MerkleProof method expects to find arrays of 8-bit integers as values in tree in the case when it is not passed.

Returns an array of elements if tree is valid.

Returns `undefined` if tree is not valid.

### Exonum.merklePatriciaProof(...)

This methods can check proof of Merkle Patricia tree.

The `rootHash` is a hash of root node represented as hexadecimal string.

The `proofNode` is a tree with proof in JSON format.

The `key` is a key of element represented as hexadecimal string.

The `type` is a format of data in a special format. It is an optional parameter. MerkleProof method expects to find arrays of 8-bit integers as values in tree in the case when it is not passed.

Returns elements data in JSON format if tree is valid and element is found.

Returns `null` if tree is valid but element is not found.

Returns `undefined` if tree is not valid.

### Exonum.verifyBlock(...)

This methods can verify block with precommits.

The `data` is a custom data in JSON format.

Returns `true` if verification succeeded or `false` if it failed.

## Built-in types

#### Exonum.I8

A Signed integer value of the length of `1` byte.

`fixed: true` should be used.

Values range from `-128` to `127`.

#### Exonum.I16

A Signed integer value of the length of `2` bytes.

`fixed: true` should be used.

Values range from `-32768` to `32767`.

#### Exonum.I32

A Signed integer value of the length of `4` bytes.

`fixed: true` should be used.

Values range from `-2147483648` to `2147483647`.

#### Exonum.I64

A Signed integer value of the length of `8` bytes.

`fixed: true` should be used.

Values range from `-9223372036854775808` to `9223372036854775807`.

Please note that JavaScript limits minimum and maximum integer number.

Minimum safe integer in JavaScript is `-(2^53-1)` which is equal to `-9007199254740991`

Maximum safe integer in JavaScript is `2^53-1` which is equal to `9007199254740991`.

To use bigger or smaller value use it not as `Number` but as `String`.

#### Exonum.U8

Unsigned integer value of the length of `1` byte.

`fixed: true` should be used.

Values range from `0` to `255`.

#### Exonum.U16

Unsigned integer value of the length of `2` bytes.

`fixed: true` should be used.

Values range from `0` to `65535`.

#### Exonum.U32

Unsigned integer value of the length of `4` bytes.

`fixed: true` should be used.

Values range from `0` to `4294967295`.

#### Exonum.U64

Unsigned integer value of the length of `8` bytes.

`fixed: true` should be used.

Values range from `0` to `18446744073709551615`.

Please note that JavaScript limits maximum integer number.

Maximum safe integer in JavaScript is `2^53-1` which is equal to `9007199254740991`.

To use bigger value use it not as `Number` but as `String`.

#### Exonum.String

String value of the length of `8` bytes.

#### Exonum.Hash

Hexadecimal value of the length of `32` bytes.

`fixed: true` should be used.

#### Exonum.PublicKey

Hexadecimal value of the length of `32` bytes.

`fixed: true` should be used.

#### Exonum.Digest

Hexadecimal value of the length of `64` bytes.

`fixed: true` should be used.

#### Exonum.Timespec

Unsigned integer value of the length of `8` bytes. Represents Unix time in nanosecond.

`fixed: true` should be used.

Maximum safe integer in JavaScript is `2^53-1` which is equal to `9007199254740991`.

To use bigger value use it not as `Number` but as `String`.

#### Exonum.Bool

A Boolean value of the length of `1` byte.

`fixed: true` should be used.

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

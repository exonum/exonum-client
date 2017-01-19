# Client for Exonum blockchain platform

Pure JavaScript toolkit to work with Exonum blockchain in both of browser and Node.js.

#### Use in browser:

```
<script src="exonum-client.min.js"></script>
<script>
    Exonum.hash(buffer);
</script>
```

#### Use in Node.js:

```
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

The `buffer` is a data serialized according to its type.

### Exonum.sign(...)

Returns ED25519 signature of the data as hexadecimal string.

Same as `hash` methods `sign` method accept two combinations of an arguments:

##### Exonum.sign(data, type, secretKey)

The `data` is a custom data in JSON format.

The `type` is a format of data in a special format.

The `secretKey` is a 64 bit secret key.

##### Exonum.sign(buffer, secretKey)

The `buffer` is a data serialized according to its type.

The `secretKey` is a 64 bit secret key.

### Exonum.newType({...})

This methods create custom data format based on built-in formats and other custom formats:

Receive a declarative format of the data.

Returns an object of format type.

Here is an example. Lets declare custom format called `User` with two fields `firstName` and `lastName` of string type:

```
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

```
var Transfer = Exonum.newType({
    size: 24,
    fields: {
        amount: {type: Exonum.I64, size: 8, from: 0, to: 8},
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

### Exonum.merkleProof(...)

### Exonum.merklePatriciaProof(...)

## Built-in types

#### Exonum.I8

A Signed integer value of the length of `1` byte.

Values range from `-128` to `127`.

#### Exonum.I16

A Signed integer value of the length of `2` bytes.

Values range from `-32768` to `32767`.

#### Exonum.I32

A Signed integer value of the length of `4` bytes.

Values range from `-2147483648` to `2147483647`.

#### Exonum.I64

A Signed integer value of the length of `8` bytes.

Values range from `-9223372036854775808` to `9223372036854775807`.

Please note that JavaScript limits minimum and maximum integer number.

Minimum safe integer in JavaScript is `-(2^53 - 1)` which is equal to `-9007199254740991`

Maximum safe integer in JavaScript is `2^53 - 1` which is equal to `9007199254740991`. 

#### Exonum.U8

Unsigned integer value of the length of `1` byte.

Values range from `0` to `255`.

#### Exonum.U16

Unsigned integer value of the length of `2` bytes.

Values range from `0` to `65535`.

#### Exonum.U32

Unsigned integer value of the length of `4` bytes.

Values range from `0` to `4294967295`.

#### Exonum.U64

A Signed integer value of the length of `8` bytes.

Values range from `0` to `18446744073709551615`.

Please note that JavaScript limits maximum integer number.

Maximum safe integer in JavaScript is `2^53 - 1` which is equal to `9007199254740991`. 

#### Exonum.String

String value of the length of `8` bytes.

#### Exonum.Hash

Hexadecimal value of the length of `32` bytes.

#### Exonum.PublicKey

Hexadecimal value of the length of `32` bytes.

#### Exonum.Timespec

Integer value of the length of `8` bytes. Represents Unix time in nanosecond.

#### Exonum.Bool

A Boolean value of the length of `1` byte.

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

MIT

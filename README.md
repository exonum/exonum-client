# Client for Exonum blockchain platform

Pure JavaScript toolkit to work with Exonum blockchain in both of browser and Node.js.

## Use in browser:

```
<script src="exonum-client.min.js"></script>
<script>
    ThinClient.hash(buffer);
</script>
```

## Use in Node.js:

```
var ThinClient = require('exonum-client');
ThinClient.hash(buffer);
```

## API methods

### ThinClient.hash(...)

Returns SHA256 hash of the data as hexadecimal string.

Accept two combinations of an arguments:

##### ThinClient.hash(data, type)

The `data` is a custom data in JSON format.

The `type` is a format of the segment in special format.

##### ThinClient.hash(buffer)

The `buffer` is an serialized according its type data.

### ThinClient.sign(...)

Returns ED25519 signature of the data as hexadecimal string.

Same as `hash` methods `sign` method accept two combinations of an arguments:

##### ThinClient.sign(data, type, secretKey)

The `data` is a custom data in JSON format.

The `type` is a format of the segment in special format.

The `secretKey` is a 64 bit secret key.

##### ThinClient.sign(buffer, secretKey)

The `buffer` is an serialized according its type data.

The `secretKey` is a 64 bit secret key.

### ThinClient.newType({...})

This methods create custom data format based on built-in formats and other custom formats:

Receive a format of the segment in special format.

Returns an object which describe custom user format.

Here is a simple example. Lets declare our custom format called `User` with two string fields `firstName` and `lastName`:

```
var User = ThinClient.newType({
    size: 16,
    fields: {
        firstName: {type: ThinClient.String, size: 8, from: 0, to: 8},
        lastName: {type: ThinClient.String, size: 8, from: 8, to: 16}
    }
});

var userData = {
    firstName: 'John',
    lastName: 'Doe'
};

var buffer = User.serialize(userData); // [0,0,0,67,0,0,0,4,0,0,0,71,0,0,0,3,74,111,104,110,68,111,101]

ThinClient.hash(buffer); // 22635e36303ff3ef4c86b855e57356f41483e6637136d1d2ec46ba2ec8f69fb9
```

Lets declare custom type `Transfer` that will use custom type `User` as one of the fields: 

```
var User = ThinClient.newType({
    size: 16,
    fields: {
        firstName: {type: ThinClient.String, size: 8, from: 0, to: 8},
        lastName: {type: ThinClient.String, size: 8, from: 8, to: 16}
    }
});

var Transfer = ThinClient.newType({
    size: 24,
    fields: {
        amount: {type: ThinClient.I64, size: 8, from: 0, to: 8},
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

ThinClient.hash(buffer) // 63b8341b82f0eb6f32be73bf36a4b605655e3979030df9e025713c972d1da6d2
```

## Built-in formats

#### ThinClient.I64

#### ThinClient.String

#### ThinClient.Hash

#### ThinClient.PublicKey

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

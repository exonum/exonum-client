# Integration Testing

This directory provides automated integration testing between the light client
library and the [Exonum core Rust facilities][exonum]. This is accomplished
by building a simple web server powered by Exonum and querying it / parsing
its responses with the help of the client.

## Prerequisites

You need to have a nightly toolchain of Rust installed, which can be accomplished
with the help of [`rustup`][rustup]. If you have several toolchains installed,
you need to set the nightly one as default; you can do this by executing

```shell
rustup override nightly
```

in the project root directory.

## Running Tests

On \*NIX, execute

```shell
npm run integration:unix
```

This will automatically build the web server, launch it, perform Mocha-powered
client tests, and finally stop the server.

On Windows, or in other environments where the above command does not work,
you can manually compile the server with

```shell
npm run integration:build
```

Then, run it with

```shell
cargo run --manifest-path integration-tests/Cargo.toml
```

(assuming you are in the root directory of the project; otherwise change the
`manifest-path` correspondingly).

Then, run the tests with

```shell
npm run integration
```

[exonum]: https://github.com/exonum/exonum
[rustup]: https://www.rustup.rs/

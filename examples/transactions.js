/**
 * Example how to create, sign and send transactions in client apps.
 */

const Exonum = require('..')
const { Transaction, keyPair } = Exonum
const { expect } = require('chai')
const { Type, Field } = require('protobufjs/light')
require('regenerator-runtime')

// Declare the transaction payload layout we will use in this example.
// It is dictated by the layout defined in the integration tests.
//
// In a more advanced setup, you can use `pbjs` binary from `protobufjs` package
// to compile a JS module from the Protobuf declarations
// as described in the [light client tutorial].
//
// [light client tutorial]: https://exonum.com/doc/version/latest/get-started/light-client/
const MockPayloadSchema = new Type('MockPayload')
  .add(new Field('metadata', 1, 'string'))
  .add(new Field('retries', 2, 'uint32'))

// First, we define a transaction type.
const Mock = new Transaction({
  // Schema of the transaction payload.
  schema: MockPayloadSchema,
  // Identifier of the service we will send transactions to. `serviceId` is assigned
  // during service instantiation; you can find it out via an endpoint in the system API.
  //
  // In this example, we keep `serviceId` constant for simplicity.
  serviceId: 100,
  // Method identifier within the service interface. Since there is no language-independent
  // interface description in Exonum yet, you will need to find out the ID by researching
  // service docs / source code.
  methodId: 1
})

async function main () {
  // We generate a keypair to sign the transactions with.
  const keys = keyPair()
  console.log('\nKeypair:')
  console.log(keys)

  // Let's generate a transaction payload. It should adhere to the format expected
  // by `protobufjs`.
  let payload = {
    metadata: 'Our metadata',
    retries: 0
  }

  // We can sign the payload with the generated keys.
  let signed = Mock.create(payload, keys)
  console.log('\nSigned transaction:')
  console.log(signed)

  // Send a transaction to the node. For this example, we will use the integration server
  // which mocks the interface of a node. The server can be launched with
  //
  //   cd integration-tests
  //   cargo run &
  const URL = 'http://localhost:8000/mock/transactions'

  let txHash = await Exonum.send(URL, signed.serialize())
  expect(txHash).to.equal(signed.hash())
  console.log('Sent transaction!')

  // `send` allows to specify custom number of retries and the interval between retries:
  const retries = 5
  const retryInterval = 100 // in milliseconds

  payload = {
    metadata: 'Other metadata',
    retries
  }
  signed = Mock.create(payload, keys)
  txHash = await Exonum.send(URL, signed.serialize(), retries, retryInterval)
  expect(txHash).to.equal(signed.hash())
  console.log('Sent transaction with custom retries!')

  // `sendQueue` function can be used to send one transaction after another,
  // waiting for transaction acceptance.
  const transactions = ['foo', 'bar', 'baz']
    .map(metadata => Mock.create({ metadata, retries: 1 }, keys))
  const expectedHashes = transactions.map(tx => tx.hash())
  const hashes = await Exonum.sendQueue(URL, transactions.map(tx => tx.serialize()))
  expect(hashes).to.deep.equal(expectedHashes)
  console.log('Sent queued transactions!')
}

main().catch(e => {
  console.error(e.toString())
  console.info('If you are getting a connection error, make sure you have launched ' +
    'the integration server. See the script source for more details')
})

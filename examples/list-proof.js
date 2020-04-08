/**
 * Example how to use `ListProof`s in client apps.
 */

const Exonum = require('..')
const { ListProof, Hash } = Exonum
const { expect } = require('chai')

// This proof JSON for hashes with indexes 3 to 6 (exclusive) in a list of 20 hashes. It is generated
// with the help of the `/hash-list/random` endpoint of the integration test server
// (located in the `integration-tests` directory):
//
//   cd integration-tests
//   cargo run &
//   curl http://localhost:8000/hash-list/random?seed=1337&count=20&start=3&end=6
let proof = {
  proof: [
    {
      index: 2,
      height: 1,
      hash: '6bb42bf3010407734e434e1f3c350b51236add748bb8f0eafe01e744f76f3442'
    },
    {
      index: 0,
      height: 2,
      hash: 'ebf2cc018985999c773e986d18d8b78ee412b9d4bd4897b376423d743c6fe7a2'
    },
    {
      index: 3,
      height: 2,
      hash: '059623695d87270700225cad666f8b4a0f69ae5821f7efaa562eb993b860c1e9'
    },
    {
      index: 1,
      height: 4,
      hash: '533ce70d1713da610ebda38c1526496573d2459160190d0b7a9928ea25c4cc86'
    },
    {
      index: 1,
      height: 5,
      hash: '8a5882abe9b6a6b8dcc60dd3e5ec1ed50902b8924d47170e1fc1dc6737dad690'
    }
  ],
  entries: [
    [3, '51a9af560377af0994fe4be465ea5adff3372623c6ac692c4d3e23b323ef8486'],
    [4, '2b7e888246a3b450c67396062e53c8b6c4b776e082e7d2a81c5536e89fe6013e'],
    [5, '000b3b9ca14f1136c076b7f681b0a496f5108f721833e6465d0671c014e60b43']
  ],
  length: 20
}

// Create a `ListProof` instance. The constructor will throw an error if
// the supplied JSON is malformed. The constructor receives proof JSON and the
// type of the elements in the proof. The latter is application-specific; here,
// we use `Hash`es (this corresponds, for example, to the [cryptocurrency tutorial]).
//
// [cryptocurrency tutorial]: https://exonum.com/doc/version/latest/get-started/data-proofs/
proof = new ListProof(proof, Hash)
// The checked entries are stored in the corresponding field. The internal structure
// of the field is explored slightly later.
expect(proof.entries.length).to.equal(3)
// Besides entries, the proof checks the length of the underlying list.
expect(proof.length).to.equal(20)

// Output elements asserted by the proof to exist in the underlying index.
// As you see, each entry contains an `index` in the underlying list, and a `value`.
console.log('\nEntries:')
for (const { index, value } of proof.entries) {
  console.log(`list[${index}] = ${value}`)
}

// The Merkle root of the proof is usually propagated further to the trust anchor
// (usually, a `state_hash` field in the block header). Here, we just compare
// it to the reference value for simplicity.
expect(proof.merkleRoot).to.equal('7b61e77d992c448939e21a463f00b1353565b31793af5bd03f044d4568aa1c0d')

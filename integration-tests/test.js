// This test suite generates proofs on the server side and then checks them
// on the client side.

/* eslint-env node, mocha */

const exonum = require('../src')
const uuid = require('uuid/v4')
const fetch = require('node-fetch')
const chai = require('chai')
const dirtyChai = require('dirty-chai')
const deepEql = require('deep-eql')
const proto = require('./src/proto/stubs')

chai.use(dirtyChai)
chai.use(deepEql)

const { expect } = chai

const { MapProof, PublicKey, newType, hexadecimalToUint8Array } = exonum

const BASE_URL = 'http://localhost:8000'

const Wallet = newType(proto.exonum.client.integration.tests.Wallet)

// TODO temp fix
function convertPubKey(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (key === 'pub_key') {
        return obj[key] = {
          data: Array.from(hexadecimalToUint8Array(obj[key]))
        }
      }
      if (obj[key] instanceof Object) {
        convertPubKey(obj[key])
      }
    }
  }
}

/**
 * Client-side stub for the CRUD operations on a `ProofMapIndex<PublicKey, Wallet>`.
 */
const service = {
  /**
   * Resets the index by removing all its entries.
   */
  async reset () {
    await fetch(BASE_URL, {
      method: 'DELETE'
    })
  },

  /**
   * Gets a proof of presence / absence for a specific key. Note that
   * the Merkle root of the index is returned as a part of the proof
   * and is assumed to be trusted by the code.
   *
   * @param {string} pubkey
   *   hex-encoded key
   * @returns {Promise<?Wallet>}
   */
  async getWallet (pubkey) {
    const response = await fetch(BASE_URL + '/' + pubkey)
    const json = await response.json()

    convertPubKey(json.proof.entries[0]) // TODO temp fix

    const trustedRoot = json.trusted_root
    const proof = new MapProof(json.proof, PublicKey, Wallet)

    if (proof.merkleRoot !== trustedRoot) {
      throw new Error(`Merkle root mismatch: expected ${trustedRoot}, got ${proof.merkleRoot}`)
    }

    if (proof.missingKeys.has(pubkey)) {
      return null
    } else if (proof.entries.has(pubkey)) {
      return proof.entries.get(pubkey)
    } else {
      throw new Error('Wallet with the given public key not in proof')
    }
  },

  /**
   * Gets a combined proof of presence / absence for an array of keys. Note that
   * the Merkle root of the index is returned as a part of the proof
   * and is assumed to be trusted by the code.
   *
   * @param {Array<string>} pubkeys
   *   hex-encoded keys
   * @returns {Promise<Array<?Wallet>>}
   */
  async getWallets (pubkeys) {
    const response = await fetch(BASE_URL + '/batch/' + pubkeys.join(','))
    const json = await response.json()

    // TODO remove this temporary hack later
    json.proof.entries.forEach(convertPubKey)

    const trustedRoot = json.trusted_root
    const proof = new MapProof(json.proof, PublicKey, Wallet)

    if (proof.merkleRoot !== trustedRoot) {
      throw new Error(`Merkle root mismatch: expected ${trustedRoot}, got ${proof.merkleRoot}`)
    }

    if (pubkeys.length !== proof.missingKeys.size + proof.entries.size) {
      throw new Error('Mismatch in number of entries in proof')
    }

    return pubkeys.map(pubkey => {
      if (proof.missingKeys.has(pubkey)) {
        return null
      } else if (proof.entries.has(pubkey)) {
        return proof.entries.get(pubkey)
      } else {
        throw new Error('Wallet with the given public key not in proof')
      }
    })
  },

  /**
   * Inserts the specified wallet into the index.
   *
   * @param {Wallet} wallet
   * @returns {Promise<{size: number}>}
   *   information about the index after the operation
   */
  async createWallet (wallet) {
    const resp = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wallet)
    })
    return resp.json()
  },

  /**
   * Inserts a collection of wallets into the index.
   *
   * @param {Array<Wallet>} wallets
   * @returns {Promise<{size: number}>}
   *   information about the index after the operation
   */
  async createWallets (wallets) {
    const resp = await fetch(BASE_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wallets)
    })
    return resp.json()
  }
}

describe('MapProof integration', function () {
  this.slow(1500)

  beforeEach(async () => {
    await service.reset()
  })

  it('should recognize a proof for a single wallet', async () => {
    const { publicKey } = exonum.keyPair()
    const wallet = {
      pub_key: publicKey,
      name: 'Alice',
      balance: 100,
      uniq_id: uuid()
    }
    await service.createWallet(wallet)

    convertPubKey(wallet) // TODO temp fix
    const resp = await service.getWallet(publicKey)
    expect(resp).to.eql(wallet)
  })

  function generateWallets (size) {
    const wallets = []
    for (let i = 0; i < size; i++) {
      const { publicKey } = exonum.keyPair()
      wallets.push({
        pub_key: publicKey,
        name: `Alice #${i}`,
        balance: 100,
        uniq_id: uuid()
      })
    }
    return wallets
  }

  function chooseKeys (wallets, size) {
    const n = wallets.length

    const requestedKeys = new Set()
    while (requestedKeys.size < size) {
      const idx = Math.min(n - 1, Math.floor(Math.random() * n))
      requestedKeys.add(wallets[idx].pub_key)
    }
    return Array.from(requestedKeys)
  }

  const sizes = [2, 3, 5, 8, 13, 21, 34, 55, 89, 144]
  sizes.forEach(n => {
    describe(`in a tree with ${n} wallets`, () => {
      it('should recognize a proof for a single wallet', async () => {
        const wallets = generateWallets(n)
        const { size } = await service.createWallets(wallets)
        expect(size).to.equal(n)

        for (let i = 0; i < 10; i++) {
          const idx = Math.floor(n / 10 * i)
          const resp = await service.getWallet(wallets[idx].pub_key)

          const wallet = Object.assign({}, wallets[idx]) // TODO temp fix
          convertPubKey(wallet) // TODO temp fix

          expect(resp).to.eql(wallet)
        }
      })

      it('should recognize a proof of absence of a single wallet', async () => {
        const wallets = generateWallets(n)
        const { size } = await service.createWallets(wallets)
        expect(size).to.equal(n)

        for (let i = 0; i < 10; i++) {
          const { publicKey } = exonum.keyPair()
          expect(await service.getWallet(publicKey)).to.be.null()
        }
      })

      const densities = [0.05, 0.2, 0.5, 0.9]
      densities.forEach(density => {
        if (density * n < 1) return

        it(`should recognize a proof for a set of wallets with density ${density}`, async () => {
          const wallets = generateWallets(n)
          const requestedKeys = chooseKeys(wallets, density * n)

          const { size } = await service.createWallets(wallets)
          expect(size).to.equal(n)

          const resp = await service.getWallets(requestedKeys)
          expect(resp).to.satisfy(resp => resp.every(wallet => !!wallet))
        })

        it(`should recognize a mixed proof with density ${density}`, async () => {
          this.timeout(10000)
          const wallets = generateWallets(n)
          let requestedKeys = chooseKeys(wallets, density * n)

          let missingKeys = new Set()
          for (let i = 0; i < density * n; i++) {
            const key = exonum.keyPair().publicKey
            missingKeys.add(key)
          }
          requestedKeys = requestedKeys.concat(Array.from(missingKeys))

          const { size } = await service.createWallets(wallets)
          expect(size).to.equal(n)

          const resp = await service.getWallets(requestedKeys)
          expect(resp).to.satisfy(resp => resp.every((wallet, i) => {
            // Emulating logical xor with a bitwise operation
            return (missingKeys.has(requestedKeys[i]) ^ !!wallet) === 1
          }))
        })
      })
    })
  })
})

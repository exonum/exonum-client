// This test suite generates proofs on the server side and then checks them
// on the client side. Also, it generates transactions on each side and tests their parsing
// on the other side.

/* eslint-env node, mocha */

import chai from 'chai'
import deepEql from 'deep-eql'
import dirtyChai from 'dirty-chai'
import fetch from 'node-fetch'
import uuid from 'uuid/v4'

import * as exonum from '../src'
import proto from './src/proto/stubs'

const { expect } = chai.use(dirtyChai).use(deepEql)
const {
  ListProof, MapProof, PublicKey, newType, hexadecimalToUint8Array, uint8ArrayToHexadecimal
} = exonum

const WALLET_BASE_URL = 'http://localhost:8000/wallets'
const LIST_BASE_URL = 'http://localhost:8000/hash-list'
const TX_BASE_URL = 'http://localhost:8000/messages/transaction'
const Wallet = newType(proto.exonum.client.integration_tests.Wallet)

// TODO temp fix
function convertPubKey (obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (key === 'pub_key') {
        obj[key] = {
          data: hexadecimalToUint8Array(obj[key])
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
    await fetch(WALLET_BASE_URL, {
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
    const response = await fetch(WALLET_BASE_URL + '/' + pubkey)
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
    const response = await fetch(WALLET_BASE_URL + '/batch/' + pubkeys.join(','))
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
    const resp = await fetch(WALLET_BASE_URL, {
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
    const resp = await fetch(WALLET_BASE_URL, {
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

/**
 * Fetches a proof for a randomly generated list from the server and checks it.
 *
 * @param {number} seed
 * @param {number} count
 * @param {number} start
 * @param {number} end
 * @returns {Promise<string[]>}
 */
async function getListProof (seed, count, start = 0, end = count) {
  const clampedEnd = Math.min(end, count)
  const url = `${LIST_BASE_URL}/random?seed=${seed}&count=${count}&start=${start}&end=${clampedEnd}`
  const response = await fetch(url)
  const { proof, trusted_root: trustedRoot } = await response.json()
  const checkedProof = new ListProof(proof, exonum.Hash)

  expect(checkedProof.merkleRoot).to.equal(trustedRoot)
  expect(checkedProof.length).to.equal(count)
  const indexes = checkedProof.entries.map(({ index }) => index)
  expect(indexes).to.have.lengthOf(clampedEnd - start)
  indexes.forEach((index, i) => expect(index).to.equal(start + i))
}

describe('ListProof integration', function () {
  this.slow(1500)

  const sizes = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]
  sizes.forEach((size) => {
    describe(`in a list with ${size} hashes`, () => {
      const seed = Math.floor(Math.random() * (2 ** 32));

      it('should verify a full proof', async () => {
        await getListProof(seed, size)
      })

      if (size > 1) {
        it('should verify proof for first half of elements', async () => {
          await getListProof(seed, size, 0, Math.ceil(size / 2))
        })

        it('should verify proof for second half of elements', async () => {
          await getListProof(seed, size, Math.ceil(size / 2))
        })

        const indexes = new Set([
          0,
          Math.floor(size / 3),
          Math.floor(2 * size / 3),
          size - 1
        ])
        indexes.forEach((index) => {
          it(`should verify proof for an element #${index}`, async () => {
            await getListProof(seed, size, index, index + 1)
          })
        })
      }

      const smallRangeLen = Math.min(size - 1, 5)
      if (smallRangeLen > 1) {
        const indexes = new Set([
          0,
          Math.floor(size / 3),
          Math.floor(size / 2),
          Math.floor(2 * size / 3)
        ])
        indexes.forEach((index) => {
          it(`should verify proof for the range ${index}..${index + smallRangeLen}`, async () => {
            await getListProof(seed, size, index, index + smallRangeLen)
          })
        })
      }

      const largeRangeLen = Math.floor(3 * size / 4)
      if (largeRangeLen > smallRangeLen) {
        const indexes = new Set([
          0,
          Math.floor(size / 5),
          Math.floor(size / 4),
          Math.floor(size / 3),
        ])
        indexes.forEach((index) => {
          it(`should verify proof for the range ${index}..${index + largeRangeLen}`, async () => {
            await getListProof(seed, size, index, index + largeRangeLen)
          })
        })
      }
    })
  })
})

/**
 * Gets a signed transaction with the specified params from the server.
 *
 * @param {number} instanceId
 * @param {number} methodId
 * @param {number} seed
 * @returns {Promise<*>}
 */
async function getTransaction (instanceId, methodId, seed) {
  const url = `${TX_BASE_URL}?seed=${seed}&instance_id=${instanceId}&method_id=${methodId}`
  const response = await fetch(url)
  return response.json()
}

/**
 * Sends a signed transaction to the server.
 *
 * @param {Verified} transaction
 * @returns {Promise<*>}
 */
async function sendTransaction (transaction) {
  const response = await fetch(TX_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(uint8ArrayToHexadecimal(transaction.serialize()))
  })
  return response.json()
}

describe('transaction integration', function () {
  this.slow(1000)

  const instanceIds = [0, 1, 3, 100, 129, 256, 65535, 2 ** 32 - 2, 2 ** 32 - 1]
  const methodIds = instanceIds.slice(0)

  function testTransaction (instanceId, methodId, seed) {
    const WalletTx = new exonum.Transaction({
      schema: proto.exonum.client.integration_tests.Wallet,
      serviceId: instanceId,
      methodId
    })

    it(`parses transaction with instance=${instanceId}, method=${methodId}, seed=${seed}`, async () => {
      const { message, wallet, hash } = await getTransaction(instanceId, methodId, seed)

      // Deserialize the message and ensure that it is equal to wallet.
      const bytes = exonum.hexadecimalToUint8Array(message)
      const verified = WalletTx.deserialize(bytes)
      expect(verified).to.not.be.null()

      const { payload } = verified
      expect(payload.name).to.equal(wallet.name)
      expect(+payload.balance).to.equal(wallet.balance)
      expect(payload.pub_key.data).to.deep.equal(hexadecimalToUint8Array(wallet.pub_key))

      // Check that server- and client-computed hashes coincide.
      expect(verified.hash()).to.equal(hash)
    })

    it(`sends transaction with instance=${instanceId}, method=${methodId}, seed=${seed}`, async () => {
      const keySeed = hexadecimalToUint8Array(exonum.hash([seed]))
      const keyPair = exonum.fromSeed(keySeed)
      const wallet = {
        pub_key: { data: hexadecimalToUint8Array(keyPair.publicKey) },
        name: `Alice #${seed}`,
        balance: 100,
        uniq_id: uuid()
      }
      const transaction = WalletTx.create(wallet, keyPair)

      const response = await sendTransaction(transaction)
      expect(response.instance_id).to.equal(instanceId)
      expect(response.method_id).to.equal(methodId)
      expect(response.hash).to.equal(transaction.hash())
      expect(response.wallet.name).to.equal(wallet.name)
    })
  }

  instanceIds.forEach((instanceId) => {
    methodIds.forEach((methodId) => {
      for (let seed = 0; seed < 10; seed++) {
        testTransaction(instanceId, methodId, seed)
      }
    })
  })
})

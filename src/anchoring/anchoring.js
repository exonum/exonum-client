import axios from 'axios'

import { hexadecimalToUint8Array, byteArrayToInt } from '../types/convert'
import { to } from '../helpers'

import { providers } from './providers/'

export class Anchoring {
  constructor (params) {
    const { url, prefix, version, provider, anchorStep } = Object.assign({
      url: 'http://localhost:8000',
      version: 'v1',
      prefix: 'api',
      provider: new providers.Blocktrail(),
      anchorStep: 1000
    }, params)
    this.provider = provider
    this.anchoringPath = `${url}/${prefix}/services/btc_anchoring/${version}`
    this.explorerPath = `${url}/${prefix}/explorer/${version}`

    this.exonumPrefix = '45584f4e554d'
    this.anchorStep = anchorStep
  }

  /**
   * Return true if opReturn is valid
   * @param {String} opReturn
   * @returns {Bool}
   */
  checkOpReturn (opReturn) {
    return new RegExp(`${this.exonumPrefix}[0-9a-z]{84,148}$`).test(opReturn)
  }

  /**
   * Return parsed object from OP_RETURN of anchored transaction
   * @param {String} opReturn
   * @returns {Object}
   */
  parseOpReturn (opReturn) {
    const anchor = opReturn.split(this.exonumPrefix)[1]
    return {
      version: byteArrayToInt(hexadecimalToUint8Array(anchor.slice(0, 2))),
      payloadType: byteArrayToInt(hexadecimalToUint8Array(anchor.slice(2, 4))),
      blockHeight: byteArrayToInt(hexadecimalToUint8Array(anchor.slice(4, 20))),
      blockHash: anchor.slice(20, 84)
    }
  }

  /**
   * Load and return of actual anchoring address
   * @returns {Promise}
   */
  getActualAddress () {
    return axios.get(`${this.anchoringPath}/address/actual`)
      .then(({ data }) => data)
  }

  /**
   * Load and return of block by block height
   * @param {String} blockHeight
   * @returns {Promise}
   */
  getBlock (blockHeight) {
    return axios.get(`${this.explorerPath}/blocks/${blockHeight}`)
      .then(({ data }) => data)
  }

  /**
   * Check all anchor transactions and all anchored blocks
   * @returns {Object}
   */
  async checkAnchorChain () {
    const [address, addressErr] = await to(this.getActualAddress())
    if (addressErr) return addressErr
    let errors = []
    const [txs, txsErr] = await to(this.provider.getAddressTransactions(address))
    if (txsErr) return txsErr

    let anchors = []
    let nextHeight = 0
    let attemptsCount = 1
    for (let i = 0; i < txs.length; ++i) {
      const tx = txs[i]
      const opReturn = this.provider.getOpReturnFromTx(tx)
      if (!this.checkOpReturn(opReturn)) continue
      const anchor = this.parseOpReturn(opReturn)
      if (nextHeight !== anchor.blockHeight) {
        errors = [...errors, { tx, message: `Wrong block height in anchor, should be ${nextHeight}` }]
      }

      if (anchor.blockHeight !== 0) {
        const [block, blockErr] = await to(this.getBlock(anchor.blockHeight))
        if (blockErr) {
          if (attemptsCount >= 5) return blockErr
          attemptsCount++
          --i
        } else if (block === null) {
          errors = [...errors, {
            tx,
            opReturn,
            message: 'Block not found in Exonum blockchain'
          }]
        } else if (block.precommits[0].body.block_hash !== anchor.blockHash) {
          errors = [...errors, {
            tx,
            block,
            message: `Wrong block hash detected at block ${anchor.blockHeight}`
          }]
        }
      }

      nextHeight += this.anchorStep
      anchors = [...anchors, anchor]
    }
    return {
      anchors,
      errors,
      valid: errors.length === 0
    }
  }

  async checkFromBlockToAnchor () {

  }
}

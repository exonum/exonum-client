import axios from 'axios'

import { hexadecimalToUint8Array, byteArrayToInt } from '../types/convert'

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

  checkOpReturn (opReturn) {
    return new RegExp(`${this.exonumPrefix}[0-9a-z]{84,148}$`).test(opReturn)
  }

  parseOpReturn (opReturn) {
    const anchor = opReturn.split(this.exonumPrefix)[1]
    return {
      version: byteArrayToInt(hexadecimalToUint8Array(anchor.slice(0, 2))),
      payloadType: byteArrayToInt(hexadecimalToUint8Array(anchor.slice(2, 4))),
      blockHeight: byteArrayToInt(hexadecimalToUint8Array(anchor.slice(4, 20))),
      blockHash: anchor.slice(20, 84)
    }
  }

  getActualAddress () {
    return axios.get(`${this.anchoringPath}/address/actual`)
      .then(({ data }) => data)
  }

  getBlock (blockHeight) {
    return axios.get(`${this.explorerPath}/blocks/${blockHeight}`)
      .then(({ data }) => data)
  }

  async checkAnchorChain () {
    const address = await this.getActualAddress()
    let errors = []
    const txs = await this.provider.getAddressTransactions(address)

    let anchors = []
    let nextHeight = 0
    for (let tx of txs) {
      const opReturn = this.provider.getOpReturnFromTx(tx)
      if (!this.checkOpReturn(opReturn)) continue
      const anchor = this.parseOpReturn(opReturn)
      if (nextHeight !== anchor.blockHeight) {
        errors = [...errors, { tx, message: `Wrong block height in anchor, should be ${nextHeight}` }]
      }

      if (anchor.blockHeight !== 0) {
        const block = await this.getBlock(anchor.blockHeight)
        if (block.precommits[0].body.block_hash !== anchor.blockHash) {
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
}

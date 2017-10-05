import axios from 'axios'

import { hexadecimalToUint8Array, byteArrayToInt } from '../types/convert'

import Blocktrail from './providers/blocktrail'

export class Anchoring {
  constructor (params) {
    const { url, prefix, version, provider } = Object.assign({
      url: 'http://localhost:8000',
      version: 'v1',
      prefix: 'api',
      provider: new Blocktrail()
    }, params)
    this.provider = provider
    this.anchoringPath = `${url}/${prefix}/services/btc_anchoring/${version}`

    this.exonumPrefix = '45584f4e554d'
  }

  _checkOpReturn (opReturn) {
    return new RegExp(`${this.exonumPrefix}[0-9a-z]{84,148}$`).test(opReturn)
  }

  _parseOpReturn (opReturn) {
    const anchor = opReturn.split(this.exonumPrefix)[1]
    return {
      version: byteArrayToInt(hexadecimalToUint8Array(anchor.slice(0, 2))),
      payloadType: byteArrayToInt(hexadecimalToUint8Array(anchor.slice(2, 4))),
      blockHeight: byteArrayToInt(hexadecimalToUint8Array(anchor.slice(4, 20))),
      blockHash: anchor.slice(20, 84),
    }
  }

  async checkLast (count = 1000) {
    const address = await axios
      .get(`${this.anchoringPath}/address/actual`)
      .then(({ data }) => data)
    const txs = await this.provider.getAddressTransactions(address, count)
    const anchorTx = txs
      .filter(item => this._checkOpReturn(item.outputs[1][this.provider.anchorKey]))
      .map(item => this._parseOpReturn(item.outputs[1][this.provider.anchorKey]))
    console.log(anchorTx)

    // const opReturn = await this.provider.getAnchor(txid)
    // if (!this.testOpReturn(opReturn)) {
    //   throw new Error(`Invalid anchor in the transaction: ${txid}`)
    // }
    // console.log(byteArrayToInt(hexadecimalToUint8Array(opReturn.substr(8 * 2, 16))), opReturn)
    // return opReturn
  }
}

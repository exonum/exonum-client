import axios from 'axios'

import Blockcypher from './providers/blockcypher'

export class Anchoring {
  constructor (params) {
    const { url, prefix, version, provider } = Object.assign({
      url: 'http://localhost:8000',
      version: 'v1',
      prefix: 'api',
      provider: new Blockcypher()
    }, params)
    this.provider = provider
    this.anchoringPath = `${url}/${prefix}/services/btc_anchoring/${version}`
  }

  testOpReturn (opReturn) {
    return /^45584f4e554d[0-9a-z]{84,148}$/.test(opReturn)
  }

  async checkLast () {
    const { txid } = await axios
      .get(`${this.anchoringPath}/actual_lect/`)
      .then(({ data }) => data)
    const opReturn = await this.provider.getAnchor(txid)
    if (!this.testOpReturn(opReturn)) {
      throw new Error(`Invalid anchor in the transaction: ${txid}`)
    }
    return opReturn
  }
}

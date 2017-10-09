import Provider from './provider'
import axios from 'axios'

export default class Insight extends Provider {
  constructor (params) {
    super()

    const { api } = Object.assign({
      api: 'https://insight.bitpay.com/api',
    }, params)

    this.params = {}
    this.api = api
    this.txLoadLimit = 10
  }

  getOpReturnFromTx (tx) {
    return tx.vout[1].scriptPubKey.hex
  }

  async _getAddressTransactions ({ address, limit = 20, page = 1 }) {
    return axios.get(`${this.api}/txs`, {
      params: Object.assign({}, this.params, {
        address,
        pageNum: page,
      })
    }).then(({ data }) => data.txs)
  }
}

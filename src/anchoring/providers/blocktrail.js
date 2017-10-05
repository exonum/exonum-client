import Provider from './provider'
import axios from 'axios'

export default class Blocktrail extends Provider {
  constructor (params) {
    super()

    const { network, version, token } = Object.assign({
      network: 'BTC',
      version: 'v1',
      token: null
    }, params)

    this.params = { api_key: token }
    this.api = `https://api.blocktrail.com/${version}/${network}`
    this.txLoadLimit = 200
    this.anchorKey = 'script_hex'
  }

  async _getAddressTransactions ({ address, limit = 20, page = 1 }) {
    return axios.get(`${this.api}/address/${address}/transactions`, {
      params: Object.assign({}, this.params, {
        limit,
        page,
        sort_dir: 'desc'
      })
    }).then(({ data }) => data.data)
  }
}

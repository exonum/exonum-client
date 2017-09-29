import Provider from './provider'

export default class Blockcypher extends Provider {
  constructor (params) {
    super()

    const { network, version } = Object.assign({
      network: 'main',
      version: 'v1'
    }, params)

    this.api = `https://api.blockcypher.com/${version}/btc/${network}/`
  }

  _getTxAddress (txId) {
    return `${this.api}txs/${txId}`
  }

  _getTxReturn (data) {
    return data.outputs[1].data_hex
  }
}

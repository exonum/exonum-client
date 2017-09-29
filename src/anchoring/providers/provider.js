import axios from 'axios'

export default class Provider {
  getAnchor (txId) {
    return axios.get(this._getTxAddress(txId)).then(({ data }) => this._getTxReturn(data))
  }
}

export default class Provider {
  async getAddressTransactions (address, count) {
    let transactions = []

    if (this.txLoadLimit < count) {
      let page = 1
      let requestCount = Math.ceil(count / this.txLoadLimit)
      let txLeft = count
      for (let i = 1; i <= requestCount; i++) {
        const limit = txLeft < this.txLoadLimit ? txLeft : this.txLoadLimit
        const response = await this._getAddressTransactions({ address, limit, page: i })
        txLeft -= response.length
        transactions = [...transactions, ...response]
        if (response.length < limit) break
      }
    } else {
      transactions = await this._getAddressTransactions({ address, limit: count })
    }
    return transactions
  }
}

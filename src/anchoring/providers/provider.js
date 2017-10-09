export default class Provider {
  async getAddressTransactions (address) {
    let transactions = []
    for (let i = 1; ; ++i) {
      const response = await this._getAddressTransactions({ address, limit: this.txLoadLimit, page: i })
      transactions = [...transactions, ...response]
      if (response.length < this.txLoadLimit) break
    }
    return transactions
  }
}

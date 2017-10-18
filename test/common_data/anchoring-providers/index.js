const btTransactions1 = require('./blocktrail/transactions-1.json')
const btTransactions2 = require('./blocktrail/transactions-2.json')
const inTransactions1 = require('./insight/transactions-1.json')
const inTransactions2 = require('./insight/transactions-2.json')

export const btBlocks = require('./blocktrail/blocks.json')
export const btRes = require('./blocktrail/right-res.json')

export const btTransactionsConcated = [...btTransactions1.data, ...btTransactions2.data]
export const inTransactionsConcated = [...inTransactions1.txs, ...inTransactions2.txs]

export const btTransactions = [btTransactions1, btTransactions2]
export const inTransactions = [inTransactions1, inTransactions2]

export const getNTx = (limit, offset = 0) => ({
  data: btTransactionsConcated.filter((item, i) => i >= offset && i < limit + offset)
})

export const btWrongSequence = {
  data: [
    ...btTransactionsConcated.filter((item, i) => i > 2 && i < 5),
    btTransactionsConcated[6]]
}

export const wrongSequenceRes = require('./blocktrail/wrong-sequence-res.json')
export const wrongHashRes = require('./blocktrail/wrong-hash-res.json')

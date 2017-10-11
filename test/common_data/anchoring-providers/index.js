const blocktrailTransactions1 = require('./blocktrail/transactions-1.json')
const blocktrailTransactions2 = require('./blocktrail/transactions-2.json')
export const blocktrailBlocks = require('./blocktrail/blocks.json')
export const blocktrailResponse = require('./blocktrail/right-response.json')

export const blocktrailTransactionsConcated = [...blocktrailTransactions1.data, ...blocktrailTransactions2.data]

export const blocktrailTransactions = [blocktrailTransactions1, blocktrailTransactions2]

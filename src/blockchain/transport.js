import axios from 'axios'
import { isObject } from '../helpers'
import * as validate from '../types/validate'
import { isInstanceofOfNewMessage } from '../types/message'

const ATTEMPTS = 10
const ATTEMPT_TIMEOUT = 500

/**
 * Wait transaction to be accepted to the block.
 * @param response
 */
function waitForAcceptance (response) {
  let attempt = ATTEMPTS

  if (response.data.debug) {
    throw new Error(response.data.description)
  }

  return (function makeAttempt () {
    return axios.get(`/api/explorer/v1/transactions/${response.data}`).then(response => {
      if (response.data.type === 'committed') {
        return response.data
      } else {
        if (--attempt > 0) {
          return new Promise((resolve) => {
            setTimeout(resolve, ATTEMPT_TIMEOUT)
          }).then(makeAttempt)
        } else {
          throw new Error('Transaction has not been accepted to the block')
        }
      }
    })
  })()
}

/**
 * Send transaction to the blockchain
 * @param {string} transactionEndpoint
 * @param {string} explorerBasePath
 * @param {Object} data
 * @param {string} signature
 * @param {NewMessage} transaction
 * @return {Promise}
 */
export function send (transactionEndpoint, explorerBasePath, data, signature, transaction) {
  if (typeof transactionEndpoint !== 'string') {
    throw new TypeError('Transaction endpoint of wrong data type is passed. String is required')
  } else if (typeof explorerBasePath !== 'string') {
    throw new TypeError('Explorer base path endpoint of wrong data type is passed. String is required')
  } else if (!isObject(data)) {
    throw new TypeError('Data of wrong data type is passed. Object is required')
  } else if (!validate.validateHexadecimal(signature, 64)) {
    throw new TypeError('Signature of wrong type is passed. Hexadecimal expected.')
  } else if (!isInstanceofOfNewMessage(transaction)) {
    throw new TypeError('Transaction of wrong type of data.')
  }

  // TODO explorerBasePath ???

  axios.post(transactionEndpoint, {
    protocol_version: transaction.protocol_version,
    service_id: transaction.service_id,
    message_id: transaction.message_id,
    body: data,
    signature: signature
  }).then(waitForAcceptance)
}

/**
 * Send transaction to the blockchain
 * @param {string} endpoint
 * @param {Array} transactions
 * @param {boolean} keepOrder
 * @return {Promise}
 */
export function sendQueue (endpoint, transactions, keepOrder) {}

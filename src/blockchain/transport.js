import axios from 'axios'
import { isObject } from '../helpers'
import { hash } from '../crypto'
import * as validate from '../types/validate'
import { uint8ArrayToHexadecimal } from '../types/convert'
import { newTransaction, isTransaction } from '../types/message'

const ATTEMPTS = 10
const ATTEMPT_TIMEOUT = 500

/**
 * Send transaction to the blockchain
 * @param {string} explorerBasePath
 * @param {Transaction} type
 * @param {Object} data
 * @param {string} secretKey
 * @param {number} attempts
 * @param {number} timeout
 * @return {Promise}
 */
export function send (explorerBasePath, type, data, secretKey, attempts, timeout, headers) {
  if (typeof explorerBasePath !== 'string') {
    throw new TypeError('Explorer base path endpoint of wrong data type is passed. String is required.')
  }
  if (!isTransaction(type)) {
    throw new TypeError('Transaction of wrong type is passed.')
  }
  if (!isObject(data)) {
    throw new TypeError('Data of wrong data type is passed. Object is required.')
  }
  if (!validate.validateHexadecimal(secretKey, 64)) {
    throw new TypeError('secretKey of wrong type is passed. Hexadecimal expected.')
  }
  if (typeof attempts !== 'undefined') {
    if (isNaN(parseInt(attempts)) || attempts < 0) {
      throw new TypeError('Attempts of wrong type is passed.')
    }
  } else {
    attempts = ATTEMPTS
  }
  if (typeof timeout !== 'undefined') {
    if (isNaN(parseInt(timeout)) || timeout <= 0) {
      throw new TypeError('Timeout of wrong type is passed.')
    }
  } else {
    timeout = ATTEMPT_TIMEOUT
  }

  // clone type
  const typeCopy = newTransaction(type)

  // sign transaction
  typeCopy.signature = typeCopy.sign(secretKey, data)

  // serialize transaction header and body
  const buffer = typeCopy.serialize(data)

  // convert buffer into hexadecimal string
  const txBody = uint8ArrayToHexadecimal(new Uint8Array(buffer))

  // get transaction hash
  const txHash = hash(buffer)

  return axios.post(`${explorerBasePath}`, {
    tx_body: txBody
  }, headers).then(() => {
    if (attempts === 0) {
      return txHash
    }

    let count = attempts

    return (function attempt () {
      if (count-- === 0) {
        return new Error('The transaction was not accepted to the block for the expected period.')
      }

      return axios.get(`${explorerBasePath}?hash=${txHash}`).then(response => {
        if (response.data.type === 'committed') {
          return txHash
        }

        return new Promise((resolve) => {
          setTimeout(resolve, timeout)
        }).then(attempt)
      }).catch(() => {
        if (count === 0) {
          return new Error('The request failed or the blockchain node did not respond.')
        }

        return new Promise((resolve) => {
          setTimeout(resolve, timeout)
        }).then(attempt)
      })
    })()
  })
}

/**
 * Send transaction to the blockchain
 * @param {string} explorerBasePath
 * @param {Array} transactions
 * @param {string} secretKey
 * @param {number} attempts
 * @param {number} timeout
 * @return {Promise}
 */
export function sendQueue (explorerBasePath, transactions, secretKey, attempts, timeout) {
  let index = 0
  let responses = []

  return (function shift () {
    let transaction = transactions[index++]

    return send(explorerBasePath, transaction.type, transaction.data, secretKey, attempts, timeout).then(response => {
      responses.push(response)
      if (index < transactions.length) {
        return shift()
      } else {
        return responses
      }
    })
  })()
}

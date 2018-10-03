import axios from 'axios'
import { isObject } from '../helpers'
import { hash } from '../crypto'
import * as validate from '../types/validate'
import { uint8ArrayToHexadecimal } from '../types/convert'
import { isInstanceofOfNewMessage } from '../types/message'

const ATTEMPTS = 10
const ATTEMPT_TIMEOUT = 500

/**
 * Send transaction to the blockchain
 * @param {string} explorerBasePath
 * @param {Object} data
 * @param {NewMessage} message
 * @param {string} secretKey
 * @param {number} attempts
 * @param {number} timeout
 * @return {Promise}
 */
export function send (explorerBasePath, message, data, secretKey, attempts, timeout) {
  if (typeof explorerBasePath !== 'string') {
    throw new TypeError('Explorer base path endpoint of wrong data type is passed. String is required.')
  }
  if (!isInstanceofOfNewMessage(message)) {
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

  message.signature = message.sign(secretKey, data)

  const buffer = new Uint8Array(message.serialize(data))
  const txBody = uint8ArrayToHexadecimal(buffer)
  const txHash = hash(buffer)

  return axios.post(`${explorerBasePath}v1/transactions`, {
    tx_body: txBody
  }).then(() => {
    if (attempts === 0) {
      return txHash
    }

    let count = attempts

    return (function attempt () {
      if (count-- === 0) {
        return new Error('The transaction was not accepted to the block for the expected period.')
      }

      return axios.get(`${explorerBasePath}v1/transactions?hash=${txHash}`).then(response => {
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
 * @param {number} attempts
 * @param {number} timeout
 * @return {Promise}
 */
export function sendQueue (explorerBasePath, transactions, attempts, timeout) {
  let index = 0
  let responses = []

  return (function shift () {
    let transaction = transactions[index++]

    return send(explorerBasePath, transaction.type, transaction.data, transaction.secretKey, attempts, timeout).then(response => {
      responses.push(response)
      if (index < transactions.length) {
        return shift()
      } else {
        return responses
      }
    })
  })()
}

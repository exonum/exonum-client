import axios from 'axios'
import { uint8ArrayToHexadecimal } from '../types/convert'

const ATTEMPTS = 10
const ATTEMPT_TIMEOUT = 500

/**
 * Send transaction to the blockchain
 * @param {string} explorerBasePath
 * @param {Uint8Array | string} transaction
 * @param {number} attempts
 * @param {number} timeout
 * @return {Promise}
 */
export async function send (explorerBasePath, transaction, attempts = ATTEMPTS, timeout = ATTEMPT_TIMEOUT) {
  if (typeof explorerBasePath !== 'string') {
    throw new TypeError('Explorer base path endpoint of wrong data type is passed. String is required.')
  }

  function sleep (timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout)
    })
  }

  attempts = +attempts
  timeout = +timeout
  if (typeof transaction !== 'string') {
    transaction = uint8ArrayToHexadecimal(new Uint8Array(transaction))
  }

  const response = await axios.post(`${explorerBasePath}`, {
    tx_body: transaction
  })
  const txHash = response.data.tx_hash

  let count = attempts
  let errored = false
  while (count >= 0) {
    try {
      const response = await axios.get(`${explorerBasePath}?hash=${txHash}`)
      if (response.data.type === 'committed') {
        return txHash
      }
      errored = false
    } catch (error) {
      errored = true
    }
    count--
    await sleep(timeout)
  }

  if (errored) {
    throw new Error('The request failed or the blockchain node did not respond.')
  } else {
    throw new Error('The transaction was not accepted to the block for the expected period.')
  }
}

/**
 * Sends several transactions to the blockchain.
 *
 * @param {string} explorerBasePath
 * @param {Array} transactions
 * @param {number} attempts
 * @param {number} timeout
 * @return {Promise}
 */
export function sendQueue (
  explorerBasePath,
  transactions,
  attempts = ATTEMPTS,
  timeout = ATTEMPT_TIMEOUT
) {
  let index = 0
  let responses = []

  return (function shift () {
    let transaction = transactions[index++]

    return send(explorerBasePath, transaction, attempts, timeout).then(response => {
      responses.push(response)
      if (index < transactions.length) {
        return shift()
      } else {
        return responses
      }
    })
  })()
}

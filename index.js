import fetch from 'node-fetch'
/**
 * main object to handle most of the operations
 */
const integrator = {
  /**
   * submits your data to generate a checkout ID
   * @param {boolean} isTestMode determines if you want to hit the test or live environments
   * @param {string} accessToken
   * @param {string} parameters
   * @returns promise json
   */
  async submitCopyandPay(isTestMode, accessToken, parameters) {
    let endPoint = ''

    // eval mode
    if (isTestMode) {
      endPoint = 'https://eu-test.oppwa.com/v1/checkouts'
    } else {
      endPoint = 'https://eu-prod.oppwa.com/v1/checkouts'
    }

    const rawResponse = await fetch(endPoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken}`,
      },
      body: parameters,
    })

    const response = await rawResponse.json()

    return response
  },
}

export default integrator

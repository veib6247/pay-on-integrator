import fetch from 'node-fetch'
/**
 * main object to handle most of the operations
 */
const integrator = {
  /**
   * Submits your data to generate a checkout ID
   * @param {boolean} isTestMode Determines if you want to hit the test or live environment.
   * @param {string} accessToken Your API token.
   * @param {string} parameters Your parameters, must be in query string parameters format.
   * @returns Promise JSON response object. Needs to be fullfilled.
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

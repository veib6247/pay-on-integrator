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
  submitCopyandPay: async (isTestMode, accessToken, parameters) => {
    // init endPoint var to blank string
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

    // return response, to be fullfilled
    return rawResponse.json()
  },

  /**
   * Fetches the transaction result after CopyandPay redirects to the shopperResultURL.
   * @param {boolean} isTestMode Determines if you want to hit the test or live environment.
   * @param {string} accessToken Your API token.
   * @param {string} entityId Your assigned entity ID provided by your service provider.
   * @param {string} checkoutId The generated checkout ID returned from submitting the initial request.
   * @returns Promise JSON response object. Needs to be fullfilled.
   */
  getPaymentStatus: async (isTestMode, accessToken, entityId, checkoutId) => {
    // init endPoint URL
    let endPoint = ''

    // eval if test or live
    if (isTestMode) {
      endPoint = `https://eu-test.oppwa.com/v1/checkouts/${checkoutId}/payment?entityId=${entityId}`
    } else {
      endPoint = `https://eu-prod.oppwa.com/v1/checkouts/${checkoutId}/payment?entityId=${entityId}`
    }

    const rawResponse = await fetch(endPoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    // return response, to be fullfilled
    return rawResponse.json()
  },
}

export default integrator

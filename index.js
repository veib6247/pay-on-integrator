import fetch from 'node-fetch'
/**
 * main object to handle most of the operations
 */
const integrator = {
  /**
   * Submits the data to the appropriate endpoint depending on the integrationType provided by the user.
   *
   * "CopyAndPay" - Returns a checkout ID that you will need to call the widget.
   * "ServerToServer" - Support synchronous transactions only, does not autodirect to URL from the intermediate response.
   * "threeDSecure" - Standalone 3D Secure transaction request, only returns intermediate response, does not auto-redirect.
   * "TokenizeStandAlone" - Submits data for standalone tokenization in the gateway.
   *
   * @param {string} integrationType The type of integration you want to send the request to. Available options are: ["CopyAndPay", "ServerToServer", "threeDSecure", "TokenizeStandAlone"].
   * @param {string} accessToken Your API token.
   * @param {string} parameters Your parameters, must be in query string parameters format.
   * @param {boolean} isTestMode Determines if you want to hit the test or live environment, defaults to TRUE
   * @returns Promise JSON response object. Needs to be fullfilled.
   */
  submitTransactionRequest: async (
    integrationType,
    accessToken,
    parameters,
    isTestMode = true
  ) => {
    // init sub domain
    let subDomain = ''
    if (isTestMode) {
      subDomain = 'eu-test'
    } else {
      subDomain = 'eu-prod'
    }

    // init URL endpoint
    let endPoint = ''
    switch (integrationType) {
      case 'CopyAndPay':
        endPoint = `https://${subDomain}.oppwa.com/v1/checkouts`
        break
      case 'ServerToServer':
        endPoint = `https://${subDomain}.oppwa.com/v1/payments`
        break
      case 'threeDSecure':
        endPoint = `https://${subDomain}.oppwa.com/v1/threeDSecure`
        break
      case 'TokenizeStandAlone':
        endPoint = `https://${subDomain}.oppwa.com/v1/registrations`
        break

      // display error to user in case type is not within scope
      default:
        let error = `The Integration Type "${integrationType}" is not recognized. Please choose only from the following: ["CopyAndPay", "ServerToServer", "threeDSecure", "TokenizeStandAlone"]`

        console.error(error)
        return error
    }

    // le fetch
    const rawResponse = await fetch(endPoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken}`,
      },
      body: parameters,
    })

    // return response, to be fullfilled
    return await rawResponse.json()
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

    /**
     * eval if test or live
     * notice that we are not putting the entityId in the body
     * just plain old URL params
     */
    if (isTestMode) {
      endPoint = `https://eu-test.oppwa.com/v1/checkouts/${checkoutId}/payment?entityId=${entityId}`
    } else {
      endPoint = `https://eu-prod.oppwa.com/v1/checkouts/${checkoutId}/payment?entityId=${entityId}`
    }

    // fetch but GET method this time
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

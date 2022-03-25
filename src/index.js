import fetch from 'node-fetch'
import { setSubDomain, displayError, isRequired } from './utils/utils.js'

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
   * "Manage" - Submits against existing transaction to Refund, Capture, Reverse, or, Receipt.
   * "Recurring" - Used for subscription type services, use against a registration ID.
   *
   * @param {string} integrationType The type of integration you want to send the request to. Available options are: ["CopyAndPay", "ServerToServer", "threeDSecure", "TokenizeStandAlone", "Manage", "Recurring"].
   * @param {string} accessToken Your API token.
   * @param {string} parameters Your parameters, must be in query string parameters format.
   * @param {string} referenceId Used for transactions that requires a reference ID (usually a registration ID or a previously approved transaction ID). Defaults as blank.
   * @param {boolean} isTestMode Determines if you want to hit the test or live environment, defaults to TRUE
   *
   * @returns {promise} Promise JSON response object. Needs to be fullfilled.
   */
  submitTransactionRequest: async (
    integrationType = isRequired('integrationType'),
    accessToken = isRequired('accessToken'),
    parameters = isRequired('parameters'),
    referenceId = '',
    isTestMode = true
  ) => {
    // init URL endpoint
    let endPoint = ''
    switch (integrationType) {
      case 'CopyAndPay':
        endPoint = `https://${setSubDomain(isTestMode)}.oppwa.com/v1/checkouts`
        break

      case 'ServerToServer':
        endPoint = `https://${setSubDomain(isTestMode)}.oppwa.com/v1/payments`
        break

      case 'threeDSecure':
        endPoint = `https://${setSubDomain(
          isTestMode
        )}.oppwa.com/v1/threeDSecure`
        break

      case 'TokenizeStandAlone':
        endPoint = `https://${setSubDomain(
          isTestMode
        )}.oppwa.com/v1/registrations`
        break

      case 'Manage':
        // eval if user passed a referenceId
        if (referenceId == '') {
          let error = `"referenceId" is required for Integration Type "Manage".`
          console.error(error)

          return error
        } else {
          endPoint = `https://${setSubDomain(
            isTestMode
          )}.oppwa.com/v1/payments/${referenceId}`
        }
        break

      case 'Recurring':
        // eval if user passed a referenceId
        if (referenceId == '') {
          let error = `"referenceId" is required for Integration Type "Recurring".`
          console.error(error)

          return error
        } else {
          endPoint = `https://${setSubDomain(
            isTestMode
          )}.oppwa.com/v1/registrations/${referenceId}/payments`
        }
        break

      // display error to user in case type is not within scope
      default:
        return displayError(
          `The Integration Type "${integrationType}" is not recognized. Please choose only from the following: ["CopyAndPay", "ServerToServer", "threeDSecure", "TokenizeStandAlone", "Manage"]`
        )
    }

    // init http options
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken}`,
      },
      body: parameters,
    }

    // Hit the API, catch errors just in case.
    try {
      // fetch
      const rawResponse = await fetch(endPoint, options)
      // return response, to be fullfilled
      return await rawResponse.json()
    } catch (error) {
      console.error(error)
    }
  },

  /**
   * Fetches the transaction result depending on the type of reference ID
   * @param {string} accessToken Your API token.
   * @param {string} entityId Your assigned entity ID provided by your service provider.
   * @param {string} id The generated checkout ID returned from submitting the initial request.
   * @param {string} idType The type of id you provided. Choices are: ["checkoutId", "paymentId", "merchantTransactionId"]
   * @param {boolean} isTestMode Determines if you want to hit the test or live environment. Defaults to true.
   * @returns {promise} Promise JSON response object. Needs to be fullfilled.
   */
  getPaymentStatus: async (
    accessToken = isRequired('accessToken'),
    entityId = isRequired('entityId'),
    id = isRequired('id'),
    idType = isRequired('idType'),
    isTestMode = true
  ) => {
    // init endPoint URL
    let endPoint = ''
    switch (idType) {
      case 'checkoutId':
        endPoint = `https://${setSubDomain(
          isTestMode
        )}.oppwa.com/v1/checkouts/${id}/payment?entityId=${entityId}`
        break

      case 'paymentId':
        endPoint = `https://${setSubDomain(
          isTestMode
        )}.oppwa.com/v1/query/${id}?entityId=${entityId}`
        break

      case 'merchantTransactionId':
        endPoint = `https://${setSubDomain(
          isTestMode
        )}.oppwa.com/v1/query?entityId=${entityId}&merchantTransactionId=${id}`
        break

      // error handling for unsupported id type
      default:
        return displayError(
          `ID Type "${idType}" is not recognized. Please choose from ["checkoutId", "paymentId", "merchantTransactionId"] only.`
        )
    }

    // init http options
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken}`,
      },
    }

    // fetch but GET method this time
    try {
      const rawResponse = await fetch(endPoint, options)
      // return response, to be fullfilled
      return rawResponse.json()
    } catch (error) {
      console.error(error)
    }
  },

  /**
   * Deletes an existing registration ID from the API
   * @param {string} accessToken Your API token.
   * @param {string} entityId Your assigned entity ID provided by your service provider.
   * @param {string} registrationID The registration ID that you wish to delete.
   * @param {boolean} isTestMode Determines if you want to hit the test or live environment. Defaults to true.
   * @returns {promise} To be fullfilled.
   */
  deleteRegistration: async (
    accessToken = isRequired('accessToken'),
    entityId = isRequired('entityId'),
    registrationID = isRequired('registrationID'),
    isTestMode = true
  ) => {
    // init endpoint
    const endPoint = `https://${setSubDomain(
      isTestMode
    )}.oppwa.com/v1/registrations/${registrationID}?entityId=${entityId}`

    // init options
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken}`,
      },
    }

    // fetch but GET method this time
    try {
      const rawResponse = await fetch(endPoint, options)

      // return response, to be fullfilled
      return rawResponse.json()
    } catch (error) {
      console.error(error)
    }
  },
}

export default integrator

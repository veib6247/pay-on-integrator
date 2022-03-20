/**
 * Utility function to return subdomain string.
 * @param {boolean} isTestMode TRUE for test mode, FALSE for live.
 * @returns {string} Subdomain string.
 */
export const setSubDomain = (isTestMode) => {
  if (isTestMode) {
    return 'eu-test'
  } else {
    return 'eu-prod'
  }
}

/**
 * Nuff said.
 * @param {string} errorMsg The error msg to be displayed.
 */
export const displayError = (errorMsg) => {
  throw new Error(errorMsg)
}

/**
 * Throws an error if the user call a function that didn't put any value on the required params
 */
export const isRequired = (missingParameter) => {
  throw new Error(`"${missingParameter}" is a required field!`)
}

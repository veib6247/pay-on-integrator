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
 * @returns {string} Error message to the user.
 */
export const displayError = (errorMsg) => {
  console.error(errorMsg) // Display log to console in case data isn't being captured.
  return errorMsg
}

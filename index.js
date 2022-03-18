/**
 * takes in the type of integration and parameters
 * @param {string} integrationMode
 */
const payonIntegrator = (integrationMode) => {
  switch (integrationMode) {
    case 'CopyandPay':
      console.log('Oh hey, cnp!')
      break
    default:
      console.log('ahoy!')
      break
  }
}

module.exports = { payonIntegrator }

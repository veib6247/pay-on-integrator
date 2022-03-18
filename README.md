# pay-on-integrator

This library allows you to send transactions to the PAY.ON payment gateway without any hassle! (hopefully).

# Install

`import integrator from 'pay-on-integrator'`

# Functions

## `submitTransactionRequest` - Submits the data to the appropriate endpoint depending on the integrationType provided by the user.

### @param {string} `integrationType` - The type of integration you want to send the request to. Available options below:

- "CopyAndPay" - Returns a checkout ID that you will need to call the widget.
- "ServerToServer" - Support synchronous transactions only, does not autodirect to URL from the intermediate response.
- "threeDSecure" - Standalone 3D Secure transaction request, only returns intermediate response, does not auto-redirect.
- "TokenizeStandAlone" - Submits data for standalone tokenization in the gateway.
- "Manage" - Submits against existing transaction to Refund, Capture, Reverse, or, Receipt.
- "Recurring" - Used for subscription type services, use against a registration ID.

## CopyandPay

Use the `submitTransactionRequest` function to generate a `checkoutId`.

    const testSubmit = async () => {
      const responseData = integrator.submitTransactionRequest(
        'CopyAndPay',
        'OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg=',
        'entityId=8a8294174b7ecb28014b9699220015ca&amount=92.00&currency=EUR&paymentType=DB'
      )

      let response = await responseData

      console.log(response)
    }

    testSubmit()

### Response Sample

    {
      result: { code: '000.200.100', description: 'successfully created checkout' },
      buildNumber: '570fdf3ef2860323b0469c3cefbaa775b1c57500@2022-03-18 04:08:03 +0000',
      timestamp: '2022-03-18 16:25:08+0000',
      ndc: 'DE09D71BCF527F73C99ED9E90A94D98C.uat01-vm-tx02',
      id: 'DE09D71BCF527F73C99ED9E90A94D98C.uat01-vm-tx02'
    }

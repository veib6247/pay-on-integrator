# pay-on-integrator

This library allows you to send transactions to the PAY.ON payment gateway without any hassle! (hopefully).

# Install

`import integrator from 'pay-on-integrator'`

# Usage

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

import $42D0D$nodefetch from "node-fetch";


const $4803ebcc7d901773$export$14800167e7893ba3 = (isTestMode)=>{
    if (isTestMode) return 'eu-test';
    else return 'eu-prod';
};
const $4803ebcc7d901773$export$7e605cc38c3f1d09 = (errorMsg)=>{
    console.error(errorMsg) // Display log to console in case data isn't being captured.
    ;
    return errorMsg;
};


/**
 * main object to handle most of the operations
 */ const $ad4c169ceb31f1fd$var$integrator = {
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
   * @returns Promise JSON response object. Needs to be fullfilled.
   */ submitTransactionRequest: async (integrationType, accessToken, parameters, referenceId = '', isTestMode = true)=>{
        // init URL endpoint
        let endPoint = '';
        switch(integrationType){
            case 'CopyAndPay':
                endPoint = `https://${$4803ebcc7d901773$export$14800167e7893ba3(isTestMode)}.oppwa.com/v1/checkouts`;
                break;
            case 'ServerToServer':
                endPoint = `https://${$4803ebcc7d901773$export$14800167e7893ba3(isTestMode)}.oppwa.com/v1/payments`;
                break;
            case 'threeDSecure':
                endPoint = `https://${$4803ebcc7d901773$export$14800167e7893ba3(isTestMode)}.oppwa.com/v1/threeDSecure`;
                break;
            case 'TokenizeStandAlone':
                endPoint = `https://${$4803ebcc7d901773$export$14800167e7893ba3(isTestMode)}.oppwa.com/v1/registrations`;
                break;
            case 'Manage':
                // eval if user passed a referenceId
                if (referenceId == '') {
                    let error = `"referenceId" is required for Integration Type "Manage".`;
                    console.error(error);
                    return error;
                } else endPoint = `https://${$4803ebcc7d901773$export$14800167e7893ba3(isTestMode)}.oppwa.com/v1/payments/${referenceId}`;
                break;
            case 'Recurring':
                // eval if user passed a referenceId
                if (referenceId == '') {
                    let error = `"referenceId" is required for Integration Type "Recurring".`;
                    console.error(error);
                    return error;
                } else endPoint = `https://${$4803ebcc7d901773$export$14800167e7893ba3(isTestMode)}.oppwa.com/v1/registrations/${referenceId}/payments`;
                break;
            // display error to user in case type is not within scope
            default:
                return $4803ebcc7d901773$export$7e605cc38c3f1d09(`The Integration Type "${integrationType}" is not recognized. Please choose only from the following: ["CopyAndPay", "ServerToServer", "threeDSecure", "TokenizeStandAlone", "Manage"]`);
        }
        // Hit the API, catch errors just in case.
        try {
            // fetch
            const rawResponse = await $42D0D$nodefetch(endPoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${accessToken}`
                },
                body: parameters
            });
            // return response, to be fullfilled
            return await rawResponse.json();
        } catch (error) {
            console.error(error);
        }
    },
    /**
   * Fetches the transaction result depending on the type of reference ID
   * @param {string} accessToken Your API token.
   * @param {string} entityId Your assigned entity ID provided by your service provider.
   * @param {string} id The generated checkout ID returned from submitting the initial request.
   * @param {string} idType The type of id you provided. Choices are: ["checkoutId", "paymentId", "merchantTransactionId"]
   * @param {boolean} isTestMode Determines if you want to hit the test or live environment. Defaults to true.
   * @returns Promise JSON response object. Needs to be fullfilled.
   */ getPaymentStatus: async (accessToken, entityId, id, idType, isTestMode = true)=>{
        // init endPoint URL
        let endPoint = '';
        switch(idType){
            case 'checkoutId':
                endPoint = `https://${$4803ebcc7d901773$export$14800167e7893ba3(isTestMode)}.oppwa.com/v1/checkouts/${id}/payment?entityId=${entityId}`;
                break;
            case 'paymentId':
                endPoint = `https://${$4803ebcc7d901773$export$14800167e7893ba3(isTestMode)}.oppwa.com/v1/query/${id}?entityId=${entityId}`;
                break;
            case 'merchantTransactionId':
                endPoint = `https://${$4803ebcc7d901773$export$14800167e7893ba3(isTestMode)}.oppwa.com/v1/query?entityId=${entityId}&merchantTransactionId=${id}`;
                break;
            // error handling for unsupported id type
            default:
                return $4803ebcc7d901773$export$7e605cc38c3f1d09(`ID Type "${idType}" is not recognized. Please choose from ["checkoutId", "paymentId", "merchantTransactionId"] only.`);
        }
        // fetch but GET method this time
        try {
            const rawResponse = await $42D0D$nodefetch(endPoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${accessToken}`
                }
            });
            // return response, to be fullfilled
            return rawResponse.json();
        } catch (error) {
            console.error(error);
        }
    },
    /**
   * Deletes an existing registration ID from the API
   * @param {string} accessToken Your API token.
   * @param {string} entityId Your assigned entity ID provided by your service provider.
   * @param {string} registrationID The registration ID that you wish to delete.
   * @param {boolean} isTestMode Determines if you want to hit the test or live environment. Defaults to true.
   * @returns
   */ deleteRegistration: async (accessToken, entityId, registrationID, isTestMode = true)=>{
        // init endpoint
        const endPoint = `https://${$4803ebcc7d901773$export$14800167e7893ba3(isTestMode)}.oppwa.com/v1/registrations/${registrationID}?entityId=${entityId}`;
        // fetch but GET method this time
        try {
            const rawResponse = await $42D0D$nodefetch(endPoint, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${accessToken}`
                }
            });
            // return response, to be fullfilled
            return rawResponse.json();
        } catch (error) {
            console.error(error);
        }
    }
};
var $ad4c169ceb31f1fd$export$2e2bcd8739ae039 = $ad4c169ceb31f1fd$var$integrator;


export {$ad4c169ceb31f1fd$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=main.js.map

const { Client, Environment } = require("square")

/*

@param event is an object that contains data on the request
@param context contains the user information when using Identity for user authentication
@param callback is a function we can use to create a response

an event:
{
    "path": "the request path",
    "httpMethod": "HTTP method"
    "headers": {Incoming request headers}
    "queryStringParameters": {query string parameters }
    "body": "A JSON string of the request payload."
    "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encode"
}
*/
exports.handler = async function (event, context) {
  console.log("EVENT:", event)

  const requestParams = JSON.parse(event.body)

  const client = new Client({
    environment:
      process.env.NODE_ENV !== "production" || process.env.NETLIFY_DEV
        ? Environment.Sandbox
        : Environment.Production,
    accessToken: process.env.GATSBY_SQUARE_ACCESS_TOKEN,
  })

  const paymentsApi = client.paymentsApi
  const requestBody = {
    sourceId: requestParams.nonce,
    amountMoney: {
      amount: requestParams.amount,
      currency: requestParams.currencyCode,
    },
    locationId: requestParams.location_id,
    idempotencyKey: requestParams.idempotency_key,
    buyerEmailAddress: requestParams.billingContact.email,
  }

  let myResponse = {
    statusCode: 500,
    body: {},
  }

  try {
    console.log("MY requestBody to SQ API:", requestBody)

    const apiResponse = await paymentsApi.createPayment(requestBody)

    console.log("SQ API RESPONSE: ", apiResponse)
    myResponse.statusCode = apiResponse.statusCode
    myResponse.body = JSON.parse(apiResponse.body)
  } catch (apiError) {
    console.log("SQ API ERROR:", apiError)
    myResponse.body.errors = apiError.errors
    myResponse.statusCode = apiError.statusCode
  }

  myResponse.body = JSON.stringify(myResponse.body)

  console.log("MY RESPONSE", myResponse)
  return myResponse
}

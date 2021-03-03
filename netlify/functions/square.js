const { Client, Environment, ApiError } = require("square")

// Set the Access Token which is used to authorize to a merchant
const { SQUARE_ACCESS_TOKEN, SQUARE_API_ENDPOINT } = process.env

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
  console.log("EVENT:")
  console.log(event)
  console.log("CONTEXT:")
  console.log(context)

  const requestParams = JSON.parse(event.body)

  // Initialized the Square api client:
  //   Set sandbox environment for testing purpose
  //   Set access token
  const client = new Client({
    environment:
      process.env.NODE_ENV === "development"
        ? Environment.Sandbox
        : Environment.Production,
    accessToken: SQUARE_ACCESS_TOKEN,
  })

  // Charge the customer's card
  const paymentsApi = client.paymentsApi
  const requestBody = {
    sourceId: requestParams.nonce,
    amountMoney: {
      amount: requestParams.amount,
      currency: requestParams.currencyCode,
    },
    locationId: requestParams.location_id,
    idempotencyKey: requestParams.idempotency_key,
  }

  let myResponse = {
    statusCode: 200,
    body: {
      title: "",
      result: "unchanged",
      error: "none",
      requestBody: requestBody,
    },
  }

  try {
    const apiRequest = paymentsApi.createPayment(requestBody)
    apiRequest.then(
      (response) => {
        myResponse.statusCode = 200
        myResponse.title = "Payment Successful"
        myResponse.result = response.result
      },
      (error) => {
        myResponse.body.error = error
        myResponse.statusCode = 500
      }
    )
  } catch (error) {
    let errorResult = null

    if (error instanceof ApiError) {
      errorResult = error.errors
    } else {
      errorResult = error
    }

    myResponse.body.error = errorResult
    myResponse.statusCode = 500
  }

  if (myResponse.statusCode !== 200) {
    myResponse.body.title = "Error"
  }

  myResponse.body = JSON.stringify(myResponse.body)

  console.log("MY RESPONSE")
  console.log(myResponse)
  return myResponse
}

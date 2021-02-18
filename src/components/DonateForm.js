import React, { Component } from "react"
import {
  SquarePaymentForm,
  CreditCardNumberInput,
  CreditCardExpirationDateInput,
  CreditCardPostalCodeInput,
  CreditCardCVVInput,
  CreditCardSubmitButton,
} from "react-square-payment-form"
import "react-square-payment-form/lib/default.css"

export const loadSquareSdk = () => {
  return new Promise((resolve, reject) => {
    const sqPaymentScript = document.createElement("script")
    sqPaymentScript.src =
      process.env.SQUARE_API_ENDPOINT ||
      "https://js.squareup.com/v2/paymentform"
    sqPaymentScript.crossorigin = "anonymous"
    sqPaymentScript.onload = () => {
      resolve()
    }
    sqPaymentScript.onerror = () => {
      reject(`Failed to load ${sqPaymentScript.src}`)
    }
    document.getElementsByTagName("head")[0].appendChild(sqPaymentScript)
  })
}

export class DonateForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errorMessages: [],
    }
  }

  cardNonceResponseReceived = (
    errors,
    nonce,
    cardData,
    buyerVerificationToken
  ) => {
    if (errors) {
      this.setState({ errorMessages: errors.map((error) => error.message) })
      return
    }

    this.setState({ errorMessages: [] })
    alert(
      "nonce created: " +
        nonce +
        ", buyerVerificationToken: " +
        buyerVerificationToken
    )
  }

  createVerificationDetails() {
    return {
      amount: "100.00",
      currencyCode: "USD",
      intent: "CHARGE",
      billingContact: {
        familyName: "Smith",
        givenName: "John",
        email: "jsmith@example.com",
        country: "GB",
        city: "London",
        addressLines: ["1235 Emperor's Gate"],
        postalCode: "SW7 4JA",
        phone: "020 7946 0532",
      },
    }
  }

  render() {
    return (
      <div className="columns is-multiline donate-form">
        <div className="row">
          <h1>Support And Make A Difference</h1>
          <p className="subtitle">
            100% of your donation will support the merchant toward their
            operating costs.{" "}
          </p>
          <div className="donate-step-1">
            <h3>Step 1: Select Donation Amount</h3>
          </div>
          <div className="donate-step-2">
            <h3>Step 2: Enter Payment Information</h3>
            <p>
              Your transaction is secure and 100% of the funds will go directly
              to the owner to help sustain their business.
            </p>
            <SquarePaymentForm
              sandbox={true}
              applicationId={process.env.SANDBOX_APPLICATION_ID}
              locationId={process.env.SANDBOX_LOCATION_ID}
              cardNonceResponseReceived={this.cardNonceResponseReceived}
              createVerificationDetails={this.createVerificationDetails}
            >
              <fieldset className="sq-fieldset">
                <CreditCardNumberInput />
                <div className="sq-form-third">
                  <CreditCardCVVInput />
                </div>

                <div className="sq-form-third">
                  <CreditCardExpirationDateInput />
                </div>

                <div className="sq-form-third">
                  <CreditCardPostalCodeInput />
                </div>
              </fieldset>

              <CreditCardSubmitButton>Send</CreditCardSubmitButton>
            </SquarePaymentForm>
            <div className="sq-error-message">
              {this.state.errorMessages.map((errorMessage) => (
                <li key={`sq-error-${errorMessage}`}>{errorMessage}</li>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

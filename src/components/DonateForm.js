import React from "react"
import {
  SquarePaymentForm,
  CreditCardNumberInput,
  CreditCardExpirationDateInput,
  CreditCardPostalCodeInput,
  CreditCardCVVInput,
  CreditCardSubmitButton,
} from "react-square-payment-form"
import "react-square-payment-form/lib/default.css"
import PropTypes from "prop-types"

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

export default class DonateForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errorMessages: [],
    }
  }

  cardNonceResponseReceived(errors, nonce, cardData, buyerVerificationToken) {
    if (errors) {
      this.setState({ errorMessages: errors.map((error) => error.message) })
      return
    }

    this.setState({ errorMessages: [] })
    this.props.cardNonceResponseReceived.call(
      this,
      nonce,
      cardData,
      buyerVerificationToken
    )
  }

  createVerificationDetails() {
    return this.props.createVerificationDetails.bind(this)
  }

  render() {
    return (
      <div>
        <SquarePaymentForm
          sandbox={this.props.sandbox || false}
          applicationId={this.props.applicationId}
          locationId={this.props.locationId}
          cardNonceResponseReceived={this.cardNonceResponseReceived.bind(this)}
          // TODO: more secure: createVerificationDetails={createVerificationDetails}
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

          <p>I agree with the terms and conditions.*</p>

          <CreditCardSubmitButton>Send</CreditCardSubmitButton>
        </SquarePaymentForm>
        <div className="sq-error-message">
          {this.state.errorMessages.map((errorMessage) => (
            <li key={`sq-error-${errorMessage}`}>{errorMessage}</li>
          ))}
        </div>
      </div>
    )
  }
}

DonateForm.propTypes = {
  sandbox: PropTypes.bool,
  applicationId: PropTypes.string.isRequired,
  locationId: PropTypes.string.isRequired,
  cardNonceResponseReceived: PropTypes.func.isRequired,
  // createVerificationDetails: PropTypes.func.isRequired,
}

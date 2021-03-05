import React from "react"
import "./DonateForm.css"
import PropTypes from "prop-types"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import { FaExclamationTriangle, FaRegEnvelope, FaCheck } from "react-icons/fa"

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

const DonateFormSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  lastName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  donationAmount: Yup.string().required("Required"),
})

var paymentForm = null

function onGetCardNonce(event) {
  // Don't submit the form until SqPaymentForm returns with a nonce
  event.preventDefault()
  // Request a nonce from the SqPaymentForm object
  this.paymentForm.requestCardNonce()
}

export default class DonateForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errorMessages: [],
      verificationDetails: {
        amount: 0,
        currencyCode: "USD",
        intent: "CHARGE",
        billingContact: {
          familyName: "BLANK",
          givenName: "BLANK",
          email: "BLANK",
          country: "BLANK",
          city: "BLANK",
          addressLines: ["BLANK"],
          postalCode: "BLANK",
          phone: "BLANK",
        },
      },
    }
  }

  componentDidMount() {
    loadSquareSdk().then(
      () => {
        console.log("loadSquareSdk succeeded")
        this.paymentForm = new SqPaymentForm({
          applicationId: this.props.applicationId,
          locationId: this.props.locationId,
          autoBuild: true,
          inputClass: "sq-input",
          inputStyles: [
            {
              fontSize: "16px",
              lineHeight: "24px",
              padding: "16px",
              placeholderColor: "#a0a0a0",
              backgroundColor: "transparent",
            },
          ],
          cardNumber: {
            elementId: "sq-card-number",
            placeholder: "Card Number",
          },
          cvv: {
            elementId: "sq-cvv",
            placeholder: "CVV",
          },
          expirationDate: {
            elementId: "sq-expiration-date",
            placeholder: "MM/YY",
          },
          postalCode: {
            elementId: "sq-postal-code",
            placeholder: "Postal",
          },
          // SqPaymentForm callback functions
          callbacks: {
            cardNonceResponseReceived: this.cardNonceResponseReceived,
          },
        })
      },
      (error) => {
        console.error("loadSquareSdk failed: ", error)
      }
    )
  }

  cardNonceResponseReceived(
    errors,
    nonce,
    cardData,
    buyerVerificationToken // TODO be more secure
  ) {
    console.log(
      "nonce created: " +
        nonce +
        ", buyerVerificationToken: " +
        buyerVerificationToken
    )
    console.log("cardData")
    console.log(cardData)

    fetch("/.netlify/functions/square", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        Object.assign(
          {
            nonce: nonce,
            idempotency_key: uuidv4(),
            location_id: process.env.SQUARE_LOCATION_ID,
          },
          this.state.verificationDetails
        )
      ),
    })
      .then(async (res) => {
        console.log(res)
        if (!res.ok) {
          const errorInfo = await res.json()
          return await Promise.reject(errorInfo)
        }
        return res.json()
      })
      .then((data) => {
        console.log("THEN with data", data)
      })
      .catch((err) => {
        console.log("PAYMENT ERROR")
        console.error(err)
      })
  }

  handleDonationAmountClick(e, amount) {
    console.log("handleDonationAmountClick")
    e.preventDefault()

    document
      .querySelectorAll(".donation-amount-group .button")
      .forEach((el) => {
        el.classList.remove("is-selected")
        el.classList.remove("is-success")
      })
    e.target.classList.add("is-selected")
    e.target.classList.add("is-success")

    const otherAmountField = document.getElementById("other-input-field")

    if (amount === "other") {
      otherAmountField.classList.remove("is-hidden")
      amount = 0
    } else {
      otherAmountField.classList.add("is-hidden")
    }
    this.setState({ verificationDetails: { amount: amount } })
  }

  handleDonationAmountOtherKeyUp(e) {
    console.log("handleDonationAmountOtherKeyUp")
    e.target.value = e.target.value.replaceAll("/[^0-9.]/ig", "")
    this.setState({ verificationDetails: { amount: e.target.value } })
  }

  handleSubmit(values, actions) {
    console.log("handleSubmit:", values, actions)

    document.getElementById("result-modal").classList.remove("is-hidden")
  }

  render() {
    return (
      <div>
        <Formik
          initialValues={{
            donationAmount: "",
            firstName: "",
            lastName: "",
            email: "",
          }}
          validationSchema={DonateFormSchema}
          onSubmit={(values, actions) => this.handleSubmit(values, actions)}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="field buttons has-addons donation-amount-group">
                <label className="label">Donation Amount</label>
                <button
                  className="button is-outlined"
                  onClick={(e) => this.handleDonationAmountClick(e, 10)}
                >
                  $10
                </button>
                <button
                  className="button is-outlined"
                  onClick={(e) => this.handleDonationAmountClick(e, 25)}
                >
                  $25
                </button>
                <button
                  className="button is-outlined selected"
                  onClick={(e) => this.handleDonationAmountClick(e, 50)}
                >
                  $50
                </button>
                <button
                  className="button is-outlined"
                  onClick={(e) => this.handleDonationAmountClick(e, 100)}
                >
                  $100
                </button>
                <button
                  className="button is-outlined other-button"
                  onClick={(e) => this.handleDonationAmountClick(e, "other")}
                >
                  Other
                </button>
              </div>
              <div id="other-input-field" className="field is-hidden">
                <label className="label">Other Amount:</label>
                <p className="control">
                  <input
                    id="other-input-amount"
                    className="input"
                    type="text"
                    placeholder=""
                    onKeyUp={(e) => this.handleDonationAmountOtherKeyUp(e)}
                  />
                </p>
              </div>

              <div className="field">
                <label className="label">Cardholder Name</label>
                <div className="control">
                  <Field
                    id="firstName"
                    name="firstName"
                    className="input"
                    placeholder="First"
                  />
                </div>
                {touched.firstName && errors.firstName && (
                  <p className="help is-danger">{errors.firstName}</p>
                )}
                <div className="control">
                  <Field
                    id="lastName"
                    name="lastName"
                    className="input"
                    placeholder="Last Name"
                  />
                </div>
                {touched.lastName && errors.lastName && (
                  <p className="help is-danger">{errors.lastName}</p>
                )}
              </div>

              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <Field
                    id="email"
                    name="email"
                    className="input"
                    type="email"
                    placeholder="Email"
                  />
                  {touched.email && errors.email && (
                    <p className="help is-danger">{errors.email}</p>
                  )}
                </div>
              </div>

              <div id="form-container">
                <div className="field">
                  <div id="sq-card-number"></div>
                </div>
                <div className="field">
                  <div id="sq-expiration-date" className="third"></div>
                </div>
                <div className="field">
                  <div id="sq-cvv" className="third"></div>
                </div>
                <div className="field">
                  <div id="sq-postal-code" className="third"></div>
                </div>
                <div className="field">
                  <button
                    id="sq-creditcard"
                    type="submit"
                    className="button button-credit-card"
                    onClick={this.handleSubmit}
                  >
                    {"Donate"}
                    {this.state.verificationDetails.amount > 0 &&
                      " $" + this.state.verificationDetails.amount}
                  </button>
                </div>
              </div>
              <div className="sq-error-message">
                {this.state.errorMessages.map((errorMessage) => (
                  <li key={`sq-error-${errorMessage}`}>{errorMessage}</li>
                ))}
              </div>
            </Form>
          )}
        </Formik>
        <div id="result-modal" className="modal is-hidden">
          <div className="modal-background"></div>
          <div className="modal-content is-error is-hidden">
            We could not process your credit card information. Please check your
            information before trying to submit again.’
          </div>
          <div className="modal-content is-success is-hidden">
            Thank you for supporting {this.props.businessData.name}. You will be
            emailed a receipt of your donation.
          </div>
          <div className="modal-content is-loading">Processing...</div>
          <button className="modal-close is-large" aria-label="close">
            Close
          </button>
        </div>
      </div>
    )
  }
}

DonateForm.propTypes = {
  // sandbox: PropTypes.bool,
  applicationId: PropTypes.string.isRequired,
  locationId: PropTypes.string.isRequired,
  // cardNonceResponseReceived: PropTypes.func.isRequired,
  // createVerificationDetails: PropTypes.func.isRequired,
}

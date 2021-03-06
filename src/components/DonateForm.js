import React from "react"
import "./DonateForm.css"
import PropTypes from "prop-types"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import { FaExclamationTriangle, FaRegEnvelope, FaCheck } from "react-icons/fa"
import { uuidv4 } from "../components/utils"
import _ from "lodash"

export const loadSquareSdk = () => {
  return new Promise((resolve, reject) => {
    const sqPaymentScript = document.createElement("script")
    sqPaymentScript.src =
      process.env.SQUARE_API_ENDPOINT ||
      "https://js.squareup.com/v2/paymentform"
    sqPaymentScript.id = "sq-payment-form-script"
    // sqPaymentScript.crossorigin = "anonymous" // TODO is this needed?
    sqPaymentScript.onload = () => {
      resolve()
    }
    sqPaymentScript.onerror = () => {
      reject(`Failed to load ${sqPaymentScript.src}`)
    }
    document.body.appendChild(sqPaymentScript)
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
})

export default class DonateForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errorMessages: [],
      donationAmountTouched: false,
      isProcessing: false,
    }

    this.verificationDetails = {
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
    }
  }

  componentDidMount() {
    loadSquareSdk().then(
      () => {
        console.log("loadSquareSdk succeeded")
        // eslint-disable-next-line no-undef
        this.paymentForm = new SqPaymentForm({
          applicationId: this.props.applicationId,
          locationId: this.props.locationId,
          autoBuild: false,
          autoFill: true,
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
            placeholder: "• • • •  • • • •  • • • •  • • • •",
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
            placeholder: "12345",
          },
          // SqPaymentForm callback functions
          callbacks: {
            cardNonceResponseReceived: this.cardNonceResponseReceived.bind(
              this
            ),
            /* Optional sq callbacks. See Square documentation.
              createPaymentRequest: props.createPaymentRequest,
              inputEventReceived: props.inputEventReceived,
              methodsSupported,
              paymentFormLoaded,
              shippingContactChanged: props.shippingContactChanged,
              shippingOptionChanged: props.shippingOptionChanged,
              unsupportedBrowserDetected: props.unsupportedBrowserDetected,
            */
          },
        })
        this.paymentForm.build()
      },
      (error) => {
        console.error("loadSquareSdk failed: ", error)
        alert("Failed to load Square SDK")
      }
    )
  }

  cardNonceResponseReceived(
    errors,
    nonce,
    cardData,
    buyerVerificationToken // TODO be more secure
  ) {
    if (errors) {
      this.setState({ errorMessages: errors.map((error) => error.message) })
      return
    } else {
      this.setState({ errorMessages: [] })
    }

    const reqPayload = _.cloneDeep(this.verificationDetails)

    // Square API expects a BIGINT, i.e. multiple a decimal amount by 100 to eliminate the decimal point.
    reqPayload.amount = parseInt(reqPayload.amount) * 100

    fetch("/.netlify/functions/square", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        _.merge(
          {
            nonce: nonce,
            idempotency_key: uuidv4(),
            location_id: process.env.SQUARE_LOCATION_ID,
          },
          reqPayload
        )
      ),
    })
      .catch((err) => {
        alert("Network error: " + err)
      })
      .then(async (res) => {
        if (!res.ok) {
          const errorInfo = await res.json()
          return await Promise.reject(errorInfo)
        }
        return res.json()
      })
      .then((data) => {
        console.log("PAYMENT Success")
        console.log(data)
        console.log(
          "Payment complete successfully!\nCheck browser developer console for more details"
        )
      })
      .catch((err) => {
        console.log("PAYMENT ERROR")
        console.error(err)
      })
  }

  handleDonationAmountClick(e, amount) {
    e.preventDefault()

    document
      .querySelectorAll(".donation-amount-group .button")
      .forEach((el) => {
        if (el === e.target) {
          e.target.classList.add("is-selected")
          e.target.classList.add("is-success")
        } else {
          el.classList.remove("is-selected")
          el.classList.remove("is-success")
        }
      })

    const otherAmountField = document.getElementById("other-input-field")
    const otherAmountInput = document.getElementById("other-input-amount")

    if (amount === "other") {
      otherAmountField.classList.remove("is-hidden")
      amount = otherAmountInput.value || 0
    } else {
      otherAmountField.classList.add("is-hidden")
    }

    otherAmountInput.value = amount
    this.setState({
      donationAmountTouched: true,
    })
    this.verificationDetails.amount = amount
  }

  handleDonationAmountOtherBlur(e) {
    e.target.value = e.target.value.replaceAll(/[^0-9.]/gi, "").trim()
    e.target.value = e.target.value.replaceAll(/\..*$/gi, "")
    this.verificationDetails.amount = e.target.value
  }

  handleSubmit(values, actions) {
    console.log("handleSubmit:", values)

    this.verificationDetails = _.merge(this.verificationDetails, {
      billingContact: {
        familyName: values.lastName,
        givenName: values.firstName,
        email: values.email,
      },
    })
    this.paymentForm.requestCardNonce()
  }

  render() {
    return (
      <div>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
          }}
          validationSchema={DonateFormSchema}
          onSubmit={this.handleSubmit.bind(this)}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="field buttons has-addons donation-amount-group">
                <label className="label">Donation Amount</label>
                <button
                  className="button is-outlined"
                  onClick={(e) => this.handleDonationAmountClick(e, 10.0)}
                >
                  $10
                </button>
                <button
                  className="button is-outlined"
                  onClick={(e) => this.handleDonationAmountClick(e, 25.0)}
                >
                  $25
                </button>
                <button
                  className="button is-outlined"
                  onClick={(e) => this.handleDonationAmountClick(e, 50.0)}
                >
                  $50
                </button>
                <button
                  className="button is-outlined"
                  onClick={(e) => this.handleDonationAmountClick(e, 100.0)}
                >
                  $100
                </button>
                <button
                  className="button is-outlined other-button"
                  onClick={(e) => this.handleDonationAmountClick(e, "other")}
                >
                  Other
                </button>
                {this.state.donationAmountTouched &&
                  !this.verificationDetails.amount > 0 && (
                    <p className="help is-danger">Enter a valid amount</p>
                  )}
              </div>
              <div id="other-input-field" className="field is-hidden">
                <label className="label">Other Amount:</label>
                <p className="control">
                  <input
                    id="other-input-amount"
                    className="input"
                    type="text"
                    placeholder=""
                    onClick={(e) => {}}
                    onBlur={(e) => {
                      console.log("onBlur")
                      this.handleDonationAmountOtherBlur.call(this, e)
                    }}
                    onKeyUp={(e) => {}}
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
                <div className="sq-error-message field">
                  {this.state.errorMessages.map((errorMessage) => (
                    <li key={`sq-error-${errorMessage}`}>{errorMessage}</li>
                  ))}
                </div>
                <div className="field">
                  <p>I agree with the terms and conditions.*</p>
                </div>
                <div className="field">
                  <button
                    id="sq-creditcard"
                    type="submit"
                    className="button button-credit-card"
                  >
                    {"Donate"}
                    {this.verificationDetails.amount > 0 &&
                      " $" + this.verificationDetails.amount}
                  </button>
                </div>
                <div className="field">
                  <p className="footnote">
                    * By proceeding with your transaction, you understand that
                    you are making a donation to {this.props.businessData.name}.
                    No goods or services were exchanged for this donation.
                  </p>
                </div>
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
  applicationId: PropTypes.string.isRequired,
  locationId: PropTypes.string.isRequired,
}

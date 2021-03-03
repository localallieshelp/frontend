import React from "react"
import * as PropTypes from "prop-types"
import TagList from "../components/TagList"
import menuTree from "../data/menuTree"
import { select, uuidv4 } from "../components/utils"
import { graphql, Link } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO/SEO"
import Content, { HTMLContent } from "../components/Content"
import { FormattedMessage } from "react-intl"
import DonateForm from "../components/DonateForm"
import {
  FaExclamationTriangle,
  FaRegEnvelope,
  FaCheck,
  FaUser,
} from "react-icons/fa"

const DonatePageTemplate = ({
  title,
  content,
  contentComponent,
  description,
  tags,
  langKey,
  image,
  businessData,
}) => {
  const PageContent = contentComponent || Content
  const sel = select(langKey)

  let verificationDetails = {
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

  const cardNonceResponseReceived = (
    nonce,
    cardData,
    buyerVerificationToken // TODO be more secure
  ) => {
    console.log(
      "nonce created: " +
        nonce +
        ", buyerVerificationToken: " +
        buyerVerificationToken
    )
    console.log("cardData")
    console.log(cardData)

    document.getElementById("result-modal").classList.remove("is-hidden")

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
          verificationDetails
        )
      ),
    })
      .catch((error) => {
        console.error(error)
        alert("Network error: " + error)
      })
      .then((res) => {
        console.log(res)
        if (!res.ok) {
          return res.json().then((errorInfo) => Promise.reject(errorInfo))
        }
        return res.json()
      })
      .catch((err) => {
        console.log("PAYMENT ERROR")
        console.error(err)
      })
  }

  const handleDonationAmountButtonClick = (e, amount) => {
    console.log("handleDonationAmountButtonClick", amount)
    e.preventDefault()

    const otherAmountField = document.getElementById("other-input-field")
    if (e.currentTarget.id === "other-button") {
      otherAmountField.classList.remove("is-hidden")
    } else {
      otherAmountField.classList.add("is-hidden")
    }
    verificationDetails.amount = amount
  }

  const handleDonationAmountButtonBlur = (e) => {
    e.preventDefault()
  }

  const handleFormKeyUp = (e) => {
    if (e.target.id === "first-name" || e.target.id == "last-name") {
      e.target.value = e.target.value.trim()
      if (e.target.value.length < 3) {
        // UI error
        return false
      }

      if (e.target.id === "first-name") {
        verificationDetails.billingContact.givenName = e.target.value
      } else {
        verificationDetails.billingContact.familyName = e.target.value
      }
    } else if (e.target.id === "email") {
      e.target.value = e.target.value.trim()
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(e.target.value)) {
        // UI error
        return false
      }

      verificationDetails.billingContact.email = e.target.value
    }
  }

  return (
    <div className="content">
      <div className="columns is-multiline padded-width-container donate-form">
        <div className="column is-full">
          {businessData.name ? (
            <h1>Donation for {businessData.name + " "}</h1>
          ) : (
            <h1>Support Your Local Community</h1>
          )}

          <p className="subtitle">
            100% of your support will go to the small business toward their
            operating costs. Your transaction is secure, encrypted and directly
            goes to the owner for sustaining their business.{" "}
          </p>
        </div>

        <div className="column is-full donate-step-1">
          <div>
            <h3>Step 1: Select Donation Amount</h3>
          </div>

          <div className="field is-grouped">
            <button
              className="button is-primary is-outlined"
              onClick={(e) => handleDonationAmountButtonClick(e, 10)}
              onBlur={(e) => handleDonationAmountButtonBlur(e)}
            >
              $10
            </button>
            <button
              className="button is-primary is-outlined"
              onClick={(e) => handleDonationAmountButtonClick(e, 25)}
              onBlur={(e) => handleDonationAmountButtonBlur(e)}
            >
              $25
            </button>
            <button
              className="button is-primary is-outlined"
              onClick={(e) => handleDonationAmountButtonClick(e, 50)}
              onBlur={(e) => handleDonationAmountButtonBlur(e)}
            >
              $50
            </button>
            <button
              className="button is-primary is-outlined"
              onClick={(e) => handleDonationAmountButtonClick(e, 100)}
              onBlur={(e) => handleDonationAmountButtonBlur(e)}
            >
              $100
            </button>
            <button // Todo Other
              id="other-button"
              className="button is-primary is-outlined other-button is-hidden"
            >
              Other
            </button>
          </div>
          {/* TODO: add "Other" amount field */}
          <div id="other-input-field" className="field is-hidden">
            <label className="label">Other:</label>
            <p className="control">
              <input
                id="other-input-amount"
                className="input"
                type="text"
                placeholder=""
              />
            </p>
          </div>
        </div>

        <div className="column is-full donate-step-2">
          <h3>Step 2: Enter Payment Information</h3>

          <div className="columns is-full">
            <div className="column is-half">
              <div className="field">
                <label className="label">Cardholder Name</label>
                <div className="control has-icons-right">
                  <input
                    id="first-name"
                    name="first-name"
                    className="input"
                    type="text"
                    placeholder="First"
                    onKeyUp={(e) => handleFormKeyUp(e)}
                  />
                  <span className="icon is-small is-right is-hidden">
                    <FaExclamationTriangle />
                  </span>
                  <span className="icon is-small is-right is-hidden">
                    <FaCheck />
                  </span>
                </div>
                <div className="control has-icons-right">
                  <input
                    id="last-name"
                    name="last-name"
                    className="input"
                    type="text"
                    placeholder="Last"
                    onKeyUp={(e) => handleFormKeyUp(e)}
                  />
                  <span className="icon is-small is-right is-hidden">
                    <FaExclamationTriangle />
                  </span>
                  <span className="icon is-small is-right is-hidden">
                    <FaCheck />
                  </span>
                </div>
                <p className="help is-danger is-hidden">
                  Please enter a valid name
                </p>
              </div>

              <div className="field">
                <label className="label">Email</label>
                <div className="control has-icons-left has-icons-right">
                  <input
                    id="email"
                    name="email"
                    className="input"
                    type="email"
                    placeholder="Email"
                    onKeyUp={(e) => handleFormKeyUp(e)}
                  />
                  <p className="help is-danger is-hidden">
                    Please enter a valid email address
                  </p>
                  <span className="icon is-small is-left">
                    <FaRegEnvelope />
                  </span>
                  <span className="icon is-small is-right is-hidden">
                    <FaExclamationTriangle />
                  </span>
                  <span className="icon is-small is-right is-hidden">
                    <FaCheck />
                  </span>
                </div>
              </div>
            </div>
            <div className="column donate-cc">
              <DonateForm
                sandbox={true}
                applicationId={process.env.SQUARE_APPLICATION_ID}
                locationId={process.env.SQUARE_LOCATION_ID}
                cardNonceResponseReceived={cardNonceResponseReceived}
                // createVerificationDetails={createVerificationDetails}
              ></DonateForm>
              <p className="footnote">
                * By proceeding with your transaction, you understand that you
                are making a donation to {businessData.name}. No goods or
                services were exchanged for this donation.
              </p>
            </div>
          </div>
        </div>

        <section className="section">
          <PageContent className="content" content={content} />
          <TagList tags={tags} langKey={langKey} />
        </section>

        <div id="result-modal" className="modal is-hidden">
          <div className="modal-background"></div>
          <div className="modal-content is-error is-hidden">
            We could not process your credit card information. Please check your
            information before trying to submit again.’
          </div>
          <div className="modal-content is-success is-hidden">
            Thank you for supporting {businessData.name}. You will be emailed a
            receipt of your donation.
          </div>
          <div className="modal-content is-loading">Processing...</div>
          <button className="modal-close is-large" aria-label="close">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

class DonatePage extends React.Component {
  render() {
    console.log(this.props)
    let dataMarkdown = []
    let data
    if (this.props.data !== null) {
      dataMarkdown = this.props.data.markdownRemark
      data = this.props.data
    }
    const jsonData = data.allArticlesJson.edges[0].node.articles
    const { frontmatter } = dataMarkdown
    const image = frontmatter.image.childImageSharp.fluid.src
    const langKey = frontmatter.lang
    const tags = frontmatter.tags

    const searchParams = new URLSearchParams(this.props.location.search)
    let businessData = {
      name: searchParams.get("b") || "",
    }

    return (
      <Layout
        className="container"
        data={data}
        jsonData={jsonData}
        location={this.props.location}
      >
        <SEO frontmatter={frontmatter} postImage={image} />
        <div>
          <DonatePageTemplate
            title={dataMarkdown.frontmatter.title}
            content={dataMarkdown.html}
            contentComponent={HTMLContent}
            description={frontmatter.description}
            tags={tags}
            langKey={langKey}
            image={dataMarkdown.frontmatter.image}
            businessData={businessData}
          />
        </div>
      </Layout>
    )
  }
}

DonatePage.propTypes = {
  data: PropTypes.object.isRequired,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
  langKey: PropTypes.string,
}

export default DonatePage

export const pageQuery = graphql`
  query DonatePageQuery($id: String!) {
    site {
      siteMetadata {
        languages {
          defaultLangKey
          langs
        }
      }
    }
    allArticlesJson(filter: { title: { eq: "home" } }) {
      edges {
        node {
          articles {
            en
            cn
          }
        }
      }
    }
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        id
        title
        description
        tags
        lang
        image {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 100) {
              ...GatsbyImageSharpFluid
              src
            }
          }
        }
      }
      fields {
        slug
      }
    }
  }
`

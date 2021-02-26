import React from "react"
import * as PropTypes from "prop-types"
import TagList from "../components/TagList"
import menuTree from "../data/menuTree"
import select from "../components/utils"
import { graphql, Link } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO/SEO"
import Content, { HTMLContent } from "../components/Content"
import { FormattedMessage } from "react-intl"
import DonateForm from "../components/DonateForm"
import { FaExclamationTriangle, FaRegEnvelope } from "react-icons/fa"

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

  // TODO payment send handler logic
  const cardNonceResponseReceivedHandler = () => (
    errors,
    nonce,
    cardData,
    buyerVerificationToken
  ) => {
    alert(
      "nonce created: " +
        nonce +
        ", buyerVerificationToken: " +
        buyerVerificationToken
    )
  }

  const createVerificationDetails = () => {
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

  const donationAmountClickHandler = (e) => {
    e.preventDefault()
    const otherAmountField = document.getElementById("other-input-field")
    if (e.currentTarget.id === "other-button") {
      otherAmountField.classList.remove("is-hidden")
    } else {
      otherAmountField.classList.add("is-hidden")
    }
  }

  const submitButtonHandler = (e) => {
    e.preventDefault()
    document.getElementById("result-modal").classList.remove("is-hidden")
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
              onClick={(e) => donationAmountClickHandler(e)}
            >
              $10
            </button>
            <button
              className="button is-primary is-outlined"
              onClick={(e) => donationAmountClickHandler(e)}
            >
              $25
            </button>
            <button
              className="button is-primary is-outlined"
              onClick={(e) => donationAmountClickHandler(e)}
            >
              $50
            </button>
            <button
              className="button is-primary is-outlined"
              onClick={(e) => donationAmountClickHandler(e)}
            >
              $100
            </button>
            <button
              id="other-button"
              className="button is-primary is-outlined other-button"
              onClick={(e) => donationAmountClickHandler(e)}
            >
              Other
            </button>
          </div>
          <div id="other-input-field" className="field is-hidden">
            <label className="label">Other:</label>
            <p className="control">
              <input className="input" type="text" placeholder="" />
            </p>
          </div>
        </div>

        <div className="column is-full donate-step-2">
          <h3>Step 2: Enter Payment Information</h3>

          <div className="columns is-full">
            <div className="column is-half">
              <div className="field">
                <label className="label">Cardholder Name</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="First Last"
                  />
                </div>

                <div className="field">
                  <label className="label">Email</label>
                  <div className="control has-icons-left has-icons-right">
                    <input
                      className="input is-danger"
                      type="email"
                      placeholder="Email"
                    />
                    <span className="icon is-small is-left">
                      <FaRegEnvelope />
                    </span>
                    <span className="icon is-small is-right">
                      <FaExclamationTriangle />
                    </span>
                  </div>
                  <p className="help is-danger">This email is invalid</p>
                </div>
              </div>
            </div>
            <div className="column donate-cc">
              <DonateForm
                sandbox={true}
                applicationId={process.env.SQUARE_APPLICATION_ID}
                locationId={process.env.SQUARE_LOCATION_ID}
                cardNonceResponseReceivedHandler={
                  cardNonceResponseReceivedHandler // TODO
                }
                createVerificationDetails={createVerificationDetails}
                submitButtonHandler={submitButtonHandler}
              ></DonateForm>
              <p className="footnote">
                * By proceeding with your transaction, you understand that you
                are making a donation to {businessData.name}. No goods or
                services were exchanged for this donation.
              </p>
            </div>
            <div id="result-modal" className="modal is-hidden">
              <div className="modal-background"></div>
              <div className="modal-content">my conent</div>
              <button
                className="modal-close is-large"
                aria-label="close"
              ></button>
            </div>
          </div>
        </div>

        <section className="section">
          <PageContent className="content" content={content} />
          <TagList tags={tags} langKey={langKey} />
        </section>
      </div>
    </div>
  )
}

DonatePageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
  businessData: PropTypes.object,
}

class DonatePage extends React.Component {
  render() {
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

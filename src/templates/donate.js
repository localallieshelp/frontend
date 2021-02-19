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

const DonatePageTemplate = ({
  title,
  content,
  contentComponent,
  description,
  tags,
  langKey,
  image,
  businessName,
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

  return (
    <div className="content">
      <div className="columns is-multiline padded-width-container donate-form">
        <div className="column is-full">
          <h1>Support {businessName + " "}And Make A Difference</h1>
          <p className="subtitle">
            100% of your donation will support the merchant toward their
            operating costs.{" "}
          </p>
        </div>

        <div className="column is-full donate-step-1">
          <div>
            <h3>Step 1: Select Donation Amount</h3>
          </div>

          <div className="field is-grouped">
            <button className="button is-primary is-outlined">$1</button>
            <button className="button is-primary is-outlined">$5</button>
            <button className="button is-primary is-outlined">$10</button>
            <button className="button is-primary is-outlined">$25</button>
            <button className="button is-primary is-outlined">$50</button>
          </div>
          <div className="field">
            <label className="label">Other:</label>
            <p className="control">
              <input className="input" type="text" placeholder="10" />
            </p>
          </div>
        </div>

        <div className="column is-full donate-step-2">
          <h3>Step 2: Enter Payment Information</h3>
          <p>
            Your transaction is secure and 100% of the funds will go directly to
            the owner to help sustain their business.
          </p>

          <div className="columns is-full">
            <div className="column is-half">
              <div className="field">
                <label className="label">Cardholder's Name</label>
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
                      value=""
                    />
                    <span className="icon is-small is-left">
                      <i className="fas fa-envelope"></i>
                    </span>
                    <span className="icon is-small is-right">
                      <i className="fas fa-exclamation-triangle"></i>
                    </span>
                  </div>
                  <p className="help is-danger">This email is invalid</p>
                </div>
              </div>
            </div>
            <div className="column">
              <DonateForm
                sandbox={true}
                applicationId={process.env.SQUARE_APPLICATION_ID}
                locationId={process.env.SQUARE_LOCATION_ID}
                cardNonceResponseReceivedHandler={
                  cardNonceResponseReceivedHandler // TODO
                }
                createVerificationDetails={createVerificationDetails}
              ></DonateForm>
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

    // TODO get business name whose Donate button user clicked.
    let businessName = this.props.businessName || ""

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
            businessName={businessName}
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

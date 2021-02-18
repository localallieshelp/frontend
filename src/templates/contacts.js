import React from "react"
import * as PropTypes from "prop-types"
import { graphql } from "gatsby"
import { navigate } from "gatsby-link"
import Layout from "../components/Layout"
import SEO from "../components/SEO/SEO"
import Content, { HTMLContent } from "../components/Content"
import { getCurrentLangKey } from "ptz-i18n"
import { FormattedMessage } from "react-intl"

function encode(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&")
}

function setActionPath(langKey) {
  let path
  if (langKey === "en") {
    path = "/en/contact/thanks/"
  } else {
    path = "/cn/contact/thanks/"
  }
  return path
}

const ContactPageTemplate = ({
  title,
  content,
  contentComponent,
  image,
  address,
  phone,
  email,
  form,
  options,
  handleSubmit,
  handleChange,
  action,
}) => {
  const PageContent = contentComponent || Content
  return (
    <section className="section contact">
      <div className="container">
        <div className="content">
          <h1 className="title">{title}</h1>
          <div className="options">
            <div className="grid-section">
              <div>
                <img src={options.one.image1.image.childImageSharp.fluid.src} />
              </div>
              <div>
                <h2>{options.one.title}</h2>
                <p>{options.one.description}</p>
              </div>
            </div>
            <div className="grid-section">
              <div>
                <img src={options.two.image1.image.childImageSharp.fluid.src} />
              </div>
              <div>
                <h2>{options.two.title}</h2>
                <p>{options.two.description}</p>
              </div>
            </div>
            <div className="grid-section">
              <div>
                <img src={options.three.image1.image.childImageSharp.fluid.src} />
              </div>
              <div>
                <h2>{options.three.title}</h2>
                <p>{options.three.description}</p>
              </div>
            </div>
          </div>
          <div className="box">
            <h3 className="form-title">{form.title}</h3>
            <p>{form.subtitle}</p>
            <form
              name="contact"
              method="post"
              action={action}
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
            >
              {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
              <input type="hidden" name="form-name" value="contact" />
              <div hidden>
                <label>
                  Don’t fill this out:{" "}
                  <input name="bot-field" onChange={handleChange} />
                </label>
              </div>
              <div className="field">
                <label className="label" htmlFor="name">
                  <FormattedMessage id="contact.name" />
                </label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="name"
                    onChange={handleChange}
                    id="name"
                    required={true}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="email">
                  <FormattedMessage id="contact.email" />
                </label>
                <div className="control">
                  <input
                    className="input"
                    type="email"
                    name="email"
                    onChange={handleChange}
                    id="email"
                    required={true}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="subject">
                  <FormattedMessage id="contact.subject" />
                </label>
                <div className="control">
                  <input
                    className="input"
                    type="subject"
                    name="subject"
                    onChange={handleChange}
                    id="subject"
                    required={true}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="message">
                  <FormattedMessage id="contact.message" />
                </label>
                <div className="control">
                  <textarea
                    className="textarea"
                    name="message"
                    onChange={handleChange}
                    id="message"
                    required={true}
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button className="button is-link" type="submit">
                    <FormattedMessage id="contact.send" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

ContactPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
}

class ContactPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isValidated: false }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const form = e.target
    fetch("/?no-cache=1", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({
        "form-name": form.getAttribute("name"),
        ...this.state,
      }),
    })
      .then(() => navigate(form.getAttribute("action")))
      .catch((error) => alert(error))
  }
  render() {
    let dataMarkdown = []
    let data
    if (this.props.data !== null) {
      dataMarkdown = this.props.data.markdownRemark
      data = this.props.data
    }
    const location = this.props.location
    const url = location.pathname
    const { langs, defaultLangKey } = data.site.siteMetadata.languages
    this.langKey = getCurrentLangKey(langs, defaultLangKey, url)
    const action = setActionPath(this.langKey)
    const jsonData = data.allArticlesJson.edges[0].node.articles
    const address = dataMarkdown.frontmatter.address
    const phone = dataMarkdown.frontmatter.phone
    const email = dataMarkdown.frontmatter.email
    const image = dataMarkdown.frontmatter.image
    const { frontmatter } = dataMarkdown
    const imageSEO = frontmatter.image.childImageSharp.fluid.src
    return (
      <Layout
        className="container"
        data={data}
        jsonData={jsonData}
        location={location}
      >
        <SEO frontmatter={frontmatter} postImage={imageSEO} />

        <div className="container">
          <ContactPageTemplate
            contentComponent={HTMLContent}
            image={image}
            address={address}
            phone={phone}
            email={email}
            form={dataMarkdown.frontmatter.form}
            options={dataMarkdown.frontmatter.options}
            title={dataMarkdown.frontmatter.title}
            content={dataMarkdown.html}
            onSubmit={this.handleSubmit}
            action={action}
          />
        </div>
      </Layout>
    )
  }
}

ContactPage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default ContactPage

export const pageQuery = graphql`
  query ContactPageQuery($id: String!) {
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
        address
        phone
        email
        options {
          one {
            title
            description
            image1 {
              alt
              image {
                childImageSharp {
                  fluid(maxWidth: 2048, quality: 100) {
                    ...GatsbyImageSharpFluid
                    src
                  }
                }
              }
            }
          }
          two {
            title
            description
            image1 {
              alt
              image {
                childImageSharp {
                  fluid(maxWidth: 2048, quality: 100) {
                    ...GatsbyImageSharpFluid
                    src
                  }
                }
              }
            }
          }
          three {
            title
            description
            image1 {
              alt
              image {
                childImageSharp {
                  fluid(maxWidth: 2048, quality: 100) {
                    ...GatsbyImageSharpFluid
                    src
                  }
                }
              }
            }
          }
        }
        form {
          title
          subtitle
        }
      }
      fields {
        slug
      }
    }
  }
`

import React from "react"
import PropTypes from "prop-types"
import Layout from "../components/Layout"
import BlogRoll from "../components/BlogRoll"
import SEO from "../components/SEO/SEO"
import { FormattedMessage } from "react-intl"
import { graphql } from "gatsby"

export default class BusinessIndexPage extends React.Component {
  render() {
    const data = this.props.data
    const location = this.props.location
    const jsonData = data.allArticlesJson.edges[0].node.articles

    return (
      <Layout
        data={data}
        jsonData={jsonData}
        location={location}
        className="blog"
      >
        <SEO frontmatter={data.markdownRemark.frontmatter} />
        <div
          className="padded-width-image margin-top-0"
          style={{
            backgroundImage: `url('/img/business-header.png')`,
            backgroundPosition: `top left`,
            backgroundAttachment: `fixed`,
          }}
        >
          <div
            style={{
              display: "flex",
              height: "150px",
              lineHeight: "1",
              justifyContent: "space-around",
              alignItems: "left",
              flexDirection: "column",
            }}
          >
            <h1
              className="has-text-weight-bold is-size-3-mobile is-size-2-tablet is-size-1-widescreen is-centered animated fadeInDown"
              style={{
                boxShadow:
                  "rgb(255, 68, 0) 0.5rem 0px 0px, rgb(255, 68, 0) -0.5rem 0px 0px",
                backgroundColor: "rgb(255, 68, 0)",
                color: "white",
                lineHeight: "1",
                padding: "0.25em",
              }}
            >
              <FormattedMessage id="blog-message" />
            </h1>
            <h3
              className="is-size-5-mobile is-size-5-tablet is-size-4-widescreen animated fadeInUp"
              style={{
                boxShadow:
                  "rgb(255, 68, 0) 0.5rem 0px 0px, rgb(255, 68, 0) -0.5rem 0px 0px",
                backgroundColor: "rgb(255, 68, 0)",
                color: "white",
                lineHeight: "1",
                padding: "0.25em",
              }}
            >
              {data.markdownRemark.frontmatter.description}
            </h3>
          </div>
        </div>
        <section className="content grid-section ">
          <div clasName="sidebar">
            <h4>Filter By</h4>
          </div>
          <div className="container">
            <h4>{data.markdownRemark.frontmatter.listtitle}</h4>
            <BlogRoll />
          </div>
        </section>
      </Layout>
    )
  }
}

BusinessIndexPage.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
}

export const pageQuery = graphql`
  query BusinessIndex($id: String!) {
    site {
      siteMetadata {
        title
        languages {
          langs
          defaultLangKey
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
      id
      html
      frontmatter {
        id
        title
        description
        listtitle
        tags
        lang
      }
    }
  }
`

import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import SEO from "../components/SEO/SEO"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import Content, { HTMLContent } from "../components/Content"
import TagList from "../components/TagList"

export const BusinessTemplate = ({
  content,
  contentComponent,
  description,
  tags,
  name,
  helmet,
  langKey,
}) => {
  const BusinessContent = contentComponent || Content

  return (
    <section className="section">
      {helmet || ""}
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
              {name}
            </h1>
            <p>{description}</p>
            <BusinessContent content={content} />
            <TagList tags={tags} langKey={langKey} />
          </div>
        </div>
      </div>
    </section>
  )
}

BusinessTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  name: PropTypes.string,
  helmet: PropTypes.object,
  location: PropTypes.string,
  tags: PropTypes.array,
  langKey: PropTypes.string,
}

const Business = ({ data, location }) => {
  const { markdownRemark: business } = data
  const jsonData = data.allBusinessesJson.edges[0].node.businesses
  const langKey = business.frontmatter.lang
  const image = business.frontmatter.image.childImageSharp.fluid.src

  return (
    <Layout
      className="container"
      data={data}
      jsonData={jsonData}
      location={location}
    >
      <SEO frontmatter={business.frontmatter} businessImage={image} />
      <BusinessTemplate
        content={business.html}
        contentComponent={HTMLContent}
        description={business.frontmatter.description}
        helmet={
          <Helmet titleTemplate="%s">
            <title>{`${business.frontmatter.name}`}</title>
            <meta name="name" content={`${business.frontmatter.description}`} />
          </Helmet>
        }
        tags={business.frontmatter.tags}
        name={business.frontmatter.name}
        langKey={langKey}
      />
    </Layout>
  )
}

Business.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
}

export default Business

export const pageQuery = graphql`
  query BusinessByID($id: String!) {
    site {
      siteMetadata {
        title
        languages {
          langs
          defaultLangKey
        }
      }
    }

    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        id
        name
        image {
          childImageSharp {
            fluid(maxWidth: 1380) {
              src
            }
          }
        }
        description
        date
        tags
        lang
      }
    }
  }
`

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

// Todo: There has got to be a better place for this
const SQUARE_APPLICATION_ID = process.env.SQUARE_APPLICATION_ID
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID

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

        <div className="column is-full">
          <DonateForm
            businessData={businessData}
            applicationId={SQUARE_APPLICATION_ID}
            locationId={SQUARE_LOCATION_ID}
            langKey={langKey}
          />
        </div>

        <section className="section">
          <PageContent className="content" content={content} />
          <TagList tags={tags} langKey={langKey} />
        </section>
      </div>
    </div>
  )
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

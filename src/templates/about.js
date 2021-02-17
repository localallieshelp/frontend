import React from "react"
import * as PropTypes from "prop-types"
import TagList from "../components/TagList"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO/SEO"
import Content, { HTMLContent } from "../components/Content"
import TeamImg from "../../static/img/team-image.png"

const AboutPageTemplate = ({
  title,
  copy,
  content,
  contentComponent,
  tags,
  langKey,
  image
}) => {
  const PageContent = contentComponent || Content
  return (
    <div className="content about">
      <div className="padded-width-container">
        <section class="section story">
          <div className="grid-section">
            <div>
              <img src={image.childImageSharp.fluid.src}/>
            </div>
            <div>
              <h3>{title}</h3>
              <p>
                {copy}
              </p>
            </div>
          </div>
        </section>
      </div>
      <div className="padded-width-container">
        <section class="section team">
          <h3>Our Team</h3>
          <div className="grid-section">
            <div className="team-items">
              <img src={TeamImg}></img>
              <h3>Name</h3>
              <p>Title:</p>
            </div>
            <div className="team-items">
              <img src={TeamImg}></img>
              <h3>Name</h3>
              <p>Title:</p>
            </div>
            <div className="team-items">
              <img src={TeamImg}></img>
              <h3>Name</h3>
              <p>Title:</p>
            </div>
            <div className="team-items">
              <img src={TeamImg}></img>
              <h3>Name</h3>
              <p>Title:</p>
            </div>
          </div>
        </section>
      </div>
      <section className="section">
        <PageContent className="container content" content={content} />
        <TagList tags={tags} langKey={langKey} />
      </section>
    </div>
  )
}

AboutPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  copy: PropTypes.string,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
  tags: PropTypes.array,
  langKey: PropTypes.string,
}

class AboutPage extends React.Component {
  render() {
    var dataMarkdown = []
    if (this.props.data !== null) {
      dataMarkdown = this.props.data.markdownRemark
    }
    const jsonData = this.props.data.allArticlesJson.edges[0].node.articles
    const { frontmatter } = dataMarkdown
    const image = frontmatter.image.childImageSharp.fluid.src
    const langKey = frontmatter.lang
    const tags = frontmatter.tags
    return (
      <Layout
        className="container"
        data={this.props.data}
        jsonData={jsonData}
        location={this.props.location}
      >
        <SEO frontmatter={frontmatter} postImage={image} />
        <div>
          <AboutPageTemplate
            contentComponent={HTMLContent}
            title={dataMarkdown.frontmatter.title}
            copy={dataMarkdown.frontmatter.copy}
            image={dataMarkdown.frontmatter.image}
            content={dataMarkdown.html}
            tags={tags}
            langKey={langKey}
          />
        </div>
      </Layout>
    )
  }
}

AboutPage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default AboutPage

export const pageQuery = graphql`
  query AboutPageQuery($id: String!) {
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
            it
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
        copy
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

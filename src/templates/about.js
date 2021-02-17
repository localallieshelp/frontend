import React from "react"
import * as PropTypes from "prop-types"
import TagList from "../components/TagList"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO/SEO"
import Content, { HTMLContent } from "../components/Content"

const AboutPageTemplate = ({
  title,
  content,
  contentComponent,
  tags,
  langKey,
}) => {
  const PageContent = contentComponent || Content
  return (
    <div className="content about">
      <div className="padded-width-container">
        <section className="section story">
          <div className="grid-section">
            <div>
              <img />
            </div>
            <div>
              <h3>Our Story</h3>
              <p>
                Local Allies was created to help independent small businesses be
                equipped with the tools to thrive in a quickly-changing digital
                and difficult landscape. Throughout the COVID-19 pandemic, we
                witnessed volunteers from across the nation create donation
                campaigns and provide assistance in any way they could from
                creating social media groups made to uplift small merchants to
                those regularly buying takeout meals from local mom-and-pop
                restaurants.
              </p>
              <p>
                Inspired by these acts of compassion, we set out to create the
                volunteer-led Local Allies program to set up a sustainable next
                step for small businesses in need. This includes a specialized
                website that provides a free hub to input their small business
                information; create donation programs where all funds go back to
                the business; and a helpful staff of experienced volunteers of
                marketers, translators, and web developers to provide
                complimentary consultation and suggestions on other ways to
                help.*
                <p>
                  Special thanks to Send Chinatown Love and the Little Tokyo
                  Service Center for their inspiration and assistance!
                </p>
                <p>
                  *Please note, in order to best help those business owners most
                  in need, only small, non-franchised businesses of less than 50
                  employees with little to no digital/social media presence may
                  participate. If you do not qualify, we will still be glad to
                  help direct you to other services for additional assistance.
                </p>
                <p>Get Involved</p>
                <p>
                  +Interested in participating? Please email jwie@alumni.usc.edu
                  with your small business name, contact information, and any
                  other helpful information about yourself and your small
                  business. We’ll get back to you as soon as we can.
                </p>
                <p>
                  +Know of a small business that may need our help? Please email
                  jwie@alumni.usc.edu with the small business’ name and contact
                  information (if available) including a short 2-3 sentences on
                  why they may need assistance.
                </p>
                <p>
                  +Want to join our team of volunteers? We’re actively looking
                  for translators, digital/social media marketers, accountants,
                  web developers, and web designers! Email jwie@alumni.usc.edu
                  with your name, email address, and a short resume, LinkedIn,
                  or list of skill sets, and we’ll get back to you with further
                  details.
                </p>
              </p>
            </div>
          </div>
        </section>
      </div>
      <div className="padded-width-container">
        <section className="section team">
          <h3>Our Team</h3>
          <div className="grid-section">
            <div className="team-items">
              <img></img>
              <h3>Name</h3>
              <p>Title:</p>
            </div>
            <div className="team-items">
              <img></img>
              <h3>Name</h3>
              <p>Title:</p>
            </div>
            <div className="team-items">
              <img></img>
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

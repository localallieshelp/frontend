import React from "react"
import * as PropTypes from "prop-types"
import TagList from "../components/TagList"
import menuTree from "../data/menuTree"
import select from "../components/utils"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO/SEO"
import Content, { HTMLContent } from "../components/Content"
import MobileImg from "../../static/img/story-image-mobile.png"

const AboutPageTemplate = ({
  title,
  copy,
  copytwo,
  copythree,
  copyfour,
  team,
  content,
  contentComponent,
  tags,
  langKey,
  image,
}) => {
  const PageContent = contentComponent || Content
  const sel = select(langKey)

  return (
    <div className="content about">
      <div className="padded-width-container">
        <section className="section story">
          <div className="grid-section">
            <div>
              <img
                src={image.childImageSharp.fluid.src}
                className="animated fadeInLeft"
              />
              <img 
                src={MobileImg}
                className="animated fadeInLeft mobile"
              />
            </div>
            <div>
              <h3 className="animated fadeIn">{title}</h3>
              <p className="animated slideInUp">
                {copy}
                <br />
                <br />
                {copytwo}
                <br />
                <br />
                {copythree}
                <br />
                <br />
                {copyfour}
                <br />
                <br />
                Have Questions? Want to Get Involved?
                <a href={"/" + langKey + "/" + menuTree.contact[sel] + "/"}>
                  Click here{" "}
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
      <div className="padded-width-container">
        <section className="section team">
          <h3>{team.title}</h3>
          <div className="grid-section">
            <div className="team-items">
              <img
                src={team.member1.image1.image.childImageSharp.fluid.src}
              ></img>
              <h3>{team.member1.name}</h3>
              <p>{team.member1.title}</p>
            </div>
            <div className="team-items">
              <img
                src={team.member2.image1.image.childImageSharp.fluid.src}
              ></img>
              <h3>{team.member2.name}</h3>
              <p>{team.member2.title}</p>
            </div>
            <div className="team-items">
              <img
                src={team.member3.image1.image.childImageSharp.fluid.src}
              ></img>
              <h3>{team.member3.name}</h3>
              <p>{team.member3.title}</p>
            </div>
            <div className="team-items">
              <img
                src={team.member4.image1.image.childImageSharp.fluid.src}
              ></img>
              <h3>{team.member4.name}</h3>
              <p>{team.member4.title}</p>
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
            copytwo={dataMarkdown.frontmatter.copy2}
            copythree={dataMarkdown.frontmatter.copy3}
            copyfour={dataMarkdown.frontmatter.copy4}
            image={dataMarkdown.frontmatter.image}
            team={dataMarkdown.frontmatter.team}
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
        copy2
        copy3
        copy4
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
        team {
          title
          member1 {
            name
            title
            image1 {
              alt
              image {
                childImageSharp {
                  fluid(maxWidth: 500, quality: 90) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
            }
          }
          member2 {
            name
            title
            image1 {
              alt
              image {
                childImageSharp {
                  fluid(maxWidth: 500, quality: 90) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
            }
          }
          member3 {
            name
            title
            image1 {
              alt
              image {
                childImageSharp {
                  fluid(maxWidth: 500, quality: 90) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
            }
          }
          member4 {
            name
            title
            image1 {
              alt
              image {
                childImageSharp {
                  fluid(maxWidth: 500, quality: 90) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
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

import React from "react"
import * as PropTypes from "prop-types"
import TagList from "../components/TagList"
import { graphql, Link } from "gatsby"
import { FormattedMessage } from "react-intl"
import Layout from "../components/Layout"
import SEO from "../components/SEO/SEO"
import Content, { HTMLContent } from "../components/Content"
import select from "../components/utils"
import menuTree from "../data/menuTree"

const HomePageTemplate = ({
  title,
  heading,
  heading2,
  buttontext,
  image,
  main,
  maintwo,
  mainthree,
  content,
  contentComponent,
  tags,
  langKey,
}) => {
  const PageContent = contentComponent || Content
  const sel = select(langKey)

  return (
    <div className="home">
      <div
        className="padded-width-image margin-top-0"
        style={{
          backgroundImage: `url(${
            image.childImageSharp ? image.childImageSharp.fluid.src : image
          })`,
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
            className="has-text-weight-bold is-size-3-mobile is-size-2-tablet is-size-1-widescreen is-centered animated fadeInLeft"
            style={{
              boxShadow:
                "rgb(255, 68, 0) 0.5rem 0px 0px, rgb(255, 68, 0) -0.5rem 0px 0px",
              backgroundColor: "rgb(255, 68, 0)",
              color: "white",
              lineHeight: "1",
              padding: "0.25em",
            }}
          >
            {title}
          </h1>
          <h3
            className="is-size-5-mobile is-size-5-tablet is-size-4-widescreen animated fadeInLeft"
            style={{
              boxShadow:
                "rgb(255, 68, 0) 0.5rem 0px 0px, rgb(255, 68, 0) -0.5rem 0px 0px",
              backgroundColor: "rgb(255, 68, 0)",
              color: "white",
              lineHeight: "1",
              padding: "0.25em",
            }}
          >
            {heading}
            <br />
            <br />
            <span>{heading2}</span>
          </h3>
          <div className="animated fadeInLeft buttondiv">
            <Link
              className="button"
              to={"/" + langKey + "/" + menuTree.business[sel]}
            >
              <FormattedMessage id="view_local_business_hub" />
            </Link>
          </div>
        </div>
      </div>
      <div className="padded-width-container">
        <section className="section initiative">
          <h3>{main.title}</h3>
          <div className="grid-section">
            <div className="initiative-items">
              <img src={main.image1.image.childImageSharp.fluid.src}></img>
              <h3>{main.subtitle}</h3>
              <p>{main.description}</p>
              <a href={main.link}>
                <button className="button">{main.buttontext}</button>
              </a>
            </div>
            <div className="initiative-items">
              <img src={maintwo.image1.image.childImageSharp.fluid.src}></img>
              <h3>{maintwo.subtitle}</h3>
              <p>{maintwo.description}</p>
              <a href={maintwo.link}>
                <button className="button">{maintwo.buttontext}</button>
              </a>
            </div>
            <div className="initiative-items">
              <img src={mainthree.image1.image.childImageSharp.fluid.src}></img>
              <h3>{mainthree.subtitle}</h3>
              <p>{mainthree.description}</p>
              <a href={mainthree.link}>
                <button className="button">{mainthree.buttontext}</button>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

HomePageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  heading: PropTypes.string,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
  tags: PropTypes.array,
  langKey: PropTypes.string,
}

class HomePage extends React.Component {
  render() {
    let data
    let dataMarkdown = []
    if (this.props.data !== null) {
      dataMarkdown = this.props.data.markdownRemark
      data = this.props.data
    }
    const jsonData = data.allArticlesJson.edges[0].node.articles
    const langKey = dataMarkdown.frontmatter.lang
    const { frontmatter } = data.markdownRemark
    const sel = select(langKey)
    const image = frontmatter.image.childImageSharp.fluid.src
    const tags = frontmatter.tags

    return (
      <Layout
        className="content"
        data={this.props.data}
        jsonData={jsonData}
        location={this.props.location}
      >
        <SEO frontmatter={frontmatter} postImage={image} />
        <div>
          <HomePageTemplate
            title={dataMarkdown.frontmatter.mainheading}
            heading={dataMarkdown.frontmatter.heading}
            heading2={dataMarkdown.frontmatter.heading2}
            buttontext={dataMarkdown.frontmatter.buttontext}
            image={dataMarkdown.frontmatter.image}
            main={dataMarkdown.frontmatter.main}
            maintwo={dataMarkdown.frontmatter.main2}
            mainthree={dataMarkdown.frontmatter.main3}
            contentComponent={HTMLContent}
            content={dataMarkdown.html}
            tags={tags}
            langKey={langKey}
          />
        </div>
      </Layout>
    )
  }
}

HomePage.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  data: PropTypes.object.isRequired,
}

export default HomePage

export const pageQuery = graphql`
  query HomePageQuery($id: String!) {
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
        mainheading
        heading
        heading2
        buttontext
        main {
          title
          subtitle
          description
          buttontext
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
          link
        }
        main2 {
          subtitle
          description
          buttontext
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
          link
        }
        main3 {
          subtitle
          description
          buttontext
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
          link
        }
      }
      fields {
        slug
      }
    }
  }
`

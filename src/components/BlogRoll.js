import React from "react"
import PropTypes from "prop-types"
import { Link, graphql, StaticQuery } from "gatsby"
import { FormattedMessage } from "react-intl"
import { FaUtensils, FaCheck, FaTimes } from "react-icons/fa"

const switchData = (data, langKey) => {
  var posts
  switch (langKey) {
    case "en":
      return (posts = data.en)
    case "it":
      return (posts = data.it)
    default:
      return " "
  }
}

class BlogRoll extends React.Component {
  constructor(props) {
    super(props)
    this.state = { url: "/en/blog/" }
  }

  getUrl() {
    this.setState({ url: window.location.pathname })
  }

  componentDidMount() {
    this.getUrl()
  }

  render() {
    const { data } = this.props
    const langKey = this.state.url.slice(1, 3)
    const { edges: posts } = switchData(data, langKey)
    const iconStyles = { fill: "black" }
    const ciconStyles = { fill: "green" }
    const xiconStyles = { fill: "red" }

    return (
      <div className="rows is-multiline blogroll">
        {posts &&
          posts.map(({ node: post }) => (
            <div className="is-parent row is-full" key={post.id}>
              <article className="tile is-child box notification grid-section">
                <div>
                  <img
                    src={
                      post.frontmatter.primary_image.childImageSharp.fluid.src
                    }
                  />
                </div>
                <div className="business-content">
                  <div className="grid-section title">
                    <div>
                      <p>
                        <Link
                          className="has-text-primary is-size-4"
                          to={post.fields.slug}
                        >
                          {post.frontmatter.title}
                        </Link>
                      </p>
                      <p className="type">
                        <FaUtensils
                          className="utensils-icon"
                          size="1em"
                          style={iconStyles}
                        />
                        Restaurant, Vietnamese
                      </p>
                    </div>
                    <div>
                      <p className="location">{post.frontmatter.address}</p>
                    </div>
                  </div>
                  <div>
                    <p className="excerpt">{post.description}</p>
                  </div>
                  <div className="grid-section action">
                    <div className="modes">
                      <div>
                        {post.frontmatter.services_offered.includes(
                          "delivery"
                        ) ? (
                          <FaCheck
                            className="check-icon"
                            size="1em"
                            style={ciconStyles}
                          />
                        ) : (
                          <FaTimes
                            className="check-icon"
                            size="1em"
                            style={xiconStyles}
                          />
                        )}
                        Delivery
                      </div>
                      <div>
                        {post.frontmatter.services_offered.includes(
                          "takeout"
                        ) ? (
                          <FaCheck
                            className="check-icon"
                            size="1em"
                            style={ciconStyles}
                          />
                        ) : (
                          <FaTimes
                            className="check-icon"
                            size="1em"
                            style={xiconStyles}
                          />
                        )}
                        Takeout
                      </div>
                      <div>
                        {post.frontmatter.services_offered.includes(
                          "donations"
                        ) ? (
                          <FaCheck
                            className="check-icon"
                            size="1em"
                            style={ciconStyles}
                          />
                        ) : (
                          <FaTimes
                            className="check-icon"
                            size="1em"
                            style={xiconStyles}
                          />
                        )}
                        Donations
                      </div>
                    </div>
                    <div className="view">
                      <Link className="button" to={post.fields.slug}>
                        <FormattedMessage id="view" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
      </div>
    )
  }
}

BlogRoll.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}
BlogRoll.displayName = "BlogRoll"

// eslint-disable-next-line react/display-name
export default (langKey) => (
  <StaticQuery
    query={graphql`
      query BlogRollQuery {
        site {
          siteMetadata {
            title
            languages {
              langs
              defaultLangKey
            }
          }
        }
        en: allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: {
            frontmatter: {
              templateKey: { eq: "blog-post" }
              lang: { regex: "/(en|any)/" }
            }
          }
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                templateKey
                date
                description
                lang
                primary_image {
                  childImageSharp {
                    fluid(maxWidth: 2048, quality: 100) {
                      ...GatsbyImageSharpFluid
                      src
                    }
                  }
                }
                story
                business_type
                services_offered
                phone
                tags
                homepage_link
                instagram_link
                facebook_link
                twitter_link
              }
            }
          }
        }
      }
    `}
    render={(data) => <BlogRoll data={data} />}
  />
)

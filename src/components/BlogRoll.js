import React from "react"
import PropTypes from "prop-types"
import { Link, graphql, StaticQuery } from "gatsby"
import { FormattedMessage } from "react-intl"
import {
  FaUtensils,
  FaCheck
} from "react-icons/fa"

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
    const iconStyles = { fill:"black"};
    const ciconStyles = { fill:"green"};

    return (
      <div className="rows is-multiline blogroll">
        {posts &&
          posts.map(({ node: post }) => (
            <div className="is-parent row is-full" key={post.id}>
              <article className="tile is-child box notification grid-section">
                <div>
                  <img src="/img/business-placeholder.png" />
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
                        <FaUtensils className="utensils-icon" size="1em" style={iconStyles}/>
                        Restaurant, Vietnamese
                      </p>
                    </div>
                    <div>
                      <p className="location">12345 Main St. Neighborhood</p>
                    </div>
                  </div>
                  <div>
                    <p className="excerpt">{post.excerpt}</p>
                  </div>
                  <div className="grid-section action">
                    <div className="modes">
                      <div><FaCheck className="check-icon" size="1em" style={ciconStyles}/>Delivery</div>
                      <div><FaCheck className="check-icon" size="1em" style={ciconStyles}/>Takeout</div>
                      <div><FaCheck className="check-icon" size="1em" style={ciconStyles}/>Donations</div>
                    </div>
                    <div className="view">
                      <Link className="button" to={post.fields.slug}>
                        <FormattedMessage id="keep-reading" />
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
              excerpt(pruneLength: 400)
              id
              fields {
                slug
              }
              frontmatter {
                title
                templateKey
                date
                lang
              }
            }
          }
        }
        it: allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: {
            frontmatter: {
              templateKey: { eq: "blog-post" }
              lang: { regex: "/(it|any)/" }
            }
          }
        ) {
          edges {
            node {
              excerpt(pruneLength: 400)
              id
              fields {
                slug
              }
              frontmatter {
                title
                templateKey
                date
                lang
              }
            }
          }
        }
      }
    `}
    render={(data) => <BlogRoll data={data} />}
  />
)

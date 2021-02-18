import React from "react"
import { Link } from "gatsby"
import select from "../components/utils"
import { FormattedMessage } from "react-intl"
import menuTree from "../data/menuTree"
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa"
import Copyright from "../components/Copyright"
import ScrollToTop from "../components/ScrollToTop"
import logo from "../img/logo.svg"

const iconStyles = {
  fill: "transparent",
  stroke: "green",
  strokeWidth: "1.5rem",
}

const Footer = class extends React.Component {
  render() {
    const props = this.props
    const sel = select(props.langKey)
    return (
      <footer className="footer has-text-white-ter">
        <div className="inner-footer">
          <div className="content has-text-centered footer-logo">
            <img
              src={logo}
              alt="Save Small Businesses"
              style={{ width: "14em", height: "5em" }}
            />
          </div>
          <div className="content">
            <div className="container ">
              <section className="menu has-text-centered">
                <Link
                  className="navbar-item"
                  to={"/" + props.langKey + "/" + menuTree.about[sel] + "/"}
                >
                  <FormattedMessage id="about" />
                </Link>
                <Link to={"/" + props.langKey + "/" + menuTree.contact[sel] + "/"} className="navbar-item">
                  <FormattedMessage id="Contact" />
                </Link>
                <Link to={"/" + props.langKey + "/" + menuTree.blog[sel] + "/"} className="navbar-item">
                  <FormattedMessage id="Get Involved" />
                </Link>
              </section>
            </div>
            <div className="content grid-section">
              <Copyright />
              <div className="social">
                <a title="facebook" href="https://facebook.com">
                  <FaFacebook
                    className="facebook-icon"
                    size="2em"
                    style={iconStyles}
                  />
                </a>
                <a title="twitter" href="https://twitter.com">
                  <FaTwitter
                    className="twitter-icon"
                    size="2em"
                    style={iconStyles}
                  />
                </a>
                <a title="instagram" href="https://instagram.com">
                  <FaInstagram
                    className="instagram-icon"
                    size="2em"
                    style={iconStyles}
                  />
                </a>
                <a title="linkedin" href="https://linkedin.com">
                  <FaLinkedin
                    className="linkedin-icon"
                    size="2em"
                    style={iconStyles}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <ScrollToTop />
      </footer>
    )
  }
}

Footer.displayName = "Footer"
export default Footer

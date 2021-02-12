import React from "react"
import { Link } from "gatsby"
import select from "../components/utils"
import { FormattedMessage } from "react-intl"
import menuTree from "../data/menuTree"
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaVimeo,
  FaLinkedin,
} from "react-icons/fa"
import Copyright from "../components/Copyright"
import ScrollToTop from "../components/ScrollToTop"
import logo from "../img/logo.svg"

const Footer = class extends React.Component {
  render() {
    const props = this.props
    const sel = select(props.langKey)
    return (
      <footer className="footer has-background-black has-text-white-ter">
        <div className="grid-section inner-footer">
          <div className="content">
            <img
              src={logo}
              alt="Save Small Businesses"
              style={{ width: "14em", height: "5em" }}
            />
          </div>
          <div className="content has-background-black has-text-white-ter">
            <div className="container has-background-black has-text-white-ter grid-section">
              <section className="menu grid-section">
                <Link
                  className="navbar-item"
                  to={
                    "/" + props.langKey + "/" + menuTree.about[sel] + "/"
                  }
                >
                  <FormattedMessage id="about" />
                </Link>
                <Link to={"/" + props.langKey} className="navbar-item">
                  <FormattedMessage id="Contact" />
                </Link>
                <Link to={"/" + props.langKey} className="navbar-item">
                  <FormattedMessage id="Get Involved" />
                </Link>
              </section>
              <div className="social">
                <a title="facebook" href="https://facebook.com">
                  <FaFacebook className="facebook-icon" size="2em" />
                </a>
                <a title="twitter" href="https://twitter.com">
                  <FaTwitter className="twitter-icon" size="2em" />
                </a>
                <a title="instagram" href="https://instagram.com">
                  <FaInstagram className="instagram-icon" size="2em" />
                </a>
                <a title="linkedin" href="https://linkedin.com">
                  <FaLinkedin className="linkedin-icon" size="2em" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <ScrollToTop />
        <Copyright />
      </footer>
    )
  }
}

Footer.displayName = "Footer"
export default Footer

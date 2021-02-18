import React from "react"
import { Link } from "gatsby"
import logo from "../img/logo.svg"
import { FormattedMessage } from "react-intl"
import menuTree from "../data/menuTree"
import { isMobile } from "react-device-detect"
import select from "../components/utils"
import SelectLanguage from "../components/SelectLanguage"
import { FaLongArrowAltLeft } from "react-icons/fa"

const Header = class extends React.Component {
  componentDidMount() {
    const $navbarBurgers = Array.prototype.slice.call(
      document.querySelectorAll(".navbar-burger"),
      0
    )

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
      // Add a click event on each of them
      $navbarBurgers.forEach((el) => {
        el.addEventListener("click", () => {
          // Get the target from the "data-target" attribute
          const target = el.dataset.target
          const $target = document.getElementById(target)
          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle("is-active")
          $target.classList.toggle("is-active")
        })
      })
    }

    // Get all "navbar-link" elements
    const navbarLink = Array.prototype.slice.call(
      document.querySelectorAll(".navbar-link"),
      0
    )
    // Check if there are any navbar links
    if (navbarLink.length > 0) {
      // Add a click event on each of them
      navbarLink.forEach((el) => {
        el.addEventListener("click", () => {
          el.nextElementSibling.classList.toggle("is-hidden-mobile")
        })
      })
    }

    if (isMobile) {
      let navMenu = document.getElementById("navMenu")
      navMenu.style.backgroundColor = "#abd6d1"
    }

    const langdropdown = document.querySelectorAll(".dropdown-item")
    var sellang = ""

    if (langdropdown.length > 0) {
      // Add a click event on each of them
      langdropdown.forEach((el) => {
        if (el.ariaCurrent == "page") sellang = el
      })
    }

    if (sellang.id) {
      document.getElementById(sellang.id).className += " is-selected"

      if (sellang.id == "en") {
        document.getElementById("selectedLang").innerHTML = "English"
      } else {
        document.getElementById("selectedLang").innerHTML = "中文"
      }
    }
  }

  render() {
    const props = this.props
    const sel = select(props.langKey)

    return (
      <header>
        <nav
          className="navbar is-transparent"
          role="navigation"
          aria-label="main-navigation"
        >
          <div className="container">
            <div className="navbar-brand">
              <Link to="/" className="navbar-item" title="Logo">
                <img
                  src={logo}
                  alt="Save Small Businesses"
                  style={{ width: "88px" }}
                />
              </Link>
              {/* Hamburger menu */}
              <div className="navbar-burger burger" data-target="navMenu">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div id="navMenu" className="navbar-menu">
              <div className="navbar-end has-text-centered">
                <Link className="navbar-item" to={"/" + props.langKey}>
                  <FormattedMessage id="home" />
                </Link>
                <Link
                  className="navbar-item"
                  to={"/" + props.langKey + "/" + menuTree.business[sel]}
                >
                  <FormattedMessage id="discover_businesses" />
                </Link>
                <Link
                  className="navbar-item"
                  to={"/" + props.langKey + "/" + menuTree.story[sel]}
                >
                  <FormattedMessage id="our_story" />
                </Link>
              </div>
              <div className="navbar-end">
                <div className="navbar-item  has-text-centered">
                  <SelectLanguage langs={props.langs} />
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    )
  }
}

Header.displayName = "Header"
export default Header

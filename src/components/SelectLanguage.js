import React from "react"
import PropTypes from "prop-types"
import Link from "gatsby-link"
import { FormattedMessage } from "react-intl"
import { FaGlobe } from "react-icons/fa"
import { FaAngleDown, FaAngleUp, FaCheck } from "react-icons/fa"
import En from "./Flags/En"
import Cn from "./Flags/Cn"

const iconStyles = {
  fill: "transparent",
  stroke: "black",
  strokeWidth: "1.5rem",
}

const getIcon = (langKey) => {
  switch (langKey) {
    case "en":
      return <En />
    case "cn":
      return <Cn />
    default:
      return null
  }
}

const SelectLanguage = (props) => {

  const links = props.langs.map((lang) => (
    <Link
      to={lang.link}
      alt={lang.langKey}
      style={{
        color: "#D64000",
      }}
      id={lang.langKey}
      className="dropdown-item"
      key={lang.langKey}
      selected={lang.selected}
    >
      <FaCheck className="check-icon" size="1em" />
      {lang.langKey == "en" ? "English" : "中文"}
    </Link>
  ))

  const showLang = (e) => {
    var dropdown = document.getElementById("dropdown-menu")

    if (e.currentTarget.classList.contains("is-active")) {
      e.currentTarget.classList.remove("is-active")
      dropdown.classList.remove("is-active")
    } else {
      e.currentTarget.className += " is-active"
      dropdown.className += " is-active"
    }
  }

  return (
    <div
      className="section grid-section language"
      style={{ padding: "1.5rem" }}
    >
      <header className="grid-section">
        <FaGlobe className="globe-icon" size="1em" style={iconStyles} />
        <FormattedMessage id="selectLanguage" />
        <span>|</span>
      </header>
      <div class="dropdown is-active">
        <div class="dropdown-trigger">
          <button
            class="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            onClick={(e) => showLang(e)}
          >
            <span id="selectedLang">English</span>
            <span class="icon is-small">
              <FaAngleDown className="down-icon" size="1em" />
              <FaAngleUp className="up-icon" size="1em" />
            </span>
          </button>
        </div>
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
          <div class="dropdown-content">{links}</div>
        </div>
      </div>
    </div>
  )
}

SelectLanguage.propTypes = {
  langs: PropTypes.array,
}

export default SelectLanguage

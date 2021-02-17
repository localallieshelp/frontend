import React from "react"
import { FormattedMessage } from "react-intl"
import { FaCopyright } from "react-icons/fa"

const Copyright = () => (
  <section className="section copyright">
    <div className="container content">
      <div className="container is-fluid has-text-dark">
        <FaCopyright className="menu-names" />{" "}
        <FormattedMessage id="copyright" />
      </div>
    </div>
  </section>
)

export default Copyright

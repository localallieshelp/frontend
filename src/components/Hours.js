import React from "react"
import PropTypes from "prop-types"

class Hours extends React.Component {
  constructor(props) {
    super()
    console.log(props)
  }

  render() {
    return (
      <div className="hours-component">
        <div>Hours</div>
        <div className="hours-list">
          {this.props.hoursOfOperation &&
            this.props.hoursOfOperation.map((day, idx) => (
              <div key={idx} className="grid-section">
                <div>{day.substring(0, day.indexOf(" "))}</div>
                <div>{day.substring(day.indexOf(" ") + 1)}</div>
              </div>
            ))}
        </div>
      </div>
    )
  }
}

Hours.propTypes = {
  hoursOfOperation: PropTypes.array,
}

export default Hours

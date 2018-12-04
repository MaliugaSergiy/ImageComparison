import React, { Component } from "react";
import PropTypes from "prop-types";

import Pointer from "./pointer.jsx";

import "./info-point.css";

class InfoPoint extends Component {
  static propTypes = {};
  render() {
    const { title, position, children } = this.props;

    const percentPosition = {
      top: `${position.top}%`,
      left: `${position.left}%`
    };

    return (
      <div className="InfoPoint" style={percentPosition}>
        <div className="InfoPoint-pointer">
          <Pointer />
        </div>
        <div className="InfoPoint-text">
          <div className="InfoPoint-title">{title}</div>
          <div className="InfoPoint-description">{children}</div>
        </div>
      </div>
    );
  }
}

export default InfoPoint;

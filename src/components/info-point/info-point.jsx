import React, { Component } from "react";
import PropTypes from "prop-types";

import Pointer from "./pointer.jsx";

import "./info-point.css";

const { string, oneOf, shape, number } = PropTypes;

class InfoPoint extends Component {
  static propTypes = {
    title: string,
    position: shape({
      top: number,
      left: number
    }),
    place: oneOf(["before", "after", "both"])
  };
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

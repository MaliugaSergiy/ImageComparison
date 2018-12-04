import React, { Component } from "react";
import PropTypes from "prop-types";

import Pointer from "./pointer.jsx";

import "./info-point.css";

class InfoPoint extends Component {
  static propTypes = {};
  render() {
    const { title, description } = this.props;
    return (
      <div className="InfoPoint">
        <div className="InfoPoint-pointer">
          <Pointer />
        </div>
        <div className="InfoPoint-text">
          <div className="InfoPoint-title">{title}</div>
          <div className="InfoPoint-description">{description}</div>
        </div>
      </div>
    );
  }
}

export default InfoPoint;

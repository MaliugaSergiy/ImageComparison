import React, { Component, PureComponent } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import Pointer from "./pointer.jsx";
import toObject from "../slider-comparator/helpers/toObject";

import "./info-point.css";

const { string, oneOf, shape, number } = PropTypes;

const HORIZONTAL_ORIENTATION = {
  LEFT: "Left",
  RIGHT: "Right"
};

const VERTICAL_ORIENTATION = {
  UP: "Up",
  DOWN: "Down"
};

class InfoPoint extends Component {
  static propTypes = {
    title: string,
    position: shape({
      top: number,
      left: number
    }),
    place: oneOf(["left", "right", "both"])
  };

  infoPointElement = null;

  render() {
    const { title, position, children, imageComparisonGeometry } = this.props;
    console.log(
      "​InfoPoint -> render -> imageComparisonGeometry",
      imageComparisonGeometry
    );

    const percentPosition = {
      top: `${position.top * 100}%`,
      left: `${position.left * 100}%`
    };

    return (
      <div
        className={cn(
          "InfoPoint",
          `InfoPoint--horizontalOrientation${
            HORIZONTAL_ORIENTATION[this.getHorizontalOrientation()]
          }`,
          `InfoPoint--verticalOrientation${
            VERTICAL_ORIENTATION[this.getVerticalOrientation()]
          }`
        )}
        style={percentPosition}
      >
        <div className="InfoPoint-pointer">
          <Pointer />
        </div>
        <div className="InfoPoint-text" ref={this.setInfoPointElementRef}>
          <div className="InfoPoint-title">{title}</div>
          <div className="InfoPoint-description">{children}</div>
        </div>
      </div>
    );
  }

  getHorizontalOrientation() {
    const containerRightBounder = this.props.imageComparisonGeometry.right;

    if (!this.infoPointElement) {
      return "RIGHT";
    }

    const infoPointGeometry = toObject(
      this.infoPointElement.getBoundingClientRect()
    );

    const pointRightBounder = infoPointGeometry.right;

    if (containerRightBounder < pointRightBounder) {
      return "LEFT";
    }

    return "RIGHT";
  }

  getVerticalOrientation() {
    const containerBottomBounder = this.props.imageComparisonGeometry.bottom;

    if (!this.infoPointElement) {
      return "DOWN";
    }

    const infoPointGeometry = toObject(
      this.infoPointElement.getBoundingClientRect()
    );

    const pointBottomBounder = infoPointGeometry.bottom;

    if (containerBottomBounder < pointBottomBounder) {
      return "UP";
    }

    return "DOWN";
  }

  setInfoPointElementRef = element => {
    if (!element) {
      return;
    }

    this.infoPointElement = element;
  };
}

export default InfoPoint;

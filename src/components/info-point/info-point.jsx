import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

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
    place: oneOf(["left", "right", "both"])
  };

  infoPointTextElement = null;

  render() {
    const { title, position, children, imageComparisonGeometry } = this.props;

    const percentPosition = {
      top: `${position.top * 100}%`,
      left: `${position.left * 100}%`
    };

    return (
      <div
        className={cn(
          "InfoPoint",
          `InfoPoint--horizontalOrientation${this.getHorizontalOrientationHash(
            position,
            this.infoPointTextElement,
            imageComparisonGeometry
          )}`,
          `InfoPoint--verticalOrientation${this.getVerticalOrientationHash(
            position,
            this.infoPointTextElement,
            imageComparisonGeometry
          )}`
        )}
        style={percentPosition}
      >
        <div className="InfoPoint-pointer" ref={this.setInfoPointElementRef}>
          <Pointer />
        </div>
        <div className="InfoPoint-text" ref={this.setInfoPointTextElementRef}>
          <div className="InfoPoint-title">{title}</div>
          <div className="InfoPoint-description">{children}</div>
        </div>
      </div>
    );
  }

  getHorizontalOrientationHash(point, textElement, container) {
    const defaultHash = "Right";
    const bounderHash = "Left";

    const containerRightBounder = container.right;
    const containerLeftBounder = container.left;
    const containerWidth = container.width;

    const pointLeftPosition =
      containerLeftBounder + point.left * containerWidth;

    if (!textElement) {
      return;
    }

    const pointGeometry = textElement.getBoundingClientRect();
    const pointTextWidth = pointGeometry.width;
    const pointRightBounder = pointTextWidth + pointLeftPosition + 10;

    const makeGetOrientation = this.makeGetOrientation([
      defaultHash,
      bounderHash
    ]);

    const orientation = makeGetOrientation([
      containerRightBounder,
      pointRightBounder
    ]);

    return orientation;
  }

  getVerticalOrientationHash(point, textElement, container) {
    const defaultHash = "Down";
    const bounderHash = "Up";

    const containerTopBounder = container.top;
    const containerDownBounder = container.bottom;
    const containerHeight = container.height;

    const pointTopPosition = containerTopBounder + point.top * containerHeight;

    if (!textElement) {
      return;
    }

    const pointGeometry = textElement.getBoundingClientRect();
    const pointTextHeight = pointGeometry.height;
    const pointDownBounder = pointTextHeight + pointTopPosition + 10;

    const makeGetOrientation = this.makeGetOrientation([
      defaultHash,
      bounderHash
    ]);

    const orientation = makeGetOrientation([
      containerDownBounder,
      pointDownBounder
    ]);

    return orientation;
  }

  makeGetOrientation = hashOptions => bounderOptions => {
    const [containerBounder, pointBounder] = bounderOptions;
    const [defaultHash, bounderHash] = hashOptions;

    if (containerBounder < pointBounder) {
      return bounderHash;
    }

    return defaultHash;
  };

  setInfoPointTextElementRef = element => {
    if (!element) {
      return;
    }

    this.infoPointTextElement = element;
  };

  setInfoPointElementRef = element => {
    if (!element) {
      return;
    }

    this.infoPointElement = element;
  };
}

export default InfoPoint;

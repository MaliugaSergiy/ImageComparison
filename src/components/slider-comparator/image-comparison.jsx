import React, { Component, Children, Fragment } from "react";
import PropTypes from "prop-types";

import IconContainer from "../icon-container/icon-container";
import IconResize from "../icons/icon-resize/icon-resize";
import toObject from "./helpers/toObject";

import "./image-comparison.css";

const { string, func, number, shape } = PropTypes;

const PLACES = {
  LEFT: "left",
  RIGHT: "right",
  BOTH: "both"
};
class ImageComparison extends Component {
  static propTypes = {
    left: string.isRequired,
    right: string.isRequired,
    separatorPosition: shape({
      left: number
    }).isRequired,
    separatorRef: func.isRequired,
    // onMouseEnter: func.isRequired,
    // onMouseLeave: func.isRequired,
    onMouseMove: func.isRequired,
    onTouchStart: func.isRequired,
    onTouchEnd: func.isRequired,
    onTouchMove: func.isRequired,
    onTouchCancel: func.isRequired,
    onGeometryChange: func.isRequired
  };

  static defaultProps = {};

  imageComparisonElement = null;

  render() {
    const {
      left,
      right,
      separatorPosition,
      separatorRef,
      // onMouseEnter,
      // onMouseLeave,
      onMouseMove,
      onTouchStart,
      onTouchEnd,
      onTouchMove,
      onTouchCancel,
      onMouseDown
    } = this.props;

    const percentLeftPosition = `${separatorPosition.left * 100}%`;
    const imageTransform = `${(1 - separatorPosition.left) * 100}%`;

    return (
      <div
        className="ImageComparison"
        // onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        // onMouseEnter={onMouseEnter}
        // onMouseLeave={onMouseLeave}
        onTouchMove={onTouchMove}
        onTouchCancel={onTouchCancel}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        ref={this.setImageComparisonRef}
      >
        <div className="ImageComparison-images">
          <div className="ImageComparison-rightImageHolder">
            <img className="ImageComparison-image" src={right} alt="" />

            {this.renderInfoPoints(PLACES.RIGHT)}
          </div>

          <div
            className="ImageComparison-leftImageHolder"
            style={{
              transform: `translateX(-${imageTransform})`
            }}
          >
            <div
              className="ImageComparison-imagePositioner"
              style={{
                transform: `translateX(${imageTransform})`
              }}
            >
              <img className="ImageComparison-image" src={left} alt="" />

              {this.renderInfoPoints(PLACES.LEFT)}
            </div>
          </div>
        </div>

        <div className="ImageComparison-infoPoints">
          {this.renderInfoPoints(PLACES.BOTH)}
        </div>

        <div
          className="ImageComparison-separator"
          style={{ left: percentLeftPosition }}
          ref={separatorRef}
        >
          <div className="ImageComparison-separatorLine" ref={separatorRef}>
            <div className="ImageComparison-separatorThumb">
              <IconContainer>
                <IconResize />
              </IconContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderInfoPoints(place) {
    const { children } = this.props;

    return Children.map(children, (element, index) => {
      if (element.props.place !== place) {
        return null;
      }
      return <Fragment key={index}>{React.cloneElement(element, {})}</Fragment>;
    });
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  setImageComparisonRef = element => {
    this.imageComparisonElement = element;

    this.geometryChange();
  };

  handleWindowResize = () => {
    this.geometryChange();
  };

  geometryChange() {
    const { onGeometryChange } = this.props;

    if (!this.imageComparisonElement) {
      onGeometryChange(null);
    }

    onGeometryChange(
      toObject(this.imageComparisonElement.getBoundingClientRect())
    );
  }
}

export default ImageComparison;

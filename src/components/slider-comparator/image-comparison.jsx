import React, { Component, Children, Fragment } from "react";
import PropTypes from "prop-types";

import IconContainer from "../icon-container/icon-container";
import IconResize from "../icons/icon-resize/icon-resize";
import toObject from "./helpers/toObject";

import "./image-comparison.css";

const { string, func, number, shape } = PropTypes;

const PLACES = {
  BEFORE: "before",
  AFTER: "after",
  BOTH: "both"
};
class ImageComparison extends Component {
  static propTypes = {
    before: string.isRequired,
    after: string.isRequired,
    separatorPosition: shape({
      left: number
    }).isRequired,
    separatorRef: func.isRequired,
    onMouseEnter: func.isRequired,
    onMouseLeave: func.isRequired,
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
      before,
      after,
      separatorPosition,
      separatorRef,
      onMouseEnter,
      onMouseLeave,
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
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchMove={onTouchMove}
        onTouchCancel={onTouchCancel}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        ref={this.setImageComparisonRef}
      >
        <div className="ImageComparison-images">
          <div className="ImageComparison-beforeImageHolder">
            <img className="ImageComparison-image" src={before} alt="" />

            {this.renderInfoPoints(PLACES.BEFORE)}
          </div>

          <div
            className="ImageComparison-afterImageHolder"
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
              <img className="ImageComparison-image" src={after} alt="" />

              {this.renderInfoPoints(PLACES.AFTER)}
            </div>
          </div>
        </div>

        {this.renderInfoPoints(PLACES.BOTH)}

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

import React, { Component, Children, Fragment } from "react";
import PropTypes from "prop-types";

import IconContainer from "../icon-container/icon-container";
import IconResize from "../icons/icon-resize/icon-resize";
import getBoundingClientRect from "./helpers/get-bounding-client-rect";

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
      onTouchCancel
    } = this.props;

    const percentLeftPosition = `${separatorPosition.left * 100}%`;
    const imageTransform = `${(1 - separatorPosition.left) * 100}%`;

    return (
      <div
        className="ImageComparison"
        onMouseMove={onMouseMove}
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
    const { onGeometryChange } = this.props;
    const rect = getBoundingClientRect(element);

    if (!element) {
      return;
    }

    this.imageComparisonElement = element;

    onGeometryChange(rect);
  };

  handleWindowResize = () => {
    const { onGeometryChange } = this.props;
    const rect = getBoundingClientRect(this.imageComparisonElement);

    onGeometryChange(rect);
  };
}

export default ImageComparison;

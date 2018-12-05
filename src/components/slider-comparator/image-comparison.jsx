import React, { Component, Children, Fragment } from "react";
import PropTypes from "prop-types";

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
    Ref: func.isRequired,
    onMouseLeave: func.isRequired,
    handleImageComparisonMouseDown: func.isRequired,
    onMouseMove: func.isRequired,
    onMouseDown: func.isRequired,
    onMouseUp: func.isRequired,
    onTouchStart: func.isRequired,
    onTouchEnd: func.isRequired,
    onTouchMove: func.isRequired,
    onTouchCancel: func.isRequired
  };

  static defaultProps = {};

  render() {
    const {
      before,
      after,
      separatorPosition,
      Ref,
      onMouseLeave,
      onImageComparisonMouseDown,
      onMouseMove,
      onSeparatorMouseDown,
      onMouseUp,
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
        onMouseDown={onImageComparisonMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onTouchMove={onTouchMove}
        onTouchCancel={onTouchCancel}
        ref={Ref}
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
              <img
                className="ImageComparison-image"
                src={after}
                alt=""
                onContextMenu={() =>
                  console.log("onContextMenu-imagePositioner")
                }
              />

              {this.renderInfoPoints(PLACES.AFTER)}
            </div>
          </div>
        </div>

        {this.renderInfoPoints(PLACES.BOTH)}

        <div
          className="ImageComparison-separator"
          style={{ left: percentLeftPosition }}
          onMouseDown={onSeparatorMouseDown}
          onMouseUp={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="ImageComparison-separatorLine">
            <div className="ImageComparison-separatorThumb" />
          </div>
        </div>
      </div>
    );
  }

  setBeforeRef = element => {
    if (!element) {
      return;
    }

    this.beforeElement = element;
  };

  setAfterRef = element => {
    if (!element) {
      return;
    }

    this.beforeElement = element;
  };

  renderInfoPoints(place) {
    const { children } = this.props;

    return Children.map(children, (element, index) => {
      if (element.props.place !== place) {
        return null;
      }
      return <Fragment key={index}>{React.cloneElement(element, {})}</Fragment>;
    });
  }
}

export default ImageComparison;

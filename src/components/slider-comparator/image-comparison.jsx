import React, { Component, Children, Fragment } from "react";
import PropTypes from "prop-types";

import "./image-comparison.css";

const { string, func, number, shape } = PropTypes;

class ImageComparison extends Component {
  static propTypes = {
    before: string.isRequired,
    after: string.isRequired,
    separatorPosition: shape({
      left: number
    }).isRequired,
    Ref: func.isRequired,
    onMouseLeave: func.isRequired,
    onClick: func.isRequired,
    onMouseMove: func.isRequired,
    onMouseDown: func.isRequired,
    onMouseUp: func.isRequired
  };

  static defaultProps = {};

  render() {
    const {
      before,
      after,
      separatorPosition,
      Ref,

      onMouseLeave,
      onClick,
      onMouseMove,
      onMouseDown,
      onMouseUp
    } = this.props;

    const percentLeftPosition = `${separatorPosition.left * 100}%`;

    return (
      <div
        className="ImageComparison"
        onMouseMove={onMouseMove}
        onClick={onClick}
        onMouseLeave={onMouseLeave}
        ref={Ref}
      >
        <div className="ImageComparison-images">
          <div className="ImageComparison-beforeImageHolder">
            <img className="ImageComparison-image" src={before} alt="" />
            <div className="ImageComparison-infoPoints">
              {this.renderInfoPoints("before")}
            </div>
          </div>
          <div
            className="ImageComparison-afterImageHolder"
            style={{ width: percentLeftPosition }}
          >
            <div className="ImageComparison-imagePositioner">
              <img className="ImageComparison-image" src={after} alt="" />
              <div
                className="ImageComparison-infoPoints"
                // style={{ left: `px` }}
              >
                {this.renderInfoPoints("after")}
              </div>
            </div>
          </div>
        </div>
        <div className="ImageComparison-infoPoints">
          {this.renderInfoPoints("both")}
        </div>
        <div
          className="ImageComparison-separator"
          style={{ left: percentLeftPosition }}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
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

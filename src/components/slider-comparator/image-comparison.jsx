import React, { Component } from "react";
import PropTypes from "prop-types";

import "./image-comparison.css";

class ImageComparison extends Component {
  static propTypes = {};

  render() {
    const {
      before,
      after,

      separatorPosition,
      Ref,
      children
    } = this.props;

    const percentLeftPosition = `${separatorPosition.left * 100}%`;

    return (
      <div
        className="ImageComparison"
        onMouseMove={this.handleSliderMouseMove}
        onClick={this.handleSliderClick}
        ref={Ref}
      >
        <div className="ImageComparison-images">
          <div className="ImageComparison-beforeImageHolder">
            <img className="ImageComparison-image" src={before} alt="" />
          </div>
          <div
            className="ImageComparison-afterImageHolder"
            style={{ width: percentLeftPosition }}
          >
            <img className="ImageComparison-image" src={after} alt="" />
          </div>
        </div>
        <div className="ImageComparison-infoPoints">{children}</div>
        <div
          className="ImageComparison-separator"
          style={{ left: percentLeftPosition }}
          onMouseDown={this.handleScrollerMouseDown}
          onMouseUp={this.handleScrollerMouseUp}
        >
          <div className="ImageComparison-separatorLine">
            <div className="ImageComparison-separatorThumb" />
          </div>
        </div>
      </div>
    );
  }

  handleScrollerMouseDown = e => {
    e.preventDefault();
    const { onScrollStateChange } = this.props;
    onScrollStateChange(true);
  };

  handleScrollerMouseUp = () => {
    const { onScrollStateChange } = this.props;
    onScrollStateChange(false);
  };

  handleSliderMouseMove = e => {
    const { onChangeSeparatorPosition } = this.props;
    onChangeSeparatorPosition(e);
  };

  handleSliderClick = e => {
    const { onSliderClick } = this.props;

    onSliderClick(e);
  };
}

export default ImageComparison;

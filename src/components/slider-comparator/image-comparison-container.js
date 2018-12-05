import React, { Component } from "react";
import PropTypes from "prop-types";

import InfoPoint from "../info-point/info-point.jsx";
import ImageComparison from "./image-comparison.jsx";

const { string, oneOf, number, shape, arrayOf, bool } = PropTypes;

class ImageComparisonContainer extends Component {
  state = {
    separatorLeft: this.props.initialSeparatorLeftPosition,
    separatorMoveState: false
  };

  static propTypes = {
    before: string.isRequired,
    after: string.isRequired,
    clickableImage: bool,
    initialSeparatorLeftPosition: number,
    infoPoints: arrayOf(
      shape({
        title: string,
        position: shape({
          top: number,
          left: number
        }),
        place: oneOf(["before", "after", "both"])
      })
    )
  };
  static defaultProps = {
    initialSeparatorLeftPosition: 0.5,
    clickableImage: false
  };

  sliderElement = null;

  render() {
    const { separatorLeft } = this.state;
    const { before, after, infoPoints } = this.props;
    return (
      <ImageComparison
        before={before}
        after={after}
        separatorPosition={{ left: separatorLeft }}
        Ref={this.setSliderRef}
        onScrollStateChange={this.handleScrollStateChange}
        onClick={this.handleClick}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}
        onTouchMove={this.handleTouchMove}
        onTouchCancel={this.handleTouchCancel}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        onMouseEnterBefore={this.handleMouseEnterBefore}
        onMouseEnterAfter={this.handleMouseEnterAfter}
        onMouseLeaveBefore={this.handleMouseLeaveBefore}
        onMouseLeaveAfter={this.handleMouseLeaveAfter}
      >
        {infoPoints.map((infoPoint, index) => (
          <InfoPoint
            key={index}
            title={infoPoint.title}
            position={infoPoint.position}
            place={infoPoint.place}
          >
            {infoPoint.description}
          </InfoPoint>
        ))}
      </ImageComparison>
    );
  }
  getSeparatorLeftPosition = e => {
    const { width, left } = this.sliderElement.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;

    const separatorPosition = clientX - left;
    const percentSeparatorPosition = separatorPosition / width;

    if (percentSeparatorPosition > 1) {
      return 1;
    }
    if (percentSeparatorPosition < 0) {
      return 0;
    }

    return percentSeparatorPosition;
  };

  setSeparatorPosition(separatorLeft) {
    this.setState({
      separatorLeft
    });
  }

  changeSeparatorMoveState(separatorMoveState) {
    this.setState({
      separatorMoveState
    });
  }

  setSliderRef = element => {
    if (!element) {
      return;
    }

    this.sliderElement = element;
  };

  handleScrollStateChange = state => {
    this.changeSeparatorMoveState(state);
  };

  handleMouseLeave = () => {
    this.changeSeparatorMoveState(false);
  };

  handleTouchCancel = () => {
    this.changeSeparatorMoveState(false);
  };

  /** */
  handleClick = e => {
    const separatorLeftPosition = this.getSeparatorLeftPosition(e);
    const { clickableImage } = this.props;

    if (!clickableImage) {
      return;
    }

    this.setSeparatorPosition(separatorLeftPosition);
  };

  handleMouseMove = e => {
    const separatorLeftPosition = this.getSeparatorLeftPosition(e);

    if (this.state.separatorMoveState) {
      this.setSeparatorPosition(separatorLeftPosition);
    }
  };

  handleTouchMove = e => {
    const separatorLeftPosition = this.getSeparatorLeftPosition(e);

    if (this.state.separatorMoveState) {
      this.setSeparatorPosition(separatorLeftPosition);
    }
  };

  handleMouseDown = e => {
    e.preventDefault();
    this.changeSeparatorMoveState(true);
  };

  handleMouseUp = () => {
    this.changeSeparatorMoveState(false);
  };

  handleTouchStart = () => {
    this.changeSeparatorMoveState(true);
  };

  handleTouchEnd = () => {
    this.changeSeparatorMoveState(false);
  };

  handleMouseEnterBefore = () => {
    console.log("​handleMouseEnterBefore");
  };

  handleMouseEnterAfter = () => {
    console.log("handleMouseEnterAfter");
  };

  handleMouseLeaveBefore = () => {
    console.log("handleMouseLeaveBefore");
  };

  handleMouseLeaveAfter = () => {
    console.log("handleMouseLeaveAfter");
  };
}

export default ImageComparisonContainer;

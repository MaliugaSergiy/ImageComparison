import React, { Component } from "react";
import PropTypes from "prop-types";

import InfoPoint from "../info-point/info-point.jsx";
import ImageComparison from "./image-comparison.jsx";

const { string, oneOf, number, shape, arrayOf, bool } = PropTypes;

const INCREASE_AMOUNT = 0.02;

class ImageComparisonContainer extends Component {
  state = {
    separatorLeft: this.props.initialSeparatorLeftPosition,
    tempSeparatorLeft: null,
    separatorMoveState: false
  };

  static propTypes = {
    before: string.isRequired,
    after: string.isRequired,
    clickableImage: bool,
    increaseByHover: bool,
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
    clickableImage: false,
    increaseByHover: false
  };

  imageComparisonElement = null;
  separatorElement = null;

  render() {
    const { before, after, infoPoints } = this.props;
    return (
      <ImageComparison
        before={before}
        after={after}
        separatorPosition={this.getSeparatorLeftProperty()}
        Ref={this.setImageComparisonRef}
        separatorRef={this.setSeparatorElementRef}
        onScrollStateChange={this.handleScrollStateChange}
        onImageComparisonMouseDown={this.handleImageComparisonMouseDown}
        onSeparatorMouseDown={this.handleSeparatorMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}
        onTouchMove={this.handleTouchMove}
        onTouchCancel={this.handleTouchCancel}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
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

  getSeparatorLeftProperty() {
    const { tempSeparatorLeft, separatorLeft } = this.state;

    return {
      left: tempSeparatorLeft || separatorLeft
    };
  }

  getSeparatorLeftPosition = e => {
    const { width, left } = this.imageComparisonElement.getBoundingClientRect();

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

  getTempSeparatorLeft(tempSeparatorLeft) {
    if (tempSeparatorLeft > 1) {
      return 1;
    }
    if (tempSeparatorLeft < 0) {
      return 0;
    }

    return tempSeparatorLeft;
  }

  setTempSeparatorLeft(tempSeparatorLeft) {
    this.setState({
      tempSeparatorLeft
    });
  }

  increaseImage(e) {
    const { left, right } = this.separatorElement.getBoundingClientRect();
    const { separatorLeft } = this.state;

    const { clientX } = e;

    console.log({ left, right, clientX });

    if (clientX < left - 16) {
      const tempSeparatorLeft = this.getTempSeparatorLeft(
        separatorLeft + INCREASE_AMOUNT
      );
      this.setTempSeparatorLeft(tempSeparatorLeft);
      return;
    }

    if (clientX > right + 16) {
      const tempSeparatorLeft = this.getTempSeparatorLeft(
        separatorLeft - INCREASE_AMOUNT
      );
      this.setTempSeparatorLeft(tempSeparatorLeft);
      return;
    }

    this.setTempSeparatorLeft(null);
  }

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

  setImageComparisonRef = element => {
    if (!element) {
      return;
    }

    this.imageComparisonElement = element;
  };

  setSeparatorElementRef = element => {
    if (!element) {
      return;
    }

    this.separatorElement = element;
  };

  handleScrollStateChange = state => {
    this.changeSeparatorMoveState(state);
  };

  handleMouseLeave = () => {
    this.changeSeparatorMoveState(false);
    this.setTempSeparatorLeft(null);
  };

  handleTouchCancel = () => {
    this.changeSeparatorMoveState(false);
  };

  /** */
  handleImageComparisonMouseDown = e => {
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
    this.increaseImage(e);
  };

  handleTouchMove = e => {
    const separatorLeftPosition = this.getSeparatorLeftPosition(e);

    if (this.state.separatorMoveState) {
      this.setSeparatorPosition(separatorLeftPosition);
    }
  };

  handleSeparatorMouseDown = e => {
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

  // handleMouseEnterBefore = () => {
  //   console.log("​handleMouseEnterBefore");
  // };

  // handleMouseEnterAfter = () => {
  //   console.log("handleMouseEnterAfter");
  // };

  // handleMouseLeaveBefore = () => {
  //   console.log("handleMouseLeaveBefore");
  // };

  // handleMouseLeaveAfter = () => {
  //   console.log("handleMouseLeaveAfter");
  // };
}

export default ImageComparisonContainer;

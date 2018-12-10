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

  separatorDelayTimer = null;

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
        onMouseDown={this.handleMouseDown}
        onSeparatorMouseDown={this.handleSeparatorMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}
        onMouseEnter={this.handleMouseEnter}
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

  componentDidMount() {
    window.addEventListener("mouseup", this.resetSeparatorMoveState);
  }

  componentWillUnmount() {
    window.removeEventListener("mouseup", this.resetSeparatorMoveState);
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
    if (this.props.increaseByHover) {
      this.setState({
        tempSeparatorLeft
      });
    }
  }

  setInitialSeparatorLeftPosition = () => {
    const { initialSeparatorLeftPosition } = this.props;

    this.setState({
      separatorLeft: initialSeparatorLeftPosition
    });

    this.separatorDelayTimer = null;
  };

  increaseImage(e) {
    const { left, right } = this.separatorElement.getBoundingClientRect();
    const { separatorLeft } = this.state;
    const { clientX } = e;

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

  clearDelayTimer = () => {
    if (this.separatorDelayTimer) {
      clearTimeout(this.separatorDelayTimer);
      this.separatorDelayTimer = null;
    }
  };

  setDelayTimer = () => {
    const {
      setInitialSeparatorLeftPositionDelay,
      initialSeparatorLeftPosition
    } = this.props;
    const { separatorLeft } = this.state;

    if (initialSeparatorLeftPosition !== separatorLeft) {
      this.separatorDelayTimer = setTimeout(
        this.setInitialSeparatorLeftPosition,
        setInitialSeparatorLeftPositionDelay
      );
    }
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

  resetSeparatorMoveState = () => {
    this.setState({
      separatorMoveState: false
    });
  };

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

  handleMouseEnter = () => {
    const { setInitialSeparatorLeftPositionDelay } = this.props;

    if (setInitialSeparatorLeftPositionDelay) {
      this.clearDelayTimer();
    }
  };

  handleMouseLeave = () => {
    const { setInitialSeparatorLeftPositionDelay } = this.props;

    this.setTempSeparatorLeft(null);

    if (setInitialSeparatorLeftPositionDelay) {
      this.setDelayTimer();
    }
  };

  handleTouchCancel = () => {
    this.changeSeparatorMoveState(false);
  };

  handleMouseDown = e => {
    const separatorLeftPosition = this.getSeparatorLeftPosition(e);
    const { clickableImage } = this.props;

    if (!clickableImage) {
      return;
    }

    this.setSeparatorPosition(separatorLeftPosition);
    this.setTempSeparatorLeft(null);
  };

  handleMouseMove = e => {
    const separatorLeftPosition = this.getSeparatorLeftPosition(e);

    if (this.state.separatorMoveState) {
      this.setSeparatorPosition(separatorLeftPosition);
    }

    if (this.props.increaseByHover) {
      this.increaseImage(e);
    }
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

  handleTouchStart = () => {
    this.changeSeparatorMoveState(true);
  };

  handleTouchEnd = () => {
    this.changeSeparatorMoveState(false);
  };
}

export default ImageComparisonContainer;

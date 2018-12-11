import React, { Component } from "react";
import PropTypes from "prop-types";

import InfoPoint from "../info-point/info-point.jsx";
import ImageComparison from "./image-comparison.jsx";

const { string, oneOf, number, shape, arrayOf, bool } = PropTypes;

const INCREASE_AMOUNT = 0.02;

const SEPARATOR_GAP = 16;

class ImageComparisonContainer extends Component {
  state = {
    separatorLeft: this.props.initialSeparatorLeftPosition,
    tempSeparatorLeft: null,
    isSeparatorMoving: false,
    elementGeometry: {}
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
        onMouseDown={this.handleMouseDown}
        onSeparatorMouseDown={this.handleSeparatorMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onTouchMove={this.handleTouchMove}
        onTouchCancel={this.handleTouchCancel}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        onGeometryChange={this.handleGeometryChange}
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
    window.addEventListener("mouseup", this.disableSeparatorMoving);
  }

  componentWillUnmount() {
    window.removeEventListener("mouseup", this.disableSeparatorMoving);
  }

  getSeparatorLeftProperty() {
    const { tempSeparatorLeft, separatorLeft } = this.state;

    return {
      left: tempSeparatorLeft || separatorLeft
    };
  }

  getSeparatorLeftPosition = e => {
    const { width, left } = this.state.elementGeometry;

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

  getTempSeparatorLeft(modifiedSeparatorLeft) {
    if (modifiedSeparatorLeft > 1) {
      return 1;
    }
    if (modifiedSeparatorLeft < 0) {
      return 0;
    }

    return modifiedSeparatorLeft;
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

    if (clientX < left - SEPARATOR_GAP) {
      const tempSeparatorLeft = this.getTempSeparatorLeft(
        separatorLeft + INCREASE_AMOUNT
      );
      this.setTempSeparatorLeft(tempSeparatorLeft);
      return;
    }

    if (clientX > right + SEPARATOR_GAP) {
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

  disableSeparatorMoving = () => {
    this.setState({
      isSeparatorMoving: false
    });
  };
  enableSeparatorMoving = () => {
    this.setState({
      isSeparatorMoving: true
    });
  };

  setSeparatorElementRef = element => {
    if (!element) {
      return;
    }

    this.separatorElement = element;
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
    this.disableSeparatorMoving();
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

    if (this.state.isSeparatorMoving) {
      this.setSeparatorPosition(separatorLeftPosition);
    }

    if (this.props.increaseByHover) {
      this.increaseImage(e);
    }
  };

  handleTouchMove = e => {
    const separatorLeftPosition = this.getSeparatorLeftPosition(e);

    if (this.state.isSeparatorMoving) {
      this.setSeparatorPosition(separatorLeftPosition);
    }
  };

  handleSeparatorMouseDown = e => {
    e.preventDefault();
    this.enableSeparatorMoving();
  };

  handleTouchStart = () => {
    this.enableSeparatorMoving();
  };

  handleTouchEnd = () => {
    this.disableSeparatorMoving();
  };

  setElementGeometry(geometry) {
    this.setState({
      elementGeometry: { ...geometry }
    });
  }

  handleGeometryChange = geometry => {
    this.setElementGeometry(geometry);
  };
}

export default ImageComparisonContainer;

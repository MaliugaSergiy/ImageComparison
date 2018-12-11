import React, { Component } from "react";
import PropTypes from "prop-types";

import InfoPoint from "../info-point/info-point.jsx";
import ImageComparison from "./image-comparison.jsx";
import isInRange from "./helpers/is-in-range";

const { string, oneOf, number, shape, arrayOf, bool } = PropTypes;

const SELECTION_OFFSET = 0.02;

const SEPARATOR_GAP = 100;

class ImageComparisonContainer extends Component {
  state = {
    separatorLeft: this.props.initialSeparatorLeftPosition,
    tempSeparatorLeft: null,
    geometry: {},
    pointX: null
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
  isSeparatorMoving = false;

  render() {
    const { before, after, infoPoints } = this.props;
    return (
      <ImageComparison
        before={before}
        after={after}
        separatorPosition={this.getSeparatorPosition()}
        separatorRef={this.setSeparatorElementRef}
        onMouseMove={this.handleMouseMove}
        onMouseDown={this.handleMouseDown}
        // onMouseEnter={this.handleMouseEnter}
        // onMouseLeave={this.handleMouseLeave}
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

  /**
   * life cycles
   **/

  componentDidMount() {
    window.addEventListener("mouseup", this.handleMouseUp);
  }

  componentWillUnmount() {
    window.removeEventListener("mouseup", this.handleMouseUp);
  }

  /**
   * Ref-s
   **/

  setSeparatorElementRef = element => {
    if (!element) {
      return;
    }

    this.separatorElement = element;
  };

  /**
   * setState-s
   */

  selectLeft() {
    this.setState({
      pointX: "left"
    });
  }

  selectRight() {
    this.setState({
      pointX: "right"
    });
  }

  resetSelected() {
    this.setState({
      pointX: null
    });
  }

  setPointX(clientX) {
    const { separatorLeft, geometry } = this.state;
    const leftBorder = geometry.left;
    const rightBorder = geometry.left + geometry.width;
    const separatorLeftPosition = leftBorder + separatorLeft * geometry.width;

    if (
      this.isPointerOverLeft(
        clientX,
        leftBorder,
        separatorLeftPosition,
        SEPARATOR_GAP
      )
    ) {
      this.selectLeft();
      return;
    }

    if (
      this.isPointerOverRight(
        clientX,
        separatorLeftPosition,
        rightBorder,
        SEPARATOR_GAP
      )
    ) {
      this.selectRight();
      return;
    }
    this.resetSelected();
  }

  setInitialSeparatorLeftPosition = () => {
    const { initialSeparatorLeftPosition } = this.props;

    this.setState({
      separatorLeft: initialSeparatorLeftPosition
    });

    this.separatorDelayTimer = null;
  };

  setTempSeparatorLeft(tempSeparatorLeft) {
    if (this.props.increaseByHover) {
      this.setState({
        tempSeparatorLeft
      });
    }
  }

  setSeparatorPosition(separatorLeft) {
    this.setState({
      separatorLeft
    });
  }

  disableSeparatorMoving() {
    this.isSeparatorMoving = false;
  }

  enableSeparatorMoving() {
    this.isSeparatorMoving = true;
  }

  setGeometry(geometry) {
    this.setState({
      geometry: geometry
    });
  }

  /**
   * get-s
   **/

  isPointerOverLeft(cursorPosition, startPoint, endPoint, gap) {
    const offsetEndPoint = endPoint - gap;
    return isInRange(cursorPosition, startPoint, offsetEndPoint);
  }

  isPointerOverRight(cursorPosition, startPoint, endPoint, gap) {
    const offsetStartPoint = startPoint + gap;
    return isInRange(cursorPosition, offsetStartPoint, endPoint);
  }

  getSeparatorPosition() {
    const { separatorLeft, pointX } = this.state;

    if (pointX === "left") {
      return {
        left: separatorLeft + SELECTION_OFFSET
      };
    }

    if (pointX === "right") {
      return {
        left: separatorLeft - SELECTION_OFFSET
      };
    }

    return {
      left: separatorLeft
    };
  }

  getSeparatorLeftPosition = clientX => {
    const { width, left } = this.state.geometry;

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

  /**
   * UTILITIES
   **/

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

  /**
   * ↓ POINTERS ↓
   * */

  pointerMove(clientX) {
    const separatorLeftPosition = this.getSeparatorLeftPosition(clientX);

    if (!this.isSeparatorMoving) {
      return;
    }

    this.setSeparatorPosition(separatorLeftPosition);
  }

  pointerDown(clientX) {
    const separatorLeftPosition = this.getSeparatorLeftPosition(clientX);
    const { clickableImage } = this.props;

    if (!clickableImage) {
      return;
    }

    this.enableSeparatorMoving();
    this.setSeparatorPosition(separatorLeftPosition);
  }

  pointerUp() {
    this.disableSeparatorMoving();
  }

  /* ↑ POINTERS ↑ */

  /**
   * HANDLERS
   * */

  handleMouseDown = e => {
    const { clientX } = e;
    e.preventDefault();
    this.pointerDown(clientX);
  };

  handleMouseUp = () => {
    this.pointerUp();
  };

  handleMouseMove = ({ clientX }) => {
    const { increaseByHover } = this.props;
    this.pointerMove(clientX);

    if (increaseByHover) {
    }

    this.setPointX(clientX);
  };

  /**--------------------------------------- */

  handleTouchStart = e => {
    const { clientX } = e.touches[0];
    this.pointerDown(clientX);
  };

  handleTouchMove = e => {
    const { clientX } = e.touches[0];
    this.pointerMove(clientX);
  };

  handleTouchEnd = () => {
    this.pointerUp();
  };

  handleTouchCancel = () => {
    this.pointerUp();
  };

  /**--------------------------------------- */

  handleGeometryChange = geometry => {
    this.setGeometry(geometry);
  };

  /* ↑ HANDLERS ↑ */
}

export default ImageComparisonContainer;

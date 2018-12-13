import React, { Component } from "react";
import PropTypes from "prop-types";

import InfoPoint from "../info-point/info-point.jsx";
import ImageComparison from "./image-comparison.jsx";
import isInRange from "./helpers/is-in-range";
import isLeftButtonClicked from "./helpers/is-left-button-clicked";

const { string, oneOf, number, shape, arrayOf, bool } = PropTypes;

const SELECTION_OFFSET = 0.1;
const SEPARATOR_GAP = 100;
const SET_INITIAL_TIME_INTERVAL = 6000;

class ImageComparisonContainer extends Component {
  state = {
    separatorLeft: this.props.initialSeparatorLeftPosition,
    geometry: {},
    /** selected image  */
    pointX: null,
    isSeparatorMoving: false
  };

  static propTypes = {
    left: string.isRequired,
    right: string.isRequired,
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
        place: oneOf(["left", "right", "both"])
      })
    )
  };
  static defaultProps = {
    initialSeparatorLeftPosition: 0.5,
    clickableImage: false,
    increaseByHover: false
  };

  /**
   * ↓ REFs ↓
   **/
  separatorElement = null;

  /** ↑ REFs ↑ */

  /**
   * ↓ FLAGS ↓
   **/
  initialOptionTimer = null;
  isTouched = false;
  /** ↑ FLAGS ↑ */

  render() {
    const { left, right, infoPoints, increaseByHover } = this.props;
    const { separatorLeft, pointX, isSeparatorMoving } = this.state;
    return (
      <ImageComparison
        left={left}
        right={right}
        separatorPosition={this.getSeparatorPosition(
          separatorLeft,
          pointX,
          increaseByHover
        )}
        isSeparatorMoving={isSeparatorMoving}
        separatorRef={this.setSeparatorElementRef}
        onMouseMove={this.handleMouseMove}
        onMouseDown={this.handleMouseDown}
        // onMouseEnter={this.handleMouseEnter}
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

  /**
   * life cycles
   **/

  componentDidMount() {
    window.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("mousemove", this.handleMouseMove);
  }

  componentWillUnmount() {
    window.removeEventListener("mouseup", this.handleMouseUp);
    window.removeEventListener("mousemove", this.handleMouseMove);
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

  setPointX(clientX, clientY) {
    const { separatorLeft, geometry } = this.state;

    const leftBorder = geometry.left;
    const rightBorder = geometry.left + geometry.width;
    const topBorder = geometry.top;
    const bottomBorder = geometry.top + geometry.height;
    const separatorLeftPosition = leftBorder + separatorLeft * geometry.width;

    const isPointerOverLeft = this.isPointerOverLeft(
      [clientX, clientY],
      SEPARATOR_GAP,
      [leftBorder, separatorLeftPosition],
      [topBorder, bottomBorder]
    );
    const isPointerOverRight = this.isPointerOverRight(
      [clientX, clientY],
      SEPARATOR_GAP,
      [separatorLeftPosition, rightBorder],
      [topBorder, bottomBorder]
    );

    if (isPointerOverLeft) {
      this.selectLeft();
      return;
    }

    if (isPointerOverRight) {
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

  setSeparatorPosition(separatorLeft) {
    this.clearInitialOptionsTimer();
    this.setState({
      separatorLeft
    });
    this.setTouched();
  }

  disableSeparatorMoving() {
    this.clearInitialOptionsTimer();
    this.setState({
      isSeparatorMoving: false
    });
    this.setInitialOptionsTimer(SET_INITIAL_TIME_INTERVAL);
  }

  enableSeparatorMoving() {
    this.setState({
      isSeparatorMoving: true
    });
  }

  setGeometry(geometry) {
    this.setState({
      geometry: geometry
    });
  }

  setTouched() {
    this.isTouched = true;
  }

  resetTouched() {
    this.isTouched = false;
  }

  /**
   * get-s
   **/

  isPointerOverLeft(
    cursorCoordinates,
    horizontalGap,
    horizontalPoints,
    verticalPoints
  ) {
    const [cursorPositionX, cursorPositionY] = cursorCoordinates;
    const [startHorizontalPoint, endHorizontalPoint] = horizontalPoints;
    const [startVerticalPoint, endVerticalPoint] = verticalPoints;
    const offsetEndPoint = endHorizontalPoint - horizontalGap;
    return (
      isInRange(cursorPositionX, [startHorizontalPoint, offsetEndPoint]) &&
      isInRange(cursorPositionY, [startVerticalPoint, endVerticalPoint])
    );
  }

  isPointerOverRight(
    cursorCoordinates,
    horizontalGap,
    horizontalPoints,
    verticalPoints
  ) {
    const [cursorPositionX, cursorPositionY] = cursorCoordinates;
    const [startHorizontalPoint, endHorizontalPoint] = horizontalPoints;
    const [startVerticalPoint, endVerticalPoint] = verticalPoints;

    const offsetStartPoint = startHorizontalPoint + horizontalGap;
    return (
      isInRange(cursorPositionX, [offsetStartPoint, endHorizontalPoint]) &&
      isInRange(cursorPositionY, [startVerticalPoint, endVerticalPoint])
    );
  }

  getSeparatorPosition(separatorLeft, pointX, increaseByHover) {
    if (pointX === "left" && !this.isTouched && increaseByHover) {
      const offsetLeft = separatorLeft + SELECTION_OFFSET;
      return {
        left: offsetLeft < 1 ? offsetLeft : 1
      };
    }

    if (pointX === "right" && !this.isTouched && increaseByHover) {
      const offsetLeft = separatorLeft - SELECTION_OFFSET;
      return {
        left: offsetLeft > 0 ? offsetLeft : 0
      };
    }

    return {
      left: separatorLeft
    };
  }

  getSeparatorLeftPosition = (clientX, width, left) => {
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

  /**
   * ↓ TIMERS ↓
   **/

  clearInitialOptionsTimer = () => {
    clearTimeout(this.initialOptionTimer);
  };

  setInitialOptionsTimer = SET_INITIAL_TIME_INTERVAL => {
    this.initialOptionTimer = setTimeout(() => {
      this.setInitialSeparatorLeftPosition();
      this.resetTouched();
    }, SET_INITIAL_TIME_INTERVAL);
  };

  /* ↑ TIMERS ↑ */

  /**
   * ↓ POINTERS ↓
   * */

  pointerMove(clientX) {
    const { width, left } = this.state.geometry;
    const separatorLeftPosition = this.getSeparatorLeftPosition(
      clientX,
      width,
      left
    );

    if (!this.state.isSeparatorMoving) {
      return;
    }

    this.setSeparatorPosition(separatorLeftPosition);
  }

  pointerDown(clientX) {
    const { width, left } = this.state.geometry;
    const separatorLeftPosition = this.getSeparatorLeftPosition(
      clientX,
      width,
      left
    );
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
   * ↓ HANDLERS ↓
   * */

  handleMouseDown = e => {
    const { clientX } = e;

    if (!isLeftButtonClicked(e)) {
      return;
    }

    e.preventDefault();

    this.pointerDown(clientX);
  };

  handleMouseUp = () => {
    this.pointerUp();
  };

  handleMouseMove = ({ clientX, clientY }) => {
    this.pointerMove(clientX);

    this.setPointX(clientX, clientY);
  };

  handleMouseLeave = () => {
    this.resetSelected();
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

import React, { Component } from "react";
import PropTypes from "prop-types";

import InfoPoint from "../info-point/info-point.jsx";
import ImageComparison from "./image-comparison.jsx";
import isInRange from "./helpers/is-in-range";
import isLeftButtonClicked from "./helpers/is-left-button-clicked";

const { string, oneOf, number, shape, arrayOf, bool } = PropTypes;

const SELECTION_OFFSET = 0.02;
const SEPARATOR_GAP = 100;
const SET_INITIAL_TIME_INTERVAL = 6000;

class ImageComparisonContainer extends Component {
  state = {
    separatorLeft: this.props.initialSeparatorLeftPosition,
    geometry: {},
    pointX: null
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
  isSeparatorMoving = false;
  isTouched = false;
  /** ↑ FLAGS ↑ */

  render() {
    const { left, right, infoPoints } = this.props;
    const { separatorLeft, pointX } = this.state;
    return (
      <ImageComparison
        left={left}
        right={right}
        separatorPosition={this.getSeparatorPosition(separatorLeft, pointX)}
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

  setTouched() {
    this.isTouched = true;
  }

  resetTouched() {
    this.isTouched = false;
  }

  /**
   * get-s
   **/

  isPointerOverLeft(cursorPosition, startPoint, endPoint, gap) {
    const offsetEndPoint = endPoint - gap;
    return isInRange(cursorPosition, [startPoint, offsetEndPoint]);
  }

  isPointerOverRight(cursorPosition, startPoint, endPoint, gap) {
    const offsetStartPoint = startPoint + gap;
    return isInRange(cursorPosition, [offsetStartPoint, endPoint]);
  }

  getSeparatorPosition(separatorLeft, pointX) {
    if (pointX === "left" && !this.isTouched) {
      const offsetLeft = separatorLeft + SELECTION_OFFSET;
      return {
        left: offsetLeft < 1 ? offsetLeft : 1
      };
    }

    if (pointX === "right" && !this.isTouched) {
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

    if (!this.isSeparatorMoving) {
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
    this.clearInitialOptionsTimer();
    this.enableSeparatorMoving();
    this.setSeparatorPosition(separatorLeftPosition);
    this.setTouched();
    this.setInitialOptionsTimer(SET_INITIAL_TIME_INTERVAL);
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

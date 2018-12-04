import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import InfoPoint from "../info-point/info-point.jsx";

import "./slider-comparator.css";

class SliderComparator extends Component {
  static propTypes = {};
  render() {
    const { images, infoPoints, scrollState, separatorPosition } = this.props;
    return (
      <div
        className={cn("SliderComparator", {
          "SliderComparator--scrolling": scrollState
        })}
        onMouseMove={this.handleSliderMouseMove}
        onMo
        onClick={this.handleSliderClick}
      >
        <div className="SliderComparator-images">
          <div className="SliderComparator-beforeImageHolder">
            <img className="SliderComparator-image" src={images[1]} alt="" />
          </div>
          <div
            className="SliderComparator-afterImageHolder"
            style={{ width: `${separatorPosition}%` }}
          >
            <img className="SliderComparator-image" src={images[0]} alt="" />
          </div>
        </div>
        <div className="SliderComparator-infoPoints">
          {infoPoints.map((infoPoint, index) => (
            <div
              key={index}
              className="SliderComparator-infoPoint"
              style={{
                top: `${infoPoint.position.top}%`,
                left: `${infoPoint.position.left}%`
              }}
            >
              <InfoPoint
                title={infoPoint.title}
                description={infoPoint.description}
              />
            </div>
          ))}
        </div>
        <div
          className="SliderComparator-scroller"
          style={{ left: `${separatorPosition}%` }}
          onClick={() => console.log("clicked")}
          onMouseDown={this.handleScrollerMouseDown}
          onMouseUp={this.handleScrollerMouseUp}
        >
          <div className="SliderComparator-scroller-thumb" />
        </div>
      </div>
    );
  }

  handleScrollerMouseDown = () => {
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
    const { onSliderClick, setScrollPositionByClicking } = this.props;

    if (setScrollPositionByClicking) {
      onSliderClick(e);
    }
  };
}

export default SliderComparator;

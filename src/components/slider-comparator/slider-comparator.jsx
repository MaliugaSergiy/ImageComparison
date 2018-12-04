import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import "./slider-comparator.css";

class SliderComparator extends Component {
  static propTypes = {};

  render() {
    const {
      imageBefore,
      imageAfter,
      scrollState,
      separatorPosition,
      sliderRef,
      children
    } = this.props;
    return (
      <div
        className={cn("SliderComparator", {
          "SliderComparator--scrolling": scrollState
        })}
        onMouseMove={this.handleSliderMouseMove}
        onClick={this.handleSliderClick}
        ref={sliderRef}
      >
        <div className="SliderComparator-images">
          <div className="SliderComparator-beforeImageHolder">
            <img className="SliderComparator-image" src={imageBefore} alt="" />
          </div>
          <div
            className="SliderComparator-afterImageHolder"
            style={{ width: `${separatorPosition}%` }}
          >
            <img className="SliderComparator-image" src={imageAfter} alt="" />
          </div>
        </div>
        <div className="SliderComparator-infoPoints">{children}</div>
        <div
          className="SliderComparator-scroller"
          style={{ left: `${separatorPosition}%` }}
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

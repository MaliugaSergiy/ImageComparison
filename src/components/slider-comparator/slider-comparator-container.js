import React, { Component } from "react";

import InfoPoint from "../info-point/info-point.jsx";
import SliderComparator from "./slider-comparator.jsx";

const images = [
  "https://juxtapose.knightlab.com/static/img/Sochi_11April2005.jpg",

  "https://juxtapose.knightlab.com/static/img/Sochi_22Nov2013.jpg"
];

class SliderComparatorContainer extends Component {
  state = {
    separatorPosition: 55,
    scrollState: false
  };

  render() {
    const { separatorPosition, scrollState } = this.state;
    return (
      <SliderComparator
        images={images}
        scrollState={scrollState}
        separatorPosition={separatorPosition}
        setScrollPositionByClicking={true}
        onScrollStateChange={this.handleScrollStateChange}
        onSliderClick={this.handleSliderClick}
        onChangeSeparatorPosition={this.handleChangeSeparatorPosition}
      />
    );
  }
  getSeparatorPosition = e => {
    const elementRect = e.target.getBoundingClientRect();
    const elementWidth = elementRect.right - elementRect.left;
    const separatorPosition = e.clientX - elementRect.left;
    const persentSeparatorPosition = (separatorPosition * 100) / elementWidth;
    return persentSeparatorPosition;
  };

  setSeparatorPosition(separatorPosition) {
    this.setState({
      separatorPosition
    });
  }

  changeScrollState(scrollState) {
    this.setState({
      scrollState
    });
  }

  handleScrollStateChange = state => {
    this.changeScrollState(state);
  };

  handleChangeSeparatorPosition = e => {
    const separatorPosition = this.getSeparatorPosition(e);

    if (this.state.scrollState) {
      this.setSeparatorPosition(separatorPosition);
    }
  };

  handleSliderClick = e => {
    const separatorPosition = this.getSeparatorPosition(e);

    this.setSeparatorPosition(separatorPosition);
  };
}

export default SliderComparatorContainer;

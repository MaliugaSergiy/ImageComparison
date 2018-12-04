import React, { Component } from "react";

import InfoPoint from "../info-point/info-point.jsx";
import SliderComparator from "./slider-comparator.jsx";

const images = [
  "https://juxtapose.knightlab.com/static/img/Sochi_11April2005.jpg",

  "https://juxtapose.knightlab.com/static/img/Sochi_22Nov2013.jpg"
];

const imageBefore =
  "https://juxtapose.knightlab.com/static/img/Sochi_11April2005.jpg";
const imageAfter =
  "https://juxtapose.knightlab.com/static/img/Sochi_22Nov2013.jpg";

class SliderComparatorContainer extends Component {
  state = {
    separatorPosition: 55,
    scrollState: false
  };

  sliderElement = null;

  render() {
    const { separatorPosition, scrollState } = this.state;
    return (
      <SliderComparator
        images={images}
        imageBefore={imageBefore}
        imageAfter={imageAfter}
        scrollState={scrollState}
        separatorPosition={separatorPosition}
        setScrollPositionByClicking={true}
        sliderRef={this.setSliderRef}
        onScrollStateChange={this.handleScrollStateChange}
        onSliderClick={this.handleSliderClick}
        onChangeSeparatorPosition={this.handleChangeSeparatorPosition}
      />
    );
  }
  getSeparatorPosition = e => {
    const { width, left } = this.sliderElement.getBoundingClientRect();

    const separatorPosition = e.clientX - left;
    const persentSeparatorPosition = (separatorPosition * 100) / width;

    if (persentSeparatorPosition > 100) {
      return 100;
    }
    if (persentSeparatorPosition < 0) {
      return 0;
    }

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

  setSliderRef = element => {
    if (!element) {
      return;
    }

    this.sliderElement = element;
  };

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

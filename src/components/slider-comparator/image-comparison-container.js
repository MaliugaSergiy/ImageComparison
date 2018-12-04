import React, { Component } from "react";

import InfoPoint from "../info-point/info-point.jsx";
import ImageComparison from "./image-comparison.jsx";

const before =
  "https://juxtapose.knightlab.com/static/img/Sochi_11April2005.jpg";
const after = "https://juxtapose.knightlab.com/static/img/Sochi_22Nov2013.jpg";

class ImageComparisonContainer extends Component {
  state = {
    separatorLeft: 0.55,
    scrollState: false
  };

  sliderElement = null;

  render() {
    const { separatorLeft, scrollState } = this.state;
    return (
      <ImageComparison
        before={before}
        after={after}
        scrollState={scrollState}
        separatorPosition={{ left: separatorLeft }}
        setScrollPositionByClicking={true}
        Ref={this.setSliderRef}
        onScrollStateChange={this.handleScrollStateChange}
        onSliderClick={this.handleSliderClick}
        onChangeSeparatorPosition={this.handleChangeSeparatorPosition}
        onClick={this.handleClick}
        onMouseDown={this.handleClick}
        onMouseUp={this.handleClick}
        onMouseMove={this.handleClick}
      >
        <InfoPoint
          title="Автоматическая система открытия/закрытия"
          position={{ top: 22, left: 30 }}
          place="before"
        >
          Можете управлять всей солнцезащитной системой со своего смартфона или
          с пульта
        </InfoPoint>
        <InfoPoint
          title="Автоматическая система открытия/закрытия"
          position={{ top: 72, left: 70 }}
          place="after"
        >
          "Можете управлять всей солнцезащитной системой со своего смартфона или
          с пульта"
        </InfoPoint>
        <InfoPoint
          title="Автоматическая система открытия/закрытия"
          position={{ top: 85, left: 15 }}
          place="both"
        >
          "Можете управлять всей солнцезащитной системой со своего смартфона или
          с пульта"
        </InfoPoint>
      </ImageComparison>
    );
  }
  getSeparatorPosition = e => {
    const { width, left } = this.sliderElement.getBoundingClientRect();

    const separatorPosition = e.clientX - left;
    const persentSeparatorPosition = separatorPosition / width;

    if (persentSeparatorPosition > 1) {
      return 1;
    }
    if (persentSeparatorPosition < 0) {
      return 0;
    }

    return persentSeparatorPosition;
  };

  setSeparatorPosition(separatorLeft) {
    this.setState({
      separatorLeft
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

export default ImageComparisonContainer;

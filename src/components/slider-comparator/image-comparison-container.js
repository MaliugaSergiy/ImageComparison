import React, { Component } from "react";

import InfoPoint from "../info-point/info-point.jsx";
import ImageComparison from "./image-comparison.jsx";

const before =
  "https://juxtapose.knightlab.com/static/img/Sochi_11April2005.jpg";
const after = "https://juxtapose.knightlab.com/static/img/Sochi_22Nov2013.jpg";

class ImageComparisonContainer extends Component {
  state = {
    separatorLeft: 0.55,
    separatorMoveState: false
  };

  sliderElement = null;

  render() {
    const { separatorLeft, separatorMoveState } = this.state;
    return (
      <ImageComparison
        before={before}
        after={after}
        scrollState={separatorMoveState}
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
        onMouseLeave={this.handleMouseLeave}
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
  getSeparatorLeftPosition = e => {
    const { width, left } = this.sliderElement.getBoundingClientRect();

    const separatorPosition = e.clientX - left;
    const percentSeparatorPosition = separatorPosition / width;

    if (percentSeparatorPosition > 1) {
      return 1;
    }
    if (percentSeparatorPosition < 0) {
      return 0;
    }

    return percentSeparatorPosition;
  };

  setSeparatorPosition(separatorLeft) {
    this.setState({
      separatorLeft
    });
  }

  changeScrollState(separatorMoveState) {
    this.setState({
      separatorMoveState
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
    const separatorLeftPosition = this.getSeparatorLeftPosition(e);

    if (this.state.separatorMoveState) {
      this.setSeparatorPosition(separatorLeftPosition);
    }
  };

  handleSliderClick = e => {
    const separatorLeftPosition = this.getSeparatorLeftPosition(e);

    this.setSeparatorPosition(separatorLeftPosition);
  };
}

export default ImageComparisonContainer;

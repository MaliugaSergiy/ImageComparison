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
    const { separatorLeft } = this.state;
    return (
      <ImageComparison
        before={before}
        after={after}
        separatorPosition={{ left: separatorLeft }}
        Ref={this.setSliderRef}
        onScrollStateChange={this.handleScrollStateChange}
        onClick={this.handleClick}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
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

  changeSeparatorMoveState(separatorMoveState) {
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
    this.changeSeparatorMoveState(state);
  };

  handleMouseLeave = () => {
    this.changeSeparatorMoveState(false);
  };

  /** */
  handleClick = e => {
    const separatorLeftPosition = this.getSeparatorLeftPosition(e);
    const { clickableImage } = this.props;

    if (!clickableImage) {
      return;
    }

    this.setSeparatorPosition(separatorLeftPosition);
  };

  handleMouseMove = e => {
    const separatorLeftPosition = this.getSeparatorLeftPosition(e);

    if (this.state.separatorMoveState) {
      this.setSeparatorPosition(separatorLeftPosition);
    }
  };

  handleMouseDown = e => {
    e.preventDefault();
    this.changeSeparatorMoveState(true);
  };

  handleMouseUp = () => {
    this.changeSeparatorMoveState(false);
  };
}

export default ImageComparisonContainer;

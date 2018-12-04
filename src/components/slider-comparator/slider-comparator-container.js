import React, { Component } from "react";

import SliderComparator from "./slider-comparator.jsx";

const images = [
  "https://juxtapose.knightlab.com/static/img/Sochi_11April2005.jpg",

  "https://juxtapose.knightlab.com/static/img/Sochi_22Nov2013.jpg"
];

const infoPoints = [
  {
    title: "Автоматичесая система открытия/закрытия",
    description:
      "Можете управлять всей солнцезащитной системой со своего смартфона или с пульта",
    position: {
      top: 22,
      left: 30
    }
  },
  {
    title: "Автоматичесая система открытия/закрытия",
    description:
      "Можете управлять всей солнцезащитной системой со своего смартфона или с пульта",
    position: {
      top: 70,
      left: 56
    }
  },
  {
    title: "Автоматичесая система открытия/закрытия",
    description:
      "Можете управлять всей солнцезащитной системой со своего смартфона или с пульта",
    position: {
      top: 12,
      left: 80
    }
  }
];

class SliderCompatarorContainer extends Component {
  state = {
    separatorPosition: 70,
    scrollState: false
  };

  render() {
    const { separatorPosition, scrollState } = this.state;
    return (
      <SliderComparator
        images={images}
        scrollState={scrollState}
        separatorPosition={separatorPosition}
        infoPoints={infoPoints}
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

export default SliderCompatarorContainer;

import React, { Component } from "react";

import "./App.css";

import SliderComparatorContainer from "./components/slider-comparator/image-comparison-container";

import Container from "./components/container/container";

import leftImage from "./assets/images/left_images.jpg";
import rightImage from "./assets/images/right_images.jpg";

const infoPoints = [
  {
    title: "left Автоматическая система открытия/закрытия",
    description:
      "Можете управлять всей солнцезащитной системой со своего смартфона или с пульта",
    position: { top: 0.22, left: 0.5 },
    place: "left"
  },
  {
    title: "right Автоматическая система открытия/закрытия",
    description:
      "Можете управлять всей солнцезащитной системой со своего смартфона или с пульта",
    position: { top: 0.8, left: 0.9 },
    place: "right"
  },
  {
    title: "right sdsdsd sdsdsdfssdgdfdfgdfgd",
    description:
      " dgdfg dfg dg df gdfg dfg dfg dg dg dg dfg dfg dgdfg dgdf gdfg dg dg dfg dfg dgdfg dgdf gdfg",
    position: { top: 0.8, left: 0.9 },
    place: "left"
  },
  {
    title: "both Автоматическая система открытия/закрытия",
    description:
      "Можете управлять всей солнцезащитной системой со своего смартфона или с пульта",
    position: { top: 0.85, left: 0.15 },
    place: "both"
  }
];

class App extends Component {
  render() {
    return (
      <div className="App">
        <Container>
          {/* <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br /> */}
          <SliderComparatorContainer
            clickableImage={true}
            right={rightImage}
            left={leftImage}
            infoPoints={infoPoints}
            initialSeparatorLeftPosition={0.57}
            increaseByHover={true}
          />
        </Container>
      </div>
    );
  }
}

export default App;

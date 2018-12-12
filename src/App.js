import React, { Component } from "react";

import "./App.css";

import SliderComparatorContainer from "./components/slider-comparator/image-comparison-container";

import Container from "./components/container/container";

import leftImage from "./assets/images/left_images.jpg";
import rightImage from "./assets/images/right_images.jpg";

const infoPoints = [
  {
    title: "Автоматическая система открытия/закрытия",
    description:
      "Можете управлять всей солнцезащитной системой со своего смартфона или с пульта",
    position: { top: 22, left: 50 },
    place: "after"
  },
  {
    title: "Автоматическая система открытия/закрытия",
    description:
      "Можете управлять всей солнцезащитной системой со своего смартфона или с пульта",
    position: { top: 72, left: 70 },
    place: "before"
  },
  {
    title: "Автоматическая система открытия/закрытия",
    description:
      "Можете управлять всей солнцезащитной системой со своего смартфона или с пульта",
    position: { top: 85, left: 15 },
    place: "both"
  }
];

class App extends Component {
  render() {
    return (
      <div className="App">
        <Container>
          <SliderComparatorContainer
            clickableImage={true}
            before={leftImage}
            after={rightImage}
            infoPoints={infoPoints}
            initialSeparatorLeftPosition={0.57}
            increaseByHover={true}
            initialStateDelay={2000}
            initiallySelectedElement={null}
          />
        </Container>
      </div>
    );
  }
}

export default App;

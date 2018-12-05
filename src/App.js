import React, { Component } from "react";

import "./App.css";

import SliderComparatorContainer from "./components/slider-comparator/image-comparison-container";

import Container from "./components/container/container";

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
            before="https://juxtapose.knightlab.com/static/img/Sochi_11April2005.jpg"
            after="https://juxtapose.knightlab.com/static/img/Sochi_22Nov2013.jpg"
            infoPoints={infoPoints}
          />
        </Container>
      </div>
    );
  }
}

export default App;

import React, { Component } from "react";

import "./App.css";

import SliderComparatorContainer from "./components/slider-comparator/image-comparison-container";

import Container from "./components/container/container";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Container>
          <SliderComparatorContainer clickableImage={true} />
        </Container>
      </div>
    );
  }
}

export default App;

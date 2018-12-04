import React, { Component } from "react";

import "./App.css";

import SliderComparatorContainer from "./components/slider-comparator/slider-comparator-container";

import Container from "./components/container/container";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Container>
          <SliderComparatorContainer />
        </Container>
      </div>
    );
  }
}

export default App;

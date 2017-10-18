import React, { Component } from 'react';
import './App.css';
import Canvas from './components/GraphEditorCanvas';
import {range} from 'd3-array';
import phyllotaxis from './utils/phyllotaxis';

const points = range(1, 20).map(phyllotaxis(10));

class App extends Component {
  render() {
    const links = [];

    return (
      <div className="App">
        <Canvas points={points} links={links} />
      </div>
    );
  }
}

export default App;

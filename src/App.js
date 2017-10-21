import React, {Component} from 'react';
import {Provider} from 'react-redux';

import Description from './components/Description';
import GraphEditorCanvas from './components/GraphEditorCanvas';
import State from './components/State';

import store from './store';

import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <State />
          <GraphEditorCanvas />
          <Description />
        </div>
      </Provider>
    );
  }
}

export default App;

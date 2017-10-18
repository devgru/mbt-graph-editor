import {createStore, compose} from 'redux';
import duck from './duck';

const initialState = undefined;
const enhancers = [];

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const store = createStore(
  duck,
  initialState,
  compose(...enhancers)
);

export default store;

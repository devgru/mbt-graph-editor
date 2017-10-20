import {applyMiddleware, createStore, compose} from 'redux';
import duck from './duck';
import thunk from 'redux-thunk';

const initialState = undefined;
const enhancers = [];

const devtoolsCompose =
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const composeEnhancers = devtoolsCompose || compose;

const store = createStore(
  duck,
  initialState,
  composeEnhancers(
    ...enhancers,
    applyMiddleware(thunk)
  )
);

export default store;

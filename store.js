import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

const initStore = (reducer, initialState, isServer) => {
  if (isServer && typeof window === 'undefined') {
    return createStore(reducer, initialState, applyMiddleware(thunkMiddleware));
  }

  if (!window.store) {
    window.store = createStore(reducer, initialState, applyMiddleware(thunkMiddleware));
  }

  return window.store;
};

export default initStore;

import React from 'react';
import request from 'superagent';

import { Provider } from 'react-redux';

import ResetPassword from '../components/connectors/ResetPassword';

import initStore from '../store';
import reducer from '../reducer';

export default class extends React.Component {
  // eslint-disable-next-line no-unused-vars
  static async getInitialProps({ path, query, req, res }) {
    const isServer = !!req;
    const store = initStore(reducer, {}, isServer);
    return { initialState: store.getState(), isServer };
  }

  constructor(props) {
    super(props);
    const initialState = props.initialState;
    initialState.url = props.url;
    this.store = initStore(reducer, initialState, props.isServer);
  }

  render() {
    return (
      <Provider store={this.store}>
        <ResetPassword />
      </Provider>
    );
  }
}

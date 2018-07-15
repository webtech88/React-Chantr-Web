import React from 'react';
import request from 'superagent';
import { Provider } from 'react-redux';
import initStore from '../store';
import reducer from '../reducer';
import DeleteSignatureBlockUser from '../components/connectors/DeleteSignatureBlockUser';

export default class extends React.Component {
  static async getInitialProps({ query, req }) {
    const isServer = !!req;
    const headers = (req && req.headers) || {};
    let API_URL;
    if (isServer) {
      API_URL = process.env.API_URL;
    } else {
      API_URL = '';
    }
    const store = initStore(reducer, {}, isServer);
    return { initialState: store.getState(), isServer, API_URL };
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
        <DeleteSignatureBlockUser />
      </Provider>
    );
  }
}

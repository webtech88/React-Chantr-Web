import React from 'react';
import { Provider } from 'react-redux';
import request from 'superagent';

import initStore from '../store';
import reducer from '../reducer';
import Youtuber from '../components/connectors/Youtuber';

export default class extends React.Component {

  static async getInitialProps({ req }) {
    const isServer = !!req;
    const headers = (req && req.headers) || {};
    const API_URL = isServer ? process.env.API_URL : '';

    const auth = request.get(`${API_URL}/api/v3/auth/status`);

    if (isServer) {
      auth.set(headers);
    } else {
      auth.withCredentials();
    }

    const loginStatus = await auth.then((success) => {
      return JSON.parse(success.text);
    });
    const store = initStore(reducer, {loginStatus}, isServer);
    return { initialState: store.getState(), isServer };
  }

  constructor(props) {
    super(props);
    const initialState = props.initialState;
    initialState.url = props.url;
    this.store = initStore(reducer, initialState, props.isServer);
  }

  componentDidMount() {
    if (!this.props.url.query.step) {
      window.location = '/youtuber/1';
    }
  }

  render() {
    return (
      <Provider store={this.store}>
        <Youtuber />
      </Provider>
    );
  }
}

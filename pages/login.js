import React from 'react';
import request from 'superagent';
import { Provider } from 'react-redux';

import initStore from '../store';
import reducer from '../reducer';
import Login from '../components/connectors/Login';

export default class extends React.Component {
  // eslint-disable-next-line no-unused-vars
  static async getInitialProps({ path, query, req, res }) {
    const isServer = !!req;
    const headers = (req && req.headers) || {};

    let API_URL;
    let loginStatus;

    if (isServer) {
      API_URL = process.env.API_URL;
      loginStatus = await request.get(`${API_URL}/api/v3/auth/status`).set(headers).then((success) => {
        return JSON.parse(success.text);
      });
    } else {
      API_URL = '';
      loginStatus = await request.get(`${API_URL}/api/v3/auth/status`).withCredentials().then((success) => {
        return JSON.parse(success.text);
      });
    }

    const store = initStore(reducer, { isLogin: loginStatus.loggedIn }, isServer);
    return { initialState: store.getState(), isServer };
  }

  constructor(props) {
    super(props);
    const initialState = props.initialState;
    initialState.url = props.url;
    this.store = initStore(reducer, initialState, props.isServer);
  }

  componentWillMount() {
    this.store.dispatch({ type: 'CLEAR_PROFILE_DATA' });
    const states = this.store.getState();
    if (states.isLogin) {
      states.url.push('/profile');
    }
  }

  render() {
    return (
      <Provider store={this.store}>
        <Login />
      </Provider>
    );
  }
}

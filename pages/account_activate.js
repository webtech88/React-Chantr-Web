import React from 'react';
import request from 'superagent';

import { Provider } from 'react-redux';

import AccountActivate from '../components/connectors/AccountActivate';

import initStore from '../store';
import reducer from '../reducer';

export default class extends React.Component {
  // eslint-disable-next-line no-unused-vars
  static async getInitialProps({ path, query, req, res }) {
    const isServer = !!req;
    const headers = (req && req.headers) || {};
    let API_URL;
    if (isServer) {
      API_URL = process.env.API_URL;
    } else {
      API_URL = '';
    }
    const response = await Promise.all([
      request.get(`${API_URL}/api/v3${req.url}`)
        .set(headers)
        .then((resp) => {
          return { accountStatus: JSON.parse(resp.text), success: JSON.parse(resp.text).success };
        }),
      request.get(`${API_URL}/api/v3/users/${query.id}`)
        .set(headers)
        .then((success1) => {
          return { loggedUser: JSON.parse(success1.text) };
        }),
    ]).then(([{ accountStatus, success }, { loggedUser }]) => {
      const store = initStore(reducer, { accountStatus, success, loggedUser, card_id: query.card_id, isYoutuber: query.youtuber }, isServer);
      return { initialState: store.getState(), isServer };
    })
    .catch((error) => {
      if (isServer) {
        console.log(error);
      }
      const store = initStore(reducer, { error }, isServer);
      return { initialState: store.getState(), isServer };
    });
    return response;
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
        <AccountActivate />
      </Provider>
    );
  }

}

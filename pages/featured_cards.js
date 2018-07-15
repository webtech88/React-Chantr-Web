import React from 'react';
import request from 'superagent';
import { Provider } from 'react-redux';

import initStore from '../store';
import reducer from '../reducer';
import FeaturedCards from '../components/connectors/FeaturedCards';

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

    const data = await Promise.all([
      request.get(`${API_URL}/api/v3/cards/featured?limit=4&offset=0`)
        .set(headers)
          .then((success) => {
            return { featuredCards: JSON.parse(success.text) };
          }),
    ]).then(([{ featuredCards }]) => {
      const store = initStore(reducer, {
        featuredCards,
        isfeaturedCardsLoading: false,
      }, isServer);
      if (!isServer) {
        store.dispatch({ type: 'GET_FEATURED_CARDS', featuredCards });
        store.dispatch({ type: 'IS_FEATURED_CARDS_LOADING', isfeaturedCardsLoading: false });
      }
      return { initialState: store.getState(), isServer };
    })
    .catch((error) => {
      if (isServer) {
        console.log(error);
      }
      const store = initStore(reducer, { error }, isServer);
      return { initialState: store.getState(), isServer };
    });

    return data;
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
        <FeaturedCards />
      </Provider>
    );
  }
}

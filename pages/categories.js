import React from 'react';
import request from 'superagent';
import { Provider } from 'react-redux';

import initStore from '../store';
import reducer from '../reducer';
import Categories from '../components/connectors/Categories';

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
      request.get(`${API_URL}/api/v3/chants/categories/all`)
        .set(headers)
        .then((success) => {
          return { cardsCategories: JSON.parse(success.text).categories };
        }),
      request.get(`${API_URL}/api/v3/chants?category=birthday`)
        .set(headers)
        .then((success) => {
          return { categoryCards: JSON.parse(success.text) };
        }),
    ]).then(([{ cardsCategories }, { categoryCards }]) => {
      const store = initStore(reducer, {
        cardsCategories,
        categoryCards,
        activeCategory: { name: 'birthday', display_name: 'Birthday' },
      }, isServer);
      if (!isServer) {
        store.dispatch({ type: 'GET_CARDS_CATEGORIES', cardsCategories });
        store.dispatch({ type: 'GET_CATEGORY_CARDS', categoryCards });
        store.dispatch({ type: 'GET_ACTIVE_CATEGORY', activeCategory: { name: 'birthday', display_name: 'Birthday' } });
      }
      return { initialState: store.getState(), isServer };
    })
    .catch((error) => {
      if (isServer) {
        console.log(error);
      }
      const store = initStore(reducer, { error }, isServer);
      return { initialState: store.getState(), isServer, isCard: false };
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
        <Categories />
      </Provider>
    );
  }
}

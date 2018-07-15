import React from 'react';
import request from 'superagent';
import { Provider } from 'react-redux';

import initStore from '../store';
import reducer from '../reducer';
import Card from '../components/connectors/Card';

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
    if (query.id) {
      const data = await Promise.all([
        request.get(`${API_URL}/api/v3/auth/status`)
          .set(headers)
          .then((success) => {
            const result = JSON.parse(success.text);
            if (result.loggedIn) {
              return request.get(`${API_URL}/api/v3/users/${result.userId}`)
                .set(headers)
                .then((response) => {
                  const rs = JSON.parse(response.text);
                  return { isLogin: result.loggedIn, loggedUser: rs };
                });
            }
            return {};
          }),
        request.get(`${API_URL}/api/v3/chants/${query.id}`)
          .set(headers)
          .then((success) => {
            const cardInfo = JSON.parse(success.text);
            return request.get(`${API_URL}/api/v3/users/${cardInfo.owner}`)
              .set(headers)
              .then((response) => {
                const cardOwner = JSON.parse(response.text);
                return { cardInfo, cardOwner };
              });
          }),
        request.get(`${API_URL}/api/v3/chants/${query.id}/board?hull=true`)
          .set(headers)
          .then((success) => {
            const cardBoardInfo = JSON.parse(success.text);
            cardBoardInfo.partial_board = `${cardBoardInfo.partial_board}?v=${Math.random()}`;
            return { cardBoardInfo };
          }),
        request.get(`${API_URL}/api/v3/chants/${query.id}/images?limit=250&skip=0`)
          .set(headers)
          .then((success) => {
            const cardImages = JSON.parse(success.text);
            return { cardImages };
          }),
        request.get(`${API_URL}/api/v3/chants/${query.id}/signatures?limit=50&skip=0`)
          .set(headers)
          .then((success) => {
            const cardSignatures = JSON.parse(success.text);
            return { cardSignatures };
          }),
        request.get(`${API_URL}/api/v3/chants/${query.id}/board/members?limit=9&skip=0`)
          .set(headers)
          .then((success) => {
            const cardMembers = JSON.parse(success.text);
            return { cardMembers };
          }),
        request.get(`${API_URL}/api/v3/chants/categories/all`)
          .set(headers)
          .then((success) => {
            return { cardsCategories: JSON.parse(success.text).categories };
          }),
      ]).then(([
        { isLogin, loggedUser },
        { cardInfo, cardOwner },
        { cardBoardInfo },
        { cardImages },
        { cardSignatures },
        { cardMembers },
        { cardsCategories }
      ]) => {
        return {
          isLogin,
          cardInfo,
          loggedUser,
          cardOwner,
          cardBoardInfo,
          cardImages,
          cardSignatures,
          cardMembers,
          cardsCategories,
          BASE_URL: process.env.BASE_URL,
          isServer,
          isCard: true
        };
      })
      .catch((error) => {
        return { error, isServer, isCard: false };
      });

      return data;
    }
  }

  constructor(props) {
    super(props);
    this.store = initStore(reducer, props, props.isServer);
    if (!props.isCard) {
      props.url.replace('/404')
    } else if (!props.isServer && !props.error) {
      const BASE_URL = process.env.BASE_URL;
      store.replaceReducer(reducer);
      store.dispatch({ type: 'CLEAR_CARD_DATA' });
      store.dispatch({ type: 'LOGIN', isLogin: props.isLogin });
      store.dispatch({ type: 'LOGGEDIN_USER', loggedUser: props.loggedUser });
      store.dispatch({ type: 'CARD_INFO', cardInfo: props.cardInfo });
      store.dispatch({ type: 'GET_CARD_OWNER_DATA', cardOwner: props.cardOwner });
      store.dispatch({ type: 'LOADING', isLoading: false });
      store.dispatch({ type: 'CARD_BOARD_INFO', cardBoardInfo: props.cardBoardInfo });
      store.dispatch({ type: 'CARD_IMAGES', cardImages: props.cardImages });
      store.dispatch({ type: 'CARD_SIGNATURES', cardSignatures: props.cardSignatures });
      store.dispatch({ type: 'CARD_MEMBERS', cardMembers: props.cardMembers });
      store.dispatch({ type: 'GET_CARDS_CATEGORIES', cardsCategories: props.cardsCategories });
      store.dispatch({ type: 'BASE_URL', BASE_URL });
      store.dispatch({ type: 'UPDATE_URL', url: props.url });
    }
  }

  render() {
    return (
      <Provider store={this.store}>
        <Card />
      </Provider>
    );
  }
}

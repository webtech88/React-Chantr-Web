import React from 'react';
import request from 'superagent';
import { Provider } from 'react-redux';

import initStore from '../store';
import reducer from '../reducer';
import Profile from '../components/connectors/Profile';

export default class extends React.Component {
  // eslint-disable-next-line no-unused-vars
  static async getInitialProps({ path, query, req, res }) {
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
    const userID = query.id || loginStatus.userId;
    const userInfo = request.get(`${API_URL}/api/v3/users/${userID}`);
    const cards = request.get(`${API_URL}/api/v3/chants?status=published&owner=${userID}&limit=4&skip=0`);
    const myjoins = request.get(`${API_URL}/api/v3/chants/myjoins?limit=4&skip=0`);
    const eventsData = request.get(`${API_URL}/api/v3/users/events`);
    const joins = request.get(`${API_URL}/api/v3/chants/joins/${userID}?limit=4&skip=0`);

    if (isServer) {
      userInfo.set(headers);
      cards.set(headers);
      myjoins.set(headers);
      eventsData.set(headers);
      joins.set(headers);
    } else {
      userInfo.withCredentials();
      cards.withCredentials();
      myjoins.withCredentials();
      eventsData.withCredentials();
      joins.withCredentials();
    }

    if (!loginStatus.loggedIn) {
      if (!query.id) {
        const store = initStore(reducer, {}, isServer);
        return { initialState: store.getState(), isServer, isLogin: loginStatus.loggedIn };
      }
      const data = await Promise.all([
        userInfo.then((success) => {
          return { user: JSON.parse(success.text) };
        }),
        cards.then((success) => {
          return { userCards: JSON.parse(success.text) };
        }),
      ]).then(([{ user }, { userCards }]) => {
        const store = initStore(reducer, { user, userCards }, isServer);
        if (!isServer) {
          store.dispatch({ type: 'CLEAR_PROFILE_DATA' });
          store.dispatch({ type: 'GET_USER_DATA', user });
          store.dispatch({ type: 'USER_CARDS', userCards });
        }
        return { initialState: store.getState(), isServer, isLogin: loginStatus.loggedIn };
      })
      .catch((error) => {
        if (isServer) {
          console.log(error);
        }
        const store = initStore(reducer, { error }, isServer);
        return { initialState: store.getState(), isServer, isLogin: loginStatus.loggedIn };
      });

      return data;
    }

    if (query.id && (loginStatus.userId !== query.id)) {
      const data = await Promise.all([
        userInfo.then((success) => {
          return { user: JSON.parse(success.text) };
        }),
        cards.then((success) => {
          return { userCards: JSON.parse(success.text) };
        }),
        joins.then((success) => {
          return { userJoinedCards: JSON.parse(success.text) };
        }),
      ]).then(([{ user }, { userCards }, { userJoinedCards }]) => {
        const store = initStore(reducer, {
          user,
          userId: loginStatus.userId,
          userCards,
          userJoinedCards,
        }, isServer);
        if (!isServer) {
          store.dispatch({ type: 'CLEAR_PROFILE_DATA' });
          store.dispatch({ type: 'GET_USER_DATA', user });
          store.dispatch({ type: 'USER_CARDS', userCards });
          store.dispatch({ type: 'USER_ID', userId: loginStatus.userId });
          store.dispatch({ type: 'USER_JOINED_CARDS', userJoinedCards });
        }
        return { initialState: store.getState(), isServer, isLogin: loginStatus.loggedIn };
      })
      .catch((error) => {
        if (isServer) {
          console.log(error);
        }
        const store = initStore(reducer, { error }, isServer);
        return { initialState: store.getState(), isServer, isLogin: loginStatus.loggedIn };
      });

      return data;
    }

    const data = await Promise.all([
      userInfo.then((success) => {
        return { user: JSON.parse(success.text) };
      }),
      cards.then((success) => {
        return { userCards: JSON.parse(success.text) };
      }),
      myjoins.then((success) => {
        return { loginUserJoinedCards: JSON.parse(success.text) };
      }),
      eventsData.then((success) => {
        return { events: JSON.parse(success.text) };
      }),
    ]).then(([{ user }, { userCards }, { loginUserJoinedCards }, { events }]) => {
      const store = initStore(reducer, {
        user,
        userId: loginStatus.userId,
        userCards,
        loginUserJoinedCards,
        events,
      }, isServer);
      if (!isServer) {
        store.dispatch({ type: 'CLEAR_PROFILE_DATA' });
        store.dispatch({ type: 'GET_USER_DATA', user });
        store.dispatch({ type: 'GET_EVENTS', events });
        store.dispatch({ type: 'USER_CARDS', userCards });
        store.dispatch({ type: 'USER_ID', userId: loginStatus.userId });
        store.dispatch({ type: 'LOGIN_USER_JOINED_CARDS', loginUserJoinedCards });
      }
      return { initialState: store.getState(), isServer, isLogin: loginStatus.loggedIn };
    })
    .catch((error) => {
      if (isServer) {
        console.log(error);
      }
      const store = initStore(reducer, { error }, isServer);
      return { initialState: store.getState(), isServer, isLogin: loginStatus.loggedIn };
    });

    return data;
  }

  constructor(props) {
    super(props);
    const initialState = props.initialState;
    initialState.url = props.url;
    this.store = initStore(reducer, initialState, props.isServer);
    if (!this.props.isLogin) {
      this.props.url.push('/login');
    }
  }

  render() {
    return (
      <Provider store={this.store}>
        <Profile />
      </Provider>
    );
  }
}

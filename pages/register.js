import React from 'react';
import { Provider } from 'react-redux';

import Register from '../components/connectors/Register';

import initStore from '../store';
import reducer from '../reducer';

import { isLogin } from '../Actions';


export default class extends React.Component {
  // eslint-disable-next-line no-unused-vars
  static getInitialProps({ path, query, req, res }) {
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

  componentWillMount() {
    this.store.dispatch({ type: 'CLEAR_PROFILE_DATA' });
    const state = this.store.getState();
    this.store.dispatch(isLogin(state, (res) => {
      if (res.loggedIn) {
        state.url.push('/profile');
      }
    }));
  }

  render() {
    return (
      <Provider store={this.store}>
        <Register />
      </Provider>
    );
  }
}

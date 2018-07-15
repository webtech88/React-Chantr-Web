import React from 'react';
import { Provider } from 'react-redux';

import Unsubscribe from '../components/connectors/Unsubscribe';

import initStore from '../store';
import reducer from '../reducer';

import { getUnsubscribeData } from '../Actions';

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
    if (this.props.url.query.token) {
      this.store.dispatch(getUnsubscribeData(encodeURIComponent(this.props.url.query.token)));
    } else {
      this.props.url.push('/');
    }
  }

  render() {
    return (
      <Provider store={this.store}>
        <Unsubscribe />
      </Provider>
    );
  }
}

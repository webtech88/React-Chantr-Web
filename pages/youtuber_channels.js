import React from 'react';
import { Provider } from 'react-redux';

import initStore from '../store';
import reducer from '../reducer';
import YoutuberChannels from '../components/connectors/YoutuberChannels';

export default class extends React.Component {

  static async getInitialProps({ req }) {
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

  render() {
    return (
      <Provider store={this.store}>
        <YoutuberChannels />
      </Provider>
    );
  }
}

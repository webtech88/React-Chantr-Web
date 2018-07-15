import React from 'react';

export default class extends React.Component {
  // eslint-disable-next-line no-unused-vars
  static getInitialProps({ path, query, req, res }) {
    const isServer = !!req;
    let API_URL;
    if (isServer) {
      API_URL = process.env.API_URL;
    } else {
      API_URL = '';
    }
    return { API_URL };
  }

  componentDidMount() {
    window.location = `${this.props.API_URL}/api/v3/flags`;
  }

  render() {
    return (
      <div />
    );
  }
}

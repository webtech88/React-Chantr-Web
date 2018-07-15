import React from 'react';
import request from 'superagent';
import Head from 'next/head';

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

    const auth = request.get(`${API_URL}/api/v3/auth/status`);
    if (isServer) {
      auth.set(headers);
    } else {
      auth.withCredentials();
    }
    const loginStatus = await auth.then((success) => {
      return JSON.parse(success.text);
    });

    let user;
    let sign;
    if (loginStatus.loggedIn) {
      const userID = loginStatus.userId;
      const userInfo = request.get(`${API_URL}/api/v3/users/${userID}`);
      const signInfo = request.get(`${API_URL}/api/v3/chants/${query.id}/board/has_signed`);
      if (isServer) {
        userInfo.set(headers);
        signInfo.set(headers);
      } else {
        userInfo.withCredentials();
        signInfo.withCredentials();
      }
      user = await userInfo.then((success) => {
        return JSON.parse(success.text);
      });
      sign = await signInfo.then((success) => {
        return JSON.parse(success.text);
      }, (failure) => {
        return JSON.parse(failure.response.text);
      });
    }

    if (query.id) {
      const data = await Promise.all([
        request.get(`${API_URL}/api/v3/chants/${query.id}`)
          .set(headers)
          .then((success) => {
            const cardInfo = JSON.parse(success.text);
            return cardInfo;
          }),
        request.get(`${API_URL}/api/v3/chants/${query.id}/board`)
          .set(headers)
          .then((success) => {
            const cardBoardInfo = JSON.parse(success.text);
            return cardBoardInfo;
          }),
      ]).then(([cardInfo, cardBoardInfo]) => {
        return { cardInfo, cardBoardInfo, login: loginStatus.loggedIn, user, sign };
      })
      .catch((error) => {
        if (isServer) {
          // eslint-disable-next-line no-console
          console.log(error);
        }
        return { error };
      });

      return data;
    }

    return {};
  }

  constructor(props) {
    super(props);
    if (props.error) {
      props.url.replace('/404');
    }
  }

  render() {
    if (!this.props.login) {
      return (
        <div
          style={{
            textAlign: 'center',
            fontFamily: 'sans-serif',
            color: '#404040',
            marginTop: '30px',
          }}
        >
          <img src="/static/images/wishyoo_logo.png" width="200" />
          <br />
          <p>Please login to add your dedication.</p>
          <a
            href={`/card/${this.props.cardInfo.id}`}
            style={{ color: '#FF8A15', textDecoration: 'underline' }}
          >
            go back
          </a>
        </div>
      );
    }
    if (this.props.sign && this.props.sign.has_signed) {
      return (
        <div
          style={{
            textAlign: 'center',
            fontFamily: 'sans-serif',
            color: '#404040',
            marginTop: '30px',
          }}
        >
          <img src="/static/images/wishyoo_logo.png" width="200" />
          <br />
          <p>
            You already have added your signature on&nbsp;
            <span style={{ color: '#FF8A15' }}>
              {this.props.cardInfo.title}
            </span>
          </p>
          <a
            href={`/card/${this.props.cardInfo.id}`}
            style={{ color: '#FF8A15', textDecoration: 'underline' }}
          >
            go back
          </a>
        </div>
      );
    } else if (this.props.cardInfo && !this.props.cardInfo.hasBoard) {
      return (
        <div
          style={{
            textAlign: 'center',
            fontFamily: 'sans-serif',
            color: '#404040',
            marginTop: '30px',
          }}
        >
          <img src="/static/images/wishyoo_logo.png" width="200" />
          <br />
          <p>
            This card <span style={{ color: '#FF8A15' }}>
              {this.props.cardInfo.title}
            </span> does not have signature board&nbsp;
          </p>
          <a
            href={`/card/${this.props.cardInfo.id}`}
            style={{ color: '#FF8A15', textDecoration: 'underline' }}
          >
            go back
          </a>
        </div>
      );
    } else if (this.props.cardInfo && this.props.cardInfo.isSubmitted) {
      return (
        <div
          style={{
            textAlign: 'center',
            fontFamily: 'sans-serif',
            color: '#404040',
            marginTop: '30px',
          }}
        >
          <img src="/static/images/wishyoo_logo.png" width="200" />
          <br />
          <p>
            This card <span style={{ color: '#FF8A15' }}>
              {this.props.cardInfo.title}
            </span> has been already sent to recipient : <span style={{ color: '#FF8A15' }}> {this.props.cardBoardInfo.recipient[0].name}</span>&nbsp;
          </p>
          <a
            href={`/card/${this.props.cardInfo.id}`}
            style={{ color: '#FF8A15', textDecoration: 'underline' }}
          >
            go back
          </a>
        </div>
      );
    }
    else if (!this.props.error) {
      return (
        <div>
          <Head>
            <link rel="stylesheet" href="/static/drawing/css/signature.css" />
          </Head>
          <a className="closeSignBoard" href={`/card/${this.props.url.query.id}`}>&#10005;</a>
          <iframe src={`/static/drawing/index.html?chant_id=${this.props.url.query.id}&theme=${this.props.cardBoardInfo.theme}`} height="100%" width="100%" />
        </div>
      );
    }
    return (
      <div />
    );
  }
}

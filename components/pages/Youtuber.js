import React from 'react';

import Head from '../layouts/Head';
import AppNavbar from '../layouts/Navbar';

import YoutubeStep1 from '../YoutubeStep1';
import YoutubeStep2 from '../YoutubeStep2';
import YoutubeStep3 from '../YoutubeStep3';
import YoutubeStep4 from '../YoutubeStep4';
import YoutubeStep5 from '../YoutubeStep5';
import HandleError from '../HandleError';

export default class Youtuber extends React.Component {

  constructor(props) {
    super(props);
    this.renderComponent = this.renderComponent.bind(this);
  }

  componentDidMount() {
    const youtuberData = JSON.parse(localStorage.getItem('youtuberData'));
    if (
      (
        (this.props.url.query.step !== '1') &&
        this.props.loginStatus.loggedIn
      )

      ||

      (
        (this.props.url.query.step !== '1') && !(youtuberData && youtuberData.callback)
      )

      ||

      (
        (this.props.url.query.step !== '1') &&
        !(
          youtuberData.callback.identifier &&
          youtuberData.callback.provider &&
          youtuberData.callback.protocol &&
          youtuberData.callback.accessToken &&
          youtuberData.callback.refreshToken &&
          youtuberData.callback.email
        )
      )
    ) {
      window.top.location = `/youtuber/1`;
    }
  }

  renderComponent() {
    switch (this.props.url.query.step) {
      case '1': return (
        <YoutubeStep1 {...this.props} />
      );
      case '2': return (
        <YoutubeStep2 {...this.props} />
      );
      case '3': return (
        <YoutubeStep3 {...this.props} />
      );
      case '4': return (
        <YoutubeStep4 {...this.props} />
      );
      case '5': return (
        <YoutubeStep5 {...this.props} />
      );
      default : return (
        <YoutubeStep1 {...this.props} />
      );
    }
  }

  render() {
    return (
      <div>
        <Head />
        <AppNavbar {...this.props} />
        <HandleError {...this.props} />
        <div>
          {this.renderComponent()}
        </div>
      </div>
    );
  }

}


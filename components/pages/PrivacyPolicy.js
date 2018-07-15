import React from 'react';

import Head from '../layouts/Head';
import FooterInnerPage from '../layouts/FooterInnerPage';
import AppNavbar from '../layouts/Navbar';
import HandleError from '../HandleError';

export default class PrivacyPolicy extends React.Component {
  render() {
    return (
      <div>
        <Head {...this.props} />
        <AppNavbar {...this.props} />
        <HandleError {...this.props} />
        <div className="container iframe_style">
          <div style={{ height: '66px' }} />
          <iframe
            src="/static/views/wishyoo_privacy_policy.html"
            width="100%"
            height="3000"
            frameBorder="0"
            scrolling="no"
            className="wishyoo_privacy_policy hidden-xs"
          />
          <iframe
            src="/static/views/wishyoo_privacy_policy.html"
            width="100%"
            height="400"
            frameBorder="0"
            scrolling="auto"
            className="visible-xs"
          />
        </div>
        <FooterInnerPage />
      </div>
    );
  }
}

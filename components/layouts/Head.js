import React from 'react';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress/nprogress.js';

NProgress.configure({ showSpinner: true });
Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};
Router.onRouteChangeError = () => {
  NProgress.done();
};

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: props.url ? props.url.pathname.replace('/', '').replace(/_/g, ' ') : undefined,
      googleVerificationKey: process.env.GOOGLE_SITE_VERIFICATION ? process.env.GOOGLE_SITE_VERIFICATION : '',
    };
  }

  render() {
    return (
      <div>
        <h1 style={{ display: 'none' }}>
          {this.props.username ? this.props.username : ''}
          {this.state.title ? this.state.title : ''}
        </h1>
        <Head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no" />
          <title>WishYoo{this.props.username ? ` - ${this.props.username}` : ''}{this.state.title ? ` - ${this.state.title}` : ''}</title>
          <meta name="author" content="WishYoo" />
          <meta
            name="keywords"
            content="
              Birthday,
              Get Well,
              Causes,
              Thank You,
              Wedding,
              Appreciation,
              Baby shower,
              Graduation,
              Christmas,
              Father’s Day,
              Mother’s Day,
              Farewell,
              Bridal Shower,
              Anniversary,
              Congratulations,
              Holiday,
              New Home,
              Sports,
              Welcome Home,
              Yearbook,
              Engagement"
          />
          <meta itemProp="name" content="Click on the picture and sign this card" />
          <meta itemProp="description" content="Click on the picture and sign this card" />
          <meta itemProp="image" content="http://wishyoo.com/images/wishyoo_logo.png" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="182" />
          <meta property="og:image:height" content="190" />
          <meta name="description" content="Click on the picture and sign this card" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:title" content="Click on the picture and sign this card" />
          <meta property="og:description" content="Click on the picture and sign this card" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="182" />
          <meta property="og:image:height" content="190" />
          <meta
            property="og:site_name"
            content="Click on the picture and sign this card"
          />
          <meta property="og:image" content="http://wishyoo.com/images/wishyoo_logo.png" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="182" />
          <meta property="og:image:height" content="190" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:description" content="Click on the picture and sign this card" />
          <meta name="twitter:title" content="Click on the picture and sign this card" />
          <meta name="twitter:image" content="http://wishyoo.com/images/wishyoo_logo.png" />
          <meta name="twitter:site" content="@wish_yoo" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="182" />
          <meta property="og:image:height" content="190" />
          <meta name="msapplication-TileImage" content="http://wishyoo.com/images/wishyoo_logo.png" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="182" />
          <meta property="og:image:height" content="190" />
          <meta name="msvalidate.01" content="" />
          <meta name="google-site-verification" content={this.state.googleVerificationKey} />
          <meta name="robots" content="index, follow" />
          <link rel="icon" href="/static/images/favicon.jpg" sizes="32x32" />
          <link rel="icon" href="/static/images/favicon.jpg" sizes="192x192" />
          <link rel="apple-touch-icon-precomposed" href="/static/images/favicon.jpg" />
          <meta name="msapplication-TileImage" content="/static/images/favicon.jpg" />

          {/* uncommnet this code when development */}

          {/*
          <link rel="stylesheet" href="/static/dist/css/bootstrap.min.css" />
          <link rel="stylesheet" href="/static/dist/css/react-select.css" />
          <link rel="stylesheet" href="/static/dist/css/accordion-slider.min.css" />
          <link rel="stylesheet" href="/static/css/font-face.css" />
          <link rel="stylesheet" href="/static/css/style.css" />
          <link rel="stylesheet" href="/static/dist/css/animate.min.css" />
          <link rel="stylesheet" href="/static/assets/icons/icons.css" />
          <link rel="stylesheet" href="/static/dist/css/font-awesome.min.css" />
          <link rel="stylesheet" href="/static/css/styles.css" />
          <link rel="stylesheet" href="/static/css/responsive.css" />
          <link rel="stylesheet" href="/static/css/colors/orange.css" />
          <link rel="stylesheet" href="/static/css/slick.css" />
          <link rel="stylesheet" href="/static/css/pages.css" />
          <link rel="stylesheet" href="/static/dist/css/sweetalert.css" />
          */}

          {/* comment this code when development */}
          <link rel="stylesheet" href="/static/dist/css/vendor.min.css?v=54" />
          <link rel="stylesheet" href="/static/dist/css/main.min.css?v=54" />

          <script src="/static/fixZooming.js?v=1" />
        </Head>

      </div>
    );
  }
}

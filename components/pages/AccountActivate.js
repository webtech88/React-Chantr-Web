import React from 'react';
import { Jumbotron, Button } from 'react-bootstrap';

import { Link, Router } from '../../routes';
import Head from '../layouts/Head';
import AppNavbar from '../layouts/Navbar';
import HandleError from '../HandleError';
import FooterInnerPage from '../layouts/FooterInnerPage';

export default class AccountActivate extends React.Component {

  componentDidMount() {
    if (this.props.isYoutuber) {
      window.location = '/youtuber_channels/1';
    } else if (this.props.card_id && this.props.success) {
      Router.pushRoute('card', {id: this.props.card_id});
    }
  }

  render() {
    return (
      <div>
        <Head {...this.props} />
        <AppNavbar {...this.props} />
        <HandleError {...this.props} />
        <div className="h64" />
        <div className="h64" />
        <div className="container">
          {this.props.error ?
            <Jumbotron>
              <h1>Failure!</h1>
              <p>Token is expired</p>
            </Jumbotron> :
            <Jumbotron>
              <h1>Success!</h1>
              <p>You have successfully created your wishyoo account</p>
              {!this.props.isLogin ?
                <p>
                  <br />
                  <Link href="/login"><a><Button id="lsubmit">Login</Button></a></Link>
                </p> : undefined
              }
            </Jumbotron>
          }
        </div>
        <div className="h64" />
        <FooterInnerPage />
      </div>
    );
  }
}

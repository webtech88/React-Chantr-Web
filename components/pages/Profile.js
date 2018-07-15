import React from 'react';
import { Alert } from 'react-bootstrap';

import Head from '../layouts/Head';
import FooterInnerPage from '../layouts/FooterInnerPage';
import AppNavbar from '../layouts/Navbar';
import HandleError from '../HandleError';

import Cards from '../Cards';
import Events from '../Events';
import UserInfo from '../UserInfo';

export default class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      alertVisible: true,
    };
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
  }

  handleAlertDismiss() {
    this.setState({ alertVisible: false });
  }

  componentDidMount() {
    window.store.dispatch({ type: 'SUCCESS', success: undefined });
  }

  render() {
    const isProfile = () => {
      if (this.props.url.query.id && this.props.userId) {
        return this.props.url.query.id === this.props.userId.toString();
      }
      return false;
    };

    const userCards = () => {
      let title;
      let cards;
      if (this.props.userCards && this.props.user) {
        if (isProfile() || isProfile() === undefined) {
          if (this.props.userCards.metadata.total > 0) {
            title = (<h3>
              Your Card{this.props.userCards.metadata.total > 1 ? 's' : ''}&nbsp;
              ( {this.props.userCards.metadata.total} )
            </h3>);
            cards = (<Cards
              data={this.props.userCards}
              actions={this.props.actions.getUserCards}
              isLoading={this.props.isuserCardsLoading}
              userId={this.props.user.id}
            />);
          } else {
            title = <h3>Your Card</h3>;
            cards = (<h3 className="text-center">
              You don&apos;t have created any WishYoo cards yet...
            </h3>);
          }
        } else {
          if (this.props.userCards.metadata.total > 0) {
            title = (<h3>
              Created Card{this.props.userCards.metadata.total > 1 ? 's' : ''}&nbsp;
              ( {this.props.userCards.metadata.total} )
            </h3>);
            cards = (<Cards
              data={this.props.userCards}
              actions={this.props.actions.getUserCards}
              isLoading={this.props.isuserCardsLoading}
              userId={this.props.user.id}
            />);
          } else {
            title = <h3>Created Card</h3>;
            cards = (<h3 className="text-center">
              {this.props.user.username} hasn&apos;t created any WishYoo cards yet...
            </h3>);
          }
        }
        return (
          <div>
            {title}
            {cards}
          </div>
        );
      }
      return false;
    };

    const loggedInUserJoinedCards = () => {
      let title;
      let cards;
      if (this.props.loginUserJoinedCards && this.props.user) {
        if (this.props.loginUserJoinedCards.metadata.total > 0) {
          title = (<h3>
            Joined Card{this.props.loginUserJoinedCards.metadata.total > 1 ? 's' : ''}&nbsp;
            ( {this.props.loginUserJoinedCards.metadata.total} )
          </h3>);
          cards = (<Cards
            data={this.props.loginUserJoinedCards}
            actions={this.props.actions.getLoginUserJoinedCards}
            isLoading={this.props.isloginUserJoinedCardsLoading}
            userId={this.props.user.id}
          />);
        } else {
          title = <h3>Joined Card</h3>;
          cards = <h3 className="text-center">You don&apos;t have joined any WishYoo cards yet...</h3>;
        }
      }
      return (
        <div>
          {title}
          {cards}
        </div>
      );
    };

    const anotherUserJoinedCards = () => {
      let title;
      let cards;
      if (this.props.userJoinedCards && this.props.user) {
        if (this.props.userJoinedCards.metadata.total > 0) {
          title = (<h3>
          Joined Card{this.props.userJoinedCards.metadata.total > 1 ? 's' : ''}&nbsp;
          ( {this.props.userJoinedCards.metadata.total} )
        </h3>);
          cards = (<Cards
            data={this.props.userJoinedCards}
            actions={this.props.actions.getUserJoinedCards}
            isLoading={this.props.isuserJoinedCardsLoading}
            userId={this.props.user.id}
          />);
        } else {
          title = <h3>Joined Card</h3>;
          cards = <h3 className="text-center">You don&apos;t have joined any WishYoo cards yet...</h3>;
        }
      }
      return (
        <div>
          {title}
          {cards}
        </div>
      );
    };

    const renderCards = () => {
      if (this.props.loginUserJoinedCards) {
        if (this.props.userCards.metadata.total === 0 &&
          this.props.loginUserJoinedCards.metadata.total === 0) {
          return (
            <div className="row text-center">
              <div
                className="container"
                style={{ height: '525px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h4>
                    Hi
                    <span style={{ color: 'coral' }}>
                      @{this.props.user ? this.props.user.username : ''}
                    </span>
                  </h4>
                  <h3>
                    Download the App and create a Wishyoo Card for that
                    special person in your life
                  </h3>
                  <a
                    href="https://itunes.apple.com/app/wishyoo/id1125036797?mt=8"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ margin: '3px', display: 'inline-block' }}
                  >
                    <img
                      src="/static/images/app_store.png"
                      alt="download app from apple app store"
                      height="60"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.wishyoo.src"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ margin: '3px', display: 'inline-block' }}
                  >
                    <img
                      src="/static/images/google_play.png"
                      alt="download app from google play store"
                      height="60"
                    />
                  </a>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="text-left">
            {userCards()}
            {loggedInUserJoinedCards()}
          </div>
        );
      } else if (this.props.userJoinedCards) {
        if (this.props.loggedUser && !this.props.loggedUser.activated) {
          return false;
        } else if (this.props.loggedUser && this.props.loggedUser.activated &&
          this.props.userCards.metadata.total === 0 &&
          this.props.userJoinedCards.metadata.total === 0) {
          return (
            <div className="row text-center">
              <div
                className="container"
                style={{ height: '525px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h4>
                    Hi
                    <span style={{ color: 'coral' }}>
                      @{this.props.user ? this.props.user.username : ''}
                    </span>
                  </h4>
                  <h3>
                    Download the App and create a Wishyoo Card for that special&nbsp;
                    person in your life
                  </h3>
                  <a
                    href="https://itunes.apple.com/app/wishyoo/id1125036797?mt=8"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/static/images/app_store.png"
                      alt="download app from apple app store"
                      height="60"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.wishyoo.src"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/static/images/google_play.png"
                      alt="download app from google play store"
                      height="60"
                    />
                  </a>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="text-left">
              {userCards()}
              {anotherUserJoinedCards()}
            </div>
          );
        }
      }
      return false;
    };
    return (
      <div>
        <Head {...this.props.user} />
        <AppNavbar {...this.props} />
        {
          this.props.success || this.props.failure ?
            <div style={{ marginBottom: '-64px' }}>
              <HandleError {...this.props} />
            </div> : null
        }
        <div className="bk-flower profile">
          <div className="h64" />
          <div className="container m10">
            <div className="row">
              {
                this.props.loggedUser &&
                !this.props.loggedUser.activated &&
                this.state.alertVisible ?
                  <div className="col-lg-12">
                    <Alert bsStyle="warning" onDismiss={this.handleAlertDismiss}>
                      <p>Please check your email and validate the account</p>
                    </Alert>
                  </div> : ''
              }
              {
                this.props.url && this.props.url.query.id ?
                  <div className="col-lg-6 col-md-6 col-sm-6 col-sm-offset-3">
                    <UserInfo {...this.props} isProfile={isProfile()} />
                  </div>
                  :
                  <div>
                    <div className="col-lg-6 col-md-5 col-sm-6">
                      <UserInfo {...this.props} isProfile={isProfile()} />
                    </div>
                    <div className="visible-xs"><br /></div>
                    <Events events={this.props.events} />
                  </div>
              }
            </div>
          </div>
          <div className="user-cards" style={{ marginTop: '15px' }}>
            <div className="container">
              {renderCards()}
            </div>
          </div>
        </div>
        <FooterInnerPage />
      </div>
    );
  }
}

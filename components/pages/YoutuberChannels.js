import React from 'react';
import { Jumbotron } from 'react-bootstrap';

import Head from '../layouts/Head';
import AppNavbar from '../layouts/Navbar';

import YoutuberChannels1 from '../YoutuberChannels1';
import YoutuberChannels2 from '../YoutuberChannels2';
import YoutuberChannels3 from '../YoutuberChannels3';
import HandleError from '../HandleError';
import FooterInnerPage from '../layouts/FooterInnerPage';

export default class Youtuber extends React.Component {

  constructor(props) {
    super(props);
    this.renderComponent = this.renderComponent.bind(this);
    this.accountActiveNotification = this.accountActiveNotification.bind(this);
    this.appliedForContest = this.appliedForContest.bind(this);
    this.notEligible = this.notEligible.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.resendActivationLink = this.resendActivationLink.bind(this);
    this.state = {
      linked: false,
      channelsEligibleFlag: false,
      error: false,
      inactive: false,
      loadGif: true,
    };
  }

  componentDidMount() {
    const self = this;
    self.props.actions.getLoggedInUserInfo(() => {
      if (this.props.isLogin) {
        self.props.actions.checkYoutubeLinkage((res2) => {
          if (res2.statusCode === 403) {
            self.setState({ inactive: true });
            self.setState({ error: true });
          } else if (res2.statusCode === 200) {
            if (res2.body.linked) {
              self.setState({ linked: true });
              self.setState({ error: true });
            }
          }
        });
        self.props.actions.getYoutubeChannel((res3) => {
          if (res3.statusCode === 404) {
            self.setState({ channelsEligibleFlag: true });
            self.setState({ error: true });
          } else if (res3.statusCode === 500) {
            self.setState({ channelsEligibleFlag: true });
            self.setState({ error: true });
          } else if (res3.statusCode === 200) {
            self.setState({ channelsEligibleFlag: false });
            self.setState({ error: false });
          }
        });
      } else {
        window.location = '/youtuber/1';
      }
    });
  }

  resendActivationLink() {
    if (this.props.isLogin && this.props.loggedUser) {
      this.props.actions.resendActivationLink(this.props.loggedUser.id);
    }
  }

  accountActiveNotification() {
    return (
      <div>
        <div className="container birthday">
          { this.state.inactive ?
            <Jumbotron>
              <h1>Account Inactive</h1>
              <p>Your account is not activated yet. Please check your email. &nbsp;
                { this.state.loadGif ?
                  <button className="gif-loader" onClick={this.handleClick}>
                    <span style={{ fontSize: '15px' }} className="glyphicon glyphicon-refresh" />
                  </button> :
                  <img src="/static/images/refresh.gif" style={{ width: '20px' }} alt="HTML5 Icon" />
                }
              </p>
              <div>
                <button id='lsubmit' onClick={this.resendActivationLink}>
                  Resend Activation Link
                </button>
              </div>
            </Jumbotron> : undefined
          }
        </div>
        <div className="youtuber-footer">
          <FooterInnerPage />
        </div>
      </div>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  appliedForContest() {
    return (
      <div>
        <div className="container birthday">
          <Jumbotron>
            <h1>Already Applied!</h1>
            <p>You have already applied for this Event.</p>
          </Jumbotron>
        </div>
        <div className="youtuber-footer">
          <FooterInnerPage />
        </div>
      </div>
    );
  }

  notEligible() {
    return (
      <div>
        <div className="container birthday">
          { this.state.channelsEligibleFlag ?
            <Jumbotron>
              <h1>Sorry!! Not Eligible</h1>
              <p>You are not eligible for this contest. {this.props.failure}</p>
            </Jumbotron> : undefined
          }
        </div>
        <div className="youtuber-footer">
          <FooterInnerPage />
        </div>
      </div>
    );
  }

  handleClick() {
    this.setState({ loadGif: false });
    window.location.reload();
  }

  renderComponent() {
    switch (this.props.url.query.step) {
      case '1': return (
        <YoutuberChannels1 {...this.props} />
      );
      case '2': return (
        <YoutuberChannels2 {...this.props} />
      );
      case '3': return (
        <YoutuberChannels3 {...this.props} />
      );
      default : return (
        <YoutuberChannels1 {...this.props} />
      );
    }
  }

  render() {
    return (
      <div className="youtuber">
        <Head />
        <AppNavbar {...this.props} />
        <HandleError {...this.props} />
        {
          this.state.inactive && this.state.error ? this.accountActiveNotification() : undefined
        }
        {
          this.state.linked && this.state.error ? this.appliedForContest() : undefined
        }
        {
          this.state.error && this.state.channelsEligibleFlag ? this.notEligible() : undefined
        }
        {
          !this.state.inactive &&
          !this.state.linked && !this.state.error ? this.renderComponent() : undefined
        }
      </div>
    );
  }

}


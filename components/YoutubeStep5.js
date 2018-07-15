import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import FooterInnerPage from './layouts/FooterInnerPage';

export default class YoutubeStep5 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      alternate_email: '',
      validate: false,
      isEmailAddressesLoading: false,
      isEmailAddresseAvailable: true,
      sameEmailFlag: false,
      usernameAvailableFlag: false,
      emailAvailableFlag: false,
      unknownErrorFlag: false,
      unknownErrorMessage: false,
      success: true,
      brandAccount: false,
      requiredEmailFlag: false,
      invalidEmail: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setDefaultData = this.setDefaultData.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  componentDidMount() {
    this.setDefaultData();
  }

  setDefaultData() {
    const youtuberData = JSON.parse(localStorage.getItem('youtuberData'));
    if (youtuberData) {
      if (youtuberData.callback) {
        this.setState({ email: youtuberData.callback.email });
        this.setState({ alternate_email: youtuberData.callback.email });
      }
    }

    if (youtuberData) {
      if (youtuberData.step5) {
        this.setState({ alternate_email: youtuberData.step5 });
      }
    }
  }

  handleChange(event) {
    this.setState({ alternate_email: event.target.value });
  }

  handleSubmit(event) {
    const self = this;
    event.preventDefault();
    localStorage.setItem('youtuberData',
      JSON.stringify(Object.assign(
        {},
        JSON.parse(localStorage.getItem('youtuberData')),
        { step5: this.state.alternate_email },
      )),
    );
    if (this.state.alternate_email.match(/pages\.plusgoogle\.com$/)) {
      this.setState({
        brandAccount: true,
        sameEmailFlag: false,
        requiredEmailFlag: false,
        invalidEmail: false,
      });
    } else {
      this.setState({ isEmailAddressesLoading: true });
      new Promise((resolve) => {
        self.props.actions.usernameEmailAvailable({ email: this.state.alternate_email }, (res) => {
          this.setState({ sameEmailFlag: false });
          if (!res.available && res.error !== undefined) {
            this.em.setCustomValidity('email already taken');
            if (res.error === 'Missing required fields') {
              this.setState({
                requiredEmailFlag: true,
                invalidEmail: false,
              });
            } else if (res.error === 'invalid email address') {
              this.setState({
                invalidEmail: true,
                requiredEmailFlag: false,
              });
            } else {
              this.setState({
                isEmailAddresseAvailable: false,
                requiredEmailFlag: false,
                invalidEmail: false,
              });
            }
            this.setState({
              isEmailAddressesLoading: false,
              brandAccount: false,
            });
            resolve(false);
          } else {
            this.em.setCustomValidity('');
            this.setState({
              sameEmailFlag: false,
              isEmailAddresseAvailable: true,
              isEmailAddressesLoading: false,
              brandAccount: false,
              requiredEmailFlag: false,
              invalidEmail: false,
            });
            resolve(true);
          }
          this.em.setCustomValidity('');
        });
      }).then((resp) => {
        if (resp) {
          const youtuberData = JSON.parse(localStorage.getItem('youtuberData'));
          const flag = self.validateForm(youtuberData);
          if (flag) {
            const register = {
              username: youtuberData.step3,
              email: this.state.alternate_email,
              password: atob(youtuberData.step4),
              agreedToTerms: youtuberData.step2,
              metadata: {
                identifier: youtuberData.callback.identifier ? youtuberData.callback.identifier : '',
                provider: youtuberData.callback.provider ? youtuberData.callback.provider : '',
                protocol: youtuberData.callback.protocol ? youtuberData.callback.protocol : '',
                accessToken: youtuberData.callback.accessToken ? youtuberData.callback.accessToken : '',
                refreshToken: youtuberData.callback.refreshToken ? youtuberData.callback.refreshToken : '',
              },
            };
            if (this.state.email !== this.state.alternate_email) {
              register.alternate_email = youtuberData.callback.email;
            }
            this.props.actions.register(register, (response) => {
              if (response.statusCode === 200) {
                window.location = '/youtuber_channels/1';
                localStorage.removeItem('youtuberData');
              } else if (response.statusCode === 400) {
                localStorage.removeItem('youtuberData');
                this.setState({ success: false });
                if (response.body.validationErrors) {
                  if (response.body.validationErrors.invalidAttributes) {
                    if (response.body.validationErrors.invalidAttributes.username) {
                      this.setState({ usernameAvailableFlag: `${response.body.validationErrors.invalidAttributes.username[0].message} ` });
                    }
                    if (response.body.validationErrors.invalidAttributes.email) {
                      this.setState({ emailAvailableFlag: `${response.body.validationErrors.invalidAttributes.email[0].message} ` });
                    }
                  }
                }
              } else if (response.body.errors[0]) {
                localStorage.removeItem('youtuberData');
                this.setState({
                  unknownErrorMessage: response.body.errors[0],
                  success: false,
                  unknownErrorFlag: true,
                });
              }
            });
          }
        }
      });
    }
  }

  validateForm(youtuberData) {
    this.window = window;
    if ((
          youtuberData.step3 &&
          this.state.alternate_email &&
          youtuberData.step4 &&
          (youtuberData.step2 === true) &&
          youtuberData.callback.identifier &&
          youtuberData.callback.provider &&
          youtuberData.callback.protocol &&
          youtuberData.callback.accessToken &&
          youtuberData.callback.refreshToken &&
          youtuberData.callback.email
        )
      ) {
      return true;
    }
    if (youtuberData.callback) {
      if (!(
            youtuberData.callback.identifier &&
            youtuberData.callback.email &&
            (youtuberData.callback.provider === 'youtube') &&
            (youtuberData.callback.protocol === 'oauth2') &&
            youtuberData.callback.accessToken &&
            youtuberData.callback.refreshToken
          )
        ) {
        this.window.location = '/youtuber/1';
        return false;
      }
    }
    if (!youtuberData.step2) {
      this.window.location = '/youtuber/2';
      return false;
    }
    if (!youtuberData.step3) {
      this.window.location = '/youtuber/3';
      return false;
    }
    if (!youtuberData.step4) {
      this.window.location = '/youtuber/4';
      return false;
    }
    if (!youtuberData.step5) {
      this.window.location = '/youtuber/5';
      return false;
    }
    return false;
  }

  displayUsernameEmailError() {
    return (
      <div>
        <div className="container birthday">
          <Jumbotron>
            <h1>Failure</h1>
            <p>
              { this.state.usernameAvailableFlag ?
                  this.state.usernameAvailableFlag : this.state.emailAvailableFlag
              }
              <a href={this.state.usernameAvailableFlag ? '/youtuber/3' : '/youtuber/1'}>click here</a> to change
            </p>
          </Jumbotron>
        </div>
      </div>
    );
  }

  displayUnknownError() {
    return (
      <div>
        <div className="container birthday">
          <Jumbotron>
            <h1>Failure</h1>
            <p>{this.state.unknownErrorFlag ? this.state.unknownErrorMessage : 'Something went wrong'}. Please <a href="/youtuber/1">try again</a></p>
          </Jumbotron>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {/* Email */}
        {
        this.state.success ?
          <div className="birthday container">
            <div className="cancel-btn">
              <a href="/">
                <p className="cancel-btn-text">
                  CANCEL
                </p>
              </a>
            </div>
            <h3>5. <img src="/static/images/list_arrow.png" alt="arrow" width="30px" height="25px" style={{ marginTop: '-5px' }} /> This is the email we’ll use to communicate with you. Please Change if it is not the best contact email for official Wishyoo communication.</h3>
            <div className="h64" />
            <div className="row">
              <div className="col-xs-6 col-xs-offset-3">
                <form onSubmit={this.handleSubmit}>
                  <div className="email password">
                    <input
                      type="email"
                      className="form-control date"
                      pattern="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
                      placeholder="Alternate Email"
                      id="alternate_email"
                      ref={(c) => { this.em = c; }}
                      value={this.state.alternate_email}
                      onChange={this.handleChange}
                      autoComplete="off"
                      required
                    />
                  </div>
                  {this.state.isEmailAddressesLoading ?
                    <div className="text-left" style={{ color: 'red', fontSize: '12px' }}>
                      checking email....</div> : ''
                  }
                  {!this.state.isEmailAddresseAvailable ?
                    <div className="text-left" style={{ color: 'red', fontSize: '12px' }}>
                      email address already exist</div> : ''
                  }
                  {this.state.requiredEmailFlag ?
                    <div className="text-left" style={{ color: 'red', fontSize: '12px' }}>
                      email is required</div> : ''
                  }
                  {this.state.invalidEmail ?
                    <div className="text-left" style={{ color: 'red', fontSize: '12px' }}>
                      invalid email address</div> : ''
                  }
                  {this.state.brandAccount ?
                    <div className="text-left" style={{ color: 'red', fontSize: '12px' }}>
                      Your youtube account seems to be a brand account. Please change it with valid account in order for us to communicate with you.</div> : ''
                  }
                  <div className="next">
                    <button id="lsubmit" type="submit">Next</button>
                  </div>
                </form>
              </div>
            </div>
          </div> : ''
        }
        {
          !this.state.success && this.state.usernameAvailableFlag ?
            this.displayUsernameEmailError() : undefined
        }
        {
          !this.state.success && this.state.emailAvailableFlag ?
            this.displayUsernameEmailError() : undefined
        }
        {
          this.state.unknownErrorFlag ? this.displayUnknownError() : undefined
        }
        <div className="youtuber-footer">
          <FooterInnerPage />
        </div>
      </div>
    );
  }
}

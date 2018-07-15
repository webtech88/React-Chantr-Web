import React from 'react';
import { Alert } from 'react-bootstrap';

import Head from '../layouts/Head';
import FooterInnerPage from '../layouts/FooterInnerPage';
import AppNavbar from '../layouts/Navbar';
import HandleError from '../HandleError';

export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      identifier: '',
      password: '',
      queryParam: '',
      isAccountActivated: props.url.query.account,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePopSubmit = this.handlePopSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({ queryParam: this.props.url.query.s_id });
  }

  handleChange(event) {
    if (event.target.id === 'identifier') {
      this.setState({ identifier: event.target.value });
    } else {
      this.setState({ password: event.target.value });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.identifier && this.state.password) {
      this.props.actions.login({
        identifier: this.state.identifier,
        password: this.state.password },
        () => {
          this.props.url.query.card_id ? window.top.location = `/card/${this.props.url.query.card_id}/signature` : this.props.url.push('/profile')
        });
    }
  }

  handlePopSubmit(event) {
    event.preventDefault();
    if (this.state.identifier && this.state.password) {
      this.props.actions.login({
        identifier: this.state.identifier,
        password: this.state.password,
        s_id: this.state.queryParam },
        (res) => {
          const object = {
            activated: res.body.activated,
            duplicate_sign: res.body.duplicate_sign,
          };
          this.props.popUpAction(object);
        });
    }
  }

  render() {
    return (
      <div className={this.state.queryParam ? 'popup' : ''}>
        {this.state.queryParam ?
          <div>
            <div className="clearfix">
              <div className="loginModel">
                <form onSubmit={this.handlePopSubmit}>
                  <div className="form-group">
                    <label htmlFor="username">User Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="identifier"
                      required="true"
                      value={this.state.identifier}
                      onChange={this.handleChange}
                      autoFocus="true"
                      autoComplete="off"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      required="true"
                      value={this.state.password}
                      onChange={this.handleChange}
                      autoComplete="off"
                    />
                  </div>
                  <p className="card-terms-conditions">*By placing your signature, you agree to the WishYOO terms and conditions.</p>
                  <div className="loginAction login-register-popup">
                    <button id="lsubmit" type="submit">Lets <strong>Go!</strong></button>
                  </div>
                </form>
              </div>
            </div>
          </div> :
          <div>
            <Head {...this.props} />
            <AppNavbar {...this.props} />
            <HandleError {...this.props} />
            <div className="clearfix login-style">
              <div className="h70" />
              <div className="container">
                {this.state.isAccountActivated ?
                  <div>
                    <br />
                    <Alert bsStyle="success">
                      <strong>Success!</strong> You have successfully activated your account.
                    </Alert>
                  </div> : undefined
                }
                <div className="loginModel col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                  <h2 style={{ margin: '0', padding: '20px 0 0 0' }}>Login</h2>
                  <hr />
                  <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="username">User Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="identifier"
                        required="true"
                        value={this.state.identifier}
                        onChange={this.handleChange}
                        autoComplete="off"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        required="true"
                        value={this.state.password}
                        onChange={this.handleChange}
                        autoComplete="off"
                      />
                    </div>
                    <div className="loginAction">
                      <button id="lsubmit" type="submit">Lets <strong>Go!</strong></button>
                      <a href="/forgot_password">
                        <strong>Forgot your password?</strong> Click here!
                      </a>
                    </div>
                  </form>
                  <hr />
                  <div className="text-center">Or Log In with :
                    <a href="/api/v3/auth/facebook" style={{ margin: '5px' }}>
                      <img
                        src="/static/images/fb.png"
                        alt="login with facebook"
                        height="25px;"
                      />
                    </a>
                    <a href="/api/v3/auth/twitter" style={{ margin: '5px' }}>
                      <img
                        src="/static/images/tw.png"
                        alt="login with twitter"
                        height="25px;"
                      />
                    </a>
                    <a href="/api/v3/auth/google" style={{ margin: '5px' }}>
                      <img
                        src="/static/images/g+.png"
                        alt="login with google"
                        height="25px;"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <FooterInnerPage />
          </div>
        }
      </div>
    );
  }
}

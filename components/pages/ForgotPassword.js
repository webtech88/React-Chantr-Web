import React from 'react';

import Head from '../layouts/Head';
import FooterInnerPage from '../layouts/FooterInnerPage';
import AppNavbar from '../layouts/Navbar';
import HandleError from '../HandleError';

export default class ForgotPassword extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      checkEmail: false,
      emailNotFound: false,
      msg: '',
      sMsg: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ email: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ msg: 'checking email....' });
    this.props.actions.usernameEmailAvailable({ email: this.state.email }, (res) => {
      if (!res.available) {
        this.props.actions.forgotPassword({ email: this.state.email }, (response) => {
          if (response.status) {
            window.store.dispatch({ type: 'SUCCESS', success: undefined });
            this.setState({ sMsg: 'Success! We have emailed you a link with instructions to reset your password.' });
            this.setState({ email: '' });
          }
        });
        this.setState({ msg: '' });
      } else {
        this.setState({ msg: 'email not found...' });
        window.store.dispatch({ type: 'SUCCESS', success: undefined });
      }
    });
  }

  render() {
    return (
      <div>
        <Head {...this.props} />
        <AppNavbar {...this.props} />
        <HandleError {...this.props} />
        <div className="clearfix forgot-password-style">
          <div className="h70" />
          <div className="container">
            {this.state.sMsg.length > 0 ?
              <div>
                <br />
                <div className="alert alert-success" role="alert">
                  <button
                    type="button"
                    className="close"
                    data-dismiss="alert"
                    aria-label="Close"
                    onClick={() => {
                      this.setState({ sMsg: '' });
                    }}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <strong>Success! </strong>
                  {this.state.sMsg}
                </div>
              </div> : ''
            }
            <div className="loginModel col-lg-6 col-lg-offset-3">
              <h2 style={{ margin: '0', padding: '20px 0 0 0' }}>Forgot Password</h2>
              <hr />
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="reset_password">
                    Enter your email address and we&apos;ll get you back on track!
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    id="reset_password"
                    required
                    autoFocus=""
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                  <div
                    className="text-left"
                    style={{ color: 'red', fontSize: '12px' }}
                  >
                    {this.state.msg}
                  </div>
                  {this.state.checkEmail ?
                    <div
                      className="text-left"
                      style={{ color: 'red', fontSize: '12px' }}
                    >checking email....</div> : ''
                  }
                  {this.state.emailNotFound ?
                    <div
                      className="text-left"
                      style={{ color: 'red', fontSize: '12px' }}
                    >email not found...</div> : ''
                  }
                  {this.state.error ?
                    <div
                      className="text-left"
                      style={{ color: 'red', fontSize: '12px' }}
                    >{this.state.error}</div> : ''
                  }
                </div>
                <div className="loginAction">
                  <button id="lsubmit" type="submit">Request Reset Link</button>
                </div>
              </form>
              <hr />
              <div className="text-center">
                <a href="/login"> &lt;&lt; Back to login </a>
              </div>
            </div>
          </div>
        </div>
        <FooterInnerPage />
      </div>
    );
  }
}

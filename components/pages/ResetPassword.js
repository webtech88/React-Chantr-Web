import React from 'react';
import { Jumbotron, Button } from 'react-bootstrap';

import Head from '../layouts/Head';
import { Link } from '../../routes';
import FooterInnerPage from '../layouts/FooterInnerPage';
import AppNavbar from '../layouts/Navbar';
import HandleError from '../HandleError';

export default class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirmPassword: '',
      is_PW_not_match: false,
      invalidPassword: false,
      passwordLengthFlag: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    if (event.target.id === 'password') {
      this.setState({ password: event.target.value });
    } else {
      this.setState({ confirmPassword: event.target.value });
    }
  }

  handleSubmit(event) {
    var self = this;
    event.preventDefault();
    if (this.state.password === this.state.confirmPassword && !this.state.invalidPassword && !this.state.passwordLengthFlag) {
      this.setState({ invalidPassword: false });
      let passwordDetails = {
        token: this.props.url.query.token,
        email: decodeURIComponent(this.props.url.query.email),
        id: this.props.url.query.id,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword
      }
      this.props.actions.resetPassword(passwordDetails, (err, res) => {
        if (err.statusCode === 400 ) {
          this.props.url.push('/forgot_password');
        } else {
          this.props.actions.logout(null, () => {
            this.props.url.push('/login');
          });
        }
      });
    }
  }

  render() {
    let password;
    let confirmPassword;
    const validatePassword = () => {
      password = this.c;
      confirmPassword = this.cp;
      let passwordDetails = password.value;
      if (password.value.length < 8 ) {
        this.setState({
          passwordLengthFlag : true,
          invalidPassword: false,
        });

      } else if (!passwordDetails.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/)) {
        this.setState({
          invalidPassword: true,
          passwordLengthFlag : false,
        });
      } else if (password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity("Passwords Don't Match");
        this.setState({
          invalidPassword: false,
          passwordLengthFlag : false,
          is_PW_not_match: true,
        });
      } else {
        confirmPassword.setCustomValidity('');
        this.setState({
          invalidPassword: false,
          is_PW_not_match: false,
          passwordLengthFlag : false,
        });
      }
    };
    return (
      <div>
        <Head {...this.props} />
        <AppNavbar {...this.props} />
        <HandleError {...this.props} />
        <div className="h64" />
        <div className="container">
          <div className="reset-pw-body">
            {
              <div className="loginModel col-lg-6 col-lg-offset-3">
                <h2 style={{ margin:'0px', padding: '20px 0 0 0' }}>Reset Password</h2>
                  <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        ref={(c) => { this.c = c; }}
                        required="true"
                        value={this.state.password}
                        onChange={(event) => { this.handleChange(event); validatePassword(); }}
                        autoComplete="off"
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}"
                      />
                    </div>
                    { this.state.invalidPassword ? <p style={{ color: 'red', fontSize: '12px' }}>Password must contain atleast 1-uppercase | 1-special character | 1-numeric</p> : undefined }
                    { this.state.passwordLengthFlag ? <p style={{ color: 'red', fontSize: '12px' }}>Password must be 8 characters long</p> : undefined }
                    <div className="form-group">
                      <label htmlFor="username">Confirm Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        ref={(cp) => { this.cp = cp; }}
                        required="true"
                        value={this.state.confirmPassword}
                        onChange={(event) => { this.handleChange(event); validatePassword(); }}
                        autoComplete="off"
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}"
                      />
                    </div>
                    { this.state.is_PW_not_match ? <div className="text-left" style={{ color: 'red', fontSize: '12px' }}>Passwords must match.</div> : undefined }
                    <div className="loginAction" style={{ marginTop: '35px !important' }}>
                      <button id="lsubmit" type="submit">Reset</button>
                    </div>
                  </form>
              </div>
            }
          </div>
        </div>
        <div className="h64" />
        <div className="reset-pw-footer">
          <FooterInnerPage />
        </div>
      </div>
    );
  }
}

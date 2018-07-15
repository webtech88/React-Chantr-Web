import React from 'react';

import Head from '../layouts/Head';
import FooterInnerPage from '../layouts/FooterInnerPage';
import AppNavbar from '../layouts/Navbar';
import HandleError from '../HandleError';

export default class Register extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: props.url.query.email ? props.url.query.email : '',
      password: '',
      confirm_password: '',
      is_PW_not_match: false,
      userNames: [],
      emailAddresses: [],
      isUserNamesLoading: false,
      isEmailAddressesLoading: false,
      isEmailAddresseAvailable: true,
      validating: false,
      queryParam: '',
      emailError: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkUserName = this.checkUserName.bind(this);
    this.checkEmailAddress = this.checkEmailAddress.bind(this);
    this.handlePopSubmit = this.handlePopSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({ queryParam: this.props.url.query.s_id });
  }

  handleChange(event) {
    if (event.target.id === 'username') {
      this.setState({ username: event.target.value });
    } else if (event.target.id === 'email') {
      this.setState({ email: event.target.value });
    } else if (event.target.id === 'password') {
      this.setState({ password: event.target.value });
    } else {
      this.setState({ confirm_password: event.target.value });
    }
  }

  handleSubmit(event) {
    if (event.target.checkValidity()) {
      let register;
      if (this.props.url.query.identifier) {
        register = {
          username: this.state.username,
          email: this.state.email,
          agreedToTerms: true,
          metadata: {
            identifier: this.props.url.query.identifier ? this.props.url.query.identifier : '',
            provider: this.props.url.query.provider ? this.props.url.query.provider : '',
            protocol: this.props.url.query.protocol ? this.props.url.query.protocol : '',
          },
          card_id: this.props.url.query.card_id ? this.props.url.query.card_id : undefined,
        };
      } else {
        register = {
          username: this.state.username,
          email: this.state.email,
          password: this.state.password,
          agreedToTerms: true,
          card_id: this.props.url.query.card_id ? this.props.url.query.card_id : undefined,
        };
      }
      this.props.actions.register(register, (res) => {
        if (res.status === 200 && this.props.url.query.card_id) {
          window.top.location = `/card/${this.props.url.query.card_id}/signature`;
        } else if (res.status === 200) {
          this.props.url.push('/profile');
        }
      });
    }
    event.preventDefault();
    return false;
  }

  handlePopSubmit(event) {
    if (event.target.checkValidity()) {
      const register = {
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        agreedToTerms: true,
        s_id: this.state.queryParam,
      };
      this.props.actions.register(register, (res) => {
        const object = {
          activated: false,
        };
        if (res.status === 200) {
          this.props.popUpAction(object);
        }
      });
    }
    event.preventDefault();
    return false;
  }

  checkUserName() {
    if (this.state.username.length > 2) {
      this.setState({ isUserNamesLoading: true });
      this.props.actions.usernameEmailAvailable({ username: this.state.username }, (res) => {
        window.store.dispatch({ type: 'SUCCESS', success: undefined });
        if (res.suggestedUsernames) {
          this.setState({ userNames: res.suggestedUsernames });
        } else {
          this.un.setCustomValidity('');
          this.setState({ userNames: [] });
        }
        this.setState({ isUserNamesLoading: false });
      });
    } else {
      this.un.setCustomValidity('');
      this.setState({ userNames: [] });
      this.setState({ isUserNamesLoading: false });
    }
  }

  checkEmailAddress() {
    if (this.state.email.length > 0) {
      this.setState({ isEmailAddressesLoading: true });
      this.props.actions.usernameEmailAvailable({ email: this.state.email }, (res) => {
        if (!res.available) {
          this.em.setCustomValidity(res.error);
          this.setState({ isEmailAddresseAvailable: false, emailError: res.error });
          window.store.dispatch({ type: 'SUCCESS', success: undefined });
          window.store.dispatch({ type: 'FAILURE', failure: res.error });
        } else {
          this.em.setCustomValidity('');
          this.setState({ isEmailAddresseAvailable: true, emailError: '' });
          window.store.dispatch({ type: 'FAILURE', failure: undefined });
        }
        this.setState({ isEmailAddressesLoading: false, emailError: res.error });
        window.store.dispatch({ type: 'SUCCESS', success: undefined });
        window.store.dispatch({ type: 'FAILURE', failure: res.error });
      });
    }
  }

  render() {
    let password;
    let confirmPassword;

    const validatePassword = () => {
      password = this.p;
      confirmPassword = this.cp;
      if (password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity('Passwords Don&apos;t Match');
        this.setState({ is_PW_not_match: true });
      } else {
        confirmPassword.setCustomValidity('');
        this.setState({ is_PW_not_match: false });
      }
    };

    const setUserName = (user) => {
      this.setState({ username: user });
      this.setState({ userNames: [] });
      this.setState({ isUserNamesLoading: false });
      this.un.setCustomValidity('');
    };

    const renderUserNames = () => {
      const list = this.state.userNames.map((user) => {
        return (
          <button key={Math.random()} onClick={() => { setUserName(user); }} style={{ display: 'inline-block' }}>{user}</button>
        );
      });
      this.un.setCustomValidity('username already exists ...');
      return (
        <div className="usersuggetions">
          {list}
        </div>
      );
    };

    return (
      <div className={this.state.queryParam ? 'popup' : ''}>
        {this.state.queryParam ?
          <div className="clearfix">
            <div className="register_from">
              <form onSubmit={this.handlePopSubmit}>
                <input
                  type="text"
                  placeholder="User Name"
                  id="username"
                  required
                  value={this.state.username}
                  ref={(c) => { this.un = c; }}
                  onChange={this.handleChange}
                  onBlur={this.checkUserName}
                  minLength="3"
                  autoComplete="off"
                />
                {this.state.isUserNamesLoading ?
                  <div className="text-left" style={{ color: 'red', fontSize: '12px' }}>
                    checking username....
                  </div> : ''
                }
                {this.state.userNames.length > 0 ?
                  <div>
                    <div className="text-left" style={{ color: 'red', fontSize: '12px' }}>
                      username is not available.
                    </div>
                    {renderUserNames()}
                  </div> : ''
                }
                <input
                  type="email"
                  pattern="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
                  placeholder="Email Address"
                  id="email"
                  required
                  value={this.state.email}
                  ref={(c) => { this.em = c; }}
                  onChange={this.handleChange}
                  onBlur={this.checkEmailAddress}
                  autoComplete="off"
                />
                {this.state.isEmailAddressesLoading ?
                  <div className="text-left" style={{ color: 'red', fontSize: '12px' }}>
                    checking email....
                  </div> : ''
                }
                {!this.state.isEmailAddresseAvailable ?
                  <div className="text-left" style={{ color: 'red', fontSize: '12px' }}>
                    {this.state.emailError}
                  </div> : ''
                }
                {this.props.url.query.identifier ?
                  undefined :
                  <span>
                    <input
                      type="password"
                      placeholder="Password"
                      id="password"
                      required
                      ref={(c) => { this.p = c; }}
                      value={this.state.password}
                      onChange={(event) => { this.handleChange(event); validatePassword(); }}
                      onKeyUp={validatePassword}
                      pattern=".{8,}"
                      autoComplete="off"
                    />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      id="confirm_password"
                      required
                      ref={(c) => { this.cp = c; }}
                      value={this.state.confirm_password}
                      onChange={this.handleChange}
                      onKeyUp={validatePassword}
                      pattern=".{8,}"
                      autoComplete="off"
                    />
                    {this.state.is_PW_not_match ?
                      <div className="text-left" style={{ color: 'red', fontSize: '12px' }}>
                        Passwords must match.
                      </div> : ''
                    }
                  </span>
                }
                <p className="card-terms-conditions" style={{ textAlign: 'left', marginTop: '10px' }} >*By placing your signature, you agree to the WishYOO terms and conditions.</p>
                <div className="loginAction login-register-popup">
                  <button id="lsubmit" type="submit">Create Account</button>
                </div>
              </form>
            </div>
          </div>
          :
          <div>
            <Head {...this.props} />
            <AppNavbar {...this.props} />
            <HandleError {...this.props} />
            <div className="clearfix register-style">
              <div className="h70" />
              <div className="container">
                <div className="register_from col-sm-8 col-sm-offset-2 col-lg-6 col-lg-offset-3">
                  <h2 style={{ margin: '0', padding: '20px 0 0 0' }}>Register</h2>
                  <form onSubmit={this.handleSubmit}>
                    <input
                      type="text"
                      placeholder="User Name"
                      id="username"
                      required
                      value={this.state.username}
                      ref={(c) => { this.un = c; }}
                      onChange={this.handleChange}
                      onBlur={this.checkUserName}
                      minLength="3"
                    />
                    {this.state.isUserNamesLoading ?
                      <div className="text-left" style={{ color: 'red', fontSize: '12px' }}>
                        checking username....
                      </div> : ''
                    }
                    {this.state.userNames.length > 0 ?
                      <div>
                        <div
                          className="text-left"
                          style={{ color: 'red', fontSize: '12px' }}
                        >
                          username is not available.
                        </div>
                        {renderUserNames()}
                      </div> : ''
                    }
                    <input
                      type="email"
                      pattern="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
                      placeholder="Email Address"
                      id="email"
                      required
                      value={this.state.email}
                      ref={(c) => { this.em = c; }}
                      onChange={this.handleChange}
                      onBlur={this.checkEmailAddress}
                    />
                    {this.state.isEmailAddressesLoading ?
                      <div className="text-left" style={{ color: 'red', fontSize: '12px' }}>
                        checking email....</div> : ''
                      }
                    {!this.state.isEmailAddresseAvailable ?
                      <div className="text-left" style={{ color: 'red', fontSize: '12px' }}>
                        {this.state.emailError}
                      </div> : ''
                    }
                    {this.props.url.query.identifier ?
                      undefined :
                      <span>
                        <input
                          type="password"
                          placeholder="Password"
                          id="password"
                          required
                          ref={(c) => { this.p = c; }}
                          value={this.state.password}
                          onChange={(event) => { this.handleChange(event); validatePassword(); }}
                          onKeyUp={validatePassword}
                          pattern=".{8,}"
                        />
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          id="confirm_password"
                          required
                          ref={(c) => { this.cp = c; }}
                          value={this.state.confirm_password}
                          onChange={this.handleChange}
                          onKeyUp={validatePassword}
                          pattern=".{8,}"
                        />
                        {this.state.is_PW_not_match ?
                          <div className="text-left" style={{ color: 'red', fontSize: '12px' }}>
                            Passwords must match.
                          </div> : ''
                        }
                      </span>
                    }
                    <div className="loginAction">
                      <button id="lsubmit" type="submit">Create Account</button>
                      <a href="/login"><strong>Already a member?</strong> Sign in!</a>
                    </div>
                  </form>
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

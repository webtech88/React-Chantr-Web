import React from 'react';
import FooterInnerPage from './layouts/FooterInnerPage';

export default class YoutubeStep4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirmPassword: '',
      validate: false,
      is_PW_not_match: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setDefaultData = this.setDefaultData.bind(this);
  }

  componentDidMount() {
    this.setDefaultData();
  }

  setDefaultData() {
    const youtuberData = JSON.parse(localStorage.getItem('youtuberData'));
    if (youtuberData) {
      if (youtuberData.step4) {
        this.setState({ password: atob(youtuberData.step4) });
      }
    }
  }

  handleChange(event) {
    if (event.target.id === 'password') {
      this.setState({ password: event.target.value });
    } else {
      this.setState({ confirmPassword: event.target.value });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    if (event.target.checkValidity()) {
      localStorage.setItem('youtuberData',
        JSON.stringify(Object.assign(
          {},
          JSON.parse(localStorage.getItem('youtuberData')),
          { step4: btoa(this.state.password) },
        )),
      );
      window.location = '/youtuber/5';
    }
  }

  render() {
    let password;
    let confirmPassword;
    const validatePassword = () => {
      password = this.c;
      confirmPassword = this.cp;
      if (password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity("Passwords Don't Match");
        this.setState({ is_PW_not_match: true });
      } else {
        confirmPassword.setCustomValidity('');
        this.setState({ is_PW_not_match: false });
      }
    };

    return (
      <div>
        {/* password */}
        <div className="birthday container">
          <div className="cancel-btn">
            <a href="/">
              <p className="cancel-btn-text">
                CANCEL
              </p>
            </a>
          </div>
          <h3>4. <img src="/static/images/list_arrow.png" alt="arrow" width="30px" height="25px" style={{ marginTop: '-5px' }} /> And a Password?</h3>
          <div className="h64" />
          <div className="row">
            <div className="col-xs-6 col-xs-offset-3">
              <form onSubmit={this.handleSubmit}>
                <div className="password">
                  <input
                    type="password"
                    placeholder="Password"
                    className="form-control date"
                    id="password" required
                    ref={(c) => { this.c = c; }}
                    value={this.state.password}
                    onChange={(event) => { this.handleChange(event); validatePassword(); }}
                    onKeyUp={validatePassword}
                    pattern=".{8,}"
                  />
                </div>
                <br />
                <div className="password">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="form-control date"
                    id="confirmPassword"
                    required
                    ref={(cp) => { this.cp = cp; }}
                    value={this.state.confirmPassword}
                    onChange={this.handleChange}
                    onKeyUp={validatePassword}
                    pattern=".{8,}"
                  />
                  { this.state.is_PW_not_match ? <div className="text-left" style={{ color: 'red', fontSize: '12px' }}>Passwords must match.</div> : undefined }
                </div>
                <div className="next">
                  <button id="lsubmit" type="submit">Next</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="youtuber-footer">
          <FooterInnerPage />
        </div>
      </div>
    );
  }
}

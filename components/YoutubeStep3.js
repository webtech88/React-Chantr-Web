import React from 'react';
import FooterInnerPage from './layouts/FooterInnerPage';

export default class YoutubeStep3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      isUserNamesLoading: false,
      userNames: [],
      available: false,
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
      if (youtuberData.step3) {
        this.setState({ username: youtuberData.step3 });
      }
    }
  }

  handleChange(event) {
    if (event.target.id === 'username') {
      this.setState({ username: event.target.value });
      this.un.setCustomValidity('');
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.username.length > 2) {
      this.setState({ isUserNamesLoading: true });
      this.props.actions.usernameEmailAvailable({ username: this.state.username }, (res) => {
        this.setState({ available: res.available });
        if (res.suggestedUsernames) {
          this.setState({ userNames: res.suggestedUsernames });
          this.un.setCustomValidity('username already exists ...');
        } else {
          this.un.setCustomValidity('');
          this.setState({ userNames: [] });
          localStorage.setItem('youtuberData',
            JSON.stringify(Object.assign(
              {},
              JSON.parse(localStorage.getItem('youtuberData')),
              { step3: this.state.username },
            )),
          );
          window.location = '/youtuber/4';
        }
        this.setState({ isUserNamesLoading: false });
      });
    } else {
      this.un.setCustomValidity('');
      this.setState({ userNames: [] });
      this.setState({ isUserNamesLoading: false });
    }
  }

  render() {
    const setUserName = (user) => {
      this.setState({ username: user });
      this.setState({ available: true });
      this.un.setCustomValidity('');
      this.setState({ userNames: [] });
      this.setState({ isUserNamesLoading: false });
    };

    const renderUserNames = () => {
      const list = this.state.userNames.map((user) => {
        return (
          <button key={Math.random()} onClick={() => { setUserName(user); }}>{user}</button>
        );
      });
      return (
        <div className="usersuggetions">
          {list}
        </div>
      );
    };

    return (
      <div>
        {/* username */}
        <div className="birthday container">
          <div className="cancel-btn">
            <a href="/">
              <p className="cancel-btn-text">
                CANCEL
              </p>
            </a>
          </div>
          <h3>3.&nbsp;
            <img
              src="/static/images/list_arrow.png"
              alt="arrow"
              width="30px"
              height="25px"
              style={{ marginTop: '-5px' }}
            /> Choose a username for WishYoo</h3>
          <div className="h64" />
          <div className="row">
            <div className="col-xs-6 col-xs-offset-3">
              <form onSubmit={this.handleSubmit} autoComplete="off">
                <div className="user">
                  <input
                    type="text"
                    className="form-control date"
                    placeholder="User Name"
                    id="username"
                    required
                    value={this.state.username}
                    ref={(un) => { this.un = un; }}
                    onChange={this.handleChange}
                    minLength="3"
                  />
                  { this.state.isUserNamesLoading ? <div className="text-left" style={{ color: 'red', fontSize: '12px' }}>checking username....</div> : undefined }
                  { this.state.userNames.length > 0 ? <div><div className="text-left" style={{ color: 'red', fontSize: '12px' }}>username is not available.</div>{renderUserNames()}</div> : undefined }
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


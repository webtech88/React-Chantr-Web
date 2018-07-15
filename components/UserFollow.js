import React from 'react';

class UserFollow extends React.Component {

  constructor(props) {
    super(props);
    this.followUser = this.followUser.bind(this);
    this.unfollowUser = this.unfollowUser.bind(this);
    this.displayFollow = this.displayFollow.bind(this);
    this.state = {
      accountActivate: true,
    };
  }

  componentDidMount() {
    const self = this;
    const userId = this.props.userId;
    if (userId) {
      this.props.actions.getUserInformation(userId, (res) => {
        self.setState({ accountActivate: res });
      });
    }
  }

  followUser() {
    this.props.actions.followUser(this.props.user.id, () => {
      if (this.props.actionType === 'profile') {
        this.props.actions.getUserData(this.props.user.id);
      } else {
        this.props.actions.getCardOwnerInfo(this.props.user.id);
      }
    });
  }

  unfollowUser() {
    this.props.actions.unfollowUser(this.props.user.id, () => {
      if (this.props.actionType === 'profile') {
        this.props.actions.getUserData(this.props.user.id);
      } else {
        this.props.actions.getCardOwnerInfo(this.props.user.id);
      }
    });
  }

  displayFollow() {
    let showHtml;
    if (this.props.user && this.props.user.followed) {
      showHtml = (
        <button className="btn-style owner-following orange" onClick={this.unfollowUser}>
          {this.props.isLoading ?
            <span>
              <img
                src="/static/images/loader-red-1.gif"
                style={{ height: '15px', width: 'auto' }}
                alt="loading"
              />
            </span>
            :
            <span>Following</span>
          }
        </button>
      );
    } else {
      showHtml = (
        <button className="btn-style owner-follow" onClick={this.followUser}>
          {this.props.isLoading ?
            <span>
              <img
                src="/static/images/loader-red-1.gif"
                style={{ height: '15px', width: 'auto' }}
                alt="loading"
              />
            </span>
            :
            <span>Follow</span>
          }
        </button>
      );
    }
    return showHtml;
  }

  render() {
    return (
      <div style={{ marginLeft: '10px' }}>
        {this.props.isLoading}
        {
          this.state.accountActivate ? this.displayFollow() : undefined
        }
      </div>
    );
  }

}

export default UserFollow;

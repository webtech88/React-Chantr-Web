import React from 'react';
import genImg from '../lib';
import UserFollow from './UserFollow';

class UserInfo extends React.Component {
  render() {
    return (
      <section className="profile-info">
        <div className="img">
          {this.props.user ? genImg(this.props.user.image, 'profileImg') : ''}
        </div>
        <div className="text-center">
          <h3 style={{ color: '#FF8A15' }}>@{this.props.user ? this.props.user.username : ''}</h3>
          <section className="followers-following">
            <div>
              <h5>Followers</h5>
              <p>{this.props.user ? this.props.user.total_followers : ''}</p>
            </div>
            <div>
              <h5>Following</h5>
              <p>{this.props.user ? this.props.user.total_following : ''}</p>
            </div>
          </section>
        </div>
        {this.props.url && this.props.url.query.id && !this.props.isProfile ?
          <div>
            <UserFollow
              user={this.props.user}
              actions={this.props.actions}
              actionType="profile"
              isLoading={this.props.isLoading}
              userId={this.props.userId}
            />
          </div>
          :
          undefined
        }
      </section>
    );
  }
}

export default UserInfo;

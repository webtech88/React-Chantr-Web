import React from 'react';
import { Navbar, Nav, NavItem, FormGroup, FormControl, Modal } from 'react-bootstrap';
import { Link } from '../../routes';
import _ from 'lodash';

import genImg from '../../lib';

export default class AppNavbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      visible: false,
      cards: [],
      users: [],
      isLogin: false,
      loginUserName: '',
      showRegisterLink: true,
      showLoginLink: true,
      isHome: this.props.url.pathname === '/' || this.props.url.pathname === '/youtuber',
      showCreateCardPopUp: false,
      showCreateCardVideo: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.isVisible = this.isVisible.bind(this);
    this.search = this.search.bind(this);
    this.displayCardCreatePopUp = this.displayCardCreatePopUp.bind(this);
    this.closeCreateCardPopUp = this.closeCreateCardPopUp.bind(this);
    this.openCardCreateVideo = this.openCardCreateVideo.bind(this);
  }

  componentWillMount() {
    this.props.actions.getLoggedInUserInfo((res) => {
      if (res.loggedIn === undefined) {
        this.setState({ isLogin: true, loginUserName: res.username });
      }
    });
    if (this.props.url.pathname === '/login') {
      this.setState({ showLoginLink: false });
    }
    if (this.props.url.pathname === '/register' || this.props.url.pathname === '/forgot_password') {
      this.setState({ showRegisterLink: false });
    }
  }

  componentDidMount() {
    document.addEventListener('keyup', (e) => {
      if (e.keyCode === 27 && this.state.visible) {
        this.setState({ visible: false });
      }
    });
    document.body.addEventListener('click', (e) => {
      if (e.target.closest('#sugestbox') === null && e.target.placeholder !== 'Search') {
        if (this.state.visible) {
          this.setState({ visible: false });
        }
      }
    });
  }

  handleChange(event) {
    this.setState({ search: event.target.value });
  }

  isVisible() {
    return this.state.visible && (this.state.cards.length > 0 || this.state.users.length > 0);
  }

  search(event) {
    if (this.state.search.length > 2) {
      this.setState({ visible: true });
      this.setState({ cards: [] });
      this.setState({ users: [] });
      if (event.keyCode === '27') {
        this.setState({ visible: false });
      }
      this.props.actions.searchCards(this.state.search, (res) => {
        this.setState({ cards: res });
        this.props.actions.searchUsers(this.state.search, (response) => {
          this.setState({ users: response });
        });
      });
    }
  }

  displayCardCreatePopUp() {
    this.setState({ showCreateCardPopUp: true });
  }

  closeCreateCardPopUp() {
    this.setState({ showCreateCardPopUp: false });
  }

  openCardCreateVideo() {
    this.setState({
      showCreateCardPopUp: false,
      showCreateCardVideo: true
    });
  }
  render() {
    const logout = () => {
      if (this.props.actions) {
        this.props.actions.logout(this.props.url, (res) => {
          if (!res.body.loggedIn) {
            window.location = '/';
          }
        });
      }
    };

    const focus = () => {
      this.setState({ visible: true });
    };

    const cards = () => {
      const list = this.state.cards && this.state.cards.map((card) => {
        return (
          <li className="list-group-item clearfix" key={Math.random()}>
            <a href={`/card/${card.id}`}>
              {card.title}{card.featured !== 0 ? <img src="/static/images/featured_small.png" alt="featured card" /> : ''}
            </a>
            <span className="pull-right username_style">
              <Link route="profile" params={{ id: card.owner }}><a>@{card.owner_username}</a></Link>
            </span>
          </li>
        );
      });
      return list;
    };

    const users = () => {
      const list = this.state.users && this.state.users.map((user) => {
        return (
          <li className="list-group-item" key={Math.random()}>
            <a href={`/profile/${user.id}`}>
              {genImg(user.image, 'profileImg', 'img-circle')}<span>@{user.username}</span>
            </a>
          </li>
        );
      });
      return list;
    };

    return (
      <Navbar inverse className={this.state.isHome ? 'navbar navbar-inverse bs-docs-nav navbar-fixed-top sticky-navigation' : 'navbar navbar-inverse bs-docs-nav navbar-fixed-top sticky-navigation navigation-style'}>
        <Navbar.Header>
          <Navbar.Brand>
            <a className="navbar-brand" href="/">{this.state.isHome ? <img src= '/static/images/wishyoo_logo-2.png' style={{ marginTop: '-20px', width: '120px'}} /> : <img src= '/static/images/wishyoo_logo_white.png' style={{ marginTop: '-20px', width: '120px'}} />}</a>
          </Navbar.Brand>
          <Navbar.Form style={{ display: 'inline-block', position: 'relative', padding: 0, margin: 0, marginTop: '18px', float: 'left' }} className="visible-xs searchInputWidth">
            <FormGroup>
              <FormControl
                type="text"
                placeholder="Search"
                onFocus={focus}
                onKeyUp={this.search}
                onChange={this.handleChange}
                value={this.state.search}
              />
            </FormGroup>
          </Navbar.Form>
          <Navbar.Toggle style={{ backgroundColor: 'black', marginTop: '20px' }} />
        </Navbar.Header>
        {this.isVisible() ?
          <div className="search-style visible-xs m0 p0">
            <div id="sugestbox" className="arrow_box" style={{ left: 0 }}>
              {this.state.cards && this.state.cards.length > 0 ?
                <h5>WishYoo Cards</h5> : undefined
              }
              <ul className="list-group">{this.isVisible() ? cards() : ''}</ul>
              {this.state.users && this.state.users.length > 0 ? <h5>Users</h5> : undefined}
              <ul className="list-group"> {this.isVisible() ? users() : ''}</ul>
            </div>
          </div> : undefined
        }
        <Navbar.Collapse>
          <Nav className="navbar-left main-navigation small-text">
            <a href="/#public_cards">Public Cards</a>
            <a href="/#what_is_wishyoo">What is WishYOO</a>
            <button className="create-card" onClick={this.displayCardCreatePopUp}><a>Create Card</a></button>
            <a href="/#about_us">About Us</a>
          </Nav>
          <Navbar.Form style={{ display: 'inline-block', position: 'relative', padding: 0, margin: 0, marginTop: '13px', float: 'left' }} className="hidden-xs">
            <FormGroup>
              <FormControl
                type="text"
                placeholder="Search"
                onFocus={focus}
                onKeyUp={this.search}
                onChange={this.handleChange}
                value={this.state.search}
              />
              {this.isVisible() ?
                <div className="search-style hidden-xs">
                  <div id="sugestbox" className="arrow_box">
                    {this.state.cards && this.state.cards.length > 0 ?
                      <h5>WishYoo Cards</h5> : undefined
                    }
                    <ul className="list-group">{this.isVisible() ? cards() : ''}</ul>
                    {this.state.users && this.state.users.length > 0 ? <h5>Users</h5> : undefined}
                    <ul className="list-group"> {this.isVisible() ? users() : ''}</ul>
                  </div>
                </div> : undefined
              }
            </FormGroup>
          </Navbar.Form>
          {this.state.isHome ?
            <Nav className="navbar-left main-navigation small-text">
              <Link href="https://twitter.com/wish_yoo"><a rel="noopener noreferrer" style={{ paddingRight: 0, top: '-4px', position: 'relative' }} id="twitter" target="_blank"><img src="/static/images/twitter-1.png" height="30" alt="twitter" /></a></Link>
              <Link href="https://www.facebook.com/Wishyooapp/"><a rel="noopener noreferrer" style={{ top: '-4px', position: 'relative' }} id="fb" target="_blank"><img src="/static/images/fb1.png" height="30" alt="facebook" /></a></Link>
            </Nav> : undefined
          }
          {this.state.isLogin ?
            <Nav pullRight className="navbar-left main-navigation small-text">
              <NavItem eventKey={3} href="/profile" >{_.truncate(this.state.loginUserName, {'length': 10, 'omission': '...' })}</NavItem>
              <NavItem eventKey={4} onClick={logout}>logout</NavItem>
            </Nav> :
            <Nav pullRight className="navbar-left main-navigation small-text">
              {this.state.showRegisterLink ?
                <NavItem eventKey={4} href="/register">Register</NavItem> :
              undefined
              }
              {this.state.showLoginLink ?
                <NavItem eventKey={3} href="/login">Login</NavItem> :
              undefined
              }
            </Nav>
          }
        </Navbar.Collapse>
        <Modal
          show={this.state.showCreateCardPopUp}
          onHide={() => {
            this.setState({ showCreateCardPopUp: false });
          }}
          dialogClassName="create-card-modal"
        >
        <div className="create-card-wrapper">
          <button className="close-create-card-modal" onClick={this.closeCreateCardPopUp}>X</button>
          <div className="creator-heading">
            <div className="brain-image-wrapper">
              <img
                src="/static/images/braing.jpg"
                alt="braing.jpg"
                className="brain-image"
              />
            </div>
            <div className="heading-text-wrapper">
              <p className="heading-text">
                Hi Creator!
              </p>
            </div>
          </div>
          <div className="creator-desc-wrapper">
            <p className="creator-desc">
              If you want to give that special someone the BEST CARD EVER! download our FREE APP and follow
              <button
                className="card-create-video-link"
                onClick={() => this.openCardCreateVideo()}>
                <u><b><span className="blink">THESE</span></b></u>
              </button>
              simple steps. THANKS!
            </p>
          </div>
          <div className="app-download">
            <div className="ios-app-download">
              <a
                href="https://itunes.apple.com/app/wishyoo/id1125036797?mt=8"
                target="_blank"
                type="button"
                rel="noopener noreferrer"
                style={{ margin: '3px', display: 'inline-block' }}
              >
                <img
                  src="/static/images/app_store.png"
                  alt="download app from apple app store"
                  height="60"
                  style={{ width: '160px', height: '55px' }}
                />
              </a>
            </div>
            <div className="android-app-download">
              <a
                href="https://play.google.com/store/apps/details?id=com.wishyoo.src"
                target="_blank"
                type="button"
                rel="noopener noreferrer"
                style={{ margin: '3px', display: 'inline-block' }}
              >
                <img
                  src="/static/images/google_play.png"
                  alt="download app from google play store"
                  height="60"
                  style={{ width: '160px', height: '55px' }}
                />
              </a>
            </div>
          </div>
        </div>
        </Modal>

         <Modal
          show={this.state.showCreateCardVideo}
          onHide={() => this.setState({ showCreateCardVideo: false, showCreateCardPopUp: false }) }
          dialogClassName="wishyoo_videos"
        >
          <Modal.Body>
            <div className="vContainer">
              <iframe
                src="https://player.vimeo.com/video/233522138"
                className="video iframe-video"
                width="640"
                height="368"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </Modal.Body>
        </Modal>
      </Navbar>
    );
  }
}

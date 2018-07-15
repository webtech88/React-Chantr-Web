import React from 'react';
import { DropdownButton, MenuItem, Modal, Carousel } from 'react-bootstrap';
import ScrollableAnchor from 'react-scrollable-anchor';

import Head from '../layouts/Head';
import Footer from '../layouts/Footer';
import AppNavbar from '../layouts/Navbar';
import HandleError from '../HandleError';

import Cards from '../Cards';
import CategoriesCards from '../CategoriesCards';

let player = {};
export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isMute: false,
      showModal: false,
      whichVideo: '',
      audioPlay: false,
    };
    this.audio = this.audio.bind(this);
    this.muteVolume = this.muteVolume.bind(this);
    this.closeYoutubeWishyoVideo = this.closeYoutubeWishyoVideo.bind(this);
    this.openYoutubeWishyoVideo = this.openYoutubeWishyoVideo.bind(this);
  }

  componentDidMount() {
    const VimeoPlayer = require('@vimeo/player');
    if (typeof localStorage !== 'undefined') {
      const vimeo = JSON.parse(localStorage.getItem('vimeo'));
      if (vimeo && vimeo.isVideoPlayed && (vimeo.timeStamp + (60 * 60 * 24)) > (Math.floor(Date.now() / 1000))) {
        const options = {
          id: 182418479,
          autoplay: false,
        };
        player = new VimeoPlayer(this.iframe, options);
      } else {
        const options = {
          id: 182418479,
          autoplay: true,
        };
        player = new VimeoPlayer(this.iframe, options);
      }
    } else {
      const options = {
        id: 182418479,
        autoplay: true,
      };
      player = new VimeoPlayer(this.iframe, options);
    }
    player.setVolume(1);
    player.on('ended', () => {
      const timeStamp = Math.floor(Date.now() / 1000);
      const tempObj = JSON.stringify({ timeStamp, isVideoPlayed: true });
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('vimeo', tempObj);
      }
    });
    player.on('pause', () => {
      const timeStamp = Math.floor(Date.now() / 1000);
      const tempObj = JSON.stringify({ timeStamp, isVideoPlayed: true });
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('vimeo', tempObj);
      }
    });
  }

  closeYoutubeWishyoVideo() {
    this.setState({ showModal: false, whichVideo: '' });
  }

  openYoutubeWishyoVideo(video) {
    if (!this.state.isMute) {
      this.setState({ isMute: true });
      player.setVolume(0);
    }
    if (this.state.audioPlay) {
      this.sampleAudio.pause();
      this.setState({ audioPlay: false });
    }
    this.setState({ showModal: true, whichVideo: video });
  }

  audio() {
    if (!this.state.isMute) {
      this.setState({ isMute: true });
      player.setVolume(0);
    }
    const audio = this.sampleAudio;
    audio.addEventListener('ended', () => {
      this.setState({ audioPlay: false });
    });
    if (this.state.audioPlay) {
      this.sampleAudio.pause();
      this.setState({ audioPlay: false });
    } else {
      this.setState({ audioPlay: true });
      this.sampleAudio.play();
    }
  }

  muteVolume() {
    if (this.state.audioPlay) {
      this.sampleAudio.pause();
      this.setState({ audioPlay: false });
    }
    if (this.state.isMute) {
      this.setState({ isMute: false });
      player.setVolume(1);
    } else {
      this.setState({ isMute: true });
      player.setVolume(0);
    }
  }

  render() {
    return (
      <div>
        <Head {...this.props} />
        <AppNavbar {...this.props} />
        {
          this.props.success || this.props.failure ?
            <div style={{ marginBottom: '-64px' }}>
              <HandleError {...this.props} />
            </div> : null
        }
        <div className="h64" />

        <header className="main_header" style={{ position: 'relative' }}>
          <div className="wishYooVideo" ref={(c) => { this.iframe = c; }} />
          <div className="explore_videos_flex">
            <DropdownButton
              className="explore_videos"
              title="Explore Videos"
              id="Explore_Videos"
              pullRight
              onSelect={(eventKey) => { this.openYoutubeWishyoVideo(eventKey); }}
            >
              <MenuItem eventKey="card_create">CREATE A CARD</MenuItem>
              <MenuItem eventKey="concept">Concept</MenuItem>
              <MenuItem eventKey="whatsWishYoo">What’s WishYoo?</MenuItem>
            </DropdownButton>
            <button className="mute" onClick={this.muteVolume}>
              {this.state.isMute ?
                <img src="/static/images/mute.png" height="20" alt="mute video" /> :
                <i className="fa fa-volume-up" aria-hidden="true" />
              }
            </button>
          </div>
        </header>

        {/* featured public cards */}
        <ScrollableAnchor id={'public_cards'}>
          <section className="services grey-bg">
            <div className="container">
              <div className="section-header">
                <h2 className="dark-text"><a className="home-link" href="/public_cards" style={{ textDecoration: 'none' }}>FEATURED PUBLIC<sup>*</sup> CARDS</a></h2>
                <div className="colored-line" />
              </div>
              <div className="row" style={{ marginBottom: '30px' }}>
                <div className="clearfix">
                  {this.props.featuredCards && this.props.featuredCards.cards.length > 0 ?
                    <Cards
                      data={this.props.featuredCards}
                      actions={this.props.actions.getFeaturedCards}
                      isLoading={this.props.isfeaturedCardsLoading}
                      resetFeatureCards={this.props.actions.resetFeatureCards}
                    /> :
                    <div className="text-center">
                      <h2 className="noCards">No feature cards</h2>
                    </div>
                  }
                </div>
                <div className="text-center" style={{ marginTop: '45px' }}>
                  WishYoo cards can be Public or Private (friends and family only)<sup>*</sup>
                </div>
              </div>
            </div>
          </section>
        </ScrollableAnchor>

        {/* categories cards */}
        <CategoriesCards {...this.props} />

        {/* Download app buttons */}
        <section className="call-to-action" id="section11" data-stellar-background-ratio="0.1">
          <div className="overlay-layer-2">
            <div className="container">
              <div className="row">
                <div className="col-md-8 col-md-offset-2">
                  <div className="uppercase colored-text strong">
                    Discover the power of our greeting platform.
                  </div>
                  <h2
                    className="strong wow fadeInLeft"
                    data-wow-duration="2s"
                    data-wow-offset="40"
                  >
                    Get the app.
                  </h2>
                  <div>
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
                        style={{ width: '115px', height: '30px' }}
                      />
                    </a>
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
                        style={{ width: '115px', height: '30px' }}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ScrollableAnchor id={'what_is_wishyoo'}>
          <section className="unique-features white-bg">
            <div className="container">
              <div className="section-header">
                <h2 className="dark-text"><a className="home-link" style={{ textDecoration: 'none', }} href="/what_is_wishyoo">What is WishYOO</a></h2>
                <div className="colored-line" />
                <div className="sub-heading">
                  Join the true evolution of the greeting card and help us create a greener future
                </div>
              </div>
              <div className="row">
                <div
                  className="col-sm-4 wow fadeInRight"
                  data-wow-duration="1.75s"
                  data-wow-offset="20"
                >
                  <div className="feature">
                    <div className="icon-container">
                      <span className="colored-text"><i className="fa fa-bullhorn" /></span>
                    </div>
                    <div className="description text-left">
                      <h4 className="dark-text">What’s on a WishYoo?</h4>
                      <div className="grey-line-short pull-left" />
                      <div className="text-left">
                        <ul>
                          <li className="list-style-bullet">A chorus of voices that create a
                          common chant
                          </li>
                          <li className="list-style-bullet">A limitless board with dedications
                          and pictures from all your friends and family
                          </li>
                          <li className="list-style-bullet">A group gift that all participants
                          buy together
                          </li>
                          <li className="list-style-bullet">A memento meant to be kept
                          forever
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="feature">
                    <div className="icon-container">
                      <span className="colored-text"><i className="fa fa-pencil-square-o" /></span>
                    </div>
                    <div className="description text-left">
                      <h4 className="dark-text">How much does it cost?</h4>
                      <div className="grey-line-short pull-left" />
                      <p className="text-left">We want the world to experience the magic of
                      WishYoo Cards, so we decided to make all features of our app absolutely
                      free!
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="ipad-image">
                    <Carousel interval={2000}>
                      <Carousel.Item>
                        <img alt="Voice mix" src="/static/images/slider/voice.png" />
                        <Carousel.Caption>
                          <h3 className="colored-text">Voice mix</h3>
                        </Carousel.Caption>
                      </Carousel.Item>
                      <Carousel.Item>
                        <img alt="Signature board" src="/static/images/slider/signeture.png" />
                        <Carousel.Caption>
                          <h3 className="colored-text">Signature board</h3>
                        </Carousel.Caption>
                      </Carousel.Item>
                      <Carousel.Item>
                        <img alt="Group Gift" src="/static/images/slider/gift.png" />
                        <Carousel.Caption>
                          <h3 className="colored-text">Group Gift</h3>
                        </Carousel.Caption>
                      </Carousel.Item>
                    </Carousel>
                  </div>
                </div>
                <div
                  className="col-sm-4 wow fadeInLeft"
                  data-wow-duration="1.75s"
                  data-wow-offset="20"
                >
                  <div className="feature">
                    <div className="icon-container">
                      <span className="colored-text"><i className="fa fa-microphone" /></span>
                    </div>
                    <div className="description text-left">
                      <h4 className="dark-text">VOICE</h4>
                      <div className="grey-line-short pull-left" />
                      <p className="text-left">Create a song your friends can sing along to,
                      and when enough people join, it will sound like this :&nbsp;
                        {this.state.audioPlay ?
                          <button className="sample_btn_style" onClick={this.audio}>
                            <i className="fa fa-pause-circle-o" aria-hidden="true" />
                          </button> :
                          <button className="sample_btn_style" onClick={this.audio}>
                            <i className="fa fa-play-circle-o" aria-hidden="true" />
                          </button>
                        }
                      </p>
                    </div>
                  </div>
                  <div className="feature">
                    <div className="icon-container">
                      <span className="colored-text"><i className="fa fa-heart" /></span>
                    </div>
                    <div className="description text-left">
                      <h4 className="dark-text">Signature Board</h4>
                      <div className="grey-line-short pull-left" />
                      <p className="text-left">Handwritten dedications from all your friends on a
                      limitless board! They can even include pictures of the times you
                      have shared.
                      </p>
                    </div>
                  </div>
                  <div className="feature">
                    <div className="icon-container">
                      <span className="colored-text"><i className="fa fa-gift" /></span>
                    </div>
                    <div className="description text-left">
                      <h4 className="dark-text">Gift</h4>
                      <div className="grey-line-short pull-left" />
                      <p className="text-left">WishYoo makes it easier to purchase meaningful gifts
                      by sharing the cost with others invited to participate
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollableAnchor>

        <ScrollableAnchor id={'about_us'}>
          <section className="brief white-bg-border text-left grey-bg">
            <div className="container">
              <div className="row">
                <div
                  className="col-md-12 content-section pull-left wow fadeInRight"
                  data-wow-offset="20"
                  data-wow-duration="1.75s"
                >
                  <div className="small-text-medium uppercase colored-text text-center">
                    <h2 className="dark-text"><a className="home-link" style={{ textDecoration: 'none' }} href="/about_us">About Us</a></h2>
                  </div>
                  <div className="colored-line text-center" />
                  <p className="text-left">
                    WishYoo was born out of one simple idea: <strong>Out of Many, One.</strong>
                    On WishYoo, join thousands of voices into one message, thousands of signatures
                    into one epic birthday card, or thousands of friends chipping in on one gift.
                  </p>
                  <div className="row">
                    <div className="col-md-5 col-sm-6">
                      <ul className="feature-list text-left">
                        <li>
                          <span className="colored-text">
                            <i className="fa fa-microphone" />
                          </span>
                          Develop a following using your voice.
                        </li>
                        <li style={{ color: 'green' }}>
                          <span className="colored-text" style={{ color: 'green' }}>
                            <i className="fa fa-pagelines" />
                          </span>
                          Give the green alternative to greeting cards.
                        </li>
                        <li>
                          <span className="colored-text">
                            <i className="fa fa-dollar" />
                          </span>
                          Add gift cards easily, and let the family chip in.
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-7 col-sm-6">
                      <ul className="feature-list text-left">
                        <li>
                          <span className="colored-text"><i className="fa fa-users" /></span>
                          Invite millions of friends to add their voices to your WishYoo cards.
                        </li>
                        <li>
                          <span className="colored-text"><i className="fa fa-users" /></span>
                          Find WishYoos to join and become a part of movements to change the world!
                        </li>
                        <li>
                          <span className="colored-text"><i className="fa fa-thumbs-up" /></span>
                          Share on your favorite social networks and harness the power of the crowd!
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="team" id="wishyoo_team">
                <div className="section-header">
                  <div className="small-text-medium uppercase colored-text">
                    Team
                  </div>
                  <h2 className="dark-text"><strong>WishYoo</strong> Team</h2>
                  <div className="colored-line" />
                </div>

                <div className="row wow fadeIn" data-wow-offset="10" data-wow-duration="1.75s">

                  <div className="col-sm-4">
                    <div
                      className="team-member wow flipInY"
                      data-wow-offset="10"
                      data-wow-duration="1s"
                    >
                      <div className="member-pic">
                        <img src="/static/images/team/ignacio.jpg" alt="ignacio" />
                      </div>
                      <div className="member-details">
                        <h5 className="colored-text">Ignacio Doncel</h5>
                        <div className="small-text">
                          Founder &amp; CEO
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div
                      className="team-member wow flipInY"
                      data-wow-offset="10"
                      data-wow-duration="1s"
                    >
                      <div className="member-pic">
                        <img src="/static/images/team/daniel.jpg" alt="daniel" />
                      </div>
                      <div className="member-details">
                        <h5 className="colored-text">Daniel Llinas</h5>
                        <div className="small-text">
                          COO
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div
                      className="team-member wow flipInY"
                      data-wow-offset="10"
                      data-wow-duration="1s"
                    >
                      <div className="member-pic">
                        <img src="/static/images/team/rakshit.jpg" alt="rakshit" />
                      </div>
                      <div className="member-details">
                        <h5 className="colored-text">Rakshit Menpara</h5>
                        <div className="small-text">
                          CTO
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div
                      className="team-member wow flipInY"
                      data-wow-offset="10"
                      data-wow-duration="1s"
                    >
                      <div className="member-pic">
                        <img src="/static/images/team/sweety.jpg" alt="sweety" />
                      </div>
                      <div className="member-details">
                        <h5 className="colored-text">Sweety Jain</h5>
                        <div className="small-text">
                          Frontend / Backend  Developer
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div
                      className="team-member wow flipInY"
                      data-wow-offset="10"
                      data-wow-duration="1s"
                    >
                      <div className="member-pic">
                        <img src="/static/images/team/mandeep.jpg" alt="Mandeep Gulati" />
                      </div>
                      <div className="member-details">
                        <h5 className="colored-text">Mandeep Gulati</h5>
                        <div className="small-text">
                          Backend Developer
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div
                      className="team-member wow flipInY"
                      data-wow-offset="10"
                      data-wow-duration="1s"
                    >
                      <div className="member-pic">
                        <img src="/static/images/team/harish.png" alt="Harish Chopra" />
                      </div>
                      <div className="member-details">
                        <h5 className="colored-text">Harish Chopra</h5>
                        <div className="small-text">
                          Frontend Developer
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div
                      className="team-member wow flipInY"
                      data-wow-offset="10"
                      data-wow-duration="1s"
                    >
                      <div className="member-pic">
                        <img src="/static/images/team/gautam.jpg" alt="Gautam Manohar" />
                      </div>
                      <div className="member-details">
                        <h5 className="colored-text">Gautam Manohar</h5>
                        <div className="small-text">
                          Devops Developer
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div
                      className="team-member wow flipInY"
                      data-wow-offset="10"
                      data-wow-duration="1s"
                    >
                      <div className="member-pic">
                        <img src="/static/images/team/munir.jpg" alt="Munir Khakhi" />
                      </div>
                      <div className="member-details">
                        <h5 className="colored-text">Munir Khakhi</h5>
                        <div className="small-text">
                          Backend Developer
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div
                      className="team-member wow flipInY"
                      data-wow-offset="10"
                      data-wow-duration="1s"
                    >
                      <div className="member-pic">
                        <img src="/static/images/team/tapan.jpg" alt="Tapan Bavaliya" />
                      </div>
                      <div className="member-details">
                        <h5 className="colored-text">Tapan Bavaliya</h5>
                        <div className="small-text">
                          Frontend Developer / Designer
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div
                      className="team-member wow flipInY"
                      data-wow-offset="10"
                      data-wow-duration="1s"
                    >
                      <div className="member-pic">
                        <img src="/static/images/team/ayman.jpg" alt="Ayman Mahgoub" />
                      </div>
                      <div className="member-details">
                        <h5 className="colored-text">Ayman Mahgoub</h5>
                        <div className="small-text">
                          Android Developer
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollableAnchor>

        <Modal
          show={this.state.showModal}
          onHide={this.closeYoutubeWishyoVideo}
          dialogClassName="wishyoo_videos"
        >
          <Modal.Body>
            {this.state.whichVideo === 'card_create' ?
              <div className="vContainer">
                <iframe
                  src="https://player.vimeo.com/video/233522138"
                  className="video iframe-video"
                  width="640"
                  height="368"
                  frameBorder="0"
                  allowFullScreen
                />
              </div> : undefined
            }
            {this.state.whichVideo === 'concept' ?
              <div className="vContainer">
                <iframe
                  src="https://www.youtube.com/embed/Gp7x6XUP-d4?autoplay=1"
                  frameBorder="0"
                  allowFullScreen
                  className="video"
                />
              </div> : undefined
            }
            {this.state.whichVideo === 'whatsWishYoo' ?
              <div className="vContainer">
                <iframe
                  src="https://www.youtube.com/embed/IlMIogcvyT0?autoplay=1"
                  frameBorder="0"
                  allowFullScreen
                  className="video"
                />
              </div> : undefined
            }
          </Modal.Body>
        </Modal>
        <audio controls ref={(c) => { this.sampleAudio = c; }} style={{ display: 'none' }}>
          <source src="/static/audio/sample.m4a" type="audio/mp4" />
        </audio>
        <Footer />
      </div>
    );
  }
}

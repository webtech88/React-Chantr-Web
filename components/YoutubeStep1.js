import React from 'react';
import { Modal } from 'react-bootstrap';
import FooterInnerPage from './layouts/FooterInnerPage';

export default class YoutubeStep1 extends React.Component {

  constructor(props) {
    super(props);
    this.checkForLoggedIn = this.checkForLoggedIn.bind(this);
    this.logout = this.logout.bind(this);
    this.setDefaultData = this.setDefaultData.bind(this);
    this.openYoutubeWishyoVideo = this.openYoutubeWishyoVideo.bind(this);
    this.closeYoutubeWishyoVideo = this.closeYoutubeWishyoVideo.bind(this);
    this.state = {
      showModal: false,
      showErrorModal: false,
      videoModal: false,
      whichVideo: '',
    };
  }

  componentDidMount() {
    localStorage.removeItem('youtuberData');
    this.setDefaultData();
  }

  setDefaultData() {
    if (this.props.url.query.error) {
      this.setState({ showErrorModal: true });
    }
  }

  checkForLoggedIn() {
    this.props.actions.getLoggedInUserInfo((res) => {
      if (res.username) {
        this.setState({ showModal: true });
      } else {
        window.location = '/api/v3/auth/youtube';
      }
    });
  }

  logout() {
    if (this.props.actions) {
      this.props.actions.logout(this.props.url, (res) => {
        if (!res.body.loggedIn) {
          window.location = '/youtuber/1';
        }
      });
    }
  }

  closeYoutubeWishyoVideo() {
    this.setState({ videoModal: false, whichVideo: '' });
  }

  openYoutubeWishyoVideo(video) {
    this.setState({ videoModal: true, whichVideo: video });
  }

  render() {
    return (
      <div>
        {/* youtuber image */}
        <div className="container">
          <div className="youtber-landing">
            <div>
              <p className="youtuber-head animated zoomIn"><b>YOUTUBER GLOBAL EVENT {'-'} IT'S MY BIRTHDAY</b></p>
            </div>
            <div className="list-wrapper">

              <div className="english">
                <div className="language">
                  <button type="button" className="language-buttons" onClick={this.openYoutubeWishyoVideo.bind(this, "english")}><strong>ENGLISH</strong></button>
                </div>
                <div className="image-wrapper">
                  <button type="button" className="image-button" onClick={this.openYoutubeWishyoVideo.bind(this, "english")}><img src="/static/images/english.png" alt="youtuber-english" className="english-image youtuber-image" /></button>
                </div>
                <div className="button-wrapper">
                  <div className="sign-up">
                    <button type="button" className="youtuber-buttons" onClick={this.checkForLoggedIn}>SIGN-UP</button>
                  </div>
                </div>
              </div>

              <div className="hindi">
                <div className="language">
                  <button type="button" className="language-buttons" onClick={this.openYoutubeWishyoVideo.bind(this, "hindi")}><strong>हिंदी</strong></button>
                </div>
                <div className="image-wrapper">
                  <button type="button" className="image-button" onClick={this.openYoutubeWishyoVideo.bind(this, "hindi")}><img src="/static/images/hindi.png" alt="youtuber-hindi" className="hindi-image youtuber-image" /></button>
                </div>
                <div className="button-wrapper">
                  <div className="sign-up">
                    <button type="button" className="youtuber-buttons" onClick={this.checkForLoggedIn}>साइन अप करें</button>
                  </div>
                </div>
              </div>

              <div className="s-c">
                <div className="language">
                  <button type="button" className="language-buttons" onClick={this.openYoutubeWishyoVideo.bind(this, "mandarin")}><strong>普通话</strong></button>
                </div>
                <div className="image-wrapper">
                  <button type="button" className="image-button" onClick={this.openYoutubeWishyoVideo.bind(this, "mandarin")}><img src="/static/images/mandarin.png" alt="youtuber-s-c" className="chinesse-image youtuber-image" /></button>
                </div>
                <div className="button-wrapper">
                  <div className="sign-up">
                    <button type="button" className="youtuber-buttons" onClick={this.checkForLoggedIn}>注册</button>
                  </div>
                </div>
              </div>

              <div className="ar">
                <div className="language">
                  <button type="button" className="language-buttons" onClick={this.openYoutubeWishyoVideo.bind(this, "arabic")}><strong>عربى</strong></button>
                </div>
                <div className="image-wrapper">
                  <button type="button" className="image-button" onClick={this.openYoutubeWishyoVideo.bind(this, "arabic")}><img src="/static/images/arabic.png" alt="youtuber-hindi" className="ar-image youtuber-image" /></button>
                </div>
                <div className="button-wrapper">
                  <div className="sign-up">
                    <button type="button" className="youtuber-buttons" onClick={this.checkForLoggedIn}>سجل</button>
                  </div>
                </div>
              </div>

              <div className="pt">
                <div className="language">
                  <button type="button" className="language-buttons" onClick={this.openYoutubeWishyoVideo.bind(this, "portuguese")}><strong>{'Português'.toUpperCase()}</strong></button>
                </div>
                <div className="image-wrapper">
                  <button type="button" className="image-button" onClick={this.openYoutubeWishyoVideo.bind(this, "portuguese")}><img src="/static/images/portuguese.png" alt="youtuber-hindi" className="pt-image youtuber-image" /></button>
                </div>
                <div className="button-wrapper">
                  <div className="sign-up">
                    <button type="button" className="youtuber-buttons" onClick={this.checkForLoggedIn}>Inscrever-se</button>
                  </div>
                </div>
              </div>

              <div className="es">
                <div className="language">
                  <button type="button" className="language-buttons" onClick={this.openYoutubeWishyoVideo.bind(this, "spanish")}><strong>{'Español'.toUpperCase()}</strong></button>
                </div>
                <div className="image-wrapper">
                  <button type="button" className="image-button" onClick={this.openYoutubeWishyoVideo.bind(this, "spanish")}><img src="/static/images/spanish.png" alt="youtuber-hindi" className="es-image youtuber-image" /></button>
                </div>
                <div className="button-wrapper">
                  <div className="sign-up">
                    <button type="button" className="youtuber-buttons" onClick={this.checkForLoggedIn}>Regístrate</button>
                  </div>
                </div>
              </div>

              <div className="es">
                <div className="language">
                  <button type="button" className="language-buttons" onClick={this.openYoutubeWishyoVideo.bind(this, "japanish")}><strong>日本語</strong></button>
                </div>
                <div className="image-wrapper">
                  <button type="button" className="image-button" onClick={this.openYoutubeWishyoVideo.bind(this, "japanish")}><img src="/static/images/english.png" alt="youtuber-hindi" className="jp-image youtuber-image" /></button>
                </div>
                <div className="button-wrapper">
                  <div className="sign-up">
                    <button type="button" className="youtuber-buttons" onClick={this.checkForLoggedIn}>サインアップ</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div className="youtuber-footer">
          <FooterInnerPage />
        </div>

        {/* explaination videos  */}
        <Modal
          show={this.state.videoModal}
          onHide={this.closeYoutubeWishyoVideo}
          dialogClassName="wishyoo_videos"
        >
          <Modal.Body>
            <div className="vContainer">
              { this.state.whichVideo === 'english' ?
                <iframe src="https://player.vimeo.com/video/206097125" className="iframe-video" width="640" height="360" frameBorder="0" webkitallowfullscreen mozallowfullscreen allowFullScreen />
                :
                undefined
              }
              { this.state.whichVideo === 'hindi' ?
                <iframe src="https://player.vimeo.com/video/224109944" className="iframe-video" width="640" height="360" frameBorder="0" webkitallowfullscreen mozallowfullscreen allowFullScreen />
                :
                undefined
              }
              { this.state.whichVideo === 'mandarin' ?
                <iframe src="https://player.vimeo.com/video/224109845" className="iframe-video" width="640" height="368" frameBorder="0" webkitallowfullscreen mozallowfullscreen allowFullScreen />
                :
                undefined
              }
              { this.state.whichVideo === 'portuguese' ?
                <iframe src="https://player.vimeo.com/video/224109698" className="iframe-video" width="640" height="368" frameBorder="0" webkitallowfullscreen mozallowfullscreen allowFullScreen />
                :
                undefined
              }
              { this.state.whichVideo === 'arabic' ?
                <iframe src="https://player.vimeo.com/video/224110020" className="iframe-video" width="640" height="368" frameBorder="0" webkitallowfullscreen mozallowfullscreen allowFullScreen />
                :
                undefined
              }
              {
                this.state.whichVideo === 'spanish' ?
                <iframe src="https://player.vimeo.com/video/228380079" className="iframe-video" width="640" height="368" frameBorder="0" webkitallowfullscreen mozallowfullscreen allowFullScreen />
                :
                undefined
              }
              {
                this.state.whichVideo === 'japanish' ?
                  <img src="/static/images/coming_soon.png" alt="coming-soon" style={{ height: '352px', width: '100%' }} />
                :
                undefined
              }
            </div>
          </Modal.Body>
        </Modal>

        {/* Logout required modal */}
        <Modal
          show={this.state.showModal}
          onHide={() => {
            this.setState({ showModal: false });
          }}
        >
          <div className="mt30">
            <img
              src="/static/images/wishyoo_logo.png"
              alt="wishyoo smile"
              style={{ height: '150px', marginBottom: '20px' }}
            />
            <br />
            <p>To register for this event, <br />You must authenticate your YouTube credentials. <br />Please<a><button className="btn-link logout" onClick={this.logout}><span style={{ color: '#FF8A15', cursor: 'pointer' }}>log out</span></button></a>before registering.</p>
          </div>
        </Modal>
        {
          this.props.url.query.error ?
            <Modal
              show={this.state.showErrorModal}
              onHide={() => {
                this.setState({ showErrorModal: false });
              }}
            >
              <div className="mt30">
                <img
                  src="/static/images/wishyoo_logo.png"
                  alt="wishyoo smile"
                  style={{ height: '150px', marginBottom: '20px' }}
                />
                <br />
                <p>Failed to fetch your profile, <br />Please <span style={{ color: '#FF8A15' }}>try again</span> with other account</p>
              </div>
            </Modal> : undefined
        }
      </div>
    );
  }
}

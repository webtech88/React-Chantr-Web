import React from 'react';
import { Carousel } from 'react-bootstrap';
import Head from '../layouts/Head';
import FooterInnerPage from '../layouts/FooterInnerPage';
import AppNavbar from '../layouts/Navbar';
import HandleError from '../HandleError';

export default class Explore extends React.Component {
  render() {
    return (
      <div>
        <Head {...this.props} />
        <AppNavbar {...this.props} />
        <HandleError {...this.props} />
        <div className="explore">
          <section className="unique-features white-bg" id="explore">
            <div className="container">
              <div className="section-header">
                <h2 className="dark-text">EXPLORE WISHYOO</h2>
                <div className="colored-line" />
                <div className="sub-heading">
                  Join the true evolution of the greeting card and help us create a greener future
                </div>
              </div>
              <div className="row">
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
                <div className="col-md-8">
                  <div className="feature">
                    <div className="icon-container">
                      <span className="colored-text"><i className="fa fa-bullhorn" /></span>
                    </div>
                    <div className="description text-left">
                      <h4 className="dark-text">What’s on a WishYoo?</h4>
                      <div className="grey-line-short" />
                      <div className="text-left">
                        <ul>
                          <li className="list-style-bullet">A chorus of voices that create
                            a common chant
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
                      <div className="grey-line-short" />
                      <p className="text-left">We want the world to experience the magic of
                        WishYoo Cards, so we decided to make all features of our app
                        absolutely free!
                      </p>
                    </div>
                  </div>
                  <div className="feature">
                    <div className="icon-container">
                      <span className="colored-text"><i className="fa fa-microphone" /></span>
                    </div>
                    <div className="description text-left">
                      <h4 className="dark-text">VOICE</h4>
                      <div className="grey-line-short" />
                      <p className="text-left">Create a song your friends can sing along to,
                        and when enough people join, it will sound like this :
                        <button className="sample_btn_style">
                          <i className="fa fa-pause-circle-o" aria-hidden="true" />
                        </button>
                        <button className="sample_btn_style">
                          <i className="fa fa-play-circle-o" aria-hidden="true" />
                        </button>
                      </p>
                    </div>
                  </div>
                  <div className="feature">
                    <div className="icon-container">
                      <span className="colored-text"><i className="fa fa-heart" /></span>
                    </div>
                    <div className="description text-left">
                      <h4 className="dark-text">Signature Board</h4>
                      <div className="grey-line-short" />
                      <p className="text-left">Handwritten dedications from all your friends on
                        a limitless board! They can even include pictures of the times you
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
                      <div className="grey-line-short" />
                      <p className="text-left">WishYoo makes it easier to purchase meaningful
                        gifts by sharing the cost with others invited to participate
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <FooterInnerPage />
      </div>
    );
  }
}

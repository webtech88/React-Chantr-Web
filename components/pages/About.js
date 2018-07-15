import React from 'react';
import Head from '../layouts/Head';
import FooterInnerPage from '../layouts/FooterInnerPage';
import AppNavbar from '../layouts/Navbar';
import HandleError from '../HandleError';

export default class About extends React.Component {
  render() {
    return (
      <div>
        <Head {...this.props} />
        <AppNavbar {...this.props} />
        <HandleError {...this.props} />
        <div className="about_us">
          <section className="white-bg-border text-left" id="about_us" style={{ padding: '50px 0 310px 0' }}>
            <div className="container">
              <div className="row">
                <div
                  className="col-md-12 content-section pull-left wow fadeInRight"
                  data-wow-offset="20"
                  data-wow-duration="1.75s"
                >
                  <div className="small-text-medium uppercase colored-text text-center">
                    <h2 className="dark-text">About</h2>
                  </div>
                  <div className="colored-line text-center" />
                  <p className="text-left">
                    WishYoo was born out of one simple idea: <strong>Out of Many, One.</strong>
                    On WishYoo, join thousands of voices into one message, thousands of
                    signatures into one epic birthday card, or thousands of friends chipping
                    in on one gift.
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
                          <span className="colored-text">
                            <i className="fa fa-users" />
                          </span>
                          Invite millions of friends to add their voices to your WishYoo cards.
                        </li>
                        <li>
                          <span className="colored-text">
                            <i className="fa fa-users" />
                          </span>
                          Find WishYoos to join and become a part of movements to change
                          the world!
                        </li>
                        <li>
                          <span className="colored-text"><i className="fa fa-thumbs-up" /></span>
                          Share on your favorite social networks and harness the power of the
                          crowd!
                        </li>
                      </ul>
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

import React from 'react';
import { Link } from '../../routes';

export default () => {
  return (
    <div className="newFooter">
      <div className="container">
        <div className="row">
          <div className="col-sm-3">
            <h3>Need Help ?</h3>
            <Link href="/categories"><a>Categories</a></Link>
            <Link href="/faqs"><a>FAQs</a></Link>
            <Link href="/terms_of_service"><a>Terms</a></Link>
            <Link href="/privacy_policy"><a>Privacy Policy</a></Link>
            <Link href="mailto:contact@wishyoo.com"><a>Contact Us</a></Link>
          </div>
          <div className="visible-xs h20" />
          <div className="col-sm-3">
            <h3>Stay Connected</h3>
            <a href="https://www.facebook.com/Wishyoo-1604102806586076/">Facebook</a>
            <a href="https://twitter.com/wish_yoo">Twitter</a>
            <a href="https://www.youtube.com/channel/UC4Wrk73XYYLKRY1ClYxB3Pw">Youtube</a>
            <a href="">Instagram</a>
            <a href="">Pinterest</a>
          </div>
          <div className="visible-xs h20" />
          <div className="col-sm-2">
            <h3>Our Company</h3>
            <Link href="/about_us"><a>About</a></Link>
            <Link href=""><a>Press</a></Link>
            <Link href=""><a>Careers</a></Link>
          </div>
          <div className="visible-xs h20" />
          <div className="col-sm-4 text-center">
            <div className="display-flex">
              <div>
                <div className="text-center">
                  <p className="download-app-text">To create a card, download the app!</p>
                </div>
                <div className="clearfix download-app">
                  <a
                    href="https://itunes.apple.com/app/wishyoo/id1125036797?mt=8"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/static/images/app_store.png"
                      alt="download app from apple app store"
                      style={{ width: '100px' }}
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.wishyoo.src"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/static/images/google_play.png"
                      alt="download app from google play store"
                      style={{ width: '100px' }}
                    />
                  </a>
                </div>
                <img src="/static/images/wishyoo_logo-2.png" alt="wishyoo logo" style={{ width: '130px', marginTop: '-12px' }} />
                <p className="rights" style={{ marginTop: '-14px' }}>©2017 More Trees, Inc.<br />All Rights Reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

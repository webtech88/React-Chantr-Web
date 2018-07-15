import React from 'react';
import { Link } from '../../routes';

export default () => {
  return (
    <div>
      <div className="contact-info dark-bg">
        <div className="container">
          <div className="row contact-links">
            <div className="contact_icons">
              <div className="icon-container">
                <span className="icon-basic-mail colored-text" style={{ color: 'white' }} />
              </div>
              <a href="mailto:contact@wishyoo.com" className="strong footer-text">contact@wishyoo.com</a>
            </div>
            <div className="contact_icons">
              <div className="icon-container">
                <span className="icon-basic-geolocalize-01 colored-text" style={{ color: 'white' }} />
              </div>
              <p className="strong footer-text" style={{ margin: '0px' }}>San Mateo, CA</p>
            </div>
            <div className="contact_icons">
              <div className="icon-container">
                <span className="icon-basic-tablet colored-text" style={{ color: 'white' }} />
              </div>
              <a href="tel:8003368023" className="strong footer-text">(800) 336-8023</a>
            </div>
            <div className="contact_icons">
              <a href="https://itunes.apple.com/app/wishyoo/id1125036797?mt=8" target="_blank" type="button" rel="noopener noreferrer">
                <img
                  src="/static/images/app_store.png"
                  alt="download app from apple app store"
                  style={{width: '145px', height: '50px'}}
                />
              </a>
            </div>
            <div className="contact_icons">
              <a href="https://play.google.com/store/apps/details?id=com.wishyoo.src" target="_blank" type="button" rel="noopener noreferrer">
                <img
                  src="/static/images/google_play.png"
                  alt="download app from google play store"
                  style={{width: '145px', height: '50px'}}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer grey-bg">
        ©2017 More Trees, Inc. &nbsp; &nbsp; &nbsp;
        Reproduction without explicit permission is prohibited. All Rights Reserved.
        <ul className="footer-links small-text">
          <li><Link href="/about_us"><a className="dark-text">About</a></Link></li>
          <li><Link href="/terms_of_service"><a className="dark-text">Terms</a></Link></li>
          <li><Link href="/privacy_policy"><a className="dark-text">Privacy</a></Link></li>
          <li><Link href="/faqs"><a className="dark-text">FAQ</a></Link></li>
        </ul>
        <ul className="social-icons">
          <li><a href="https://www.facebook.com/Wishyoo-1604102806586076/"><span className="icon-social-facebook transparent-text-dark" /></a>
          </li>
          <li><a href="https://twitter.com/wish_yoo"><span className="icon-social-twitter transparent-text-dark" /></a>
          </li>
          {/*
            <li>
              <a href=""><span className="icon-social-googleplus transparent-text-dark" /></a>
            </li>
            <li>
              <a href="https://www.linkedin.com/company/chantr?trk=nmp_rec_act_company_photo">
                <span className="icon-social-linkedin transparent-text-dark" />
              </a>
            </li>
          */}
        </ul>
      </footer>
    </div>
  );
};

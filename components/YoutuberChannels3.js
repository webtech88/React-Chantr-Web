import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import genImg from '../lib';
import FooterInnerPage from './layouts/FooterInnerPage';

export default class YoutuberChannels3 extends React.Component {

  constructor(props) {
    super(props);
    this.displayDefault = this.displayDefault.bind(this);
    this.displayPaypal = this.displayPaypal.bind(this);
    this.displayBank = this.displayBank.bind(this);
    this.displaySubmit = this.displaySubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setDefaultData = this.setDefaultData.bind(this);
    this.displayError = this.displayError.bind(this);
    this.validateData = this.validateData.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
    this.state = {
      payment_type: false,
      paypal_link: '',
      submit: false,
      success: false,
      error: '',
    };
  }

  componentWillMount() {
    if (!this.props.url.query.payment_type) {
      this.setState({ payment_type: false });
    } else if (this.props.url.query.payment_type && (this.props.url.query.payment_type === 'paypal')) {
      this.setState({ payment_type: 'paypal' });
    } else if (this.props.url.query.payment_type && (this.props.url.query.payment_type === 'bank_account')) {
      this.setState({ payment_type: 'bank_account' });
    }
  }

  componentDidMount() {
    this.setDefaultData();
  }

  setDefaultData() {
    const youtuberData = JSON.parse(localStorage.getItem('youtuber_channels'));
    if (youtuberData) {
      if (youtuberData.paypal_link) {
        this.setState({ paypal_link: youtuberData.paypal_link });
      }
    }
  }

  checkEmail() {
    let flag = true;
    if (!this.state.paypal_link) {
      this.setState({ error: 'Email is required' });
      flag = false;
    }
    return flag;
  }

  handleSubmit(event) {
    event.preventDefault();
    localStorage.setItem('youtuber_channels',
      JSON.stringify(Object.assign(
        {},
        JSON.parse(localStorage.getItem('youtuber_channels')),
        { paypal_link: this.state.paypal_link },
      )),
    );

    const youtuberChannelsInfo = JSON.parse(localStorage.getItem('youtuber_channels'));
    const emailFlag = this.checkEmail();
    if (emailFlag) {
      const flag = this.validateData(youtuberChannelsInfo);
      if (flag) {
        this.props.actions.saveChannelForContest(youtuberChannelsInfo, (response) => {
          if (response.status === 200) {
            this.setState({ submit: true, success: true });
          } else {
            this.setState({ submit: true, success: false });
          }
        });
      }
    }
  }

  validateData(youtuberChannelsInfo) {
    this.window = window;
    if (
        youtuberChannelsInfo.channel_id &&
        youtuberChannelsInfo.birthday &&
        youtuberChannelsInfo.paypal_link
      ) {
      return true;
    } else if (!youtuberChannelsInfo.channel_id) {
      this.window.location = '/youtuber_channels/1';
      return false;
    } else if (!youtuberChannelsInfo.birthday) {
      this.window.location = '/youtuber_channels/2';
      return false;
    } else if (!youtuberChannelsInfo.paypal_link) {
      this.window.location = '/youtuber_channels/3';
      return false;
    }
    return false;
  }

  handleChange(event) {
    const self = this;
    if (event.target.id === 'email') {
      self.setState({ paypal_link: event.target.value });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  displayDefault() {
    return (
      <div>
        <div className="birthday container">
          <div className="cancel-btn">
            <a href="/">
              <p className="cancel-btn-text">
                CANCEL
              </p>
            </a>
          </div>
          <h3>3. <img src="/static/images/list_arrow.png" alt="arrow" width="30px" height="25px" style={{ marginTop: '-5px' }} /> Where should we send you the money you make?</h3>
          <div className="h64" />
          <div className="col-lg-6 col-md-6 col-sm-6">
            <div className="acc-options-img">
              <a href="/youtuber_channels/3?payment_type=paypal" className="payment" style={{ textDecoration: 'none' }}>
                <div className="paypal">
                  <p>
                    I have
                  </p>
                  <p className="buttonParagraph">Paypal</p>
                </div>
              </a>
              <div className="paymentImage">
                <img src={genImg('', 'paypal')} alt="Paypal" />
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6">
            <div className="acc-options-img">
              <a href="/youtuber_channels/3?payment_type=bank_account" className="payment" style={{ textDecoration: 'none' }}>
                <div className="bank_account">
                  <p>
                    I have a Bank
                  </p>
                  <p className="buttonParagraph">
                    Account
                  </p>
                </div>
              </a>
              <div className="paymentImage">
                <img src={genImg('', 'bank_account')} alt="Bank account" />
              </div>
            </div>
          </div>
        </div>
        <div className="youtuber-footer">
          <FooterInnerPage />
        </div>
      </div>
    );
  }

  displayPaypal() {
    return (
      <div>
        <div className="birthday container">
          <div className="cancel-btn">
            <a href="/">
              <p className="cancel-btn-text">
                CANCEL
              </p>
            </a>
          </div>
          <h3>3. <img src="/static/images/list_arrow.png" alt="arrow" width="30px" height="25px" style={{ marginTop: '-5px' }} /> Please Provide your PayPal link.</h3>
          <div className="h64" />
          <div className="col-xs-6 col-xs-offset-3">
            <form onSubmit={this.handleSubmit}>
              <div className="email password">
                <input
                  type="text"
                  className="form-control date"
                  placeholder="paypal.me/XXXXXXXXXXX"
                  id="email"
                  required
                  onChange={this.handleChange}
                  value={this.state.paypal_link}
                  autoComplete="off"
                />
              </div>
              {this.state.error ?
                <div className="text-left" style={{ color: 'red', fontSize: '12px' }}>
                  {this.state.error}</div> : ''
              }
              <div className="next">
                <button id="lsubmit" type="submit">Next</button>
              </div>
            </form>
          </div>
        </div>
        <div className="youtuber-footer">
          <FooterInnerPage />
        </div>
      </div>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  displayBank() {
    return (
      <div>
        <div className="birthday bank_payment container">
          <div className="cancel-btn">
            <a href="/">
              <p className="cancel-btn-text">
                CANCEL
              </p>
            </a>
          </div>
          <h3>3. <img src="/static/images/list_arrow.png" alt="arrow" width="30px" height="25px" style={{ marginTop: '-5px' }} /> Please create a PayPal account and link your bank account to it so we can pay you.... <a href="https://paypal.com" target="_blanck">It’s super easy </a>.
          </h3>
          <div className="h64" />
          <div className="row">
            <div className="col-md-2 col-md-offset-2">
              <div>
                <img
                  className="bank"
                  id="payment"
                  src="/static/images/paypal.png"
                  alt="paypal"
                />
              </div>
            </div>
            <div className="col-md-2 col-md-offset-1">
              <div>
                <img
                  className="bank"
                  id="payment"
                  src="/static/images/bank_account.png"
                  alt="bank_account"
                />
              </div>
              <div>
                <img
                  className="bank arrow"
                  id="payment"
                  src="/static/images/arrow.png"
                  alt="arrow"
                />
              </div>
            </div>
            <div className="col-md-3 col-md-offset-1">
              <div>
                <div id="done">
                  <a href="/youtuber_channels/3?payment_type=paypal"> <button className="previous" >Click when you’re done</button></a>
                </div>
                <div className="or"><b>or</b></div>
                <div className="">
                  <a href="/youtuber_channels/3">
                    <button
                      className="previous"
                      id="returnBack"
                    >
                      Return to previous
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="youtuber-footer bank-youtuber-footer">
          <FooterInnerPage />
        </div>
      </div>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  displaySubmit() {
    return (
      <div>
        <div className="birthday container">
          <h3 className="success"><b>Congrats, you’re done! </b></h3>
          <div className="row">
            <div className="col-xs-6 col-xs-offset-3">
              <p style={{ fontFamily: 'Century Gothic', fontSize: '18px', margin: '0px' }}>
                DOWNLOAD OUR FREE APP AND CREATE YOUR CARD...
              </p>
              <p style={{ fontFamily: 'Century Gothic', fontSize: '18px' }}>
                <button className="card-create-intro"><a><u><b>HERE'S HOW</b></u></a></button>
              </p>
              <div className="app-download" style={{ marginBottom: '40px' }}>
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
                    style={{ width: '130px', height: '40px' }}
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
                    style={{ width: '130px', height: '40px' }}
                  />
                </a>
              </div>
              <div className="sign-and-share">
                <p style={{ fontFamily: 'Century Gothic', fontSize: '18px', lineHeight: '1' }}>
                  …AND REMEMBER TO ASK EVERYONE TO <u>SIGN IT AND SHARE IT</u>
                </p>
                <p style={{ fontFamily: 'Century Gothic', fontSize: '18px', lineHeight: '1' }}>
                  4 WEEKS BEFORE YOUR BIRTHDAY
                </p>
              </div>
              <div className="save-trees" style={{ marginTop: '30px' }}>
                <p style={{ fontFamily: 'Century Gothic', fontSize: '18px', lineHeight: '1' }}>
                  By entering this contest you’re
                </p>
                <p style={{ fontFamily: 'Century Gothic', fontSize: '18px', lineHeight: '1' }}>
                  helping save millions of trees every year
                </p>
              </div>
            </div>

            {/* Visible for only small screen */}
            <div className="visible-xs">
              <div className="treeAndButton">
                <div>
                  <img className="treeImage" src="/static/images/tree.png" alt="Prepaid Card" />
                </div>
                <div className="finishButton">
                  <a href="/" style={{ textDecoration: 'none' }} >
                    <div className="button finish">
                      <p style={{ fontFamily: 'Century Gothic' }}>
                        Finish
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* visible for all screen size except small screen */}
            <div className="hidden-xs">
              <div>
                <img className="treeImage" src="/static/images/tree.png" alt="Prepaid Card" />
              </div>
              <div className="finishButton">
                <a href="/profile" style={{ textDecoration: 'none' }} >
                  <div className="button finish">
                    <p style={{ fontFamily: 'Century Gothic' }}>
                      Finish
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="youtuber-footer bank-youtuber-footer">
          <FooterInnerPage />
        </div>
      </div>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  displayError() {
    return (
      <div>
        <div className="container birthday">
          <Jumbotron>
            <h1>Failure</h1>
            <p>Something went wrong. Please <a href="/youtuber_channels/1">try again</a></p>
          </Jumbotron>
        </div>
        <div className="youtuber-footer">
          <FooterInnerPage />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {/* Email */}
        {
          !this.state.submit && this.state.payment_type === false ? this.displayDefault() : undefined
        }

        {
          !this.state.submit && this.state.payment_type === 'paypal' ? this.displayPaypal() : undefined
        }

        {
          !this.state.submit && this.state.payment_type === 'bank_account' ? this.displayBank() : undefined
        }
        {
          this.state.submit && this.state.success ? this.displaySubmit() : undefined
        }
        {
          this.state.submit && !this.state.success ? this.displayError() : undefined
        }
      </div>
    );
  }
}


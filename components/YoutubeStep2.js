import React from 'react';
import FooterInnerPage from './layouts/FooterInnerPage';

export default class YoutubeStep2 extends React.Component {
  constructor(props) {
    super(props);
    this.agree = this.agree.bind(this);
    this.state = {
      height: ''
    };
  }

  componentDidMount() {
    function parseParms(str) {
      const pieces = str.split('&');
      const data = {};
      let i;
      let parts;
      for (i = 0; i < pieces.length; i += 1) {
        parts = pieces[i].split('=');
        if (parts.length < 2) {
          parts.push('');
        }
        data[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
      }
      return data;
    }
    const query = window.location.search;
    const queryOnly = query.substring(1);
    const queryObject = parseParms(queryOnly);
    localStorage.setItem('youtuberData',
      JSON.stringify(Object.assign(
        {},
        JSON.parse(localStorage.getItem('youtuberData')),
        { callback: queryObject },
      )),
    );

    this.setState({ height: window.innerHeight });
  }

  agree(event) {
    if (event.target.value === 'agree') {
      localStorage.setItem('youtuberData',
        JSON.stringify(Object.assign(
          {},
          JSON.parse(localStorage.getItem('youtuberData')),
          { step2: true },
        )),
      );
      window.location = '/youtuber/3';
    } else {
      localStorage.setItem('youtuberData',
        JSON.stringify(Object.assign(
          {},
          JSON.parse(localStorage.getItem('youtuberData')),
          { step2: false },
        )),
      );
      window.location = '/';
    }
    return this;
  }

  render() {
    return (
      <div>
        {/* terms and conditions */}
        <div className="terms-conditions">
          <h3>2. <img src="/static/images/list_arrow.png" alt="arrow" width="30px" height="25px" style={{ marginTop: '-5px' }} /> Please read the terms and conditions</h3>
          <div className="row">
            <div className="col-md-8 col-md-offset-2 terms">
              <div className="divBorder">
                <iframe
                  src="/static/views/youtube_agreement.html"
                  width="100%"
                  height="1000"
                  frameBorder="0"
                  scrolling="auto"
                  className="wishyoo_terms_of_service hidden-xs"
                  style={{ maxHeight: this.state.height }}
                />
                <iframe
                  src="/static/views/youtube_agreement.html"
                  width="100%"
                  height="400"
                  frameBorder="0"
                  scrolling="auto"
                  className="visible-xs"
                  style={{ maxHeight: this.state.height }}
                />
              </div>
              <div className="agree-buttons">
                <div className="termsActions pull-right disagree terms-buttons">
                  <button
                    className="termsButtons"
                    value="disagree"
                    onClick={this.agree}
                    id="myimage"
                    type="submit"
                  >
                    Disagree
                  </button>
                </div>
                <div className="termsActions pull-right agree terms-buttons">
                  <button
                    className="termsButtons"
                    value="agree"
                    onClick={this.agree}
                    id="myimage"
                    type="submit"
                  >
                    Agree
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <FooterInnerPage />
        </div>
      </div>
    );
  }
}


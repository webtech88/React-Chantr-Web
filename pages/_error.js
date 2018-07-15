import React from 'react';
import Head from '../components/layouts/Head';

export default class Error extends React.Component {
  render() {
    return (
      <div>
        <div id="snow" />
        <Head />
        <header id="cta" className="background-showcase alter error" style={{ backgroundColor: '#202020' }}>
          <div className="container">
            <div>
              <a href="/">
                <svg version="1.1" id="Layer_1" x="0px" y="0px" width="100%" height="150px" viewBox="0 0 283.46 283.46" enableBackground="new 0 0 283.46 283.46" dangerouslySetInnerHTML={{ __html: '<use xlink:href="/static/images/WishYoo.svg#Layer_1"></use>' }} />
              </a>
            </div>
            <div className="d_f">
              <h1>4</h1>
              <img src="/static/images/wishyoo_logo.png" alt="wishyoo logo" />
              <h1>4</h1>
            </div>
            <div>
              <p><strong>Oops!</strong> The Page you requested was not found!</p>
            </div>
            <div>
              <p className="small">You can go to home page by clicking this <a href="/">link</a></p>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

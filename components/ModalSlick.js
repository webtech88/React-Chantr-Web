import { Modal } from 'react-bootstrap';
import React from 'react';
import Slider from 'react-slick';
import genImg from '../lib';

class ModalSlick extends React.Component {

  constructor(props) {
    super(props);
    this.modalSlick = this.modalSlick.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.report = this.report.bind(this);
    this.share = this.share.bind(this);
    this.state = {
      settings: {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        draggable: false,
        showCardTypeModal: false,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 400,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          }],
        beforeChange: (prevIndex, nextIndex) => {
          this.props.modalSlick(this.modal_slick, this.props.type, prevIndex, nextIndex);
        }
      },
    };
  }

  componentDidMount() {
    this.props.modalSlick(this.modal_slick, this.props.type);
  }

  next() {
    this.modal_slick.slickNext();
  }

  previous() {
    this.modal_slick.slickPrev();
  }

  report(selectedObj, type) {
    this.props.report(selectedObj, type);
  }

  share(type, title, imageUrl, sharedFrom) {
    if (!this.props.isPrivateChantCard) {
      this.props.share(type, title, imageUrl, sharedFrom);
    } else {
      this.setState({ showCardTypeModal: true });
    }
  }

  modalSlick() {
    if (this.props.type === 'image') {
      const list = this.props.data.images.map((image) => {
        return (
          <div key={image.blob_url + Math.random()}>
            <div className="galaryStyle">
              {genImg(image.blob_url, 'cardCover')}
                <button
                  type="button" className="btn sliderBtn sliderReportBtn"
                  onClick={() => { this.report(image, 'image'); }}
                >Report</button>
            </div>
          </div>
        );
      });
      return (
        <div>
          <button type="button" className="slick-btn left" onClick={this.previous}>
            <img src="/static/images/carousel/arrow_left_for_carousel.png" height="50" alt="arrow-left" />
          </button>
          <Slider ref={(c) => { this.modal_slick = c; }} {...this.state.settings}>
            {list}
          </Slider>
          <button type="button" className="slick-btn right" onClick={this.next}>
            <img src="/static/images/carousel/arrow_right_for_carousel.png" height="50" alt="arrow-right" />
          </button>
        </div>
      );
    }
    const list = this.props.data.signatures.map((signature) => {
      return (
        <div key={signature.image_url + Math.random()}>
          <div className="galaryStyle" >
            <div className={"signatureContainer" + signature.id} style={{ height: '85%', display: 'flex', justifyContent: 'center' }}>
              <img src={signature.image_url} alt={`signautre - ${signature.id}`} className="cardAnimatedSignature" style={{ maxHeight: '100%', maxWidth: '100%', height: 'auto', width: 'auto' }} />
            </div>
            <button type="button" className="btn sliderBtn sliderReportBtn" onClick={() => this.report(signature, 'signature')}>Report</button>
            <div className="sliderShareDiv mobileViewHidden">
              <ul className="sharing">
                <li><strong>Share : </strong></li>
                <li className="icon facebook">
                  <button onClick={() => { this.share('facebook', 'facebook', signature.image_url_png, 'modal'); }}>
                    <i className="fa fa-facebook-square" aria-hidden="true" />
                  </button>
                </li>
                <li className="icon twitter">
                  <button onClick={() => { this.share('twitter', 'twitter', signature.image_url_png, 'modal'); }}>
                    <i className="fa fa-twitter-square" aria-hidden="true" />
                  </button>
                </li>
                <li className="icon google">
                  <button onClick={() => { this.share('google+', 'google+', signature.image_url_png, 'modal'); }}>
                    <i className="fa fa-google-plus-square" aria-hidden="true" />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div style={{ height: 'auto', maxHeight: '600px' }}>
        <button type="button" className="slick-btn left" onClick={this.previous}>
          <img src="/static/images/carousel/arrow_left_for_carousel.png" height="50" alt="arrow-left" />
        </button>
        <Slider ref={(c) => { this.modal_slick = c; }} {...this.state.settings}>
          {list}
        </Slider>
        <button type="button" className="slick-btn right" onClick={this.next}>
          <img src="/static/images/carousel/arrow_right_for_carousel.png" height="50" alt="arrow-right" />
        </button>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.modalSlick()}
        <Modal
          show={this.state.showCardTypeModal}
          onHide={() => { this.setState({ showCardTypeModal: false }); }} dialogClassName="donationAwesomeModal">
          <button onClick={() => { this.setState({ showCardTypeModal: false });}} className="closeModalButton">
            X
          </button>
          <div style={{ marginTop: "50px" }}>
            <div>
              <h1>
                <img src="/static/images/party_icon.png" alt="party_icon" height="70" style={{ marginTop: "-30px" }} />
                Oops !!</h1>
            </div>
            <div style={{ paddingTop: "20px" }}>
              <p>
                <span>You cannot Social-share dedications on from a private card</span>
              </p>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default ModalSlick;

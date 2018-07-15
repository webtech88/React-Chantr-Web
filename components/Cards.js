import React from 'react';
import Slider from 'react-slick';
import moment from 'moment';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

import { Link } from '../routes';
import genImg from '../lib';

class Cards extends React.Component {

  constructor(props) {
    super(props);
    this.cards = this.cards.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.state = {
      slideToShowToScroll: 4,
      currentSlide: 0,
      isCardsLoaded: false,
      userSettings: {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
          { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
          { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 2 } },
          { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 3 } },
        ],
      },
    };
  }

  componentWillMount() {
    this.props.resetFeatureCards ? this.props.resetFeatureCards(4, 0) : undefined;
  }

  componentDidMount() {
    let skipOrOffset = this.props.data && (this.props.data.metadata.offset !== undefined) ? this.props.data.metadata.offset : this.props.data.metadata.skip;
    this.props.actions(
      this.props.data.metadata.limit,
      skipOrOffset + this.props.data.metadata.limit,
      this.props.userId,
    );
    this.setState({ isCardsLoaded: true });
  }

  afterChange(current) {
    const totalCards = this.props.data.metadata.total;
    const loadedCards = this.props.data.cards.length;
    let skipOrOffset = this.props.data && (this.props.data.metadata.offset !== undefined) ? this.props.data.metadata.offset : this.props.data.metadata.skip;

    // If total card count is more than currently loaded card count AND
    if (totalCards > loadedCards &&
      ((loadedCards - current) <= this.props.data.metadata.limit) ) {
      this.props.actions(
        this.props.data.metadata.limit,
        skipOrOffset + this.props.data.metadata.limit,
        this.props.userId,
      );
    }
  }

  next() {
    this.userSlider.slickNext();
  }

  previous() {
    this.userSlider.slickPrev();
  }

  cards() {
    if (this.props.data.cards) {
      const list = this.props.data.cards.map((card) => {
        const tooltip = (
          <Tooltip id="tooltip">{card.owner_username}</Tooltip>
        );
        return (
          <div className="user-card" key={card.id + Math.random()}>
            <Link route="card" params={{ id: card.id }}>
              <a>
                <div className="cardTitle">{card.title}</div>
                { genImg(card.image, 'cardBanner') }
                <div className="info">
                  <div className="user_data">
                    <div>{ genImg(card.owner_image, 'profileImg') }</div>
                    <div>
                      {
                        card.owner_username.length > 15 ?
                          <OverlayTrigger placement="top" overlay={tooltip}>
                            <div className="font18 card_username text-left">{_.truncate(card.owner_username, {'length': 15, 'omission': '...' })}</div>
                          </OverlayTrigger>
                        :
                          <div className="font18 card_username text-left">{card.owner_username}</div>
                      }
                      <div className="font12" style={{ textAlign: 'left' }}>
                        { moment(card.createdAt).format('MMM-DD-YYYY') }
                      </div>
                    </div>
                    <div className="c">
                      <span className="hashtag tag_color">#{card.category}</span>
                    </div>
                  </div>
                  <div className="color-light-gray card-other-info">
                    <div>
                      <span>{card.num_joins} </span>
                      <i className="fa fa-user-plus" aria-hidden="true" />
                    </div>
                    <div>
                      <span className={card.user_can_like === false ? 'hasLiked' : ''}>
                        {card.num_likes}
                      </span>
                      <i
                        aria-hidden="true"
                        className={card.user_can_like === false ?
                          'hasLiked fa fa-heart' : 'fa fa-heart'
                        }
                      />
                    </div>
                    <div>
                      <i
                        aria-hidden="true"
                        className={card.hasGift === true ?
                          'hasGift fa fa-gift' : 'fa fa-gift'
                        }
                      />
                    </div>
                    <div>
                      <i
                        className={card.hasRecording === true ?
                          'fa fa-microphone hasRecording' : 'fa fa-microphone-slash'
                        }
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          </div>
        );
      });
      const sliderSettings = this.state.userSettings;
      sliderSettings.afterChange = this.afterChange.bind(this);
      return (
        <div className="clearfix" style={{ position: 'relative', minHeight: '428px' }}>
          <div>
            <button type="button" className="slick-btn left" onClick={this.previous}>
              <i className="fa fa-angle-left" aria-hidden="true" />
            </button>
            <div className="slickStyle cards-slick-dim">
              <Slider ref={(c) => { this.userSlider = c; }} {...sliderSettings}>
                {list}
              </Slider>
            </div>
            <button type="button" className="slick-btn right" onClick={this.next}>
              <i className="fa fa-angle-right" aria-hidden="true" />
            </button>
          </div>
          {this.props.isLoading === false ? '' :
          <div
            className="textcenter"
            style={{ minHeight: '428px',
              top: '0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              zIndex: '300000',
              width: '100%',
            }}
          >
            <img src="/static/images/loader-red-1.gif" height="100" alt="loading cards" />
          </div>
          }
        </div>
      );
    }
    return (
      <div className="text-center"><h2 className="noCards">-</h2></div>
    );
  }

  render() {
    return (
      <div>
        {
          this.state.isCardsLoaded ?
            this.cards() :
            <div className="text-center">
              <img src="/static/images/loader-red-1.gif" height="100" alt="loading cards" />
            </div>
        }
      </div>
    );
  }

}

export default Cards;

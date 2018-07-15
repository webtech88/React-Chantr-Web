import React from 'react';
import Slider from 'react-slick';
import moment from 'moment';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

import genImg from '../lib';
import { Link } from '../routes';

class CategoriesCards extends React.Component {

  constructor(props) {
    super(props);
    this.getCardCategories = this.getCardCategories.bind(this);
    this.getCategoryCards = this.getCategoryCards.bind(this);
    this.changeCategory = this.changeCategory.bind(this);
    this.state = {
      isCardsLoaded: false,
      settings: {
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

  componentDidMount() {
    this.setState({ isCardsLoaded: true });
  }

  getCardCategories() {
    return (
      this.props.cardsCategories.map((category) => {
        return (
          <button
            key={category.name}
            className="category text-center"
            onClick={() => { this.changeCategory(category.name, category.display_name); }}
          >
            <div
              className={
                category.name === this.props.activeCategory.name ? 'card_selected cat' : 'cat'
              }
            >
              <img
                src={category.icon_url}
                height="50"
                alt={`category logo of ${category.display_name}`}
              />
              <br />
              {category.display_name}
            </div>
          </button>
        );
      })
    );
  }

  getCategoryCards() {
    if (this.props.categoryCards.cards && this.props.categoryCards.cards.length > 0) {
      const list = this.props.categoryCards.cards.map((card) => {
        const tooltip = (
          <Tooltip id="tooltip">{card.owner_username}</Tooltip>
        );
        return (
          <div className="user-card" key={card.id}>
            <Link route="card" params={{ id: card.id }}>
              <a>
                <div className="cardTitle">{card.title}</div>
                {genImg(card.image, 'cardBanner')}
                <div className="info">
                  <div className="user_data">
                    <div>{genImg(card.owner_image, 'profileImg')}</div>
                    <div>
                      <div className="font18 card_username text-left">
                        {
                          card.owner_username.length > 15 ?
                            <OverlayTrigger placement="top" overlay={tooltip}>
                              <div className="font18 card_username text-left">{_.truncate(card.owner_username, {'length': 15, 'omission': '...' })}</div>
                            </OverlayTrigger>
                          :
                            <div className="font18 card_username text-left">{card.owner_username}</div>
                        }
                      </div>
                      <div className="font12">
                        Created : {moment(card.createdAt).format('MMM-DD-YYYY')}
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
                      <span
                        className={card.user_can_like === false ? 'hasLiked' : ''}
                      >
                        {card.num_likes}
                      </span>
                      <i
                        aria-hidden="true"
                        className={
                          card.user_can_like === false ?
                          'hasLiked fa fa-heart' : 'fa fa-heart'
                        }
                      />
                    </div>
                    <div>
                      <i
                        aria-hidden="true"
                        className={card.hasGift === true ? 'hasGift fa fa-gift' : 'fa fa-gift'}
                      />
                    </div>
                    <div>
                      <i
                        className={
                          card.hasRecording === true ?
                          'fa fa-microphone hasRecording' :
                          'fa fa-microphone-slash'
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
      return (
        <Slider {...this.state.settings}>
          {list}
        </Slider>
      );
    }
    return (
      <div className="text-center"><h2 className="noCards">No cards for this category.</h2></div>
    );
  }

  changeCategory(categoryName, categoryDisplayName) {
    this.props.actions.getCategoryCards({
      name: categoryName,
      display_name: categoryDisplayName,
    });
  }

  render() {
    return (
      <section className="services grey-bg categories_style" id="categories">
        <div className="container">
          <div className="section-header">
            <h2 className="dark-text">Categories</h2>
            <div className="colored-line" />
          </div>
          {
            this.state.isCardsLoaded ?
              <div>
                { this.props.cardsCategories && this.props.cardsCategories.length > 0 ?
                  <div className="row">
                    <div className="container">
                      <div className="cardCategories">
                        { this.props.cardsCategories ?
                          <Slider {...this.state.settings}>
                            {this.getCardCategories()}
                          </Slider> :
                          <div
                            className="text-center"
                          >
                            <img
                              src="/static/images/loader-red-1.gif"
                              alt="loading cards categories"
                            />
                          </div>
                        }
                        <hr />
                        <div className="section-header">
                          <h3 className="dark-text">
                            {this.props.activeCategory ?
                              this.props.activeCategory.display_name :
                              ''
                            }Cards</h3>
                          <div className="colored-line" />
                        </div>
                        <hr />
                        {this.props.categoryCards ?
                          this.getCategoryCards() :
                          <div className="text-center">
                            <img
                              src="/static/images/loader-red-1.gif"
                              height="100"
                              alt="loading category cards"
                            />
                          </div>
                        }
                      </div>
                    </div>
                  </div> :
                  <div className="text-center">
                    <h2 className="noCards">No categories cards</h2>
                  </div>
                }
              </div> :
              <div style={{ marginTop: '20px' }}>
                <img src="/static/images/loader-red-1.gif" height="100" alt="loading cards" />
              </div>
          }
        </div>
      </section>
    );
  }

}

export default CategoriesCards;

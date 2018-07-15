import React from 'react';

import Head from '../layouts/Head';
import FooterInnerPage from '../layouts/FooterInnerPage';
import AppNavbar from '../layouts/Navbar';
import HandleError from '../HandleError';

import Cards from '../Cards';

export default class FeaturedCards extends React.Component {
  render() {
    return (
      <div>
        <Head {...this.props} />
        <AppNavbar {...this.props} />
        <HandleError {...this.props} />
        <section className="services grey-bg" id="featured_cards">
          <div className="container">
            <div className="section-header">
              <h2 className="dark-text">FEATURED PUBLIC<sup>*</sup> CARDS</h2>
              <div className="colored-line" />
            </div>
            <div className="row" style={{ marginBottom: '30px' }}>
              <div className="clearfix">
                {this.props.featuredCards && this.props.featuredCards.cards.length > 0 ?
                  <Cards
                    data={this.props.featuredCards}
                    actions={this.props.actions.getFeaturedCards}
                    isLoading={this.props.isfeaturedCardsLoading}
                  /> :
                  <div className="text-center">
                    <h2 className="noCards">No feature cards</h2>
                  </div>
                }
              </div>
              <div className="text-center" style={{ marginTop: '45px' }}>
                WishYoo cards can be Public or Private (friends and family only)<sup>*</sup>
              </div>
            </div>
          </div>
        </section>
        <FooterInnerPage />
      </div>
    );
  }
}

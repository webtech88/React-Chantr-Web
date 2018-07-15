import React from 'react';
import Slider from 'react-slick';

import Head from '../layouts/Head';
import AppNavbar from '../layouts/Navbar';
import HandleError from '../HandleError';
import genImg from '../../lib';
import usecases from '../../usecases';
import FooterInnerPage from '../layouts/FooterInnerPage';

export default class Usecases extends React.Component {

  constructor(props) {
    super(props);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.displayDefault = this.displayDefault.bind(this);
    this.displayUseCase = this.displayUseCase.bind(this);
    this.state = {
      userSettings: {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 2,
        responsive: [
          { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
          { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 2 } },
          { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 3 } },
        ],
      },

      caseSettings: {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    };
  }

  componentDidMount() {
    // eslint-disable-next-line global-require
    window.$ = require('jquery');
    window.jQuery = window.$;
    // eslint-disable-next-line global-require
    require('../../static/dist/js/jquery.accordionSlider.min.js');
    $('#my-accordion').accordionSlider({
      breakpoints: {
        762: { visiblePanels: 4 },
      }
    });
  }

  next() {
    this.userSlider.slickNext();
  }

  previous() {
    this.userSlider.slickPrev();
  }

  displayUseCase(usecase) {
    function capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    const unescapeUseCase = capitalize(unescape(usecase));
    const caseArray = usecases[unescapeUseCase.toLowerCase()];
    const list = caseArray.map((temp) => {
      return (
        <div className="user-card usecases" key={Math.random()}>
          { genImg(temp.imgUrl, 'caseSpecific') }
        </div>
      );
    });
    return (
      <div>
        <div className="h64" />
        <div className="container">
          <h3 className="pull-left colored-text"><img src="/static/images/black_arrow.png" alt="arrow" className="black_arrow" /> For {unescapeUseCase}</h3>
          <a href="/usecases">
            <div className="usecaseBack">
              <button id="lsubmit" className="back">Back</button>
            </div>
          </a>
          <div className="clearfix col-md-10 col-md-offset-1" style={{ position: 'relative', clear: 'both' }}>
            <div>
              <button type="button" className="slick-btn left" onClick={this.previous}>
                <i className="fa fa-angle-left" aria-hidden="true" />
              </button>
              <div className="slickStyle">
                <Slider ref={(c) => { this.userSlider = c; }} {...this.state.caseSettings}>
                  {list}
                </Slider>
              </div>
              <button type="button" className="slick-btn right" onClick={this.next}>
                <i className="fa fa-angle-right" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        <div className="h64" />
        <FooterInnerPage />
      </div>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  displayDefault() {
    const list = usecases.cases.map((temp) => {
      const url = `/usecases/${temp.case.toLowerCase()}`;
      return (
        <div>
          <a href={url}>
            <div className="as-panel">
              <img className="as-background" src={temp.imgUrl} alt="schools" />
              <div className="as-layer as-closed as-white panel-counter" data-position="bottomLeft" data-horizontal="8" data-vertical="8" style={{ margin: '0px', left: '8px', bottom: '8px', visibility: 'visible', opacity: '1' }}>
                {temp.case}
              </div>
            </div>
          </a>
        </div>
      );
    });

    return (
      <div>
        <div className="h64" />
        <div className="container allCases">
          <h3 className="usecaseHeading">Main uses for WishYoo</h3>
          <div className="clearfix" style={{ position: 'relative', minHeight: '428px' }}>
            <div id="my-accordion" className="accordion-slider">
              <div className="as-panels">
                { list }
              </div>
            </div>
          </div>
        </div>
        <div className="h64" />
        <div className="usecasesFooter">
          <FooterInnerPage />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <Head {...this.props} />
        <AppNavbar {...this.props} />
        <HandleError {...this.props} />
        {
          !this.props.url.query.case ? this.displayDefault() : this.displayUseCase(this.props.url.query.case)
        }
      </div>
    );
  }
}

import React from 'react';
import { Collapse } from 'react-bootstrap';

import Head from '../layouts/Head';
import FooterInnerPage from '../layouts/FooterInnerPage';
import AppNavbar from '../layouts/Navbar';
import HandleError from '../HandleError';

import faqs from '../../faqs_data';

export default class Faqs extends React.Component {

  constructor(props) {
    super(props);
    this.faqs = this.faqs.bind(this);
    this.toggle = this.toggle.bind(this);
    this.store = {
      faqs_data: faqs,
    };
  }

  toggle(index) {
    const obj = this.store.faqs_data;
    for (let i = 0; i < obj.length; i += 1) {
      if (i === index) {
        obj[i].isCollapsed = !obj[i].isCollapsed;
      } else {
        obj[i].isCollapsed = false;
      }
    }
    this.setState({ faqs_data: obj });
  }

  faqs() {
    const list = this.store.faqs_data.map((faq, index) => {
      return (
        <div className="faq" key={index}>
          <button
            className="question"
            onClick={() => { this.toggle(index); }}
          >
            {faq.question}
          </button>
          <Collapse in={faq.isCollapsed}>
            <div className="answer">
              <div
                style={{ padding: '15px' }}
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </div>
          </Collapse>
        </div>
      );
    });
    return (
      <div>{list}</div>
    );
  }

  render() {
    return (
      <div>
        <Head {...this.props} />
        <AppNavbar {...this.props} />
        <HandleError {...this.props} />
        <div className="container faqs_container">
          <div style={{ height: '15px' }} />
          <h2>FAQs<sub style={{ fontSize: '12px' }}>&nbsp;&nbsp;( click to open )</sub></h2>
          <div className="faqs">
            {this.faqs()}
          </div>
        </div>
        <FooterInnerPage />
      </div>
    );
  }
}

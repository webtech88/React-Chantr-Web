import React from 'react';

import Head from '../layouts/Head';
import FooterInnerPage from '../layouts/FooterInnerPage';
import AppNavbar from '../layouts/Navbar';
import HandleError from '../HandleError';

import CategoriesCards from '../CategoriesCards';

export default class Categories extends React.Component {
  render() {
    return (
      <div>
        <Head {...this.props} />
        <AppNavbar {...this.props} />
        <HandleError {...this.props} />
        <div style={{ marginTop: '20px' }}>
          <CategoriesCards {...this.props} />
        </div>
        <FooterInnerPage />
      </div>
    );
  }
}

import React from 'react';
import { Jumbotron, Button } from 'react-bootstrap';
import SweetAlert from 'sweetalert-react';

import Head from '../layouts/Head';
import AppNavbar from '../layouts/Navbar';
import HandleError from '../HandleError';
import FooterInnerPage from '../layouts/FooterInnerPage';
export default class DeleteSignature extends React.Component {

  constructor(props) {
    super(props);
    this.onCancelDelete = this.onCancelDelete.bind(this);
    this.deleteSignature = this.deleteSignature.bind(this);
    this.redirectToCardPage = this.redirectToCardPage.bind(this);
  }

  onCancelDelete() {
    window.top.location = '/';
  }

  deleteSignature() {
    this.props.actions.deleteCardSignature(this.props.url.query.id);
  }

  redirectToCardPage() {
    window.top.location = '/';
  }

  render() {
    return (
      <div>
        <Head {...this.props} />
        <AppNavbar {...this.props} />
        <HandleError {...this.props} />
        <div className="h64" />
        <div className="h64" />
        <div className="container">
        {
          !this.props.error && !this.props.response ?
            <SweetAlert
              show={!this.props.error && !this.props.response ? true : false}
              warning
              showCancelButton
              title="Are you sure?"
              text="You will not be able to recover this signature!"
              type="warning"
              confirmButtonColor="#FF8A15"
              confirmButtonText="Yes, delete it!"
              onConfirm={this.deleteSignature}
              onCancel={this.onCancelDelete}
            />
          :
          undefined
        }
          {this.props.error && this.props.error.display_message.indexOf('Not logged in.') >= 0 ?
            <SweetAlert
              show={true}
              type="error"
              title="Failure!"
              text="Please login to delete signature"
              confirmBtnBsStyle="danger"
              confirmBtnText="Ok"
              onConfirm={this.redirectToCardPage}
            />
            : undefined
          }
          {this.props.error && this.props.error.display_message.indexOf('Not Authorized to perform') >= 0 ?
            <SweetAlert
              show={true}
              type="error"
              title="Failure!"
              text="You are not authorized to delete this signature"
              confirmBtnBsStyle="danger"
              confirmBtnText="Ok"
              onConfirm={this.redirectToCardPage}
            />
            : undefined
          }
          {this.props.error && this.props.error.display_message.indexOf('Not Found') >= 0 ?
            <SweetAlert
              show={true}
              type="error"
              title="Failure!"
              text="Signature not found or It is already deleted"
              confirmBtnBsStyle="danger"
              confirmBtnText="Ok"
              onConfirm={this.redirectToCardPage}
            />
            : undefined
          }
          {this.props.response ?
            <SweetAlert
              show={true}
              type="success"
              title="Success!"
              text="Signature has been deleted successfully"
              onConfirm={this.redirectToCardPage}
            />
            : undefined
          }
        </div>
      </div>
    );
  }
}

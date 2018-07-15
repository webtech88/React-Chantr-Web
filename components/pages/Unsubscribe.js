import React from 'react';
import { FormGroup, Checkbox } from 'react-bootstrap';

import Head from '../layouts/Head';
import HandleError from '../HandleError';

export default class Unsubscribe extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      checked: true,
      reasonsInView: false,
      error: '',
      isStepOne: true,
      notSuccess: true,
    };
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleReasonChange = this.handleReasonChange.bind(this);
    this.handleOptionsSubmit = this.handleOptionsSubmit.bind(this);
    this.handleReasonsSubmit = this.handleReasonsSubmit.bind(this);
  }

  handleOptionChange(event) {
    this.setState({ checked: false });
    const unsubscribeData = this.props.unsubscribeData;
    unsubscribeData.options.forEach((option) => {
      const temp = option;
      if (temp.value === Number(event.target.value)) {
        temp.selected = event.target.checked;
      }
      return temp;
    });
    this.props.actions.changeUnsubscribeData(unsubscribeData);
    this.setState({ checked: true });
  }

  handleOptionsSubmit(event) {
    const selectedOptions = [];
    let atLeastOneSelected = false;
    const unsubscribeData = this.props.unsubscribeData;
    unsubscribeData.options.forEach((option) => {
      if (option.selected) {
        atLeastOneSelected = true;
        selectedOptions.push(option.value);
      }
    });
    if (!atLeastOneSelected) {
      this.setState({ error: 'Please select at least one option' });
    } else {
      this.setState({ error: '' });
      this.props.actions.unsubscribeSubmitOption({
        token: encodeURIComponent(this.props.url.query.token),
        options: selectedOptions,
      }, () => {
        this.setState({ reasonsInView: true });
        this.setState({ isStepOne: false });
      });
    }
    event.preventDefault();
    return false;
  }

  handleReasonChange(event) {
    this.setState({ checked: false });
    const unsubscribeData = this.props.unsubscribeData;
    unsubscribeData.reasons.forEach((option) => {
      const temp = option;
      if (temp.value === Number(event.target.value)) {
        if (!temp.selected) {
          temp.selected = true;
        }
      } else {
        temp.selected = false;
      }
      return temp;
    });
    this.props.actions.changeUnsubscribeData(unsubscribeData);
    this.setState({ checked: true });
  }

  handleReasonsSubmit(event) {
    event.preventDefault();
    let selectedReason = 0;
    const unsubscribeData = this.props.unsubscribeData;
    unsubscribeData.reasons.forEach((reason) => {
      if (reason.selected) {
        selectedReason = reason.value;
      }
    });
    if (selectedReason === 0) {
      this.setState({ error: 'Please select at least one reason' });
    } else {
      this.setState({ error: '' });
      this.props.actions.unsubscribeSubmitReason({
        token: encodeURIComponent(this.props.url.query.token),
        reason: selectedReason,
      }, () => {
        this.setState({ notSuccess: false });
      });
    }
    return false;
  }

  render() {
    const renderOptions = () => {
      if (this.props.unsubscribeData) {
        const list = this.props.unsubscribeData.options.map((option) => {
          return (
            <Checkbox
              checked={option.selected}
              onChange={this.handleOptionChange}
              key={Math.random()}
              value={option.value}
            >
              {option.name}
            </Checkbox>
          );
        });
        return (
          <FormGroup>{list}</FormGroup>
        );
      }
      return false;
    };

    const renderReasons = () => {
      if (this.props.unsubscribeData) {
        const list = this.props.unsubscribeData.reasons.map((reason, index) => {
          return (
            <div className="answer" key={Math.random()}>
              <label htmlFor={`reason${index}`}>
                <input
                  id={`reason${index}`}
                  type="radio"
                  value={reason.value}
                  checked={reason.selected}
                  onChange={this.handleReasonChange}
                />
                &nbsp;&nbsp;{reason.name}
              </label>
            </div>
          );
        });
        return (
          <FormGroup>{list}</FormGroup>
        );
      }
      return false;
    };

    return (
      <div>
        <Head {...this.props} />
        {
          this.props.success || this.props.failure ?
            <div style={{ marginTop: '-64px' }}>
              <HandleError {...this.props} />
            </div> : null
        }
        <div className="container unsubscribe">
          <div className="text-center" style={{ margin: '30px 0' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width="100%"
              height="150px"
              viewBox="0 0 283.46 283.46"
              enableBackground="new 0 0 283.46 283.46"
              dangerouslySetInnerHTML={{
                __html: '<use xlink:href="/static/images/WishYoo.svg#Layer_1" />',
              }}
            />
            {this.state.notSuccess ?
              <div>
                {this.state.isStepOne ?
                  <div className="center text-left">
                    <div>
                      <hr />
                      <strong
                        className="question text-center"
                        style={{ fontSize: '18px', textAlign: 'center' }}
                      >
                        <span style={{ fontSize: '28px' }}>
                          We WishYoo wouldn&apos;t go!
                        </span><br />
                        But if you must, check the box next to the type of emails you no
                        longer want to see in your inbox.<br />
                        Please remember that you might receive emails directly from users
                        inviting you to their cards.<br />
                      </strong>
                      <hr />
                      <form onSubmit={this.handleOptionsSubmit}>
                        {this.props.unsubscribeData && this.state.checked ? renderOptions() : ''}
                        <hr />
                        <div style={{ color: 'red', fontSize: '12px' }}>{this.state.error}</div>
                        <button type="submit" className="btn btn-warning btn-block">
                          Unsubscribe
                        </button>
                      </form>
                    </div>
                  </div>
                  :
                  <div className="center text-left">
                    <div>
                      <hr />
                      <div className="alert alert-success" role="alert">
                        <strong>Success!</strong> You are unsubscribed.
                      </div>
                      <hr />
                      <strong className="question">
                        Would you mind telling us why you unsubscribed?
                      </strong>
                      <hr />
                      <form onSubmit={this.handleReasonsSubmit}>
                        {this.props.unsubscribeData && this.state.reasonsInView ?
                          renderReasons() : ''
                        }
                        <hr />
                        <div style={{ color: 'red', fontSize: '12px' }}>{this.state.error}</div>
                        <div className="text-center">
                          <button type="submit" className="btn btn-warning btn-block">
                            Submit FeedBack
                          </button>
                          <hr />OR<hr />
                          <a href="/">&lt;&lt; Go Home</a>
                        </div>
                      </form>
                    </div>
                  </div>
                }
              </div>
              :
              <div className="center text-left">
                <div>
                  <hr />
                  <div className="alert alert-success" role="alert">
                    <strong>Success!</strong> Thank Yoo for providing feedback.
                  </div>
                  <hr />
                  <a href="/" style={{ display: 'block', textAlign: 'center' }}>
                    &lt;&lt; Go Home
                  </a>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

import React from 'react';
import FooterInnerPage from './layouts/FooterInnerPage';

const moment = require('moment');

export default class YoutuberChannels2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      month: '',
      date: '',
      year: '',
      validation: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkValidation = this.checkValidation.bind(this);
    this.setDefaultData = this.setDefaultData.bind(this);
  }

  componentDidMount() {
    this.setDefaultData();
  }

  setDefaultData() {
    const youtuberData = JSON.parse(localStorage.getItem('youtuber_channels'));
    if (youtuberData) {
      if (youtuberData.birthday) {
        const myarr = youtuberData.birthday.split('/');
        this.setState({ year: myarr[0] });
        this.setState({ month: myarr[1] });
        this.setState({ date: myarr[2] });
      }
    }
  }

  handleChange(event) {
    if (event.target.id === 'month') {
      this.setState({ month: event.target.value });
    } else if (event.target.id === 'date') {
      this.setState({ date: event.target.value });
    } else {
      this.setState({ year: event.target.value });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const date = `${this.state.year}/${this.state.month}/${this.state.date}`;
    const validate = this.checkValidation(date);
    if (validate) {
      localStorage.setItem('youtuber_channels',
        JSON.stringify(Object.assign(
          {},
          JSON.parse(localStorage.getItem('youtuber_channels')),
          { birthday: date },
        )),
      );
      window.location = '/youtuber_channels/3';
    } else {
      this.setState({ validation: true });
    }
  }

  checkValidation(date) {
    let valid = false;
    const dateFormat = 'YYYY/MM/DD';
    if (moment(date, dateFormat, true).year() > moment().year()) {
      this.setState({ validation: true });
    } else {
      valid = moment(date, dateFormat, true).isValid();
    }
    return valid;
  }

  render() {
    return (
      <div>
        {/* Birthdate */}
        <div className="birthday container">
          <div className="cancel-btn">
            <a href="/">
              <p className="cancel-btn-text">
                CANCEL
              </p>
            </a>
          </div>
          <h3>2. <img src="/static/images/list_arrow.png" alt="arrow" width="30px" height="25px" style={{ marginTop: '-5px' }} /> When is your birthday?</h3>
          <div className="h64" />
          <div className="row">
            <div className="col-xs-6 col-xs-offset-3">
              <form onSubmit={this.handleSubmit}>
                <div className="birthdate pull-left" id="month">
                  <input
                    type="text"
                    className="form-control date"
                    id="month"
                    required="true"
                    value={this.state.month}
                    onChange={this.handleChange}
                    placeholder="Month"
                  />
                </div>
                <div className="birthdate" id="date">
                  <input
                    type="text"
                    className="form-control date"
                    id="date"
                    required="true"
                    value={this.state.date}
                    onChange={this.handleChange}
                    placeholder="Date"
                  />
                </div>
                <div className="birthdate" id="year">
                  <input
                    type="text"
                    className="form-control date"
                    id="year"
                    required="true"
                    value={this.state.year}
                    onChange={this.handleChange}
                    placeholder="Year"
                  />
                </div>
                {
                  this.state.validation
                  ?
                    <div className="validation-error pull-left">
                      * Birthdate is Invalid. Please try again (MM/DD/YYYY).
                    </div>
                    :
                    undefined
                }
                <div className="next">
                  <button id="lsubmit" type="submit">Next</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="youtuber-footer">
          <FooterInnerPage />
        </div>
      </div>
    );
  }
}


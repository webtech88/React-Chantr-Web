import React from 'react';
import Select from 'react-select';
import Head from './layouts/Head';
import AppNavbar from './layouts/Navbar';
import FooterInnerPage from './layouts/FooterInnerPage';

export default class YoutuberChannels1 extends React.Component {

  constructor(props) {
    super(props);
    this.listChannels = this.listChannels.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      validate: true,
    };
  }

  onChange(event) {
    this.setState({ value: event.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.state.value) {
      this.setState({ validate: false });
    } else {
      this.setState({ validate: true });
      localStorage.setItem('youtuber_channels',
        JSON.stringify(Object.assign(
          {},
          JSON.parse(localStorage.getItem('youtuber_channels')),
          { channel_id: this.state.value },
        )),
      );
      window.location = '/youtuber_channels/2';
    }
  }

  listChannels() {
    const channelsInfo = [];
    if (this.props.channels) {
      for (let i = (this.props.channels.channels).length - 1; i >= 0; i -= 1) {
        const channel = { value: this.props.channels.channels[i].id, label: `${this.props.channels.channels[i].title} ( ${this.props.channels.channels[i].statistics.subscriberCount} )` };
        channelsInfo[i] = channel;
      }
    }

    return (
      <div className="birthday">
        <div className="cancel-btn">
          <a href="/">
            <p className="cancel-btn-text">
              CANCEL
            </p>
          </a>
        </div>
        <h3>1. <img src="/static/images/list_arrow.png" alt="arrow" width="30px" height="25px" style={{ marginTop: '-5px' }} /> Choose a youtube channel for contest</h3>
        <div className="row">
          <div className="col-xs-6 col-xs-offset-3">
            <form onSubmit={this.handleSubmit} >
              <div className="username">
                <Select
                  onChange={this.onChange}
                  options={channelsInfo}
                  value={this.state.value}
                  clearable={false}
                  placeholder="Select Channel"
                />
              </div>
              {!this.state.validate ?
                <div className="validation-error pull-left">* Please select a channel.</div>
                : undefined}
              <div className="next">
                <button id="lsubmit" type="submit">Next</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <Head />
        <AppNavbar {...this.props} />
        <div className="container">
          {
            this.listChannels()
          }
        </div>
        <div className="youtuber-footer">
          <FooterInnerPage />
        </div>
      </div>
    );
  }
}

import React from 'react';
import moment from 'moment';

export default (props) => {
  const renderEvents = () => {
    if (props.events && props.events.length > 0) {
      const list = [];
      props.events.forEach((event) => {
        if (list.length < 3 && event.next_birthday) {
          list.push(
            <div key={event.id}>
              <i className="fa fa-birthday-cake" aria-hidden="true" />
              <a>@{event.username}</a>
              <p>{moment(event.next_birthday).format('DD MMMM')}</p>
            </div>
          );
        }
      });
      if (list.length > 0) {
        return (
          <div className="e_section">
            {list}
          </div>
        );
      }
      return (
        <div className="text-center" style={{ padding: '7.5px 0', fontSize: '13px' }}>
          <div>No Upcoming Events</div>
        </div>
      );
    }
    return (
      <div className="text-center" style={{ padding: '7.5px 0', fontSize: '13px' }}>
        <div>No Upcoming Events</div>
      </div>
    );
  };
  return (
    <div className="col-lg-6 col-md-5 col-sm-6">
      <section className="upcoming-event clearfix">
        <div className="upcoming-event-title">
          <h4>Upcoming Events</h4>
        </div>
        <div className="event-list">
          {renderEvents()}
        </div>
      </section>
    </div>
  );
};

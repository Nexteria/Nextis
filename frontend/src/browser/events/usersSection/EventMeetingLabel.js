import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedDate } from 'react-intl';


const styles = {
  eventDateLabel: {
    marginBottom: '0.5em',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meetingSubtitle: {
    color: '#000',
    textAlign: 'center',
  }
};

export default class EventMeetingLabel extends Component {

  static propTypes = {
    eventName: PropTypes.string.isRequired,
    meetingDate: PropTypes.object.isRequired,
  };

  render() {
    const {
      eventName,
      meetingDate,
    } = this.props;


    return (
      <li className="users-event">
        <div className={'timeline-item col-md-11 col-sm-11 col-xs-9 events-filter-signed-in'}>
          <div className="timeline-header">
            <div className="col-md-1 col-sm-2 col-xs-12 event-date">
              <div style={styles.eventDateLabel}>
                <span className="label label-primary">
                  <FormattedDate value={meetingDate} />
                </span>
                <div>
                  <span className="label" style={styles.meetingSubtitle}>Stretnutie</span>
                </div>
              </div>
            </div>
            <h3 className="col-md-10 col-sm-8 col-xs-12">{eventName}</h3>
          </div>
        </div>
        <div className="clearfix"></div>
      </li>
    );
  }
}

import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import * as eventsActions from '../../common/events/actions';
import * as attendeesGroupActions from '../../common/attendeesGroup/actions';

import { fields } from '../../common/lib/redux-fields/index';
import OverviewTable from './OverviewTable';
import AttendeesTable from './AttendeesTable';

const messages = defineMessages({
  title: {
    defaultMessage: 'Activity points',
    id: 'viewer.activityPoints.title'
  },
  amountOfPoints: {
    defaultMessage: 'Amount of points',
    id: 'viewer.activityPoints.amountOfPoints'
  },
  attendees: {
    defaultMessage: 'All events where you were invited',
    id: 'viewer.activityPoints.attendees',
  },
  loadingAttendees: {
    defaultMessage: 'Loading',
    id: 'viewer.activityPoints.loadingAttendees',
  },
  otherStudents: {
    defaultMessage: 'Other students',
    id: 'viewer.activityPoints.otherStudents'
  },
  points: {
    defaultMessage: 'points',
    id: 'viewer.activityPoints.points'
  },
  from: {
    defaultMessage: 'of',
    id: 'viewer.activityPoints.from'
  },
});

class ActivityPointsPage extends Component {

  static propTypes = {
    nexteriaIban: PropTypes.string,
    userPayments: PropTypes.object,
    viewer: PropTypes.object,
    attendees: PropTypes.list,
    events: PropTypes.object,
    users: PropTypes.object,
    studentLevels: PropTypes.object,
    fields: PropTypes.object,
    params: PropTypes.object,
    loadUsersPayments: PropTypes.func,
    getEventsAttendeesForUser: PropTypes.func,
  };

  componentDidMount() {
    const {
      viewer,
      params,
      getEventsAttendeesForUser,
    } = this.props;
    let userId = viewer.id;

    if (params && params.userId) {
      userId = parseInt(params.userId, 10);
    }

    getEventsAttendeesForUser(userId);
  }


  render() {
    const {
      viewer,
      attendees,
      users,
      studentLevels,
      fields,
      params,
    } = this.props;

    if (!users || !attendees) {
      return <div></div>;
    }

    let activeUser = viewer;

    if (params && params.userId) {
      activeUser = users.get(parseInt(params.userId, 10));
    }

    return (
      <div>
        <section className="content-header">
          <h1>
            <FormattedMessage {...messages.title} />
          </h1>
        </section>
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <div className="box">
              <div className="box-header">
                <h3 className="box-title"><FormattedMessage {...messages.amountOfPoints} />:</h3>
              </div>
              <div className="box-body table-responsive no-padding">
                <div className="text-center">
                  <span
                    style={{ fontSize: '2em' }}
                  >
                    {activeUser.gainedActivityPoints}&nbsp;
                    <FormattedMessage {...messages.from} />&nbsp;
                    {activeUser.activityPointsBaseNumber}&nbsp;
                    <FormattedMessage {...messages.points} />
                  </span>
                </div>
                <OverviewTable viewer={activeUser} />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <div className="box">
              <div className="box-header">
                <h3 className="box-title"><FormattedMessage {...messages.attendees} />:</h3>
                <div className="box-tools">
                  <div className="input-group input-group-sm" style={{ width: '150px' }}>
                    <input
                      type="text"
                      name="table_search"
                      className="form-control pull-right"
                      placeholder="Search"
                      {...fields.attendeesFilter}
                    />
                    <div className="input-group-btn">
                      <button type="submit" className="btn btn-default">
                        <i className="fa fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="box-body table-responsive no-padding">
                <div className="col-md-12">
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {!attendees ?
                      <div><FormattedMessage {...messages.loadingAttendees} /></div>
                    :
                      <AttendeesTable {...{ attendees }} />
                    }
                    <div className="clearfix"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ActivityPointsPage = fields(ActivityPointsPage, {
  path: 'ActivityPoints',
  fields: [
    'usersFilter',
    'attendeesFilter',
  ],
});

export default connect(state => ({
  events: state.events.events,
  studentLevels: state.users.studentLevels,
  viewer: state.users.viewer,
  users: state.users.users,
  attendees: state.events.attendees,
}), { ...attendeesGroupActions, ...eventsActions })(ActivityPointsPage);

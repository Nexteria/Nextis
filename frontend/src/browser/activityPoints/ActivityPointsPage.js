import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import * as eventsActions from '../../common/events/actions';
import * as attendeesGroupActions from '../../common/attendeesGroup/actions';

import { fields } from '../../common/lib/redux-fields/index';
import OverviewTable from './OverviewTable';
import AttendeesTable from './AttendeesTable';
import UsersActivityPointsTable from './UsersActivityPointsTable';

const messages = defineMessages({
  title: {
    defaultMessage: 'Aktivity body',
    id: 'viewer.activityPoints.title'
  },
  amountOfPoints: {
    defaultMessage: 'Počet bodov',
    id: 'viewer.activityPoints.amountOfPoints'
  },
  attendees: {
    defaultMessage: 'Všetky eventy, na ktoré si bol pozvaný',
    id: 'viewer.activityPoints.attendees',
  },
  loadingAttendees: {
    defaultMessage: 'Načítavam',
    id: 'viewer.activityPoints.loadingAttendees',
  },
  otherStudents: {
    defaultMessage: 'Ostatní študenti',
    id: 'viewer.activityPoints.otherStudents'
  },
  points: {
    defaultMessage: 'bodov',
    id: 'viewer.activityPoints.points'
  },
  from: {
    defaultMessage: 'z',
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
    loadUsersPayments: PropTypes.func,
    getEventsAttendeesForUser: PropTypes.func,
  };

  componentDidMount() {
    const {
      viewer,
      getEventsAttendeesForUser,
    } = this.props;
    getEventsAttendeesForUser(viewer.id);
  }


  render() {
    const {
      viewer,
      attendees,
      users,
      studentLevels,
      fields,
    } = this.props;

    if (!users || !attendees) {
      return <div></div>;
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
                    {viewer.gainedActivityPoints}&nbsp;
                    <FormattedMessage {...messages.from} />&nbsp;
                    {viewer.potentialActivityPoints}&nbsp;
                    <FormattedMessage {...messages.points} />
                  </span>
                </div>
                <OverviewTable {...{ viewer }} />
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
                  </div>
                </div>
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
                      {...fields.usersFilter}
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
                <div className="col-md-12" style={{ margin: '22px 0' }}>
                  <div><strong><FormattedMessage {...messages.otherStudents} />:</strong></div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {!users ?
                      <div></div>
                    :
                      <UsersActivityPointsTable {...{ studentLevels, users, viewer }} />
                    }
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

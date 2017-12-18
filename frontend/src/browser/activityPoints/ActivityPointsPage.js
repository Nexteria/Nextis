import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';

import * as eventsActions from '../../common/events/actions';
import * as usersActions from '../../common/users/actions';
import * as studentsActions from '../../common/students/actions';
import * as attendeesGroupActions from '../../common/attendeesGroup/actions';

import { fields } from '../../common/lib/redux-fields/index';
import OverviewTable from './OverviewTable';
import AttendeesTable from './AttendeesTable';
import ActivityPointsTable from './ActivityPointsTable';

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

const styles = {
  semesterSelector: {
    maxWidth: '220px',
    margin: 'auto',
    marginBottom: '10px',
  },
};

class ActivityPointsPage extends Component {

  static propTypes = {
    nexteriaIban: PropTypes.string,
    userPayments: PropTypes.object,
    viewer: PropTypes.object,
    attendees: PropTypes.object,
    events: PropTypes.object,
    users: PropTypes.object,
    studentLevels: PropTypes.object,
    fields: PropTypes.object,
    params: PropTypes.object,
    loadUsersPayments: PropTypes.func,
    getEventsAttendeesForUser: PropTypes.func,
    activeSemesterId: PropTypes.number.isRequired,
    viewerSemesters: PropTypes.object,
    loadUserSemesters: PropTypes.func.isRequired,
    fetchStudent: PropTypes.func.isRequired,
    students: PropTypes.object,
    fetchEventActivityDetails: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const {
      viewer,
      params,
      getEventsAttendeesForUser,
      activeSemesterId,
      loadUserSemesters,
      fetchStudent,
      users,
    } = this.props;
    let userId = viewer.id;

    if (params && params.userId) {
      userId = parseInt(params.userId, 10);
    }

    const activeUser = users.get(userId);

    loadUserSemesters(userId);
    getEventsAttendeesForUser(userId, activeSemesterId);
    fetchStudent(activeUser.get('studentId'), activeSemesterId);
  }

  render() {
    const {
      viewer,
      attendees,
      users,
      fields,
      getEventsAttendeesForUser,
      params,
      viewerSemesters,
      students,
      fetchEventActivityDetails,
      fetchStudent,
    } = this.props;

    if (!users || !attendees || !viewerSemesters) {
      return <div></div>;
    }

    let activeUser = viewer;

    if (params && params.userId) {
      activeUser = users.get(parseInt(params.userId, 10));
    }

    const activeSemester = viewerSemesters.get(parseInt(fields.semesterId.value, 10));
    const student = students.get(activeUser.get('studentId'));

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
                    {activeSemester.get('gainedActivityPoints').sumGainedPoints}&nbsp;
                    <FormattedMessage {...messages.from} />&nbsp;
                    {activeSemester.get('activityPointsBaseNumber')}&nbsp;
                    <FormattedMessage {...messages.points} />
                  </span>
                </div>
                <OverviewTable activeSemester={activeSemester} />
              </div>
            </div>
          </div>
        </div>
        <div className="row text-center">
          <div className="form-group">
            <select
              className="form-control"
              name="semesterId"
              style={styles.semesterSelector}
              {...fields.semesterId}
              value={fields.semesterId.value}
              onChange={(e) => {
                fields.semesterId.onChange(e);
                getEventsAttendeesForUser(activeUser.get('id'), e.target.value);
                fetchStudent(activeUser.get('studentId'), e.target.value);
              }}
            >
              {viewerSemesters.valueSeq().map(semester =>
                <option key={semester.get('id')} value={semester.get('id')}>{semester.get('name')}</option>
              )}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <div className="box">
              <Tabs
                id="users-points-tabs"
                className="nav-tabs-custom"
              >
                <Tab
                  eventKey={'activityPoints'}
                  title="Aktivity body"
                  mountOnEnter
                >
                  {student ?
                    <ActivityPointsTable
                      fetchEventActivityDetails={fetchEventActivityDetails}
                      student={student}
                    /> : null
                  }
                </Tab>
                <Tab
                  eventKey={'attendance'}
                  title="Účasť"
                  mountOnEnter
                >
                  {!attendees ?
                    <div><FormattedMessage {...messages.loadingAttendees} /></div>
                  :
                    <AttendeesTable {...{ attendees }} />
                  }
                </Tab>
              </Tabs>
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
    'semesterId',
    'attendeesFilter',
  ],
  getInitialState: (props) => ({ semesterId: props.activeSemesterId })
});

export default connect(state => ({
  events: state.events.events,
  students: state.students.getIn(['admin', 'students']),
  studentLevels: state.users.studentLevels,
  viewer: state.users.viewer,
  viewerSemesters: state.users.viewerSemesters,
  users: state.users.users,
  semesters: state.semesters.semesters,
  activeSemesterId: state.semesters.activeSemesterId,
  attendees: state.events.attendees,
}), { ...attendeesGroupActions, ...studentsActions, ...usersActions, ...eventsActions })(ActivityPointsPage);

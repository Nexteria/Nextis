import Component from 'react-pure-render/component';
import { List } from 'immutable';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { reduxForm, formValueSelector } from 'redux-form';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import * as actions from '../../../common/students/actions';
import * as usersActions from '../../../common/users/actions';
import StudentsActionsContainer from './StudentsActionsContainer';
import StudentsTable from './StudentsTable';

const messages = defineMessages({
  title: {
    defaultMessage: 'Students',
    id: 'semesters.manage.title'
  },
  tableTitle: {
    defaultMessage: 'Users - managment',
    id: 'users.manage.table.title'
  },
  noUsers: {
    defaultMessage: 'No users here',
    id: 'users.manage.noUsers'
  },
  firstName: {
    defaultMessage: 'First name',
    id: 'users.manage.firstName'
  },
  lastName: {
    defaultMessage: 'Last name',
    id: 'users.manage.lastName'
  },
  actions: {
    defaultMessage: 'Actions',
    id: 'users.manage.actions'
  },
  points: {
    defaultMessage: 'Activity points',
    id: 'users.manage.points'
  },
  userBaseSemesterActivityPoints: {
    defaultMessage: 'Students base activity points',
    id: 'users.manage.userBaseSemesterActivityPoints'
  },
  sortBy: {
    defaultMessage: 'Sort by',
    id: 'users.manage.sortBy'
  },
  all: {
    defaultMessage: 'All',
    id: 'users.manage.all'
  },
});

const styles = {
  rowTd: {
    cursor: 'pointer',
  },
};

class StudentsPage extends Component {

  static propTypes = {
    semesters: PropTypes.object,
    fetchAdminStudents: PropTypes.func.isRequired,
    loadStudentLevelsList: PropTypes.func.isRequired,
    hasPermission: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { fetchAdminStudents, loadStudentLevelsList } = this.props;
    fetchAdminStudents();
    loadStudentLevelsList();
  }

  calculateStudentPointsColor(student) {
    let color = '#ff0000';
    const percentage = Math.round(
      student.get('sumGainedPoints') / student.get('activityPointsBaseNumber') * 100);

    if (percentage >= 50) {
      color = '#ecb200';
    }

    if (percentage > 75) {
      color = '#11ea05';
    }

    return color;
  }

  getStudentPointsComponent(student) {
    return (
      <span style={{ color: this.calculateStudentPointsColor(student) }}>
        {student.get('sumGainedPoints')}
        {student.get('activityPointsBaseNumber') ?
          <span>
            <span> (</span>
            {student.get('sumGainedPoints') === 0 ? 0 :
              Math.round(
                student.get('sumGainedPoints') / student.get('activityPointsBaseNumber') * 100
              )
            }
            <span>%)</span>
          </span>
          : null
        }
      </span>
    );
  }

  getTuitionFeeBalanceComponent(tuitionFeeBalance) {
    return (
      <span style={{ color: tuitionFeeBalance >= 0 ? '#0f0' : '#f00' }}>
        {tuitionFeeBalance / 100}
      </span>
    );
  }

  sortTuitionFeeFunction(a, b, order) {   // order is desc or asc
    if (order === 'desc') {
      return a.tuitionFeeBalanceNumber - b.tuitionFeeBalanceNumber;
    }

    return b.tuitionFeeBalanceNumber - a.tuitionFeeBalanceNumber;
  }

  render() {
    const { students, children, params, studentLevels, initialized, hasPermission, selectedStudents, change } = this.props;

    const studentId = params ? parseInt(params.studentId, 10) : null;

    if (studentId && !students.has(studentId)) {
      return null;
    }

    if (children) {
      return (
        <div>
          {children}
        </div>
      );
    }

    return (
      <div className="students-managment-page">
        <section className="content-header">
          <h1>
            <FormattedMessage {...messages.title} />
          </h1>
        </section>
        <section className="content">
          <div className="row">
            <div className="col-xs-12">
              <div className="box" style={{ marginBottom: '0px'}}>
                <div className="box-body no-padding">
                  <StudentsTable
                    selectedStudents={selectedStudents}
                    students={students}
                    studentLevels={studentLevels}
                    change={change}
                    initialized={initialized}
                  />
                  <div className="clearfix"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <StudentsActionsContainer {...{ students, selectedStudents }} />
      </div>
    );
  }
}

StudentsPage = reduxForm({
  form: 'StudentsPage',
  initialValues: {
    selectedStudents: new List(),
  },
})(StudentsPage);

const selector = formValueSelector('StudentsPage');

export default connect(state => ({
  students: state.students.getIn(['admin', 'students']),
  selectedStudents: selector(state, 'selectedStudents'),
  studentLevels: state.users.studentLevels,
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), { ...actions, ...usersActions })(StudentsPage);

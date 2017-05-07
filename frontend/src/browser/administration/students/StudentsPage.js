import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import diacritics from 'diacritics';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { fields } from '../../../common/lib/redux-fields/index';
import * as actions from '../../../common/students/actions';

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

class StudentsPage extends Component {

  static propTypes = {
    semesters: PropTypes.object,
    fields: PropTypes.object.isRequired,
    fetchAdminStudents: PropTypes.func.isRequired,
    hasPermission: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { fetchAdminStudents } = this.props;
    fetchAdminStudents();
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
    const { students, hasPermission } = this.props;
    const { formatMessage } = this.props.intl;

    const studentsData = students.map(student => {
      return {
        id: student.get('id'),
        firstName: student.get('firstName'),
        lastName: student.get('lastName'),
        studentLevelId: student.get('studentLevelId'),
        activityPointsBaseNumber: student.get('activityPointsBaseNumber'),
        minimumSemesterActivityPoints: student.get('minimumSemesterActivityPoints'),
        sumGainedPoints: student.get('sumGainedPoints'),
        sumPotentialPoints: student.get('sumPotentialPoints'),
        pointsSummary: this.getStudentPointsComponent(student),
        tuitionFeeBalance: this.getTuitionFeeBalanceComponent(student.get('tuitionFeeBalance')),
        tuitionFeeBalanceNumber: student.get('tuitionFeeBalance'),
        status: student.get('status'),
      };
    }).toArray();

    return (
      <div className="group-managment-page">
        <section className="content-header">
          <h1>
            <FormattedMessage {...messages.title} />
            {hasPermission('create_users') ?
              <i
                className="fa fa-plus text-green"
                style={{ cursor: 'pointer', marginLeft: '2em' }}
                onClick={() => browserHistory.push('/admin/users/create')}
              ></i>
             : ''
            }
          </h1>
        </section>
        <section className="content">
          <div className="row">
            <div className="col-xs-12">
              <div className="box">
                <div className="box-body table-responsive no-padding items-container">
                  <BootstrapTable
                    data={studentsData}
                    multiColumnSort={3}
                    striped
                    hover
                    height="350px"
                    containerStyle={{ height: '370px' }}
                  >
                    <TableHeaderColumn isKey hidden dataField="id" />

                    <TableHeaderColumn dataField="firstName" dataSort>
                      Meno
                    </TableHeaderColumn>

                    <TableHeaderColumn dataField="lastName" dataSort dataFormat={x => x}>
                      Priezvisko
                    </TableHeaderColumn>

                    <TableHeaderColumn dataField="studentLevelId" dataSort dataFormat={x => x}>
                      Level
                    </TableHeaderColumn>

                    <TableHeaderColumn dataField="pointsSummary" dataSort dataFormat={x => x}>
                      Aktuálne získané body
                    </TableHeaderColumn>

                    <TableHeaderColumn dataField="activityPointsBaseNumber" dataSort>
                      Bodový základ
                    </TableHeaderColumn>

                    <TableHeaderColumn dataField="tuitionFeeBalance" dataSort sortFunc={this.sortTuitionFeeFunction} dataFormat={x => x}>
                      Školné
                    </TableHeaderColumn>

                    <TableHeaderColumn dataField="status" dataSort>
                      Status
                    </TableHeaderColumn>
                  </BootstrapTable>
                  <div className="clearfix"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

StudentsPage = fields(StudentsPage, {
  path: 'students',
  fields: [
    'filter',
  ],
});

StudentsPage = injectIntl(StudentsPage);

export default connect(state => ({
  students: state.students.getIn(['admin', 'students']),
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), actions)(StudentsPage);

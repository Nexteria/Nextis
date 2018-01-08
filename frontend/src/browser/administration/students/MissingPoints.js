import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


import * as actions from '../../../common/students/actions';
import * as usersActions from '../../../common/users/actions';
import * as semestersActions from '../../../common/semesters/actions';


class MissingPoints extends Component {

  static propTypes = {
    missingPointsList: PropTypes.array,
    students: PropTypes.object,
    loadStudentsMissingPointsList: PropTypes.func.isRequired,
    addActivityPoints: PropTypes.func.isRequired,
    fetchAdminSemesters: PropTypes.func.isRequired,
    activeSemesterId: PropTypes.number,
  };

  componentDidMount() {
    const { loadStudentsMissingPointsList, fetchAdminSemesters } = this.props;
    loadStudentsMissingPointsList();
    fetchAdminSemesters();
  }

  render() {
    const { missingPointsList, students, addActivityPoints, activeSemesterId } = this.props;

    const data = missingPointsList.map((points, index) => {
      const student = students.get(points.get('studentId'));

      return {
        index,
        firstName: student.get('firstName'),
        lastName: student.get('lastName'),
        eventName: points.get('eventName'),
        eventId: points.get('eventId'),
        studentId: points.get('studentId'),
        activityPoints: points.get('activityPoints'),
      };
    }).toArray();

    return (
      <BootstrapTable
        data={data}
        multiColumnSort={3}
        striped
        search
        hover
      >
        <TableHeaderColumn isKey hidden dataField="index" />

        <TableHeaderColumn
          dataField="firstName"
          dataSort
        >
          Meno
        </TableHeaderColumn>

        <TableHeaderColumn
          dataField="lastName"
          dataSort
        >
          Priezvisko
        </TableHeaderColumn>

        <TableHeaderColumn
          dataField="eventName"
          dataSort
        >
          Názov eventu
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="actions"
          searchable={false}
          dataFormat={(cell, row) =>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => addActivityPoints(
                {
                  activityType: 'event',
                  activityModelId: row.eventId,
                  gainedPoints: row.activityPoints,
                  maxPossiblePoints: row.activityPoints,
                  semesterId: activeSemesterId,
                  name: row.eventName,
                  note: '',
                },
                [row.studentId]
              )}
            >
              Zapísať body
            </button>
          }
        >
            Akcie
        </TableHeaderColumn>
      </BootstrapTable>
    );
  }
}


export default connect(state => ({
  students: state.students.getIn(['admin', 'students']),
  activeSemesterId: state.semesters.get('activeSemesterId'),
  missingPointsList: state.students.getIn(['admin', 'missingPoints']),
}), { ...actions, ...usersActions, ...semestersActions })(MissingPoints);

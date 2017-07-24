import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


const styles = {
  rowTd: {
    cursor: 'pointer',
  },
};

export default class StudentsTable extends React.PureComponent {

  static propTypes = {
    students: PropTypes.object.isRequired,
    studentLevels: PropTypes.object.isRequired,
    selectedStudents: PropTypes.object,
    change: PropTypes.func.isRequired,
    initialized: PropTypes.bool.isRequired,
  };

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

  sortTuitionFeeFunction(a, b, order) {   // order is desc or asc
    if (order === 'desc') {
      return a.tuitionFeeBalanceNumber - b.tuitionFeeBalanceNumber;
    }

    return b.tuitionFeeBalanceNumber - a.tuitionFeeBalanceNumber;
  }

  render() {
    const { students, studentLevels, selectedStudents, change, initialized } = this.props;

    if (!initialized) {
      return null;
    }

    const studentsData = students.map(student => ({
      id: student.get('id'),
      firstName: student.get('firstName'),
      lastName: student.get('lastName'),
      studentLevelId: student.get('studentLevelId'),
      studentLevelName: studentLevels.get(student.get('studentLevelId')).name,
      activityPointsBaseNumber: student.get('activityPointsBaseNumber'),
      minimumSemesterActivityPoints: student.get('minimumSemesterActivityPoints'),
      sumGainedPoints: student.get('sumGainedPoints'),
      sumPotentialPoints: student.get('sumPotentialPoints'),
      pointsSummary: this.getStudentPointsComponent(student),
      tuitionFeeBalance: this.getTuitionFeeBalanceComponent(student.get('tuitionFeeBalance')),
      tuitionFeeBalanceNumber: student.get('tuitionFeeBalance'),
      status: student.get('status'),
    })).toArray();

    const selectRow = {
      mode: 'checkbox',
      onSelect: row => {
        if (selectedStudents.includes(row.id)) {
          const studentIndex = selectedStudents.findIndex(value => value === row.id);
          change('selectedStudents', selectedStudents.delete(studentIndex));
        } else {
          change('selectedStudents', selectedStudents.push(row.id));
        }
      },
      onSelectAll: (isSelected, rows) => {
        if (isSelected) {
          change('selectedStudents', selectedStudents.push(...rows.map(row => row.id)));
        } else {
          change('selectedStudents', selectedStudents.clear());
        }
      }
    };

    return (
      <BootstrapTable
        data={studentsData}
        multiColumnSort={3}
        striped
        options={{
          onRowClick: row => browserHistory.push(`/admin/students/${row.id}`),
        }}
        selectRow={selectRow}
        hover
        height="350px"
        containerStyle={{ height: '370px' }}
      >
        <TableHeaderColumn isKey hidden dataField="id" />

        <TableHeaderColumn
          tdStyle={styles.rowTd}
          dataField="firstName"
          dataSort
        >
            Meno
        </TableHeaderColumn>

        <TableHeaderColumn
          tdStyle={styles.rowTd}
          dataField="lastName"
          dataSort
          dataFormat={x => x}
        >
            Priezvisko
        </TableHeaderColumn>

        <TableHeaderColumn
          tdStyle={styles.rowTd}
          dataField="studentLevelName"
          dataSort
          dataFormat={x => x}
        >
            Level
        </TableHeaderColumn>

        <TableHeaderColumn
          tdStyle={styles.rowTd}
          dataField="pointsSummary"
          dataSort
          dataFormat={x => x}
        >
            Aktuálne získané body
        </TableHeaderColumn>

        <TableHeaderColumn
          tdStyle={styles.rowTd}
          dataField="activityPointsBaseNumber"
          dataSort
        >
            Bodový základ
        </TableHeaderColumn>

        <TableHeaderColumn
          tdStyle={styles.rowTd}
          dataField="tuitionFeeBalance"
          dataSort
          sortFunc={this.sortTuitionFeeFunction}
          dataFormat={x => x}
        >
            Školné
        </TableHeaderColumn>

        <TableHeaderColumn
          tdStyle={styles.rowTd}
          dataField="status"
          dataSort
        >
            Status
        </TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

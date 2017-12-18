import React, { PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


import EventActivityDetail from './EventActivityDetail';
import './ActivityPointsTable.scss';

const styles = {
  rowTd: {
    whiteSpace: 'normal',
  },
};


const isExpandableActivity = (row) => {
  const expandableTypes = ['event'];

  return expandableTypes.indexOf(row.activityType) !== -1;
};

const activityRowClass = (row) => {
  if (isExpandableActivity(row)) {
    return 'expandable';
  }

  return '';
};

export default class ActivityPointsTable extends React.PureComponent {

  static propTypes = {
    student: PropTypes.object.isRequired,
  };

  expandActivityComponent(row) {
    if (row.activityType === 'event') {
      return (
        <EventActivityDetail
          data={row.details}
          studentId={row.studentId}
          eventId={row.activityModelId}
        />
      );
    }

    return <div></div>;
  }

  expandActivity(row) {
    const { fetchEventActivityDetails } = this.props;

    if (row.activityType === 'event') {
      fetchEventActivityDetails(row.studentId, row.activityModelId);
    }
  }

  render() {
    const { student } = this.props;

    let maxPossiblePoints = 0;
    const activitiesData = student.get('activityPoints').map(activity => {
      maxPossiblePoints += activity.get('maxPossiblePoints');

      return {
        id: activity.get('id'),
        activityName: activity.get('activityName'),
        activityType: activity.get('activityType'),
        points: `${activity.get('gainedPoints')} / ${activity.get('maxPossiblePoints')}`,
        note: activity.get('note'),
        studentId: activity.get('studentId'),
        activityModelId: activity.get('activityModelId'),
        details: activity.get('details'),
      };
    }).toArray();

    activitiesData.push({
      id: -1,
      activityName: <b>Spolu:</b>,
      activityType: '',
      points: <b>{`${student.get('sumGainedPoints')} / ${maxPossiblePoints}`}</b>,
      note: '',
      studentId: null,
      activityModelId: null,
      details: null,
    });

    const options = {
      onRowClick: (row) => this.expandActivity(row),
    };

    return (
      <BootstrapTable
        data={activitiesData}
        multiColumnSort={3}
        striped
        containerClass="student-activity-table"
        expandColumnOptions={{ expandColumnVisible: true }}
        expandComponent={this.expandActivityComponent}
        expandableRow={isExpandableActivity}
        search
        hover
        options={{ ...options }}
        trClassName={activityRowClass}
      >
        <TableHeaderColumn isKey hidden dataField="id" />

        <TableHeaderColumn
          tdStyle={styles.rowTd}
          dataField="activityName"
          width={'auto'}
          dataFormat={x => x}
        >
            Názov
        </TableHeaderColumn>

        <TableHeaderColumn
          tdStyle={styles.rowTd}
          dataField="activityType"
          searchable={false}
          width={'7em'}
        >
            Typ aktivity
        </TableHeaderColumn>

        <TableHeaderColumn
          tdStyle={styles.rowTd}
          dataField="points"
          searchable={false}
          width={'8em'}
          dataFormat={x => x}
        >
            Získané body
        </TableHeaderColumn>

        <TableHeaderColumn
          tdStyle={styles.rowTd}
          dataField="note"
          searchable={false}
        >
            Poznámka
        </TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

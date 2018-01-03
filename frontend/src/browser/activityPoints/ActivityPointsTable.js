import React, { PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { browserHistory } from 'react-router';


import EventActivityDetail from './EventActivityDetail';
import './ActivityPointsTable.scss';
import confirmAction from '../components/ConfirmAction';

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
    deleteActivityPoints: PropTypes.func,
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

  renderActions(cell, row, deleteActivityPoints) {
    return (
      <span>
        {row.actions.delete_activity_points ?
          <i
            className="fa fa-trash-o trash-group"
            onClick={() => confirmAction(
              'Naozaj chcete zmazať aktivity body?',
              () => deleteActivityPoints(row.id, row.studentId),
              null
            )}
          ></i>
          : null
        }
        {row.actions.change_activity_points ?
          <i
            className="fa fa-pencil activity-edit-button"
            onClick={() => browserHistory.push(`/admin/students/${row.studentId}/activityPoints/${row.id}`)}
          ></i>
          : null
        }
      </span>
    );
  }

  render() {
    const { student, hasPermission, deleteActivityPoints } = this.props;

    const actions = {
      delete_activity_points: hasPermission('delete_activity_points'),
      change_activity_points: hasPermission('change_activity_points'),
    };

    let maxPossiblePoints = 0;
    let gainedPoints = 0;
    const activitiesData = student.get('activityPoints').map(activity => {
      maxPossiblePoints += activity.get('maxPossiblePoints');
      gainedPoints += activity.get('gainedPoints');

      return {
        id: activity.get('id'),
        activityName: activity.get('activityName'),
        activityType: activity.get('activityType'),
        points: `${activity.get('gainedPoints')} / ${activity.get('maxPossiblePoints')}`,
        note: activity.get('note'),
        studentId: activity.get('studentId'),
        activityModelId: activity.get('activityModelId'),
        details: activity.get('details'),
        actions,
      };
    }).toArray();

    activitiesData.push({
      id: -1,
      activityName: <b>Spolu:</b>,
      activityType: '',
      points: <b>{`${gainedPoints} / ${maxPossiblePoints}`}</b>,
      note: '',
      studentId: null,
      activityModelId: null,
      details: null,
      actions: {}
    });

    const options = {
      onRowClick: (row) => this.expandActivity(row),
      expandBy: 'column',
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

        {hasPermission('delete_activity_points') || hasPermission('change_activity_points') ?
          <TableHeaderColumn
            tdStyle={styles.rowTd}
            dataField="actions"
            searchable={false}
            expandable={false}
            dataFormat={(cell, row) =>
              this.renderActions(cell, row, deleteActivityPoints)
            }
            width={'7em'}
          >
              Akcie
          </TableHeaderColumn>
          : null
        }
      </BootstrapTable>
    );
  }
}

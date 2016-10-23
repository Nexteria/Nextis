import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import diacritics from 'diacritics';

import { fields } from '../../common/lib/redux-fields/index';

const messages = defineMessages({
  order: {
    defaultMessage: 'Poradie',
    id: 'viewer.activityPoints.order',
  },
  name: {
    defaultMessage: 'Meno',
    id: 'viewer.activityPoints.name',
  },
  level: {
    defaultMessage: 'Level',
    id: 'viewer.activityPoints.level',
  },
  percentageGainedPoints: {
    defaultMessage: 'Získaných bodov',
    id: 'viewer.activityPoints.percentageGainedPoints',
  },
  gainedPoints: {
    defaultMessage: 'Získané body',
    id: 'viewer.activityPoints.gainedPoints',
  },
});

class UsersActivityPointsTable extends Component {

  static propTypes = {
    users: PropTypes.object,
    studentLevels: PropTypes.object,
    viewer: PropTypes.object,
    fields: PropTypes.object,
  };

  activityPointsFilter(a, b) {
    return (b.gainedActivityPoints / b.potentialActivityPoints -
      a.gainedActivityPoints / a.potentialActivityPoints);
  }

  render() {
    const {
      viewer,
      users,
      studentLevels,
      fields,
    } = this.props;

    let filteredUsers = users.valueSeq().map(user => user);
    if (fields.usersFilter.value) {
      filteredUsers = users.valueSeq().filter(user =>
        diacritics.remove(`${user.firstName} ${user.lastName}`).toLowerCase()
          .indexOf(diacritics.remove(fields.usersFilter.value).toLowerCase()) !== -1);
    }

    return (
      <table className="table table-bordered">
        <tbody>
          <tr>
            <th><FormattedMessage {...messages.order} /></th>
            <th><FormattedMessage {...messages.name} /></th>
            <th><FormattedMessage {...messages.level} /></th>
            <th><FormattedMessage {...messages.gainedPoints} /></th>
            <th><FormattedMessage {...messages.percentageGainedPoints} /></th>
          </tr>
          {filteredUsers.sort(this.activityPointsFilter).toList().map((user, i) => {
            if (studentLevels.has(user.studentLevelId)) {
              return (
                <tr key={user.id} className={user.id === viewer.id ? 'active' : ''}>
                  <td>{i + 1}</td>
                  <td>{`${user.firstName} ${user.lastName}`}</td>
                  <td>
                    {studentLevels.has(user.studentLevelId) ?
                      studentLevels.get(user.studentLevelId).name
                    : '?'}
                  </td>
                  <td>{user.gainedActivityPoints}</td>
                  <td>
                    {Math.round(user.gainedActivityPoints /
                      user.potentialActivityPoints * 100)}&nbsp;%
                  </td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    );
  }
}

UsersActivityPointsTable = fields(UsersActivityPointsTable, {
  path: 'ActivityPoints',
  fields: [
    'usersFilter',
  ],
});

export default connect(() => ({}))(UsersActivityPointsTable);

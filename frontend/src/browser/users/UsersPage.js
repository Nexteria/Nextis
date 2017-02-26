import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import diacritics from 'diacritics';

import './UserGroupsPage.scss';
import { fields } from '../../common/lib/redux-fields/index';
import * as actions from '../../common/users/actions';

const messages = defineMessages({
  title: {
    defaultMessage: 'Users',
    id: 'users.manage.title'
  },
  tableTitle: {
    defaultMessage: 'Users - managment',
    id: 'users.manage.table.title'
  },
  noUsers: {
    defaultMessage: 'No users here',
    id: 'users.manage.noUsers'
  },
  userName: {
    defaultMessage: 'User name',
    id: 'users.manage.userName'
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
  studentLevel: {
    defaultMessage: 'Student level',
    id: 'users.manage.studentLevel'
  },
  lastName: {
    defaultMessage: 'Last name',
    id: 'users.manage.lastName'
  },
  sortBy: {
    defaultMessage: 'Sort by',
    id: 'users.manage.sortBy'
  },
  all: {
    defaultMessage: 'All',
    id: 'users.manage.all'
  },
  levelFilter: {
    defaultMessage: 'Filter level',
    id: 'users.manage.levelFilter'
  },
});

class UsersPage extends Component {

  static propTypes = {
    users: PropTypes.object,
    fields: PropTypes.object.isRequired,
    removeUser: PropTypes.func.isRequired,
    hasPermission: PropTypes.func.isRequired,
    studentLevels: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  };

  editUser(userId) {
    browserHistory.push(`/admin/users/${userId}`);
  }

  calculateUserPointsColor(user) {
    let color = '#ff0000';
    const percentage = Math.round(
      user.gainedActivityPoints / user.activityPointsBaseNumber * 100);

    if (percentage >= 50) {
      color = '#ecb200';
    }

    if (percentage > 75) {
      color = '#11ea05';
    }

    return color;
  }

  render() {
    const { users, fields, studentLevels } = this.props;
    const { removeUser, hasPermission } = this.props;
    const { formatMessage } = this.props.intl;

    if (!users) {
      return <div></div>;
    }

    let filteredUsers = users.valueSeq().map(user => user).sort((a, b) => {
      if (!fields.sortBy.value || fields.sortBy.value === 'LAST_NAME') {
        return a.lastName.toLowerCase() < b.lastName.toLowerCase() ? -1 : 1;
      }

      if (fields.sortBy.value === 'STUDENT_LEVEL') {
        if (!a.studentLevelId) {
          return 1;
        }

        if (!b.studentLevelId) {
          return -1;
        }

        return a.studentLevelId < b.studentLevelId ? -1 : 1;
      }

      if (fields.sortBy.value === 'POINTS') {
        return a.gainedActivityPoints < b.gainedActivityPoints ? -1 : 1;
      }

      return 0;
    });

    if (fields.levelFilter.value) {
      filteredUsers = filteredUsers.valueSeq().filter(user =>
        user.studentLevelId === parseInt(fields.levelFilter.value, 10)
      );
    }

    if (fields.filter.value) {
      filteredUsers = filteredUsers.valueSeq().filter(user =>
        diacritics.remove(`${user.firstName} ${user.lastName} (${user.username})`).toLowerCase()
          .indexOf(diacritics.remove(fields.filter.value).toLowerCase()) !== -1
      );
    }

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
                <div className="box-header">
                  <h3 className="box-title"><FormattedMessage {...messages.tableTitle} /></h3>
                  <div className="box-tools">
                    <div className="input-group input-group-sm pull-right" style={{ width: '150px' }}>
                      <label style={{ position: 'absolute', top: '-25px' }}>
                        <FormattedMessage {...messages.sortBy} />:
                      </label>
                      <select
                        name="sortBy"
                        className="form-control"
                        {...fields.sortBy}
                      >
                        <option value="LAST_NAME">{formatMessage(messages.lastName)}</option>
                        <option value="STUDENT_LEVEL">{formatMessage(messages.studentLevel)}</option>
                        <option value="POINTS">{formatMessage(messages.points)}</option>
                      </select>

                    </div>

                    <div className="input-group input-group-sm pull-right" style={{ width: '150px' }}>
                      <label style={{ position: 'absolute', top: '-25px' }}>
                        <FormattedMessage {...messages.levelFilter} />:
                      </label>
                      <select
                        name="sortBy"
                        className="form-control"
                        {...fields.levelFilter}
                      >
                        <option value="">{formatMessage(messages.all)}</option>
                        {studentLevels.valueSeq().map(level =>
                          <option key={level.id} value={level.id}>{level.name}</option>
                        )}
                      </select>

                    </div>

                    <div className="input-group input-group-sm" style={{ width: '150px' }}>
                      <input
                        type="text"
                        name="table_search"
                        className="form-control pull-right"
                        placeholder="Search"
                        {...fields.filter}
                      />

                      <div className="input-group-btn">
                        <button type="submit" className="btn btn-default">
                          <i className="fa fa-search"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box-body table-responsive no-padding items-container">
                  <table className="table table-hover">
                    <tbody>
                      <tr>
                        <th><FormattedMessage {...messages.userName} /></th>
                        <th><FormattedMessage {...messages.studentLevel} /></th>
                        <th><FormattedMessage {...messages.points} /></th>
                        <th><FormattedMessage {...messages.userBaseSemesterActivityPoints} /></th>
                        <th><FormattedMessage {...messages.actions} /></th>
                      </tr>
                      {filteredUsers ?
                        filteredUsers.map(user =>
                          <tr key={user.id}>
                            <td>{`${user.firstName} ${user.lastName} (${user.username})`}</td>
                            <td>
                              {user.studentLevelId ?
                                studentLevels.get(user.studentLevelId).name
                                :
                                '-'
                              }
                            </td>
                            <td style={{ color: this.calculateUserPointsColor(user) }}>
                              {user.gainedActivityPoints}
                              {user.activityPointsBaseNumber ?
                                <span>
                                  <span> (</span>
                                  {user.gainedActivityPoints === 0 ? 0 :
                                    Math.round(
                                      user.gainedActivityPoints / user.activityPointsBaseNumber * 100
                                    )
                                  }
                                  <span>%)</span>
                                </span>
                                : null
                              }
                            </td>
                            <td>
                              {user.activityPointsBaseNumber}
                            </td>
                            <td className="action-buttons">
                              {hasPermission('delete_users') ?
                                <i
                                  className="fa fa-trash-o trash-group"
                                  onClick={() => removeUser(user.id)}
                                ></i>
                                : ''
                              }

                              <i
                                className="fa fa-pencil"
                                onClick={() => this.editUser(user.id)}
                              ></i>

                              <i
                                className="fa fa-file-text-o"
                                onClick={() =>
                                  browserHistory.push(`/admin/users/${user.id}/points`)
                                }
                              ></i>

                            </td>
                          </tr>
                        )
                        :
                        <tr>
                          <td colSpan="2" style={{ textAlign: 'center' }}>
                            <FormattedMessage {...messages.noUsers} />
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

UsersPage = fields(UsersPage, {
  path: 'users',
  fields: [
    'filter',
    'levelFilter',
    'sortBy',
  ],
});

UsersPage = injectIntl(UsersPage);

export default connect(state => ({
  users: state.users.users,
  studentLevels: state.users.studentLevels,
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), actions)(UsersPage);

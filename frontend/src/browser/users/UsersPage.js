import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import diacritics from 'diacritics';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

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
  studentLevel: {
    defaultMessage: 'Level',
    id: 'user.edit.studentLevel'
  },
});

class UsersPage extends Component {

  static propTypes = {
    users: PropTypes.object,
    fields: PropTypes.object.isRequired,
    removeUser: PropTypes.func.isRequired,
    hasPermission: PropTypes.func.isRequired,
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

  getUserPointsComponent(user) {
    return (
      <span style={{ color: this.calculateUserPointsColor(user) }}>
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
      </span>
    );
  }

  getUserActions(user) {
    const { removeUser, hasPermission } = this.props;

    return (
      <span className="action-buttons">
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
      </span>
    );
  }

  pointsSortFunc(a, b, order) {   // order is desc or asc
    if (order === 'desc') {
      return a.gainedActivityPoints - b.gainedActivityPoints;
    }

    return b.gainedActivityPoints - a.gainedActivityPoints;
  }

  render() {
    const { users, fields } = this.props;
    const { hasPermission } = this.props;
    const { formatMessage } = this.props.intl;

    if (!users) {
      return <div></div>;
    }

    let filteredUsers = users.valueSeq().map(user => user);


    if (fields.filter.value) {
      filteredUsers = filteredUsers.valueSeq().filter(user =>
        diacritics.remove(`${user.firstName} ${user.lastName} (${user.username})`).toLowerCase()
          .indexOf(diacritics.remove(fields.filter.value).toLowerCase()) !== -1
      );
    }

    const userData = filteredUsers.map(user => ({
      id: user.id,
      studentLevelId: user.studentLevelId,
      firstName: user.firstName,
      lastName: user.lastName,
      points: this.getUserPointsComponent(user),
      gainedActivityPoints: user.gainedActivityPoints,
      userBaseSemesterActivityPoints: user.activityPointsBaseNumber,
      actions: this.getUserActions(user),
    })).toArray();

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
                  <BootstrapTable
                    data={userData}
                    multiColumnSort={3}
                    striped
                    hover
                    height="300px"
                    containerStyle={{ height: '320px' }}
                  >
                    <TableHeaderColumn isKey hidden dataField="id" />

                    <TableHeaderColumn dataField="firstName" dataSort>
                      {formatMessage(messages.firstName)}
                    </TableHeaderColumn>

                    <TableHeaderColumn dataField="lastName" dataSort>
                      {formatMessage(messages.lastName)}
                    </TableHeaderColumn>

                    <TableHeaderColumn dataField="studentLevelId" dataSort>
                      {formatMessage(messages.studentLevel)}
                    </TableHeaderColumn>

                    <TableHeaderColumn dataField="points" dataSort sortFunc={this.pointsSortFunc} dataFormat={x => x}>
                      {formatMessage(messages.points)}
                    </TableHeaderColumn>

                    <TableHeaderColumn dataField="userBaseSemesterActivityPoints" dataSort>
                      {formatMessage(messages.userBaseSemesterActivityPoints)}
                    </TableHeaderColumn>

                    <TableHeaderColumn dataField="actions" dataFormat={x => x}>
                      {formatMessage(messages.actions)}
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

UsersPage = fields(UsersPage, {
  path: 'users',
  fields: [
    'filter',
    'sortBy',
  ],
});

UsersPage = injectIntl(UsersPage);

export default connect(state => ({
  users: state.users.users,
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), actions)(UsersPage);

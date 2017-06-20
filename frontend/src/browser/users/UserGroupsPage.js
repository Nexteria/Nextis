import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import diacritics from 'diacritics';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import './UserGroupsPage.scss';
import { fields } from '../../common/lib/redux-fields/index';
import * as actions from '../../common/users/actions';

const messages = defineMessages({
  title: {
    defaultMessage: 'User groups',
    id: 'user.groups.manage.title'
  },
  tableTitle: {
    defaultMessage: 'User groups - managment',
    id: 'user.groups.manage.table.title'
  },
  noGroups: {
    defaultMessage: 'No groups here',
    id: 'user.groups.manage.noGroups'
  },
  groupName: {
    defaultMessage: 'Group name',
    id: 'user.groups.manage.groupName'
  },
  numberOfUsers: {
    defaultMessage: 'Number of people',
    id: 'user.groups.manage.numberOfUsers'
  },
  actions: {
    defaultMessage: 'Actions',
    id: 'user.groups.manage.actions'
  },
});

class UserGroupsPage extends Component {

  static propTypes = {
    groups: PropTypes.object,
    removeUserGroup: PropTypes.func.isRequired,
    children: PropTypes.object,
    fields: PropTypes.object.isRequired,
    hasPermission: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  getGroupActions(group) {
    const { removeUserGroup } = this.props;

    return (
      <span className="action-buttons">
        {!group.levelId ?
          <i
            className="fa fa-trash-o trash-group"
            onClick={() => removeUserGroup(group.id)}
          ></i>
          : null
        }
        <i
          className="fa fa-pencil"
          onClick={() => this.editUserGroup(group.id)}
        ></i>
      </span>
    );
  }

  editUserGroup(groupId) {
    browserHistory.push(`/admin/userGroups/${groupId}`);
  }

  usersCountSortFunc(a, b, order) {   // order is desc or asc
    if (order === 'desc') {
      return a.usersCount - b.usersCount;
    }

    return b.usersCount - a.usersCount;
  }

  render() {
    const { groups, fields, children } = this.props;
    const {
      hasPermission,
    } = this.props;
    const { formatMessage } = this.props.intl;

    if (!groups) {
      return <div></div>;
    }

    let filteredGroups = groups.valueSeq().map(group => group);
    if (fields.filter.value) {
      filteredGroups = groups.valueSeq().filter(group =>
        diacritics.remove(group.name)
                  .toLowerCase()
                  .indexOf(diacritics.remove(fields.filter.value)
                  .toLowerCase()) !== -1
      );
    }

    const groupsData = filteredGroups.map(group => ({
      id: group.id,
      groupName: group.name,
      numberOfUsers: <span className="label">{group.users.count()}</span>,
      usersCount: group.users.count(),
      actions: this.getGroupActions(group),
    })).toArray();

    return (
      <div className="group-managment-page">
        <section className="content-header">
          <h1>
            <FormattedMessage {...messages.title} />
            {hasPermission('create_user_groups') ?
              <i
                className="fa fa-plus text-green"
                style={{ cursor: 'pointer', marginLeft: '2em' }}
                onClick={() => browserHistory.push('/admin/users/groups/create')}
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
                <div className="box-body table-responsive no-padding">
                  <BootstrapTable
                    data={groupsData}
                    striped
                    hover
                    height="300px"
                    containerStyle={{ height: '320px' }}
                  >
                    <TableHeaderColumn isKey hidden dataField="id" />

                    <TableHeaderColumn dataField="groupName" dataSort>
                      {formatMessage(messages.groupName)}
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField="numberOfUsers"
                      sortFunc={this.usersCountSortFunc}
                      dataSort
                      dataFormat={x => x}
                    >
                      {formatMessage(messages.numberOfUsers)}
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
        {children}
      </div>
    );
  }
}

UserGroupsPage = fields(UserGroupsPage, {
  path: 'userGroups',
  fields: [
    'filter',
  ],
});

UserGroupsPage = injectIntl(UserGroupsPage);

export default connect(state => ({
  groups: state.users.groups,
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), actions)(UserGroupsPage);

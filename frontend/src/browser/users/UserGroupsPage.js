import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

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
  };

  editUserGroup(groupId) {
    browserHistory.push(`/admin/userGroups/${groupId}`);
  }

  render() {
    const { groups, fields, children } = this.props;
    const {
      removeUserGroup,
    } = this.props;

    if (!groups) {
      return <div></div>;
    }

    let filteredGroups = groups.valueSeq().map(group => group);
    if (fields.filter.value) {
      filteredGroups = groups.valueSeq().filter(group =>
        group.name.toLowerCase().indexOf(fields.filter.value.toLowerCase()) !== -1
      );
    }

    return (
      <div className="group-managment-page">
        <section className="content-header">
          <h1>
            <FormattedMessage {...messages.title} />
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
                  <table className="table table-hover">
                    <tbody>
                      <tr>
                        <th><FormattedMessage {...messages.groupName} /></th>
                        <th><FormattedMessage {...messages.numberOfUsers} /></th>
                        <th><FormattedMessage {...messages.actions} /></th>
                      </tr>
                      {filteredGroups ?
                        filteredGroups.map(group =>
                          <tr key={group.id}>
                            <td>{group.name}</td>
                            <td>
                              <span className="label">{group.users.count()}</span>
                            </td>
                            <td className="action-buttons">
                              <i
                                className="fa fa-trash-o trash-group"
                                onClick={() => removeUserGroup(group.id)}
                              ></i>
                              <i
                                className="fa fa-pencil"
                                onClick={() => this.editUserGroup(group.id)}
                              ></i>
                            </td>
                          </tr>
                        )
                        :
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'center' }}>
                            <FormattedMessage {...messages.noGroups} />
                          </td>
                        </tr>
                      }
                      <tr style={{ cursor: 'pointer' }} onClick={() => browserHistory.push('/admin/users/groups/create')}>
                        <td colSpan="3" style={{ textAlign: 'center', fontSize: '1.5em' }}>
                          <i className="fa fa-plus text-green"></i>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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

export default connect(state => ({
  groups: state.users.groups
}), actions)(UserGroupsPage);

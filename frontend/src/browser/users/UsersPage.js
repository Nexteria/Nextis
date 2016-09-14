import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
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
});

class UsersPage extends Component {

  static propTypes = {
    users: PropTypes.object,
    fields: PropTypes.object.isRequired,
    removeUser: PropTypes.func.isRequired,
    hasPermission: PropTypes.func.isRequired,
  };

  editUser(userId) {
    browserHistory.push(`/admin/users/${userId}`);
  }

  render() {
    const { users, fields } = this.props;
    const { removeUser, hasPermission } = this.props;

    if (!users) {
      return <div></div>;
    }

    let filteredUsers = users.valueSeq().map(user => user);
    if (fields.filter.value) {
      filteredUsers = users.valueSeq().filter(user =>
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
                        <th><FormattedMessage {...messages.actions} /></th>
                      </tr>
                      {filteredUsers ?
                        filteredUsers.map(user =>
                          <tr key={user.id}>
                            <td>{`${user.firstName} ${user.lastName} (${user.username})`}</td>
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
  ],
});

export default connect(state => ({
  users: state.users.users,
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), actions)(UsersPage);

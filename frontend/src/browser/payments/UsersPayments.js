import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import diacritics from 'diacritics';

import { fields } from '../../common/lib/redux-fields/index';
import * as usersActions from '../../common/users/actions';
import * as paymentsActions from '../../common/payments/actions';

const messages = defineMessages({
  title: {
    defaultMessage: 'Payments',
    id: 'users.manage.title'
  },
  tableTitle: {
    defaultMessage: 'Users - payments',
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
  unassociatedPayments: {
    defaultMessage: 'Unassociated Payments',
    id: 'users.manage.unassociatedPayments'
  },
  accountBalance: {
    defaultMessage: 'Account balance',
    id: 'users.manage.accountBalance'
  },
  addPayments: {
    defaultMessage: 'Add payments',
    id: 'users.manage.addPayments'
  },
});

class UsersPayments extends Component {

  static propTypes = {
    users: PropTypes.object,
    fields: PropTypes.object.isRequired,
  };

  editUser(userId) {
    browserHistory.push(`/admin/users/${userId}`);
  }

  render() {
    const { users, fields } = this.props;

    if (!users) {
      return <div></div>;
    }

    let filteredUsers = users.valueSeq().map(user => user);
    if (fields.filter.value) {
      filteredUsers = users.valueSeq().filter(user =>
        diacritics.remove(`${user.firstName} ${user.lastName} (${user.username})`).toLowerCase()
          .indexOf(diacritics.remove(fields.filter.value.toLowerCase())) !== -1
      );
    }

    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="box">
            <div className="box-header">
              <button
                className="btn btn-primary"
                onClick={() => browserHistory.push('/admin/payments/unassociated')}
              >
                <FormattedMessage {...messages.unassociatedPayments} />
              </button>
              <button
                style={{ marginLeft: '1em' }}
                className="btn btn-primary"
                onClick={() => browserHistory.push('/admin/payments/new')}
              >
                <FormattedMessage {...messages.addPayments} />
              </button>
              <div className="box-tools">
                <div className="input-group input-group-sm search-panel">
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
                    <th><FormattedMessage {...messages.accountBalance} /></th>
                    <th><FormattedMessage {...messages.actions} /></th>
                  </tr>
                  {filteredUsers ?
                    filteredUsers.map(user =>
                      <tr
                        key={user.id}
                        onClick={() => browserHistory.push(`/admin/users/${user.id}/payments`)}
                      >
                        <td>{`${user.firstName} ${user.lastName} (${user.username})`}</td>
                        <td
                          className={user.accountBalance >= 0 ? 'green-text' : 'red-text'}
                        >{user.accountBalance / 100} &euro;</td>
                        <td className="action-buttons">
                          <i
                            className="fa fa-pencil"
                          ></i>
                        </td>
                      </tr>
                    )
                    :
                    <tr>
                      <td colSpan="2" id="no-user-div">
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
    );
  }
}

UsersPayments = fields(UsersPayments, {
  path: 'payments',
  fields: [
    'filter',
  ],
});

export default connect(state => ({
  users: state.users.users,
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), { ...paymentsActions, ...usersActions })(UsersPayments);

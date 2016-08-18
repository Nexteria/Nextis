import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

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
});

class PaymentsPage extends Component {

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
        `${user.firstName} ${user.lastName} (${user.username})`.toLowerCase()
          .indexOf(fields.filter.value.toLowerCase()) !== -1
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
            <div className="col-md-12" style={{ marginBottom: '1em', textAlign: 'center' }}>
              <button className="btn btn-primary" onClick={() => browserHistory.push('/admin/payments/unassociated')}>
                <FormattedMessage {...messages.unassociatedPayments} />
              </button>
            </div>
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
                          <tr key={user.id} onClick={() => browserHistory.push(`/admin/users/${user.id}/payments`)}>
                            <td>{`${user.firstName} ${user.lastName} (${user.username})`}</td>
                            <td className="action-buttons">
                              <i
                                className="fa fa-pencil"
                                onClick={() => this.showUserPayment(user.id)}
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

PaymentsPage = fields(PaymentsPage, {
  path: 'users',
  fields: [
    'filter',
  ],
});

export default connect(state => ({
  users: state.users.users,
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), { ...paymentsActions, ...usersActions })(PaymentsPage);

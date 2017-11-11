import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import diacritics from 'diacritics';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

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
    intl: PropTypes.object.isRequired,
    loadUsersPayments: PropTypes.func.isRequired,
    usersPayments: PropTypes.object,
  };

  componentWillMount() {
    const { loadUsersPayments, loadUsers } = this.props;
    loadUsersPayments();
    loadUsers();
  }

  getUserActions(user) {
    return (
      <span className="action-buttons">
        <i
          onClick={() => browserHistory.push(`/admin/users/${user.id}/payments`)}
          className="fa fa-pencil"
        ></i>
      </span>
    );
  }

  editUser(userId) {
    browserHistory.push(`/admin/users/${userId}`);
  }

  accountBalanceSortFunc(a, b, order) {   // order is desc or asc
    if (order === 'desc') {
      return a.accountBalanceNumber - b.accountBalanceNumber;
    }

    return b.accountBalanceNumber - a.accountBalanceNumber;
  }

  computeUserAccountBallance(payments) {
    let balance = 0;
    payments.forEach(payment => {
      if (payment.transactionType === 'debet') {
        balance -= payment.amount;
      } else {
        balance += payment.amount;
      }
    });

    return balance;
  }

  render() {
    const { users, usersPayments, fields } = this.props;
    const { formatMessage } = this.props.intl;

    if (!users || !usersPayments) {
      return <div></div>;
    }

    let filteredUsers = users.valueSeq().map(user => user);
    if (fields.filter.value) {
      filteredUsers = users.valueSeq().filter(user =>
        diacritics.remove(`${user.firstName} ${user.lastName} (${user.username})`).toLowerCase()
          .indexOf(diacritics.remove(fields.filter.value.toLowerCase())) !== -1
      );
    }

    const usersData = filteredUsers.valueSeq().map(user => {
      const balance = this.computeUserAccountBallance(usersPayments.get(user.id));
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        accountBalance: (<span className={balance >= 0 ? 'green-text' : 'red-text'}>
          {balance / 100} &euro;</span>),
        accountBalanceNumber: balance / 100,
        actions: this.getUserActions(user),
      };
    }).toArray();

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
              <BootstrapTable
                data={usersData}
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

                <TableHeaderColumn
                  dataField="accountBalance"
                  sortFunc={this.accountBalanceSortFunc}
                  dataSort
                  dataFormat={x => x}
                >
                  {formatMessage(messages.accountBalance)}
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
    );
  }
}

UsersPayments = fields(UsersPayments, {
  path: 'payments',
  fields: [
    'filter',
  ],
});

UsersPayments = injectIntl(UsersPayments);

export default connect(state => ({
  users: state.users.users,
  usersPayments: state.payments.usersPayments,
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), { ...paymentsActions, ...usersActions })(UsersPayments);

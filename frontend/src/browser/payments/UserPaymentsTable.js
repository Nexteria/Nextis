import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import { browserHistory } from 'react-router';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import Datetime from 'react-datetime';
import { reduxForm, formValueSelector } from 'redux-form';


import * as paymentsActions from '../../common/payments/actions';

const messages = defineMessages({
  closeButton: {
    defaultMessage: 'Close',
    id: 'payments.users.closeButton',
  },
  userPayments: {
    defaultMessage: 'User payments',
    id: 'payments.users.userPayments',
  },
  amount: {
    defaultMessage: 'Amount',
    id: 'payments.users.amount',
  },
  transactionType: {
    defaultMessage: 'Transaction type',
    id: 'payments.users.transactionType',
  },
  variableSymbol: {
    defaultMessage: 'Variable symbol',
    id: 'payments.users.variableSymbol',
  },
  specificSymbol: {
    defaultMessage: 'Specific symbol',
    id: 'payments.users.specificSymbol',
  },
  constantSymbol: {
    defaultMessage: 'Constant symbol',
    id: 'payments.users.constantSymbol',
  },
  message: {
    defaultMessage: 'Message',
    id: 'payments.users.message',
  },
  createdAt: {
    defaultMessage: 'Acceptation date',
    id: 'payments.users.createdAt',
  },
  noPayments: {
    defaultMessage: 'There are no payments',
    id: 'payments.users.noPayments',
  },
});

const styles = {
  amountColumn: {
    width: '6em',
  },
  transactionTypeColumn: {
    width: '8em',
  },
  variableSymbolColumn: {
    width: '10em',
  },
  deleteButton: {
    marginTop: '1em',
    marginBottom: '1em',
  }
};

export class UserPaymentsTable extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    userPayments: PropTypes.object,
    change: PropTypes.func.isRequired,
    paymentsSelection: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    deletePayments: PropTypes.func.isRequired,
  }

  render() {
    const {
      userPayments,
      paymentsSelection,
      change,
      dispatch,
      params,
      deletePayments,
    } = this.props;

    if (userPayments === null) {
      return <div></div>;
    }

    return (
      <div>
        <Table
          height={300}
          multiSelectable
          fixedHeader
          onRowSelection={selection => dispatch(change('paymentsSelection', selection))}
        >
          <TableHeader
            enableSelectAll
          >
            <TableRow>
              <TableHeaderColumn
                style={styles.amountColumn}
              >
                <FormattedMessage {...messages.amount} />
              </TableHeaderColumn>
              <TableHeaderColumn
                style={styles.transactionTypeColumn}
              >
                <FormattedMessage {...messages.transactionType} />
              </TableHeaderColumn>
              <TableHeaderColumn
                style={styles.variableSymbolColumn}
              >
                <FormattedMessage {...messages.variableSymbol} />
              </TableHeaderColumn>
              <TableHeaderColumn><FormattedMessage {...messages.message} /></TableHeaderColumn>
              <TableHeaderColumn><FormattedMessage {...messages.createdAt} /></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody deselectOnClickaway={false} ref={(tableBody) => { this.tableBody = tableBody; }}>
            {userPayments.size > 0 ?
              userPayments.map((payment, index) =>
                <TableRow
                  key={payment.id}
                  style={{ color: payment.transactionType === 'kredit' ? 'green' : 'red' }}
                >
                  <TableRowColumn
                    style={styles.amountColumn}
                  >
                    {payment.amount / 100}
                  </TableRowColumn>
                  <TableRowColumn
                    style={styles.transactionTypeColumn}
                  >
                    {payment.transactionType}
                  </TableRowColumn>
                  <TableRowColumn
                    style={styles.variableSymbolColumn}
                  >
                    {payment.variableSymbol}
                  </TableRowColumn>
                  <TableRowColumn>{payment.message}</TableRowColumn>
                  <TableRowColumn>{payment.createdAt}</TableRowColumn>
                </TableRow>
              )
              :
                <TableRow>
                  <TableRowColumn colSpan="6" style={{ textAlign: 'center' }}>
                    <FormattedMessage {...messages.noPayments} />
                  </TableRowColumn>
                </TableRow>
            }
          </TableBody>
        </Table>
        <div className="col-md-12 text-center">
          <RaisedButton
            secondary
            icon={<DeleteIcon />}
            style={styles.deleteButton}
            onClick={() => {
              if (paymentsSelection === 'all') {
                deletePayments(userPayments.map(payment => payment.id), params.userId);
              } else {
                deletePayments(paymentsSelection.map(index => userPayments.getIn([index, 'id'])), params.userId);
              }

              change('paymentsSelection', []);

              if (this.tableBody) {
                this.tableBody.setState({ selectedRows: [] });
              }
            }}
          />
        </div>
      </div>
    );
  }
}

UserPaymentsTable = reduxForm({
  form: 'UserPaymentsTable',
  initialValues: { paymentsSelection: [] }
})(UserPaymentsTable);

const selector = formValueSelector('UserPaymentsTable');

export default connect(state => ({
  userPayments: state.payments.userPayments,
  locale: state.intl.currentLocale,
  paymentsSelection: selector(state, 'paymentsSelection'),
}), paymentsActions)(UserPaymentsTable);

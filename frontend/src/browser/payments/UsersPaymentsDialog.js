import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import { browserHistory } from 'react-router';


import * as paymentsActions from '../../common/payments/actions';
import AssociatePaymentDialog from './AssociatePaymentDialog';

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

export class UsersPaymentsDialog extends Component {

  static propTypes = {
    users: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    userPayments: PropTypes.object,
    loadUsersPayments: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { loadUsersPayments, params } = this.props;
    loadUsersPayments(params.userId);
  }

  render() {
    const { userPayments } = this.props;

    if (userPayments === null) {
      return <div></div>;
    }

    return (
      <Modal
        show
        bsSize="large"
        dialogClassName="event-details-dialog"
        onHide={() => browserHistory.goBack()}
      >
        <Header closeButton>
          <Title><FormattedMessage {...messages.userPayments} /></Title>
        </Header>

        <Body>
          <div className="box-body table-responsive no-padding">
            <table className="table table-hover">
              <tbody>
                <tr>
                  <th><FormattedMessage {...messages.amount} /></th>
                  <th><FormattedMessage {...messages.transactionType} /></th>
                  <th><FormattedMessage {...messages.variableSymbol} /></th>
                  <th><FormattedMessage {...messages.specificSymbol} /></th>
                  <th><FormattedMessage {...messages.message} /></th>
                  <th><FormattedMessage {...messages.createdAt} /></th>
                </tr>
                {userPayments.size > 0 ?
                  userPayments.map(payment =>
                    <tr key={payment.id}>
                      <td>{payment.amount / 100}</td>
                      <td>{payment.transactionType}</td>
                      <td>{payment.variableSymbol}</td>
                      <td>{payment.specificSymbol}</td>
                      <td>{payment.message}</td>
                      <td>{payment.createdAt}</td>
                    </tr>
                  )
                :
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    <FormattedMessage {...messages.noPayments} />
                  </td>
                </tr>
                }
              </tbody>
            </table>
          </div>
        </Body>

        <Footer>
          <div className="col-md-12">
            <button
              className="btn btn-primary"
              onClick={() => browserHistory.goBack()}
            >
              <FormattedMessage {...messages.closeButton} />
            </button>
          </div>
        </Footer>
        <AssociatePaymentDialog />
      </Modal>
    );
  }
}

export default connect(state => ({
  users: state.users.users,
  userPayments: state.payments.userPayments,
}), paymentsActions)(UsersPaymentsDialog);

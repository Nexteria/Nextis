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
    id: 'payments.unassociated.closeButton',
  },
  unassociatedPayments: {
    defaultMessage: 'Unassociated payments',
    id: 'payments.unassociated.unassociatedPayments',
  },
  amount: {
    defaultMessage: 'Amount',
    id: 'payments.unassociated.amount',
  },
  transactionType: {
    defaultMessage: 'Transaction type',
    id: 'payments.unassociated.transactionType',
  },
  variableSymbol: {
    defaultMessage: 'Variable symbol',
    id: 'payments.unassociated.variableSymbol',
  },
  specificSymbol: {
    defaultMessage: 'Specific symbol',
    id: 'payments.unassociated.specificSymbol',
  },
  constantSymbol: {
    defaultMessage: 'Constant symbol',
    id: 'payments.unassociated.constantSymbol',
  },
  message: {
    defaultMessage: 'Message',
    id: 'payments.unassociated.message',
  },
  createdAt: {
    defaultMessage: 'Acceptation date',
    id: 'payments.unassociated.createdAt',
  },
  noPayments: {
    defaultMessage: 'There are no payments',
    id: 'payments.unassociated.noPayments',
  },
});

export class UnassociatedPaymentsDialog extends Component {

  static propTypes = {
    unassociatedPayments: PropTypes.object,
    openPaymentAssociationDialog: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { loadUnassociatedPayments } = this.props;
    loadUnassociatedPayments();
  }

  render() {
    const { unassociatedPayments, openPaymentAssociationDialog } = this.props;

    if (unassociatedPayments === null) {
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
          <Title><FormattedMessage {...messages.unassociatedPayments} /></Title>
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
                { unassociatedPayments.size > 0 ?
                  unassociatedPayments.map(payment =>
                    <tr key={payment.id} style={{ cursor: 'pointer' }} onClick={() => openPaymentAssociationDialog(payment.id)}>
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
  unassociatedPayments: state.payments.unassociatedPayments,
}), paymentsActions)(UnassociatedPaymentsDialog);

import './Payments.scss';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';


import * as actions from '../../common/payments/actions';


const messages = defineMessages({
  title: {
    defaultMessage: 'Transaction',
    id: 'viewerPayments.title'
  },
  accountBalance: {
    defaultMessage: 'Account balance',
    id: 'viewerPayments.accountBalance'
  },
  monthlySchoolFee: {
    defaultMessage: 'Monthly school fee',
    id: 'viewerPayments.monthlySchoolFee'
  },
  transactions: {
    defaultMessage: 'Transactions',
    id: 'viewerPayments.transactions',
  },
  date: {
    defaultMessage: 'Date',
    id: 'viewerPayments.date',
  },
  amount: {
    defaultMessage: 'Amount',
    id: 'viewerPayments.amount',
  },
  message: {
    defaultMessage: 'Message',
    id: 'viewerPayments.message',
  },
  loadingPayments: {
    defaultMessage: 'Loading payments',
    id: 'viewerPayments.loadingPayments',
  },
  iban: {
    defaultMessage: 'IBAN',
    id: 'viewerPayments.iban',
  },
  vs: {
    defaultMessage: 'VS',
    id: 'viewerPayments.vs',
  },
  paymentInstruction: {
    defaultMessage: 'Payment instruction',
    id: 'viewerPayments.paymentInstruction'
  },
  recieverMessage: {
    defaultMessage: 'Message for reciever',
    id: 'viewerPayments.recieverMessage'
  },
});

class Payments extends Component {

  static propTypes = {
    nexteriaIban: PropTypes.string,
    userPayments: PropTypes.object,
    viewer: PropTypes.object,
    viewerRolesData: PropTypes.object.isRequired,
    loadUsersPayments: PropTypes.func,
  };

  componentDidMount() {
    const {
      viewer,
      loadUsersPayments,
    } = this.props;
    loadUsersPayments(viewer.id);
  }

  render() {
    const {
      nexteriaIban,
      viewer,
      viewerRolesData,
      userPayments,
    } = this.props;

    if (!userPayments) {
      return <div></div>
    }

    const student = viewerRolesData.get('student');

    let balance = 0;
    userPayments.forEach(payment => {
      if (payment.transactionType === 'debet') {
        balance -= payment.amount;
      } else {
        balance += payment.amount;
      }
    });

    return (
      <div>
        <section className="content-header">
          <h1>
            <FormattedMessage {...messages.title} />
          </h1>
        </section>
        <section className="content">
          <div className="active tab-pane" id="payments">
            <div className="col-md-12">
              <div className="col-md-4">
                <div className="col-md-12">
                  <strong><FormattedMessage {...messages.accountBalance} />:</strong>
                  <div className="text-center">
                    <span
                      id="account-balance-span"
                      className={balance >= 0 ? 'green-text' : 'red-text'}
                    >{balance / 100} &euro;</span>
                  </div>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th><FormattedMessage {...messages.monthlySchoolFee} />:</th>
                        <th>{student.get('tuitionFee') / 100} &euro;</th>
                      </tr>
                    </tbody>
                  </table>
                  <div>
                    <strong>
                      <FormattedMessage {...messages.paymentInstruction} />
                    </strong>
                  </div>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td><FormattedMessage {...messages.iban} />:</td>
                        <td>{nexteriaIban}</td>
                      </tr>
                      <tr>
                        <td><FormattedMessage {...messages.vs} />:</td>
                        <td>{student.get('tuitionFeeVariableSymbol')}</td>
                      </tr>
                      <tr>
                        <td><FormattedMessage {...messages.recieverMessage} />:</td>
                        <td>{`"${viewer.firstName} ${viewer.lastName} skolne"`}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-8">
                <div><strong><FormattedMessage {...messages.transactions} />:</strong></div>
                <div id="payments-transaction-table">
                  {userPayments == null ?
                    <div><FormattedMessage {...messages.loadingPayments} /></div>
                  :
                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <th><FormattedMessage {...messages.date} /></th>
                          <th><FormattedMessage {...messages.amount} /></th>
                          <th><FormattedMessage {...messages.message} /></th>
                        </tr>
                        {userPayments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                          .map((payment) =>
                            <tr
                              key={payment.id}
                              className={payment.transactionType === 'debet' ? 'red-text' : 'green-text'}
                            >
                              <td>{payment.createdAt}</td>
                              <td>
                                {payment.transactionType === 'debet' ? '- ' : '+ '}
                                {payment.amount / 100} &euro;
                              </td>
                              <td>{payment.message}</td>
                            </tr>
                        )}
                      </tbody>
                    </table>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connect(state => ({
  nexteriaIban: state.app.constants.nexteriaIban,
  viewer: state.users.viewer,
  viewerRolesData: state.users.viewerRolesData,
  userPayments: state.payments.userPayments,
  studentLevels: state.users.studentLevels,
  rolesList: state.users.rolesList,
}), actions)(Payments);

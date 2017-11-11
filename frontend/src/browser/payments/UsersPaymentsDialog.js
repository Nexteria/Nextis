import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import { browserHistory } from 'react-router';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';


import * as paymentsActions from '../../common/payments/actions';
import AssociatePaymentDialog from './AssociatePaymentDialog';
import UserPaymentsTable from './UserPaymentsTable';
import UserPaymentsSettings from './UserPaymentsSettings';

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
  allPayments: {
    defaultMessage: 'All payments',
    id: 'payments.users.allPayments',
  },
  settings: {
    defaultMessage: 'Settings',
    id: 'payments.users.settings',
  },
  noUserSettings: {
    defaultMessage: 'User has not any specific payments settings',
    id: 'payments.users.noUserSettings',
  },
  createSettings: {
    defaultMessage: 'Create',
    id: 'payments.users.createSettings',
  },
});

export class UsersPaymentsDialog extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    userPayments: PropTypes.object,
    loadUsersPayments: PropTypes.func.isRequired,
    loadUserPaymentsSettings: PropTypes.func.isRequired,
    userPaymentsSettings: PropTypes.object,
    createUserPaymentsSettings: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { loadUsersPayments, loadUserPaymentsSettings, params } = this.props;
    loadUsersPayments(params.userId);
    loadUserPaymentsSettings(params.userId);
  }

  render() {
    const { userPayments, userPaymentsSettings, createUserPaymentsSettings, params } = this.props;

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
            <Tabs defaultActiveKey={1} id="user-payment-overview-tabs" className="nav-tabs-custom">
              <Tab
                eventKey={1}
                title={<i className="fa fa-users"> <FormattedMessage {...messages.allPayments} /></i>}
              >
                <UserPaymentsTable params={params} />
              </Tab>
              <Tab
                eventKey={2}
                title={<i className="fa fa-file-excel-o"> <FormattedMessage {...messages.settings} /></i>}
              >
                {userPaymentsSettings.get('dataLoaded') ?
                  userPaymentsSettings.get('data') !== null ?
                    <UserPaymentsSettings userId={params.userId} />
                    :
                    <div className={'form-group'} style={{ textAlign: 'center' }}>
                      <div>
                        <label className="control-label">
                          <FormattedMessage {...messages.noUserSettings} />
                        </label>
                      </div>
                      <div>
                        <button className="btn btn-info" onClick={createUserPaymentsSettings}>
                          <FormattedMessage {...messages.createSettings} />
                        </button>
                      </div>
                    </div>
                  : null
                }
              </Tab>
            </Tabs>
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
  userPaymentsSettings: state.users.paymentsSettings,
  userPayments: state.payments.userPayments,
}), paymentsActions)(UsersPaymentsDialog);

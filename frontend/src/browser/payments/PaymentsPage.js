import './PaymentsPage.scss';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';


import * as usersActions from '../../common/users/actions';
import * as paymentsActions from '../../common/payments/actions';
import UsersPayments from './UsersPayments';
import PaymentsImportExport from './PaymentsImportExport';
import PaymentsSettings from './PaymentsSettings';

const messages = defineMessages({
  title: {
    defaultMessage: 'Payments',
    id: 'payments.manage.title'
  },
  usersTitle: {
    defaultMessage: 'Users',
    id: 'payments.manage.users.tabtitle'
  },
  importExportTitle: {
    defaultMessage: 'Import / export',
    id: 'payments.manage.importExport.tabtitle'
  },
  settingsTitle: {
    defaultMessage: 'Settings',
    id: 'payments.manage.settings.tabtitle'
  },
});

class PaymentsPage extends Component {

  static propTypes = {
    paymentsSettings: PropTypes.object,
    fetchGlobalPaymentsSettings: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { fetchGlobalPaymentsSettings } = this.props;
    fetchGlobalPaymentsSettings();
  }

  render() {
    const { paymentsSettings } = this.props;
    return (
      <div className="group-managment-page">
        <section className="content-header">
          <h1>
            <FormattedMessage {...messages.title} />
          </h1>
        </section>
        <section className="content">
          <Tabs defaultActiveKey={1} id="admin-payments-tabs" className="nav-tabs-custom">
            <Tab
              eventKey={1}
              title={<i className="fa fa-users"> <FormattedMessage {...messages.usersTitle} /></i>}
            >
              <UsersPayments />
            </Tab>
            <Tab
              eventKey={2}
              title={<i className="fa fa-file-excel-o"> <FormattedMessage {...messages.importExportTitle} /></i>}
            >
              <PaymentsImportExport />
            </Tab>
            <Tab
              eventKey={3}
              title={<i className="fa fa-gears"> <FormattedMessage {...messages.settingsTitle} /></i>}
            >
              {paymentsSettings ? <PaymentsSettings /> : null}
            </Tab>
          </Tabs>
        </section>
      </div>
    );
  }
}

export default connect(state => ({
  paymentsSettings: state.payments.paymentsSettings,
}), { ...paymentsActions, ...usersActions })(PaymentsPage);

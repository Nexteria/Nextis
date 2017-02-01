import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import diacritics from 'diacritics';
import Paper from 'material-ui/Paper';


import { fields } from '../../common/lib/redux-fields/index';
import * as usersActions from '../../common/users/actions';
import * as paymentsActions from '../../common/payments/actions';

const messages = defineMessages({
  importTitle: {
    defaultMessage: 'Import',
    id: 'payments.manage.importExport.importTitle'
  },
  exportTitle: {
    defaultMessage: 'Export',
    id: 'payments.manage.importExport.exportTitle'
  },
  tuitionFeesSummary: {
    defaultMessage: 'Tuition fees summary',
    id: 'payments.manage.importExport.tuitionFeesSummaryButton',
  },
  payments: {
    defaultMessage: 'Payments',
    id: 'payments.manage.importExport.paymentsButton',
  },
});

const styles = {
  mainTitle: {
    textAlign: 'center',
  }
};

class PaymentsImportExport extends Component {

  static propTypes = {
  };

  render() {
    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="col-xs-6">
            <Paper>
              <h2 style={styles.mainTitle}><FormattedMessage {...messages.importTitle} /></h2>
              <button
                className="btn btn-block btn-xs btn-primary"
                onClick={() => browserHistory.push('/admin/payments/imports/payments')}
              >
                <FormattedMessage {...messages.payments} />
              </button>
            </Paper>
          </div>
          <div className="col-xs-6">
            <Paper>
              <h2 style={styles.mainTitle}><FormattedMessage {...messages.exportTitle} /></h2>
              <button
                className="btn btn-block btn-xs btn-primary"
                onClick={() => browserHistory.push('/admin/payments/exports/tuitionFeesSummary')}
              >
                <FormattedMessage {...messages.tuitionFeesSummary} />
              </button>
            </Paper>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  users: state.users.users,
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), { ...paymentsActions, ...usersActions })(PaymentsImportExport);

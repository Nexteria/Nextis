import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import { browserHistory, Link } from 'react-router';
import Datetime from 'react-datetime';
import moment from 'moment';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import Dropzone from 'react-dropzone';


import * as paymentsActions from '../../../common/payments/actions';

const messages = defineMessages({
  closeButton: {
    defaultMessage: 'Close',
    id: 'payments.users.closeButton',
  },
  title: {
    defaultMessage: 'Import payments',
    id: 'payments.manage.import.payments.title',
  },
  downloadPaymentsTemplate: {
    defaultMessage: 'Download template document',
    id: 'payments.manage.import.downloadPaymentsTemplate',
  },
  choosePaymentsFile: {
    defaultMessage: 'Choose payments file',
    id: 'payments.manage.import.choosePaymentsFile',
  },
});

const styles = {
  dropzoneArea: {
    margin: 'auto',
    marginTop: '1em',
    width: '200px',
    height: '200px',
    borderWidth: '2px',
    borderColor: 'rgb(102, 102, 102)',
    borderStyle: 'dashed',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    cursor: 'pointer',
  },
  dropzoneInner: {
    margin: 'auto',
  },
};

export class ImportPaymentsDialog extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
  }

  render() {

    const { uploadPaymentsImport } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <Modal
        show
        bsSize="large"
        onHide={() => browserHistory.goBack()}
      >
        <Header closeButton>
          <Title><FormattedMessage {...messages.title} /></Title>
        </Header>

        <Body className="text-center">
          <Link className="btn btn-primary" to={`/templates/imports/importPaymentsExample.xls`} target="_blank">
            <FormattedMessage {...messages.downloadPaymentsTemplate} />
          </Link>

          <Dropzone
            multiple={false}
            accept="application/vnd.ms-excel"
            onDrop={(files) => uploadPaymentsImport(files)}
            style={styles.dropzoneArea}
          >
            <div style={styles.dropzoneInner}>
              <FormattedMessage {...messages.choosePaymentsFile} />
            </div>
          </Dropzone>
          <div className="clearfix"></div>
        </Body>
      </Modal>
    );
  }
}

ImportPaymentsDialog = reduxForm({
  form: 'importPaymentsDialog',
})(ImportPaymentsDialog);

ImportPaymentsDialog = injectIntl(ImportPaymentsDialog);
const selector = formValueSelector('tuitionFeesSummaryExport');

export default connect(state => ({
  locale: state.intl.currentLocale,
  exportStartDate: selector(state, 'exportStartDate'),
  exportEndDate: selector(state, 'exportEndDate'),
}), paymentsActions)(ImportPaymentsDialog);

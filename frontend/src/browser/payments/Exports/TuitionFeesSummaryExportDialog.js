import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import Modal, { Header, Title, Body } from 'react-bootstrap/lib/Modal';
import { browserHistory, Link } from 'react-router';
import Datetime from 'react-datetime';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import isAfter from 'date-fns/is_after';
import format from 'date-fns/format';


import * as paymentsActions from '../../../common/payments/actions';

const messages = defineMessages({
  closeButton: {
    defaultMessage: 'Close',
    id: 'payments.users.closeButton',
  },
  title: {
    defaultMessage: 'Tuition fees summary export',
    id: 'payments.manage.export.tuitionFeesSummary.title',
  },
  showDownloadLink: {
    defaultMessage: 'Show download link',
    id: 'payments.manage.export.tuitionFeesSummary.showDownloadLink',
  },
  exportStartDate: {
    defaultMessage: 'Start date',
    id: 'payments.manage.export.tuitionFeesSummary.exportStartDate',
  },
  exportEndDate: {
    defaultMessage: 'End date',
    id: 'payments.manage.export.tuitionFeesSummary.exportEndDate',
  },
  startDateMustBeBeforeEndDate: {
    defaultMessage: 'Start date must be before end date!',
    id: 'payments.manage.export.tuitionFeesSummary.startDateMustBeBeforeEndDate',
  },
  endDateMustBeAfterStartDate: {
    defaultMessage: 'End date must be after start date!',
    id: 'payments.manage.export.tuitionFeesSummary.endDateMustBeAfterStartDate',
  },
  requiredField: {
    defaultMessage: 'This field is required',
    id: 'payments.manage.export.requiredField',
  },
  downloadLink: {
    defaultMessage: 'Download link',
    id: 'payments.manage.export.downloadLink',
  },
});

const validate = (values, props) => {
  const { formatMessage } = props.intl;
  const actualEvent = props.actualEvent;

  const errors = {};
  if (!values.exportStartDate) {
    errors.exportStartDate = formatMessage(messages.requiredField);
  } else if (values.exportEndDate && isAfter(values.exportStartDate, values.exportEndDate)) {
    errors.exportStartDate = formatMessage(messages.startDateMustBeBeforeEndDate);
  }

  if (!values.exportEndDate) {
    errors.exportEndDate = formatMessage(messages.requiredField);
  } else if (values.exportStartDate && isAfter(values.exportStartDate, values.exportEndDate)) {
    errors.exportEndDate = formatMessage(messages.endDateMustBeAfterStartDate);
  }

  return errors;
};

export class TuitionFeesSummaryExportDialog extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
  }

  renderDate(data) {
    const { input, label, locale, meta: { touched, error } } = data;

    return (
      <div className={`form-group ${touched && error ? 'has-error' : ''}`}>
        <label className="control-label">
          {label}
        </label>

        <Datetime
          inputProps={{ id: input.name }}
          locale={locale}
          input={false}
          value={input.value}
          onBlur={input.onBlur}
          onChange={(moment) => input.onChange(moment)}
        />
        <div className="has-error">
          {touched && error && <label>{error}</label>}
        </div>
      </div>
    );
  }

  render() {
    const {
      handleSubmit,
      locale,
      pristine,
      invalid,
      exportEndDate,
      exportStartDate,
    } = this.props;

    const { formatMessage } = this.props.intl;

    const fromDate = exportStartDate ? format(exportStartDate, 'YYYY-MM-DD HH:mm:ss') : '';
    const toDate = exportEndDate ? format(exportEndDate, 'YYYY-MM-DD HH:mm:ss') : '';

    return (
      <Modal
        show
        bsSize="large"
        onHide={() => browserHistory.goBack()}
      >
        <Header closeButton>
          <Title><FormattedMessage {...messages.title} /></Title>
        </Header>

        <Body>
          <form className="col-md-12" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <Field
                name="exportStartDate"
                component={this.renderDate}
                label={`${formatMessage(messages.exportStartDate)}*`}
                locale={locale}
              />
            </div>

            <div className="col-md-6">
              <Field
                name="exportEndDate"
                component={this.renderDate}
                label={`${formatMessage(messages.exportEndDate)}*`}
                locale={locale}
              />
            </div>
            <div className="col-md-12 text-center">
              {fromDate && toDate && !invalid && !pristine ?
                <Link className="btn btn-primary" to={`/api/payments/tuitionFeesSummary/download?from=${fromDate}&to=${toDate}`} target="_blank">
                  <FormattedMessage {...messages.downloadLink} />
                </Link>
                : null
              }
            </div>
          </form>
          <div className="clearfix"></div>
        </Body>
      </Modal>
    );
  }
}

TuitionFeesSummaryExportDialog = reduxForm({
  form: 'tuitionFeesSummaryExport',
  validate,
})(TuitionFeesSummaryExportDialog);

TuitionFeesSummaryExportDialog = injectIntl(TuitionFeesSummaryExportDialog);
const selector = formValueSelector('tuitionFeesSummaryExport');

export default connect(state => ({
  locale: state.intl.currentLocale,
  exportStartDate: selector(state, 'exportStartDate'),
  exportEndDate: selector(state, 'exportEndDate'),
}), paymentsActions)(TuitionFeesSummaryExportDialog);

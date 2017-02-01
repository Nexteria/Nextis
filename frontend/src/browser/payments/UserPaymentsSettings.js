import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import { browserHistory } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';


import * as paymentsActions from '../../common/payments/actions';

const messages = defineMessages({
  checkingSchoolFeePaymentsDay: {
    defaultMessage: 'Date and time of checking school fee payments',
    id: 'payments.manage.settings.checkingSchoolFeePaymentsDay',
  },
  generationSchoolFeeDay: {
    defaultMessage: 'Date and time of generation school fee',
    id: 'payments.manage.settings.generationSchoolFeeDay',
  },
  schoolFeePaymentsDeadlineDay: {
    defaultMessage: 'Deadline of school fee payments',
    id: 'payments.manage.settings.schoolFeePaymentsDeadlineDay',
  },
  save: {
    defaultMessage: 'Save',
    id: 'payments.manage.settings.save',
  },
  schoolFeeApplicableMonths: {
    defaultMessage: 'Generate school fee in months',
    id: 'payments.manage.settings.schoolFeeApplicableMonths',
  },
  requiredField: {
    defaultMessage: 'This field is required',
    id: 'payments.manage.settings.requiredField',
  },
  mustBeValidNumber: {
    defaultMessage: 'This field must be valid positive number',
    id: 'payments.manage.settings.mustBeValidNumber',
  },
  disableEmailNotifications: {
    defaultMessage: 'Disable email notifications',
    id: 'payments.manage.settings.disableEmailNotifications',
  },
  disableSchoolFeePayments: {
    defaultMessage: 'Disable school fee payments generation, checks',
    id: 'payments.manage.settings.disableSchoolFeePayments',
  },
});

const validate = (values, props) => {
  const { formatMessage } = props.intl;

  const errors = {};

  if (!values.generationSchoolFeeDay) {
    errors.generationSchoolFeeDay = formatMessage(messages.requiredField);
  } else if (!validator.isDecimal(`${values.generationSchoolFeeDay}`)) {
    errors.generationSchoolFeeDay = formatMessage(messages.mustBeValidNumber);
  } else if (parseInt(values.generationSchoolFeeDay) < 1) {
    errors.generationSchoolFeeDay = formatMessage(messages.mustBeValidNumber);
  }

  if (!values.schoolFeePaymentsDeadlineDay) {
    errors.schoolFeePaymentsDeadlineDay = formatMessage(messages.requiredField);
  } else if (!validator.isDecimal(`${values.schoolFeePaymentsDeadlineDay}`)) {
    errors.schoolFeePaymentsDeadlineDay = formatMessage(messages.mustBeValidNumber);
  } else if (parseInt(values.schoolFeePaymentsDeadlineDay) < 1) {
    errors.schoolFeePaymentsDeadlineDay = formatMessage(messages.mustBeValidNumber);
  }

  if (!values.checkingSchoolFeePaymentsDay) {
    errors.checkingSchoolFeePaymentsDay = formatMessage(messages.requiredField);
  } else if (!validator.isDecimal(`${values.checkingSchoolFeePaymentsDay}`)) {
    errors.checkingSchoolFeePaymentsDay = formatMessage(messages.mustBeValidNumber);
  } else if (parseInt(values.checkingSchoolFeePaymentsDay) < 1) {
    errors.checkingSchoolFeePaymentsDay = formatMessage(messages.mustBeValidNumber);
  }

  return errors;
};

export class UserPaymentsSettings extends Component {

  static propTypes = {
    userPayments: PropTypes.object,
    change: PropTypes.func.isRequired,
    paymentsSelection: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  }

  componentWillUnmount(){
    const { closeUserPaymentsSettings } = this.props;

    closeUserPaymentsSettings();
  }

  renderInput(data) {
    const { input, disabled, label, type, meta: { asyncValidating, touched, error, pristine } } = data;

    return (
      <div
        className={`form-group ${touched && error && (!pristine || !input.value) ? 'has-error' : ''}`}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <label className="col-sm-4 control-label">
          {label}
        </label>
        <div className={`col-sm-3 ${asyncValidating ? 'async-validating' : ''}`} style={{ maxWidth: '8em' }}>
          <input
            {...input}
            readOnly={data.readOnly}
            type={type}
            disabled={disabled}
            className={type !== 'checkbox' ? 'form-control' : 'checkbox'}
            id={input.name}
          />
        </div>
        {pristine && input.value ?
            ''
            :
            <div className="has-error">
              {touched && error && <label>{error}</label>}
            </div>
          }
      </div>
    );
  }

  render() {
    const {
      updateUserPaymentSettings,
      handleSubmit,
      userId,
      disableSchoolFeePayments,
    } = this.props;

    const { formatMessage } = this.props.intl;

    return (
      <div className="row">
        <div className="col-md-12">
          <form className="form-horizontal" onSubmit={handleSubmit((data) => updateUserPaymentSettings(data, userId))}>
            <Field
              name="generationSchoolFeeDay"
              component={this.renderInput}
              disabled={disableSchoolFeePayments}
              normalize={value => value ? parseInt(value, 10) : ''}
              label={`${formatMessage(messages.generationSchoolFeeDay)}*:`}
            />
          
            <Field
              name="checkingSchoolFeePaymentsDay"
              component={this.renderInput}
              disabled={disableSchoolFeePayments}
              normalize={value => value ? parseInt(value, 10) : ''}
              label={`${formatMessage(messages.checkingSchoolFeePaymentsDay)}*:`}
            />

            <Field
              name="schoolFeePaymentsDeadlineDay"
              component={this.renderInput}
              disabled={disableSchoolFeePayments}
              normalize={value => value ? parseInt(value, 10) : ''}
              label={`${formatMessage(messages.schoolFeePaymentsDeadlineDay)}*:`}
            />

            <Field
              name="disableEmailNotifications"
              component={this.renderInput}
              type="checkbox"
              label={`${formatMessage(messages.disableEmailNotifications)}*:`}
            />

            <Field
              name="disableSchoolFeePayments"
              component={this.renderInput}
              type="checkbox"
              label={`${formatMessage(messages.disableSchoolFeePayments)}*:`}
            />

            <button className="btn btn-primary" type="submit">
              <FormattedMessage {...messages.save} />
            </button>
          </form>
          <div className="clearfix"></div>
        </div>
      </div>
    );
  }
}

UserPaymentsSettings = reduxForm({
  form: 'UserPaymentsSettings',
})(UserPaymentsSettings);

UserPaymentsSettings = injectIntl(UserPaymentsSettings);

const selector = formValueSelector('UserPaymentsSettings');

export default connect(state => ({
  disableSchoolFeePayments: selector(state, 'disableSchoolFeePayments'),
  initialValues: state.users.paymentsSettings.get('data').toObject(),
}), paymentsActions)(UserPaymentsSettings);

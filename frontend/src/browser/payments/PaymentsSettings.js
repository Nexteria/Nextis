import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import validator from 'validator';
import setMonth from 'date-fns/set_month';
import format from 'date-fns/format';


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


class PaymentsSettings extends Component {

  static propTypes = {
    paymentsSettings: PropTypes.object,
  };

  renderInput(data) {
    const { input, label, type, meta: { asyncValidating, touched, error, pristine } } = data;

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

  renderMonthsSelector(data) {
    const { input, label, type, meta: { asyncValidating, touched, error, pristine } } = data;
    const now = new Date();

    return (
      <div
        className={`form-group ${touched && error && (!pristine || !input.value) ? 'has-error' : ''}`}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <label className="col-sm-4 control-label">
          {label}
        </label>
        <div className={`col-sm-3 ${asyncValidating ? 'async-validating' : ''}`} style={{ maxWidth: '8em' }}>
          <div className="form-group">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => {
            return (
              <div className="checkbox" key={month}>
                <label>
                  <input
                    value={month}
                    type="checkbox"
                    checked={input.value.has(month)}
                    onChange={(e) => {
                      const position = input.value.has(month);
                      let result = input.value;

                      if (input.value.has(month)) {
                        result = input.value.remove(month);
                      } else {
                        result = input.value.set(month, true);
                      }

                      input.onChange(result);
                    }}
                  />
                  {format(setMonth(now, month), 'MMMM')}
                </label>
              </div>
            );
          })}
          </div>
          {pristine && input.value ?
            ''
            :
            <div className="has-error">
              {touched && error && <label>{error}</label>}
            </div>
          }
        </div>
      </div>
    );
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit, updateGlobalPaymentSettings } = this.props;

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="nav-tabs-custom">
            <div className="tab-content">
              <div className="tab-pane active" id="settings">
                <form className="form-horizontal" onSubmit={handleSubmit((data) => updateGlobalPaymentSettings(data))}>
                  <Field
                    name="generationSchoolFeeDay"
                    component={this.renderInput}
                    normalize={value => value ? parseInt(value, 10) : ''}
                    label={`${formatMessage(messages.generationSchoolFeeDay)}*:`}
                  />
                
                  <Field
                    name="checkingSchoolFeePaymentsDay"
                    component={this.renderInput}
                    normalize={value => value ? parseInt(value, 10) : ''}
                    label={`${formatMessage(messages.checkingSchoolFeePaymentsDay)}*:`}
                  />

                  <Field
                    name="schoolFeePaymentsDeadlineDay"
                    component={this.renderInput}
                    normalize={value => value ? parseInt(value, 10) : ''}
                    label={`${formatMessage(messages.schoolFeePaymentsDeadlineDay)}*:`}
                  />

                  <Field
                    name="schoolFeeApplicableMonths"
                    component={this.renderMonthsSelector}
                    label={`${formatMessage(messages.schoolFeeApplicableMonths)}:`}
                  />

                  <button className="btn btn-primary" type="submit">
                    <FormattedMessage {...messages.save} />
                  </button>
                </form>
                <div className="clearfix"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PaymentsSettings = reduxForm({
  form: 'paymentsSettings',
  validate,
})(PaymentsSettings);

PaymentsSettings = injectIntl(PaymentsSettings);

export default connect(state => ({
  initialValues: state.payments.paymentsSettings.toObject(),
}), paymentsActions)(PaymentsSettings);

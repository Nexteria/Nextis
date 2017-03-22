import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import validator from 'validator';


import * as actions from '../../common/events/actions';

const messages = defineMessages({
  feedbackRemainderDaysBefore: {
    defaultMessage: 'How many days before feedback deadline should be remainder sent',
    id: 'payments.manage.settings.feedbackRemainderDaysBefore',
  },
  feedbackDaysToFill: {
    defaultMessage: 'How many days has user to fill feedback',
    id: 'payments.manage.settings.feedbackDaysToFill',
  },
  save: {
    defaultMessage: 'Save',
    id: 'events.manage.settings.save',
  },
  feedbackEmailDelay: {
    defaultMessage: 'How many days after event should be send feedback email',
    id: 'events.manage.settings.feedbackEmailDelay',
  },
  requiredField: {
    defaultMessage: 'This field is required',
    id: 'events.manage.settings.requiredField',
  },
  mustBeValidNumber: {
    defaultMessage: 'This field must be valid positive number',
    id: 'events.manage.settings.mustBeValidNumber',
  },
});

const validate = (values, props) => {
  const { formatMessage } = props.intl;

  const errors = {};

  if (!values.feedbackEmailDelay) {
    errors.feedbackEmailDelay = formatMessage(messages.requiredField);
  } else if (!validator.isDecimal(`${values.feedbackEmailDelay}`)) {
    errors.feedbackEmailDelay = formatMessage(messages.mustBeValidNumber);
  } else if (parseInt(values.feedbackEmailDelay) < 1) {
    errors.feedbackEmailDelay = formatMessage(messages.mustBeValidNumber);
  }

  if (!values.feedbackDaysToFill) {
    errors.feedbackDaysToFill = formatMessage(messages.requiredField);
  } else if (!validator.isDecimal(`${values.feedbackDaysToFill}`)) {
    errors.feedbackDaysToFill = formatMessage(messages.mustBeValidNumber);
  } else if (parseInt(values.feedbackDaysToFill) < 1) {
    errors.feedbackDaysToFill = formatMessage(messages.mustBeValidNumber);
  }

  if (!values.feedbackRemainderDaysBefore) {
    errors.feedbackRemainderDaysBefore = formatMessage(messages.requiredField);
  } else if (!validator.isDecimal(`${values.feedbackRemainderDaysBefore}`)) {
    errors.feedbackRemainderDaysBefore = formatMessage(messages.mustBeValidNumber);
  } else if (parseInt(values.feedbackRemainderDaysBefore) < 1) {
    errors.feedbackRemainderDaysBefore = formatMessage(messages.mustBeValidNumber);
  }

  return errors;
};


class EventsDefaultSettings extends Component {

  static propTypes = {
    EventsDefaultSettings: PropTypes.object,
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

  render() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit, updateEventsDefaultSettings } = this.props;

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="nav-tabs-custom">
            <div className="tab-content">
              <div className="tab-pane active" id="settings">
                <form className="form-horizontal" onSubmit={handleSubmit((data) => updateEventsDefaultSettings(data))}>
                  <Field
                    name="feedbackEmailDelay"
                    component={this.renderInput}
                    normalize={value => value ? parseInt(value, 10) : ''}
                    label={`${formatMessage(messages.feedbackEmailDelay)}*:`}
                  />
                
                  <Field
                    name="feedbackDaysToFill"
                    component={this.renderInput}
                    normalize={value => value ? parseInt(value, 10) : ''}
                    label={`${formatMessage(messages.feedbackDaysToFill)}*:`}
                  />

                  <Field
                    name="feedbackRemainderDaysBefore"
                    component={this.renderInput}
                    normalize={value => value ? parseInt(value, 10) : ''}
                    label={`${formatMessage(messages.feedbackRemainderDaysBefore)}*:`}
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

EventsDefaultSettings = reduxForm({
  form: 'EventsDefaultSettings',
  validate,
})(EventsDefaultSettings);

EventsDefaultSettings = injectIntl(EventsDefaultSettings);

export default connect(state => ({
  initialValues: state.events.defaultSettings.toObject(),
}), actions)(EventsDefaultSettings);

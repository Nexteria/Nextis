import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import moment from 'moment';
import validator from 'validator';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';


import * as actions from '../../common/events/actions';
import EventSettings from '../../common/events/models/EventSettings';


const messages = defineMessages({
  createSettings: {
    defaultMessage: 'Create custom settings',
    id: 'event.edit.settings.createSettings',
  },
  noCustomEventSettings: {
    defaultMessage: 'Event does not have custom settings',
    id: 'event.edit.settings.noCustomEventSettings',
  },
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
  hostInstructionEmailDaysBefore: {
    defaultMessage: 'How many days before events start should Host get instructions email',
    id: 'events.manage.settings.hostInstructionEmailDaysBefore',
  },
  eventsManagerUserId: {
    defaultMessage: 'Events manager user account',
    id: 'events.manage.settings.eventsManagerUserId',
  },
  eventSignInOpeningManagerNotificationDaysBefore: {
    defaultMessage: 'How many days before first event sign in opening should events manager receive summary email',
    id: 'events.manage.settings.eventSignInOpeningManagerNotificationDaysBefore',
  },
  eventSignInRemainderDaysBefore: {
    defaultMessage: 'How many days before sign in deadline should user get remainer email',
    id: 'events.manage.settings.eventSignInRemainderDaysBefore',
  }
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

  if (!values.hostInstructionEmailDaysBefore) {
    errors.hostInstructionEmailDaysBefore = formatMessage(messages.requiredField);
  } else if (!validator.isDecimal(`${values.hostInstructionEmailDaysBefore}`)) {
    errors.hostInstructionEmailDaysBefore = formatMessage(messages.mustBeValidNumber);
  } else if (parseInt(values.hostInstructionEmailDaysBefore) < 1) {
    errors.hostInstructionEmailDaysBefore = formatMessage(messages.mustBeValidNumber);
  }

  if (!values.eventSignInOpeningManagerNotificationDaysBefore) {
    errors.eventSignInOpeningManagerNotificationDaysBefore = formatMessage(messages.requiredField);
  } else if (!validator.isDecimal(`${values.eventSignInOpeningManagerNotificationDaysBefore}`)) {
    errors.eventSignInOpeningManagerNotificationDaysBefore = formatMessage(messages.mustBeValidNumber);
  } else if (parseInt(values.eventSignInOpeningManagerNotificationDaysBefore) < 1) {
    errors.eventSignInOpeningManagerNotificationDaysBefore = formatMessage(messages.mustBeValidNumber);
  }

  if (!values.eventSignInRemainderDaysBefore) {
    errors.eventSignInRemainderDaysBefore = formatMessage(messages.requiredField);
  } else if (!validator.isDecimal(`${values.eventSignInRemainderDaysBefore}`)) {
    errors.eventSignInRemainderDaysBefore = formatMessage(messages.mustBeValidNumber);
  } else if (parseInt(values.eventSignInRemainderDaysBefore) < 1) {
    errors.eventSignInRemainderDaysBefore = formatMessage(messages.mustBeValidNumber);
  }

  return errors;
};

export class EventSettingsTab extends Component {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    updateEventSettings: PropTypes.func.isRequired,
    eventId: PropTypes.number.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    createEventCustomSettings: PropTypes.func.isRequired,
    eventSettings: PropTypes.object,
  }

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
    const {
      eventSettings,
      createEventCustomSettings,
      handleSubmit,
      updateEventSettings,
      eventId,
    } = this.props;

    const { formatMessage } = this.props.intl;

    return (
      <div className="row">
        <div className="col-md-12">
          {eventSettings.get('data') !== null ?
            <div>
              <form className="form-horizontal" onSubmit={handleSubmit((data) => updateEventSettings(data, eventId))}>
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
                <Field
                  name="hostInstructionEmailDaysBefore"
                  component={this.renderInput}
                  normalize={value => value ? parseInt(value, 10) : ''}
                  label={`${formatMessage(messages.hostInstructionEmailDaysBefore)}*:`}
                />
                <Field
                  name="eventSignInOpeningManagerNotificationDaysBefore"
                  component={this.renderInput}
                  normalize={value => value ? parseInt(value, 10) : ''}
                  label={`${formatMessage(messages.eventSignInOpeningManagerNotificationDaysBefore)}*:`}
                />
                <Field
                  name="eventSignInRemainderDaysBefore"
                  component={this.renderInput}
                  normalize={value => value ? parseInt(value, 10) : ''}
                  label={`${formatMessage(messages.eventSignInRemainderDaysBefore)}*:`}
                />

                <button className="btn btn-primary" type="submit">
                  <FormattedMessage {...messages.save} />
                </button>
              </form>
            </div>
            :
            <div className={'form-group'} style={{ textAlign: 'center' }}>
              <div>
                <label className="control-label">
                  <FormattedMessage {...messages.noCustomEventSettings} />
                </label>
              </div>
              <div>
                <button className="btn btn-info" onClick={createEventCustomSettings}>
                  <FormattedMessage {...messages.createSettings} />
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

EventSettingsTab = reduxForm({
  form: 'EventSettingsTab',
  validate,
})(EventSettingsTab);

EventSettingsTab = injectIntl(EventSettingsTab);

export default connect(state => ({
  initialValues: state.events.eventSettings.get('data') ?
    state.events.eventSettings.get('data').toObject() : new EventSettings().toObject(),
}), actions)(EventSettingsTab);
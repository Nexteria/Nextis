import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import validator from 'validator';
import { WithContext as ReactTags } from 'react-tag-input';


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
  },
  eventManager: {
    defaultMessage: 'Event manager',
    id: 'events.manage.settings.eventManager',
  },
  sentCopyOfAllEventNotificationsToManager: {
    defaultMessage: 'Sent copy of all event notifications to manager',
    id: 'events.manage.settings.sentCopyOfAllEventNotificationsToManager',
  },
});

const validate = (values, props) => {
  const { formatMessage } = props.intl;

  const errors = {};

  if (!values.feedbackEmailDelay) {
    errors.feedbackEmailDelay = formatMessage(messages.requiredField);
  } else if (!validator.isDecimal(`${values.feedbackEmailDelay}`)) {
    errors.feedbackEmailDelay = formatMessage(messages.mustBeValidNumber);
  } else if (parseInt(values.feedbackEmailDelay, 10) < 1) {
    errors.feedbackEmailDelay = formatMessage(messages.mustBeValidNumber);
  }

  if (!values.feedbackDaysToFill) {
    errors.feedbackDaysToFill = formatMessage(messages.requiredField);
  } else if (!validator.isDecimal(`${values.feedbackDaysToFill}`)) {
    errors.feedbackDaysToFill = formatMessage(messages.mustBeValidNumber);
  } else if (parseInt(values.feedbackDaysToFill, 10) < 1) {
    errors.feedbackDaysToFill = formatMessage(messages.mustBeValidNumber);
  }

  if (!values.feedbackRemainderDaysBefore) {
    errors.feedbackRemainderDaysBefore = formatMessage(messages.requiredField);
  } else if (!validator.isDecimal(`${values.feedbackRemainderDaysBefore}`)) {
    errors.feedbackRemainderDaysBefore = formatMessage(messages.mustBeValidNumber);
  } else if (parseInt(values.feedbackRemainderDaysBefore, 10) < 1) {
    errors.feedbackRemainderDaysBefore = formatMessage(messages.mustBeValidNumber);
  }

  if (!values.hostInstructionEmailDaysBefore) {
    errors.hostInstructionEmailDaysBefore = formatMessage(messages.requiredField);
  } else if (!validator.isDecimal(`${values.hostInstructionEmailDaysBefore}`)) {
    errors.hostInstructionEmailDaysBefore = formatMessage(messages.mustBeValidNumber);
  } else if (parseInt(values.hostInstructionEmailDaysBefore, 10) < 1) {
    errors.hostInstructionEmailDaysBefore = formatMessage(messages.mustBeValidNumber);
  }

  if (!values.eventSignInOpeningManagerNotificationDaysBefore) {
    errors.eventSignInOpeningManagerNotificationDaysBefore = formatMessage(messages.requiredField);
  } else if (!validator.isDecimal(`${values.eventSignInOpeningManagerNotificationDaysBefore}`)) {
    errors.eventSignInOpeningManagerNotificationDaysBefore = formatMessage(messages.mustBeValidNumber);
  } else if (parseInt(values.eventSignInOpeningManagerNotificationDaysBefore, 10) < 1) {
    errors.eventSignInOpeningManagerNotificationDaysBefore = formatMessage(messages.mustBeValidNumber);
  }

  if (!values.eventSignInRemainderDaysBefore) {
    errors.eventSignInRemainderDaysBefore = formatMessage(messages.requiredField);
  } else if (!validator.isDecimal(`${values.eventSignInRemainderDaysBefore}`)) {
    errors.eventSignInRemainderDaysBefore = formatMessage(messages.mustBeValidNumber);
  } else if (parseInt(values.eventSignInRemainderDaysBefore, 10) < 1) {
    errors.eventSignInRemainderDaysBefore = formatMessage(messages.mustBeValidNumber);
  }

  if ('undefined' === typeof values.sentCopyOfAllEventNotificationsToManager) {
    errors.sentCopyOfAllEventNotificationsToManager = formatMessage(messages.requiredField);
  }

  if (!values.eventsManagerUserId) {
    errors.eventsManagerUserId = formatMessage(messages.requiredField);
  }

  return errors;
};


class EventsDefaultSettings extends Component {

  static propTypes = {
    EventsDefaultSettings: PropTypes.object,
    fetchDefaultEventsSettings: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
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

  renderUserPicker(data) {
    const { input, label, users, meta: { touched, error } } = data;

    const user = users.find(user => user.id === input.value);

    return (
      <div className={`form-group ${touched && error ? 'has-error' : ''}`}>
        <label className="col-sm-2 control-label">
          {label}
        </label>

        <div className={`col-sm-10 ${input.value ? 'disabled-host' : ''}`}>
          <ReactTags
            id={input.name}
            placeholder={label}
            tags={user ? [{ id: user.id, text: `${user.firstName} ${user.lastName}` }] : []}
            suggestions={users.map(user => `${user.firstName} ${user.lastName} (${user.username})`).toArray()}
            handleDelete={() => input.onChange(null)}
            handleAddition={(tag) => input.onChange(users.find(user => `${user.firstName} ${user.lastName} (${user.username})` === tag).id)}
          />
          <div className="has-error col-md-12" style={{ paddingLeft: '0px' }}>
            {touched && error && <label>{error}</label>}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit, users, updateEventsDefaultSettings } = this.props;

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

                  <Field
                    name="eventsManagerUserId"
                    component={this.renderUserPicker}
                    normalize={value => value ? parseInt(value, 10) : ''}
                    label={`${formatMessage(messages.eventManager)}*:`}
                    users={users}
                  />

                  <Field
                    name="sentCopyOfAllEventNotificationsToManager"
                    component={this.renderInput}
                    label={`${formatMessage(messages.sentCopyOfAllEventNotificationsToManager)}*:`}
                    type={'checkbox'}
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
  users: state.users.users,
}), actions)(EventsDefaultSettings);

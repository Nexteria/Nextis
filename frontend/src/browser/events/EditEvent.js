import Component from 'react-pure-render/component';
import { Map, List } from 'immutable';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { WithContext as ReactTags } from 'react-tag-input';
import Datetime from 'react-datetime';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import validator from 'validator';
import isAfter from 'date-fns/is_after';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';


import { fields } from '../../common/lib/redux-fields/index';
import TextEditor from '../components/TextEditor';
import FormBuilder, { createInitialState } from '../components/Forms/Builder/Form';
import * as fieldsActions from '../../common/lib/redux-fields/actions';
import * as attendeesGroupActions from '../../common/attendeesGroup/actions';
import * as eventActions from '../../common/events/actions';
import './EditEvent.scss';
import Event from '../../common/events/models/Event';
import AttendeesGroupsDialog from './attendeesGroups/AttendeesGroupsDialog';
import InvitedTab from './InvitedTab';
import EmailsTab from './EmailsTab';
import EventSettingsTab from './EventSettingsTab';
import FormResults from '../components/Forms/Results/FormResults';

const messages = defineMessages({
  invited: {
    defaultMessage: 'Attendees',
    id: 'event.edit.attendeesTab',
  },
  emails: {
    defaultMessage: 'Emails',
    id: 'event.edit.emails',
  },
  settings: {
    defaultMessage: 'Settings',
    id: 'event.edit.settings',
  },
  eventName: {
    defaultMessage: 'Event name',
    id: 'event.edit.eventName',
  },
  exclusionaryEvents: {
    defaultMessage: 'The exclusionary the events',
    id: 'event.edit.exclusionaryEvents',
  },
  save: {
    defaultMessage: 'Save',
    id: 'event.edit.save',
  },
  activityPoints: {
    defaultMessage: 'Activity points',
    id: 'event.edit.activityPoints',
  },
  host: {
    defaultMessage: 'Host',
    id: 'event.edit.host',
  },
  lectors: {
    defaultMessage: 'Lectors',
    id: 'event.edit.lectors',
  },
  eventStartDateTime: {
    defaultMessage: 'Event start date',
    id: 'event.edit.eventStartDateTime',
  },
  eventEndDateTime: {
    defaultMessage: 'Event end date',
    id: 'event.edit.eventEndDateTime',
  },
  minCapacity: {
    defaultMessage: 'Min capacity',
    id: 'event.edit.minCapacity',
  },
  maxCapacity: {
    defaultMessage: 'Max capacity',
    id: 'event.edit.maxCapacity',
  },
  attendeesGroups: {
    defaultMessage: 'Attendees groups',
    id: 'event.edit.attendeesGroups',
  },
  description: {
    defaultMessage: 'Description',
    id: 'event.edit.description',
  },
  addLectors: {
    defaultMessage: 'Add new lector',
    id: 'event.edit.addLectors',
  },
  eventDescription: {
    defaultMessage: 'Event description ...',
    id: 'event.edit.eventDescription',
  },
  addHost: {
    defaultMessage: 'Add host ...',
    id: 'event.edit.addHost',
  },
  attendeeGroupName: {
    defaultMessage: 'Attendee group name',
    id: 'event.edit.attendeeGroupName',
  },
  noAttendeesGroups: {
    defaultMessage: 'There are no attendees groups! Nobody will be able to sign in!',
    id: 'event.edit.noAttendeesGroups',
  },
  shortDescription: {
    defaultMessage: 'Event short description',
    id: 'event.edit.shortDescription',
  },
  eventType: {
    defaultMessage: 'Type',
    id: 'event.edit.eventType',
  },
  chooseEventType: {
    defaultMessage: 'Choose event type',
    id: 'event.edit.chooseEventType',
  },
  eventType_dbk: {
    defaultMessage: 'DBK',
    id: 'event.edit.eventType_dbk',
  },
  eventType_ik: {
    defaultMessage: 'IK',
    id: 'event.edit.eventType_ik',
  },
  eventType_other: {
    defaultMessage: 'Other',
    id: 'event.edit.eventType_other',
  },
  eventStatus: {
    defaultMessage: 'Event status',
    id: 'event.edit.eventStatus',
  },
  curriculumLevel: {
    defaultMessage: 'Curriculum level',
    id: 'event.edit.curriculumLevel',
  },
  noCurriculumLevel: {
    defaultMessage: 'Do no include in curriculum',
    id: 'event.edit.noCurriculumLevel',
  },
  eventLocation: {
    defaultMessage: 'Location',
    id: 'event.edit.eventLocation',
  },
  chooseEventLocation: {
    defaultMessage: 'Choose event location',
    id: 'event.edit.chooseEventLocation',
  },
  requiredField: {
    defaultMessage: 'This field is required',
    id: 'event.edit.requiredField',
  },
  minCapacityMustBeSE: {
    defaultMessage: 'Min capacity must be smaller or equal max capacity!',
    id: 'event.edit.minCapacityMustBeSE',
  },
  maxCapacityMustBeGE: {
    defaultMessage: 'Max capacity must be greater or equal min capacity!',
    id: 'event.edit.maxCapacityMustBeGE',
  },
  mustBeValidNumber: {
    defaultMessage: 'This field must be valid number',
    id: 'event.edit.mustBeValidNumber',
  },
  dateShouldBeInFuture: {
    defaultMessage: 'This date should be in future',
    id: 'event.edit.dateShouldBeInFuture',
  },
  startDateMustBeBeforeEndDate: {
    defaultMessage: 'Start date must be before end date!',
    id: 'event.edit.startDateMustBeBeforeEndDate',
  },
  endDateMustBeAfterStartDate: {
    defaultMessage: 'End date must be after start date!',
    id: 'event.edit.endDateMustBeAfterStartDate',
  },
  requiredLengthField: {
    defaultMessage: 'This field is required, please type {characters} more.',
    id: 'event.edit.requiredLengthField',
  },
  feedbackLink: {
    defaultMessage: 'Feedback link',
    id: 'event.edit.feedbackLink',
  },
  details: {
    defaultMessage: 'Details',
    id: 'event.edit.details',
  },
  dependencies: {
    defaultMessage: 'Dependencies',
    id: 'event.edit.dependencies',
  },
  groupedEvents: {
    defaultMessage: 'Grouped events',
    id: 'event.edit.groupedEvents',
  },
  mandatoryParticipation: {
    defaultMessage: 'Mandatory participation',
    id: 'event.edit.mandatoryParticipation',
  },
  semester: {
    defaultMessage: 'Semester',
    id: 'event.edit.semester',
  },
  noSemester: {
    defaultMessage: 'Not in semester',
    id: 'event.edit.noSemester',
  },
  publicFeedbackLink: {
    defaultMessage: 'Public link for respondents',
    id: 'event.edit.publicFeedbackLink',
  },
});

const validate = (values, props) => {
  const { formatMessage } = props.intl;

  const errors = {};
  if (!values.name) {
    errors.name = formatMessage(messages.requiredField);
  }

  if (!values.nxLocationId) {
    errors.nxLocationId = formatMessage(messages.requiredField);
  }

  if (!values.activityPoints) {
    errors.activityPoints = formatMessage(messages.requiredField);
  } else if (!validator.isDecimal(`${values.activityPoints}`)) {
    errors.activityPoints = formatMessage(messages.mustBeValidNumber);
  } else if (values.activityPoints < 0) {
    errors.activityPoints = formatMessage(messages.mustBeValidNumber);
  }

  if (!values.eventType) {
    errors.eventType = formatMessage(messages.requiredField);
  }

  if (!values.hostId) {
    errors.hostId = formatMessage(messages.requiredField);
  }

  if (!values.feedbackLink) {
    errors.feedbackLink = formatMessage(messages.requiredField);
  }

  if (!values.attendeesGroups || values.attendeesGroups.size === 0) {
    errors.attendeesGroups = formatMessage(messages.noAttendeesGroups);
  }

  if (!values.eventStartDateTime) {
    errors.eventStartDateTime = formatMessage(messages.requiredField);
  } else if (values.eventEndDateTime && isAfter(values.eventStartDateTime, values.eventEndDateTime)) {
    errors.eventStartDateTime = formatMessage(messages.startDateMustBeBeforeEndDate);
  }

  if (!values.eventEndDateTime) {
    errors.eventEndDateTime = formatMessage(messages.requiredField);
  } else if (values.eventStartDateTime && isAfter(values.eventStartDateTime, values.eventEndDateTime)) {
    errors.eventEndDateTime = formatMessage(messages.endDateMustBeAfterStartDate);
  }

  if (!values.minCapacity) {
    errors.minCapacity = formatMessage(messages.requiredField);
  } else if (values.maxCapacity && parseInt(values.minCapacity) > parseInt(values.maxCapacity)){
    errors.minCapacity = formatMessage(messages.minCapacityMustBeSE);
  }

  if (!values.maxCapacity) {
    errors.maxCapacity = formatMessage(messages.requiredField);
  } else if (values.minCapacity && parseInt(values.minCapacity) > parseInt(values.maxCapacity)){
    errors.maxCapacity = formatMessage(messages.maxCapacityMustBeGE);
  }

  const shortDescriptionLength = values.shortDescription ?
      values.shortDescription.getEditorState().getCurrentContent().getPlainText().length
      : 0;
    if (shortDescriptionLength < 150) {
      errors.shortDescription = formatMessage(messages.requiredLengthField, { characters: 150 - shortDescriptionLength });
    }

  return errors;
};

const warn = (values, props) => {
  const { formatMessage } = props.intl;
  const warnings = {};
  if (isAfter(new Date(), values.eventEndDateTime) && !values.id) {
    warnings.eventEndDateTime = formatMessage(messages.dateShouldBeInFuture);
  }

  if (isAfter(new Date(), values.eventStartDateTime) && !values.id) {
    warnings.eventStartDateTime = formatMessage(messages.dateShouldBeInFuture);
  }

  return warnings;
};

export class EditEvent extends Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    title: PropTypes.object,
    event: PropTypes.object,
    events: PropTypes.object.isRequired,
    saveEvent: PropTypes.func.isRequired,
    setField: PropTypes.func,
    locale: PropTypes.string,
    addAttendeesGroup: PropTypes.func.isRequired,
    editAttendeesGroup: PropTypes.func.isRequired,
    rolesList: PropTypes.object,
    params: PropTypes.object,
    users: PropTypes.object,
    intl: PropTypes.object.isRequired,
    eventsStatuses: PropTypes.object.isRequired,
    studentLevels: PropTypes.object.isRequired,
    locations: PropTypes.object.isRequired,
    activeSemesterId: PropTypes.number,
    eventSettings: PropTypes.object,
    createEventCustomSettings: PropTypes.func.isRequired,
    clearEventCustomSettings: PropTypes.func.isRequired,
    loadEventCustomSettings: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    changeAttendeeFeedbackStatus: PropTypes.func.isRequired,
    changeAttendeePresenceStatus: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const {
      setField,
      initialize,
      activeSemesterId,
      events,
      event,
      params,
      loadEventCustomSettings,
    } = this.props;

    const eventId = params ? parseInt(params.eventId, 10) : null;
    let activeEvent = event;

    if (eventId) {
      activeEvent = events.get(eventId);
    }

    const newEvent = new Event().set('semester', activeSemesterId);

    setField(['editEvent'], activeEvent ? activeEvent : newEvent);
    initialize(activeEvent ? activeEvent.toObject() : newEvent.toObject());
    loadEventCustomSettings(eventId);
  }

  componentWillUnmount() {
    const { clearEventCustomSettings } = this.props;
    clearEventCustomSettings();
  }

  renderInput(data) {
    const { input, label, type, meta: { asyncValidating, touched, error, pristine } } = data;

    return (
      <div
        className={`form-group ${touched && error ? 'has-error' : ''}`}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <label className="col-sm-2 control-label">
          {label}
        </label>
        <div className={`col-sm-10 ${asyncValidating ? 'async-validating' : ''}`}>
          <input
            {...input}
            readOnly={data.readOnly}
            placeholder={label}
            type={type}
            className={type !== 'checkbox' ? 'form-control' : 'checkbox'}
            id={input.name}
          />
          <div className="has-error">
            {touched && error && <label>{error}</label>}
          </div>
        </div>
      </div>
    );
  }

  renderSelect(data) {
    const { input, label, children, meta: { touched, error } } = data;

    return (
      <div className={`form-group ${touched && error ? 'has-error' : ''}`}>
        <label className="col-sm-2 control-label">
          {label}
        </label>
        <div className="col-sm-10">
          <select
            {...input}
            className="form-control"
          >
          {children}
          </select>
          <div className="has-error">
            {touched && error && <label>{error}</label>}
          </div>
        </div>
      </div>
    );
  }

  renderHost(data) {
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
            tags={user ? [{id: user.id, text: `${user.firstName} ${user.lastName}`}] : []}
            suggestions={users.map(user => `${user.firstName} ${user.lastName} (${user.username})`).toArray()}
            handleDelete={(i) => input.onChange(null)}
            handleAddition={(tag) => input.onChange(users.find(user => `${user.firstName} ${user.lastName} (${user.username})` === tag).id)}
          />
          <div className="has-error col-md-12" style={{paddingLeft: '0px'}}>
            {touched && error && <label>{error}</label>}
          </div>
        </div>
      </div>
    )
  }

  renderLectors(data) {
    const { input, label, rolesList, users, meta: { touched, error } } = data;

    const lectors = input.value.map(userId => {
      const lector = users.filter(user => user.id === userId).first();
      return {
        id: lector.id,
        text: `${lector.firstName} ${lector.lastName}`,
      };
    });

    return (
      <div className={`form-group ${touched && error ? 'has-error' : ''}`}>
        <label className="col-sm-2 control-label">
          {label}
        </label>

        <div className="col-sm-10">
          <ReactTags
            id={input.name}
            placeholder={label}
            tags={lectors.toArray()}
            suggestions={users.filter(user => user.roles.includes(rolesList.get('LECTOR').id) && !input.value.includes(user.id)).map(user => `${user.firstName} ${user.lastName} (${user.username})`).toArray()}
            handleDelete={(i) => input.onChange(input.value.delete(i))}
            handleAddition={(tag) => input.onChange(input.value.push(users.find(user => `${user.firstName} ${user.lastName} (${user.username})` === tag).id))}
          />
        </div>
      </div>
    )
  }

  renderEventsTagSelector(data) {
    const { input, label, events, actualEventId, meta: { touched, error } } = data;

    const selectedEvents = input.value.map(eventId => {
      const event = events.filter(e => e.id === eventId).first();
      return {
        id: event.id,
        text: event.name,
      };
    });

    return (
      <div className={`form-group ${touched && error ? 'has-error' : ''}`}>
        <label className="col-sm-2 control-label">
          {label}
        </label>

        <div className="col-sm-10">
          <ReactTags
            id={input.name}
            placeholder={label}
            tags={selectedEvents.toArray()}
            suggestions={events.filter(event => event.id !== actualEventId && !input.value.includes(event.id)).map(event => event.name).toArray()}
            handleDelete={(i) => input.onChange(input.value.delete(i))}
            handleAddition={(tag) => input.onChange(input.value.push(events.find(event => event.name === tag).id))}
          />
        </div>
      </div>
    )
  }

  renderDate(data) {
    const { input, label, locale, meta: { touched, error, warning } } = data;

    return (
      <div className={'form-group'}>
        <label className="col-sm-2 control-label">
          {label}
        </label>

        <div className="col-sm-10">
          <Datetime
            inputProps={{ id: input.name }}
            locale={locale}
            value={input.value}
            onBlur={input.onBlur}
            onChange={(moment) => input.onChange(moment)}
          />
          {touched && error ?
            <div style={{ marginLeft: 0, marginBottom: 0 }} className="form-group  has-error">
              {touched && error && <label>{error}</label>}
            </div>
            : null
          }
          {touched && warning ?
            <div style={{ marginLeft: 0, marginBottom: 0 }} className="form-group has-warning">
              {touched && warning && <label>{warning}</label>}
            </div>
            : null
          }
        </div>
      </div>
    );
  }

  renderSelect(data) {
    const { input, label, children, meta: { touched, error } } = data;

    return (
      <div className={`form-group ${touched && error ? 'has-error' : ''}`}>
        <label className="col-sm-2 control-label">
          {label}
        </label>
        <div className="col-sm-10">
          <select
            {...input}
            className="form-control"
          >
          {children}
          </select>
          <div className="has-error">
            {touched && error && <label>{error}</label>}
          </div>
        </div>
      </div>
    );
  }

  renderAttendeesGroups(data) {
    const { input, addAttendeesGroup, actualEvent, editAttendeesGroup, emptyLabel, label, meta: { touched, error } } = data;

    return (
      <div className={`form-group attendees-groups ${touched && error ? 'has-error' : ''}`}>
        <label className="col-sm-2 control-label">
          {label}
        </label>

        <div className="col-sm-10">
          <div className="form-control add-group-button">
            <i className="fa fa-plus text-green" onClick={addAttendeesGroup}></i>
          </div>
          <ul className="nav nav-pills nav-stacked">
            {input.value ?
              input.value.map((group, index) =>
                <li key={index} className="active">
                  <a><i className="fa fa-users"></i> {group.name}
                    <span className="action-buttons pull-right">
                      <span className="label">
                        <span className="confirmed-will-come">{group.users.filter(user => user.get('signedIn')).size}</span>
                        <span> / </span>
                        <span className="confirmed-wont-come">{group.users.filter(user => user.get('signedOut') || user.get('wontGo')).size}</span>
                        <span> / </span>
                        <span className="total">{group.users.size}</span>
                      </span>
                      <i
                        className="fa fa-trash-o trash-group"
                        onClick={() => input.onChange(input.value.delete(index))}
                      ></i>
                      <i
                        className="fa fa-pencil"
                        onClick={() => editAttendeesGroup(group, index)}
                      ></i>
                    </span>
                  </a>
                </li>
              )
              : ''
            }
          </ul>
          <div className="has-error">
            {touched && error && <label>{error}</label>}
          </div>
        </div>
        <AttendeesGroupsDialog actualEvent={actualEvent} onSave={input.onChange} eventGroups={input.value}/>
      </div>
    );
  }

  renderQuestionForm(data) {
    const { input, label, event } = data;

    return (
      <div className="form-group">
        <label className="col-sm-2 control-label">
          {label}
        </label>
        <div className="col-sm-10">
          <div className="form-control" style={{ border: 'none' }}>
            {!input.value ?
              <i
                className="fa fa-plus text-green"
                onClick={() => input.onChange(createInitialState())}
                style={{ cursor: 'pointer' }}
              ></i>
              :
              <div>
                <FormBuilder form={input.value} attendeesGroups={event.get('attendeesGroups')} onChange={input.onChange} />
                <button
                  className="btn btn-xs btn-success"
                  type="button"
                  onClick={() => input.onChange(input.value.set('isOpen', true))}
                >Editovať</button>
                <button
                  className="btn btn-xs btn-danger"
                  type="button"
                  style={{ marginLeft: '1em' }}
                  onClick={() => input.onChange(null)}
                >Zmazať</button>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { fields, groupedEvents, actualEvent, pristine, submitting, events, locations, actualEventId, eventTypes, studentLevels, eventsStatuses, rolesList, title, users, locale } = this.props;
    const {
      saveEvent,
      setField,
      handleSubmit,
      semesters,
      addAttendeesGroup,
      editAttendeesGroup,
      eventSettings,
      createEventCustomSettings,
      changeAttendeeFeedbackStatus,
      changeAttendeePresenceStatus,
    } = this.props;

    const { formatMessage } = this.props.intl;

    if (!fields.description.value || !rolesList) {
      return <div></div>;
    }

    const lectors = users.filter(user => fields.lectors.value.includes(user.id))
      .map(user => ({ id: user.id, text: `${user.firstName} ${user.lastName}` }));

    let host = users.get(fields.hostId.value);
    if (host) {
      host = [{ id: host.id, text: `${host.firstName} ${host.lastName}` }];
    } else {
      host = [];
    }

    return (
      <div>
        <section className="content-header">
          <h1>{title}</h1>
        </section>

        <section className="content">
          <div className="row">
            <div className="col-md-12">
              <Tabs
                mountOnEnter
                animation
                defaultActiveKey={1}
                id="event-dependencies"
                className="nav-tabs-custom"
              >
                <Tab eventKey={1} title={formatMessage(messages.details)}>
                  <form className="form-horizontal" onSubmit={handleSubmit((data) => saveEvent(data))}>
                    <div className="nav-tabs-custom">
                      <div className="tab-content">
                        <div className="tab-pane active" id="settings">
                          <Field
                            name="name"
                            type="text"
                            component={this.renderInput}
                            label={`${formatMessage(messages.eventName)}*`}
                          />

                          <Field
                            name="activityPoints"
                            type="text"
                            component={this.renderInput}
                            label={`${formatMessage(messages.activityPoints)}*`}
                          />

                          <Field
                            name="eventType"
                            component={this.renderSelect}
                            label={`${formatMessage(messages.eventType)}*`}
                          >
                            <option readOnly>{formatMessage(messages.chooseEventType)}</option>
                            {eventTypes.valueSeq().map(type =>
                              <option key={type} value={type}>{formatMessage(messages[`eventType_${type}`])}</option>
                            )}
                          </Field>

                          <Field
                            name="questionForm"
                            component={this.renderQuestionForm}
                            label="Dotazník pri prihlasovaní"
                            event={actualEvent}
                          />

                          <Field
                            name="nxLocationId"
                            component={this.renderSelect}
                            label={`${formatMessage(messages.eventLocation)}*`}
                          >
                            <option readOnly>{formatMessage(messages.chooseEventLocation)}</option>
                            {locations.valueSeq().map(location =>
                              <option key={location.id} value={location.id}>
                              {`${location.name} (${location.addressLine1}`}
                              {`${location.addressLine2 ? `, ${location.addressLine2}` : ''}`}
                              {`, ${location.city}, ${location.zipCode}, ${location.countryCode})`}
                              </option>
                            )}
                          </Field>

                          <Field
                            name="hostId"
                            component={this.renderHost}
                            label={`${formatMessage(messages.host)}*`}
                            users={users}
                          />

                          <Field
                            name="lectors"
                            component={this.renderLectors}
                            label={`${formatMessage(messages.lectors)}`}
                            users={users}
                            rolesList={rolesList}
                          />

                          <Field
                            name="eventStartDateTime"
                            component={this.renderDate}
                            label={`${formatMessage(messages.eventStartDateTime)}*`}
                            locale={locale}
                          />

                          <Field
                            name="eventEndDateTime"
                            component={this.renderDate}
                            label={`${formatMessage(messages.eventEndDateTime)}*`}
                            locale={locale}
                          />

                          <Field
                            name="minCapacity"
                            component={this.renderInput}
                            label={`${formatMessage(messages.minCapacity)}*`}
                          />

                          <Field
                            name="maxCapacity"
                            component={this.renderInput}
                            label={`${formatMessage(messages.maxCapacity)}*`}
                          />

                          <Field
                            name="mandatoryParticipation"
                            component={this.renderInput}
                            type="checkbox"
                            label={`${formatMessage(messages.mandatoryParticipation)}`}
                          />

                          <Field
                            name="groupedEvents"
                            component={this.renderEventsTagSelector}
                            label={`${formatMessage(messages.groupedEvents)}`}
                            events={events}
                            actualEventId={actualEventId}
                          />

                          <Field
                            name="exclusionaryEvents"
                            component={this.renderEventsTagSelector}
                            label={`${formatMessage(messages.exclusionaryEvents)}`}
                            events={events}
                            actualEventId={actualEventId}
                          />

                          <Field
                            name="curriculumLevel"
                            component={this.renderSelect}
                            label={`${formatMessage(messages.curriculumLevel)}`}
                          >
                            <option value="">{formatMessage(messages.noCurriculumLevel)}</option>
                            {studentLevels.valueSeq().map(level =>
                              <option key={level.id} value={level.id}>{level.name}</option>
                            )}
                          </Field>

                          <Field
                            name="semester"
                            component={this.renderSelect}
                            label={`${formatMessage(messages.semester)}`}
                          >
                            <option value="">{formatMessage(messages.noSemester)}</option>
                            {semesters.valueSeq().map(semester =>
                              <option key={semester.get('id')} value={semester.get('id')}>{semester.get('name')}</option>
                            )}
                          </Field>

                          <Field
                            name="attendeesGroups"
                            component={this.renderAttendeesGroups}
                            label={`${formatMessage(messages.attendeesGroups)}*`}
                            addAttendeesGroup={addAttendeesGroup}
                            editAttendeesGroup={editAttendeesGroup}
                            emptyLabel={`${formatMessage(messages.noAttendeesGroups)}`}
                            actualEvent={actualEvent}
                          />

                          <Field
                            name="feedbackLink"
                            component={this.renderInput}
                            label={`${formatMessage(messages.feedbackLink)}*`}
                          />

                          <Field
                            name="publicFeedbackLink"
                            readOnly
                            component={this.renderInput}
                            label={`${formatMessage(messages.publicFeedbackLink)}`}
                          />

                          <Field
                            name="shortDescription"
                            component={TextEditor}
                            contentCol={10}
                            labelCol={2}
                            label={`${formatMessage(messages.shortDescription)}*`}
                          />

                          <Field
                            name="description"
                            component={TextEditor}
                            contentCol={10}
                            labelCol={2}
                            label={formatMessage(messages.description)}
                          />

                          <Field
                            name="status"
                            component={this.renderSelect}
                            label={`${formatMessage(messages.eventStatus)}`}
                          >
                            {eventsStatuses.map(status =>
                              <option key={status} value={status}>{status}</option>
                            )}
                          </Field>

                          <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                              <button type="submit" disabled={pristine || submitting} className="btn btn-success">
                                <FormattedMessage {...messages.save} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </Tab>
                <Tab eventKey={2} title={formatMessage(messages.invited)}>
                  <InvitedTab
                    eventId={actualEventId}
                    intl={this.props.intl}
                    users={users}
                    attendeesGroups={events.getIn([actualEventId, 'attendeesGroups'])}
                    changeAttendeeFeedbackStatus={changeAttendeeFeedbackStatus}
                    changeAttendeePresenceStatus={changeAttendeePresenceStatus}
                  />
                </Tab>
                {actualEventId ?
                  <Tab eventKey={3} title={formatMessage(messages.emails)}>
                    <EmailsTab animation mountOnEnter eventId={actualEventId} />
                  </Tab>
                  : null
                }{actualEventId && events.hasIn([actualEventId, 'questionForm']) ?
                  <Tab eventKey={4} title={'Výsledky dotazníku'}>
                    <FormResults formId={events.getIn([actualEventId, 'questionForm', 'formData', 'id'])} />
                  </Tab>
                  : null
                }
                {actualEventId ?
                  <Tab eventKey={5} title={formatMessage(messages.settings)}>
                    {eventSettings.get('dataLoaded') ?
                      <EventSettingsTab
                        eventSettings={eventSettings}
                        eventId={actualEventId}
                        createEventCustomSettings={createEventCustomSettings}
                      />
                      : null
                    }
                  </Tab>
                  : null
                }
              </Tabs>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

EditEvent = fields(EditEvent, {
  path: 'editEvent',
  fields: [
    'id',
    'name',
    'activityPoints',
    'hostId',
    'lectors',
    'eventStartDateTime',
    'eventEndDateTime',
    'attendeesGroups',
    'minCapacity',
    'maxCapacity',
    'mandatoryParticipation',
    'description',
    'shortDescription',
    'eventType',
    'status',
    'curriculumLevelId',
    'groupedEvents',
    'feedbackLink',
    'nxLocationId',
    'exclusionaryEvents',
  ],
});

EditEvent = reduxForm({
  form: 'editEvent',
  validate,
  warn,
  asyncValidate: (values, dispatch, props) =>
    props.checkFeedbackFormLink(values.feedbackLink).then(
      resp => {
        dispatch(props.change('publicFeedbackLink', resp.action.payload));
        return {};
      },
      resp => {
        dispatch(props.change('publicFeedbackLink', null));
        return resp.reason.errors;
      }),
  asyncBlurFields: ['feedbackLink'],
})(EditEvent);

EditEvent = injectIntl(EditEvent);
const selector = formValueSelector('editEvent');

export default connect((state) => ({
  rolesList: state.users.rolesList,
  users: state.users.users,
  semesters: state.semesters.semesters,
  activeSemesterId: state.semesters.activeSemesterId,
  actualEvent: new Map({
    minCapacity: selector(state, 'minCapacity'),
    maxCapacity: selector(state, 'maxCapacity'),
    eventStartDateTime: selector(state, 'eventStartDateTime'),
    eventEndDateTime: selector(state, 'eventEndDateTime'),
    attendeesGroups: new List(selector(state, 'attendeesGroups')),
  }),
  events: state.events.events,
  eventsStatuses: state.events.eventsStatuses,
  locale: state.intl.currentLocale,
  eventTypes: state.events.eventTypes,
  studentLevels: state.users.studentLevels,
  locations: state.nxLocations.locations,
  eventSettings: state.events.eventSettings,
  actualEventId: selector(state, 'id'),
}), { ...fieldsActions, ...attendeesGroupActions, ...eventActions })(EditEvent);

import Component from 'react-pure-render/component';
import { Map, List } from 'immutable';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedDate, FormattedTime, FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { WithContext as ReactTags } from 'react-tag-input';
import Datetime from 'react-datetime';
import { Field, FormSection, reduxForm, formValueSelector } from 'redux-form';
import validator from 'validator';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';


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
import EditTermsDialog, { renderTermPopover } from './EditTermsDialog';

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

  if (!values.attendeesGroups || values.attendeesGroups.size === 0) {
    errors.attendeesGroups = formatMessage(messages.noAttendeesGroups);
  }

  if (!values.terms || values.terms.size < 1) {
    errors.terms = 'Event musí mať aspoň jeden termín';
  }

  const shortDescriptionLength = values.shortDescription ?
      values.shortDescription.getEditorState().getCurrentContent().getPlainText().length
      : 0;
    if (shortDescriptionLength < 150) {
      errors.shortDescription = formatMessage(messages.requiredLengthField, { characters: 150 - shortDescriptionLength });
    }

  return errors;
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
    downloadEventAttendeesList: PropTypes.func.isRequired,
    checkFeedbackFormLink: PropTypes.func.isRequired,
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
        <AttendeesGroupsDialog actualEvent={actualEvent} onSave={input.onChange} eventGroups={input.value} />
      </div>
    );
  }

  renderTerms(data) {
    const { input, label, users, isTermsDialogOpen, change, locations, checkFeedbackFormLink } = data;

    const terms = input.value;
    let maxTerms = terms.get('streams').size > 0 ? 1 : 0;
    terms.get('streams').forEach(stream => {
      maxTerms = Math.max(maxTerms, stream.get('terms').size);
    });

    return (
      <div className="form-group">
        <label className="col-sm-2 control-label">
          {label}
        </label>
        <div className="col-sm-10">
          {isTermsDialogOpen &&
            <div>
              <FormSection name="terms">
                <EditTermsDialog
                  locations={locations}
                  terms={terms}
                  users={users}
                  closeDialog={() => change('isTermsDialogOpen', false)}
                  open={isTermsDialogOpen}
                  onChange={input.onChange}
                  checkFeedbackFormLink={checkFeedbackFormLink}
                />
              </FormSection>
            </div>
          }
          <table className="table table-hover">
            <thead>
              <tr>
              {terms.get('streams').valueSeq().map((v, index) =>
                terms.get('streams').size > 1 ?
                  <th style={{ textAlign: 'center' }}>Alternatíva #{index + 1}</th>
                  :
                  <th style={{ textAlign: 'center' }}>Termín</th>
              )}
              </tr>
            </thead>
            <tbody style={{ textAlign: 'center' }}>
              <tr>
                {terms.get('streams').map(stream =>
                  <td>
                    <OverlayTrigger trigger="click" placement="top" overlay={renderTermPopover(stream, users, locations)}>
                      <span className="label label-success" style={{ cursor: 'pointer' }}>
                        <FormattedDate value={stream.get('eventStartDateTime')} />
                        <span> o </span>
                        <FormattedTime value={stream.get('eventStartDateTime')} />
                      </span>
                    </OverlayTrigger>
                  </td>
                )}
              </tr>
              {[...Array(maxTerms)].map((v, index) =>
                <tr>
                  {terms.get('streams').map(stream => {
                    const term = stream.get('terms').toList().get(index);
                    return (
                      <td>
                        {stream.get('terms').size > index &&
                          <span>
                            <OverlayTrigger trigger="click" placement="top" overlay={renderTermPopover(term, users, locations)}>
                              <span className="label label-success" style={{ cursor: 'pointer' }}>
                                <FormattedDate value={term.get('eventStartDateTime')} />
                                <span> o </span>
                                <FormattedTime value={term.get('eventStartDateTime')} />
                              </span>
                            </OverlayTrigger>
                          </span>
                        }
                        {stream.get('terms').size < index && <span>&nbsp;</span>}
                      </td>
                    );
                  })}
                </tr>
              )}
            </tbody>
          </table>
          <div className="text-center">
            <button
              className="btn btn-sm btn-info"
              type="button"
              onClick={() => change('isTermsDialogOpen', true)}
            >Upraviť</button>
          </div>
        </div>
        <div className="clearfix"></div>
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
      isTermsDialogOpen,
      handleSubmit,
      change,
      semesters,
      downloadEventAttendeesList,
      addAttendeesGroup,
      editAttendeesGroup,
      eventSettings,
      createEventCustomSettings,
      changeAttendeeFeedbackStatus,
      changeAttendeePresenceStatus,
      checkFeedbackFormLink,
    } = this.props;

    const { formatMessage } = this.props.intl;

    if (!fields.description.value || !rolesList) {
      return <div></div>;
    }

    const lectors = users.filter(user => fields.lectors.value.includes(user.id))
      .map(user => ({ id: user.id, text: `${user.firstName} ${user.lastName}` }));

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
                            name="lectors"
                            component={this.renderLectors}
                            label={`${formatMessage(messages.lectors)}`}
                            users={users}
                            rolesList={rolesList}
                          />

                          <Field
                            name="terms"
                            component={this.renderTerms}
                            label="Termíny*"
                            locations={locations}
                            change={change}
                            users={users}
                            checkFeedbackFormLink={checkFeedbackFormLink}
                            isTermsDialogOpen={actualEvent.get('isTermsDialogOpen')}
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
                    event={events.get(actualEventId)}
                    intl={this.props.intl}
                    users={users}
                    downloadEventAttendeesList={downloadEventAttendeesList}
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
    'lectors',
    'attendeesGroups',
    'mandatoryParticipation',
    'description',
    'shortDescription',
    'eventType',
    'status',
    'curriculumLevelId',
    'groupedEvents',
    'feedbackLink',
    'exclusionaryEvents',
  ],
});

EditEvent = reduxForm({
  form: 'editEvent',
  validate,
})(EditEvent);

EditEvent = injectIntl(EditEvent);
const selector = formValueSelector('editEvent');

export default connect((state) => ({
  rolesList: state.users.rolesList,
  users: state.users.users,
  semesters: state.semesters.semesters,
  activeSemesterId: state.semesters.activeSemesterId,
  actualEvent: new Map({
    terms: selector(state, 'terms'),
    isTermsDialogOpen: selector(state, 'isTermsDialogOpen'),
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

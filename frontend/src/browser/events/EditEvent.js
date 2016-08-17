import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { WithContext as ReactTags } from 'react-tag-input';
import Datetime from 'react-datetime';


import { fields } from '../../common/lib/redux-fields/index';
import TextEditor from '../components/TextEditor';
import * as fieldsActions from '../../common/lib/redux-fields/actions';
import * as attendeesGroupActions from '../../common/attendeesGroup/actions';
import * as eventActions from '../../common/events/actions';
import './EditEvent.scss';
import Event from '../../common/events/models/Event';
import AttendeesGroupsDialog from './attendeesGroups/AttendeesGroupsDialog';

const messages = defineMessages({
  eventName: {
    defaultMessage: 'Event name',
    id: 'event.edit.eventName',
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
    defaultMessage: 'There are no attendees groups',
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
  followingEvents: {
    defaultMessage: 'Following events',
    id: 'event.edit.followingEvents',
  },
  addFollowingEvents: {
    defaultMessage: 'Add events',
    id: 'event.edit.addFollowingEvents',
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
});

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
    removeAttendeesGroup: PropTypes.func.isRequired,
    editAttendeesGroup: PropTypes.func.isRequired,
    rolesList: PropTypes.object,
    params: PropTypes.object,
    users: PropTypes.object,
    intl: PropTypes.object.isRequired,
    eventsStatuses: PropTypes.object.isRequired,
    studentLevels: PropTypes.object.isRequired,
    locations: PropTypes.object.isRequired,
  }

  componentWillMount() {
    const { setField, events, event, params } = this.props;

    const eventId = params ? params.eventId : null;
    let activeEvent = event;

    if (eventId) {
      activeEvent = events.get(parseInt(eventId, 10));
    }

    setField(['editEvent'], activeEvent ? activeEvent : new Event());
  }

  render() {
    const { fields, events, locations, eventTypes, studentLevels, eventsStatuses, rolesList, title, users, locale } = this.props;
    const {
      saveEvent,
      setField,
      addAttendeesGroup,
      removeAttendeesGroup,
      editAttendeesGroup,
    } = this.props;

    const { formatMessage } = this.props.intl;

    if (!fields.description.value || !rolesList) {
      return <div></div>;
    }

    const lectors = users.filter(user => fields.lectors.value.includes(user.id))
      .map(user => ({ id: user.id, text: `${user.firstName} ${user.lastName}` }));

    const followingEvents = events.filter(event => fields.followingEvents.value.includes(event.id))
      .map(event => ({ id: event.id, text: event.name }));

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
              <div className="nav-tabs-custom">
                <div className="tab-content">
                  <div className="tab-pane active" id="settings">
                    <form className="form-horizontal">
                      <div className="form-group">
                        <label htmlFor="inputName" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.eventName} />
                        </label>

                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            {...fields.name}
                            id="name"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="inputName" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.activityPoints} />
                        </label>

                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            {...fields.activityPoints}
                            id="activityPoints"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="inputName" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.eventType} />
                        </label>

                        <div className="col-sm-10">
                          <select
                            className="form-control"
                            {...fields.eventType}
                            id="eventType"
                          >
                            <option readOnly>{formatMessage(messages.chooseEventType)}</option>
                            {eventTypes.valueSeq().map(type =>
                              <option key={type} value={type}>{formatMessage(messages[`eventType_${type}`])}</option>
                            )}
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="eventLocation" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.eventLocation} />
                        </label>

                        <div className="col-sm-10">
                          <select
                            className="form-control"
                            {...fields.nxLocationId}
                            id="eventLocation"
                          >
                            <option readOnly>{formatMessage(messages.chooseEventLocation)}</option>
                            {locations.valueSeq().map(location =>
                              <option key={location.id} value={location.id}>
                              {`${location.name} (${location.addressLine1}`}
                              {`${location.addressLine2 ? `, ${location.addressLine2}` : ''}`}
                              {`, ${location.city}, ${location.zipCode}, ${location.countryCode})`}
                              </option>
                            )}
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="inputName" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.host} />
                        </label>

                        <div className={`col-sm-10 ${host.length ? 'disabled-host' : ''}`}>
                          <ReactTags
                            id="host"
                            placeholder={formatMessage(messages.addHost)}
                            tags={host}
                            suggestions={users.map(user => `${user.firstName} ${user.lastName} (${user.username})`).toArray()}
                            handleDelete={(i) => setField(['editEvent', 'hostId'], null)}
                            handleAddition={(tag) => setField(['editEvent', 'hostId'], users.find(user => `${user.firstName} ${user.lastName} (${user.username})` === tag).id)}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="inputName" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.lectors} />
                        </label>

                        <div className="col-sm-10">
                          <ReactTags
                            id="lectors"
                            placeholder={formatMessage(messages.addLectors)}
                            tags={lectors.toArray()}
                            suggestions={users.filter(user => user.roles.includes(rolesList.get('LECTOR').id) && !fields.lectors.value.includes(user.id)).map(user => `${user.firstName} ${user.lastName} (${user.username})`).toArray()}
                            handleDelete={(i) => setField(['editEvent', 'lectors'], fields.lectors.value.delete(i).map(lector => lector.id))}
                            handleAddition={(tag) => setField(['editEvent', 'lectors'], fields.lectors.value.push(users.find(user => `${user.firstName} ${user.lastName} (${user.username})` === tag).id))}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="inputName" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.followingEvents} />
                        </label>

                        <div className="col-sm-10">
                          <ReactTags
                            id="events"
                            placeholder={formatMessage(messages.addFollowingEvents)}
                            tags={followingEvents.toArray()}
                            suggestions={events.filter(event => event.id !== fields.id.value && !fields.followingEvents.value.includes(event.id)).map(event => event.name).toArray()}
                            handleDelete={(i) => setField(['editEvent', 'followingEvents'], fields.followingEvents.value.delete(i).map(event => event.id))}
                            handleAddition={(tag) => setField(['editEvent', 'followingEvents'], fields.followingEvents.value.push(events.find(event => event.name === tag).id))}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="inputName" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.eventStartDateTime} />
                        </label>

                        <div className="col-sm-10">
                          <Datetime
                            inputProps={{ id: 'eventStartDateTime' }}
                            locale={locale}
                            {...fields.eventStartDateTime}
                            onChange={(moment) => fields.eventStartDateTime.onChange({ target: {value: moment }})}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="inputName" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.eventEndDateTime} />
                        </label>

                        <div className="col-sm-10">
                          <Datetime
                            inputProps={{ id: 'eventEndDateTime' }}
                            locale={locale}
                            {...fields.eventEndDateTime}
                            onChange={(moment) => fields.eventEndDateTime.onChange({ target: {value: moment }})}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="inputName" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.minCapacity} />
                        </label>

                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            {...fields.minCapacity}
                            id="minCapacity"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="inputName" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.maxCapacity} />
                        </label>

                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            {...fields.maxCapacity}
                            id="maxCapacity"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="curriculumLevel" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.curriculumLevel} />
                        </label>

                        <div className="col-sm-10">
                          <select
                            className="form-control"
                            {...fields.curriculumLevelId}
                            id="curriculumLevel"
                          >
                            <option value="">{formatMessage(messages.noCurriculumLevel)}</option>
                            {studentLevels.valueSeq().map(level =>
                              <option key={level.id} value={level.id}>{level.name}</option>
                            )}
                          </select>
                        </div>
                      </div>

                      <div className="form-group attendees-groups">
                        <label htmlFor="inputName" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.attendeesGroups} />
                        </label>

                        <div className="col-sm-10">
                          <div className="form-control add-group-button">
                            <i className="fa fa-plus text-green" onClick={addAttendeesGroup}></i>
                          </div>
                          <ul className="nav nav-pills nav-stacked">
                            {fields.attendeesGroups.value ?
                              fields.attendeesGroups.value.map((group, index) =>
                                <li key={index} className="active">
                                  <a><i className="fa fa-users"></i> {group.name}
                                    <span className="action-buttons pull-right">
                                      <span className="label">
                                        <span className="confirmed-will-come">{group.users.filter(user => user.signedIn).size}</span>
                                        <span> / </span>
                                        <span className="confirmed-wont-come">{group.users.filter(user => user.signedOut || user.wontGo).size}</span>
                                        <span> / </span>
                                        <span className="total">{group.users.size}</span>
                                      </span>
                                      <i
                                        className="fa fa-trash-o trash-group"
                                        onClick={() => removeAttendeesGroup(index)}
                                      ></i>
                                      <i
                                        className="fa fa-pencil"
                                        onClick={() => editAttendeesGroup(group, index)}
                                      ></i>
                                    </span>
                                  </a>
                                </li>
                              )
                              :
                              <FormattedMessage {...messages.noAttendeesGroups} />
                            }
                          </ul>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="personalDescription" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.description} />
                        </label>

                        <div className="col-sm-10">
                          <TextEditor
                            value={fields.description.value}
                            onChange={(value) =>
                              fields.description.onChange({ target: { value } })
                            }
                            id="description"
                            placeholder="Event description ..."
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="shortDescription" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.shortDescription} />
                        </label>

                        <div className="col-sm-10">
                          <TextEditor
                            value={fields.shortDescription.value}
                            onChange={(value) =>
                              fields.shortDescription.onChange({ target: { value } })
                            }
                            id="shortDescription"
                            placeholder="Event short description ..."
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="inputName" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.eventStatus} />
                        </label>

                        <div className="col-sm-10">
                          <select
                            className="form-control"
                            {...fields.status}
                            id="eventStatus"
                          >
                            {eventsStatuses.map(status =>
                              <option key={status} value={status}>{status}</option>
                            )}
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                          <button type="button" className="btn btn-success" onClick={() => saveEvent(fields)}>
                            <FormattedMessage {...messages.save} />
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <AttendeesGroupsDialog />
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
    'description',
    'shortDescription',
    'eventType',
    'status',
    'curriculumLevelId',
    'followingEvents',
    'nxLocationId',
  ],
});

EditEvent = injectIntl(EditEvent);

export default connect((state) => ({
  rolesList: state.users.rolesList,
  users: state.users.users,
  events: state.events.events,
  eventsStatuses: state.events.eventsStatuses,
  locale: state.intl.currentLocale,
  eventTypes: state.events.eventTypes,
  studentLevels: state.users.studentLevels,
  locations: state.nxLocations.locations,
}), { ...fieldsActions, ...attendeesGroupActions, ...eventActions })(EditEvent);

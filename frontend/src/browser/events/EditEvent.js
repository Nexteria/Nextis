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
  }
});

export class EditEvent extends Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    mode: PropTypes.string,
    title: PropTypes.object.isRequired,
    event: PropTypes.object,
    saveEvent: PropTypes.func.isRequired,
    setField: PropTypes.func,
    locale: PropTypes.string,
    addAttendeesGroup: PropTypes.func.isRequired,
    removeAttendeesGroup: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { setField, event } = this.props;

    setField(['editEvent'], event ? event : new Event());
  }

  render() {
    const { fields, mode, title, users, locale } = this.props;
    const { saveEvent, setField, addAttendeesGroup, removeAttendeesGroup } = this.props;
    const { formatMessage } = this.props.intl;

    const lectors = users.filter(user => fields.lectors.value.includes(user.uid)).map(user => ({ id: user.uid, text: `${user.firstName} ${user.lastName}` }));
    let host = users.get(fields.host.value);

    if (host) {
      host = [{ id: host.uid, text: `${host.firstName} ${host.lastName}`}];
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
                          <FormattedMessage {...messages.host} />
                        </label>

                        <div className={`col-sm-10 ${host.length ? 'disabled-host' : ''}`}>
                          <ReactTags
                            id="host"
                            placeholder={formatMessage(messages.addHost)}
                            tags={host}
                            suggestions={users.map(user => `${user.firstName} ${user.lastName} (${user.username})`).toArray()}
                            handleDelete={(i) => setField(['editEvent', 'host'], null)}
                            handleAddition={(tag) => setField(['editEvent', 'host'], users.find(user => `${user.firstName} ${user.lastName} (${user.username})` === tag).uid)}
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
                            suggestions={users.filter(user => user.roles.includes('lector') && !fields.lectors.value.includes(user.uid)).map(user => `${user.firstName} ${user.lastName} (${user.username})`).toArray()}
                            handleDelete={(i) => setField(['editEvent', 'lectors'], lectors.delete(i).map(lector => lector.uid))}
                            handleAddition={(tag) => setField(['editEvent', 'lectors'], fields.lectors.value.push(users.find(user => `${user.firstName} ${user.lastName} (${user.username})` === tag).uid))}
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
                              fields.attendeesGroups.value.valueSeq().map(group =>
                                <li key={group.uid} className="active">
                                  <a><i className="fa fa-users"></i> {group.name}
                                    <i
                                      className="fa fa-trash-o trash-group pull-right"
                                      onClick={() => removeAttendeesGroup(group.uid)}
                                    ></i>
                                    <span className="label pull-right">
                                      <span className="confirmed-will-come">{group.users.filter(user => user.signedIn).size}</span>
                                      <span> / </span>
                                      <span className="confirmed-wont-come">{group.users.filter(user => user.signedOut || user.wontGo).size}</span>
                                      <span> / </span>
                                      <span className="total">{group.users.size}</span>
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
    'uid',
    'name',
    'activityPoints',
    'host',
    'lectors',
    'eventStartDateTime',
    'eventEndDateTime',
    'attendeesGroups',
    'minCapacity',
    'maxCapacity',
    'description',
  ],
});

EditEvent = injectIntl(EditEvent);

export default connect((state) => ({
  rolesList: state.users.rolesList,
  users: state.users.users,
  locale: state.intl.currentLocale,
}), { ...fieldsActions, ...attendeesGroupActions, ...eventActions })(EditEvent);

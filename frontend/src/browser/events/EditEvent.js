import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { List } from 'immutable';
import { WithContext as ReactTags } from 'react-tag-input';

import { fields } from '../../common/lib/redux-fields/index';
import * as fieldsActions from '../../common/lib/redux-fields/actions';
import './EditEvent.scss';
import Event from '../../common/events/models/Event';

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
  eventDateTime: {
    defaultMessage: 'Event date',
    id: 'event.edit.eventDateTime',
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
});

export class EditEvent extends Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    mode: PropTypes.string,
    title: PropTypes.object.isRequired,
    event: PropTypes.object,
    saveEvent: PropTypes.func.isRequired,
    setField: PropTypes.func,
  }

  componentWillMount() {
    const { setField, event } = this.props;

    setField(['editEvent'], event ? event : new Event());
  }

  render() {
    const { fields, mode, title, users } = this.props;
    const { saveEvent, setField } = this.props;
    const { formatMessage } = this.props.intl;

    const lectors = users.filter(user => fields.lectors.value.includes(user.uid)).map(user => ({ id: user.uid, text: `${user.firstName} ${user.lastName}` }));

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

                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            {...fields.host}
                            id="host"
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
                            tags={lectors.toArray()}
                            suggestions={users.filter(user => user.roles.includes('lector') && !fields.lectors.value.includes(user.uid)).map(user => `${user.firstName} ${user.lastName} (${user.username})`).toArray()}
                            handleDelete={(i) => setField(['editEvent', 'lectors'], lectors.delete(i).map(lector => lector.uid))}
                            handleAddition={(tag) => setField(['editEvent', 'lectors'], fields.lectors.value.push(users.find(user => `${user.firstName} ${user.lastName} (${user.username})` === tag).uid))}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="inputName" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.eventDateTime} />
                        </label>

                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            {...fields.eventDateTime}
                            id="eventDateTime"
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
                        <label htmlFor="inputName" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.attendeesGroups} />
                        </label>

                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            {...fields.attendeesGroups}
                            id="attendeesGroups"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="personalDescription" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.description} />
                        </label>

                        <div className="col-sm-10">
                          <textarea
                            className="form-control"
                            rows="3"
                            {...fields.description}
                            id="description"
                            placeholder="Personal description ..."
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                          <button type="button" className="btn btn-danger" onClick={() => saveEvent(fields)}>
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
    'hostUid',
    'lectors',
    'eventDateTime',
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
}), fieldsActions)(EditEvent);

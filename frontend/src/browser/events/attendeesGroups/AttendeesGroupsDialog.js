import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import Datetime from 'react-datetime';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import validator from 'validator';
import moment from 'moment';
import RichTextEditor from 'react-rte';
import { Map } from 'immutable';


import GroupMembers from './GroupMembers';
import UsersPool from './UsersPool';
import * as actions from '../../../common/attendeesGroup/actions';

const messages = defineMessages({
  createAttendeeGroup: {
    defaultMessage: 'Create attendee group',
    id: 'event.edit.attendeesGroup.createAttendeeGroup',
  },
  usersPool: {
    defaultMessage: 'Users pool',
    id: 'event.edit.attendeesGroup.usersPool',
  },
  saveAttendeeGroupButton: {
    defaultMessage: 'Save',
    id: 'event.edit.attendeesGroup.saveAttendeeGroupButton',
  },
  openingSignupDate: {
    defaultMessage: 'Signup from',
    id: 'event.edit.attendeesGroup.openingSignupDate',
  },
  deadlineSignupDate: {
    defaultMessage: 'Signup to',
    id: 'event.edit.attendeesGroup.deadlineSignupDate',
  },
  groupName: {
    defaultMessage: 'Group name',
    id: 'event.edit.attendeesGroup.groupName',
  },
  minCapacity: {
    defaultMessage: 'Min capacity',
    id: 'event.edit.attendeesGroup.minCapacity',
  },
  maxCapacity: {
    defaultMessage: 'Max capacity',
    id: 'event.edit.attendeesGroup.maxCapacity',
  },
  requiredField: {
    defaultMessage: 'This field is required',
    id: 'event.edit.attendeesGroup.requiredField',
  },
  dateMustBeBeforeEvent: {
    defaultMessage: 'Date must be before event start!',
    id: 'event.edit.attendeesGroup.dateMustBeBeforeEvent',
  },
  startDateMustBeBeforeEndDate: {
    defaultMessage: 'Date must be before signup deadline!',
    id: 'event.edit.attendeesGroup.startDateMustBeBeforeEndDate',
  },
  endDateMustBeAfterStartDate: {
    defaultMessage: 'Date must be after signup open!',
    id: 'event.edit.attendeesGroup.endDateMustBeAfterStartDate',
  },
  maxCapacityMustBeGE: {
    defaultMessage: 'Max capacity must be greater or equal min capacity!',
    id: 'event.edit.attendeesGroup.maxCapacityMustBeGE',
  },
  minCapacityMustBeSE: {
    defaultMessage: 'Min capacity must be smaller or equal max capacity!',
    id: 'event.edit.attendeesGroup.minCapacityMustBeSE',
  },
  usersMustBeEnough: {
    defaultMessage: 'Users in group must be more then min capacity!',
    id: 'event.edit.attendeesGroup.usersMustBeEnough',
  },
});

const validate = (values, props) => {
  const { formatMessage } = props.intl;
  const actualEvent = props.actualEvent;

  const errors = {};
  if (!values.name) {
    errors.name = formatMessage(messages.requiredField);
  }

  if (!values.maxCapacity) {
    errors.maxCapacity = formatMessage(messages.requiredField);
  } else if (values.minCapacity && parseInt(values.minCapacity) > parseInt(values.maxCapacity)) {
    errors.maxCapacity = formatMessage(messages.maxCapacityMustBeGE);
  }

  if (!values.minCapacity) {
    errors.minCapacity = formatMessage(messages.requiredField);
  } else if (values.maxCapacity && parseInt(values.minCapacity) > parseInt(values.maxCapacity)) {
    errors.minCapacity = formatMessage(messages.minCapacityMustBeSE);
  }

  if (!values.signUpOpenDateTime) {
    errors.signUpOpenDateTime = formatMessage(messages.requiredField);
  } else if (actualEvent.eventStartDateTime && values.signUpOpenDateTime.isAfter(actualEvent.eventStartDateTime)) {
    errors.signUpOpenDateTime = formatMessage(messages.dateMustBeBeforeEvent);
  } else if (values.signUpDeadlineDateTime && values.signUpOpenDateTime.isAfter(values.signUpDeadlineDateTime)) {
    errors.signUpOpenDateTime = formatMessage(messages.startDateMustBeBeforeEndDate);
  }

  if (!values.signUpDeadlineDateTime) {
    errors.signUpDeadlineDateTime = formatMessage(messages.requiredField);
  } else if (actualEvent.eventStartDateTime && values.signUpDeadlineDateTime.isAfter(actualEvent.eventStartDateTime)) {
    errors.signUpDeadlineDateTime = formatMessage(messages.dateMustBeBeforeEvent);
  } else if (values.signUpOpenDateTime && values.signUpOpenDateTime.isAfter(values.signUpDeadlineDateTime)) {
    errors.signUpDeadlineDateTime = formatMessage(messages.endDateMustBeAfterStartDate);
  }

  if (!values.users) {
    errors.users = formatMessage(messages.requiredField);
  } else if (values.minCapacity && values.users.size < parseInt(values.minCapacity)) {
    errors.users = formatMessage(messages.usersMustBeEnough);
  }

  return errors;
};

export class AttendeesGroupsDialog extends Component {

  static propTypes = {
    users: PropTypes.object.isRequired,
    groups: PropTypes.object.isRequired,
    attendeesGroup: PropTypes.object,
    addUser: PropTypes.func.isRequired,
    addGroup: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    closeAttendeesGroupDialog: PropTypes.func.isRequired,
    updateAttendeesGroup: PropTypes.func.isRequired,
    removeUser: PropTypes.func.isRequired,
    changeAttendeeGroupName: PropTypes.func.isRequired,
    changeSignUpOpenDateTime: PropTypes.func.isRequired,
    changeSignUpDeadlineDateTime: PropTypes.func.isRequired,
    changeAttendeeGroupMinCapacity: PropTypes.func.isRequired,
    changeAttendeeGroupMaxCapacity: PropTypes.func.isRequired,
  }

  renderInput(data) {
    const { input, label, type, meta: { asyncValidating, touched, error, pristine } } = data;

    return (
      <div className={`form-group ${touched && error && (!pristine || !input.value) ? 'has-error' : ''}`}>
        <label>{label}</label>

        <input
          id={input.name}
          {...input}
          className="form-control"
        />
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

  renderDate(data) {
    const { input, label, locale, meta: { touched, error } } = data;

    return (
      <div className={`form-group ${touched && error ? 'has-error' : ''}`}>
        <label className="control-label">
          {label}
        </label>

        <Datetime
          inputProps={{ id: input.name }}
          locale={locale}
          value={input.value}
          onBlur={input.onBlur}
          onChange={(moment) => input.onChange(moment)}
        />
        <div className="has-error">
          {touched && error && <label>{error}</label>}
        </div>
      </div>
    );
  }

  renderGroupMembers(data) {
    const { input, label, groups, users, meta: { touched, error } } = data;

    const groupMembers = input.value.entrySeq().map(
      entry => entry[1].merge(users.get(entry[0]))
    );

    return (
      <div>
        <div className="form-group has-error">
          {error && <label>{error}</label>}
        </div>
        <GroupMembers users={groupMembers} removeUser={(id) => input.onChange(input.value.delete(id))} />
        <UsersPool
          groups={groups}
          users={users}
          addUser={(id) => input.onChange(input.value.set(id, new Map({
            id: id,
            signedIn: null,
            wasPresent: null,
            filledFeedback: null,
            signedOut: null,
            wontGo: null,
            signedOutReason: RichTextEditor.createValueFromString('', 'html'),
          })))}
          addGroup={group => {
            const users = group.users.reduce((users, user) => users.set(user, user), new Map());
            const groupUsers = users.map(user => new Map({
              id: user,
              wasPresent: null,
              filledFeedback: null,
              signedIn: null,
              signedOut: null,
              wontGo: null,
              signedOutReason: RichTextEditor.createValueFromString('', 'html'),
            }));
            input.onChange(input.value.merge(groupUsers));
          }}
        />
      </div>
    );
  }

  render() {
    const { groups, eventGroups, users, pristine, submitting, locale, attendeesGroup, attendeesGroupIndex } = this.props;
    const {
      addUser,
      onChange,
      addGroup,
      closeAttendeesGroupDialog,
      updateAttendeesGroup,
      removeUser,
      handleSubmit,
      changeAttendeeGroupName,
      changeSignUpOpenDateTime,
      changeSignUpDeadlineDateTime,
      changeAttendeeGroupMinCapacity,
      changeAttendeeGroupMaxCapacity,
    } = this.props;

    const { formatMessage } = this.props.intl;

    if (!attendeesGroup) {
      return <div></div>;
    }

    return (
      <Modal
        show
        dialogClassName="create-attendee-group-modal"
        onHide={closeAttendeesGroupDialog}
      >
        <Header closeButton>
          <Title><FormattedMessage {...messages.createAttendeeGroup} /></Title>
        </Header>

        <Body>
          <form className="col-md-12" onSubmit={handleSubmit((data) => updateAttendeesGroup(data, attendeesGroupIndex, onChange, eventGroups))}>
            <div className="col-md-5">
              <Field
                name="name"
                type="text"
                component={this.renderInput}
                label={`${formatMessage(messages.groupName)}*`}
              />
            </div>

            <div className="col-md-7">
              <div className="col-md-6">
                <div className="col-md-6">
                  <Field
                    name="minCapacity"
                    type="text"
                    component={this.renderInput}
                    label={`${formatMessage(messages.minCapacity)}*`}
                  />
                </div>

                <div className="col-md-6">
                  <Field
                    name="maxCapacity"
                    type="text"
                    component={this.renderInput}
                    label={`${formatMessage(messages.maxCapacity)}*`}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="col-md-6">
                  <Field
                    name="signUpOpenDateTime"
                    component={this.renderDate}
                    label={`${formatMessage(messages.openingSignupDate)}*`}
                    locale={locale}
                  />
                </div>

                <div className="col-md-6">
                  <Field
                    name="signUpDeadlineDateTime"
                    component={this.renderDate}
                    label={`${formatMessage(messages.deadlineSignupDate)}*`}
                    locale={locale}
                  />
                </div>
              </div>
            </div>

            <Field
              name="users"
              component={this.renderGroupMembers}
              users={users}
              groups={groups}
            />

            <div className="col-md-12" style={{marginTop: '1em'}}>
              <button type="submit" disabled={pristine || submitting} className="btn btn-success pull-right">
                <FormattedMessage {...messages.saveAttendeeGroupButton} />
              </button>
            </div>
          </form>
          <div className="clearfix"></div>
        </Body>
      </Modal>
    );
  }
}

AttendeesGroupsDialog = reduxForm({
  form: 'editAttendeeGroup',
  validate,
})(AttendeesGroupsDialog);

AttendeesGroupsDialog = injectIntl(AttendeesGroupsDialog);
const selector = formValueSelector('editAttendeeGroup');

export default connect((state) => ({
  rolesList: state.users.rolesList,
  users: state.users.users,
  groups: state.users.groups,
  locale: state.intl.currentLocale,
  attendeesGroup: state.attendeesGroup.group,
  initialValues: state.attendeesGroup.group ? state.attendeesGroup.group.toObject() : null,
  attendeesGroupIndex: state.attendeesGroup.groupIndex,
}), actions)(AttendeesGroupsDialog);

import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

const messages = defineMessages({
  groupMembers: {
    defaultMessage: 'Group members',
    id: 'event.edit.groupMembers',
  },
  emptyGroup: {
    defaultMessage: 'Group is empty',
    id: 'event.edit.emptyGroup',
  },
  confirmedAttendance: {
    defaultMessage: 'Group is empty',
    id: 'event.edit..attendeesGroup.confirmedAttendance',
  },
});

export default class GroupMembers extends Component {

  static propTypes = {
    users: PropTypes.object,
    removeUser: PropTypes.func.isRequired,
  };

  render() {
    const { users } = this.props;
    const { removeUser } = this.props;

    return (
      <div className="col-md-6" id="group-members-container">
        <label><FormattedMessage {...messages.groupMembers} /></label>
        <div id="group-members">
          {users ?
            <ul className="nav nav-pills nav-stacked">
              {users.valueSeq().map(user =>
                <li
                  key={user.get('uid')}
                  className="group"
                  onClick={() => removeUser(user.get('uid'))}
                >
                  <a><i className="fa fa-user"></i>
                  {`${user.get('firstName')} ${user.get('lastName')} (${user.get('username')})`}
                  </a>
                </li>
              )}
            </ul>
            :
            <span><FormattedMessage {...messages.emptyGroup} /></span>
          }
        </div>
      </div>
    );
  }
}

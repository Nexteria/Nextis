import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import PoolsUser from './PoolsUser';
import PoolsGroup from './PoolsGroup';
import { fields } from '../../../common/lib/redux-fields/index';

const messages = defineMessages({
  usersPool: {
    defaultMessage: 'Users pool',
    id: 'event.edit.usersPool',
  },
});

export class UsersPool extends Component {

  static propTypes = {
    users: PropTypes.object.isRequired,
    groups: PropTypes.object.isRequired,
    addUser: PropTypes.func.isRequired,
    addGroup: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const { fields } = this.props;

    fields.filter.onChange({ target: { value: '' } });
  }

  render() {
    const { fields } = this.props;
    let { users, groups } = this.props;
    const { addUser, addGroup } = this.props;

    const filter = fields.filter.value;
    if (filter) {
      groups = groups.valueSeq().filter(group => group.name.indexOf(filter) !== -1);
      users = users.valueSeq().filter(user =>
        `${user.firstName} ${user.lastName} (${user.username})`.indexOf(filter) !== -1
      );
    }

    return (
      <div className="col-md-6" id="user-pool-container">
        <label><FormattedMessage {...messages.usersPool} /></label>
        <div className="input-group input-group-sm searchbox pull-right">
          <input type="text" name="table_search" {...fields.filter} className="form-control pull-right" placeholder="Search" />

          <div className="input-group-btn">
            <button type="submit" className="btn btn-default"><i className="fa fa-search"></i></button>
          </div>
        </div>
        <ul id="users-pool" className="nav nav-pills nav-stacked">
          {groups.valueSeq().map(group =>
            <PoolsGroup key={group.uid} group={group} addGroup={addGroup} />
          )}

          {users.valueSeq().map(user =>
            <PoolsUser key={user.uid} user={user} addUser={addUser} />
          )}
        </ul>
      </div>
    );
  }
}

export default fields(UsersPool, {
  path: 'userPool',
  fields: [
    'filter',
  ],
});

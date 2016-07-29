import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import EditUser from './EditUser';
import * as actions from '../../common/users/actions';

const messages = defineMessages({
  title: {
    defaultMessage: 'Create user',
    id: 'users.create.title'
  },
});

export class CreateUserPage extends Component {

  static propTypes = {
    saveUser: PropTypes.func.isRequired,
  }

  render() {
    const { saveUser } = this.props;

    return (
      <div>
        <EditUser
          mode="create"
          title={<FormattedMessage {...messages.title} />}
          saveUser={saveUser}
        />
      </div>
    );
  }
}

CreateUserPage = injectIntl(CreateUserPage);

export default connect(() => ({
}), actions)(CreateUserPage);

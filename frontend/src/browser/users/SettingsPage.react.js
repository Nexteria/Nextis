import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import './SettingsPage.scss';
import EditUser from './EditUser';
import * as actions from '../../common/users/actions';

const messages = defineMessages({
  title: {
    defaultMessage: 'User Profile',
    id: 'me.settingsPage.title'
  },
});

export class SettingsPage extends Component {

  static propTypes = {
    viewer: PropTypes.object.isRequired,
    saveUser: PropTypes.func.isRequired,
  }

  render() {
    const { viewer } = this.props;
    const { saveUser } = this.props;

    return (
      <div>
        <EditUser
          mode="profile"
          user={viewer}
          title={<FormattedMessage {...messages.title} />}
          saveUser={saveUser}
        />
      </div>
    );
  }
}

SettingsPage = injectIntl(SettingsPage);

export default connect(state => ({
  viewer: state.users.viewer,
}), actions)(SettingsPage);

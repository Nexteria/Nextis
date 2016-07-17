import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import messages from '../../common/app/headerPanelMessages';

export default class HeaderMessages extends Component {

  static propTypes = {
    user: PropTypes.object
  };

  render() {
    return (
      <li className="dropdown notifications-menu">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown">
          <i className="fa fa-bell-o"></i>
        </a>
        <ul className="dropdown-menu">
          <li className="header"><FormattedMessage {...messages.no_new_notifications} /></li>
        </ul>
      </li>
    );
  }
}

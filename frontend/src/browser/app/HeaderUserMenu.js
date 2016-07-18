import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import messages from '../../common/app/headerPanelMessages';

export default class HeaderUserMenu extends Component {

  static propTypes = {
    viewer: PropTypes.object.isRequired
  };

  render() {
    const { viewer } = this.props;

    return (
      <li className="dropdown user user-menu">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown">
          <i className="fa fa-user avatar-icon-md"></i>
          <span className="hidden-xs">{`${viewer.first_name} ${viewer.last_name}`}</span>
        </a>
        <ul className="dropdown-menu">
          <li className="user-header">
            <i className="fa fa-user avatar-icon-lg"></i>
            <p>
              {`${viewer.first_name} ${viewer.last_name}`}
            </p>
          </li>
          <li className="user-footer">
            <div className="pull-right">
              <a href="/logout" className="btn btn-default btn-flat"><FormattedMessage {...messages.logout} /></a>
            </div>
          </li>
        </ul>
      </li>
    );
  }
}

import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';

import messages from '../../common/app/headerPanelMessages';
import './HeaderUserMenu.scss';

export default class HeaderUserMenu extends Component {

  static propTypes = {
    viewer: PropTypes.object.isRequired,
    openUserMenu: PropTypes.func.isRequired,
    closeUserMenu: PropTypes.func.isRequired,
    isUserMenuOpen: PropTypes.bool.isRequired,
  };

  render() {
    const { viewer, isUserMenuOpen } = this.props;
    const { openUserMenu, closeUserMenu } = this.props;

    return (
      <li className={`dropdown user user-menu ${isUserMenuOpen ? 'open' : ''}`}>
        <button onFocus={openUserMenu} className="dropdown-toggle" data-toggle="dropdown">
          <i className="fa fa-user avatar-icon-md"></i>
          <span className="hidden-xs">{`${viewer.firstName} ${viewer.lastName}`}</span>
        </button>
        <ul className="dropdown-menu" onBlur={closeUserMenu}>
          <li className="user-header">
            <i className="fa fa-user avatar-icon-lg"></i>
            <p>
              {`${viewer.firstName} ${viewer.lastName}`}
            </p>
          </li>
          <li className="user-footer" onClick={closeUserMenu}>
            <div className="pull-left">
              <Link to="/users/me/settings" className="btn btn-default btn-flat">Profile</Link>
            </div>
            <div className="pull-right">
              <a href="/logout" className="btn btn-default btn-flat">
                <FormattedMessage {...messages.logout} />
              </a>
            </div>
          </li>
        </ul>
      </li>
    );
  }
}

import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import HeaderNotifications from './HeaderNotifications';
import HeaderMessages from './HeaderMessages';
import HeaderUserMenu from './HeaderUserMenu';
import messages from '../../common/app/headerPanelMessages';
import * as actions from '../../common/app/actions';

class Header extends Component {

  static propTypes = {
    viewer: PropTypes.object,
    openUserMenu: PropTypes.func.isRequired,
    closeUserMenu: PropTypes.func.isRequired,
    isUserMenuOpen: PropTypes.bool.isRequired,
  };

  render() {
    const { viewer, feedbackUrl, isUserMenuOpen } = this.props;
    const { openUserMenu, toggleSidebar, closeUserMenu } = this.props;

    return (
      <header className="main-header">
        <Link to="/events" className="logo">
          <span className="logo-mini">
            <img src="/img/nexteria-logo-img.png" alt="Nexteria logo" />
          </span>
          <span className="logo-lg">
            <img src="/img/nexteria-logo.png" alt="Nexteria logo" />
          </span>
        </Link>
        <nav className="navbar navbar-static-top">
          <a onClick={toggleSidebar} className="sidebar-toggle" data-toggle="offcanvas" role="button">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </a>

          <div className="navbar-custom-menu">
            <ul className="nav navbar-nav">
              <HeaderUserMenu {...{ viewer, openUserMenu, closeUserMenu, isUserMenuOpen }} />
            </ul>
          </div>

          <a
            style={{ float: 'right', position: 'relative', top: '0.5em', right: '5em' }}
            href={feedbackUrl}
            className="btn btn-info"
            target="_blank"
          >
            <FormattedMessage {...messages.feedbackButton} />
          </a>
        </nav>
      </header>
    );
  }

}

export default connect(state => ({
  viewer: state.users.viewer,
  feedbackUrl: state.config.feedbackUrl,
  isUserMenuOpen: state.app.isUserMenuOpen,
}), actions)(Header);

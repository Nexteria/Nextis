import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import HeaderNotifications from './HeaderNotifications';
import HeaderMessages from './HeaderMessages';
import HeaderUserMenu from './HeaderUserMenu';
import messages from '../../common/app/headerPanelMessages';

class Header extends Component {

  static propTypes = {
    viewer: PropTypes.object
  };

  render() {
    const { viewer } = this.props;

    return (
      <header className="main-header" ref="main-header">
        <Link to="/" className="logo">
          <span className="logo-mini">
            <img src="/static/img/nexteria-logo-img.png" alt="Nexteria logo" />
          </span>
          <span className="logo-lg">
            <img src="/static/img/nexteria-logo.png" alt="Nexteria logo" />
          </span>
        </Link>
        <nav className="navbar navbar-static-top">
          <a href="#" className="sidebar-toggle" data-toggle="offcanvas" role="button">
            <span className="sr-only"><FormattedMessage {...messages.toggle_sidebar} /></span>
          </a>

          <div className="navbar-custom-menu">
            <ul className="nav navbar-nav">
              <HeaderMessages />
              <HeaderNotifications />
              <HeaderUserMenu {...{ viewer }} />
            </ul>
          </div>
        </nav>
      </header>
    );
  }

}

export default connect(state => ({
  viewer: state.users.viewer
}))(Header);

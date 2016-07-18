import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';

import messages from '../../common/app/sidebarMessages';

export default class AppSideBar extends Component {

  static propTypes = {
    viewer: PropTypes.object.isRequired
  };

  render() {
    return (
      <aside className="main-sidebar">
        <section className="sidebar">
          <ul className="sidebar-menu">
            <li className="header"><FormattedMessage {...messages.studies} /></li>
            <li className="header"><FormattedMessage {...messages.network} /></li>
            <li>
              <Link to="/contacts">
                <i className="fa fa-users text-green"></i>
                <span><FormattedMessage {...messages.contacts} /></span>
              </Link>
            </li>
          </ul>
        </section>
      </aside>
    );
  }
}

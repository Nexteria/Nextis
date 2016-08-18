import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { FormattedMessage, defineMessages } from 'react-intl';

import './AppSidebar.scss';


const messages = defineMessages({
  studies: {
    defaultMessage: 'Studies',
    id: 'app.sidebar.links.studies',
  },
  network: {
    defaultMessage: 'Network',
    id: 'app.sidebar.links.network',
  },
  contacts: {
    defaultMessage: 'Contacts',
    id: 'app.sidebar.links.contacts',
  },
  users: {
    defaultMessage: 'Users',
    id: 'app.sidebar.links.users',
  },
  events: {
    defaultMessage: 'Events',
    id: 'app.sidebar.links.events',
  },
  createEvent: {
    defaultMessage: 'Create event',
    id: 'app.sidebar.links.createEvent',
  },
  adminSection: {
    defaultMessage: 'Admin section',
    id: 'app.sidebar.links.adminSection',
  },
  locations: {
    defaultMessage: 'Locations',
    id: 'app.sidebar.links.locations',
  },
  userGroups: {
    defaultMessage: 'User groups',
    id: 'app.sidebar.links.userGroups',
  },
  roles: {
    defaultMessage: 'Roles',
    id: 'app.sidebar.links.roles',
  },
  payments: {
    defaultMessage: 'Payments',
    id: 'app.sidebar.links.payments',
  },
});


export default class AppSideBar extends Component {

  static propTypes = {
    viewer: PropTypes.object.isRequired,
    hasPermission: PropTypes.func.isRequired,
  };

  render() {
    const { hasPermission } = this.props;

    return (
      <aside className="main-sidebar">
        <section className="sidebar">
          <ul className="sidebar-menu">
            <li className="header"><FormattedMessage {...messages.studies} /></li>
            <li>
              <Link to="/events">
                <span><FormattedMessage {...messages.events} /></span>
              </Link>
            </li>
            <li className="header"><FormattedMessage {...messages.network} /></li>
            <li>
              <Link to="/contacts">
                <i className="fa fa-users text-green"></i>
                <span><FormattedMessage {...messages.contacts} /></span>
              </Link>
            </li>

            {hasPermission('view_admin_section') ?
              <div className="admin-section">
                <li className="admin-header"><FormattedMessage {...messages.adminSection} /></li>
                <li>
                  <Link to="/admin/userGroups">
                    <span><FormattedMessage {...messages.userGroups} /></span>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/users">
                    <span><FormattedMessage {...messages.users} /></span>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/roles">
                    <span><FormattedMessage {...messages.roles} /></span>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/events">
                    <span><FormattedMessage {...messages.events} /></span>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/nxLocations">
                    <span><FormattedMessage {...messages.locations} /></span>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/payments">
                    <span><FormattedMessage {...messages.payments} /></span>
                  </Link>
                </li>
              </div>
              : ''
            }
          </ul>
        </section>
      </aside>
    );
  }
}

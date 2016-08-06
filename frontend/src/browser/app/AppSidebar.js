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
  createUser: {
    defaultMessage: 'Create user',
    id: 'app.sidebar.links.createUser',
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
  createUserGroup: {
    defaultMessage: 'Create user group',
    id: 'app.sidebar.links.createUserGroup',
  },
  places: {
    defaultMessage: 'Places',
    id: 'app.sidebar.links.places',
  },
  createPlace: {
    defaultMessage: 'Create place',
    id: 'app.sidebar.links.createPlace',
  },
});


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

            <li className="admin-header"><FormattedMessage {...messages.adminSection} /></li>
            <li className="header"><FormattedMessage {...messages.users} /></li>
            <li>
              <Link to="/users/create">
                <i className="fa fa-plus text-green"></i>
                <span><FormattedMessage {...messages.createUser} /></span>
              </Link>
            </li>
            <li>
              <Link to="/users/groups/create">
                <i className="fa fa-plus text-green"></i>
                <span><FormattedMessage {...messages.createUserGroup} /></span>
              </Link>
            </li>
            <li className="header"><FormattedMessage {...messages.events} /></li>
            <li>
              <Link to="/events/create">
                <i className="fa fa-plus text-green"></i>
                <span><FormattedMessage {...messages.createEvent} /></span>
              </Link>
            </li>
            <li className="header"><FormattedMessage {...messages.places} /></li>
            <li>
              <Link to="/locations/create">
                <i className="fa fa-plus text-green"></i>
                <span><FormattedMessage {...messages.createPlace} /></span>
              </Link>
            </li>
          </ul>
        </section>
      </aside>
    );
  }
}

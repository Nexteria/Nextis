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
    defaultMessage: 'Study payments',
    id: 'app.sidebar.links.payments',
  },
  hostedEvents: {
    defaultMessage: 'Hosted events',
    id: 'app.sidebar.links.hostedEvents',
  },
  important: {
    defaultMessage: 'Important',
    id: 'app.sidebar.links.important',
  },
  activityPoints: {
    defaultMessage: 'Activity points',
    id: 'app.sidebar.links.activityPoints',
  },
  other: {
    defaultMessage: 'Other',
    id: 'app.sidebar.links.other',
  },
  studiesAdministration: {
    defaultMessage: 'Administrácia štúdia',
    id: 'app.sidebar.links.studiesAdministration',
  },
  systemAdministration: {
    defaultMessage: 'Administrácia systému',
    id: 'app.sidebar.links.systemAdministration',
  },
  students: {
    defaultMessage: 'Študenti',
    id: 'app.sidebar.links.students',
  },
  semesters: {
    defaultMessage: 'Semestre',
    id: 'app.sidebar.links.semesters',
  },
});

const styles = {
  activeLinkStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#00a65a',
    fontWeight: 'bold',
  }
};


export default class AppSideBar extends Component {

  static propTypes = {
    viewer: PropTypes.object.isRequired,
    hasPermission: PropTypes.func.isRequired,
    rolesList: PropTypes.object.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    rolesData: PropTypes.object,
  };

  render() {
    const { viewer, rolesList, hasPermission, toggleSidebar, rolesData } = this.props;

    const isStudent = viewer.roles.includes(rolesList.get('STUDENT').id);

    return (
      <aside className="main-sidebar" onClick={toggleSidebar}>
        <section className="sidebar">
          <ul className="sidebar-menu">
            <li className="header">
              <i className="fa fa-briefcase"></i>
              <FormattedMessage {...messages.studies} /></li>
            <li>
              <Link activeStyle={styles.activeLinkStyle} to="/events">
                <i className="fa fa-calendar-o"></i>
                <span><FormattedMessage {...messages.events} /></span>
              </Link>
            </li>
            {isStudent ?
              <li>
                <Link activeStyle={styles.activeLinkStyle} to="/points">
                  <i className="fa fa-file-text-o"></i>
                  <span><FormattedMessage {...messages.activityPoints} /></span>
                </Link>
              </li>
              : null
            }
            {isStudent ?
              <li>
                <Link activeStyle={styles.activeLinkStyle} to="/payments">
                  <i className="fa fa-money text-green"></i>
                  <span><FormattedMessage {...messages.payments} /></span>
                </Link>
              </li>
              : null
            }
            {isStudent && rolesData.get('student') && (rolesData.getIn(['student', 'guideId']) || rolesData.getIn(['student', 'guidesOptions']).length) ?
              <li>
                <Link activeStyle={styles.activeLinkStyle} to="/guides">
                  <i className="fa fa-bank"></i>
                  <span>Guide</span>
                  <small className="label pull-right bg-green">
                    NEW
                  </small>
                </Link>
              </li>
              : null
            }
            {viewer.hostedEvents.size > 0 ?
              <li>
                <Link activeStyle={styles.activeLinkStyle} to="/host/events">
                  <i className="fa fa-support"></i>
                  <span><FormattedMessage {...messages.hostedEvents} /></span>
                  <small className="label pull-right bg-red">
                    <FormattedMessage {...messages.important} />
                  </small>
                </Link>
              </li>
              : ''
            }
            <li>
              <Link activeStyle={styles.activeLinkStyle} to="/contacts">
                <i className="fa fa-phone"></i>
                <span><FormattedMessage {...messages.contacts} /></span>
              </Link>
            </li>
            {hasPermission('view_admin_section') ?
              <div className="admin-section">
                <li className="header">
                  <i className="fa fa-university"></i>
                  <FormattedMessage {...messages.studiesAdministration} />
                </li>
                <li>
                  <Link
                    activeStyle={styles.activeLinkStyle}
                    to="/admin/events/category/afterSignInOpening"
                  >
                    <i className="fa fa-calendar"></i>
                    <span><FormattedMessage {...messages.events} /></span>
                  </Link>
                </li>
                <li>
                  <Link activeStyle={styles.activeLinkStyle} to="/admin/students">
                    <i className="fa fa-graduation-cap"></i>
                    <span><FormattedMessage {...messages.students} /></span>
                  </Link>
                </li>
                <li>
                  <Link activeStyle={styles.activeLinkStyle} to="/admin/semesters">
                    <i className="fa fa-book"></i>
                    <span><FormattedMessage {...messages.semesters} /></span>
                  </Link>
                </li>
                <li>
                  <Link activeStyle={styles.activeLinkStyle} to="/admin/payments">
                    <i className="fa fa-eur"></i>
                    <span><FormattedMessage {...messages.payments} /></span>
                  </Link>
                </li>

                <li className="header">
                  <i className="fa fa-gears"></i>
                  <FormattedMessage {...messages.systemAdministration} />
                </li>
                <li>
                  <Link activeStyle={styles.activeLinkStyle} to="/admin/guides">
                    <i className="fa fa-bank"></i>
                    <span>Guides</span>
                  </Link>
                </li>
                <li>
                  <Link activeStyle={styles.activeLinkStyle} to="/admin/userGroups">
                    <i className="fa fa-group"></i>
                    <span><FormattedMessage {...messages.userGroups} /></span>
                  </Link>
                </li>
                <li>
                  <Link activeStyle={styles.activeLinkStyle} to="/admin/users">
                    <i className="fa fa-user"></i>
                    <span><FormattedMessage {...messages.users} /></span>
                  </Link>
                </li>
                <li>
                  <Link activeStyle={styles.activeLinkStyle} to="/admin/roles">
                    <i className="fa fa-legal"></i>
                    <span><FormattedMessage {...messages.roles} /></span>
                  </Link>
                </li>
                <li>
                  <Link activeStyle={styles.activeLinkStyle} to="/admin/nxLocations">
                    <i className="fa fa-home"></i>
                    <span><FormattedMessage {...messages.locations} /></span>
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

import './App.scss';
import './toastr.scss';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { locationShape } from 'react-router';
import moment from 'moment';
import 'react-progress-bar-plus/lib/progress-bar.css';
import ProgressBar from 'react-progress-bar-plus';

import * as usersActions from '../../common/users/actions';
import * as eventsActions from '../../common/events/actions';
import * as locationsActions from '../../common/nxLocations/actions';
import favicon from '../../common/app/favicon';
import start from '../../common/app/start';
import AppSidebar from './AppSidebar';
import Header from './Header';
import Footer from './Footer';
import PrivacyPolicyDialog from '../users/PrivacyPolicyDialog';

// v4-alpha.getbootstrap.com/getting-started/introduction/#starter-template
const bootstrap4Metas = [
  { charset: 'utf-8' },
  {
    name: 'viewport',
    content: 'width=device-width, initial-scale=1, shrink-to-fit=no'
  },
  {
    'http-equiv': 'x-ua-compatible',
    content: 'ie=edge'
  }
];

class App extends Component {

  static propTypes = {
    children: PropTypes.object,
    currentLocale: PropTypes.string.isRequired,
    location: locationShape,
    viewer: PropTypes.object,
    users: PropTypes.object,
    loadUsers: PropTypes.func.isRequired,
    loadUserGroups: PropTypes.func.isRequired,
    loadRolesList: PropTypes.func.isRequired,
    loadStudentLevelsList: PropTypes.func.isRequired,
    loadEventList: PropTypes.func.isRequired,
    loadLocationsList: PropTypes.func.isRequired,
    loading: PropTypes.number.isRequired,
    events: PropTypes.object,
    hasPermission: PropTypes.func.isRequired,
    rolesList: PropTypes.object,
  };

  componentWillMount() {
    const { loadUsers, currentLocale, loadLocationsList, loadEventList, loadRolesList, loadStudentLevelsList, loadUserGroups } = this.props;

    loadUsers();
    loadUserGroups();
    loadRolesList();
    loadEventList();
    loadStudentLevelsList();
    loadLocationsList();
    moment.locale(currentLocale);
  }

  render() {
    const { children, isMobileSidebarOpen, loading, hasPermission, currentLocale, rolesList, location, events, viewer, users } = this.props;

    if (!viewer || users === null || events === null || !rolesList) {
      return <div></div>;
    }

    return (
      <div className={`${isMobileSidebarOpen ? 'sidebar-open' : ''} wrapper`}>
        {loading > 0 ?
          <ProgressBar className="loading-bar" percent={0} />
          :''
        }
        <Helmet
          htmlAttributes={{ lang: currentLocale }}
          titleTemplate="%s - Nexteria IS"
          meta={[
            ...bootstrap4Metas,
            {
              name: 'description',
              content: 'Nexteria IT system'
            },
            ...favicon.meta
          ]}
          link={[
            ...favicon.link
          ]}
        />
        {/* Pass location to ensure header active links are updated. */}
        <Header {...{ viewer }} location={location} />
        <AppSidebar {...{ viewer, hasPermission }} ref="main-footer" />
        <div className="content-wrapper">
          {children}
        </div>
        {viewer.confirmedPrivacyPolicy ?
          ''
        :
          <PrivacyPolicyDialog />
        }
        <Footer />
      </div>
    );
  }

}

App = start(App);

export default connect(state => ({
  currentLocale: state.intl.currentLocale,
  viewer: state.users.viewer,
  events: state.events.events,
  users: state.users.users,
  loading: state.app.loading,
  isMobileSidebarOpen: state.app.isMobileSidebarOpen,
  rolesList: state.users.rolesList,
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), { ...usersActions, ...eventsActions, ...locationsActions })(App);

import Dashboard from 'views/Dashboard/Dashboard';
import Events from 'views/Events/Events';
import Contacts from 'views/Contacts/Contacts';
import ActivityPoints from 'views/ActivityPoints/ActivityPoints';
import Payments from 'views/Payments/Payments';
import Profile from 'views/Profile/Profile';
import SkillSearch from 'views/Skills/SkillSearch/SkillSearch';

import AdminEvents from 'views/Admin/Events/EventsContainer';
import AdminStudents from 'views/Admin/Students/StudentsContainer';
import AdminLocations from 'views/Admin/Locations/LocationsContainer';

// @material-ui/icons
import DashboardIcon from '@material-ui/icons/Dashboard';
import Accessibility from '@material-ui/icons/Accessibility';
import CardTravel from '@material-ui/icons/CardTravel';
import Assignment from '@material-ui/icons/Assignment';
import HomeIcon from '@material-ui/icons/Home';
import ContactsIcon from '@material-ui/icons/Contacts';
import SkillSearchIcon from '@material-ui/icons/Search';

const dashRoutes = [
  {
    path: '/dashboard',
    name: 'Prehľad',
    icon: DashboardIcon,
    component: Dashboard,
    showInMenu: true,
  },
  {
    path: '/my-profile',
    name: 'Môj profil',
    component: Profile,
    showInMenu: false
  },
  {
    path: '/events',
    name: 'Eventy',
    state: 'openEvents',
    icon: CardTravel,
    component: Events,
    showInMenu: true
  },
  {
    path: '/activity-points/:semesterId?',
    baseLink: '/activity-points',
    name: 'Aktivity body',
    state: 'openActivityPoints',
    icon: Accessibility,
    component: ActivityPoints,
    showInMenu: true
  },
  {
    path: '/payments',
    name: 'Členské',
    state: 'openPayments',
    icon: Assignment,
    component: Payments,
    showInMenu: true
  },
  {
    path: '/contacts',
    name: 'Kontakty',
    state: 'openContacts',
    icon: ContactsIcon,
    component: Contacts,
    showInMenu: true
  },
  {
    path: '/skills',
    name: 'Skills Search',
    state: 'openSkills',
    icon: SkillSearchIcon,
    component: SkillSearch,
    showInMenu: true
  },
  {
    path: '/admin/events',
    name: 'Eventy',
    state: 'openAdminEvents',
    icon: CardTravel,
    component: AdminEvents,
    showInMenu: true,
    isAdmin: true,
  },
  {
    path: '/admin/students',
    name: 'Študenti',
    state: 'openAdminStudents',
    icon: Accessibility,
    component: AdminStudents,
    showInMenu: true,
    isAdmin: true,
  },
  {
    path: '/admin/locations',
    name: 'Miesta',
    state: 'openAdminLocations',
    icon: HomeIcon,
    component: AdminLocations,
    showInMenu: true,
    isAdmin: true,
  },
];
export default dashRoutes;

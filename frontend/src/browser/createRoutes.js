import React from 'react';
import { Route } from 'react-router';


import App from './app/App.react';
import NotFound from './notfound/NotFoundPage.react';
import Settings from './users/SettingsPage.react';
import CreateUserPage from './users/CreateUserPage';
import CreateEventPage from './events/CreateEventPage';
import EditUserGroup from './users/EditUserGroup';
import CreateLocationDialog from './nxLocations/CreateLocationDialog';
import ContactList from './users/ContactList';
import Payments from './users/Payments';
import UserGroupsPage from './users/UserGroupsPage';
import EditUser from './users/EditUser';
import UsersPage from './users/UsersPage';
import EditEvent from './events/EditEvent';
import EventsPage from './events/EventsPage';
import EventLoginDialog from './events/EventLoginDialog';
import ActivityPointsPage from './activityPoints/ActivityPointsPage';
import AdminApp from './app/AdminApp';
import UserEventsPage from './events/usersSection/EventsPage';
import EventAttendeesDialog from './events/EventAttendeesDialog';
import LocationsPage from './nxLocations/LocationsPage';
import RolesPage from './users/roles/RolesPage';
import EditRole from './users/roles/EditRole';
import PaymentsPage from './payments/PaymentsPage';
import UnassociatedPaymentsDialog from './payments/UnassociatedPaymentsDialog';
import UsersPaymentsDialog from './payments/UsersPaymentsDialog';
import HostedEventsPage from './events/HostedEventsPage';
import EventAttendanceDialog from './events/EventAttendanceDialog';
import EventEmailsDialog from './events/EventEmailsDialog';
import UserProfileDialog from './users/UserProfileDialog'

export default function createRoutes() {
  return (
    <Route component={App} path="/">
      <Route component={UserEventsPage} path="/events" />
      <Route component={EventAttendeesDialog} path="/events/:eventId/attendees" />
      <Route component={UserEventsPage} path="/events/:eventId">
        <Route component={EventLoginDialog} path="login" />
      </Route>
      <Route component={ActivityPointsPage} path="/points" />
      <Route component={ContactList} path="contacts" />
      <Route component={Payments} path="payments" />
      <Route component={Settings} path="/users/me/settings" />
      <Route component={HostedEventsPage} path="host/events" />
      <Route component={EventAttendanceDialog} path="host/events/:eventId" />
      <Route component={UserProfileDialog} path="users/:userId" />

      <Route component={AdminApp} path="admin">
        <Route component={UsersPage} path="users" />
        <Route component={CreateUserPage} path="users/create" />
        <Route component={EditUser} path="users/:userId" />
        <Route component={ActivityPointsPage} path="users/:userId/points" />
        <Route component={UsersPaymentsDialog} path="users/:userId/payments" />

        <Route component={EditUserGroup} path="users/groups/create" />
        <Route component={UserGroupsPage} path="userGroups">
          <Route component={EditUserGroup} path=":groupId" />
        </Route>

        <Route component={EventsPage} path="events" />
        <Route component={EditEvent} path="events/:eventId" />

        <Route component={EventEmailsDialog} path="events/:eventId/emails" />
        <Route component={CreateEventPage} path="events/create" />

        <Route component={RolesPage} path="roles" />
        <Route component={EditRole} path="roles/create" />
        <Route component={EditRole} path="roles/:roleId" />

        <Route component={UnassociatedPaymentsDialog} path="payments/unassociated" />
        <Route component={PaymentsPage} path="payments" />

        <Route component={LocationsPage} path="nxLocations" />
        <Route component={CreateLocationDialog} path="nxLocations/create" />
        <Route component={CreateLocationDialog} path="nxLocations/:locationId" />
      </Route>
      <Route component={NotFound} path="*" />
    </Route>
  );
}

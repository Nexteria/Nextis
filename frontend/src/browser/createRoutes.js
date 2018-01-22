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
import EventsDefaultSettings from './events/EventsDefaultSettings';
import Events from './events/Events';
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
import UserProfileDialog from './users/UserProfileDialog';
import TuitionFeesSummaryExportDialog from './payments/Exports/TuitionFeesSummaryExportDialog';
import ImportPaymentsDialog from './payments/Imports/ImportPaymentsDialog';
import AddPaymentsDialog from './payments/AddPaymentsDialog';
import SemestersPage from './administration/semesters/SemestersPage';
import NewSemesterDialog from './administration/semesters/NewSemesterDialog';
import StudentsPage from './administration/students/StudentsPage';
import GuidesPage from './administration/guides/GuidesPage';
import EditGuideFieldDialog from './administration/guides/EditGuideFieldDialog';
import EditGuideDialog from './administration/guides/EditGuideDialog';
import GuideProfilePageDialog from './administration/guides/GuideProfilePageDialog';
import StudentProfilePage from './administration/students/StudentProfilePage';
import BeforeEventQuestionnaire from './events/usersSection/BeforeEventQuestionnaire';

export default function createRoutes() {
  return (
    <Route component={App} path="/">
      <Route component={UserEventsPage} path="/events" />
      <Route component={EventAttendeesDialog} path="/events/:eventId/attendees" />
      <Route component={UserEventsPage} path="/events/:eventId">
        <Route component={EventLoginDialog} path="login" />
        <Route component={BeforeEventQuestionnaire} path="questionnaire" />
      </Route>
      <Route component={ActivityPointsPage} path="/points" />
      <Route component={ContactList} path="contacts" />
      <Route component={Payments} path="payments" />
      <Route component={Settings} path="/users/me/settings" />
      <Route component={HostedEventsPage} path="host/events" />
      <Route component={EventAttendanceDialog} path="host/events/:eventId/terms/:termId" />
      <Route component={UserProfileDialog} path="users/:userId" />

      <Route component={AdminApp} path="admin">
        <Route component={UsersPage} path="users" />
        <Route component={SemestersPage} path="semesters">
          <Route component={NewSemesterDialog} path="new" />
        </Route>
        <Route component={StudentsPage} path="students">
          <Route component={StudentProfilePage} path=":studentId(/:tab)(/:modelId)" />
        </Route>
        <Route component={CreateUserPage} path="users/create" />
        <Route component={EditUser} path="users/:userId" />
        <Route component={ActivityPointsPage} path="users/:userId/points" />
        <Route component={UsersPaymentsDialog} path="users/:userId/payments" />

        <Route component={EditUserGroup} path="users/groups/create" />
        <Route component={UserGroupsPage} path="userGroups">
          <Route component={EditUserGroup} path=":groupId" />
        </Route>

        <Route component={GuidesPage} path="guides">
          <Route component={EditGuideFieldDialog} path="fields/add" />
          <Route component={EditGuideFieldDialog} path="fields/:fieldId" />
          <Route component={EditGuideDialog} path="add" />
          <Route component={EditGuideDialog} path=":guideId" />
          <Route component={GuideProfilePageDialog} path=":guideId/profile" />
        </Route>

        <Route component={EventsPage} path="events">
          <Route component={EventsDefaultSettings} path="settings" />
          <Route component={Events} path="category/:category" />
        </Route>
        <Route component={EditEvent} path="events/:eventId" />

        <Route component={EventEmailsDialog} path="events/:eventId/emails" />
        <Route component={CreateEventPage} path="events/create" />

        <Route component={RolesPage} path="roles" />
        <Route component={EditRole} path="roles/create" />
        <Route component={EditRole} path="roles/:roleId" />

        <Route component={UnassociatedPaymentsDialog} path="payments/unassociated" />
        <Route component={TuitionFeesSummaryExportDialog} path="payments/exports/tuitionFeesSummary" />
        <Route component={ImportPaymentsDialog} path="payments/imports/payments" />
        <Route component={AddPaymentsDialog} path="payments/new" />
        <Route component={PaymentsPage} path="payments" />

        <Route component={LocationsPage} path="nxLocations" />
        <Route component={CreateLocationDialog} path="nxLocations/create" />
        <Route component={CreateLocationDialog} path="nxLocations/:locationId" />
      </Route>
      <Route component={NotFound} path="*" />
    </Route>
  );
}

import App from './app/App.react';
import NotFound from './notfound/NotFoundPage.react';
import React from 'react';
import Settings from './users/SettingsPage.react';
import CreateUserPage from './users/CreateUserPage';
import CreateEventPage from './events/CreateEventPage';
import { Route } from 'react-router';
import ContactList from './users/ContactList';

export default function createRoutes() {
  return (
    <Route component={App} path="/">
      <Route component={ContactList} path="contacts" />
      <Route component={Settings} path="/users/me/settings" />
      <Route component={CreateUserPage} path="/users/create" />
      <Route component={CreateEventPage} path="/events/create" />
      <Route component={NotFound} path="*" />
    </Route>
  );
}

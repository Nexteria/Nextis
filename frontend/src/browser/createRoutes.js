import App from './app/App.react';
import Me from './users/MePage.react';
import NotFound from './notfound/NotFoundPage.react';
import Profile from './users/ProfilePage.react';
import React from 'react';
import Settings from './users/SettingsPage.react';
import { Route } from 'react-router';
import ContactList from './users/ContactList';

export default function createRoutes() {
  return (
    <Route component={App} path="/">
      <Route component={ContactList} path="contacts" />
      <Route component={Me} path="me">
        <Route component={Profile} path="profile" />
        <Route component={Settings} path="settings" />
      </Route>
      <Route component={NotFound} path="*" />
    </Route>
  );
}

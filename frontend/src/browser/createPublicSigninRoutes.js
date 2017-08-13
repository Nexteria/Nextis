import React from 'react';
import { Route } from 'react-router';


import App from './app/PublicApp.react';
import EventLoginDialog from './events/EventLoginDialog';
import PublicSigninPage from './events/usersSection/public/PublicSigninPage';
import BeforeEventQuestionnaire from './events/usersSection/BeforeEventQuestionnaire';

export default function createRoutes() {
  return (
    <Route component={App} path="/">
      <Route component={PublicSigninPage} path="/nxEvents/:signInToken/:action" />
    </Route>
  );
}

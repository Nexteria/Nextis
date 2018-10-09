import React from 'react';

import { compose } from 'recompose';
import { Switch, Route, withRouter } from 'react-router-dom';

// core components
import GridContainer from 'components/Grid/GridContainer';

import NewEventForm from 'views/Admin/Events/NewEventForm';
import EventsList from 'views/Admin/Events/EventsList';
import EventDetails from 'views/Admin/Events/EventDetails';

class EventsContainer extends React.Component {
  render() {
    return (
      <GridContainer>
        <Switch>
          <Route
            path="/admin/events"
            exact
            component={EventsList}
          />
          <Route
            path="/admin/events/new"
            exact
            component={NewEventForm}
          />
          <Route
            path="/admin/events/:eventId"
            exact
            component={EventDetails}
          />
        </Switch>
      </GridContainer>
    );
  }
}

export default compose(
  withRouter,
)(EventsContainer);

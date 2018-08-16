import React from 'react';

import { compose } from 'recompose';
import { Route, withRouter } from 'react-router-dom';

// core components
import GridContainer from 'components/Grid/GridContainer';

import NewEventForm from 'views/Admin/Events/NewEventForm';
import EventsList from 'views/Admin/Events/EventsList';

class EventsContainer extends React.Component {
  render() {
    return (
      <GridContainer>
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
          path="/admin/events/:eventId/edit"
          exact
          component={null}
        />
      </GridContainer>
    );
  }
}

export default compose(
  withRouter,
)(EventsContainer);

import React from 'react';

import { compose } from 'recompose';
import { Route, withRouter } from 'react-router-dom';

// core components
import GridContainer from 'components/Grid/GridContainer';

import LocationsList from 'views/Admin/Locations/LocationsList';

class LocationsContainer extends React.Component {
  render() {
    return (
      <GridContainer>
        <Route
          path="/admin/locations"
          component={LocationsList}
        />
      </GridContainer>
    );
  }
}

export default compose(
  withRouter,
)(LocationsContainer);

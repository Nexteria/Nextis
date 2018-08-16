import React from 'react';

import { compose } from 'recompose';
import { Route, withRouter } from 'react-router-dom';

// core components
import GridContainer from 'components/Grid/GridContainer';
import ItemGrid from 'components/Grid/ItemGrid';

import StudentList from 'views/Admin/Students/StudentsList';

class StudentsContainer extends React.Component {
  render() {
    return (
      <GridContainer>
        <ItemGrid xs={12}>
          <Route
            path="/admin/students"
            exact
            component={StudentList}
          />
          <Route
            path="/admin/students/:studentId/edit"
            exact
            component={null}
          />
        </ItemGrid>
      </GridContainer>
    );
  }
}

export default compose(
  withRouter,
)(StudentsContainer);
